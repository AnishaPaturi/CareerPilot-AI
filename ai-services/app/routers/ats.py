from fastapi import APIRouter, HTTPException, UploadFile, File
from pydantic import BaseModel
from typing import List, Optional, Dict
import os
import json
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser, StrOutputParser
import pdfplumber
import tempfile
from app.core.config import settings

router = APIRouter()

class ATSScore(BaseModel):
    overall_score: int
    content_score: int
    format_score: int
    keyword_score: int

class ResumeAnalysis(BaseModel):
    ats_score: ATSScore
    skills_match: Dict[str, bool]
    missing_skills: List[str]
    suggestions: List[str]
    summary: str
    extracted_text: Optional[str] = None

class JobMatchRequest(BaseModel):
    resume_text: str
    job_description: str

class JobMatchResponse(BaseModel):
    match_percentage: int
    matched_skills: List[str]
    missing_skills: List[str]
    suggestions: List[str]

def extract_text_from_pdf(file_path: str) -> str:
    text = ""
    with pdfplumber.open(file_path) as pdf:
        for page in pdf.pages:
            text += page.extract_text() or ""
    return text

def sanitize_analysis_result(result: dict) -> dict:
    import re
    sanitized = {}
    
    ats_score = result.get("ats_score", {})
    if not isinstance(ats_score, dict):
        ats_score = {}
        
    def coerce_to_int(val, default=0) -> int:
        if isinstance(val, (int, float)):
            return int(val)
        if isinstance(val, str):
            val = val.split('/')[0].replace('%', '').strip()
            try:
                return int(val)
            except ValueError:
                match = re.search(r'\d+', val)
                if match:
                    return int(match.group())
        return default

    sanitized_score = {
        "overall_score": coerce_to_int(ats_score.get("overall_score"), 50),
        "content_score": coerce_to_int(ats_score.get("content_score"), 50),
        "format_score": coerce_to_int(ats_score.get("format_score"), 50),
        "keyword_score": coerce_to_int(ats_score.get("keyword_score"), 50)
    }
    sanitized["ats_score"] = sanitized_score

    skills_match = result.get("skills_match", {})
    sanitized_skills = {}
    if isinstance(skills_match, dict):
        for k, v in skills_match.items():
            if isinstance(v, bool):
                sanitized_skills[str(k)] = v
            elif isinstance(v, str):
                val_lower = v.lower()
                sanitized_skills[str(k)] = val_lower in ("true", "yes", "found", "y", "1")
            elif isinstance(v, (int, float)):
                sanitized_skills[str(k)] = bool(v)
            else:
                sanitized_skills[str(k)] = False
    elif isinstance(skills_match, list):
        for item in skills_match:
            sanitized_skills[str(item)] = True
    sanitized["skills_match"] = sanitized_skills

    missing = result.get("missing_skills", [])
    if isinstance(missing, list):
        sanitized["missing_skills"] = [str(x) for x in missing]
    else:
        sanitized["missing_skills"] = []

    suggestions = result.get("suggestions", [])
    if isinstance(suggestions, list):
        sanitized["suggestions"] = [str(x) for x in suggestions]
    else:
        sanitized["suggestions"] = []

    summary = result.get("summary", "")
    sanitized["summary"] = str(summary) if summary else "No summary provided."
    
    return sanitized

def sanitize_job_match(result: dict) -> dict:
    import re
    sanitized = {}
    
    def coerce_to_int(val, default=0) -> int:
        if isinstance(val, (int, float)):
            return int(val)
        if isinstance(val, str):
            val = val.split('/')[0].replace('%', '').strip()
            try:
                return int(val)
            except ValueError:
                match = re.search(r'\d+', val)
                if match:
                    return int(match.group())
        return default
        
    sanitized["match_percentage"] = coerce_to_int(result.get("match_percentage"), 0)
    
    matched = result.get("matched_skills", [])
    sanitized["matched_skills"] = [str(x) for x in matched] if isinstance(matched, list) else []
    
    missing = result.get("missing_skills", [])
    sanitized["missing_skills"] = [str(x) for x in missing] if isinstance(missing, list) else []
    
    suggestions = result.get("suggestions", [])
    sanitized["suggestions"] = [str(x) for x in suggestions] if isinstance(suggestions, list) else []
    
    return sanitized

