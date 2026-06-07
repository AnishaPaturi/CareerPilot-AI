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

class ProblemRecommendations(BaseModel):
    recommendations: List[ProblemRecommendation]

@router.post("/generate-roadmap", response_model=DSARoadmap)
async def generate_dsa_roadmap(request: RoadmapRequest):
    parser = JsonOutputParser(pydantic_object=DSARoadmap)
    
    prompt = ChatPromptTemplate.from_template("""
    Generate a {days}-day DSA roadmap for:
    - Current level: {current_level}
    - Target company: {target_company}
    - Time available: {time_available} hours per day
    - Weak areas: {weak_areas}
    
    Focus on LeetCode-style problems with progression from easy to hard.
    
    {format_instructions}
    """)
    
    models = []
    for m in [settings.OPENROUTER_MODEL, "google/gemma-4-31b-it:free", "google/gemma-4-26b-a4b-it:free", "poolside/laguna-m.1:free", "liquid/lfm-2.5-1.2b-thinking:free", "moonshotai/kimi-k2.6:free", "z-ai/glm-4.5-air:free", "qwen/qwen3-coder:free", "meta-llama/llama-3.2-3b-instruct:free", "openrouter/free"]:
        if m and m not in models:
            models.append(m)
            
    last_error = None
    for model in models:
        try:
            llm = ChatOpenAI(
                api_key=os.getenv("OPENROUTER_API_KEY"),
                base_url="https://openrouter.ai/api/v1",
                model=model,
                temperature=0.5,
                max_retries=1
            )
            chain = prompt | llm | parser
            result = chain.invoke({
                "current_level": request.profile.current_level,
                "target_company": request.profile.target_company,
                "time_available": request.profile.time_available,
                "weak_areas": request.profile.weak_areas,
                "days": request.days,
                "format_instructions": parser.get_format_instructions()
            })
            return DSARoadmap(**result)
        except Exception as e:
            last_error = e
            import sys
            print(f"Failed to generate roadmap using model {model}: {e}", file=sys.stderr)
            continue
            
    raise HTTPException(status_code=500, detail=f"All models failed. Last error: {str(last_error)}")

@router.post("/recommend-problems", response_model=List[ProblemRecommendation])
async def recommend_problems(topic: str, count: int = 10, difficulty: Optional[str] = None):
    parser = JsonOutputParser(pydantic_object=ProblemRecommendations)
    
    prompt = ChatPromptTemplate.from_template("""
    Recommend {count} LeetCode problems for topic: {topic}
    {difficulty_filter}
    
    {format_instructions}
    """)
    
    difficulty_filter = f"Difficulty: {difficulty}" if difficulty else "Mix of difficulties"
    
    models = []
    for m in [settings.OPENROUTER_MODEL, "google/gemma-4-31b-it:free", "google/gemma-4-26b-a4b-it:free", "poolside/laguna-m.1:free", "liquid/lfm-2.5-1.2b-thinking:free", "moonshotai/kimi-k2.6:free", "z-ai/glm-4.5-air:free", "qwen/qwen3-coder:free", "meta-llama/llama-3.2-3b-instruct:free", "openrouter/free"]:
        if m and m not in models:
            models.append(m)
            
    last_error = None
    for model in models:
        try:
            llm = ChatOpenAI(
                api_key=os.getenv("OPENROUTER_API_KEY"),
                base_url="https://openrouter.ai/api/v1",
                model=model,
                temperature=0.5,
                max_retries=1
            )
            chain = prompt | llm | parser
            result = chain.invoke({
                "topic": topic, 
                "count": count, 
                "difficulty_filter": difficulty_filter,
                "format_instructions": parser.get_format_instructions()
            })
            return result.get("recommendations", [])
        except Exception as e:
            last_error = e
            import sys
            print(f"Failed to recommend problems using model {model}: {e}", file=sys.stderr)
            continue
            
    raise HTTPException(status_code=500, detail=f"All models failed. Last error: {str(last_error)}")