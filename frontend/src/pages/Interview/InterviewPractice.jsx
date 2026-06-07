import { useState } from 'react';
import { Clock, Zap, CheckCircle } from 'lucide-react';

const topics = ['Algorithms', 'System Design', 'Machine Learning', 'Databases', 'Networking'];

const quickQuestions = {
  'Algorithms': [
    'What is the time complexity of binary search?',
    'Explain how a hash map handles collisions.',
    'What is the difference between BFS and DFS?',
    'When would you use dynamic programming over divide and conquer?',
    'Explain the merge sort algorithm and its space complexity.'
  ],
  'System Design': [
    'Explain the CAP theorem.',
    'What is a load balancer, and how does it work?',
    'How do you handle session scaling in distributed web systems?',
    'Describe the differences between SQL and NoSQL databases.',
    'What is database sharding and when should you use it?'
  ],
  'Machine Learning': [
    'What is overfitting in machine learning, and how do you prevent it?',
    'Explain the difference between supervised and unsupervised learning.',
    'How does a random forest classifier work?',
    'What is the bias-variance tradeoff?',
    'Explain the concept of cross-validation.'
  ],
  'Databases': [
    'What are ACID properties in a database?',
    'Explain database normalization and indexes.',
    'Difference between SQL and NoSQL?',
    'What is a database transaction deadlock?',
    'How do database replication and partitioning differ?'
  ],
  'Networking': [
    'What happens when you type a URL in the browser address bar?',
    'Explain the difference between TCP and UDP.',
    'What is DNS and how does it work?',
    'Explain the HTTP request-response cycle.',
    'What is the purpose of the OSI model layers?'
  ]
};

export function InterviewPractice() {
  const [selectedTopic, setSelectedTopic] = useState('Algorithms');
  const [isActive, setIsActive] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);

  const startPractice = () => {
    if (selectedTopic) {
      setIsActive(true);
      setCurrentQuestion(0);
      setAnsweredCount(0);
    }
  };

  const nextQuestion = () => {
    const questions = quickQuestions[selectedTopic] || [];
    setAnsweredCount(prev => prev + 1);
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setIsActive(false);
    }
  };

  const activeQuestionList = quickQuestions[selectedTopic] || [];

  return (
    <div className="p-1 text-white max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Practice Mode</h1>
        <p className="text-slate-400">Quick fire interview practice - No scoring, just learning</p>
      </div>

      {!isActive ? (
        <>
          {/* Topic Selection */}
          <div className="bg-white/5 backdrop-blur-xl border border-purple-500/20 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Select Topic</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {topics.map((topic) => (
                <button
                  key={topic}
                  onClick={() => setSelectedTopic(topic)}
                  className={`p-4 rounded-lg border-2 transition-all text-center ${
                    selectedTopic === topic
                      ? 'border-purple-500 bg-purple-500/20 text-white font-semibold'
                      : 'border-purple-500/30 bg-white/5 text-slate-400 hover:border-purple-500/50 hover:text-white'
                  }`}
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>

          {/* Practice Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-xl p-6 text-center">
              <Zap className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white mb-1">5</div>
              <div className="text-sm text-slate-400">Quick Questions</div>
            </div>

            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl p-6 text-center">
              <Clock className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white mb-1">Self-Paced</div>
              <div className="text-sm text-slate-400">Per Question</div>
            </div>

            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl p-6 text-center">
              <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white mb-1">No</div>
              <div className="text-sm text-slate-400">Scoring</div>
            </div>
          </div>

          {/* Start Button */}
          <button
            onClick={startPractice}
            disabled={!selectedTopic}
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl font-bold text-lg text-white shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/50 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
          >
            Start Practice Session
          </button>
        </>
      ) : (
        <>
          {/* Practice Session */}
          <div className="bg-white/5 backdrop-blur-xl border border-purple-500/20 rounded-xl p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="text-sm text-slate-400">
                Question {currentQuestion + 1} of {activeQuestionList.length}
              </div>
              <div className="px-4 py-1.5 bg-purple-500/20 border border-purple-500/30 rounded-full text-purple-400 font-medium text-xs">
                {selectedTopic}
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">
                {activeQuestionList[currentQuestion]}
              </h2>
              <p className="text-slate-400">Think about your answer and practice explaining it out loud clearly.</p>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-white/10 rounded-full h-2 mb-6 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-600 to-blue-600 rounded-full transition-all"
                style={{ width: `${((currentQuestion + 1) / activeQuestionList.length) * 100}%` }}
              ></div>
            </div>

            <button
              onClick={nextQuestion}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg font-medium text-white hover:shadow-lg transition-all"
            >
              {currentQuestion < activeQuestionList.length - 1 ? 'Next Question' : 'Finish Practice'}
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-yellow-500/10 to-amber-500/10 border border-yellow-500/30 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-yellow-400">{answeredCount}</div>
              <div className="text-sm text-slate-400">Answered</div>
            </div>

            <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-blue-400">{activeQuestionList.length - currentQuestion - 1}</div>
              <div className="text-sm text-slate-400">Remaining</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
