import { useState, useRef, useEffect, useLocation } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, PanelLeftClose, PanelLeftOpen } from 'lucide-react';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
  { id: 'upload',   label: 'Upload Resume', icon: <FileText size={18} /> },
];

const stats = [
  { label: 'Resumes Created', value: '0', icon: '📄' },
  { label: 'AI Suggestions', value: '0', icon: '✨' },
  { label: 'Profile Score', value: '—', icon: '📊' },
  { label: 'Applications', value: '0', icon: '🎯' },
];

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [active, setActive] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const fileInputRef = useRef(null);

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef();

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U';

  const handleLogout = () => { logout(); navigate('/login'); };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setSelectedFile(file);
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black flex">

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside
        className={`fixed lg:relative inset-y-0 left-0 z-30
          bg-white/[0.04] backdrop-blur-xl shadow-xl border-r border-white/[0.06] flex flex-col
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          transition-transform duration-300`}
      >
        {/* Logo + collapse */}
        <div className="p-5 border-b border-white/[0.06] flex items-center justify-between">
          {!sidebarCollapsed && (
            <div>
              <span className="text-white font-semibold text-sm">ResumeAI</span>
              <p className="text-slate-500 text-xs">Career Platform</p>
            </div>
          )}
          <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="text-slate-400 hover:text-white">
            {sidebarCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-2">
          {navItems.map(item => {
            const activeClass = location.pathname === "/dashboard" && item.id === 'dashboard'
              || location.pathname.includes("report") && item.id !== 'dashboard'
              ? "bg-purple-600/20 text-white"
              : "text-slate-400 hover:text-white hover:bg-white/[0.05]";
            return (
              <button
                key={item.id}
                onClick={() => { setActive(item.id); if (item.id === 'dashboard') navigate('/dashboard'); else navigate('/report'); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${activeClass}`}
              >
                {item.icon}
                {!sidebarCollapsed && item.label}
              </button>
            );
          })}
        </nav>

        {/* User info */}
        {!sidebarCollapsed && (
          <div className="p-4 border-t border-white/[0.06]">
            <p className="text-white text-sm">{user?.name}</p>
            <p className="text-slate-500 text-xs">{user?.email}</p>
          </div>
        )}
      </motion.aside>

      {/* Main */}
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

        <main className="flex-1 p-6">
          {active === 'dashboard' && (
            <>
              <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/10 border border-purple-500/20 rounded-2xl p-6 mb-6">
                <p className="text-purple-300 text-xs uppercase mb-1">Welcome Back</p>
                <h2 className="text-white text-2xl font-semibold">{user?.name} 👋</h2>
                <p className="text-slate-400 text-sm">Your AI-powered career toolkit is ready.</p>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {stats.map((s,i) => (
                  <div key={i} className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-4">
                    <div className="text-2xl">{s.icon}</div><p className="text-white text-xl">{s.value}</p><p className="text-slate-500 text-xs">{s.label}</p>
                  </div>
                ))}
              </div>
              <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-6 text-center">
                <p className="text-slate-400">No resumes yet</p>
              </div>
            </>
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
