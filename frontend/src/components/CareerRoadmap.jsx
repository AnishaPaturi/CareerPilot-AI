import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { careerRoadmapAPI } from '../services/api';
import { 
  Map, Award, BookOpen, CheckCircle, Clock, ArrowRight, Sparkles, 
  TrendingUp, CheckSquare, Square, ExternalLink, Loader2 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CareerRoadmap() {
  const { user } = useAuth();
  
  // Setup States
  const [targetRole, setTargetRole] = useState('Frontend Developer');
  const [currentSkills, setCurrentSkills] = useState('HTML, CSS');
  const [targetCompany, setTargetCompany] = useState('MAANG');
  const [loading, setLoading] = useState(false);

  // Roadmap Data States
  const [roadmap, setRoadmap] = useState(null);
  const [completedTasks, setCompletedTasks] = useState([]);

  // Load saved roadmap from localStorage
  useEffect(() => {
    if (user?.id) {
      const savedRoadmap = localStorage.getItem(`career_roadmap_${user.id}`);
      if (savedRoadmap) {
        try {
          const parsed = JSON.parse(savedRoadmap);
          setRoadmap(parsed);
          
          // Load completed tasks
          const savedCompleted = localStorage.getItem(`career_roadmap_completed_${user.id}_${parsed.target_role}`);
          if (savedCompleted) {
            setCompletedTasks(JSON.parse(savedCompleted));
          }
        } catch (e) {
          console.error("Failed to load saved career roadmap:", e);
        }
      }
    }
  }, [user?.id]);

  const handleGenerateRoadmap = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const skillsArray = currentSkills.split(',').map(s => s.trim()).filter(Boolean);
      const data = await careerRoadmapAPI.generateRoadmap(targetRole, skillsArray, targetCompany);
      
      setRoadmap(data);
      setCompletedTasks([]); // Reset tasks for new roadmap
      
      if (user?.id) {
        localStorage.setItem(`career_roadmap_${user.id}`, JSON.stringify(data));
        localStorage.setItem(`career_roadmap_completed_${user.id}_${data.target_role}`, JSON.stringify([]));
      }
    } catch (err) {
      console.error(err);
      alert("Failed to generate career roadmap: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleTaskCompletion = (taskText) => {
    if (!roadmap) return;
    
    let updated;
    if (completedTasks.includes(taskText)) {
      updated = completedTasks.filter(t => t !== taskText);
    } else {
      updated = [...completedTasks, taskText];
    }
    
    setCompletedTasks(updated);
    
    if (user?.id) {
      localStorage.setItem(
        `career_roadmap_completed_${user.id}_${roadmap.target_role}`, 
        JSON.stringify(updated)
      );
    }
  };

  const getTaskCount = () => {
    if (!roadmap || !roadmap.weekly_goals) return 0;
    return roadmap.weekly_goals.reduce((sum, w) => sum + (w.tasks?.length || 0), 0);
  };

  const getReadinessScore = () => {
    const total = getTaskCount();
    if (total === 0) return 0;
    
    // Initial score matches matched skills percentage
    const missingCount = roadmap?.skill_gap_analysis?.missing_skills?.length || 0;
    const currentCount = roadmap?.skill_gap_analysis?.current_skills?.length || 0;
    const initialPct = currentCount + missingCount > 0 
      ? Math.round((currentCount / (currentCount + missingCount)) * 50) 
      : 20;

    const tasksPct = Math.round((completedTasks.length / total) * 50);
    return Math.min(100, initialPct + tasksPct);
  };

  const totalTasks = getTaskCount();
  const readinessScore = getReadinessScore();

  return (
    <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 text-white max-w-5xl mx-auto shadow-xl backdrop-blur-xl">
      <div className="flex items-center gap-2 border-b border-white/5 pb-4 mb-6">
        <Map className="text-purple-400" size={24} />
        <div>
          <h2 className="text-2xl font-black text-white">Dynamic Career Roadmap</h2>
          <p className="text-xs text-slate-400">Evaluate skill gaps and execute weekly action items to boost job readiness.</p>
        </div>
      </div>

      {!roadmap ? (
        <form onSubmit={handleGenerateRoadmap} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 text-xs uppercase font-bold tracking-wider mb-2">Target Job Title</label>
              <input 
                type="text" 
                value={targetRole} 
                onChange={e => setTargetRole(e.target.value)} 
                placeholder="e.g. Full Stack Developer, DevOps Engineer"
                className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-purple-500/50"
                required 
              />
            </div>
            <div>
              <label className="block text-slate-400 text-xs uppercase font-bold tracking-wider mb-2">Target Company Tier</label>
              <select 
                value={targetCompany} 
                onChange={e => setTargetCompany(e.target.value)} 
                className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-purple-500/50 cursor-pointer"
              >
                <option value="MAANG">MAANG / Big Tech (High rigor)</option>
                <option value="Product Startup">Mid-Size Product Startups (Agile, systems)</option>
                <option value="Service Enterprise">Enterprise Services (Java, SQL, enterprise)</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-slate-400 text-xs uppercase font-bold tracking-wider mb-2">Your Current Skills (comma separated)</label>
            <input 
              type="text" 
              value={currentSkills} 
              onChange={e => setCurrentSkills(e.target.value)} 
              placeholder="e.g. HTML, CSS, basic JavaScript"
              className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-purple-500/50"
              required 
            />
          </div>
          <button 
            type="submit" 
            disabled={loading} 
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-xl font-bold text-sm tracking-wide text-white transition-all shadow-md hover:shadow-purple-500/20 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Analyzing skill gaps & mapping weekly goals...
              </>
            ) : (
              <>
                <Sparkles size={16} />
                Generate Dynamic Career Roadmap
              </>
            )}
          </button>
        </form>
      ) : (
        <div className="space-y-8 animate-fadeIn">
          
          {/* Header Actions */}
          <div className="flex justify-between items-center border-b border-white/5 pb-4">
            <div>
              <h3 className="text-xl font-black text-white">{roadmap.title}</h3>
              <p className="text-slate-400 text-xs mt-0.5">Target: {roadmap.target_role}</p>
            </div>
            <button 
              onClick={() => {
                if (confirm("This will erase your current roadmap and progress. Continue?")) {
                  setRoadmap(null);
                }
              }} 
              className="bg-white/5 border border-white/10 hover:bg-white/10 px-4 py-2 rounded-xl text-xs font-bold transition-all active:scale-95"
            >
              Reset Roadmap
            </button>
          </div>

          {/* Progress Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Readiness Radial Gauge */}
            <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-5 flex flex-col items-center justify-center text-center">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-3">Career Readiness Score</span>
              
              <div className="relative w-24 h-24 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="48" cy="48" r="40" className="stroke-white/[0.04]" strokeWidth="6" fill="transparent" />
                  <circle cx="48" cy="48" r="40" className="stroke-purple-500" strokeWidth="6" fill="transparent"
                    strokeDasharray={251.2}
                    strokeDashoffset={251.2 - (251.2 * readinessScore) / 100}
                    strokeLinecap="round" />
                </svg>
                <span className="absolute text-white font-black text-2xl">{readinessScore}%</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-3 font-semibold uppercase tracking-wider">
                {readinessScore >= 80 ? "🚀 Job Application Ready" : 
                 readinessScore >= 50 ? "📈 Solid Preparation" : "🌱 Learning Fundamentals"}
              </p>
            </div>

            {/* Skill Gap Analysis Box */}
            <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-5 md:col-span-2 space-y-3.5">
              <div className="flex items-center gap-1.5 border-b border-white/5 pb-2">
                <TrendingUp className="text-purple-400" size={16} />
                <span className="text-xs font-bold text-slate-300">Skill Gap Report</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-mono">{roadmap.skill_gap_analysis?.gap_report}</p>
              
              <div className="grid grid-cols-2 gap-4 pt-1">
                <div>
                  <span className="text-[9px] font-bold text-red-400 uppercase tracking-wider block mb-1">Missing Skills (Gaps):</span>
                  <div className="flex flex-wrap gap-1">
                    {roadmap.skill_gap_analysis?.missing_skills?.map((skill, i) => (
                      <span key={i} className="text-[9px] px-2 py-0.5 bg-red-500/10 border border-red-500/20 text-red-300 rounded font-bold capitalize">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-[9px] font-bold text-green-400 uppercase tracking-wider block mb-1">Matching Skills:</span>
                  <div className="flex flex-wrap gap-1">
                    {roadmap.skill_gap_analysis?.current_skills?.map((skill, i) => (
                      <span key={i} className="text-[9px] px-2 py-0.5 bg-green-500/10 border border-green-500/20 text-green-300 rounded font-bold capitalize">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Curated Learning Resources */}
          {roadmap.learning_resources && roadmap.learning_resources.length > 0 && (
            <div className="bg-slate-900/20 border border-white/5 rounded-2xl p-5 space-y-3">
              <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen size={14} /> Curated Learning Resources
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {roadmap.learning_resources.map((res, i) => (
                  <a 
                    key={i} 
                    href={res.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="p-3 bg-white/[0.02] border border-white/5 rounded-xl flex items-center justify-between hover:bg-white/[0.04] transition-all group"
                  >
                    <div>
                      <span className="text-[10px] bg-purple-500/10 text-purple-300 px-1.5 py-0.5 rounded font-bold uppercase">{res.skill}</span>
                      <p className="text-xs text-slate-300 font-semibold mt-1 group-hover:text-white transition-colors">{res.resource_name}</p>
                    </div>
                    <ExternalLink size={13} className="text-slate-500 group-hover:text-white transition-colors" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Weekly Goal Tracker */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle size={16} className="text-purple-400" /> Weekly Goal Tracker
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {roadmap.weekly_goals?.map((weekGoal) => {
                const totalWeekTasks = weekGoal.tasks?.length || 0;
                const completedWeekTasks = weekGoal.tasks?.filter(t => completedTasks.includes(t)).length || 0;
                const progressPct = totalWeekTasks > 0 ? Math.round((completedWeekTasks / totalWeekTasks) * 100) : 0;

                return (
                  <div key={weekGoal.week} className="bg-slate-900/40 border border-white/5 rounded-2xl p-5 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center border-b border-white/5 pb-2.5 mb-3.5">
                        <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">Week {weekGoal.week}</span>
                        <span className="text-[10px] text-slate-400 font-semibold">{completedWeekTasks}/{totalWeekTasks} Done</span>
                      </div>
                      <h5 className="text-sm font-bold text-slate-200 mb-3">{weekGoal.topic}</h5>

                      {/* Checklist */}
                      <ul className="space-y-2.5">
                        {weekGoal.tasks?.map((task, idx) => {
                          const isDone = completedTasks.includes(task);
                          return (
                            <li 
                              key={idx} 
                              onClick={() => toggleTaskCompletion(task)}
                              className="flex items-start gap-2.5 bg-white/[0.01] hover:bg-white/[0.03] border border-white/5 p-2.5 rounded-xl cursor-pointer transition-colors group select-none"
                            >
                              <button type="button" className="text-purple-400 shrink-0 mt-0.5">
                                {isDone ? <CheckSquare size={16} className="text-purple-500" /> : <Square size={16} className="text-slate-600 group-hover:text-slate-400 transition-colors" />}
                              </button>
                              <span className={`text-xs leading-relaxed transition-all ${isDone ? 'line-through text-slate-500' : 'text-slate-300'}`}>
                                {task}
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>

                    {/* Progress Bar */}
                    <div className="pt-4 mt-4 border-t border-white/5 space-y-1">
                      <div className="flex justify-between text-[10px] text-slate-500 font-bold uppercase">
                        <span>Progress</span>
                        <span>{progressPct}%</span>
                      </div>
                      <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-500 rounded-full transition-all duration-300" style={{ width: `${progressPct}%` }} />
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
