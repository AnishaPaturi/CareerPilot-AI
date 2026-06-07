import { InterviewProvider, useInterview } from '../context/InterviewContext';
import { InterviewDashboard } from '../pages/Interview/InterviewDashboard';
import { InterviewSetup } from '../pages/Interview/InterviewSetup';
import { InterviewRoom } from '../pages/Interview/InterviewRoom';
import { InterviewResults } from '../pages/Interview/InterviewResults';
import { InterviewFeedback } from '../pages/Interview/InterviewFeedback';
import { InterviewBadges } from '../pages/Interview/InterviewBadges';
import { InterviewPractice } from '../pages/Interview/InterviewPractice';
import { InterviewHistory } from '../pages/Interview/InterviewHistory';
import { InterviewLeaderboard } from '../pages/Interview/InterviewLeaderboard';
import { LayoutDashboard, Video, Play, History, Award, Trophy } from 'lucide-react';

const TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'setup', label: 'Start Interview', icon: Video },
  { id: 'practice', label: 'Practice Mode', icon: Play },
  { id: 'history', label: 'History', icon: History },
  { id: 'badges', label: 'Badges', icon: Award },
  { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
];

function AIInterviewWrapper() {
  const { activeTab, setInterviewTab } = useInterview();

  // Hide navigation tabs during the live interview session for distraction-free proctoring
  const showNav = activeTab !== 'room';

  return (
    <div className="space-y-6">
      {showNav && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-2 flex flex-wrap gap-2 max-w-6xl mx-auto shadow-md">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id || 
                             (tab.id === 'setup' && (activeTab === 'results' || activeTab === 'feedback'));
            
            return (
              <button
                key={tab.id}
                onClick={() => setInterviewTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-600/30 to-blue-600/30 text-white border border-purple-500/50 shadow shadow-purple-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      )}

      <div className="mt-4">
        {activeTab === 'dashboard' && <InterviewDashboard />}
        {activeTab === 'setup' && <InterviewSetup />}
        {activeTab === 'room' && <InterviewRoom />}
        {activeTab === 'results' && <InterviewResults />}
        {activeTab === 'feedback' && <InterviewFeedback />}
        {activeTab === 'badges' && <InterviewBadges />}
        {activeTab === 'practice' && <InterviewPractice />}
        {activeTab === 'history' && <InterviewHistory />}
        {activeTab === 'leaderboard' && <InterviewLeaderboard />}
      </div>
    </div>
  );
}

export default function AIInterviewSimulator() {
  return (
    <InterviewProvider>
      <AIInterviewWrapper />
    </InterviewProvider>
  );
}