@router.post("/analyze", response_model=ResumeAnalysis)
async def analyze_resume(file: UploadFile = File(...)):
    contents = await file.read()
    
    # Use a secure, cross-platform temporary file
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp_file:
        tmp_file.write(contents)
        tmp_file_path = tmp_file.name
    
    try:
        resume_text = extract_text_from_pdf(tmp_file_path)
    except Exception:
        resume_text = contents.decode('utf-8', errors='ignore')
    finally:
        try:
            if os.path.exists(tmp_file_path):
                os.remove(tmp_file_path)
        except Exception:
            pass
    
    parser = JsonOutputParser()
    
    prompt = ChatPromptTemplate.from_template("""
    Analyze this resume and provide ATS evaluation:
    
    Resume: {resume_text}
    
    Provide JSON with:
    - ats_score: {{overall_score, content_score, format_score, keyword_score}}
    - skills_match: {{skill: found}}
    - missing_skills: []
    - suggestions: []
    - summary: "brief analysis"
    
    Focus on: keywords, formatting, action verbs, quantifiable achievements
    """)
    
    models = []
    for m in [settings.OPENROUTER_MODEL, "google/gemma-4-31b-it:free", "google/gemma-4-26b-a4b-it:free", "poolside/laguna-m.1:free", "liquid/lfm-2.5-1.2b-thinking:free", "meta-llama/llama-3.2-3b-instruct:free", "openrouter/free"]:
        if m and m not in models:
            models.append(m)
            
    last_error = None
    for model in models:
        try:
            llm = ChatOpenAI(
                api_key=os.getenv("OPENROUTER_API_KEY"),
                base_url="https://openrouter.ai/api/v1",
                model=model,
                temperature=0.3,
                max_retries=1
            )
            chain = prompt | llm | parser
            result = chain.invoke({"resume_text": resume_text[:3000]})
            
            # Sanitize result to match Pydantic schema types and structure
            sanitized = sanitize_analysis_result(result)
            sanitized["extracted_text"] = resume_text
            return ResumeAnalysis(**sanitized)
        except Exception as e:
            last_error = e
            import sys
            print(f"Failed resume analysis using model {model}: {e}", file=sys.stderr)
            continue
            
    import traceback
    import sys
    print("ERROR during resume analysis (all models failed):", file=sys.stderr)
    traceback.print_exc()
    raise HTTPException(
        status_code=500,
        detail=f"Resume analysis failed. All models failed. Last error: {str(last_error)}"
    )

@router.post("/match-job", response_model=JobMatchResponse)
async def match_resume_to_job(request: JobMatchRequest):
    prompt = ChatPromptTemplate.from_template("""
    Compare resume against job description and calculate match:
    
    Resume: {resume_text}
    Job Description: {job_description}
    
    Return JSON: {{match_percentage, matched_skills, missing_skills, suggestions}}
    """)
    
    models = []
    for m in [settings.OPENROUTER_MODEL, "google/gemma-4-31b-it:free", "google/gemma-4-26b-a4b-it:free", "poolside/laguna-m.1:free", "liquid/lfm-2.5-1.2b-thinking:free", "meta-llama/llama-3.2-3b-instruct:free", "openrouter/free"]:
        if m and m not in models:
            models.append(m)
            
    last_error = None
    for model in models:
        try:
            llm = ChatOpenAI(
                api_key=os.getenv("OPENROUTER_API_KEY"),
                base_url="https://openrouter.ai/api/v1",
                model=model,
                temperature=0.3,
                max_retries=1
            )
            chain = prompt | llm | JsonOutputParser()
            result = chain.invoke(request.dict())
            
            # Sanitize result to match Pydantic schema types and structure
            sanitized = sanitize_job_match(result)
            return JobMatchResponse(**sanitized)
        except Exception as e:
            last_error = e
            import sys
            print(f"Failed resume matching using model {model}: {e}", file=sys.stderr)
            continue
            
    import traceback
    import sys
    print("ERROR during resume matching (all models failed):", file=sys.stderr)
    traceback.print_exc()
    raise HTTPException(
        status_code=500,
        detail=f"Resume matching failed. All models failed. Last error: {str(last_error)}"
    )

class RewriteRequest(BaseModel):
    section: Optional[str] = ""
    style: str = "professional"
    job_description: Optional[str] = None
    mode: str = "improve"  # "improve" or "scratch"

class ChatResumeRequest(BaseModel):
    resume_text: str
    question: str

