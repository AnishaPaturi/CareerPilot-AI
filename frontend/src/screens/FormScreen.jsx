import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { resumeVersionAPI, atsAPI } from '../services/api';
import { 
  Sparkles, Wand2, Plus, Info, CheckCircle2, AlertTriangle, 
  Trash2, Save, FileCheck, ArrowRight, ShieldAlert, Award, 
  FileText, Loader2, Copy, Check 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Common technical skills to scan for keyword matching
const COMMON_KEYWORDS = [
  "react", "python", "java", "javascript", "typescript", "node", "express", "django", "spring boot",
  "html", "css", "sql", "docker", "aws", "git", "kubernetes", "c++", "go", "angular", "vue",
  "postgresql", "mongodb", "mysql", "redis", "rest api", "graphql", "devops", "ci/cd", "agile",
  "scrum", "machine learning", "deep learning", "nlp", "tensorflow", "pytorch", "pandas",
  "cloud", "azure", "gcp", "linux", "jira", "figma", "testing", "jest", "cypress"
];

// Weak verbs to flag
const WEAK_VERBS = ["worked on", "helped", "assisted", "responsible for", "was part of", "handled", "participated in"];

// Strong action verbs to encourage
const STRONG_VERBS = ["spearheaded", "designed", "developed", "optimized", "implemented", "architected", "delivered", "orchestrated", "formulated", "executed", "conducted", "authored", "streamlined", "engineered"];

export default function FormScreen() {
  const { user } = useAuth();
  
  // Resume form fields
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    summary: '',
    skills: '',
    experience: '',
    education: '',
    projects: ''
  });

  // Target Job Description for real-time skill matching
  const [jobDescription, setJobDescription] = useState('');
  
  // Version label
  const [versionLabel, setVersionLabel] = useState('');
  const [savedVersions, setSavedVersions] = useState([]);
  const [loadingVersions, setLoadingVersions] = useState(false);
  const [savingVersion, setSavingVersion] = useState(false);

  // Bullet Point Rewriter State
  const [bulletInput, setBulletInput] = useState('');
  const [rewrittenBullet, setRewrittenBullet] = useState('');
  const [rewritingBullet, setRewritingBullet] = useState(false);
  const [showRewriter, setShowRewriter] = useState(false);
  const [copiedBullet, setCopiedBullet] = useState(false);

  // Load saved versions on mount
  useEffect(() => {
    if (user?.id) {
      fetchVersions();
      
      // Seed initial data from localStorage if exists
      const localData = localStorage.getItem('resumeData');
      if (localData) {
        try {
          setFormData(JSON.parse(localData));
        } catch(e) {}
      } else if (user) {
        setFormData(prev => ({
          ...prev,
          name: user.name || '',
          email: user.email || ''
        }));
      }
    }
  }, [user?.id]);

  const fetchVersions = async () => {
    setLoadingVersions(true);
    try {
      const versions = await resumeVersionAPI.getAll(user.id);
      setSavedVersions(versions);
    } catch(err) {
      console.error("Failed to load resume versions:", err);
    } finally {
      setLoadingVersions(false);
    }
  };

  const handleChange = (e) => {
    const updated = { ...formData, [e.target.name]: e.target.value };
    setFormData(updated);
    localStorage.setItem('resumeData', JSON.stringify(updated));
  };

  const handleSaveVersion = async (e) => {
    e.preventDefault();
    if (!versionLabel.trim()) {
      alert("Please enter a name for this version.");
      return;
    }
    setSavingVersion(true);
    try {
      const payload = {
        studentId: user.id,
        label: versionLabel.trim(),
        templateId: "default",
        resumeData: JSON.stringify(formData),
        pdfUrl: ""
      };
      await resumeVersionAPI.save(payload);
      setVersionLabel('');
      alert("Resume version saved successfully!");
      fetchVersions();
    } catch(err) {
      console.error(err);
      alert("Failed to save resume version: " + err.message);
    } finally {
      setSavingVersion(false);
    }
  };

  const handleLoadVersion = (version) => {
    try {
      const parsed = typeof version.resumeData === 'string' ? JSON.parse(version.resumeData) : version.resumeData;
      setFormData(parsed);
      localStorage.setItem('resumeData', JSON.stringify(parsed));
      alert(`Loaded version: "${version.label}"`);
    } catch(e) {
      alert("Failed to parse resume version data.");
    }
  };

  const handleDeleteVersion = async (id, e) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this version?")) return;
    try {
      await resumeVersionAPI.delete(id);
      fetchVersions();
    } catch(err) {
      alert("Failed to delete version: " + err.message);
    }
  };

  const handleRewriteBullet = async () => {
    if (!bulletInput.trim()) return;
    setRewritingBullet(true);
    setRewrittenBullet('');
    try {
      const data = await atsAPI.rewrite({
        section: bulletInput.trim(),
        style: "professional",
        job_description: jobDescription || null,
        mode: "improve"
      });
      setRewrittenBullet(data.rewritten);
    } catch(err) {
      alert("Failed to rewrite bullet point: " + err.message);
    } finally {
      setRewritingBullet(false);
    }
  };

  // Real-time ATS Parser & Simulator Logic
  const runSimulator = () => {
    const textToScan = `${formData.summary} ${formData.skills} ${formData.experience} ${formData.projects}`.toLowerCase();
    
    // 1. Contact Info & Formatting check
    const hasEmail = /([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6})/.test(formData.email);
    const hasPhone = formData.phone.trim().length > 7;
    const formatScore = (hasEmail ? 50 : 0) + (hasPhone ? 50 : 0);

    // 2. Action Verbs Audit
    let weakCount = 0;
    let strongCount = 0;
    WEAK_VERBS.forEach(verb => {
      const regex = new RegExp(`\\b${verb}\\b`, 'g');
      const matches = textToScan.match(regex);
      if (matches) weakCount += matches.length;
    });
    STRONG_VERBS.forEach(verb => {
      const regex = new RegExp(`\\b${verb}\\b`, 'g');
      const matches = textToScan.match(regex);
      if (matches) strongCount += matches.length;
    });

    let verbScore = 50;
    if (strongCount > 0) verbScore += Math.min(50, strongCount * 10);
    if (weakCount > 0) verbScore -= Math.min(40, weakCount * 10);
    verbScore = Math.max(10, Math.min(100, verbScore));

    // 3. Metrics/Percentages Check
    const hasMetrics = /[\d]+%|[\d]+\s*percent|\$[\d]+[kKmM]?|[\d]+\s*(?:million|billion|x|X|times)/.test(textToScan);
    const metricsScore = hasMetrics ? 100 : 40;

    // 4. Keywords/Job Description Match
    let matchedKeywords = [];
    let missingKeywords = [];
    let matchScore = 0;

    if (jobDescription.trim()) {
      // Find what keywords from JD are in resume
      const jdLower = jobDescription.toLowerCase();
      const skillsInJd = COMMON_KEYWORDS.filter(skill => {
        if (skill === "c++") return jdLower.includes("c++");
        return new RegExp(`\\b${skill}\\b`, 'g').test(jdLower);
      });

      if (skillsInJd.length > 0) {
        skillsInJd.forEach(skill => {
          const hasSkill = skill === "c++" ? textToScan.includes("c++") : new RegExp(`\\b${skill}\\b`, 'g').test(textToScan);
          if (hasSkill) {
            matchedKeywords.push(skill);
          } else {
            missingKeywords.push(skill);
          }
        });
        matchScore = Math.round((matchedKeywords.length / skillsInJd.length) * 100);
      } else {
        // Fallback standard keywords
        const standardMatches = COMMON_KEYWORDS.filter(skill => textToScan.includes(skill));
        matchScore = Math.min(100, 30 + (standardMatches.length * 8));
      }
    } else {
      // General keywords check
      const matched = COMMON_KEYWORDS.filter(skill => textToScan.includes(skill));
      matchedKeywords = matched;
      matchScore = Math.min(100, 30 + (matched.length * 8));
    }

    const overallScore = Math.round((formatScore + verbScore + metricsScore + matchScore) / 4);

    return {
      overallScore,
      formatScore,
      verbScore,
      metricsScore,
      matchScore,
      weakCount,
      strongCount,
      hasEmail,
      hasPhone,
      hasMetrics,
      matchedKeywords,
      missingKeywords: missingKeywords.slice(0, 6)
    };
  };

  const sim = runSimulator();

  const getScoreColor = (score) => {
    if (score >= 80) return "text-emerald-400 stroke-emerald-500";
    if (score >= 60) return "text-amber-400 stroke-amber-500";
    return "text-red-400 stroke-red-500";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white p-6 font-sans">
      
      {/* Top Header */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center border-b border-white/10 pb-6 mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-2">
            AI Resume Studio <span className="text-purple-400 text-sm font-medium px-2.5 py-0.5 bg-purple-500/10 border border-purple-500/30 rounded-md">BUILDER & SIMULATOR</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">Optimize your professional experience for ATS algorithms in real-time.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => {
              localStorage.setItem('resumeData', JSON.stringify(formData));
              // Redirect to preview
              window.location.href = '/resume/preview';
            }}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold px-6 py-3 rounded-xl transition-all text-sm hover:shadow-lg hover:shadow-purple-500/20 active:scale-95"
          >
            Preview Resume Layout <ArrowRight size={16} />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: RESUME BUILDER FORM (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 shadow-xl space-y-6 backdrop-blur-xl">
            <h2 className="text-xl font-bold flex items-center gap-2 border-b border-white/5 pb-3">
              <FileText className="text-purple-400" size={20} /> Resume Content
            </h2>
            
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 text-xs uppercase font-bold tracking-wider mb-1.5">Full Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all" required />
                </div>
                <div>
                  <label className="block text-slate-400 text-xs uppercase font-bold tracking-wider mb-1.5">Email Address</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all" required />
                </div>
                <div>
                  <label className="block text-slate-400 text-xs uppercase font-bold tracking-wider mb-1.5">Phone Number</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all" />
                </div>
                <div>
                  <label className="block text-slate-400 text-xs uppercase font-bold tracking-wider mb-1.5">Skills (comma separated)</label>
                  <input type="text" name="skills" value={formData.skills} onChange={handleChange} placeholder="e.g. React, Java, SQL, AWS" className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all" />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 text-xs uppercase font-bold tracking-wider mb-1.5">Professional Summary</label>
                <textarea name="summary" value={formData.summary} onChange={handleChange} placeholder="Brief summary of your professional background and goals..." className="w-full h-24 bg-slate-900/60 border border-white/10 rounded-xl p-4 text-white text-sm focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all resize-none" />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-slate-400 text-xs uppercase font-bold tracking-wider">Work Experience</label>
                  <button 
                    type="button" 
                    onClick={() => setShowRewriter(!showRewriter)}
                    className="text-xs text-purple-400 hover:text-purple-300 font-bold flex items-center gap-1 bg-purple-500/10 border border-purple-500/20 px-2.5 py-1 rounded-lg transition-all"
                  >
                    <Wand2 size={12} /> Bullet Rewriter Helper
                  </button>
                </div>
                <textarea name="experience" value={formData.experience} onChange={handleChange} placeholder="Use bullet points starting with - to structure your work achievements..." className="w-full h-36 bg-slate-900/60 border border-white/10 rounded-xl p-4 text-white text-sm focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all font-mono leading-relaxed" />
              </div>

              <div>
                <label className="block text-slate-400 text-xs uppercase font-bold tracking-wider mb-1.5">Projects</label>
                <textarea name="projects" value={formData.projects} onChange={handleChange} placeholder="Describe your technical projects, tech stacks, and metrics..." className="w-full h-32 bg-slate-900/60 border border-white/10 rounded-xl p-4 text-white text-sm focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all font-mono leading-relaxed" />
              </div>

              <div>
                <label className="block text-slate-400 text-xs uppercase font-bold tracking-wider mb-1.5">Education</label>
                <textarea name="education" value={formData.education} onChange={handleChange} placeholder="Degree, University, Graduation Year, CGPA..." className="w-full h-24 bg-slate-900/60 border border-white/10 rounded-xl p-4 text-white text-sm focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all resize-none" />
              </div>
            </form>
          </div>

          {/* Collapsible Bullet Rewriter Panel */}
          <AnimatePresence>
            {showRewriter && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-gradient-to-br from-purple-950/20 via-slate-900/60 to-black/80 border border-purple-500/30 rounded-2xl p-6 shadow-xl backdrop-blur-xl space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-white font-bold text-sm flex items-center gap-2">
                      <Sparkles className="text-purple-400" size={16} /> AI Bullet Point Rewriter
                    </h3>
                    <button onClick={() => setShowRewriter(false)} className="text-slate-400 hover:text-white text-xs">✕ Close</button>
                  </div>
                  <p className="text-xs text-slate-400">Type a weak resume sentence below, and get a professional, metric-focused rewrite aligned with your target JD.</p>
                  
                  <div className="space-y-3">
                    <textarea 
                      value={bulletInput}
                      onChange={e => setBulletInput(e.target.value)}
                      placeholder="e.g., Worked on login screen and fixed some performance bugs"
                      className="w-full h-18 bg-slate-900 border border-white/10 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:ring-1 ring-purple-500"
                    />
                    <button
                      onClick={handleRewriteBullet}
                      disabled={rewritingBullet || !bulletInput.trim()}
                      className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-1.5"
                    >
                      {rewritingBullet ? <Loader2 size={12} className="animate-spin" /> : <Wand2 size={12} />}
                      Rewrite Phrasing
                    </button>
                  </div>

                  {rewrittenBullet && (
                    <div className="p-4 bg-white/[0.02] border border-purple-500/20 rounded-xl space-y-2.5 animate-fadeIn">
                      <div className="flex justify-between items-center border-b border-white/5 pb-1.5">
                        <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">AI Impact Rewrite</span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(rewrittenBullet);
                            setCopiedBullet(true);
                            setTimeout(() => setCopiedBullet(false), 2000);
                          }}
                          className="text-slate-400 hover:text-white flex items-center gap-1 text-[10px] font-semibold"
                        >
                          {copiedBullet ? <Check size={11} className="text-green-400" /> : <Copy size={11} />}
                          {copiedBullet ? 'Copied!' : 'Copy'}
                        </button>
                      </div>
                      <p className="text-xs text-slate-200 leading-relaxed font-mono">{rewrittenBullet}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* RIGHT COLUMN: REAL-TIME ATS SIMULATOR PANEL (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* ATS Score Card */}
          <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 shadow-xl space-y-5 backdrop-blur-xl flex flex-col items-center text-center relative overflow-hidden group">
            <div className="absolute -right-8 -top-8 w-24 h-24 bg-purple-500/5 rounded-full blur-xl group-hover:bg-purple-500/10 transition-all duration-300" />
            
            <div className="space-y-1">
              <span className="text-purple-400 text-[10px] uppercase font-bold tracking-widest">Real-time simulator</span>
              <h3 className="text-white text-base font-bold">ATS Score Preview</h3>
            </div>

            {/* Score circle */}
            <div className="relative w-28 h-28 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="56" cy="56" r="48" className="stroke-white/[0.04]" strokeWidth="8" fill="transparent" />
                <circle cx="56" cy="56" r="48" className={getScoreColor(sim.overallScore).split(" ")[1]} strokeWidth="8" fill="transparent"
                  strokeDasharray={301.6}
                  strokeDashoffset={301.6 - (301.6 * sim.overallScore) / 100}
                  strokeLinecap="round" />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className={`text-3xl font-black ${getScoreColor(sim.overallScore).split(" ")[0]}`}>{sim.overallScore}</span>
                <span className="text-[9px] uppercase font-bold text-slate-500">score</span>
              </div>
            </div>

            {/* Checklists */}
            <div className="w-full text-left space-y-3.5 pt-2">
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  Checklist Breakdown
                </span>
              </div>

              {/* Checks */}
              <div className="space-y-2.5 text-xs">
                <div className="flex items-start justify-between">
                  <div className="flex gap-2 items-center">
                    {sim.hasEmail ? <CheckCircle2 className="text-green-400 w-4 h-4 shrink-0" /> : <ShieldAlert className="text-red-400 w-4 h-4 shrink-0" />}
                    <span className="text-slate-300">Email Address Included</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-semibold">{sim.hasEmail ? "+50 pts" : "0 pts"}</span>
                </div>

                <div className="flex items-start justify-between">
                  <div className="flex gap-2 items-center">
                    {sim.hasPhone ? <CheckCircle2 className="text-green-400 w-4 h-4 shrink-0" /> : <AlertTriangle className="text-amber-400 w-4 h-4 shrink-0" />}
                    <span className="text-slate-300">Phone Number Included</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-semibold">{sim.hasPhone ? "+50 pts" : "0 pts"}</span>
                </div>

                <div className="flex items-start justify-between">
                  <div className="flex gap-2 items-center">
                    {sim.strongCount > 0 ? <CheckCircle2 className="text-green-400 w-4 h-4 shrink-0" /> : <AlertTriangle className="text-amber-400 w-4 h-4 shrink-0" />}
                    <span className="text-slate-300">Strong Action Verbs ({sim.strongCount})</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-semibold">Score: {sim.verbScore}/100</span>
                </div>

                <div className="flex items-start justify-between">
                  <div className="flex gap-2 items-center">
                    {sim.hasMetrics ? <CheckCircle2 className="text-green-400 w-4 h-4 shrink-0" /> : <AlertTriangle className="text-amber-400 w-4 h-4 shrink-0" />}
                    <span className="text-slate-300">Impact Metrics & numbers</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-semibold">{sim.hasMetrics ? "Excellent" : "None detected"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Job Description Parser Box */}
          <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-5 shadow-xl space-y-4 backdrop-blur-xl">
            <h4 className="text-white font-bold text-sm flex items-center gap-1.5">
              <Award className="text-purple-400" size={16} /> Job Description Parser
            </h4>
            <p className="text-xs text-slate-400">Paste a job description below to scan for keyword matching and skill gaps.</p>
            <textarea
              value={jobDescription}
              onChange={e => setJobDescription(e.target.value)}
              placeholder="Paste target job description here..."
              className="w-full h-24 bg-slate-900 border border-white/10 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:ring-1 ring-purple-500 placeholder-slate-600 resize-none"
            />
            {jobDescription && (
              <div className="space-y-3 pt-1 animate-fadeIn">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">JD Matching Score:</span>
                  <span className="text-purple-400 font-bold">{sim.matchScore}%</span>
                </div>
                
                {/* Missing Skills list */}
                {sim.missingKeywords.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider block">Skill Gaps (Missing Keywords):</span>
                    <div className="flex flex-wrap gap-1.5">
                      {sim.missingKeywords.map((skill, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 bg-red-500/10 border border-red-500/20 text-red-300 rounded font-semibold capitalize">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {sim.matchedKeywords.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-green-400 uppercase tracking-wider block">Matched Keywords:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {sim.matchedKeywords.slice(0, 8).map((skill, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 bg-green-500/10 border border-green-500/20 text-green-300 rounded font-semibold capitalize">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Multi-version Resume Management */}
          <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-5 shadow-xl space-y-4 backdrop-blur-xl">
            <h4 className="text-white font-bold text-sm flex items-center gap-1.5">
              <Save className="text-purple-400" size={16} /> Saved Versions Manager
            </h4>
            
            {/* Save New Version Form */}
            <form onSubmit={handleSaveVersion} className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. Frontend Dev, ML Version"
                value={versionLabel}
                onChange={e => setVersionLabel(e.target.value)}
                className="flex-1 bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-purple-500/50"
              />
              <button
                type="submit"
                disabled={savingVersion || !versionLabel.trim()}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50 flex items-center gap-1 shrink-0"
              >
                {savingVersion ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />}
                Save Version
              </button>
            </form>

            {/* List saved versions */}
            <div className="space-y-2 pt-2 border-t border-white/5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Previously Saved (Neon DB)</span>
              
              {loadingVersions ? (
                <div className="flex items-center gap-2 py-4 justify-center text-slate-500 text-xs">
                  <Loader2 size={14} className="animate-spin" />
                  Loading versions...
                </div>
              ) : savedVersions.length === 0 ? (
                <div className="text-center py-4 text-slate-600 italic text-xs">No custom versions saved yet.</div>
              ) : (
                <div className="space-y-1.5 max-h-36 overflow-y-auto">
                  {savedVersions.map(v => (
                    <div
                      key={v.id}
                      onClick={() => handleLoadVersion(v)}
                      className="flex items-center justify-between p-2.5 bg-slate-900/60 hover:bg-white/[0.04] border border-white/5 rounded-xl text-xs cursor-pointer group transition-colors"
                    >
                      <div className="flex items-center gap-2 truncate pr-2">
                        <FileCheck className="text-purple-400 shrink-0" size={14} />
                        <span className="text-slate-200 font-semibold truncate">{v.label}</span>
                      </div>
                      <button
                        onClick={(e) => handleDeleteVersion(v.id, e)}
                        className="text-slate-500 hover:text-red-400 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Delete version"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}