from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import os
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from app.core.config import settings

router = APIRouter()

class DSAProfile(BaseModel):
    current_level: str
    target_company: str
    time_available: int
    weak_areas: List[str]

class RoadmapRequest(BaseModel):
    profile: DSAProfile
    days: int = 30

class DailyGoal(BaseModel):
    day: int
    date: str
    topic: str
    problems: List[str]
    estimated_time: int

class DSARoadmap(BaseModel):
    title: str
    duration_days: int
    daily_goals: List[DailyGoal]
    topics_sequence: List[str]

class ProblemRecommendation(BaseModel):
    title: str
    difficulty: str
    topic: str
    url: str
    reason: str

@router.post("/generate-roadmap", response_model=DSARoadmap)
async def generate_dsa_roadmap(request: RoadmapRequest):
    llm = ChatOpenAI(
        api_key=os.getenv("OPENROUTER_API_KEY"),
        base_url="https://openrouter.ai/api/v1",
        model=settings.OPENROUTER_MODEL,
        temperature=0.5
    )
    
    parser = JsonOutputParser()
    
    prompt = ChatPromptTemplate.from_template("""
    Generate a {days}-day DSA roadmap for:
    - Current level: {current_level}
    - Target company: {target_company}
    - Time available: {time_available} hours per day
    - Weak areas: {weak_areas}
    
    Return JSON with daily_goals array containing each day's topic and problems.
    Focus on LeetCode-style problems with progression from easy to hard.
    """)
    
    chain = prompt | llm | parser
    result = chain.invoke({
        "current_level": request.profile.current_level,
        "target_company": request.profile.target_company,
        "time_available": request.profile.time_available,
        "weak_areas": request.profile.weak_areas,
        "days": request.days
    })
    
    return DSARoadmap(**result)

@router.post("/recommend-problems", response_model=List[ProblemRecommendation])
async def recommend_problems(topic: str, count: int = 10, difficulty: Optional[str] = None):
    llm = ChatOpenAI(
        api_key=os.getenv("OPENROUTER_API_KEY"),
        base_url="https://openrouter.ai/api/v1",
        model=settings.OPENROUTER_MODEL,
        temperature=0.5
    )
    
    prompt = ChatPromptTemplate.from_template("""
    Recommend {count} LeetCode problems for topic: {topic}
    {difficulty_filter}
    
    Return JSON array with: title, difficulty, topic, url (use leetcode.com/problems/slug), reason
    """)
    
    difficulty_filter = f"Difficulty: {difficulty}" if difficulty else "Mix of difficulties"
    
    chain = prompt | llm | JsonOutputParser()
    result = chain.invoke({"topic": topic, "count": count, "difficulty_filter": difficulty_filter})
    
    return result