@router.post("/rewrite")
async def rewrite_resume_section(request: RewriteRequest):
    models = []
    for m in [settings.OPENROUTER_MODEL, "google/gemma-4-31b-it:free", "google/gemma-4-26b-a4b-it:free", "poolside/laguna-m.1:free", "liquid/lfm-2.5-1.2b-thinking:free", "meta-llama/llama-3.2-3b-instruct:free", "openrouter/free"]:
        if m and m not in models:
            models.append(m)
            
    last_error = None
    for model in models:
        try:
            llm = ChatOpenAI(
                api_key=os.getenv("OPENROUTER_API_KEY"),
                base_url="https://openrouter.ai/api/v1",
                model=model,
                temperature=0.7,
                max_retries=1
            )
            
            if request.mode == "scratch":
                system_prompt = (
                    "You are an expert resume writer. Generate a comprehensive, professional, and ATS-friendly resume from scratch.\n\n"
                    "Job Description (Target Role):\n"
                    "{job_description}\n\n"
                    "Guidelines:\n"
                    "1. Tailor the resume specifically to the job description provided above, highlighting relevant skills and keywords.\n"
                    "2. Structure it with clear sections: Contact Info, Professional Summary, Work Experience (with bullet points using action verbs and placeholders for metrics like '[X]%'), Education, and Skills.\n"
                    "3. Use a clean, plain text markdown format."
                )
                prompt = ChatPromptTemplate.from_messages([
                    ("system", system_prompt),
                    ("human", "Generate a new resume based on the target job description.")
                ])
                chain = prompt | llm | StrOutputParser()
                result = chain.invoke({"job_description": request.job_description or "General Professional Resume Outline"})
            else:
                # mode == "improve"
                system_prompt = (
                    "You are an expert resume rewriter. Rewrite the following resume section to make it highly impactful, professional, and ATS-friendly.\n\n"
                    "Original Section:\n"
                    "{section}\n\n"
                )
                if request.job_description:
                    system_prompt += (
                        "Job Description (Target Role):\n"
                        "{job_description}\n\n"
                        "Strict Instructions:\n"
                        "Align the rewritten text specifically to match the requirements, skills, and key phrases found in the job description.\n\n"
                    )
                system_prompt += (
                    "Guidelines:\n"
                    "1. Improve action verbs, sentence structure, and make bullet points punchy.\n"
                    "2. Whenever possible, structure sentences to show achievement and impact (e.g. Accomplished [X] as measured by [Y] by doing [Z]).\n"
                    "3. Retain the core factual details from the original section but present them with maximum impact."
                )
                prompt = ChatPromptTemplate.from_messages([
                    ("system", system_prompt),
                    ("human", "Rewrite the resume section in a {style} style.")
                ])
                chain = prompt | llm | StrOutputParser()
                result = chain.invoke({
                    "section": request.section,
                    "style": request.style,
                    "job_description": request.job_description or ""
                })
                
            return {"rewritten": result}
        except Exception as e:
            last_error = e
            import sys
            print(f"Failed resume rewrite using model {model}: {e}", file=sys.stderr)
            continue
            
    import traceback
    import sys
    print("ERROR during resume rewriting (all models failed):", file=sys.stderr)
    traceback.print_exc()
    raise HTTPException(
        status_code=500,
        detail=f"Rewrite failed. All models failed. Last error: {str(last_error)}"
    )
        
    return {"rewritten": result}

@router.post("/chat")
async def chat_resume(request: ChatResumeRequest):
    prompt = ChatPromptTemplate.from_template("""
    You are an AI Resume Assistant. Help the user improve their resume.
    
    Resume Context: {resume_text}
    
    User Question: {question}
    """)
    
    models = []
    for m in [settings.OPENROUTER_MODEL, "google/gemma-4-31b-it:free", "google/gemma-4-26b-a4b-it:free", "poolside/laguna-m.1:free", "liquid/lfm-2.5-1.2b-thinking:free", "meta-llama/llama-3.2-3b-instruct:free", "openrouter/free"]:
        if m and m not in models:
            models.append(m)
            
    last_error = None
    for model in models:
        try:
            llm = ChatOpenAI(
                api_key=os.getenv("OPENROUTER_API_KEY"),
                base_url="https://openrouter.ai/api/v1",
                model=model,
                temperature=0.3,
                max_retries=1
            )
            chain = prompt | llm | StrOutputParser()
            result = chain.invoke({"resume_text": request.resume_text, "question": request.question})
            return {"answer": result}
        except Exception as e:
            last_error = e
            import sys
            print(f"Failed resume chat using model {model}: {e}", file=sys.stderr)
            continue
            
    import traceback
    import sys
    print("ERROR during resume chat (all models failed):", file=sys.stderr)
    traceback.print_exc()
    raise HTTPException(
        status_code=500,
        detail=f"Chat failed. All models failed. Last error: {str(last_error)}"
    )