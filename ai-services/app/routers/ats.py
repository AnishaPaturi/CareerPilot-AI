from fastapi import APIRouter, HTTPException, UploadFile, File
from pydantic import BaseModel
from typing import List, Optional, Dict
import os
import json
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser, StrOutputParser
import pdfplumber

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

@router.post("/analyze", response_model=ResumeAnalysis)
async def analyze_resume(file: UploadFile = File(...)):
    llm = ChatOpenAI(
        api_key=os.getenv("OPENROUTER_API_KEY"),
        base_url="https://openrouter.ai/api/v1",
        model="google/gemini-2.0-flash-001",
        temperature=0.3
    )
    
    contents = await file.read()
    with open(f"/tmp/{file.filename}", "wb") as f:
        f.write(contents)
    
    try:
        resume_text = extract_text_from_pdf(f"/tmp/{file.filename}")
    except:
        resume_text = contents.decode('utf-8')
    
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
    
    chain = prompt | llm | parser
    result = chain.invoke({"resume_text": resume_text[:3000]})
    
    result["extracted_text"] = resume_text
    return ResumeAnalysis(**result)

@router.post("/match-job", response_model=JobMatchResponse)
async def match_resume_to_job(request: JobMatchRequest):
    llm = ChatOpenAI(
        api_key=os.getenv("OPENROUTER_API_KEY"),
        base_url="https://openrouter.ai/api/v1",
        model="google/gemini-2.0-flash-001",
        temperature=0.3
    )
    
    prompt = ChatPromptTemplate.from_template("""
    Compare resume against job description and calculate match:
    
    Resume: {resume_text}
    Job Description: {job_description}
    
    Return JSON: {{match_percentage, matched_skills, missing_skills, suggestions}}
    """)
    
    chain = prompt | llm | JsonOutputParser()
    result = chain.invoke(request.dict())
    
    return JobMatchResponse(**result)

class RewriteRequest(BaseModel):
    section: str
    style: str = "professional"

class ChatResumeRequest(BaseModel):
    resume_text: str
    question: str

@router.post("/rewrite")
async def rewrite_resume_section(request: RewriteRequest):
    llm = ChatOpenAI(
        api_key=os.getenv("OPENROUTER_API_KEY"),
        base_url="https://openrouter.ai/api/v1",
        model="google/gemini-2.0-flash-001",
        temperature=0.7
    )
    
    prompt = ChatPromptTemplate.from_template("""
    Rewrite this resume section to be more {style} and ATS-friendly:
    
    Original: {section}
    
    Make it more impactful with action verbs and quantifiable results.
    """)
    
    chain = prompt | llm | StrOutputParser()
    result = chain.invoke({"section": request.section, "style": request.style})
    
    return {"rewritten": result}

@router.post("/chat")
async def chat_resume(request: ChatResumeRequest):
    llm = ChatOpenAI(
        api_key=os.getenv("OPENROUTER_API_KEY"),
        base_url="https://openrouter.ai/api/v1",
        model="google/gemini-2.0-flash-001",
        temperature=0.3
    )
    
    prompt = ChatPromptTemplate.from_template("""
    You are an AI Resume Assistant. Help the user improve their resume.
    
    Resume Context: {resume_text}
    
    User Question: {question}
    """)
    
    chain = prompt | llm | StrOutputParser()
    result = chain.invoke({"resume_text": request.resume_text, "question": request.question})
    
    return {"answer": result}