def generate_plan(level, daily_time, days):
    topics = [
        "Arrays", "Strings", "Linked List", "Stack", "Queue",
        "Recursion", "Sorting", "Searching", "Trees", "Dynamic Programming"
    ]
    
    diff_map = {
        "Beginner": "Easy",
        "Intermediate": "Medium",
        "Advanced": "Hard"
    }
    
    plan = {}
    for i in range(1, days + 1):
        topic = topics[i % len(topics)]
        plan[f"Day {i}"] = f"{topic} — {diff_map[level]}"
    return plan
