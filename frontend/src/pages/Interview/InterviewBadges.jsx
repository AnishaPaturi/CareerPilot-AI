import { useInterview } from '../../context/InterviewContext';
import { Lock } from 'lucide-react';
import { motion } from 'framer-motion';

export function InterviewBadges() {
  const { user, badges } = useInterview();
  const currentBadge = badges.find(b => b.id === user.currentBadge);

  return (
    <div className="p-1 text-white max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Badges & Achievements</h1>
        <p className="text-slate-400">Unlock badges as you progress through your interview journey</p>
      </div>

      {/* Current Progress */}
      <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/30 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-white mb-1">Your Progress</h2>
            <p className="text-sm text-slate-400">Current Badge: {currentBadge?.name || 'Seed'}</p>
          </div>
          <div className="text-6xl">
            {currentBadge?.icon || '🌱'}
          </div>
        </div>
        <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min((user.points / 2500) * 100, 100)}%` }}
            className="h-full bg-gradient-to-r from-purple-600 to-blue-600"
          />
        </div>
        <div className="flex justify-between mt-2 text-sm text-slate-400">
          <span>{user.points} points</span>
          <span>2500 points (Max)</span>
        </div>
      </div>

      {/* Badge Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {badges.map((badge, index) => (
          <motion.div
            key={badge.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`relative p-6 rounded-xl border-2 transition-all ${
              badge.unlocked
                ? 'bg-gradient-to-br from-purple-500/20 to-blue-500/20 border-purple-500/50 shadow-lg shadow-purple-500/20'
                : 'bg-white/5 border-slate-700/30'
            }`}
          >
            {/* Lock Overlay for Locked Badges */}
            {!badge.unlocked && (
              <div className="absolute inset-0 backdrop-blur-sm bg-black/40 rounded-xl flex items-center justify-center">
                <Lock className="w-12 h-12 text-slate-500" />
              </div>
            )}

            <div className="text-center">
              <div className={`text-6xl mb-3 ${!badge.unlocked && 'grayscale opacity-30'}`}>
                {badge.icon}
              </div>
              <h3 className={`text-xl font-semibold mb-2 ${badge.unlocked ? 'text-white' : 'text-slate-500'}`}>
                {badge.name}
              </h3>
              <p className={`text-sm mb-4 ${badge.unlocked ? 'text-slate-400' : 'text-slate-600'}`}>
                {badge.pointsRequired} points required
              </p>
              {badge.unlocked ? (
                <div className="inline-block px-3 py-1 bg-green-500/20 border border-green-500/50 rounded-full text-xs text-green-400">
                  ✓ Unlocked
                </div>
              ) : (
                <div className="inline-block px-3 py-1 bg-slate-700/20 border border-slate-700/50 rounded-full text-xs text-slate-500">
                  {badge.pointsRequired - user.points} points needed
                </div>
              )}
            </div>

            {/* Glow Effect for Unlocked Badges */}
            {badge.unlocked && (
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/20 to-blue-500/20 blur-xl -z-10"></div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Badge Hierarchy Info */}
      <div className="bg-white/5 backdrop-blur-xl border border-purple-500/20 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Badge Hierarchy</h3>
        <div className="space-y-3">
          {badges.map((badge) => (
            <div key={badge.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg text-sm">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{badge.icon}</span>
                <span className="font-semibold">{badge.name}</span>
              </div>
              <span className="text-slate-400">{badge.pointsRequired} points required</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
