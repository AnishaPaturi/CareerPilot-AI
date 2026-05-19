import { useState } from 'react';
import { knowledgeAPI } from '../services/api';
import { UploadCloud, MessageSquare, FileText, HelpCircle } from 'lucide-react';

export default function KnowledgeBase() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  
  const [activeTab, setActiveTab] = useState('chat'); // chat, summarize, quiz
  
  // Chat state
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([{ role: 'assistant', content: 'Hello! Ask me anything about your uploaded document.' }]);
  const [chatting, setChatting] = useState(false);
  
  // Summary state
  const [summary, setSummary] = useState('');
  const [summarizing, setSummarizing] = useState(false);
  
  // Quiz state
  const [quizTopic, setQuizTopic] = useState('');
  const [quiz, setQuiz] = useState([]);
  const [generatingQuiz, setGeneratingQuiz] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    try {
      await knowledgeAPI.upload(file);
      setUploaded(true);
      alert("Document uploaded successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to upload document.");
    } finally {
      setUploading(false);
    }
  };

  const handleChat = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    
    const userMsg = { role: 'user', content: chatInput };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setChatting(true);
    
    try {
      const data = await knowledgeAPI.chat(userMsg.content);
      setChatMessages(prev => [...prev, { role: 'assistant', content: data.answer }]);
    } catch (err) {
      setChatMessages(prev => [...prev, { role: 'assistant', content: 'Error: Failed to fetch response.' }]);
    } finally {
      setChatting(false);
    }
  };

  const handleSummarize = async () => {
    setSummarizing(true);
    try {
      const data = await knowledgeAPI.summarize();
      setSummary(data.summary);
    } catch (err) {
      alert("Failed to generate summary.");
    } finally {
      setSummarizing(false);
    }
  };

  const handleGenerateQuiz = async (e) => {
    e.preventDefault();
    if (!quizTopic.trim()) return;
    setGeneratingQuiz(true);
    try {
      const data = await knowledgeAPI.quiz(quizTopic);
      setQuiz(data);
    } catch (err) {
      alert("Failed to generate quiz.");
    } finally {
      setGeneratingQuiz(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Upload Section */}
      <div className="bg-white/[0.04] border border-white/10 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><UploadCloud className="text-purple-400" /> Upload Study Material</h2>
        {!uploaded ? (
          <form onSubmit={handleUpload} className="flex gap-4 items-center">
            <input 
              type="file" 
              accept=".pdf"
              onChange={e => setFile(e.target.files[0])} 
              className="flex-1 bg-slate-800 text-white rounded-lg p-2"
              required
            />
            <button type="submit" disabled={uploading} className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-bold transition-colors">
              {uploading ? 'Uploading...' : 'Upload PDF'}
            </button>
          </form>
        ) : (
          <div className="text-green-400 flex items-center gap-2 font-medium">
            ✅ Document successfully uploaded and indexed! You can now use the tools below.
          </div>
        )}
      </div>

      {uploaded && (
        <div className="bg-white/[0.04] border border-white/10 rounded-xl overflow-hidden flex flex-col md:flex-row">
          {/* Sidebar */}
          <div className="md:w-64 bg-black/20 border-r border-white/10 p-4 space-y-2">
            <button onClick={() => setActiveTab('chat')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'chat' ? 'bg-purple-600/30 text-white' : 'text-slate-400 hover:bg-white/5'}`}>
              <MessageSquare size={18} /> Chat with Doc
            </button>
            <button onClick={() => setActiveTab('summarize')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'summarize' ? 'bg-blue-600/30 text-white' : 'text-slate-400 hover:bg-white/5'}`}>
              <FileText size={18} /> Summarize
            </button>
            <button onClick={() => setActiveTab('quiz')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'quiz' ? 'bg-green-600/30 text-white' : 'text-slate-400 hover:bg-white/5'}`}>
              <HelpCircle size={18} /> Generate Quiz
            </button>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 p-6 min-h-[400px]">
            
            {activeTab === 'chat' && (
              <div className="flex flex-col h-[500px]">
                <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
                  {chatMessages.map((msg, i) => (
                    <div key={i} className={`p-4 rounded-xl max-w-[85%] ${msg.role === 'user' ? 'bg-purple-600/20 text-white ml-auto' : 'bg-slate-800 text-slate-200 mr-auto'}`}>
                      {msg.content}
                    </div>
                  ))}
                  {chatting && <div className="text-slate-400 text-sm animate-pulse">AI is thinking...</div>}
                </div>
                <form onSubmit={handleChat} className="flex gap-2">
                  <input 
                    type="text" 
                    value={chatInput} 
                    onChange={e => setChatInput(e.target.value)} 
                    placeholder="Ask a question about the document..." 
                    className="flex-1 bg-slate-800 text-white p-3 rounded-lg focus:outline-none focus:ring-2 ring-purple-500"
                  />
                  <button type="submit" disabled={chatting} className="bg-purple-600 px-6 rounded-lg text-white font-bold hover:bg-purple-700">Send</button>
                </form>
              </div>
            )}

            {activeTab === 'summarize' && (
              <div className="space-y-4">
                <button onClick={handleSummarize} disabled={summarizing} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold w-full">
                  {summarizing ? 'Generating Summary...' : 'Generate Comprehensive Summary'}
                </button>
                {summary && (
                  <div className="bg-slate-800 p-6 rounded-xl text-slate-200 leading-relaxed whitespace-pre-wrap">
                    {summary}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'quiz' && (
              <div className="space-y-6">
                <form onSubmit={handleGenerateQuiz} className="flex gap-4">
                  <input 
                    type="text" 
                    value={quizTopic} 
                    onChange={e => setQuizTopic(e.target.value)} 
                    placeholder="Enter a topic for the quiz..." 
                    className="flex-1 bg-slate-800 text-white p-3 rounded-lg focus:outline-none"
                    required
                  />
                  <button type="submit" disabled={generatingQuiz} className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg text-white font-bold">
                    {generatingQuiz ? 'Generating...' : 'Create Quiz'}
                  </button>
                </form>

                {quiz.length > 0 && (
                  <div className="space-y-6">
                    {quiz.map((q, i) => (
                      <div key={i} className="bg-slate-800 p-6 rounded-xl">
                        <h4 className="text-lg font-bold text-white mb-4">{i + 1}. {q.question}</h4>
                        <div className="space-y-2">
                          {q.options.map((opt, j) => (
                            <div key={j} className="p-3 rounded-lg bg-slate-700/50 text-slate-300">
                              {opt}
                            </div>
                          ))}
                        </div>
                        <div className="mt-4 pt-4 border-t border-slate-700">
                          <p className="text-green-400 font-bold">Correct: {q.correct}</p>
                          <p className="text-slate-400 text-sm mt-1">{q.explanation}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
          </div>
        </div>
      )}
    </div>
  );
}
