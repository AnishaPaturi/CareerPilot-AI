import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { resumeVersionAPI, atsAPI } from '../services/api';
import { 
  Mail, Send, FileText, Sparkles, Loader2, Copy, Check, 
  Linkedin, User, Building2, ArrowRight, MessageSquare
} from 'lucide-react';

export default function OutreachToolkit() {
  const { user } = useAuth();
  const [resumeVersions, setResumeVersions] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState('');
  const [activeTab, setActiveTab] = useState('email'); // 'email' or 'linkedin'
  
  // Cold Email states
  const [companyName, setCompanyName] = useState('');
  const [roleName, setRoleName] = useState('');
  const [keyStrengths, setKeyStrengths] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [emailResult, setEmailResult] = useState('');
  const [generatingEmail, setGeneratingEmail] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  // LinkedIn states
  const [linkedinResult, setLinkedinResult] = useState('');
  const [generatingLinkedin, setGeneratingLinkedin] = useState(false);
  const [copiedLinkedin, setCopiedLinkedin] = useState(false);
  const [selectedTone, setSelectedTone] = useState('Professional');

  useEffect(() => {
    if (user?.id) {
      fetchResumeVersions();
    }
  }, [user?.id]);

  const fetchResumeVersions = async () => {
    try {
      const data = await resumeVersionAPI.getAll(user.id);
      setResumeVersions(data || []);
      if (data && data.length > 0) {
        setSelectedResumeId(data[0].id.toString());
      }
    } catch (err) {
      console.error("Failed to load resume versions:", err);
    }
  };

  const getResumeText = (resume) => {
    if (!resume || !resume.resumeData) return '';
    try {
      const data = typeof resume.resumeData === 'string' ? JSON.parse(resume.resumeData) : resume.resumeData;
      
      const sections = [];
      if (data.name) sections.push(`Name: ${data.name}`);
      if (data.email) sections.push(`Email: ${data.email}`);
      if (data.summary) sections.push(`Professional Summary:\n${data.summary}`);
      if (data.skills) sections.push(`Skills:\n${data.skills}`);
      if (data.experience) sections.push(`Work Experience:\n${data.experience}`);
      if (data.education) sections.push(`Education:\n${data.education}`);
      if (data.projects) sections.push(`Projects:\n${data.projects}`);
      if (data.certifications) sections.push(`Certifications:\n${data.certifications}`);
      
      return sections.join('\n\n');
    } catch (e) {
      console.error("Failed to parse resume JSON data:", e);
      return '';
    }
  };

  const handleGenerateEmail = async (e) => {
    e.preventDefault();
    if (!companyName.trim() || !roleName.trim()) {
      alert("Company Name and Role are required.");
      return;
    }
    setGeneratingEmail(true);
    setEmailResult('');
    setCopiedEmail(false);
    try {
      const selectedResume = resumeVersions.find(r => r.id.toString() === selectedResumeId);
      const resumeText = selectedResume ? getResumeText(selectedResume) : '';
      
      const data = await atsAPI.generateColdEmail(
        companyName.trim(),
        roleName.trim(),
        keyStrengths.trim(),
        contactPerson.trim(),
        resumeText
      );
      if (data && data.cold_email) {
        setEmailResult(data.cold_email);
      } else {
        throw new Error("No response received");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to generate cold email: " + err.message);
    } finally {
      setGeneratingEmail(false);
    }
  };

  const handleGenerateLinkedIn = async () => {
    setGeneratingLinkedin(true);
    setLinkedinResult('');
    setCopiedLinkedin(false);
    try {
      const selectedResume = resumeVersions.find(r => r.id.toString() === selectedResumeId);
      if (!selectedResume) {
        alert("Please select a resume version first. LinkedIn summaries are generated based on your experience.");
        setGeneratingLinkedin(false);
        return;
      }
      
      const resumeText = getResumeText(selectedResume);
      const data = await atsAPI.generateLinkedInSummary(resumeText, selectedTone);
      if (data && data.linkedin_summary) {
        setLinkedinResult(data.linkedin_summary);
      } else {
        throw new Error("No response received");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to generate LinkedIn summaries: " + err.message);
    } finally {
      setGeneratingLinkedin(false);
    }
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    if (type === 'email') {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } else {
      setCopiedLinkedin(true);
      setTimeout(() => setCopiedLinkedin(false), 2000);
    }
  };

  return (
    <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 text-white max-w-4xl mx-auto shadow-xl backdrop-blur-xl">
      
      {/* Title */}
      <div className="flex items-center gap-2.5 border-b border-white/5 pb-4 mb-6">
        <Send className="text-purple-400" size={24} />
        <div>
          <h2 className="text-2xl font-black text-white">AI Outreach Toolkit</h2>
          <p className="text-xs text-slate-400">Draft personalized hiring outreach emails and optimize your personal brand branding.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/5 mb-6">
        <button
          onClick={() => setActiveTab('email')}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${
            activeTab === 'email' 
              ? 'border-purple-500 text-white bg-white/5' 
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Mail size={16} />
          Cold Email Generator
        </button>
        <button
          onClick={() => setActiveTab('linkedin')}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${
            activeTab === 'linkedin' 
              ? 'border-purple-500 text-white bg-white/5' 
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Linkedin size={16} />
          LinkedIn Summary Optimizer
        </button>
      </div>

      {/* Select Resume Section */}
      <div className="bg-slate-900/40 border border-white/5 rounded-xl p-4 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-0.5">
          <h4 className="text-white text-xs font-bold flex items-center gap-1.5">
            <FileText size={14} className="text-purple-400" />
            Resume Data Source
          </h4>
          <p className="text-[10px] text-slate-500">Select which resume AI should use to extract your experience.</p>
        </div>
        <div className="flex items-center gap-2">
          {resumeVersions.length === 0 ? (
            <span className="text-xs text-yellow-500 font-semibold">
              No saved resumes found. Fill form first.
            </span>
          ) : (
            <select
              value={selectedResumeId}
              onChange={e => setSelectedResumeId(e.target.value)}
              className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-white text-xs cursor-pointer focus:outline-none focus:border-purple-500/50"
            >
              {resumeVersions.map(r => (
                <option key={r.id} value={r.id.toString()}>{r.label}</option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Tab 1: Cold Email Generator */}
      {activeTab === 'email' && (
        <div className="space-y-6">
          <form onSubmit={handleGenerateEmail} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div className="space-y-4">
              <div>
                <label className="block text-slate-400 text-[10px] uppercase font-bold tracking-wider mb-1.5">Company Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Google, Razorpay, Zepto"
                  value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                  className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:border-purple-500/50"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-[10px] uppercase font-bold tracking-wider mb-1.5">Role Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Backend Engineer Intern"
                  value={roleName}
                  onChange={e => setRoleName(e.target.value)}
                  className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:border-purple-500/50"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-[10px] uppercase font-bold tracking-wider mb-1.5">Contact Person Name / Title</label>
                <input
                  type="text"
                  placeholder="e.g. John Doe, Tech Lead"
                  value={contactPerson}
                  onChange={e => setContactPerson(e.target.value)}
                  className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:border-purple-500/50"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-[10px] uppercase font-bold tracking-wider mb-1.5">Your Key Strengths / Focus Area</label>
                <input
                  type="text"
                  placeholder="e.g. React & TypeScript, Distributed systems"
                  value={keyStrengths}
                  onChange={e => setKeyStrengths(e.target.value)}
                  className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:border-purple-500/50"
                />
              </div>

              <button
                type="submit"
                disabled={generatingEmail}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95 shadow-md"
              >
                {generatingEmail ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Drafting Personalized Pitch...
                  </>
                ) : (
                  <>
                    <Sparkles size={14} />
                    Generate Outreach Email
                  </>
                )}
              </button>
            </div>

            {/* Email Output */}
            <div className="bg-slate-900/40 border border-white/5 rounded-xl p-4 flex flex-col min-h-[300px]">
              <div className="flex justify-between items-center border-b border-white/5 pb-2 mb-3">
                <span className="text-xs font-bold text-slate-300">Generated Email Draft</span>
                {emailResult && (
                  <button
                    onClick={() => copyToClipboard(emailResult, 'email')}
                    className="p-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-slate-300 transition-all text-[11px] font-bold flex items-center gap-1"
                  >
                    {copiedEmail ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
                    {copiedEmail ? 'Copied!' : 'Copy'}
                  </button>
                )}
              </div>
              
              <div className="flex-1 overflow-y-auto max-h-[300px]">
                {emailResult ? (
                  <pre className="text-xs text-slate-300 leading-relaxed font-sans whitespace-pre-wrap">{emailResult}</pre>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6">
                    <Mail size={32} className="text-slate-600 mb-2" />
                    <p className="text-xs text-slate-500">Fill in the fields on the left and click generate to create a personalized cold email pitch.</p>
                  </div>
                )}
              </div>
            </div>

          </form>
        </div>
      )}

      {/* Tab 2: LinkedIn Summary Generator */}
      {activeTab === 'linkedin' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="md:col-span-1 space-y-4">
              <div>
                <label className="block text-slate-400 text-[10px] uppercase font-bold tracking-wider mb-1.5">Profile Focus/Tone</label>
                <select
                  value={selectedTone}
                  onChange={e => setSelectedTone(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-xs cursor-pointer focus:outline-none focus:border-purple-500/50"
                >
                  <option value="Professional">Professional (Highlight skills & stats)</option>
                  <option value="Creative">Creative (Original, high-impact terms)</option>
                  <option value="Storytelling">Story-based (Your origin, drive & goals)</option>
                </select>
              </div>

              <button
                onClick={handleGenerateLinkedIn}
                disabled={generatingLinkedin || resumeVersions.length === 0}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95 shadow-md"
              >
                {generatingLinkedin ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Generating Personal Brand Summaries...
                  </>
                ) : (
                  <>
                    <Sparkles size={14} />
                    Generate LinkedIn Summaries
                  </>
                )}
              </button>
            </div>

            {/* LinkedIn Output */}
            <div className="md:col-span-2 bg-slate-900/40 border border-white/5 rounded-xl p-4 flex flex-col min-h-[300px]">
              <div className="flex justify-between items-center border-b border-white/5 pb-2 mb-3">
                <span className="text-xs font-bold text-slate-300">Generated Options</span>
                {linkedinResult && (
                  <button
                    onClick={() => copyToClipboard(linkedinResult, 'linkedin')}
                    className="p-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-slate-300 transition-all text-[11px] font-bold flex items-center gap-1"
                  >
                    {copiedLinkedin ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
                    {copiedLinkedin ? 'Copied All!' : 'Copy All'}
                  </button>
                )}
              </div>
              
              <div className="flex-1 overflow-y-auto max-h-[350px]">
                {linkedinResult ? (
                  <pre className="text-xs text-slate-300 leading-relaxed font-sans whitespace-pre-wrap">{linkedinResult}</pre>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6">
                    <Linkedin size={32} className="text-slate-600 mb-2" />
                    <p className="text-xs text-slate-500">Generate three tailored descriptions based on your profile to highlight on your LinkedIn resume section.</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
