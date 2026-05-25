import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient blobs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-900/5 rounded-full blur-3xl pointer-events-none" />

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.02)_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />

      <div className="relative w-full max-w-2xl text-center">
        {/* Logo */}
        <div className="inline-flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/25">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <span className="text-white font-semibold text-2xl tracking-tight">ResumeAI</span>
        </div>

        {/* Hero content */}
        <div className="mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tight mb-4">
            Build Your Career with AI
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-lg mx-auto">
            Create professional resumes, practice interviews, and accelerate your career growth with our AI-powered platform.
          </p>
        </div>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/signup"
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-medium rounded-xl text-sm transition-all duration-200 shadow-lg shadow-purple-900/30 hover:shadow-purple-900/50 hover:-translate-y-0.5"
          >
            Get Started
          </Link>
          <Link
            to="/login"
            className="px-8 py-3 bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] text-slate-300 font-medium rounded-xl text-sm transition-all duration-200"
          >
            Sign In
          </Link>
        </div>

        {/* Features */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center mb-4 mx-auto">
              <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-white font-semibold mb-2">AI Resume Builder</h3>
            <p className="text-slate-400 text-sm">Generate professional resumes tailored to your target role</p>
          </div>
          <div className="bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center mb-4 mx-auto">
              <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-white font-semibold mb-2">Interview Simulator</h3>
            <p className="text-slate-400 text-sm">Practice with AI-powered mock interviews</p>
          </div>
          <div className="bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center mb-4 mx-auto">
              <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-white font-semibold mb-2">Career Insights</h3>
            <p className="text-slate-400 text-sm">Get personalized recommendations for career growth</p>
          </div>
        </div>
      </div>
    </div>
  );
}