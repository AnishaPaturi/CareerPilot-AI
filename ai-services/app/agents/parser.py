import re
from typing import Dict, List, Any

class ParserAgent:
    def __init__(self):
        self.tech_keywords = [
            'python', 'java', 'javascript', 'react', 'node', 'angular', 'vue',
            'spring', 'django', 'flask', 'express', 'mysql', 'mongodb', 'postgresql',
            'aws', 'docker', 'kubernetes', 'git', 'html', 'css', 'typescript',
            'c++', 'c#', 'go', 'rust', 'php', 'ruby', 'swift', 'kotlin'
        ]
        self.project_keywords = ['project', 'built', 'developed', 'created']
        self.education_keywords = ['btech', 'bachelor', 'university', 'college', 'degree', 'mca', 'mtech']
        self.experience_keywords = ['intern', 'developer', 'engineer', 'worked', 'experience', 'employment']
    
    def parse(self, resume_text: str) -> Dict[str, Any]:
        skills = []
        projects = []
        education = []
        experience = []
        
        lines = resume_text.split('\n')
        
        for line in lines:
            line_lower = line.lower().strip()
            
            for keyword in self.tech_keywords:
                if keyword in line_lower and line.strip():
                    skills.append(line.strip())
            
            for keyword in self.project_keywords:
                if keyword in line_lower:
                    projects.append(line.strip())
            
            for keyword in self.education_keywords:
                if keyword in line_lower:
                    education.append(line.strip())
            
            for keyword in self.experience_keywords:
                if keyword in line_lower:
                    experience.append(line.strip())
        
        return {
            "skills": list(set(skills)),
            "projects": list(set(projects)),
            "education": list(set(education)),
            "experience": list(set(experience))
        }

def parse_resume(resume_text: str) -> Dict[str, Any]:
    parser = ParserAgent()
    return parser.parse(resume_text)