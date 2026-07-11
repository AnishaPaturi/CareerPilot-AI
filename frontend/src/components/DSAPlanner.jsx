import { useState, useEffect } from 'react';
import { dsaPlannerAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import CodeSketchVisualizer from './CodeSketchVisualizer';

const COMMON_LEETCODE_MAP = {
  "two sum": { id: 1, difficulty: "Easy" },
  "contains duplicate": { id: 217, difficulty: "Easy" },
  "valid anagram": { id: 242, difficulty: "Easy" },
  "best time to buy and sell stock": { id: 121, difficulty: "Easy" },
  "valid parentheses": { id: 20, difficulty: "Easy" },
  "merge two sorted lists": { id: 21, difficulty: "Easy" },
  "binary search": { id: 704, difficulty: "Easy" },
  "flood fill": { id: 733, difficulty: "Easy" },
  "invert binary tree": { id: 226, difficulty: "Easy" },
  "maximum subarray": { id: 53, difficulty: "Medium" },
  "lowest common ancestor of a binary search tree": { id: 235, difficulty: "Easy" },
  "balanced binary tree": { id: 110, difficulty: "Easy" },
  "linked list cycle": { id: 141, difficulty: "Easy" },
  "implement queue using stacks": { id: 232, difficulty: "Easy" },
  "first bad version": { id: 278, difficulty: "Easy" },
  "ransom note": { id: 383, difficulty: "Easy" },
  "climbing stairs": { id: 70, difficulty: "Easy" },
  "longest palindrome": { id: 409, difficulty: "Easy" },
  "reverse linked list": { id: 206, difficulty: "Easy" },
  "majority element": { id: 169, difficulty: "Easy" },
  "add binary": { id: 67, difficulty: "Easy" },
  "diameter of binary tree": { id: 543, difficulty: "Easy" },
  "middle of the linked list": { id: 876, difficulty: "Easy" },
  "3sum": { id: 15, difficulty: "Medium" },
  "binary tree level order traversal": { id: 102, difficulty: "Medium" },
  "clone graph": { id: 133, difficulty: "Medium" },
  "evaluate reverse polish notation": { id: 150, difficulty: "Medium" },
  "course schedule": { id: 207, difficulty: "Medium" },
  "implement trie": { id: 208, difficulty: "Medium" },
  "coin change": { id: 322, difficulty: "Medium" },
  "product of array except self": { id: 238, difficulty: "Medium" },
  "min stack": { id: 155, difficulty: "Medium" },
  "validate binary search tree": { id: 98, difficulty: "Medium" },
  "number of islands": { id: 200, difficulty: "Medium" },
  "rotting oranges": { id: 994, difficulty: "Medium" },
  "search in rotated sorted array": { id: 33, difficulty: "Medium" },
  "combination sum": { id: 39, difficulty: "Medium" },
  "k closest points to origin": { id: 973, difficulty: "Medium" },
  "longest substring without repeating characters": { id: 3, difficulty: "Medium" },
  "lru cache": { id: 146, difficulty: "Medium" },
  "merge intervals": { id: 56, difficulty: "Medium" },
  "permutations": { id: 46, difficulty: "Medium" },
  "lowest common ancestor of a binary tree": { id: 236, difficulty: "Medium" },
  "time based key value store": { id: 981, difficulty: "Medium" },
  "accounts merge": { id: 721, difficulty: "Medium" },
  "sort colors": { id: 75, difficulty: "Medium" },
  "word break": { id: 139, difficulty: "Medium" },
  "subsets": { id: 78, difficulty: "Medium" },
  "binary tree right side view": { id: 199, difficulty: "Medium" },
  "longest consecutive sequence": { id: 128, difficulty: "Medium" },
  "unique paths": { id: 62, difficulty: "Medium" },
  "kth largest element in an array": { id: 215, difficulty: "Medium" },
  "container with most water": { id: 11, difficulty: "Medium" },
  "find all anagrams in a string": { id: 438, difficulty: "Medium" },
  "minimum height trees": { id: 310, difficulty: "Medium" },
  "task scheduler": { id: 621, difficulty: "Medium" },
  "insert interval": { id: 57, difficulty: "Medium" },
  "01 matrix": { id: 542, difficulty: "Medium" },
  "kth smallest element in a bst": { id: 230, difficulty: "Medium" },
  "house robber": { id: 198, difficulty: "Medium" },
  "maximum depth of binary tree": { id: 104, difficulty: "Easy" },
  "same tree": { id: 100, difficulty: "Easy" },
  "subtree of another tree": { id: 572, difficulty: "Easy" }
};

const formatProblemString = (prob) => {
  if (!prob) return '';
  if (prob.trim().startsWith('#')) return prob;
  
  const cleanTitle = prob
    .replace(/\s*\(Easy\)|\s*\(Medium\)|\s*\(Hard\)/i, '')
    .trim()
    .toLowerCase();
    
  const match = COMMON_LEETCODE_MAP[cleanTitle];
  if (match) {
    return `#${match.id} ${prob.replace(/\s*\(Easy\)|\s*\(Medium\)|\s*\(Hard\)/i, '').trim()} (${match.difficulty})`;
  }
  return prob;
};

const getLeetCodeUrl = (problemStr) => {
  if (!problemStr) return null;
  let cleanTitle = problemStr
    .replace(/#\d+\s*/, '')
    .replace(/\s*\(Easy\)|\s*\(Medium\)|\s*\(Hard\)/i, '')
    .trim();
    
  if (!cleanTitle) return null;
  const slug = cleanTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  return `https://leetcode.com/problems/${slug}/`;
};

export default function DSAPlanner() {
  const { user } = useAuth();
  const [activeSubTab, setActiveSubTab] = useState('visualizer');
  const [currentLevel, setCurrentLevel] = useState('Beginner');
  const [targetCompany, setTargetCompany] = useState('MAANG');
  const [timeAvailable, setTimeAvailable] = useState(2);
  const [weakAreas, setWeakAreas] = useState('Dynamic Programming, Graphs');
  const [days, setDays] = useState(30);

  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(false);
  const [completedProblems, setCompletedProblems] = useState([]);

  // Load saved roadmap and completed problems on mount
  useEffect(() => {
    if (user?.id) {
      const savedRoadmap = localStorage.getItem(`dsa_roadmap_${user.id}`);
      if (savedRoadmap) {
        try {
          setRoadmap(JSON.parse(savedRoadmap));
        } catch (e) {
          console.error("Failed to load saved roadmap:", e);
        }
      }

      const savedCompleted = localStorage.getItem(`dsa_completed_${user.id}`);
      if (savedCompleted) {
        try {
          setCompletedProblems(JSON.parse(savedCompleted));
        } catch (e) {
          console.error("Failed to load completed problems:", e);
        }
      }
    }
  }, [user?.id]);

  const updateDsaScore = (completedList, currentRoadmap) => {
    if (!currentRoadmap || !currentRoadmap.daily_goals) return;
    let totalProblems = 0;
    let completedCount = 0;

    currentRoadmap.daily_goals.forEach(goal => {
      if (goal.problems) {
        goal.problems.forEach(prob => {
          totalProblems++;
          const formatted = formatProblemString(prob);
          if (completedList.includes(formatted)) {
            completedCount++;
          }
        });
      }
    });

    const score = totalProblems > 0 ? Math.round((completedCount / totalProblems) * 100) : 0;
    if (user?.id) {
      localStorage.setItem(`dsa_score_${user.id}`, String(score));
    }
  };

  const toggleProblemCompletion = (prob) => {
    const formatted = formatProblemString(prob);
    let updated;
    if (completedProblems.includes(formatted)) {
      updated = completedProblems.filter(p => p !== formatted);
    } else {
      updated = [...completedProblems, formatted];
    }
    setCompletedProblems(updated);
    if (user?.id) {
      localStorage.setItem(`dsa_completed_${user.id}`, JSON.stringify(updated));
    }
    updateDsaScore(updated, roadmap);
  };

  const generateRoadmap = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const profile = {
        current_level: currentLevel,
        target_company: targetCompany,
        time_available: parseInt(timeAvailable),
        weak_areas: weakAreas.split(',').map(s => s.trim())
      };
      const data = await dsaPlannerAPI.generateRoadmap(profile, parseInt(days));
      setRoadmap(data);
      if (user?.id) {
        localStorage.setItem(`dsa_roadmap_${user.id}`, JSON.stringify(data));
      }
      updateDsaScore(completedProblems, data);
    } catch (err) {
      console.error(err);
      alert("Failed to generate roadmap");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto text-white space-y-6">
      {/* Sub-tab navigation */}
      <div className="flex bg-slate-900/40 p-1.5 rounded-2xl border border-slate-800/80 max-w-md mx-auto backdrop-blur-md">
        <button
          onClick={() => setActiveSubTab('visualizer')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all ${
            activeSubTab === 'visualizer'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          CodeSketch Visualizer
        </button>
        <button
          onClick={() => setActiveSubTab('roadmap')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all ${
            activeSubTab === 'roadmap'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          AI Study Roadmap
        </button>
      </div>

      {activeSubTab === 'visualizer' ? (
        <CodeSketchVisualizer />
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-white max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-blue-400">Agentic DSA Planner</h2>

          {!roadmap ? (
            <form onSubmit={generateRoadmap} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Current Level</label>
                  <select value={currentLevel} onChange={e => setCurrentLevel(e.target.value)} className="w-full bg-slate-800 p-3 rounded-lg">
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Target Company / Tier</label>
                  <input type="text" value={targetCompany} onChange={e => setTargetCompany(e.target.value)} className="w-full bg-slate-800 p-3 rounded-lg" required />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Hours per Day</label>
                  <input type="number" min="1" max="16" value={timeAvailable} onChange={e => setTimeAvailable(e.target.value)} className="w-full bg-slate-800 p-3 rounded-lg" required />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Duration (Days)</label>
                  <input type="number" min="7" max="90" value={days} onChange={e => setDays(e.target.value)} className="w-full bg-slate-800 p-3 rounded-lg" required />
                </div>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Weak Areas (comma separated)</label>
                <input type="text" value={weakAreas} onChange={e => setWeakAreas(e.target.value)} className="w-full bg-slate-800 p-3 rounded-lg" required />
              </div>
              <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-bold">
                {loading ? 'Analyzing your profile & generating roadmap...' : 'Generate AI Roadmap'}
              </button>
            </form>
          ) : (
            <div className="space-y-8">
              <div className="flex justify-between items-center border-b border-white/10 pb-4">
                <div>
                  <h3 className="text-2xl font-bold text-blue-300">{roadmap.title}</h3>
                  <p className="text-slate-400 mt-1">{roadmap.duration_days} Days to Mastery</p>
                </div>
                <button onClick={() => setRoadmap(null)} className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg text-sm font-medium">
                  Start Over
                </button>
              </div>

              <div className="grid gap-6">
                {roadmap.daily_goals?.map((goal, idx) => (
                  <div key={idx} className="bg-slate-800/50 border border-slate-700 p-6 rounded-xl flex flex-col md:flex-row gap-6">
                    <div className="min-w-[120px] text-center bg-slate-900 rounded-lg p-4 flex flex-col justify-center">
                      <span className="text-sm text-slate-400 uppercase tracking-wider font-bold">Day {goal.day}</span>
                      <span className="text-xl font-bold text-blue-400 mt-1">
                        {goal.estimated_time >= 10 ? `${Math.round((goal.estimated_time / 60) * 10) / 10}h` : `${goal.estimated_time}h`}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-slate-200 mb-3">{goal.topic}</h4>
                      <ul className="space-y-2">
                        {goal.problems?.map((prob, i) => {
                          const formattedProb = formatProblemString(prob);
                          const url = getLeetCodeUrl(formattedProb);
                          return (
                            <li key={i} className="flex items-center gap-3 bg-white/[0.01] p-2 rounded-lg hover:bg-white/[0.03] transition-all border border-white/5">
                              <input
                                type="checkbox"
                                checked={completedProblems.includes(formattedProb)}
                                onChange={() => toggleProblemCompletion(prob)}
                                className="accent-blue-500 rounded cursor-pointer w-4 h-4 shrink-0"
                              />
                              {url ? (
                                <a
                                  href={url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`hover:text-blue-300 hover:underline transition-all text-sm font-medium ${completedProblems.includes(formattedProb) ? 'line-through text-slate-500' : 'text-blue-400'}`}
                                >
                                  {formattedProb}
                                </a>
                              ) : (
                                <span className={`text-sm ${completedProblems.includes(formattedProb) ? 'line-through text-slate-500' : 'text-slate-300'}`}>{formattedProb}</span>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

