import random

def get_problem_recommendations(level):
    problems = [
        {"title": "Two Sum", "url": "https://leetcode.com/problems/two-sum/", "difficulty": "Easy"},
        {"title": "Best Time to Buy and Sell Stock", "url": "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/", "difficulty": "Easy"},
        {"title": "Longest Substring Without Repeating Characters", "url": "https://leetcode.com/problems/longest-substring-without-repeating-characters/", "difficulty": "Medium"},
        {"title": "Container With Most Water", "url": "https://leetcode.com/problems/container-with-most-water/", "difficulty": "Medium"},
        {"title": "Merge k Sorted Lists", "url": "https://leetcode.com/problems/merge-k-sorted-lists/", "difficulty": "Hard"},
        {"title": "Word Ladder", "url": "https://leetcode.com/problems/word-ladder/", "difficulty": "Hard"}
    ]
    
    if level == "Beginner":
        return random.sample([p for p in problems if p["difficulty"] == "Easy"], 2)
    elif level == "Intermediate":
        return random.sample([p for p in problems if p["difficulty"] == "Medium"], 2)
    else:
        return random.sample([p for p in problems if p["difficulty"] == "Hard"], 2)
