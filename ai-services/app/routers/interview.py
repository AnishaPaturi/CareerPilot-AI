from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
import os
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

@router.post("/generate-questions", response_model=List[InterviewQuestion])
async def generate_interview_questions(request: InterviewRequest):
    llm = ChatOpenAI(
        api_key=os.getenv("OPENROUTER_API_KEY"),
        base_url="https://openrouter.ai/api/v1",
        model=settings.OPENROUTER_MODEL,
        temperature=0.7
    )
    
    prompt = ChatPromptTemplate.from_template("""
    Generate 10 {interview_type} interview questions for a {role} position.
    Experience level: {experience_level}
    Tech stack: {tech_stack}
    
    Format each as JSON: {{"question": "...", "category": "technical/system_design/behavioral", "difficulty": "easy/medium/hard"}}
    """)
    
    chain = prompt | llm | StrOutputParser()
    result = chain.invoke({
        "role": request.role,
        "interview_type": request.interview_type,
        "experience_level": request.experience_level,
        "tech_stack": ", ".join(request.tech_stack) if request.tech_stack else "general"
    })
    
    # Parse the result into list of questions
    import json
    questions = []
    for line in result.strip().split('\n'):
        if line.strip().startswith('{'):
            try:
                questions.append(InterviewQuestion(**json.loads(line)))
            except:
                pass
    
    return questions

@router.post("/evaluate-answer", response_model=FeedbackResponse)
async def evaluate_interview_answer(submission: AnswerSubmission):
    llm = ChatOpenAI(
        api_key=os.getenv("OPENROUTER_API_KEY"),
        base_url="https://openrouter.ai/api/v1",
        model=settings.OPENROUTER_MODEL,
        temperature=0.3
    )
    
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
    
    chain = prompt | llm | StrOutputParser()
    result = chain.invoke(submission.dict())
    
    import json
    try:
        data = json.loads(result)
        return FeedbackResponse(**data)
    except:
        return FeedbackResponse(score=5.0, feedback="Good attempt", improvements=["Be more specific"])