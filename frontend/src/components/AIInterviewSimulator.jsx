import { useState } from 'react';
import { aiInterviewAPI } from '../services/api';

export default function AIInterviewSimulator() {
  const [role, setRole] = useState('Software Engineer');
  const [interviewType, setInterviewType] = useState('technical');
  const [experienceLevel, setExperienceLevel] = useState('entry-level');
  const [techStack, setTechStack] = useState('React, Java, Spring Boot');
  
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [evaluating, setEvaluating] = useState(false);

  const generateQuestions = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const stackList = techStack.split(',').map(s => s.trim());
      const data = await aiInterviewAPI.generateQuestions(role, interviewType, experienceLevel, stackList);
      setQuestions(data);
      setCurrentQuestionIndex(0);
      setAnswer('');
      setFeedback(null);
    } catch (err) {
      console.error(err);
      alert("Failed to generate questions");
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (!answer.trim()) return;
    setEvaluating(true);
    try {
      const q = questions[currentQuestionIndex].question;
      const data = await aiInterviewAPI.evaluateAnswer(q, answer, role);
      setFeedback(data);
    } catch (err) {
      console.error(err);
      alert("Failed to evaluate answer");
    } finally {
      setEvaluating(false);
    }
  };

  const nextQuestion = () => {
    setCurrentQuestionIndex(prev => prev + 1);
    setAnswer('');
    setFeedback(null);
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-white max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-purple-400">AI Interview Simulator</h2>
      
      {questions.length === 0 ? (
        <form onSubmit={generateQuestions} className="space-y-4">
          <div>
            <label className="block text-sm text-slate-400 mb-1">Target Role</label>
            <input type="text" value={role} onChange={e => setRole(e.target.value)} className="w-full bg-slate-800 p-3 rounded-lg" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Interview Type</label>
              <select value={interviewType} onChange={e => setInterviewType(e.target.value)} className="w-full bg-slate-800 p-3 rounded-lg">
                <option value="technical">Technical</option>
                <option value="behavioral">Behavioral</option>
                <option value="system_design">System Design</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Experience Level</label>
              <select value={experienceLevel} onChange={e => setExperienceLevel(e.target.value)} className="w-full bg-slate-800 p-3 rounded-lg">
                <option value="entry-level">Entry Level</option>
                <option value="mid-level">Mid Level</option>
                <option value="senior">Senior</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">Tech Stack (comma separated)</label>
            <input type="text" value={techStack} onChange={e => setTechStack(e.target.value)} className="w-full bg-slate-800 p-3 rounded-lg" required />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-purple-600 hover:bg-purple-700 py-3 rounded-lg font-bold">
            {loading ? 'Generating Mock Interview...' : 'Start Interview'}
          </button>
        </form>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center text-slate-400 text-sm">
            <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
            <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full">{questions[currentQuestionIndex].difficulty}</span>
          </div>
          
          <div className="bg-slate-800 p-6 rounded-xl">
            <h3 className="text-xl font-medium">{questions[currentQuestionIndex].question}</h3>
          </div>

          {!feedback ? (
            <div className="space-y-4">
              <textarea 
                value={answer}
                onChange={e => setAnswer(e.target.value)}
                placeholder="Type your answer here..."
                className="w-full bg-slate-800 p-4 rounded-xl min-h-[150px] outline-none focus:ring-2 ring-purple-500"
              />
              <button onClick={submitAnswer} disabled={evaluating || !answer.trim()} className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-lg font-bold">
                {evaluating ? 'Evaluating...' : 'Submit Answer'}
              </button>
            </div>
          ) : (
            <div className="space-y-4 bg-green-500/10 border border-green-500/20 p-6 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-green-400 font-bold text-lg">AI Feedback</h4>
                <div className="bg-green-500/20 text-green-300 px-4 py-1 rounded-full font-bold">
                  Score: {feedback.score}/10
                </div>
              </div>
              <p className="text-slate-300 leading-relaxed">{feedback.feedback}</p>
              
              {feedback.improvements?.length > 0 && (
                <div className="mt-4">
                  <h5 className="text-yellow-400 font-medium mb-2">Areas to Improve:</h5>
                  <ul className="list-disc pl-5 text-slate-300 space-y-1">
                    {feedback.improvements.map((imp, i) => (
                      <li key={i}>{imp}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="pt-4 flex justify-end">
                {currentQuestionIndex < questions.length - 1 ? (
                  <button onClick={nextQuestion} className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-bold">
                    Next Question
                  </button>
                ) : (
                  <button onClick={() => setQuestions([])} className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg font-bold">
                    Finish Interview
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
