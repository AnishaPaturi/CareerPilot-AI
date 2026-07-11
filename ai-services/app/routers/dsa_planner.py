from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
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
    problems: List[str] = Field(description="List of LeetCode problems, each including its question number (e.g., '#1 Two Sum (Easy)' or '#217 Contains Duplicate (Easy)')")
    estimated_time: int = Field(description="Estimated time to complete the daily goal in hours (e.g., 2)")

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
    For each problem in the list, you MUST include the LeetCode question number (e.g., "#1 Two Sum (Easy)").
    The estimated_time for each daily goal MUST be in hours, matching the user's available time per day ({time_available} hours).
    
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

# --- Career Roadmap Models & Endpoint ---

class CareerRoadmapRequest(BaseModel):
    target_role: str
    current_skills: List[str]
    target_company_type: Optional[str] = "MAANG"

class SkillGapAnalysis(BaseModel):
    current_skills: List[str]
    required_skills: List[str]
    missing_skills: List[str]
    gap_report: str

class LearningResource(BaseModel):
    skill: str
    resource_name: str
    url: str

class WeeklyGoal(BaseModel):
    week: int
    topic: str
    tasks: List[str]

class CareerRoadmapResponse(BaseModel):
    title: str
    target_role: str
    skill_gap_analysis: SkillGapAnalysis
    learning_resources: List[LearningResource]
    weekly_goals: List[WeeklyGoal]

