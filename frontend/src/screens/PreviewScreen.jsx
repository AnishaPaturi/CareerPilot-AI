import React from 'react';
import { FileText, ArrowLeft, Download, Edit } from 'lucide-react';

export default function PreviewScreen() {
  const data = JSON.parse(localStorage.getItem('resumeData') || '{}');
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white p-6 font-sans">
      <div className="max-w-4xl mx-auto flex justify-between items-center border-b border-white/10 pb-6 mb-8">
        <div>
          <button
            onClick={() => window.location.href = '/resume/form'}
            className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-all text-xs font-bold uppercase tracking-wider mb-2"
          >
            <ArrowLeft size={14} /> Back to Builder
          </button>
          <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-2">
            Resume Preview <span className="text-purple-400 text-sm font-medium px-2 py-0.5 bg-purple-500/10 border border-purple-500/30 rounded-md">RENDER VIEW</span>
          </h1>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => window.print()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white transition-all text-xs hover:shadow-lg active:scale-95"
          >
            <Download size={14} /> Print / Save PDF
          </button>
          <button 
            onClick={() => window.location.href = '/resume/form'}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all text-xs active:scale-95"
          >
            <Edit size={14} /> Edit Content
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto bg-slate-900/40 border border-white/10 rounded-2xl p-8 shadow-2xl backdrop-blur-xl space-y-6">
        
        {/* Contact Info Header */}
        <div className="text-center space-y-2 border-b border-white/10 pb-6">
          <h2 className="text-3xl font-black text-white tracking-tight">{data.name || "Your Name"}</h2>
          <p className="text-sm text-slate-400">
            {data.email || "email@example.com"} {data.phone && `| ${data.phone}`}
          </p>
        </div>
        
        {/* Professional Summary */}
        {data.summary && (
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-purple-400 uppercase tracking-widest border-l-2 border-purple-500 pl-3">Professional Summary</h3>
            <p className="text-sm text-slate-300 leading-relaxed pl-3">{data.summary}</p>
          </div>
        )}
        
        {/* Skills */}
        {data.skills && (
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-purple-400 uppercase tracking-widest border-l-2 border-purple-500 pl-3">Skills</h3>
            <div className="flex flex-wrap gap-2 pl-3">
              {data.skills.split(',').map((skill, index) => (
                <span key={index} className="text-xs px-3 py-1 bg-white/[0.03] border border-white/10 text-slate-300 rounded-full font-semibold">
                  {skill.trim()}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {/* Experience */}
        {data.experience && (
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-purple-400 uppercase tracking-widest border-l-2 border-purple-500 pl-3">Experience</h3>
            <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap pl-3 font-mono">
              {data.experience}
            </div>
          </div>
        )}
        
        {/* Projects */}
        {data.projects && (
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-purple-400 uppercase tracking-widest border-l-2 border-purple-500 pl-3">Projects</h3>
            <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap pl-3 font-mono">
              {data.projects}
            </div>
          </div>
        )}

        {/* Education */}
        {data.education && (
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-purple-400 uppercase tracking-widest border-l-2 border-purple-500 pl-3">Education</h3>
            <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap pl-3 font-mono">
              {data.education}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}