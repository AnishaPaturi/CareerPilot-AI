import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { applicationsAPI, resumeVersionAPI, atsAPI } from '../services/api';
import { 
  Briefcase, Plus, Trash2, Edit2, ExternalLink, Calendar, 
  AlertCircle, Sparkles, Loader2, Search, CheckCircle, Clock, 
  ArrowRight, X, Info, ChevronRight, FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const COLUMNS = [
  { id: 'APPLIED', title: 'Applied', color: 'border-blue-500/30 text-blue-400 bg-blue-500/5' },
  { id: 'SHORTLISTED', title: 'Shortlisted', color: 'border-yellow-500/30 text-yellow-400 bg-yellow-500/5' },
  { id: 'TEST', title: 'Assessment', color: 'border-orange-500/30 text-orange-400 bg-orange-500/5' },
  { id: 'INTERVIEW', title: 'Interviews', color: 'border-purple-500/30 text-purple-400 bg-purple-500/5' },
  { id: 'SELECTED', title: 'Offer Received', color: 'border-green-500/30 text-green-400 bg-green-500/5' },
  { id: 'REJECTED', title: 'Archived', color: 'border-red-500/30 text-red-400 bg-red-500/5' }
];

export default function JobTracker() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [resumeVersions, setResumeVersions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editingApp, setEditingApp] = useState(null);
  
  // Form states
  const [companyName, setCompanyName] = useState('');
  const [roleName, setRoleName] = useState('');
  const [jobUrl, setJobUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState('APPLIED');
  const [followUpDate, setFollowUpDate] = useState('');
  const [matchScore, setMatchScore] = useState('');
  
  // AI Matcher State
  const [selectedResumeId, setSelectedResumeId] = useState('');
  const [jobDescriptionText, setJobDescriptionText] = useState('');
  const [calculatingMatch, setCalculatingMatch] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState(null);

  useEffect(() => {
    if (user?.id) {
      fetchApplications();
      fetchResumeVersions();
    }
  }, [user?.id]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const data = await applicationsAPI.getByStudent(user.id);
      setApplications(data || []);
    } catch (err) {
      console.error("Failed to load applications:", err);
    } finally {
      setLoading(false);
    }
  };

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

  // Convert resume version JSON schema to text for the JD parser
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

  const handleCalculateMatch = async () => {
    if (!selectedResumeId) {
      alert("Please select a resume version first.");
      return;
    }
    if (!jobDescriptionText.trim()) {
      alert("Please paste a job description.");
      return;
    }
    
    setCalculatingMatch(true);
    setAiSuggestions(null);
    try {
      const selectedResume = resumeVersions.find(r => r.id.toString() === selectedResumeId);
      if (!selectedResume) throw new Error("Selected resume version not found");
      
      const resumeText = getResumeText(selectedResume);
      if (!resumeText) throw new Error("Selected resume contains no readable data.");
      
      const data = await atsAPI.matchJob(resumeText, jobDescriptionText.trim());
      
      if (data) {
        const score = data.match_percentage !== undefined ? data.match_percentage : data.score || 70;
        setMatchScore(score.toString());
        setAiSuggestions(data);
      }
    } catch (err) {
      console.error("Error matching job description:", err);
      alert("Failed to calculate AI match score: " + err.message);
    } finally {
      setCalculatingMatch(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingApp(null);
    setCompanyName('');
    setRoleName('');
    setJobUrl('');
    setNotes('');
    setStatus('APPLIED');
    setFollowUpDate('');
    setMatchScore('');
    setJobDescriptionText('');
    setAiSuggestions(null);
    if (resumeVersions.length > 0) {
      setSelectedResumeId(resumeVersions[0].id.toString());
    }
    setShowModal(true);
  };

  const handleOpenEditModal = (app) => {
    setEditingApp(app);
    setCompanyName(app.companyName || '');
    setRoleName(app.role || '');
    setJobUrl(app.jobUrl || '');
    setNotes(app.notes || '');
    setStatus(app.status || 'APPLIED');
    setFollowUpDate(app.followUpDate || '');
    setMatchScore(app.matchScore !== null && app.matchScore !== undefined ? app.matchScore.toString() : '');
    setJobDescriptionText('');
    setAiSuggestions(null);
    setShowModal(true);
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this job application?")) return;
    try {
      await applicationsAPI.delete(id);
      setApplications(prev => prev.filter(app => app.id !== id));
    } catch (err) {
      alert("Failed to delete application: " + err.message);
    }
  };

  const handleSaveApplication = async (e) => {
    e.preventDefault();
    if (!companyName.trim() || !roleName.trim()) {
      alert("Company Name and Role are required.");
      return;
    }

    const payload = {
      studentId: user.id,
      companyName: companyName.trim(),
      role: roleName.trim(),
      status: status,
      jobUrl: jobUrl.trim(),
      notes: notes.trim(),
      followUpDate: followUpDate || null,
      matchScore: matchScore ? parseInt(matchScore) : null,
      isExternal: true
    };

    try {
      if (editingApp) {
        const updated = await applicationsAPI.update(editingApp.id, payload);
        setApplications(prev => prev.map(a => a.id === editingApp.id ? updated : a));
        alert("Application updated successfully!");
      } else {
        const created = await applicationsAPI.create(payload);
        setApplications(prev => [created, ...prev]);
        alert("Application added successfully!");
      }
      setShowModal(false);
    } catch (err) {
      alert("Failed to save application: " + err.message);
    }
  };

  // HTML5 Drag-and-Drop Handlers
  const handleDragStart = (e, appId) => {
    e.dataTransfer.setData('applicationId', appId.toString());
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e, targetStatus) => {
    e.preventDefault();
    const appIdStr = e.dataTransfer.getData('applicationId');
    if (!appIdStr) return;
    
    const appId = parseInt(appIdStr);
    const appToUpdate = applications.find(a => a.id === appId);
    if (!appToUpdate || appToUpdate.status === targetStatus) return;

    // Optimistic UI update
    setApplications(prev => prev.map(a => a.id === appId ? { ...a, status: targetStatus } : a));

    try {
      await applicationsAPI.update(appId, { ...appToUpdate, status: targetStatus });
    } catch (err) {
      console.error("Failed to update status on server:", err);
      // Revert if error
      fetchApplications();
    }
  };

  const handleQuickMove = async (app, targetStatus) => {
    if (app.status === targetStatus) return;
    
    // Optimistic UI update
    setApplications(prev => prev.map(a => a.id === app.id ? { ...a, status: targetStatus } : a));

    try {
      await applicationsAPI.update(app.id, { ...app, status: targetStatus });
    } catch (err) {
      console.error("Failed to update status on server:", err);
      fetchApplications();
    }
  };

  // Filtering
  const filteredApps = applications.filter(app => {
    const term = searchQuery.toLowerCase();
    const matchesSearch = 
      (app.companyName || '').toLowerCase().includes(term) ||
      (app.role || '').toLowerCase().includes(term) ||
      (app.notes || '').toLowerCase().includes(term);
    return matchesSearch;
  });

  // Calculate upcoming follow ups
  const upcomingFollowUps = applications.filter(app => {
    if (!app.followUpDate || app.status === 'SELECTED' || app.status === 'REJECTED') return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const fDate = new Date(app.followUpDate);
    fDate.setHours(0, 0, 0, 0);
    
    // Within next 7 days, or overdue
    const diffTime = fDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  });

  const getScoreColor = (score) => {
    if (score === null || score === undefined) return 'text-slate-400 bg-slate-400/10 border-slate-500/20';
    if (score >= 80) return 'text-green-400 bg-green-500/10 border-green-500/25';
    if (score >= 60) return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/25';
    return 'text-red-400 bg-red-500/10 border-red-500/25';
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Header and Quick Stats */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            <Briefcase className="text-purple-400" size={24} />
            Job Applications Board
          </h2>
          <p className="text-slate-400 text-xs mt-0.5">Manage your applications pipeline, calculate AI match scores, and track follow-ups.</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-xl text-xs font-bold transition-all active:scale-95 shadow-md flex items-center gap-2"
        >
          <Plus size={16} />
          Add External Job
        </button>
      </div>

      {/* Grid of Search, Filters, and Follow-up Reminders */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Search & Statistics */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex bg-slate-900/40 border border-white/5 rounded-xl px-3 py-2.5 items-center gap-2 backdrop-blur-md">
            <Search className="text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Search by company, role, or keywords..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-white text-xs w-full placeholder-slate-500"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-slate-400 hover:text-white">
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Follow-up Banner */}
        <div className="lg:col-span-1">
          <div className="bg-slate-900/40 border border-white/5 rounded-xl p-3.5 flex items-center gap-3 backdrop-blur-md">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 border border-purple-500/20">
              <Calendar size={18} />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-black tracking-wider">Follow-up Alerts</div>
              <div className="text-white text-sm font-bold mt-0.5">
                {upcomingFollowUps.length} Pending Actions
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Follow-ups Drawer/List */}
      {upcomingFollowUps.length > 0 && (
        <div className="bg-purple-950/20 border border-purple-500/20 rounded-2xl p-4 space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
            <AlertCircle size={14} className="text-purple-400" />
            Reminders: Upcoming or Overdue Follow-ups
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {upcomingFollowUps.map(app => {
              const overdue = new Date(app.followUpDate) < new Date();
              return (
                <div 
                  key={app.id} 
                  className={`p-3 rounded-xl border flex justify-between items-center bg-slate-950/40 ${overdue ? 'border-red-500/20' : 'border-white/5'}`}
                >
                  <div className="space-y-0.5">
                    <div className="text-white text-xs font-bold flex items-center gap-1">
                      {app.companyName}
                      {overdue && <span className="text-[9px] bg-red-500/20 text-red-400 px-1.5 py-0.2 rounded-full border border-red-500/30">Overdue</span>}
                    </div>
                    <div className="text-slate-400 text-[10px]">{app.role}</div>
                    <div className="text-slate-500 text-[9px] flex items-center gap-1 mt-1">
                      <Clock size={10} />
                      Due: {new Date(app.followUpDate).toLocaleDateString('en-IN', { day:'numeric', month:'short' })}
                    </div>
                  </div>
                  <button 
                    onClick={() => handleOpenEditModal(app)}
                    className="p-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-slate-300 transition-all text-[10px] font-bold"
                  >
                    Action
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Kanban Board Layout */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 size={36} className="animate-spin text-purple-500" />
          <p className="text-slate-400 text-xs">Loading your application pipeline...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 overflow-x-auto pb-4">
          
          {COLUMNS.map(col => {
            const colApps = filteredApps.filter(app => app.status === col.id);
            
            return (
              <div 
                key={col.id}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, col.id)}
                className="bg-white/[0.02] border border-white/5 rounded-2xl p-3 flex flex-col min-h-[450px] min-w-[180px] backdrop-blur-xl transition-all hover:bg-white/[0.03]"
              >
                {/* Column Title */}
                <div className={`border-b pb-2 mb-3 flex justify-between items-center ${col.color}`}>
                  <span className="text-xs font-black uppercase tracking-wider">{col.title}</span>
                  <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded-full font-bold text-slate-300">
                    {colApps.length}
                  </span>
                </div>

                {/* Cards Container */}
                <div className="flex-1 space-y-3 overflow-y-auto">
                  {colApps.map(app => (
                    <div
                      key={app.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, app.id)}
                      onClick={() => handleOpenEditModal(app)}
                      className="bg-slate-900/60 border border-white/5 hover:border-purple-500/30 rounded-xl p-3 cursor-grab active:cursor-grabbing transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-500/5 group relative"
                    >
                      {/* Match Score Badge */}
                      {app.matchScore !== null && app.matchScore !== undefined && (
                        <div className={`absolute top-2 right-2 text-[9px] px-1.5 py-0.5 rounded-md border font-black ${getScoreColor(app.matchScore)}`}>
                          AI Match: {app.matchScore}%
                        </div>
                      )}

                      <div className="space-y-1 pr-12">
                        <h4 className="text-white text-xs font-bold truncate group-hover:text-purple-400 transition-colors">
                          {app.companyName}
                        </h4>
                        <p className="text-slate-400 text-[10px] truncate">{app.role}</p>
                      </div>

                      {/* Info & Badges */}
                      <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[9px]">
                        <span className="text-slate-500">
                          {app.appliedOn 
                            ? new Date(app.appliedOn).toLocaleDateString('en-IN', { day:'numeric', month:'short' })
                            : 'Manually added'}
                        </span>
                        
                        <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          {app.jobUrl && (
                            <a 
                              href={app.jobUrl} 
                              target="_blank" 
                              rel="noreferrer" 
                              onClick={e => e.stopPropagation()}
                              className="p-1 bg-white/5 hover:bg-white/10 rounded text-slate-400 hover:text-white"
                            >
                              <ExternalLink size={10} />
                            </a>
                          )}
                          <button 
                            onClick={(e) => handleDelete(app.id, e)}
                            className="p-1 bg-white/5 hover:bg-red-500/20 rounded text-slate-400 hover:text-red-400"
                          >
                            <Trash2 size={10} />
                          </button>
                        </div>
                      </div>

                      {/* Quick Shift buttons for mobile/alternative navigation */}
                      <div className="mt-2 pt-2 border-t border-white/5 flex gap-1 justify-end lg:hidden">
                        <select
                          value={app.status}
                          onChange={(e) => handleQuickMove(app, e.target.value)}
                          onClick={e => e.stopPropagation()}
                          className="bg-slate-950 border border-white/10 text-[9px] text-slate-300 rounded px-1 py-0.5 focus:outline-none"
                        >
                          {COLUMNS.map(c => (
                            <option key={c.id} value={c.id}>{c.title}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}

                  {colApps.length === 0 && (
                    <div className="h-full border border-dashed border-white/5 rounded-xl flex items-center justify-center p-4 text-center">
                      <p className="text-[10px] text-slate-600">Drag jobs here</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit/Add Modal Overlay */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              
              {/* Modal Header */}
              <div className="bg-slate-950 px-6 py-4 border-b border-white/10 flex justify-between items-center">
                <h3 className="text-white font-bold text-sm flex items-center gap-2">
                  <Briefcase size={16} className="text-purple-400" />
                  {editingApp ? `Edit Application: ${editingApp.companyName}` : 'Add External Job Application'}
                </h3>
                <button 
                  onClick={() => setShowModal(false)} 
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleSaveApplication} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
                
                {/* Basic Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-400 text-[10px] uppercase font-bold tracking-wider mb-1.5">Company Name *</label>
                    <input 
                      type="text" 
                      value={companyName}
                      onChange={e => setCompanyName(e.target.value)}
                      placeholder="e.g. Google, Stripe, Razorpay"
                      className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:border-purple-500/50"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 text-[10px] uppercase font-bold tracking-wider mb-1.5">Job Role / Title *</label>
                    <input 
                      type="text" 
                      value={roleName}
                      onChange={e => setRoleName(e.target.value)}
                      placeholder="e.g. Software Engineer Intern, Associate Product Manager"
                      className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:border-purple-500/50"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-slate-400 text-[10px] uppercase font-bold tracking-wider mb-1.5">Board Status</label>
                    <select
                      value={status}
                      onChange={e => setStatus(e.target.value)}
                      className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:border-purple-500/50 cursor-pointer"
                    >
                      {COLUMNS.map(c => (
                        <option key={c.id} value={c.id}>{c.title}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 text-[10px] uppercase font-bold tracking-wider mb-1.5">Follow-up Reminder Date</label>
                    <input 
                      type="date" 
                      value={followUpDate}
                      onChange={e => setFollowUpDate(e.target.value)}
                      className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:border-purple-500/50 cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 text-[10px] uppercase font-bold tracking-wider mb-1.5">Job Match Score (%)</label>
                    <input 
                      type="number" 
                      min="0" 
                      max="100"
                      value={matchScore}
                      onChange={e => setMatchScore(e.target.value)}
                      placeholder="e.g. 85 (or calculate with AI)"
                      className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:border-purple-500/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 text-[10px] uppercase font-bold tracking-wider mb-1.5">Job Posting URL</label>
                  <input 
                    type="url" 
                    value={jobUrl}
                    onChange={e => setJobUrl(e.target.value)}
                    placeholder="https://careers.google.com/jobs/results/..."
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:border-purple-500/50"
                  />
                </div>

                {/* AI Job Matcher Drawer */}
                <div className="bg-slate-950/60 border border-white/5 rounded-xl p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-white text-xs font-bold flex items-center gap-1.5">
                      <Sparkles className="text-purple-400 animate-pulse" size={14} />
                      AI Match Score Estimator
                    </h4>
                    <span className="text-[9px] text-slate-500 font-medium">Compare resume vs. Job Description</span>
                  </div>

                  {resumeVersions.length === 0 ? (
                    <div className="text-xs text-slate-500 flex items-center gap-1.5 bg-slate-950 p-2.5 rounded-lg border border-white/5">
                      <Info size={14} className="text-yellow-500" />
                      No saved resume versions found. Go to "Upload Resume" or "Builder" to save a version first.
                    </div>
                  ) : (
                    <div className="space-y-3 text-xs">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-slate-400 text-[9px] uppercase font-bold mb-1">Select Resume Version</label>
                          <select
                            value={selectedResumeId}
                            onChange={e => setSelectedResumeId(e.target.value)}
                            className="w-full bg-slate-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-white text-xs cursor-pointer focus:outline-none"
                          >
                            {resumeVersions.map(r => (
                              <option key={r.id} value={r.id.toString()}>{r.label}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-slate-400 text-[9px] uppercase font-bold mb-1">Paste Job Description</label>
                        <textarea
                          rows="4"
                          value={jobDescriptionText}
                          onChange={e => setJobDescriptionText(e.target.value)}
                          placeholder="Paste the target job description (responsibilities, skills, qualifications) here..."
                          className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-white text-xs placeholder-slate-600 focus:outline-none focus:border-purple-500/40"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={handleCalculateMatch}
                        disabled={calculatingMatch || !jobDescriptionText.trim()}
                        className="py-2 px-4 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 hover:border-purple-500/50 rounded-lg font-bold text-xs transition-all flex items-center gap-1.5 active:scale-95 disabled:opacity-40"
                      >
                        {calculatingMatch ? (
                          <>
                            <Loader2 size={12} className="animate-spin" />
                            Analyzing skills and comparing...
                          </>
                        ) : (
                          <>
                            <Sparkles size={12} />
                            Calculate Match Score
                          </>
                        )}
                      </button>

                      {/* Display AI Results */}
                      {aiSuggestions && (
                        <div className="mt-3 p-3 bg-slate-900 border border-white/5 rounded-xl space-y-2 animate-fadeIn text-[11px] leading-relaxed">
                          <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-2">
                            <span className="text-white font-bold">Analysis Results</span>
                            <span className={`px-2 py-0.5 rounded-full border text-[10px] font-black ${getScoreColor(parseInt(matchScore))}`}>
                              Match: {matchScore}%
                            </span>
                          </div>
                          
                          {aiSuggestions.matched_skills && aiSuggestions.matched_skills.length > 0 && (
                            <div>
                              <span className="text-green-400 font-bold">Matched Skills: </span>
                              <span className="text-slate-300">
                                {Array.isArray(aiSuggestions.matched_skills) 
                                  ? aiSuggestions.matched_skills.join(', ') 
                                  : String(aiSuggestions.matched_skills)}
                              </span>
                            </div>
                          )}

                          {aiSuggestions.missing_skills && aiSuggestions.missing_skills.length > 0 && (
                            <div className="mt-1">
                              <span className="text-red-400 font-bold">Missing Skills: </span>
                              <span className="text-slate-300">
                                {Array.isArray(aiSuggestions.missing_skills) 
                                  ? aiSuggestions.missing_skills.join(', ') 
                                  : String(aiSuggestions.missing_skills)}
                              </span>
                            </div>
                          )}

                          {aiSuggestions.suggestions && aiSuggestions.suggestions.length > 0 && (
                            <div className="mt-2 p-2 bg-slate-950 rounded border border-white/5">
                              <span className="text-purple-300 font-bold block mb-1">Resume Improvement Tips:</span>
                              <ul className="list-disc pl-4 space-y-1 text-slate-400">
                                {Array.isArray(aiSuggestions.suggestions) 
                                  ? aiSuggestions.suggestions.slice(0, 3).map((tip, i) => <li key={i}>{tip}</li>)
                                  : <li>{String(aiSuggestions.suggestions)}</li>}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-slate-400 text-[10px] uppercase font-bold tracking-wider mb-1.5">Notes & Interview Steps</label>
                  <textarea 
                    rows="3"
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder="Add custom notes, recruiter names, salary mentioned, or assessment dates..."
                    className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-white text-xs placeholder-slate-600 focus:outline-none focus:border-purple-500/50"
                  />
                </div>

                {/* Modal Actions */}
                <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border border-white/10 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 text-xs font-bold transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-lg text-xs font-bold transition-all active:scale-95 shadow-md flex items-center gap-1.5"
                  >
                    <CheckCircle size={14} />
                    Save Application
                  </button>
                </div>

              </form>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
