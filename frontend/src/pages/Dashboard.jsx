import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, PanelLeftClose, PanelLeftOpen, Briefcase, Search, CheckCircle, Video, Map as MapIcon, BookOpen, MapPin, ExternalLink, Loader2, Building2 } from 'lucide-react';
import { drivesAPI, applicationsAPI, atsAPI, jobsAPI, studentsAPI } from '../services/api';
import AIInterviewSimulator from '../components/AIInterviewSimulator';
import DSAPlanner from '../components/DSAPlanner';
import StudyMaterials from '../components/StudyMaterials';
import NotesView from '../pages/Notes';
import CSNotes from '../components/CSNotes';
import RecruiterDashboard from '../components/RecruiterDashboard';
import { useNotifications } from '../hooks/useNotifications';

export default function Dashboard() {
  const { user, role, logout } = useAuth();
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) {
      return dateStr;
    }
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };
  const navigate = useNavigate();
  const location = useLocation();

  const studentNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { id: 'find-jobs', label: 'Find Jobs', icon: <Search size={18} /> },
    { id: 'applications', label: 'My Applications', icon: <CheckCircle size={18} /> },
    { id: 'upload',   label: 'Upload Resume', icon: <FileText size={18} /> },
    { id: 'interview', label: 'AI Interview', icon: <Video size={18} /> },
    { id: 'dsa',      label: 'DSA Planner', icon: <MapIcon size={18} /> },
    { id: 'knowledge', label: 'Study Materials', icon: <BookOpen size={18} /> },
    { id: 'notes', label: 'My Notes', icon: <BookOpen size={18} /> },
  ];

  const recruiterNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { id: 'recruiter-portal', label: 'Recruiter Portal', icon: <Briefcase size={18} /> },
  ];

  const adminNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { id: 'post-job', label: 'Post Drive', icon: <Briefcase size={18} /> },
  ];

  const navItems = role === 'ADMIN' 
    ? adminNavItems 
    : role === 'RECRUITER' 
      ? recruiterNavItems 
      : studentNavItems;

  const [active, setActive] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const fileInputRef = useRef(null);
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);

  // Live external jobs
  const [liveJobs, setLiveJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [jobKeyword, setJobKeyword] = useState('');
  const [jobType, setJobType] = useState('');

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef();

  // Data states
  const [drives, setDrives] = useState([]);
  const [applications, setApplications] = useState([]);
  const [newDrive, setNewDrive] = useState({ companyName: '', role: '', packageLpa: '', minCgpa: '', allowedBranches: '', driveDate: '' });
  const [formMsg, setFormMsg] = useState('');

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U';

  const handleLogout = () => { logout(); navigate('/login'); };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setSelectedFile(file);
  };

  useEffect(() => {
    if (active === 'find-jobs' || active === 'dashboard') {
      drivesAPI.getAll().then(setDrives).catch(console.error);
    }
    if (role === 'STUDENT' && (active === 'applications' || active === 'dashboard')) {
      if(user?.id) applicationsAPI.getByStudent(user.id).then(setApplications).catch(console.error);
    }
  }, [active, role, user?.id]);

  // Live jobs — fire independently on tab switch and filter change
  useEffect(() => {
    if (active !== 'find-jobs') return;
    setLoadingJobs(true);
    jobsAPI.search(jobKeyword, jobType, 30)
      .then(res => setLiveJobs(res.data || []))
      .catch(err => { console.error(err); setLiveJobs([]); })
      .finally(() => setLoadingJobs(false));
  }, [active, jobKeyword, jobType]);

  const [autoApplyChecked, setAutoApplyChecked] = useState(false);

  const handleAnalyze = async () => {
    if (!selectedFile) { alert("Please select a file first"); return; }
    try {
      setAnalyzing(true);
      const data = await atsAPI.analyze(selectedFile);
      console.log("Analysis:", data);
      if (data && data.error) {
        throw new Error(data.error);
      }

      // Auto-apply logic
      if (autoApplyChecked && user?.id) {
        try {
          const autoResult = await studentsAPI.autoApply(user.id);
          if (autoResult.success && autoResult.count > 0) {
            const listStr = autoResult.appliedDrives.map(d => `- ${d.companyName} (${d.role})`).join('\n');
            alert(`Auto-Applied successfully to ${autoResult.count} eligible drive(s):\n${listStr}`);
          } else {
            alert('Analyzed! No new eligible campus drives matched your resume.');
          }
        } catch (autoErr) {
          console.error("Auto-apply error:", autoErr);
        }
      }

      navigate("/report", { state: { analysis: data } });
    } catch (err) {
      console.error(err);
      alert("Analysis failed: " + err.message);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleCreateDrive = async (e) => {
    e.preventDefault();
    try {
      await drivesAPI.create(newDrive);
      setFormMsg('Drive posted successfully!');
      setNewDrive({ companyName: '', role: '', packageLpa: '', minCgpa: '', allowedBranches: '', driveDate: '' });
    } catch (error) {
      setFormMsg('Failed to post drive.');
    }
  };

  const handleApply = async (driveId) => {
    if(!user?.id) return;
    try {
      await drivesAPI.apply(driveId, user.id);
      alert('Applied successfully!');
      if(role === 'STUDENT') {
        applicationsAPI.getByStudent(user.id).then(setApplications).catch(console.error);
      }
    } catch (error) {
      alert('Failed to apply.');
    }
  };

  const getPageTitle = () => {
    if (location.pathname.includes("report")) return "Resume Report";
    if (location.pathname.includes("upload"))  return "Upload Resume";
    return "Dashboard";
  };

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const stats = [
    { label: 'Resumes Created', value: '0', icon: '📄' },
    { label: 'AI Suggestions', value: '0', icon: '✨' },
    { label: 'Profile Score', value: '—', icon: '📊' },
    { label: 'Applications', value: applications.length.toString(), icon: '🎯' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black flex">

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside
        className={`fixed lg:relative inset-y-0 left-0 z-30
          bg-white/[0.04] backdrop-blur-xl shadow-xl border-r border-white/[0.06] flex flex-col
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          transition-transform duration-300 w-64`}
      >
        <div className="p-5 border-b border-white/[0.06] flex items-center justify-between">
          {!sidebarCollapsed && (
            <div>
              <span className="text-white font-semibold text-sm">ResumeAI</span>
              <p className="text-slate-500 text-xs">{role === 'ADMIN' ? 'Admin Portal' : 'Career Platform'}</p>
            </div>
          )}
          <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="text-slate-400 hover:text-white">
            {sidebarCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-2">
          {navItems.map(item => {
            const activeClass = active === item.id
              ? "bg-purple-600/20 text-white"
              : "text-slate-400 hover:text-white hover:bg-white/[0.05]";
            return (
              <button
                key={item.id}
                onClick={() => { setActive(item.id); if (item.id === 'dashboard') navigate('/dashboard'); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${activeClass}`}
              >
                {item.icon}
                {!sidebarCollapsed && item.label}
              </button>
            );
          })}
        </nav>

        {!sidebarCollapsed && (
          <div className="p-4 border-t border-white/[0.06]">
            <p className="text-white text-sm">{user?.name}</p>
            <p className="text-slate-500 text-xs">{user?.email}</p>
          </div>
        )}
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="bg-white/[0.04] backdrop-blur-xl border-b border-white/[0.06] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-white lg:hidden">☰</button>
            <div>
              <h1 className="text-white text-lg font-semibold">{getPageTitle()}</h1>
              <p className="text-slate-500 text-xs">{new Date().toLocaleDateString('en-US', { weekday:'long', month:'long', day:'numeric' })}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Real-time Notifications Bell */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)} 
                className="relative p-2.5 text-slate-400 hover:text-white bg-white/[0.04] border border-white/[0.07] rounded-xl transition-all"
              >
                <span>🔔</span>
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4.5 h-4.5 bg-red-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center border border-slate-950 animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl z-50 p-4 max-h-[360px] overflow-y-auto">
                  <div className="flex justify-between items-center pb-2 border-b border-white/10 mb-2">
                    <span className="text-white text-xs font-semibold">Notifications</span>
                    {unreadCount > 0 && (
                      <button onClick={markAllAsRead} className="text-purple-400 hover:text-purple-300 text-[10px] font-semibold">
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="space-y-2">
                    {notifications.map(n => (
                      <div 
                        key={n.id} 
                        onClick={() => markAsRead(n.id)}
                        className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                          n.isRead 
                            ? 'bg-transparent border-white/[0.04] text-slate-400' 
                            : 'bg-purple-500/10 border-purple-500/20 text-white hover:bg-purple-500/15'
                        }`}
                      >
                        <p className="font-semibold">{n.title}</p>
                        <p className="mt-0.5 text-[11px] leading-relaxed text-slate-300">{n.message}</p>
                        <span className="text-[9px] text-slate-500 mt-1 block">
                          {new Date(n.createdAt || Date.now()).toLocaleTimeString()}
                        </span>
                      </div>
                    ))}
                    {notifications.length === 0 && (
                      <p className="text-center text-slate-500 py-6 text-xs">No notifications yet.</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div ref={menuRef} className="relative">
              <button onClick={() => setMenuOpen(!menuOpen)} className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.07] rounded-xl px-4 py-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">{initials}</span>
                </div>
                <span className="text-white text-sm">{user?.name?.split(' ')[0]}</span>
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-slate-900 border border-white/10 rounded-xl shadow-xl">
                  <button onClick={() => navigate('/settings')} className="w-full text-left px-4 py-2 text-sm text-white hover:bg-white/10">Settings</button>
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-white/10">Logout</button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">
          {active === 'dashboard' && (
            <>
              <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/10 border border-purple-500/20 rounded-2xl p-6 mb-6">
                <p className="text-purple-300 text-xs uppercase mb-1">Welcome Back</p>
                <h2 className="text-white text-2xl font-semibold">{user?.name} 👋</h2>
                <p className="text-slate-400 text-sm">Your AI-powered career toolkit is ready.</p>
              </div>
              {role === 'STUDENT' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                  {/* Placement Readiness Score Card */}
                  <div className="lg:col-span-1 bg-gradient-to-br from-purple-950/40 via-slate-900/60 to-black/85 border border-purple-500/30 rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden group">
                    <div className="absolute -right-8 -top-8 w-24 h-24 bg-purple-500/10 rounded-full blur-xl group-hover:bg-purple-500/20 transition-all duration-300" />
                    <div>
                      <span className="text-purple-400 text-[10px] uppercase font-bold tracking-wider">Overall Status</span>
                      <h3 className="text-white text-base font-bold mt-1">Placement Readiness</h3>
                      <p className="text-slate-400 text-[11px] mt-1 leading-relaxed">Aggregated preparedness score based on your profile and test history.</p>
                    </div>
                    <div className="my-5 flex items-center justify-center gap-5">
                      {/* Circular score ring */}
                      <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle cx="40" cy="40" r="34" className="stroke-white/[0.06]" strokeWidth="6" fill="transparent" />
                          <circle cx="40" cy="40" r="34" className="stroke-purple-500" strokeWidth="6" fill="transparent"
                            strokeDasharray={213.6}
                            strokeDashoffset={213.6 - (213.6 * 76) / 100}
                            strokeLinecap="round" />
                        </svg>
                        <span className="absolute text-white font-bold text-xl">76%</span>
                      </div>
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                          <span className="text-slate-300">ATS Score: 78%</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                          <span className="text-slate-300">AI Interviews: 82%</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                          <span className="text-slate-300">DSA Planner: 65%</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-[10px] text-slate-500 border-t border-white/5 pt-2 text-center">
                      Aggregated in real-time. Keep improving to level up!
                    </div>
                  </div>

                  {/* Standard stats grid */}
                  <div className="lg:col-span-2 grid grid-cols-2 gap-4">
                    {stats.map((s,i) => (
                      <div key={i} className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5 flex flex-col justify-between hover:bg-white/[0.05] transition-all">
                        <div className="text-3xl">{s.icon}</div>
                        <div>
                          <p className="text-white text-2xl font-bold mt-2">{s.value}</p>
                          <p className="text-slate-400 text-xs mt-1 font-medium">{s.label}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {role === 'RECRUITER' && (
                <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6 text-center text-slate-400 py-12">
                  <p className="text-white text-lg font-semibold mb-2">Recruiter Access Granted</p>
                  <p className="text-sm">Manage drives, review applications, shortlist candidates and schedule interviews in the portal.</p>
                  <button onClick={() => setActive('recruiter-portal')} className="mt-4 bg-purple-600 hover:bg-purple-500 text-white text-sm px-6 py-2.5 rounded-xl font-medium transition-all">
                    Open Recruiter Portal
                  </button>
                </div>
              )}
            </>
          )}

          {active === 'post-job' && role === 'ADMIN' && (
            <div className="max-w-2xl bg-white/[0.03] border border-white/[0.07] rounded-2xl p-8">
              <h2 className="text-white text-xl font-semibold mb-6">Post a New Drive</h2>
              {formMsg && <p className="mb-4 text-green-400 text-sm">{formMsg}</p>}
              <form onSubmit={handleCreateDrive} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-400 text-xs uppercase mb-1.5">Company Name</label>
                    <input required value={newDrive.companyName} onChange={e => setNewDrive({...newDrive, companyName: e.target.value})} className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500/50" />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-xs uppercase mb-1.5">Role</label>
                    <input required value={newDrive.role} onChange={e => setNewDrive({...newDrive, role: e.target.value})} className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500/50" />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-xs uppercase mb-1.5">Package (LPA)</label>
                    <input type="number" step="0.1" required value={newDrive.packageLpa} onChange={e => setNewDrive({...newDrive, packageLpa: e.target.value})} className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500/50" />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-xs uppercase mb-1.5">Min CGPA</label>
                    <input type="number" step="0.1" required value={newDrive.minCgpa} onChange={e => setNewDrive({...newDrive, minCgpa: e.target.value})} className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500/50" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-slate-400 text-xs uppercase mb-1.5">Allowed Branches</label>
                    <input required value={newDrive.allowedBranches} onChange={e => setNewDrive({...newDrive, allowedBranches: e.target.value})} placeholder="e.g. CSE, ECE" className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500/50" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-slate-400 text-xs uppercase mb-1.5">Drive Date</label>
                    <input type="date" required value={newDrive.driveDate} onChange={e => setNewDrive({...newDrive, driveDate: e.target.value})} className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500/50" />
                  </div>
                </div>
                <button type="submit" className="mt-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-medium w-full hover:from-purple-500 hover:to-blue-500 transition-colors">
                  Post Drive
                </button>
              </form>
            </div>
          )}

          {active === 'find-jobs' && role === 'STUDENT' && (
            <div className="space-y-4">
              {loadingJobs ? (
                <div className="flex items-center gap-3 py-10 text-slate-400 justify-center">
                  <Loader2 className="animate-spin" size={24} />
                  <span>Fetching live opportunities…</span>
                </div>
              ) : (
                <>
                  {/* ── Search Bar ───────────────────────────────────── */}
                  <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-4 mb-2">
                    <div className="flex flex-col sm:flex-row gap-2.5">
                      <div className="relative flex-1">
                        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                          type="text"
                          placeholder="Search job title, skill, company…"
                          value={jobKeyword}
                          onChange={e => setJobKeyword(e.target.value)}
                          className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl pl-9 pr-4 py-2.5 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-purple-500/50 transition-colors"
                        />
                      </div>
                      <div className="relative sm:w-40">
                        <Briefcase size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                        <select
                          value={jobType}
                          onChange={e => setJobType(e.target.value)}
                          className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl pl-9 pr-6 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500/50 transition-colors appearance-none cursor-pointer"
                        >
                          <option value="">All Types</option>
                          <option value="full-time">Full-time</option>
                          <option value="part-time">Part-time</option>
                          <option value="contract">Contract</option>
                          <option value="internship">Internship</option>
                          <option value="remote">Remote</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* ── Result Header ────────────────────────────────── */}
                  <div className="flex items-center justify-between">
                    <h2 className="text-white text-xl font-semibold">
                      {liveJobs.length} Opportunity{liveJobs.length !== 1 && 's'} Found
                    </h2>
                    <span className="text-slate-500 text-xs">
                      via Career Nest Board
                    </span>
                  </div>

                  {/* ── Job List ─────────────────────────────────────── */}
                  {liveJobs.length === 0 ? (
                    <div className="text-center py-16 text-slate-500">
                      <Building2 size={40} className="mx-auto mb-3 opacity-40" />
                      <p className="text-sm">No jobs match your current filters.</p>
                      <p className="text-xs mt-1 text-slate-600">Try clearing the search or changing the location.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {liveJobs.map(job => (
                        <div
                          key={job.external_id}
                          className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5 hover:bg-white/[0.06] transition-colors group"
                        >
                          <div className="flex flex-wrap items-start gap-x-4 gap-y-2">
                            {/* Company logo or placeholder */}
                            <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-purple-600/30 to-blue-600/30 flex items-center justify-center border border-white/[0.08] overflow-hidden">
                              {job.company_logo ? (
                                <img
                                  src={job.company_logo}
                                  alt=""
                                  className="w-full h-full object-cover"
                                  onError={e => { e.target.style.display = 'none'; }}
                                />
                              ) : (
                                <Building2 size={20} className="text-purple-300/70" />
                              )}
                            </div>

                            {/* Job info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-start justify-between gap-2">
                                <div>
                                  <h3 className="text-white font-medium text-[15px] leading-snug">
                                    {job.title}
                                    {job.source && (
                                      <span className="ml-2 text-[10px] font-medium text-purple-400/70 bg-purple-500/10 px-1.5 py-0.5 rounded">
                                        {job.source}
                                      </span>
                                    )}
                                  </h3>
                                  <p className="text-slate-400 text-xs mt-0.5">
                                    {job.company}
                                  </p>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                  {job.salary && (
                                    <span className="bg-emerald-500/15 text-emerald-300 text-xs px-2.5 py-1 rounded-full font-medium border border-emerald-500/20">
                                      {job.salary}
                                    </span>
                                  )}
                                  {job.job_type && (
                                    <span className="bg-blue-500/15 text-blue-300 text-xs px-2.5 py-1 rounded-full font-medium border border-blue-500/20">
                                      {job.job_type}
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Meta row */}
                              {(job.location || job.category) && (
                                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-[11px] text-slate-500">
                                  {job.location && (
                                    <span className="flex items-center gap-1">
                                      <MapPin size={11} /> {job.location}
                                    </span>
                                  )}
                                  {job.category && <span>· {job.category}</span>}
                                  {job.posted_at && (
                                    <span>· Posted {formatDate(job.posted_at)}</span>
                                  )}
                                </div>
                              )}

                              {/* Description */}
                              {job.description && (
                                <p className="text-slate-400 text-xs mt-2 leading-relaxed line-clamp-2">
                                  {job.description}
                                </p>
                              )}

                              {/* CTA */}
                              <div className="flex items-center gap-3 mt-3">
                                <a
                                  href={job.apply_url || job.job_url || '#'}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium px-4 py-2 rounded-xl transition-colors"
                                >
                                  Apply Now
                                  <ExternalLink size={12} />
                                </a>
                                <a
                                  href={job.job_url || job.apply_url || '#'}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-slate-400 hover:text-white text-xs px-2 py-2 transition-colors"
                                  title="View full posting"
                                >
                                  View details →
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {active === 'applications' && role === 'STUDENT' && (
            <div className="space-y-4">
              <h2 className="text-white text-xl font-semibold mb-4">My Applications</h2>
              <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl overflow-hidden">
                <table className="w-full text-left text-sm text-slate-400">
                  <thead className="bg-white/[0.02] border-b border-white/[0.07] text-xs uppercase font-semibold">
                    <tr>
                      <th className="px-6 py-4">Company</th>
                      <th className="px-6 py-4">Role</th>
                      <th className="px-6 py-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.07]">
                    {applications.map(app => (
                      <tr key={app.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-4 text-white">{app.companyName || 'N/A'}</td>
                        <td className="px-6 py-4">{app.role || 'N/A'}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                            app.status === 'APPLIED' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 
                            app.status === 'SHORTLISTED' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 
                            'bg-slate-500/10 text-slate-400 border-slate-500/20'
                          }`}>
                            {app.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {applications.length === 0 && (
                      <tr><td colSpan="3" className="px-6 py-8 text-center">No applications found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {active === 'upload' && (
            <div className="space-y-6">
              <div
                onClick={() => { if (!selectedFile) fileInputRef.current.click(); }}
                className="bg-white/[0.03] border-2 border-dashed border-white/[0.10] hover:border-purple-500/30 rounded-2xl p-16 text-center transition-all duration-200 cursor-pointer group hover:bg-purple-500/5"
              >
                <input type="file" ref={fileInputRef} accept=".pdf,.doc,.docx" onChange={handleFileChange} className="hidden" />
                {!selectedFile ? (
                  <>
                    <div className="w-16 h-16 rounded-2xl bg-white/[0.05] border border-white/[0.10] flex items-center justify-center mx-auto mb-5">📄</div>
                    <p className="text-white font-medium mb-1">Click to select your resume</p>
                    <p className="text-slate-500 text-sm">PDF, DOC, DOCX up to 10MB</p>
                  </>
                ) : (
                  <div className="space-y-3">
                    <p className="text-green-400 font-medium">Selected File:</p>
                    <p className="text-white">{selectedFile.name}</p>
                    <div className="flex items-center justify-center gap-2 mt-4 mb-2">
                      <input 
                        type="checkbox" 
                        id="autoApply"
                        checked={autoApplyChecked} 
                        onChange={e => setAutoApplyChecked(e.target.checked)} 
                        className="rounded border-white/20 bg-slate-900 text-purple-600 focus:ring-purple-500"
                      />
                      <label htmlFor="autoApply" className="text-sm text-slate-300 cursor-pointer select-none">
                        Automatically apply to matching campus drives after analysis
                      </label>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleAnalyze(); }}
                      disabled={analyzing}
                      className="mt-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-xl"
                    >
                      {analyzing ? "Analyzing..." : "Analyze Resume with AI"}
                    </button>
                    <button onClick={() => setSelectedFile(null)} className="mt-1 text-slate-400 hover:text-white text-sm block mx-auto">Choose a different file</button>
                  </div>
                )}
              </div>
            </div>
          )}

          {active === 'interview' && role === 'STUDENT' && (
            <AIInterviewSimulator />
          )}

          {active === 'dsa' && role === 'STUDENT' && (
            <DSAPlanner />
          )}

          {active === 'knowledge' && role === 'STUDENT' && (
            <StudyMaterials />
          )}

          {active === 'notes' && role === 'STUDENT' && (
            <CSNotes />
          )}

          {active === 'recruiter-portal' && role === 'RECRUITER' && (
            <RecruiterDashboard />
          )}
        </main>
      </div>
    </div>
  );
}
