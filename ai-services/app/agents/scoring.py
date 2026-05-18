from typing import Dict, List, Any

class ScoringAgent:
    def score(self, parsed_data: Dict[str, Any]) -> Dict[str, Any]:
        score = 0
        strengths = []
        weaknesses = []
        
        skills = parsed_data.get('skills', [])
        projects = parsed_data.get('projects', [])
        education = parsed_data.get('education', [])
        experience = parsed_data.get('experience', [])
        
        if len(skills) >= 5:
            score += 30
            strengths.append("Strong technical skill set")
        elif len(skills) >= 3:
            score += 20
            strengths.append("Good technical skills")
        else:
            weaknesses.append("Add more technical skills")
        
        if len(projects) >= 3:
            score += 30
            strengths.append("Good number of projects")
        elif len(projects) >= 1:
            score += 20
        else:
            weaknesses.append("Add more projects")
        
        if education:
            score += 10
        
        if experience:
            score += 30
            strengths.append("Has relevant experience")
        else:
            weaknesses.append("Add internships or work experience")
        
        return {
            "score": min(score, 100),
            "strengths": strengths,
            "weaknesses": weaknesses
        }

def score_resume(parsed_data: Dict[str, Any]) -> Dict[str, Any]:
    scorer = ScoringAgent()
    return scorer.score(parsed_data)