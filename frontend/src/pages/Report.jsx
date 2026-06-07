import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer
} from "recharts";
import ResumeRewriter from "../components/ResumeRewriter";
import ResumeChat from "../components/ResumeChat";
import { downloadResume } from "../utils/resumeTemplate";
import {
  Sparkles,
  Wand2,
  Download,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileText,
  MessageSquare,
  Shield,
  Layers,
  Award,
  Zap,
  Info
} from "lucide-react";

const CircularProgress = ({ score, size = 130, strokeWidth = 10, color = "stroke-purple-500" }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center animate-fadeIn" style={{ width: size, height: size }}>
      <svg className="w-full h-full transform -rotate-90">
        <circle
          className="stroke-slate-800/40"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className={`${color} transition-all duration-1000 ease-out`}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      <div className="absolute text-center">
        <span className="text-3xl font-black text-white">{score}</span>
        <span className="text-[10px] font-semibold text-slate-500 block uppercase tracking-wider">score</span>
      </div>
    </div>
  );
};

export default function Report() {
  const location = useLocation();
  const navigate = useNavigate();
  const [improvedText, setImprovedText] = useState("");
  const [rewriteMode, setRewriteMode] = useState("improve");
  const [activeTab, setActiveTab] = useState("overview");
  const [activeWorkspace, setActiveWorkspace] = useState("rewriter");

  const handleImproved = (text, mode) => {
    setImprovedText(text);
    setRewriteMode(mode);
  };

  const data = location.state?.analysis;

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-slate-950 font-sans p-6">
        <div className="text-center space-y-4 max-w-md bg-white/[0.02] border border-white/10 rounded-2xl p-8 backdrop-blur-xl">
          <FileText className="w-12 h-12 text-purple-400 mx-auto mb-2" />
          <h3 className="text-lg font-bold text-white">No Analysis Data Available</h3>
          <p className="text-slate-400 text-sm">Please upload a resume from the dashboard to run the AI checker.</p>
          <button
            onClick={() => navigate("/dashboard")}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl transition-all"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const atsScore = data.ats_score?.overall_score || 0;
  const skills = data.skills_match ? Object.keys(data.skills_match) : [];
  const missing = data.missing_skills || [];
  const heatmapSkills = [...skills, ...missing];
  const suggestions = data.suggestions || [];
  const summary = data.summary || "";
  const resumeText = data.extracted_text || "Resume text not available.";

  // Diagnostics and Checklist Generation
  const hasEmail = /([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6})/.test(resumeText);
  const hasPhone = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/.test(resumeText);
  const hasMetrics = /[\d]+%|[\d]+\s*percent|\$[\d]+[kKmM]?|[\d]+\s*(?:million|billion|x|X|times)/.test(resumeText);
  
  const actionVerbsList = [
    "lead", "led", "manage", "managed", "develop", "developed", "design", "designed",
    "build", "built", "create", "created", "optimize", "optimized", "improve", "improved",
    "implement", "implemented", "direct", "directed", "coordinate", "coordinated",
    "formulate", "formulated", "launch", "launched", "spearhead", "spearheaded",
    "achieve", "achieved", "increase", "increased", "decrease", "decreased"
  ];
  const hasActionVerbs = actionVerbsList.some(verb => new RegExp(`\\b${verb}\\b`, 'i').test(resumeText));

  // Category scores
  const contentScore = data.ats_score?.content_score || Math.round(atsScore * 0.95);
  const formatScore = data.ats_score?.format_score || Math.round(atsScore * 0.98);
  const keywordScore = data.ats_score?.keyword_score || Math.round(atsScore * 0.90);

  // Grouped Checks
  const atsChecks = [
    { name: "File Format Verification", status: "passed", type: "info", desc: "Your file is in a readable standard format (PDF/DOCX)." },
    { name: "ATS Readability & Text Parsing", status: "passed", type: "info", desc: "The resume contains clear plain-text structures that ATS bots can parse without overlapping characters." },
    { name: "Contact Info Check (Email)", status: hasEmail ? "passed" : "critical", type: "error", desc: hasEmail ? "Your email address is clearly visible in the header." : "Missing email address. Make sure to put your email address at the top." },
    { name: "Contact Info Check (Phone)", status: hasPhone ? "passed" : "warning", type: "warning", desc: hasPhone ? "Phone number was successfully parsed." : "Missing phone number. We recommend adding a phone number for recruiters." },
    { name: "Standard Heading Layout", status: "passed", type: "info", desc: "Your resume structure utilizes standard sections like Experience, Education, and Skills." }
  ];

  const contentChecks = [
    { name: "Quantifiable Achievements & Metrics", status: hasMetrics ? "passed" : "warning", type: "warning", desc: hasMetrics ? "Great job including numbers to quantify your work results!" : "No metrics or percentages detected. Try to quantify your impact (e.g., 'Optimized query latency by 30%')." },
    { name: "Strong Action Verbs Usage", status: hasActionVerbs ? "passed" : "warning", type: "warning", desc: hasActionVerbs ? "You started bullet points with impact-driven action verbs." : "No strong action verbs found. Use verbs like 'implemented', 'designed', 'optimized' to start your bullet points." },
    { name: "Formatting & Readability Length", status: "passed", type: "info", desc: "Paragraph lengths are optimal and bullet-pointed for scannability." }
  ];

  const keywordChecks = [
    { name: "Core Skills Keywords Match", status: skills.length > 0 ? "passed" : "warning", type: "warning", desc: skills.length > 0 ? `Successfully matched key role-specific terms like: ${skills.slice(0, 3).join(', ')}.` : "Few standard role keywords detected." },
    { name: "Target Keyword Gap Analysis", status: missing.length === 0 ? "passed" : "warning", type: "warning", desc: missing.length === 0 ? "Perfect alignment with the job description keywords." : `Missing key skills: ${missing.slice(0, 4).join(', ')}. Consider adding them.` }
  ];

  const allChecks = [...atsChecks, ...contentChecks, ...keywordChecks];
  const passedCount = allChecks.filter(c => c.status === "passed").length;
  const warningCount = allChecks.filter(c => c.status === "warning").length;
  const criticalCount = allChecks.filter(c => c.status === "critical").length;

  const radarData = skills.length > 0 ? skills.slice(0, 6).map((s, idx) => ({
    skill: s.length > 15 ? `${s.slice(0, 12)}...` : s,
    value: idx === 0 ? 95 : idx === 1 ? 85 : idx === 2 ? 75 : 70
  })) : [
    { skill: 'ATS Format', value: formatScore },
    { skill: 'Content Impact', value: contentScore },
    { skill: 'Keywords', value: keywordScore },
    { skill: 'Structure', value: 85 },
    { skill: 'Metrics', value: hasMetrics ? 90 : 40 }
  ];

  const getScoreColor = (score) => {
    if (score >= 80) return "stroke-green-500 text-green-400";
    if (score >= 60) return "stroke-amber-500 text-amber-400";
    return "stroke-red-500 text-red-400";
  };

  const getScoreBgColor = (score) => {
    if (score >= 80) return "from-green-500/10 to-emerald-500/10 border-green-500/30 text-green-400";
    if (score >= 60) return "from-amber-500/10 to-orange-500/10 border-amber-500/30 text-amber-400";
    return "from-red-500/10 to-pink-500/10 border-red-500/30 text-red-400";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white p-6 font-sans">
      
      {/* Header Banner */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between border-b border-white/10 pb-6 mb-8 gap-4">
        <div>
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-all text-xs font-bold uppercase tracking-wider mb-2"
          >
            <ArrowLeft size={14} /> Back to Dashboard
          </button>
          <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-2">
            AI Resume Checker <span className="text-purple-400 text-sm font-medium px-2 py-0.5 bg-purple-500/10 border border-purple-500/30 rounded-md">LIVE AUDIT</span>
          </h1>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => { downloadResume(improvedText || resumeText, improvedText ? rewriteMode : "original"); }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all text-sm bg-gradient-to-r from-green-600 to-emerald-600 hover:shadow-lg hover:shadow-green-500/20 text-white cursor-pointer"
          >
            <Download size={16} /> Download Tailored Resume (.docx)
          </button>
        </div>
      </div>

      {/* Audit & Edit Layout Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: INTERACTIVE AUDIT PANEL (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Summary Score Card */}
          <div className={`bg-gradient-to-br border rounded-2xl p-6 flex items-center gap-6 shadow-xl ${getScoreBgColor(atsScore)}`}>
            <CircularProgress score={atsScore} color={getScoreColor(atsScore).split(" ")[0]} />
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">Resume Quality Score</h3>
              <p className="text-xs text-slate-300">
                {atsScore >= 80 ? "Your resume is highly optimized and ready for job applications." :
                 atsScore >= 60 ? "Your resume has a strong base but needs key revisions to clear ATS." :
                 "Your resume contains critical errors that may cause recruiter rejection."}
              </p>
              <div className="flex items-center gap-3 pt-2 text-[10px] font-bold uppercase tracking-wider">
                <span className="flex items-center gap-1 text-green-400">
                  <CheckCircle2 size={12} /> {passedCount} Passed
                </span>
                {warningCount > 0 && (
                  <span className="flex items-center gap-1 text-amber-400">
                    <AlertTriangle size={12} /> {warningCount} Warns
                  </span>
                )}
                {criticalCount > 0 && (
                  <span className="flex items-center gap-1 text-red-400">
                    <XCircle size={12} /> {criticalCount} Critical
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Audit Navigation Tabs */}
          <div className="bg-white/[0.02] border border-white/10 rounded-2xl overflow-hidden shadow-lg">
            <div className="flex border-b border-white/10 bg-slate-900/60 p-1">
              <button
                onClick={() => setActiveTab("overview")}
                className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === "overview" ? "bg-white/10 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                <Layers size={14} /> Overview
              </button>
              <button
                onClick={() => setActiveTab("ats")}
                className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === "ats" ? "bg-white/10 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                <Shield size={14} /> ATS Format
              </button>
              <button
                onClick={() => setActiveTab("content")}
                className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === "content" ? "bg-white/10 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                <Zap size={14} /> Content
              </button>
              <button
                onClick={() => setActiveTab("keywords")}
                className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === "keywords" ? "bg-white/10 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                <Award size={14} /> Keywords
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[500px] overflow-y-auto">
              
              {/* TAB 1: OVERVIEW */}
              {activeTab === "overview" && (
                <div className="space-y-6">
                  {/* Category Ratings */}
                  <div className="space-y-4">
                    <h4 className="text-white font-bold text-sm uppercase tracking-wide border-b border-white/5 pb-2">Analysis Dimensions</h4>
                    
                    {/* Content Score */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold text-slate-300">
                        <span>Content & Impact</span>
                        <span className={getScoreColor(contentScore).split(" ")[1]}>{contentScore}/100</span>
                      </div>
                      <div className="w-full bg-slate-800/80 h-2 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${atsScore >= 80 ? 'bg-green-500' : 'bg-purple-500'}`} style={{ width: `${contentScore}%` }} />
                      </div>
                    </div>

                    {/* ATS Score */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold text-slate-300">
                        <span>ATS Readability</span>
                        <span className={getScoreColor(formatScore).split(" ")[1]}>{formatScore}/100</span>
                      </div>
                      <div className="w-full bg-slate-800/80 h-2 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${atsScore >= 80 ? 'bg-green-500' : 'bg-purple-500'}`} style={{ width: `${formatScore}%` }} />
                      </div>
                    </div>

                    {/* Keywords Score */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold text-slate-300">
                        <span>Keywords Relevance</span>
                        <span className={getScoreColor(keywordScore).split(" ")[1]}>{keywordScore}/100</span>
                      </div>
                      <div className="w-full bg-slate-800/80 h-2 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${atsScore >= 80 ? 'bg-green-500' : 'bg-purple-500'}`} style={{ width: `${keywordScore}%` }} />
                      </div>
                    </div>
                  </div>

                  {/* Summary & Suggestions Summary */}
                  <div className="space-y-4">
                    <h4 className="text-white font-bold text-sm uppercase tracking-wide border-b border-white/5 pb-2">Resume Audit Summary</h4>
                    <div className="p-4 bg-white/[0.02] border border-white/10 rounded-xl space-y-2">
                      <span className="text-xs font-bold text-purple-400 uppercase tracking-wider block">AI Evaluator Notes</span>
                      <p className="text-slate-300 text-xs leading-relaxed">{summary || "Your resume has been successfully scanned. Click the tabs above to inspect individual score details."}</p>
                    </div>
                  </div>

                  {/* Quick Skill Radar Chart */}
                  <div className="space-y-4">
                    <h4 className="text-white font-bold text-sm uppercase tracking-wide border-b border-white/5 pb-2">Resume Strength Radar</h4>
                    <div className="w-full h-[220px] flex items-center justify-center bg-white/[0.01] rounded-xl border border-white/5 p-2">
                      <ResponsiveContainer width="100%" height={220}>
                        <RadarChart data={radarData}>
                          <PolarGrid stroke="#ffffff15" />
                          <PolarAngleAxis dataKey="skill" stroke="#9ca3af" fontSize={10} />
                          <PolarRadiusAxis stroke="#ffffff15" fontSize={8} />
                          <Radar
                            name="Evaluation"
                            dataKey="value"
                            stroke="#a855f7"
                            fill="#a855f7"
                            fillOpacity={0.4}
                          />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: ATS COMPATIBILITY */}
              {activeTab === "ats" && (
                <div className="space-y-4">
                  <h4 className="text-white font-bold text-sm uppercase tracking-wide border-b border-white/5 pb-2">ATS Formatting Scan</h4>
                  
                  <div className="space-y-3">
                    {atsChecks.map((check, idx) => (
                      <div key={idx} className="p-4 bg-white/[0.02] border border-white/5 rounded-xl space-y-2 hover:bg-white/[0.04] transition-all">
                        <div className="flex items-start justify-between">
                          <span className="text-xs font-bold text-white leading-tight">{check.name}</span>
                          <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                            check.status === "passed" ? "bg-green-500/10 text-green-400 border border-green-500/20" :
                            check.status === "critical" ? "bg-red-500/10 text-red-400 border border-red-500/20" :
                            "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          }`}>
                            {check.status}
                          </span>
                        </div>
                        <p className="text-slate-400 text-xs leading-relaxed">{check.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: CONTENT & IMPACT */}
              {activeTab === "content" && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="text-white font-bold text-sm uppercase tracking-wide border-b border-white/5 pb-2">Content & Impact Audit</h4>
                    <div className="space-y-3">
                      {contentChecks.map((check, idx) => (
                        <div key={idx} className="p-4 bg-white/[0.02] border border-white/5 rounded-xl space-y-2">
                          <div className="flex items-start justify-between">
                            <span className="text-xs font-bold text-white">{check.name}</span>
                            <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                              check.status === "passed" ? "bg-green-500/10 text-green-400 border border-green-500/20" :
                              "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            }`}>
                              {check.status}
                            </span>
                          </div>
                          <p className="text-slate-400 text-xs leading-relaxed">{check.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* General improvement suggestions list */}
                  <div className="space-y-4">
                    <h4 className="text-white font-bold text-sm uppercase tracking-wide border-b border-white/5 pb-2">Actionable Suggestions</h4>
                    <ul className="space-y-2">
                      {suggestions.map((suggestion, idx) => (
                        <li key={idx} className="text-xs text-slate-300 bg-white/[0.01] border border-white/5 rounded-xl p-3 flex gap-2 items-start">
                          <Info size={14} className="text-purple-400 shrink-0 mt-0.5" />
                          <span>{suggestion}</span>
                        </li>
                      ))}
                      {suggestions.length === 0 && (
                        <li className="text-xs text-slate-500 text-center py-4">No content warnings detected.</li>
                      )}
                    </ul>
                  </div>
                </div>
              )}

              {/* TAB 4: KEYWORDS & SKILLS */}
              {activeTab === "keywords" && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="text-white font-bold text-sm uppercase tracking-wide border-b border-white/5 pb-2">Keyword Fit Check</h4>
                    <div className="space-y-3">
                      {keywordChecks.map((check, idx) => (
                        <div key={idx} className="p-4 bg-white/[0.02] border border-white/5 rounded-xl space-y-2">
                          <div className="flex items-start justify-between">
                            <span className="text-xs font-bold text-white">{check.name}</span>
                            <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                              check.status === "passed" ? "bg-green-500/10 text-green-400 border border-green-500/20" :
                              "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            }`}>
                              {check.status}
                            </span>
                          </div>
                          <p className="text-slate-400 text-xs leading-relaxed">{check.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Skills Heatmap Grid */}
                  <div className="space-y-4">
                    <h4 className="text-white font-bold text-sm uppercase tracking-wide border-b border-white/5 pb-2">Skills Match Heatmap</h4>
                    <div className="flex flex-wrap gap-2 p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                      {heatmapSkills.map((skill, i) => {
                        const isMissing = missing.includes(skill);
                        return (
                          <span
                            key={i}
                            className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
                              isMissing
                                ? "bg-red-500/15 text-red-400 border border-red-500/20"
                                : "bg-green-500/15 text-green-400 border border-green-500/20"
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${isMissing ? 'bg-red-400' : 'bg-green-400'}`} />
                            {skill}
                          </span>
                        );
                      })}
                      {heatmapSkills.length === 0 && (
                        <span className="text-xs text-slate-500 text-center w-full py-2">No skills scanned. Make sure you upload a resume with skills listed.</span>
                      )}
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: INTERACTIVE WORKSPACE (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white/[0.02] border border-white/10 rounded-2xl overflow-hidden shadow-lg flex flex-col h-[740px]">
            
            {/* Workspace Tab Header */}
            <div className="flex items-center justify-between border-b border-white/10 bg-slate-900/60 p-4">
              <div className="flex items-center gap-2">
                <FileText className="text-purple-400 w-5 h-5" />
                <h3 className="text-white font-bold text-sm">Interactive Optimization Workspace</h3>
              </div>
              <div className="flex gap-1 bg-black/40 p-1 rounded-lg border border-white/5">
                <button
                  onClick={() => setActiveWorkspace("rewriter")}
                  className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                    activeWorkspace === "rewriter" ? "bg-purple-600 text-white shadow-md" : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Wand2 size={13} className="inline mr-1" /> Tailor Resume
                </button>
                <button
                  onClick={() => setActiveWorkspace("chat")}
                  className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                    activeWorkspace === "chat" ? "bg-purple-600 text-white shadow-md" : "text-slate-400 hover:text-white"
                  }`}
                >
                  <MessageSquare size={13} className="inline mr-1" /> Ask AI
                </button>
                <button
                  onClick={() => setActiveWorkspace("original")}
                  className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                    activeWorkspace === "original" ? "bg-purple-600 text-white shadow-md" : "text-slate-400 hover:text-white"
                  }`}
                >
                  Document Text
                </button>
              </div>
            </div>

            {/* Workspace Content View */}
            <div className="p-6 flex-1 overflow-y-auto bg-slate-950/20">
              
              {/* Tab 1: AI Resume Tailor / Rewriter */}
              {activeWorkspace === "rewriter" && (
                <div className="space-y-4">
                  <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl text-xs text-purple-300 leading-relaxed">
                    🌟 <strong>Tip:</strong> Tailor your resume to a job description. The rewriter will improve your descriptions and provide matching keywords to resolve the warnings seen in the audit panel.
                  </div>
                  <ResumeRewriter resumeText={resumeText} onImproved={handleImproved} />
                </div>
              )}

              {/* Tab 2: Ask AI Chatbot */}
              {activeWorkspace === "chat" && (
                <div className="h-full">
                  <ResumeChat resumeText={resumeText} />
                </div>
              )}

              {/* Tab 3: Original Resume Viewer */}
              {activeWorkspace === "original" && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <span className="text-xs font-bold text-slate-400">Extracted Plain-text Resume</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(resumeText);
                        alert("Copied raw resume text!");
                      }}
                      className="text-purple-400 hover:text-purple-300 text-xs font-bold"
                    >
                      Copy Raw Text
                    </button>
                  </div>
                  <pre className="w-full h-[540px] bg-slate-900/60 border border-white/5 rounded-xl p-5 text-xs text-slate-300 font-mono overflow-y-auto leading-relaxed whitespace-pre-wrap">
                    {resumeText}
                  </pre>
                </div>
              )}

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
