import { useState, useRef, useEffect, useLocation } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, PanelLeftClose, PanelLeftOpen, Briefcase, Search, CheckCircle } from 'lucide-react';
import { drivesAPI, applicationsAPI } from '../services/api';

export default function Dashboard() {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const studentNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { id: 'find-jobs', label: 'Find Jobs', icon: <Search size={18} /> },
    { id: 'applications', label: 'My Applications', icon: <CheckCircle size={18} /> },
    { id: 'upload',   label: 'Upload Resume', icon: <FileText size={18} /> },
  ];

  const adminNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { id: 'post-job', label: 'Post Drive', icon: <Briefcase size={18} /> },
  ];

  const navItems = role === 'ADMIN' ? adminNavItems : studentNavItems;

  const [active, setActive] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const fileInputRef = useRef(null);

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

  const handleAnalyze = async () => {
    if (!selectedFile) { alert("Please select a file first"); return; }
    try {
      setAnalyzing(true);
      const formData = new FormData();
      formData.append("file", selectedFile);
      const res = await fetch("http://localhost:8080/api/ai/analyze-ats?jobDescription=software+engineer", { method: "POST", body: formData });
      const data = await res.json();
      console.log("Analysis:", data);
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
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {stats.map((s,i) => (
                    <div key={i} className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-4">
                      <div className="text-2xl">{s.icon}</div><p className="text-white text-xl">{s.value}</p><p className="text-slate-500 text-xs">{s.label}</p>
                    </div>
                  ))}
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
              <h2 className="text-white text-xl font-semibold mb-4">Available Drives</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {drives.map(drive => (
                  <div key={drive.id} className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-5 hover:bg-white/[0.05] transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-white font-medium text-lg">{drive.companyName}</h3>
                      <span className="bg-purple-500/20 text-purple-300 text-xs px-2 py-1 rounded-md">{drive.packageLpa} LPA</span>
                    </div>
                    <p className="text-slate-400 text-sm mb-4">{drive.role}</p>
                    <div className="space-y-2 mb-6">
                      <div className="flex justify-between text-xs text-slate-500"><span>Min CGPA:</span> <span className="text-slate-300">{drive.minCgpa}</span></div>
                      <div className="flex justify-between text-xs text-slate-500"><span>Branches:</span> <span className="text-slate-300">{drive.allowedBranches}</span></div>
                      <div className="flex justify-between text-xs text-slate-500"><span>Date:</span> <span className="text-slate-300">{new Date(drive.driveDate).toLocaleDateString()}</span></div>
                    </div>
                    <button onClick={() => handleApply(drive.id)} className="w-full bg-white/10 hover:bg-white/20 text-white py-2 rounded-lg text-sm transition-colors font-medium">
                      Apply Now
                    </button>
                  </div>
                ))}
                {drives.length === 0 && <p className="text-slate-400">No drives available right now.</p>}
              </div>
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
                        <td className="px-6 py-4 text-white">Drive #{app.driveId}</td>
                        <td className="px-6 py-4">Student #{app.studentId}</td>
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
                    <button
                      onClick={(e) => { e.stopPropagation(); handleAnalyze(); }}
                      disabled={analyzing}
                      className="mt-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-xl"
                    >
                      {analyzing ? "Analyzing..." : "Analyze Resume with AI"}
                    </button>
                    <button onClick={() => setSelectedFile(null)} className="mt-1 text-slate-400 hover:text-white text-sm">Choose a different file</button>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