@router.post("/generate-career-roadmap", response_model=CareerRoadmapResponse)
async def generate_career_roadmap(request: CareerRoadmapRequest):
    parser = JsonOutputParser(pydantic_object=CareerRoadmapResponse)
    
    prompt = ChatPromptTemplate.from_template("""
    Create a personalized 4-week Career Roadmap and Skill Gap Report for:
    - Target Role: {target_role}
    - Current Skills: {current_skills}
    - Target Company Tier: {target_company_type}
    
    Guidelines:
    1. Assess the skill gap between target role requirements and user's current skills.
    2. Provide 4 weekly topics with 3 actionable tasks per week to bridge the gap.
    3. Suggest high-quality online learning resources (e.g. FreeCodeCamp, Roadmap.sh, MDN).
    
    {format_instructions}
    """)
    
    models = []
    for m in [settings.OPENROUTER_MODEL, "google/gemma-4-31b-it:free", "google/gemma-4-26b-a4b-it:free", "poolside/laguna-m.1:free", "liquid/lfm-2.5-1.2b-thinking:free", "meta-llama/llama-3.2-3b-instruct:free", "openrouter/free"]:
        if m and m not in models:
            models.append(m)
            
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
                "target_role": request.target_role,
                "current_skills": ", ".join(request.current_skills),
                "target_company_type": request.target_company_type,
                "format_instructions": parser.get_format_instructions()
            })
            return CareerRoadmapResponse(**result)
        except Exception as e:
            import sys
            print(f"Failed to generate career roadmap using model {model}: {e}", file=sys.stderr)
            continue
            
    # Heuristic fallback if LLMs fail (ensures offline robustness)
    role = request.target_role.lower()
    curr_skills_lower = [s.lower() for s in request.current_skills]
    
    if "front" in role or "react" in role or "web" in role or "ui" in role:
        title = "Frontend Developer Career Roadmap"
        req_skills = ["HTML", "CSS", "JavaScript", "TypeScript", "React", "Redux", "TailwindCSS", "Git", "Testing"]
        missing = [s for s in req_skills if s.lower() not in curr_skills_lower]
        if not missing:
            missing = ["Next.js", "GraphQL", "CI/CD"]
            
        gap_report = "You have basic web design knowledge. To achieve a modern frontend role, prioritize mastering React, state management, and source control."
        resources = [
            LearningResource(skill="JavaScript", resource_name="MDN Web Docs", url="https://developer.mozilla.org"),
            LearningResource(skill="React", resource_name="React Official Docs", url="https://react.dev"),
            LearningResource(skill="TailwindCSS", resource_name="TailwindCSS Guide", url="https://tailwindcss.com"),
            LearningResource(skill="Git", resource_name="Git Tutorial (GitHub)", url="https://git-scm.com")
        ]
        weekly_goals = [
            WeeklyGoal(week=1, topic="Advanced JS & TypeScript fundamentals", tasks=[
                "Master ES6+ syntax, Promises, and Async/Await",
                "Learn basic TypeScript types, interfaces, and compiler config",
                "Build a small TypeScript utility app (e.g. calculator)"
            ]),
            WeeklyGoal(week=2, topic="React Components & Hook State", tasks=[
                "Understand functional components, props, and standard hooks (useState, useEffect)",
                "Create a dynamic dashboard with custom hooks and data fetching",
                "Manage complex state with useContext or lightweight Redux Toolkit"
            ]),
            WeeklyGoal(week=3, topic="Modern Styling & Grid Layouts", tasks=[
                "Configure TailwindCSS inside your React project",
                "Build a fully responsive multi-page landing page layout",
                "Add micro-interactions and transitions using standard CSS / Framer Motion"
            ]),
            WeeklyGoal(week=4, topic="Version Control & Deployment", tasks=[
                "Learn Git branching, merging, and pull request workflows",
                "Deploy the React application live on Vercel or Netlify",
                "Run a basic Lighthouse audit and optimize image sizes & load times"
            ])
        ]
    elif "back" in role or "java" in role or "node" in role or "spring" in role:
        title = "Backend Systems Developer Career Roadmap"
        req_skills = ["Java", "Spring Boot", "Node.js", "Express", "SQL", "PostgreSQL", "REST APIs", "Docker", "Git"]
        missing = [s for s in req_skills if s.lower() not in curr_skills_lower]
        if not missing:
            missing = ["System Design", "Kubernetes", "Redis"]
            
        gap_report = "To secure a backend role, you need to transition from simple scripts to constructing RESTful API architectures, database connections, and containerized deployments."
        resources = [
            LearningResource(skill="REST APIs", resource_name="REST API Tutorial", url="https://restfulapi.net"),
            LearningResource(skill="PostgreSQL", resource_name="PostgreSQL Exercises", url="https://www.pgexercises.com"),
            LearningResource(skill="Spring Boot", resource_name="Spring Boot Quickstart", url="https://spring.io/projects/spring-boot"),
            LearningResource(skill="Docker", resource_name="Docker Basics", url="https://roadmap.sh/docker")
        ]
        weekly_goals = [
            WeeklyGoal(week=1, topic="RESTful API Design & Routing", tasks=[
                "Learn HTTP status codes, verbs, and clean URL structure design",
                "Build a clean Express or Spring Boot REST API for a task database",
                "Implement validation middleware to handle bad request payloads"
            ]),
            WeeklyGoal(week=2, topic="Relational Databases & SQL", tasks=[
                "Design a schema with primary, foreign keys, and indexes",
                "Connect your backend application to a PostgreSQL database using JPA/Hibernate or pg-pool",
                "Practice writing subqueries, joins, and aggregating values"
            ]),
            WeeklyGoal(week=3, topic="Secure Authentication & JWT", tasks=[
                "Hash passwords securely using Bcrypt (minimum cost 12)",
                "Implement JWT token creation, signing, and verification flow",
                "Create a login controller and register protected routes using middleware"
            ]),
            WeeklyGoal(week=4, topic="Containerization & local deploy", tasks=[
                "Write a multi-stage Dockerfile to containerize your backend app",
                "Set up docker-compose.yml to run database and server together",
                "Deploy backend server to Render or AWS EC2"
            ])
        ]
    else:
        title = f"AI/Software Engineering Roadmap ({request.target_role})"
        req_skills = ["Data Structures", "Algorithms", "System Design", "Python", "SQL", "Git", "Docker"]
        missing = [s for s in req_skills if s.lower() not in curr_skills_lower]
        if not missing:
            missing = ["Cloud Deployment", "CI/CD"]
            
        gap_report = f"Bridge the gaps to qualify for a {request.target_role} position. Focus on software development cycles, version control, and containerization."
        resources = [
            LearningResource(skill="DSA", resource_name="LeetCode practice patterns", url="https://leetcode.com"),
            LearningResource(skill="System Design", resource_name="System Design Primer", url="https://github.com/donnemartin/system-design-primer")
        ]
        weekly_goals = [
            WeeklyGoal(week=1, topic="Algorithmic problem patterns", tasks=[
                "Master Two Pointers, Sliding Window, and Hash Map optimizations",
                "Solve 10 medium-level problems on LeetCode",
                "Write down and compare time and space complexities for each"
            ]),
            WeeklyGoal(week=2, topic="Object Oriented Design", tasks=[
                "Review OOP principles: Polymorphism, Inheritance, Encapsulation",
                "Build a design pattern showcase (e.g. Singleton, Factory)",
                "Write unit tests (JUnit / PyTest) achieving 80% coverage"
            ]),
            WeeklyGoal(week=3, topic="Data Stores & Caching", tasks=[
                "Master SQL queries, constraints, and index operations",
                "Learn how Redis is used as a caching layer to reduce latency",
                "Configure a simple Redis cache inside an application"
            ]),
            WeeklyGoal(week=4, topic="DevOps & Deployment Basics", tasks=[
                "Write a Dockerfile and containerize your application",
                "Deploy the app to a free platform (e.g. Render, Vercel)",
                "Set up a GitHub Action to run code checks on pull requests"
            ])
        ]
        
    return CareerRoadmapResponse(
        title=title,
        target_role=request.target_role,
        skill_gap_analysis=SkillGapAnalysis(
            current_skills=request.current_skills,
            required_skills=req_skills,
            missing_skills=missing,
            gap_report=gap_report
        ),
        learning_resources=resources,
        weekly_goals=weekly_goals
    )

