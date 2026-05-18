import { useLocation, useNavigate } from "react-router-dom";
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer
} from "recharts";
import ResumeRewriter from "../components/ResumeRewriter";

export default function Report() {

  const location = useLocation();
  const navigate = useNavigate();

  const data = location.state?.analysis;

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-slate-950">
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-purple-600 px-6 py-3 rounded-lg"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  const { parsedData, skillMatch, score } = data;

  const skills = parsedData?.skills || [];
  const missing = skillMatch?.missingSkills || [];

  const atsScore = Math.min(
    100,
    Math.round((skills.length / (skills.length + missing.length || 1)) * 100)
  );

  const radarData = skills.slice(0,6).map(s => ({
    skill: s,
    value: 80
  }));

  const heatmapSkills = [...skills, ...missing];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white p-8">

      <h1 className="text-3xl font-bold mb-8">AI Resume Analysis</h1>

      {/* ATS SCORE */}
      <div className="bg-white/5 border border-white/10 p-6 rounded-xl mb-8">
        <h2 className="text-lg mb-2">ATS Score</h2>

        <div className="w-full bg-slate-700 rounded-full h-4">
          <div
            className="bg-purple-500 h-4 rounded-full"
            style={{ width: `${atsScore}%` }}
          />
        </div>

        <p className="mt-2 text-purple-400 font-bold">{atsScore}%</p>
      </div>

      {/* GRID */}
      <div className="grid lg:grid-cols-2 gap-8">

        {/* RADAR CHART */}
        <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
          <h3 className="text-lg mb-4">Skill Radar</h3>

          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="skill" />
              <PolarRadiusAxis />
              <Radar
                name="Skills"
                dataKey="value"
                stroke="#8b5cf6"
                fill="#8b5cf6"
                fillOpacity={0.6}
              />
            </RadarChart>
          </ResponsiveContainer>

        </div>

        {/* SKILL HEATMAP */}
        <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
          <h3 className="text-lg mb-4">Skill Heatmap</h3>

          <div className="flex flex-wrap gap-2">

            {heatmapSkills.map((skill,i)=>{

              const isMissing = missing.includes(skill);

              return (
                <span
                  key={i}
                  className={`px-3 py-1 rounded-full text-sm ${
                    isMissing
                      ? "bg-red-500/20 text-red-300"
                      : "bg-green-500/20 text-green-300"
                  }`}
                >
                  {skill}
                </span>
              );
            })}

          </div>
        </div>

      </div>

      {/* STRENGTHS / WEAKNESSES */}
      <div className="grid md:grid-cols-2 gap-8 mt-8">

        <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
          <h3 className="text-green-400 mb-4">Strengths</h3>

          <ul className="space-y-2 text-slate-300">
            {score?.strengths?.map((s,i)=>(
              <li key={i}>• {s}</li>
            ))}
          </ul>

        </div>

        <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
          <h3 className="text-red-400 mb-4">Weaknesses</h3>

          <ul className="space-y-2 text-slate-300">
            {score?.weaknesses?.map((w,i)=>(
              <li key={i}>• {w}</li>
            ))}
          </ul>

        </div>

      </div>

      {/* DOWNLOAD BUTTON */}
      <div className="mt-10 flex gap-4">

        <button
          className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-xl"
        >
          Download Improved Resume
        </button>

        <button
          onClick={()=>navigate("/dashboard")}
          className="bg-slate-700 hover:bg-slate-600 px-6 py-3 rounded-xl"
        >
          Back
        </button>

      </div>

    </div>
  );
}
