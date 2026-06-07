import { useInterview } from '../../context/InterviewContext';
import { ThumbsUp, ThumbsDown, Lightbulb, TrendingUp } from 'lucide-react';

export function InterviewFeedback() {
  const { currentInterview, setInterviewTab } = useInterview();

  // Load actual feedback from the current session or use high-quality defaults
  const strengths = currentInterview?.feedback?.strengths || [
    'Clear and structured communication',
    'Good understanding of core principles',
    'Proper use of technical terminology',
    'Confident delivery and pacing',
  ];
  
  const weaknesses = currentInterview?.feedback?.weaknesses || [
    'Could provide more specific examples from past projects',
    'Need to elaborate on scaling considerations',
    'Limited discussion of edge cases',
  ];

  const improvements = currentInterview?.feedback?.improvements || [
    'Practice explaining complex concepts with real-world analogies',
    'Study distributed systems and caching strategies in depth',
    'Work on time management - some answers were too brief',
  ];

  const topicSuggestions = [
    { topic: 'System Design', priority: 'High', description: 'Focus on designing scalable architectures' },
    { topic: 'Caching Strategies', priority: 'High', description: 'Learn Redis, Memcached implementations' },
    { topic: 'Database Optimization', priority: 'Medium', description: 'Study indexing and query optimization' },
    { topic: 'Microservices', priority: 'Medium', description: 'Understand service communication patterns' },
  ];

  return (
    <div className="p-1 text-white max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">AI Feedback & Analysis</h1>
        <p className="text-slate-400">Detailed insights to help you improve</p>
      </div>

      {/* Strengths */}
      <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <ThumbsUp className="w-6 h-6 text-green-400" />
          <h2 className="text-xl font-semibold text-white">Strengths</h2>
        </div>
        <div className="space-y-3">
          {strengths.map((strength, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
              <div className="w-6 h-6 flex items-center justify-center bg-green-500/20 rounded-full text-green-400 text-sm font-bold mt-0.5">
                ✓
              </div>
              <p className="text-slate-200 flex-1">{strength}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Weaknesses */}
      <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/30 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <ThumbsDown className="w-6 h-6 text-orange-400" />
          <h2 className="text-xl font-semibold text-white">Areas for Improvement</h2>
        </div>
        <div className="space-y-3">
          {weaknesses.map((weakness, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
              <div className="w-6 h-6 flex items-center justify-center bg-orange-500/20 rounded-full text-orange-400 text-sm font-bold mt-0.5">
                !
              </div>
              <p className="text-slate-200 flex-1">{weakness}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Suggested Improvements */}
      <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="w-6 h-6 text-blue-400" />
          <h2 className="text-xl font-semibold text-white">Suggested Actions</h2>
        </div>
        <div className="space-y-3">
          {improvements.map((improvement, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
              <div className="w-6 h-6 flex items-center justify-center bg-blue-500/20 rounded-full text-blue-400 text-sm font-bold mt-0.5">
                {index + 1}
              </div>
              <p className="text-slate-200 flex-1">{improvement}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Topic Improvement Suggestions */}
      <div className="bg-white/5 backdrop-blur-xl border border-purple-500/20 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-6 h-6 text-purple-400" />
          <h2 className="text-xl font-semibold text-white">Topics to Focus On</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {topicSuggestions.map((suggestion, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border ${
                suggestion.priority === 'High'
                  ? 'bg-red-500/10 border-red-500/30'
                  : 'bg-yellow-500/10 border-yellow-500/30'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-white font-semibold">{suggestion.topic}</h3>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    suggestion.priority === 'High'
                      ? 'bg-red-500/20 text-red-400'
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}
                >
                  {suggestion.priority}
                </span>
              </div>
              <p className="text-sm text-slate-400">{suggestion.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <button 
          onClick={() => setInterviewTab('practice')}
          className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg font-medium text-white hover:shadow-lg transition-all"
        >
          Practice These Topics
        </button>
        <button 
          onClick={() => setInterviewTab('dashboard')}
          className="flex-1 py-3 bg-white/5 border border-purple-500/30 rounded-lg font-medium text-white hover:bg-white/10 transition-all"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