# --- CodeSketch Trace Models & Endpoint ---

class CodeSketchStep(BaseModel):
    lineIndex: int = Field(description="0-based line index in the code lines array representing the line currently executing")
    explanation: str = Field(description="Short sentence explaining what is happening in this execution step")
    variables: dict = Field(description="Dictionary of variable names and their values at this step (e.g. {'low': 0, 'high': 4, 'mid': 2})")

class CodeSketchTrace(BaseModel):
    problem_title: str
    code_lines: List[str] = Field(description="Array of strings representing individual lines of the solved code (e.g. JavaScript, Python)")
    steps: List[CodeSketchStep] = Field(description="List of step-by-step trace elements of code execution")
    time_complexity: str = Field(description="Time complexity e.g., O(N log N)")
    space_complexity: str = Field(description="Space complexity e.g., O(N)")

class TraceRequest(BaseModel):
    problem_desc: str
    language: str = "javascript"
    custom_input: Optional[str] = None

@router.post("/generate-trace", response_model=CodeSketchTrace)
async def generate_code_sketch_trace(request: TraceRequest):
    parser = JsonOutputParser(pydantic_object=CodeSketchTrace)
    
    prompt = ChatPromptTemplate.from_template("""
    You are an expert DSA Tutor. The user wants to trace the step-by-step code execution for the following LeetCode problem:
    - Problem Name / Description: {problem_desc}
    - Programming Language: {language}
    - Test Input values: {custom_input}
    
    Instructions:
    1. Write a clean, standard solution in {language} for the problem.
    2. Split the solution code into an array of lines (strings).
    3. Generate a sequence of trace steps of executing this code line-by-line with the test input {custom_input}.
    4. Each step must reference the 0-based index of the line in the code array that is executing, provide a clear explanation, and capture the current values of all variables.
    5. Include the time and space complexity.
    
    {format_instructions}
    """)
    
    models = []
    for m in [settings.OPENROUTER_MODEL, "google/gemma-2-9b-it:free", "qwen/qwen3-coder:free", "meta-llama/llama-3.2-3b-instruct:free", "openrouter/free"]:
        if m and m not in models:
            models.append(m)
            
    last_error = None
    for model in models:
        try:
            llm = ChatOpenAI(
                api_key=os.getenv("OPENROUTER_API_KEY"),
                base_url="https://openrouter.ai/api/v1",
                model=model,
                temperature=0.2,
                max_retries=1
            )
            chain = prompt | llm | parser
            result = chain.invoke({
                "problem_desc": request.problem_desc,
                "language": request.language,
                "custom_input": request.custom_input or "",
                "format_instructions": parser.get_format_instructions()
            })
            return CodeSketchTrace(**result)
        except Exception as e:
            last_error = e
            import sys
            print(f"Failed to generate trace using model {model}: {e}", file=sys.stderr)
            continue
            
    raise HTTPException(status_code=500, detail=f"Failed to generate trace. Last error: {str(last_error)}")