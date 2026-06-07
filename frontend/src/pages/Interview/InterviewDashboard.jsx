import { useInterview } from '../../context/InterviewContext';
import { TrendingUp, Target, Award, Zap, Calendar } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const performanceData = [
  { date: 'Mar 1', score: 65 },
  { date: 'Mar 5', score: 70 },
  { date: 'Mar 8', score: 75 },
  { date: 'Mar 10', score: 78 },
  { date: 'Mar 12', score: 82 },
  { date: 'Mar 15', score: 85 },
];

const pointsData = [
  { date: 'Week 1', points: 100 },
  { date: 'Week 2', points: 180 },
  { date: 'Week 3', points: 280 },
  { date: 'Week 4', points: 450 },
];

const topicMasteryData = [
  { topic: 'Algorithms', score: 85 },
  { topic: 'System Design', score: 75 },
  { topic: 'ML/AI', score: 68 },
  { topic: 'Networking', score: 80 },
  { topic: 'Databases', score: 72 },
];

export function InterviewDashboard() {
  const { user, interviews, badges, setInterviewTab, students } = useInterview();
  const currentBadge = badges.find(b => b.id === user.currentBadge);
  const nextBadge = badges.find(b => !b.unlocked && b.pointsRequired > user.points);

  const totalInterviews = interviews.length;
  const avgAccuracy = interviews.length > 0
    ? Math.round(interviews.reduce((sum, i) => sum + i.accuracy, 0) / interviews.length)
    : 84;

  const getBadgeIcon = (pts) => {
    if (pts >= 2500) return '🐉';
    if (pts >= 1500) return '🐅';
    if (pts >= 1000) return '🦅';
    if (pts >= 600) return '🐺';
    if (pts >= 300) return '🦌';
    if (pts >= 100) return '🐟';
    return '🌱';
  };

  // Construct dynamic leaderboard from real DB students
  const dynamicLeaderboard = [];
  
  // 1. Add current user
  dynamicLeaderboard.push({
    name: user.name,
    email: user.email,
    points: user.points,
    badge: currentBadge?.icon || '🌱',
    interviews: user.totalInterviews,
    accuracy: avgAccuracy,
    streak: interviews.length > 0 ? Math.max(2, ...interviews.map(i => i.pointsEarned > 0 ? 3 : 1)) : 5,
    isCurrentUser: true
  });

  // 2. Add other registered students deterministically
  if (Array.isArray(students)) {
    students.forEach(student => {
      // Skip if it's the current user (based on email)
      if (student.email && student.email.toLowerCase() === user.email.toLowerCase()) return;

      const seed = student.id || 1;
      const points = Math.round(150 + ((seed * 117) % 2300));
      const accuracy = Math.round(75 + ((seed * 3) % 20));
      const totalInterviews = Math.round(3 + ((seed * 7) % 22));
      const streak = Math.round(1 + ((seed * 2) % 12));

      dynamicLeaderboard.push({
        name: student.name || 'Anonymous Student',
        email: student.email || `student${seed}@example.com`,
        points: points,
        badge: getBadgeIcon(points),
        interviews: totalInterviews,
        accuracy: accuracy,
        streak: streak,
        isCurrentUser: false
      });
    });
  }

  // 3. Pad with realistic mock data if we have fewer than 8 total participants
  if (dynamicLeaderboard.length < 8) {
    const mockBackups = [
      { name: 'Sarah Chen', email: 'sarah@example.com', points: 2850, badge: '🐉', interviews: 28, accuracy: 94, streak: 15 },
      { name: 'Marcus Lee', email: 'marcus@example.com', points: 2340, badge: '🐅', interviews: 24, accuracy: 91, streak: 12 },
      { name: 'Elena Rodriguez', email: 'elena@example.com', points: 1820, badge: '🐅', interviews: 22, accuracy: 88, streak: 10 },
      { name: 'Yuki Tanaka', email: 'yuki@example.com', points: 1450, badge: '🦅', interviews: 18, accuracy: 87, streak: 8 },
      { name: 'Omar Hassan', email: 'omar@example.com', points: 1120, badge: '🦅', interviews: 16, accuracy: 85, streak: 7 },
      { name: 'Emma Wilson', email: 'emma@example.com', points: 380, badge: '🦌', interviews: 10, accuracy: 82, streak: 4 },
      { name: 'James Park', email: 'james@example.com', points: 290, badge: '🐟', interviews: 8, accuracy: 80, streak: 3 }
    ];

    mockBackups.forEach(backup => {
      if (!dynamicLeaderboard.some(item => item.email && item.email.toLowerCase() === backup.email.toLowerCase())) {
        dynamicLeaderboard.push({
          ...backup,
          isCurrentUser: false
        });
      }
    });
  }

  // Sort by points descending
  dynamicLeaderboard.sort((a, b) => b.points - a.points);

  // Assign ranks
  dynamicLeaderboard.forEach((entry, idx) => {
    entry.rank = idx + 1;
  });

  const leaderboardData = dynamicLeaderboard.slice(0, 5);

  return (
    <div className="p-1 space-y-8 text-white max-w-6xl mx-auto">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Welcome back, {user.name}! 👋
        </h1>
        <p className="text-slate-400">Track your progress and continue your interview journey</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Points */}
        <div className="bg-gradient-to-br from-yellow-500/10 to-amber-500/10 border border-yellow-500/30 rounded-xl p-6 shadow-lg shadow-yellow-500/10">
          <div className="flex items-center justify-between mb-4">
            <Zap className="w-8 h-8 text-yellow-400" />
            <div className="text-right">
              <div className="text-3xl font-bold text-white">{user.points}</div>
              <div className="text-xs text-yellow-400">Total Points</div>
            </div>
          </div>
          <div className="text-sm text-slate-400">
            {nextBadge ? `${nextBadge.pointsRequired - user.points} to ${nextBadge.icon} ${nextBadge.name}` : 'Max level reached!'}
          </div>
        </div>

        {/* Current Badge */}
        <div 
          onClick={() => setInterviewTab('badges')}
          className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl p-6 shadow-lg shadow-purple-500/10 cursor-pointer hover:border-purple-500/50 transition-all"
        >
          <div className="flex items-center justify-between mb-4">
            <Award className="w-8 h-8 text-purple-400" />
            <div className="text-right">
              <div className="text-3xl">{currentBadge?.icon || '🌱'}</div>
              <div className="text-xs text-purple-400">Current Badge</div>
            </div>
          </div>
          <div className="text-sm text-slate-400">{currentBadge?.name || 'Seed'} Level</div>
        </div>

        {/* Interviews Completed */}
        <div 
          onClick={() => setInterviewTab('history')}
          className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-xl p-6 shadow-lg shadow-blue-500/10 cursor-pointer hover:border-blue-500/50 transition-all"
        >
          <div className="flex items-center justify-between mb-4">
            <Target className="w-8 h-8 text-blue-400" />
            <div className="text-right">
              <div className="text-3xl font-bold text-white">{totalInterviews}</div>
              <div className="text-xs text-blue-400">Interviews</div>
            </div>
          </div>
          <div className="text-sm text-slate-400">Total Completed</div>
        </div>

        {/* Accuracy Rate */}
        <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl p-6 shadow-lg shadow-green-500/10">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-8 h-8 text-green-400" />
            <div className="text-right">
              <div className="text-3xl font-bold text-white">{avgAccuracy}%</div>
              <div className="text-xs text-green-400">Accuracy</div>
            </div>
          </div>
          <div className="text-sm text-slate-400">Average Score</div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Interview Performance Over Time */}
        <div className="bg-white/5 backdrop-blur-xl border border-purple-500/20 rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-white mb-4">Interview Performance</h3>
          <div className="w-full h-[250px]">
            <ResponsiveContainer width="100%" height={250} minWidth={0}>
              <AreaChart data={performanceData}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8a2be2" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8a2be2" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="date" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#111827', border: '1px solid #6a11cb', color: '#fff' }}
                />
                <Area type="monotone" dataKey="score" stroke="#8a2be2" fillOpacity={1} fill="url(#colorScore)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Points Progression */}
        <div className="bg-white/5 backdrop-blur-xl border border-purple-500/20 rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-white mb-4">Points Progression</h3>
          <div className="w-full h-[250px]">
            <ResponsiveContainer width="100%" height={250} minWidth={0}>
              <LineChart data={pointsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="date" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#111827', border: '1px solid #6a11cb', color: '#fff' }}
                />
                <Line type="monotone" dataKey="points" stroke="#00c6ff" strokeWidth={3} dot={{ fill: '#00c6ff' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Topic Mastery Radar */}
        <div className="bg-white/5 backdrop-blur-xl border border-purple-500/20 rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-white mb-4">Topic Mastery</h3>
          <div className="w-full h-[250px]">
            <ResponsiveContainer width="100%" height={250} minWidth={0}>
              <RadarChart data={topicMasteryData}>
                <PolarGrid stroke="#ffffff20" />
                <PolarAngleAxis dataKey="topic" stroke="#9ca3af" />
                <PolarRadiusAxis stroke="#9ca3af" />
                <Radar name="Score" dataKey="score" stroke="#8a2be2" fill="#8a2be2" fillOpacity={0.6} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="bg-white/5 backdrop-blur-xl border border-purple-500/20 rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-white mb-4">Leaderboard</h3>
          <div className="space-y-3">
            {leaderboardData.map((entry) => (
              <div
                key={entry.rank}
                className={`flex items-center gap-3 p-3 rounded-lg ${
                  entry.isCurrentUser
                    ? 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/50'
                    : 'bg-white/5'
                }`}
              >
                <div className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold ${
                  entry.rank === 1 ? 'bg-yellow-500/20 text-yellow-400' :
                  entry.rank === 2 ? 'bg-gray-400/20 text-gray-300' :
                  entry.rank === 3 ? 'bg-amber-700/20 text-amber-600' :
                  'bg-white/10 text-gray-400'
                }`}>
                  {entry.rank}
                </div>
                <div className="flex-1">
                  <div className="text-sm text-white font-medium">{entry.name}</div>
                  <div className="text-xs text-slate-400">{entry.points} pts</div>
                </div>
                <div className="text-xl">{entry.badge}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Daily Challenge & Achievements */}
        <div className="space-y-6">
          {/* Daily Challenge */}
          <div className="bg-gradient-to-br from-[#6a11cb]/20 to-[#00c6ff]/20 border border-purple-500/30 rounded-xl p-6 shadow-lg shadow-purple-500/10">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-5 h-5 text-purple-400" />
              <h3 className="text-lg font-semibold text-white">Daily Challenge</h3>
            </div>
            <p className="text-sm text-slate-300 mb-4">
              Complete today's AI interview challenge to earn bonus points!
            </p>
            <button 
              onClick={() => setInterviewTab('setup')}
              className="w-full py-2 bg-gradient-to-r from-[#6a11cb] to-[#00c6ff] rounded-lg text-sm font-medium text-white hover:shadow-lg transition-all"
            >
              Start Challenge (+50 pts)
            </button>
          </div>

          {/* Recently Unlocked Badges */}
          <div className="bg-white/5 backdrop-blur-xl border border-purple-500/20 rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-white mb-4">Recent Achievements</h3>
            <div className="space-y-3">
              {badges.filter(b => b.unlocked).slice(-3).reverse().map((badge) => (
                <div key={badge.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                  <div className="text-2xl">{badge.icon}</div>
                  <div>
                    <div className="text-sm text-white font-medium">{badge.name}</div>
                    <div className="text-xs text-slate-400">{badge.pointsRequired} points</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
