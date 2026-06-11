import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, ArrowRight, Play, FileText, CheckCircle2, 
  AlertTriangle, XCircle, Brain, Cpu, Database, 
  Map, Video, ChevronRight, Menu, X, ArrowUpRight
} from 'lucide-react';

export default function Landing() {
  const [activeTab, setActiveTab] = useState('roadmap');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const prompts = {
    roadmap: "Create a 30-day DSA and system design preparation roadmap for a Google Software Engineer interview, focusing on my weak areas in Graphs and DP.",
    ats: "Analyze my resume for a Senior Backend role at Netflix. Identify missing keywords, ATS formatting compatibility, and rewrite my experience bullets.",
    interview: "Simulate a technical backend mock interview on Spring Boot concurrency, JPA transactional levels, and database query optimization."
  };

  useEffect(() => {
    setIsTyping(true);
    setTypedText('');
    const fullText = prompts[activeTab];
    let index = 0;
    
    const interval = setInterval(() => {
      if (index < fullText.length) {
        setTypedText(prev => prev + fullText.charAt(index));
        index++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 12);

    return () => clearInterval(interval);
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-[#FCFCFB] text-slate-900 antialiased font-sans">
      
      {/* ── NAVIGATION BAR ─────────────────────────────────── */}
      <nav className="sticky top-0 z-50 bg-[#FCFCFB]/80 backdrop-blur-md border-b border-slate-100 px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-slate-900 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-900">AI CareerOS</span>
        </div>

        {/* Links (Desktop) */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <a href="#ecosystem" className="hover:text-slate-900 transition-colors">Ecosystem</a>
          <a href="#features" className="hover:text-slate-900 transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-slate-900 transition-colors">How it works</a>
          <a href="https://github.com/AnishaPaturi/CareerPilot-AI" target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-slate-900 transition-colors">
            GitHub <ArrowUpRight size={14} />
          </a>
        </div>

        {/* Auth CTAs */}
        <div className="hidden md:flex items-center gap-4">
          <Link to="/login" className="text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors px-4 py-2">
            Log in
          </Link>
          <Link to="/signup" className="bg-slate-900 text-white text-sm font-semibold rounded-full px-5 py-2.5 hover:bg-slate-800 transition-all shadow-sm">
            Get Started Free
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden text-slate-700 hover:text-slate-900" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Menu Panel */}
        {mobileMenuOpen && (
          <div className="absolute top-[69px] left-0 w-full bg-[#FCFCFB] border-b border-slate-200 p-6 flex flex-col gap-4 md:hidden shadow-lg animate-fadeIn">
            <a href="#ecosystem" className="text-slate-600 font-medium py-1" onClick={() => setMobileMenuOpen(false)}>Ecosystem</a>
            <a href="#features" className="text-slate-600 font-medium py-1" onClick={() => setMobileMenuOpen(false)}>Features</a>
            <a href="#how-it-works" className="text-slate-600 font-medium py-1" onClick={() => setMobileMenuOpen(false)}>How it works</a>
            <hr className="border-slate-100" />
            <Link to="/login" className="text-slate-700 font-medium py-1 text-center" onClick={() => setMobileMenuOpen(false)}>
              Log in
            </Link>
            <Link to="/signup" className="bg-slate-900 text-white font-semibold rounded-full py-3 text-center shadow-sm" onClick={() => setMobileMenuOpen(false)}>
              Get Started Free
            </Link>
          </div>
        )}
      </nav>

      {/* ── HERO SECTION ───────────────────────────────────── */}
      <section className="relative pt-16 pb-20 px-6 text-center max-w-5xl mx-auto">
        {/* Intro Pill Tag */}
        <div className="inline-flex items-center gap-2 bg-purple-50 border border-purple-200/50 rounded-full px-4 py-1.5 mb-6 animate-pulse">
          <Sparkles className="w-4 h-4 text-purple-600" />
          <span className="text-[12px] font-bold text-purple-700 tracking-wide uppercase">Introducing CareerOS</span>
        </div>

        {/* Big Heading */}
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 max-w-4xl mx-auto leading-[1.1] mb-6">
          Turn your experience into career success. <span className="text-purple-600">Visually.</span>
        </h1>

        {/* Subheading */}
        <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
          Paste your background and target jobs. Watch AI automatically compile roadmaps, audit your resume against ATS requirements, and simulate interactive mock interviews in seconds.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <Link to="/signup" className="w-full sm:w-auto bg-slate-900 text-white text-base font-semibold rounded-full px-8 py-4 hover:bg-slate-800 transition-all shadow-md shadow-slate-900/10 hover:shadow-slate-900/20 flex items-center justify-center gap-2">
            Build My CareerOS Free <ArrowRight size={18} />
          </Link>
          <a href="#how-it-works" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-base font-semibold rounded-full px-8 py-4 transition-all">
            <Play size={16} fill="currentColor" /> Watch how it works
          </a>
        </div>

        {/* ── INTERACTIVE WORKSPACE MOCKUP ─────────────────── */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xl shadow-slate-100 overflow-hidden text-left max-w-4xl mx-auto border-t-[3px] border-t-purple-600">
          
          {/* Workspace Header Tab-bar */}
          <div className="bg-slate-50 border-b border-slate-200/60 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-400 block" />
              <span className="w-3 h-3 rounded-full bg-amber-400 block" />
              <span className="w-3 h-3 rounded-full bg-emerald-400 block" />
              <span className="text-xs text-slate-400 font-semibold ml-3 bg-white px-2.5 py-1 rounded border border-slate-200/40">my_career_plan.npk</span>
            </div>
            
            {/* Interactive Module Tabs */}
            <div className="flex bg-slate-200/60 p-0.5 rounded-full border border-slate-300/30">
              <button 
                onClick={() => setActiveTab('roadmap')}
                className={`text-[12px] font-bold px-3 py-1.5 rounded-full transition-all ${activeTab === 'roadmap' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
              >
                DSA Roadmap
              </button>
              <button 
                onClick={() => setActiveTab('ats')}
                className={`text-[12px] font-bold px-3 py-1.5 rounded-full transition-all ${activeTab === 'ats' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
              >
                ATS Auditor
              </button>
              <button 
                onClick={() => setActiveTab('interview')}
                className={`text-[12px] font-bold px-3 py-1.5 rounded-full transition-all ${activeTab === 'interview' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
              >
                Mock Arena
              </button>
            </div>
          </div>

          {/* Workspace Body Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 min-h-[360px]">
            {/* Left Pane: Document Text Editor */}
            <div className="border-b md:border-b-0 md:border-r border-slate-200 p-6 bg-white flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">Text Editor Canvas</span>
                <div className="mt-3 font-mono text-sm leading-relaxed text-slate-800 min-h-[160px] whitespace-pre-wrap">
                  {typedText}
                  {isTyping && <span className="animate-pulse inline-block w-1.5 h-4 bg-purple-600 ml-0.5" />}
                </div>
              </div>
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span>Characters: {typedText.length}</span>
                <span className="flex items-center gap-1 text-purple-600 font-semibold">
                  <Sparkles size={12} /> AI Powered
                </span>
              </div>
            </div>

            {/* Right Pane: Animated Napkin-style Visual Output */}
            <div className="p-6 bg-slate-50/70 flex flex-col items-center justify-center relative min-h-[320px]">
              
              {/* Dynamic Loading Overlay */}
              {isTyping && (
                <div className="absolute inset-0 bg-slate-50/90 flex flex-col items-center justify-center gap-2 animate-fadeIn z-10">
                  <div className="w-8 h-8 rounded-full border-2 border-purple-600 border-t-transparent animate-spin" />
                  <span className="text-xs font-semibold text-slate-500">AI is visualizing...</span>
                </div>
              )}

              {/* ROADMAP VISUAL */}
              {!isTyping && activeTab === 'roadmap' && (
                <div className="w-full space-y-4 animate-scaleUp">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">Visualized Roadmap</span>
                    <span className="text-[11px] bg-purple-100 text-purple-700 px-2.5 py-0.5 rounded-full font-bold">4 Milestones</span>
                  </div>
                  
                  {/* Visual Node Sequence */}
                  <div className="relative pl-6 border-l border-dashed border-purple-300 space-y-4">
                    {/* Node 1 */}
                    <div className="relative bg-white border border-slate-200 p-3.5 rounded-xl shadow-sm hover:border-purple-300 transition-colors">
                      <span className="absolute -left-[30px] top-4 w-4 h-4 rounded-full bg-purple-600 border-4 border-slate-50 flex items-center justify-center" />
                      <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <Cpu className="w-3.5 h-3.5 text-purple-600" /> Milestone 1: Graphs & Algorithms
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-1">Focus areas: DFS/BFS, Dijkstra's algorithm, and topological sort.</p>
                    </div>

                    {/* Node 2 */}
                    <div className="relative bg-white border border-slate-200 p-3.5 rounded-xl shadow-sm hover:border-purple-300 transition-colors">
                      <span className="absolute -left-[30px] top-4 w-4 h-4 rounded-full bg-purple-400 border-4 border-slate-50 flex items-center justify-center" />
                      <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <Database className="w-3.5 h-3.5 text-purple-600" /> Milestone 2: Spring Boot Concurrency
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-1">Topics: @Async queues, transactional levels, thread pool executors.</p>
                    </div>

                    {/* Node 3 */}
                    <div className="relative bg-white border border-slate-200 p-3.5 rounded-xl shadow-sm hover:border-purple-300 transition-colors">
                      <span className="absolute -left-[30px] top-4 w-4 h-4 rounded-full bg-purple-300 border-4 border-slate-50 flex items-center justify-center" />
                      <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <Brain className="w-3.5 h-3.5 text-purple-600" /> Milestone 3: System Design Mock
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-1">Simulate rate limiting, distributed caching schemes, database sharding.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* ATS SCORE VISUAL */}
              {!isTyping && activeTab === 'ats' && (
                <div className="w-full space-y-4 animate-scaleUp">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">ATS Scoreboard</span>
                    <span className="text-[11px] bg-green-100 text-green-700 px-2.5 py-0.5 rounded-full font-bold">Good Match</span>
                  </div>

                  {/* Circular Score display and checklist */}
                  <div className="grid grid-cols-3 gap-4 bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
                    <div className="col-span-1 flex flex-col items-center justify-center border-r border-slate-100 py-2">
                      <div className="w-16 h-16 rounded-full border-4 border-green-500 border-t-slate-200 flex items-center justify-center">
                        <span className="text-lg font-bold text-slate-900">87</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-bold mt-2">ATS Score</span>
                    </div>

                    <div className="col-span-2 space-y-2 text-xs flex flex-col justify-center">
                      <div className="flex items-center gap-1.5 text-green-600 font-medium">
                        <CheckCircle2 size={14} /> Contact Details Header
                      </div>
                      <div className="flex items-center gap-1.5 text-amber-500 font-medium">
                        <AlertTriangle size={14} /> Missing tags: `Kubernetes`
                      </div>
                      <div className="flex items-center gap-1.5 text-rose-500 font-medium">
                        <XCircle size={14} /> Non-impact bullet structures
                      </div>
                    </div>
                  </div>

                  {/* Skills Heatmap */}
                  <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Identified Skills Match</span>
                    <div className="flex flex-wrap gap-1.5 mt-2.5">
                      <span className="bg-slate-100 text-slate-700 text-[10px] px-2 py-1 rounded font-medium border border-slate-200/40">Java Spring Boot</span>
                      <span className="bg-slate-100 text-slate-700 text-[10px] px-2 py-1 rounded font-medium border border-slate-200/40">MySQL</span>
                      <span className="bg-slate-100 text-slate-700 text-[10px] px-2 py-1 rounded font-medium border border-slate-200/40">React</span>
                      <span className="bg-purple-50 text-purple-600 text-[10px] px-2 py-1 rounded font-bold border border-purple-200/40">+ Add AWS S3</span>
                    </div>
                  </div>
                </div>
              )}

              {/* MOCK ARENA VISUAL */}
              {!isTyping && activeTab === 'interview' && (
                <div className="w-full space-y-4 animate-scaleUp">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">Mock Interview Room</span>
                    <span className="text-[11px] bg-blue-100 text-blue-700 px-2.5 py-0.5 rounded-full font-bold">Session Active</span>
                  </div>

                  {/* Chat bubbles */}
                  <div className="space-y-3">
                    <div className="bg-white border border-slate-200 p-3.5 rounded-xl shadow-sm text-xs">
                      <span className="font-bold text-purple-600 block mb-0.5">AI Interviewer</span>
                      <p className="text-slate-600 leading-relaxed">Describe a scenario where optimistic locking in JPA would result in an ObjectOptimisticLockingFailureException.</p>
                    </div>

                    <div className="bg-purple-600 text-white p-3.5 rounded-xl shadow-sm text-xs ml-4">
                      <span className="font-bold text-purple-200 block mb-0.5">Candidate Answer</span>
                      <p className="leading-relaxed">When two concurrent threads select the same database row and attempt to update it. The first commit succeeds, updating the entity's version field. The second commit detects the modified version and throws the exception...</p>
                    </div>
                  </div>

                  {/* Evaluation widget */}
                  <div className="bg-white border border-slate-200 p-3 rounded-xl flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-ping" />
                      <span className="text-[11px] text-slate-500 font-bold">Accuracy Evaluator:</span>
                    </div>
                    <span className="text-xs font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-full">Score: 9.5 / 10</span>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </section>

      {/* ── ECOSYSTEM OVERVIEW SECTION ──────────────────────── */}
      <section id="ecosystem" className="py-20 bg-slate-50 border-y border-slate-200/60 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-slate-900">
              One ecosystem. Five core pillars.
            </h2>
            <p className="text-slate-500 text-base leading-relaxed">
              Why use multiple disconnected platforms? AI CareerOS consolidates all placement coordination, ATS analysis, DSA preparation, and mock interviews into a single, unified workspace.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Card 1 */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center mb-5">
                  <Map className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Smart Placement Backbone</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-4">
                  Track campus recruitment drives, company registries, and jobs with qualification-based eligibility checking.
                </p>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap mt-auto">
                <span className="bg-slate-100 text-slate-700 text-[10px] px-2 py-0.5 rounded font-medium">Spring Boot</span>
                <span className="bg-slate-100 text-slate-700 text-[10px] px-2 py-0.5 rounded font-medium">MySQL</span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center mb-5">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">AI Resume ATS Auditor</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-4">
                  Audit resumes against actual job listings, get checklist critiques, and restructure bullets via the STAR methodology.
                </p>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap mt-auto">
                <span className="bg-slate-100 text-slate-700 text-[10px] px-2 py-0.5 rounded font-medium">FastAPI</span>
                <span className="bg-slate-100 text-slate-700 text-[10px] px-2 py-0.5 rounded font-medium">OpenRouter</span>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center mb-5">
                  <Video className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">AI Mock Interview Arena</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-4">
                  Simulate role-specific HR/Technical interviews with real-time text and voice-to-text feedback.
                </p>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap mt-auto">
                <span className="bg-slate-100 text-slate-700 text-[10px] px-2 py-0.5 rounded font-medium">Web Speech API</span>
                <span className="bg-slate-100 text-slate-700 text-[10px] px-2 py-0.5 rounded font-medium">FastAPI</span>
              </div>
            </div>
          </div>

          {/* Centered ecosystem row for Card 4 and 5 */}
          <div className="flex flex-col md:flex-row justify-center gap-6 items-stretch">
            {/* Card 4 */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all w-full md:w-[340px] flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center mb-5">
                  <Brain className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">AlgoMentor DSA Planner</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-4">
                  Generate personalized practice paths, track confidence levels, and schedule topics to target target company tiers.
                </p>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap mt-auto">
                <span className="bg-slate-100 text-slate-700 text-[10px] px-2 py-0.5 rounded font-medium">FastAPI</span>
                <span className="bg-slate-100 text-slate-700 text-[10px] px-2 py-0.5 rounded font-medium">MySQL</span>
              </div>
            </div>

            {/* Card 5 */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all w-full md:w-[500px] flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center mb-5">
                  <FileText className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Career Knowledge Assistant (Document RAG) & Prep Hub</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-4">
                  Upload PDFs, notes, or textbooks to chat with them semantically, auto-generate customized study quizzes, compile flashcards, and access structured CS references.
                </p>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap mt-auto">
                <span className="bg-slate-100 text-slate-700 text-[10px] px-2 py-0.5 rounded font-medium">ChromaDB</span>
                <span className="bg-slate-100 text-slate-700 text-[10px] px-2 py-0.5 rounded font-medium">LangChain</span>
                <span className="bg-slate-100 text-slate-700 text-[10px] px-2 py-0.5 rounded font-medium">react-pdf</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── BEFORE & AFTER VISUAL SECTION ─────────────────── */}
      <section id="features" className="py-20 px-6 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs font-bold text-purple-600 uppercase tracking-widest block mb-2">Workflow comparison</span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-4 leading-tight">
              Replace walls of text with structured visualization.
            </h2>
            <p className="text-slate-500 leading-relaxed mb-6">
              Reviewing folders of CS notes, Google Drive PDFs, and text documents is overwhelming. AI CareerOS converts raw career texts into structured, interactive roadmaps and scorecards that point out exactly what you should do next.
            </p>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center shrink-0 mt-1">
                  <span className="w-2 h-2 rounded-full bg-purple-600" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Actionable visual nodes</h4>
                  <p className="text-slate-500 text-xs mt-0.5">Clickable details and files directly linked to relevant codebases.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center shrink-0 mt-1">
                  <span className="w-2 h-2 rounded-full bg-purple-600" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Visual checkpoints</h4>
                  <p className="text-slate-500 text-xs mt-0.5">Immediate highlight of critical weaknesses, warnings, and achievements.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Before & After Panels */}
          <div className="space-y-4">
            {/* Plain Text (Before) */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm opacity-60">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Traditional Wall of Text</span>
                <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">Before</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed font-mono">
                "Candidate has experience with Java, Spring, SQL. Resumes are evaluated against requirements. Need to study graphs and dynamic programming questions on LeetCode for standard platforms. Also, I should make sure I know DBMS queries, transaction levels, index types, caching rules, and practice behavioral mocks before attending hiring drives."
              </p>
            </div>

            {/* Structured Visual (After) */}
            <div className="bg-white border-[2px] border-purple-500 rounded-xl p-5 shadow-md relative animate-fadeIn">
              <span className="absolute -top-3 -right-3 bg-purple-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow">Visualized</span>
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">AI CareerOS Structured Node</span>
                <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded">After</span>
              </div>

              {/* Mock Flowchart Blocks */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-xs text-slate-700">1</div>
                  <div className="flex-1 bg-slate-50 border border-slate-200/60 p-2.5 rounded-lg text-xs font-semibold">
                    <span className="text-purple-600">Resume Audit:</span> Identified missing keyword `Kubernetes` (Score: 87)
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-xs text-slate-700">2</div>
                  <div className="flex-1 bg-slate-50 border border-slate-200/60 p-2.5 rounded-lg text-xs font-semibold">
                    <span className="text-purple-600">DSA Prep:</span> Active graphs & Dynamic programming roadmaps
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-xs text-slate-700">3</div>
                  <div className="flex-1 bg-slate-50 border border-slate-200/60 p-2.5 rounded-lg text-xs font-semibold">
                    <span className="text-purple-600">Mock Arena:</span> Practice concurrency questions & review transcript feedback
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS SECTION ───────────────────────────── */}
      <section id="how-it-works" className="py-20 bg-slate-50 border-t border-slate-200/60 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-4">
              Get set up in three simple steps.
            </h2>
            <p className="text-slate-500 text-base leading-relaxed">
              No complex design skills or prompt engineering required. The system compiles visual modules automatically.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Step 1 */}
            <div className="space-y-4">
              <span className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm font-bold shadow-sm">1</span>
              <h3 className="text-lg font-bold text-slate-900">Paste your context</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Paste your experiences, target job roles, or upload study notes and resumes. The backend parses formatting and sections automatically.
              </p>
            </div>

            {/* Step 2 */}
            <div className="space-y-4">
              <span className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm font-bold shadow-sm">2</span>
              <h3 className="text-lg font-bold text-slate-900">Watch the AI visualize</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                FastAPI and Spring Boot generate daily roadmaps, score checklists, and mock interview questions tailored directly to your target company.
              </p>
            </div>

            {/* Step 3 */}
            <div className="space-y-4">
              <span className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm font-bold shadow-sm">3</span>
              <h3 className="text-lg font-bold text-slate-900">Refine, track and export</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Update roadmaps as you complete topics, practice mocks verbally, query RAG PDFs, and download tailored resumes as ATS-friendly DOCX files.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────── */}
      <footer className="border-t border-slate-200 px-6 py-12 text-slate-400 text-xs">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-slate-900 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="font-bold text-sm text-slate-900">AI CareerOS</span>
          </div>

          <div className="flex items-center gap-6">
            <span className="text-slate-500">© 2026 CareerPilot AI, Inc.</span>
            <a href="https://github.com/AnishaPaturi/CareerPilot-AI" target="_blank" rel="noreferrer" className="hover:text-slate-600 transition-colors">GitHub</a>
            <a href="https://github.com/AnishaPaturi/CareerPilot-AI/blob/main/LICENSE" target="_blank" rel="noreferrer" className="hover:text-slate-600 transition-colors">License</a>
          </div>
        </div>
      </footer>

    </div>
  );
}