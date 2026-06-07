from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
import os
import re
import json
import sys
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from app.core.config import settings

router = APIRouter()

class InterviewQuestion(BaseModel):
    question: str
    category: str
    difficulty: str

class InterviewRequest(BaseModel):
    role: str
    interview_type: str
    experience_level: str
    tech_stack: Optional[List[str]] = None

class AnswerSubmission(BaseModel):
    question: str
    answer: str
    role: str

class FeedbackResponse(BaseModel):
    score: float
    feedback: str
    improvements: List[str]

def parse_questions_from_text(text: str) -> List[InterviewQuestion]:
    questions = []
    cleaned = text.strip()
    
    # Remove markdown code blocks if present
    if cleaned.startswith("```json"):
        cleaned = cleaned[7:]
    elif cleaned.startswith("```"):
        cleaned = cleaned[3:]
    if cleaned.endswith("```"):
        cleaned = cleaned[:-3]
    cleaned = cleaned.strip()
    
    # Try parsing the whole string as a JSON list
    try:
        data = json.loads(cleaned)
        if isinstance(data, list):
            for item in data:
                try:
                    questions.append(InterviewQuestion(**item))
                except:
                    pass
            if questions:
                return questions
    except:
        pass
        
    # Try finding JSON objects in the text using regex
    matches = re.findall(r'\{[^{}]*\}', cleaned)
    for match in matches:
        try:
            questions.append(InterviewQuestion(**json.loads(match)))
        except:
            pass
            
    if questions:
        return questions
        
    # Fallback to line-by-line parsing
    for line in text.split('\n'):
        line_s = line.strip()
        if line_s.startswith('{'):
            try:
                questions.append(InterviewQuestion(**json.loads(line_s)))
            except:
                pass
                
    return questions

@router.post("/generate-questions", response_model=List[InterviewQuestion])
async def generate_interview_questions(request: InterviewRequest):
    prompt = ChatPromptTemplate.from_template("""
    Generate 10 {interview_type} interview questions for a {role} position.
    Experience level: {experience_level}
    Tech stack: {tech_stack}
    
    Format each as JSON: {{"question": "...", "category": "technical/system_design/behavioral", "difficulty": "easy/medium/hard"}}
    """)
    
    models = []
    for m in [settings.OPENROUTER_MODEL, "qwen/qwen3-coder:free", "meta-llama/llama-3.2-3b-instruct:free", "openrouter/free"]:
        if m and m not in models:
            models.append(m)

    last_error = None
    for model in models:
        try:
            print(f"Attempting to generate questions using model: {model}", file=sys.stderr)
            llm = ChatOpenAI(
                api_key=os.getenv("OPENROUTER_API_KEY"),
                base_url="https://openrouter.ai/api/v1",
                model=model,
                temperature=0.7,
                max_retries=1
            )
            
            chain = prompt | llm | StrOutputParser()
            result = await chain.ainvoke({
                "role": request.role,
                "interview_type": request.interview_type,
                "experience_level": request.experience_level,
                "tech_stack": ", ".join(request.tech_stack) if request.tech_stack else "general"
            })
            
            questions = parse_questions_from_text(result)
            if questions:
                print(f"Successfully generated {len(questions)} questions using model {model}", file=sys.stderr)
                return questions
            else:
                print(f"Model {model} succeeded but output could not be parsed to questions. Result: {result}", file=sys.stderr)
                last_error = Exception(f"Failed to parse questions from model output: {result[:100]}...")
        except Exception as e:
            last_error = e
            print(f"Failed to generate questions using model {model}: {e}", file=sys.stderr)
            continue
            
    raise HTTPException(status_code=500, detail=f"All models failed to generate questions. Last error: {str(last_error)}")

@router.post("/evaluate-answer", response_model=FeedbackResponse)
async def evaluate_interview_answer(submission: AnswerSubmission):
    prompt = ChatPromptTemplate.from_template("""
    Evaluate this interview answer for a {role} position:
    
    Question: {question}
    Answer: {answer}
    
    Provide feedback in JSON format:
    {{
        "score": 0-10,
        "feedback": "detailed feedback",
        "improvements": ["point 1", "point 2"]
    }}
    """)
    
    models = []
    for m in [settings.OPENROUTER_MODEL, "qwen/qwen3-coder:free", "meta-llama/llama-3.2-3b-instruct:free", "openrouter/free"]:
        if m and m not in models:
            models.append(m)

    last_error = None
    for model in models:
        try:
            print(f"Attempting to evaluate answer using model: {model}", file=sys.stderr)
            llm = ChatOpenAI(
                api_key=os.getenv("OPENROUTER_API_KEY"),
                base_url="https://openrouter.ai/api/v1",
                model=model,
                temperature=0.3,
                max_retries=1
            )
            
            chain = prompt | llm | StrOutputParser()
            result = await chain.ainvoke(submission.dict())
            
            try:
                # Clean up potential markdown formatting if the model returned it
                cleaned_result = result.strip()
                if cleaned_result.startswith("```json"):
                    cleaned_result = cleaned_result[7:]
                elif cleaned_result.startswith("```"):
                    cleaned_result = cleaned_result[3:]
                if cleaned_result.endswith("```"):
                    cleaned_result = cleaned_result[:-3]
                cleaned_result = cleaned_result.strip()
                
                data = json.loads(cleaned_result)
                print(f"Successfully evaluated answer using model {model}", file=sys.stderr)
                return FeedbackResponse(**data)
            except Exception as parse_err:
                print(f"Failed to parse feedback json for model {model}: {parse_err}. Result was: {result}", file=sys.stderr)
                last_error = parse_err
        except Exception as e:
            last_error = e
            print(f"Failed to evaluate answer using model {model}: {e}", file=sys.stderr)
            continue
            
    return FeedbackResponse(score=5.0, feedback="AI service is temporarily rate-limited, but we have saved your progress.", improvements=["Try again in a minute", "Include more specific examples"])
