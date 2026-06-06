import { useState } from "react";
import { atsAPI } from "../services/api";
import { Sparkles, Wand2, PlusCircle, Briefcase, Download } from "lucide-react";
import { downloadResume as downloadResumeHTML } from "../utils/resumeTemplate";

export default function ResumeRewriter({ resumeText, onImproved }) {
  const [loading, setLoading] = useState(false);
  const [improved, setImproved] = useState("");
  const [mode, setMode] = useState("improve"); // "improve" or "scratch"
  const [jobDescription, setJobDescription] = useState("");

  const rewriteResume = async () => {
    if (mode === "scratch" && !jobDescription.trim()) {
      alert("Please enter a Job Description to build a resume from scratch.");
      return;
    }

    setLoading(true);
    try {
      const data = await atsAPI.rewrite({
        section: mode === "improve" ? resumeText : "",
        job_description: jobDescription,
        mode
      });
      if (data && data.error) {
        throw new Error(data.error);
      }
      setImproved(data.rewritten);
      if (onImproved) onImproved(data.rewritten, mode);
    } catch (err) {
      console.error(err);
      alert("Failed to process resume improvement: " + err.message);
    }
    setLoading(false);
  };

  const downloadResume = () => {
    downloadResumeHTML(improved, mode);
  };

  return (
    <div className="bg-white/[0.04] border border-white/10 rounded-xl p-6 mt-6 space-y-6">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="text-purple-400" size={22} />
          <h3 className="text-white font-bold text-lg">AI Resume Tailor & Writer</h3>
        </div>
      </div>

      {/* Mode Selection Tabs */}
      <div className="grid grid-cols-2 gap-2 bg-slate-900/60 p-1 rounded-lg border border-white/5">
        <button
          type="button"
          onClick={() => {
            setMode("improve");
            setImproved("");
            if (onImproved) onImproved("", "improve");
          }}
          className={`flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-semibold transition-all ${
            mode === "improve"
              ? "bg-purple-600 text-white shadow-md"
              : "text-slate-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <Wand2 size={16} />
          Improve Existing Resume
        </button>
        <button
          type="button"
          onClick={() => {
            setMode("scratch");
            setImproved("");
            if (onImproved) onImproved("", "scratch");
          }}
          className={`flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-semibold transition-all ${
            mode === "scratch"
              ? "bg-purple-600 text-white shadow-md"
              : "text-slate-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <PlusCircle size={16} />
          Build Resume from Scratch
        </button>
      </div>

      {/* Optional Job Description Input */}
      <div className="space-y-2">
        <label className="text-slate-300 text-sm font-semibold flex items-center gap-1.5">
          <Briefcase size={16} className="text-purple-400" />
          Target Job Description {mode === "improve" ? "(Optional)" : "(Required)"}
        </label>
        <textarea
          value={jobDescription}
          onChange={e => setJobDescription(e.target.value)}
          placeholder={
            mode === "improve"
              ? "Paste the target job description to tailor the rewritten sections directly to the role requirements..."
              : "Paste the job description of the role you want to apply for. The AI will generate a tailored, professional resume outline..."
          }
          className="w-full h-32 bg-slate-800/50 border border-white/10 rounded-lg p-3 text-sm text-slate-200 focus:outline-none focus:ring-2 ring-purple-500 placeholder-slate-500"
        />
      </div>

      {/* Action Button */}
      <div>
        <button
          type="button"
          onClick={rewriteResume}
          disabled={loading}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-bold transition-all shadow-md shadow-purple-900/30 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            mode === "improve" ? "Improving Resume..." : "Generating Resume..."
          ) : (
            <>
              {mode === "improve" ? <Wand2 size={18} /> : <Sparkles size={18} />}
              {mode === "improve" ? "Optimize & Tailor Resume" : "Generate Custom Resume"}
            </>
          )}
        </button>
      </div>

      {/* Output Display */}
      {improved && (
        <div className="space-y-3 pt-2 animate-fadeIn">
          <div className="flex items-center justify-between">
            <h4 className="text-white font-bold text-sm">
              {mode === "improve" ? "Optimized & Tailored Resume" : "Generated Custom Resume"}
            </h4>
            <button
              type="button"
              onClick={downloadResume}
              className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white text-xs px-3.5 py-1.5 rounded-lg font-bold transition-all"
            >
              <Download size={14} />
              Download Resume
            </button>
          </div>

          <textarea
            value={improved}
            readOnly
            className="w-full h-80 bg-slate-900/80 border border-white/10 rounded-lg p-4 text-sm text-slate-100 font-mono leading-relaxed"
          />
        </div>
      )}
    </div>
  );
}
