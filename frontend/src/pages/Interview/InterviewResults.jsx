import { useEffect } from 'react';
import { useInterview } from '../../context/InterviewContext';
import { Download, Share2, RotateCcw, TrendingUp } from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

export function InterviewResults() {
  const { currentInterview, setInterviewTab, badges, user } = useInterview();

  useEffect(() => {
    // Celebrate with confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  }, []);

  const nextBadge = badges.find(b => !b.unlocked && b.pointsRequired > user.points);

  const performanceData = [
    { metric: 'Accuracy', score: currentInterview?.accuracy || 85 },
    { metric: 'Confidence', score: currentInterview?.confidence || 82 },
    { metric: 'Communication', score: currentInterview?.communication || 88 },
    { metric: 'Technical Depth', score: (currentInterview?.score || 8) * 10 },
    { metric: 'Problem Solving', score: (currentInterview?.score || 8) * 10 - 2 },
  ];

  const answerQuality = [
    { question: 'Q1', quality: (currentInterview?.accuracy || 85) },
    { question: 'Q2', quality: (currentInterview?.confidence || 82) },
    { question: 'Q3', quality: (currentInterview?.communication || 88) - 5 },
    { question: 'Q4', quality: (currentInterview?.score || 8) * 10 },
  ];

  const downloadTranscript = () => {
    if (!currentInterview) return;
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(currentInterview.transcript, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `interview_transcript_${currentInterview.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const shareResults = () => {
    alert(`I completed my AI interview for ${currentInterview?.role} with a score of ${currentInterview?.score}/10!`);
  };

  return (
    <div className="p-1 text-white max-w-6xl mx-auto space-y-8">
      {/* Success Banner */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/50 rounded-xl p-8 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="text-6xl mb-4"
        >
          🎉
        </motion.div>
        <h1 className="text-3xl font-bold text-white mb-2">Interview Completed!</h1>
        <p className="text-green-400">Great job! You've earned valuable points and insights.</p>
      </motion.div>

      {/* Points Earned */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-yellow-500/10 to-amber-500/10 border border-yellow-500/30 rounded-xl p-6 text-center"
        >
          <div className="text-5xl font-bold text-yellow-400 mb-2">+{currentInterview?.pointsEarned || 150}</div>
          <div className="text-sm text-slate-400">Points Earned</div>
          <div className="text-xs text-yellow-500 mt-1">
            Added to your profile
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-xl p-6 text-center"
        >
          <div className="text-5xl font-bold text-blue-400 mb-2">100%</div>
          <div className="text-sm text-slate-400">Completion</div>
          <div className="text-xs text-blue-500 mt-1">
            All questions answered
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl p-6 text-center"
        >
          <div className="text-5xl mb-2">🦌</div>
          <div className="text-sm text-slate-400">Badge Progress</div>
          <div className="text-xs text-purple-400 mt-1">
            {nextBadge ? `${nextBadge.pointsRequired - user.points} points to ${nextBadge.icon} ${nextBadge.name}` : 'Max Badge level unlocked!'}
          </div>
        </motion.div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Overall Performance */}
        <div className="bg-white/5 backdrop-blur-xl border border-purple-500/20 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-400" />
            Performance Breakdown
          </h3>
          <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height={300} minWidth={0}>
              <RadarChart data={performanceData}>
                <PolarGrid stroke="#ffffff20" />
                <PolarAngleAxis dataKey="metric" stroke="#9ca3af" />
                <PolarRadiusAxis stroke="#9ca3af" />
                <Radar name="Score" dataKey="score" stroke="#8a2be2" fill="#8a2be2" fillOpacity={0.6} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Answer Quality */}
        <div className="bg-white/5 backdrop-blur-xl border border-purple-500/20 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Question Quality</h3>
          <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height={300} minWidth={0}>
              <BarChart data={answerQuality}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="question" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#111827', border: '1px solid #6a11cb', color: '#fff' }}
                />
                <Bar dataKey="quality" fill="#00c6ff" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Detailed Scores */}
      <div className="bg-white/5 backdrop-blur-xl border border-purple-500/20 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Detailed Scores & Speech Metrics</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg">
            <div className="text-xs text-slate-400 mb-1">Accuracy Score</div>
            <div className="text-2xl font-bold text-green-400">{currentInterview?.accuracy || 85}%</div>
            <div className="w-full bg-white/10 rounded-full h-1.5 mt-2">
              <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${currentInterview?.accuracy || 85}%` }}></div>
            </div>
          </div>

          <div className="p-4 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-lg">
            <div className="text-xs text-slate-400 mb-1">Confidence Score</div>
            <div className="text-2xl font-bold text-blue-400">{currentInterview?.confidence || 82}%</div>
            <div className="w-full bg-white/10 rounded-full h-1.5 mt-2">
              <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${currentInterview?.confidence || 82}%` }}></div>
            </div>
          </div>

          <div className="p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg">
            <div className="text-xs text-slate-400 mb-1">Communication Score</div>
            <div className="text-2xl font-bold text-purple-400">{currentInterview?.communication || 88}%</div>
            <div className="w-full bg-white/10 rounded-full h-1.5 mt-2">
              <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: `${currentInterview?.communication || 88}%` }}></div>
            </div>
          </div>

          <div className="p-4 bg-gradient-to-br from-yellow-500/10 to-amber-500/10 border border-yellow-500/20 rounded-lg">
            <div className="text-xs text-slate-400 mb-1">Speaking Pacing</div>
            <div className="text-2xl font-bold text-yellow-400">{currentInterview?.averageWpm || 120} WPM</div>
            <div className="text-[10px] text-slate-400 mt-1.5 font-semibold">
              {currentInterview?.averageWpm > 150 ? "⚠️ Fast Speaker" : 
               currentInterview?.averageWpm < 90 ? "⚠️ Slow Speaker" : "✅ Optimal Pacing"}
            </div>
          </div>

          <div className="p-4 bg-gradient-to-br from-red-500/10 to-pink-500/10 border border-red-500/20 rounded-lg">
            <div className="text-xs text-slate-400 mb-1">Filler Words Used</div>
            <div className="text-2xl font-bold text-red-400">{currentInterview?.totalFillers || 0} words</div>
            <div className="text-[10px] text-slate-400 mt-1.5 font-semibold">
              {currentInterview?.totalFillers > 4 ? "⚠️ High usage" : "✅ Excellent control"}
            </div>
          </div>
        </div>
      </div>

      {/* Recorded Video Playback */}
      {currentInterview?.recordedVideoUrl && (
        <div className="bg-white/5 backdrop-blur-xl border border-purple-500/20 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Interview Recording Playback</h3>
          <div className="max-w-2xl mx-auto rounded-xl overflow-hidden border border-purple-500/20 bg-black shadow-2xl">
            <video src={currentInterview.recordedVideoUrl} controls className="w-full h-auto" />
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
        <button
          onClick={() => setInterviewTab('feedback')}
          className="py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg font-medium text-white hover:shadow-lg transition-all"
        >
          View Detailed Feedback
        </button>

        <button
          onClick={downloadTranscript}
          className="py-3 bg-white/5 border border-purple-500/30 rounded-lg font-medium text-white hover:bg-white/10 transition-all flex items-center justify-center gap-2"
        >
          <Download className="w-4 h-4" />
          Download Transcript
        </button>

        <button
          onClick={shareResults}
          className="py-3 bg-white/5 border border-purple-500/30 rounded-lg font-medium text-white hover:bg-white/10 transition-all flex items-center justify-center gap-2"
        >
          <Share2 className="w-4 h-4" />
          Share Results
        </button>

        <button
          onClick={() => setInterviewTab('setup')}
          className="py-3 bg-white/5 border border-purple-500/30 rounded-lg font-medium text-white hover:bg-white/10 transition-all flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Retry Interview
        </button>
      </div>
    </div>
  );
}
