import { useInterview } from '../../context/InterviewContext';
import { Trophy } from 'lucide-react';

const leaderboardData = [
  { rank: 1, name: 'Sarah Chen', points: 2850, badge: '🐉', interviews: 28, accuracy: 94, streak: 15 },
  { rank: 2, name: 'Marcus Lee', points: 2340, badge: '🐅', interviews: 24, accuracy: 91, streak: 12 },
  { rank: 3, name: 'Elena Rodriguez', points: 1820, badge: '🐅', interviews: 22, accuracy: 88, streak: 10 },
  { rank: 4, name: 'Yuki Tanaka', points: 1450, badge: '🦅', interviews: 18, accuracy: 87, streak: 8 },
  { rank: 5, name: 'Omar Hassan', points: 1120, badge: '🦅', interviews: 16, accuracy: 85, streak: 7 },
  { rank: 6, name: 'Alex Morgan', points: 450, badge: '🦌', interviews: 12, accuracy: 84, streak: 5, isCurrentUser: true },
  { rank: 7, name: 'Emma Wilson', points: 380, badge: '🦌', interviews: 10, accuracy: 82, streak: 4 },
  { rank: 8, name: 'James Park', points: 290, badge: '🐟', interviews: 8, accuracy: 80, streak: 3 },
  { rank: 9, name: 'Lisa Zhang', points: 220, badge: '🐟', interviews: 7, accuracy: 78, streak: 2 },
  { rank: 10, name: 'David Kim', points: 150, badge: '🐟', interviews: 5, accuracy: 75, streak: 2 },
];

export function InterviewLeaderboard() {
  const { user, interviews, badges } = useInterview();
  
  const currentBadge = badges.find(b => b.id === user.currentBadge);
  const avgAccuracy = interviews.length > 0
    ? Math.round(interviews.reduce((sum, i) => sum + i.accuracy, 0) / interviews.length)
    : 84;

  // Dynamically insert current user details
  const dynamicLeaderboard = leaderboardData.map(entry => {
    if (entry.isCurrentUser) {
      return {
        ...entry,
        name: user.name,
        points: user.points,
        badge: currentBadge?.icon || '🌱',
        interviews: user.totalInterviews,
        accuracy: avgAccuracy,
      };
    }
    return entry;
  }).sort((a, b) => b.points - a.points); // sort ranking

  // Update ranks
  dynamicLeaderboard.forEach((entry, idx) => {
    entry.rank = idx + 1;
  });

  return (
    <div className="p-1 text-white max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Global Leaderboard</h1>
        <p className="text-slate-400">Compete with others and climb the ranks</p>
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-3 gap-4">
        {/* 2nd Place */}
        {dynamicLeaderboard[1] && (
          <div className="bg-gradient-to-br from-gray-400/10 to-gray-500/10 border border-gray-400/30 rounded-xl p-6 text-center mt-8">
            <div className="text-5xl mb-3">🥈</div>
            <div className="text-3xl mb-2">{dynamicLeaderboard[1].badge}</div>
            <h3 className="text-lg font-semibold text-white mb-1 truncate">{dynamicLeaderboard[1].name}</h3>
            <div className="text-2xl font-bold text-slate-300 mb-1">{dynamicLeaderboard[1].points}</div>
            <div className="text-xs text-slate-500">points</div>
          </div>
        )}

        {/* 1st Place */}
        {dynamicLeaderboard[0] && (
          <div className="bg-gradient-to-br from-yellow-500/20 to-amber-500/20 border-2 border-yellow-500/50 rounded-xl p-6 text-center shadow-lg shadow-yellow-500/20">
            <div className="text-6xl mb-3">🥇</div>
            <div className="text-4xl mb-2">{dynamicLeaderboard[0].badge}</div>
            <h3 className="text-xl font-semibold text-white mb-1 truncate">{dynamicLeaderboard[0].name}</h3>
            <div className="text-3xl font-bold text-yellow-400 mb-1">{dynamicLeaderboard[0].points}</div>
            <div className="text-sm text-yellow-500">points</div>
            <Trophy className="w-8 h-8 text-yellow-400 mx-auto mt-3" />
          </div>
        )}

        {/* 3rd Place */}
        {dynamicLeaderboard[2] && (
          <div className="bg-gradient-to-br from-amber-700/10 to-orange-700/10 border border-amber-700/30 rounded-xl p-6 text-center mt-8">
            <div className="text-5xl mb-3">🥉</div>
            <div className="text-3xl mb-2">{dynamicLeaderboard[2].badge}</div>
            <h3 className="text-lg font-semibold text-white mb-1 truncate">{dynamicLeaderboard[2].name}</h3>
            <div className="text-2xl font-bold text-amber-600 mb-1">{dynamicLeaderboard[2].points}</div>
            <div className="text-xs text-slate-500">points</div>
          </div>
        )}
      </div>

      {/* Full Leaderboard Table */}
      <div className="bg-white/5 backdrop-blur-xl border border-purple-500/20 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-purple-500/20">
          <h2 className="text-xl font-semibold text-white">Full Rankings</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-purple-500/20 bg-white/5">
                <th className="px-6 py-4 text-sm font-semibold text-slate-400">Rank</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-400">User</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-400">Badge</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-400">Points</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-400">Interviews</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-400">Accuracy</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-400">Streak</th>
              </tr>
            </thead>
            <tbody>
              {dynamicLeaderboard.map((user) => (
                <tr
                  key={user.rank}
                  className={`border-b border-purple-500/10 transition-all ${
                    user.isCurrentUser
                      ? 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 border-y border-purple-500/30'
                      : 'hover:bg-white/5'
                  }`}
                >
                  <td className="px-6 py-4">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold ${
                      user.rank === 1 ? 'bg-yellow-500/20 text-yellow-400' :
                      user.rank === 2 ? 'bg-gray-400/20 text-gray-300' :
                      user.rank === 3 ? 'bg-amber-700/20 text-amber-600' :
                      'bg-white/10 text-slate-400'
                    }`}>
                      {user.rank}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-white">{user.name}</span>
                    {user.isCurrentUser && (
                      <span className="ml-2 px-2 py-0.5 bg-purple-500/20 border border-purple-500/40 text-purple-300 rounded text-[10px] font-bold">
                        YOU
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-xl">{user.badge}</td>
                  <td className="px-6 py-4 text-yellow-400 font-semibold">{user.points}</td>
                  <td className="px-6 py-4 text-slate-300">{user.interviews}</td>
                  <td className="px-6 py-4 text-green-400 font-semibold">{user.accuracy}%</td>
                  <td className="px-6 py-4 text-orange-400 font-semibold">🔥 {user.streak} days</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
