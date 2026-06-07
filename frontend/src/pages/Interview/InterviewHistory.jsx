import { useInterview } from '../../context/InterviewContext';
import { Calendar, TrendingUp, Award, Eye } from 'lucide-react';

export function InterviewHistory() {
  const { interviews, setInterviewTab, setCurrentInterview } = useInterview();

  const viewDetails = (interview) => {
    setCurrentInterview(interview);
    setInterviewTab('feedback');
  };

  const totalPoints = interviews.reduce((sum, i) => sum + i.pointsEarned, 0);
  const averageScore = interviews.length > 0
    ? Math.round(interviews.reduce((sum, i) => sum + i.score, 0) / interviews.length)
    : 0;

  return (
    <div className="p-1 text-white max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Interview History</h1>
        <p className="text-slate-400">Review your past interviews and track progress</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/30 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-slate-400 mb-1">Total Interviews</div>
              <div className="text-3xl font-bold text-white">{interviews.length}</div>
            </div>
            <Calendar className="w-8 h-8 text-purple-400" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-slate-400 mb-1">Average Score</div>
              <div className="text-3xl font-bold text-white">{averageScore}/10</div>
            </div>
            <TrendingUp className="w-8 h-8 text-green-400" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500/10 to-amber-500/10 border border-yellow-500/30 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-slate-400 mb-1">Total Points Earned</div>
              <div className="text-3xl font-bold text-white">{totalPoints}</div>
            </div>
            <Award className="w-8 h-8 text-yellow-400" />
          </div>
        </div>
      </div>

      {/* Interview List */}
      <div className="bg-white/5 backdrop-blur-xl border border-purple-500/20 rounded-xl overflow-hidden">
        {interviews.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-purple-500/20 bg-white/5">
                  <th className="px-6 py-4 text-sm font-semibold text-slate-400">Date</th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-400">Topic</th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-400">Role</th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-400">Score</th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-400">Points</th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-400">Action</th>
                </tr>
              </thead>
              <tbody>
                {interviews.map((interview) => (
                  <tr
                    key={interview.id}
                    className="border-b border-purple-500/10 hover:bg-white/5 transition-all"
                  >
                    <td className="px-6 py-4 text-sm text-white">
                      {new Date(interview.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-4 text-sm text-white font-medium">{interview.topic}</td>
                    <td className="px-6 py-4 text-sm text-slate-400">{interview.role}</td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-white/10 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              interview.score >= 8
                                ? 'bg-green-500'
                                : interview.score >= 6
                                ? 'bg-yellow-500'
                                : 'bg-red-500'
                            }`}
                            style={{ width: `${interview.score * 10}%` }}
                          ></div>
                        </div>
                        <span className="font-semibold">{interview.score}/10</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-yellow-400 font-medium">+{interview.pointsEarned}</td>
                    <td className="px-6 py-4 text-sm">
                      <button
                        onClick={() => viewDetails(interview)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-500/15 border border-purple-500/30 rounded-lg text-purple-300 hover:bg-purple-500/30 transition-all font-semibold"
                      >
                        <Eye className="w-4 h-4" />
                        View Report
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-slate-500 italic">No interview history found.</div>
        )}
      </div>
    </div>
  );
}
