import { useState, useRef, useEffect } from 'react';
import { knowledgeAPI, AI_BASE_URL } from '../services/api';
import { UploadCloud, MessageSquare, FileText, HelpCircle, Copy, Download, FileDown, ChevronLeft, ChevronRight, PlusCircle, Trash2, CheckCircle2, Eye, EyeOff, Clock } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Document, Page, pdfjs } from 'react-pdf';
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;


export default function StudyMaterials() {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  
  const [activeTab, setActiveTab] = useState('chat');
  const [chatMessages, setChatMessages] = useState([{ role: 'assistant', content: 'Hello! Upload a PDF and ask me anything about it. I can help you understand, summarize, and quiz yourself on the content.' }]);
  const [chatInput, setChatInput] = useState('');
  const [chatting, setChatting] = useState(false);
  
  const [summary, setSummary] = useState('');
  const [summarizing, setSummarizing] = useState(false);
  
  const [quizTopic, setQuizTopic] = useState('');
  const [quiz, setQuiz] = useState([]);
  const [generatingQuiz, setGeneratingQuiz] = useState(false);
  const [selectedQuizOption, setSelectedQuizOption] = useState({});
  const [quizResults, setQuizResults] = useState({});
  const [numQuestions, setNumQuestions] = useState(5);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizTimeRemaining, setQuizTimeRemaining] = useState(0);
  const [quizTimeTotal, setQuizTimeTotal] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  
  const [queryHistory, setQueryHistory] = useState([]);
  const [documents, setDocuments] = useState([]);
  
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  
  const [pdfUrl, setPdfUrl] = useState(null);
  const [pdfSidebarOpen, setPdfSidebarOpen] = useState(true);
  const [numPages, setNumPages] = useState(null);
  
  const fileInputRef = useRef(null);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    loadDocuments();
    loadHistory();
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const selectedQuizOptionRef = useRef({});
  const quizRef = useRef([]);

  useEffect(() => {
    selectedQuizOptionRef.current = selectedQuizOption;
  }, [selectedQuizOption]);

  useEffect(() => {
    quizRef.current = quiz;
  }, [quiz]);

  const handleSubmitQuiz = () => {
    setIsTimerActive(false);
    const results = {};
    const currentSelections = selectedQuizOptionRef.current;
    quizRef.current.forEach((q, i) => {
      const selected = currentSelections[i];
      results[i] = selected === q.correct;
    });
    setQuizResults(results);
    setQuizSubmitted(true);
  };

  useEffect(() => {
    let timerInterval = null;
    if (isTimerActive && quizTimeRemaining > 0) {
      timerInterval = setInterval(() => {
        setQuizTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timerInterval);
            setIsTimerActive(false);
            // Auto submit when time runs out
            handleSubmitQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerInterval) clearInterval(timerInterval);
    };
  }, [isTimerActive]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const loadDocuments = async () => {
    try {
      const data = await knowledgeAPI.getDocuments();
      setDocuments(data.documents || []);
    } catch (err) {
      console.error('Failed to load documents:', err);
    }
  };

  const loadHistory = async () => {
    try {
      const data = await knowledgeAPI.getHistory();
      setQueryHistory(data.history || []);
    } catch (err) {
      console.error('Failed to load history:', err);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!files.length) return;
    setUploading(true);
    try {
      for (const file of files) {
        await knowledgeAPI.upload(file);
      }
      await loadDocuments();
      setChatMessages([{ role: 'assistant', content: 'Files uploaded successfully! You can now ask questions about your documents.' }]);
    } catch (err) {
      alert('Failed to upload files.');
    } finally {
      setUploading(false);
      setFiles([]);
      if (fileInputRef.current) fileInputRef.current.value = '';
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
      await loadHistory();
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

  const handleExportPDF = async () => {
    try {
      const data = await knowledgeAPI.exportSummaryPDF(summary);
      if (data.pdf_base64) {
        const link = document.createElement('a');
        link.href = `data:application/pdf;base64,${data.pdf_base64}`;
        link.download = 'document-summary.pdf';
        link.click();
      } else if (data.error) {
        alert(data.error);
      }
    } catch (err) {
      alert("Failed to export PDF.");
    }
  };

  const handleExportWord = async () => {
    try {
      const data = await knowledgeAPI.exportSummaryWord(summary);
      if (data.word_base64) {
        const link = document.createElement('a');
        link.href = `data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,${data.word_base64}`;
        link.download = 'document-summary.docx';
        link.click();
      } else if (data.error) {
        alert(data.error);
      }
    } catch (err) {
      alert("Failed to export Word document.");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(summary);
    alert("Summary copied to clipboard!");
  };

  const handleGenerateQuiz = async (e) => {
    e.preventDefault();
    if (!quizTopic.trim()) return;
    setGeneratingQuiz(true);
    setQuiz([]);
    setSelectedQuizOption({});
    setQuizResults({});
    setQuizSubmitted(false);
    setIsTimerActive(false);
    try {
      const data = await knowledgeAPI.quiz(quizTopic, numQuestions);
      setQuiz(data);
      // Set timer: 60 seconds per question
      const totalSeconds = numQuestions * 60;
      setQuizTimeRemaining(totalSeconds);
      setQuizTimeTotal(totalSeconds);
      setIsTimerActive(true);
    } catch (err) {
      alert("Failed to generate quiz.");
    } finally {
      setGeneratingQuiz(false);
    }
  };

  const handleQuizOptionSelect = (qIndex, option) => {
    setSelectedQuizOption(prev => ({ ...prev, [qIndex]: option }));
  };

  const handleDeleteDocument = async (docId) => {
    if (!confirm("Delete this document?")) return;
    try {
      await knowledgeAPI.deleteDocument(docId);
      await loadDocuments();
    } catch (err) {
      alert("Failed to delete document.");
    }
  };

  const handleViewDocument = async (doc) => {
    try {
      const data = await knowledgeAPI.viewDocument(doc.id);
      setPdfUrl(`${AI_BASE_URL}${data.file_url}`);
      setPdfSidebarOpen(true);
    } catch (err) {
      console.error('Failed to view document:', err);
      alert("Failed to load document. Please try again.");
    }
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Study Materials</h1>
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <span>{documents.length} document(s) uploaded</span>
        </div>
      </div>

      <div className="bg-white/[0.04] border border-white/10 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><UploadCloud className="text-purple-400" /> Upload PDF Documents</h2>
        <form onSubmit={handleUpload} className="flex gap-4 items-center">
          <input 
            type="file" 
            accept=".pdf"
            multiple
            ref={fileInputRef}
            onChange={e => setFiles(Array.from(e.target.files))} 
            className="flex-1 bg-slate-800 text-white rounded-lg p-2"
          />
          <button type="submit" disabled={uploading || !files.length} className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-bold transition-colors disabled:opacity-50">
            {uploading ? 'Uploading...' : 'Upload PDF(s)'}
          </button>
        </form>
        {files.length > 0 && (
          <div className="mt-3 text-sm text-slate-400">
            Selected: {files.map(f => f.name).join(', ')}
          </div>
        )}
      </div>

      {documents.length > 0 && (
        <div className="bg-white/[0.04] border border-white/10 rounded-xl overflow-hidden">
          <div className="bg-black/20 border-b border-white/10 p-4">
            <h3 className="text-lg font-semibold text-white">Your Documents</h3>
          </div>
          <div className="p-4 space-y-2 max-h-40 overflow-y-auto">
            {documents.map(doc => (
              <div key={doc.id} className="flex items-center justify-between bg-white/[0.03] rounded-lg p-3">
                <div className="flex items-center gap-3">
                  <FileText className="text-purple-400" size={20} />
                  <div>
                    <p className="text-white font-medium">{doc.filename}</p>
                    <p className="text-xs text-slate-500">Uploaded: {new Date(doc.upload_date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleViewDocument(doc)} className="text-blue-400 hover:text-blue-300 p-1" title="View PDF">
                    <Eye size={18} />
                  </button>
                  <button onClick={() => handleDeleteDocument(doc.id)} className="text-red-400 hover:text-red-300 p-1">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {documents.length > 0 && (
        <div className="bg-white/[0.04] border border-white/10 rounded-xl overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            <div className="w-full lg:w-64 bg-black/20 border-r border-white/10 p-4 space-y-2">
              <button onClick={() => setActiveTab('chat')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'chat' ? 'bg-purple-600/30 text-white' : 'text-slate-400 hover:bg-white/5'}`}>
                <MessageSquare size={18} /> Chat with Docs
              </button>
              <button onClick={() => setActiveTab('summarize')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'summarize' ? 'bg-blue-600/30 text-white' : 'text-slate-400 hover:bg-white/5'}`}>
                <FileText size={18} /> Summarize
              </button>
              <button onClick={() => setActiveTab('quiz')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'quiz' ? 'bg-green-600/30 text-white' : 'text-slate-400 hover:bg-white/5'}`}>
                <HelpCircle size={18} /> Generate Quiz
              </button>
              <button onClick={() => setActiveTab('history')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'history' ? 'bg-amber-600/30 text-white' : 'text-slate-400 hover:bg-white/5'}`}>
                <MessageSquare size={18} /> Query History
              </button>
              <button onClick={() => setActiveTab('notes')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'notes' ? 'bg-pink-600/30 text-white' : 'text-slate-400 hover:bg-white/5'}`}>
                <PlusCircle size={18} /> My Notes
              </button>
            </div>

            <div className="flex-1 p-6 min-h-[500px]">
              {activeTab === 'chat' && (
                <div className="flex flex-col h-[500px]">
                  <div ref={chatContainerRef} className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
                    {chatMessages.map((msg, i) => (
                      <div key={i} className={`p-4 rounded-xl max-w-[85%] ${msg.role === 'user' ? 'bg-purple-600/20 text-white ml-auto' : 'bg-slate-800 text-slate-200 mr-auto'}`}>
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    ))}
                    {chatting && <div className="text-slate-400 text-sm animate-pulse">AI is thinking...</div>}
                  </div>
                  <form onSubmit={handleChat} className="flex gap-2">
                    <input 
                      type="text" 
                      value={chatInput} 
                      onChange={e => setChatInput(e.target.value)} 
                      placeholder="Ask a question about your documents..." 
                      className="flex-1 bg-slate-800 text-white p-3 rounded-lg focus:outline-none focus:ring-2 ring-purple-500"
                    />
                    <button type="submit" disabled={chatting} className="bg-purple-600 px-6 rounded-lg text-white font-bold hover:bg-purple-700">Send</button>
                  </form>
                </div>
              )}

              {activeTab === 'summarize' && (
                <div className="space-y-4">
                  <button onClick={handleSummarize} disabled={summarizing} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold">
                    {summarizing ? 'Generating Summary...' : 'Generate Comprehensive Summary'}
                  </button>
                  {summary && (
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <button onClick={handleCopy} className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg">
                          <Copy size={16} /> Copy
                        </button>
                        <button onClick={handleExportPDF} className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg">
                          <FileDown size={16} /> Download PDF
                        </button>
                        <button onClick={handleExportWord} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg">
                          <Download size={16} /> Download Word
                        </button>
                      </div>
                      <div className="bg-slate-800 p-6 rounded-xl text-slate-200 leading-relaxed whitespace-pre-wrap max-h-96 overflow-y-auto">
                        {summary}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'quiz' && (
                <div className="space-y-6">
                  {/* Quiz Topic & Questions Selector */}
                  <form onSubmit={handleGenerateQuiz} className="flex flex-col md:flex-row gap-4">
                    <input 
                      type="text" 
                      value={quizTopic} 
                      onChange={e => setQuizTopic(e.target.value)} 
                      placeholder="Enter a topic for the quiz..." 
                      className="flex-1 bg-slate-800 text-white p-3 rounded-lg focus:outline-none focus:ring-2 ring-purple-500"
                      required
                    />
                    <div className="flex items-center gap-2 bg-slate-800 rounded-lg p-1.5 px-3 border border-white/5">
                      <span className="text-slate-400 text-sm whitespace-nowrap">Questions:</span>
                      <select 
                        value={numQuestions} 
                        onChange={e => setNumQuestions(Number(e.target.value))}
                        className="bg-transparent text-white focus:outline-none font-bold pr-2 cursor-pointer"
                      >
                        {[3, 5, 10, 15, 20].map(n => (
                          <option key={n} value={n} className="bg-slate-800 text-white">{n}</option>
                        ))}
                      </select>
                    </div>
                    <button type="submit" disabled={generatingQuiz} className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg text-white font-bold transition-all disabled:opacity-50">
                      {generatingQuiz ? 'Generating...' : 'Create Quiz'}
                    </button>
                  </form>

                  {/* Timer and Submit Status */}
                  {quiz.length > 0 && (
                    <div className="space-y-4">
                      {/* Timer Bar */}
                      {!quizSubmitted && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between bg-slate-800/80 p-4 rounded-xl border border-white/5 shadow-lg">
                            <div className="flex items-center gap-3">
                              <div className={`p-2.5 rounded-lg ${quizTimeRemaining < 30 ? 'bg-red-500/20 text-red-400 animate-pulse' : 'bg-purple-500/20 text-purple-400'}`}>
                                <Clock size={20} />
                              </div>
                              <div>
                                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Time Remaining</h4>
                                <p className={`text-xl font-mono font-bold ${quizTimeRemaining < 30 ? 'text-red-400' : 'text-white'}`}>
                                  {formatTime(quizTimeRemaining)}
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button 
                                type="button"
                                onClick={() => setIsTimerActive(!isTimerActive)} 
                                className="px-4 py-2 bg-slate-700 text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-600 transition-colors"
                              >
                                {isTimerActive ? 'Pause' : 'Resume'}
                              </button>
                              <button 
                                type="button"
                                onClick={handleSubmitQuiz} 
                                className="px-5 py-2 bg-purple-600 text-white rounded-lg text-sm font-bold hover:bg-purple-700 transition-all shadow-md shadow-purple-900/20"
                              >
                                Submit Quiz
                              </button>
                            </div>
                          </div>
                          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden border border-white/5">
                            <div 
                              className={`h-full transition-all duration-1000 ${
                                (quizTimeRemaining / quizTimeTotal) < 0.25 
                                  ? 'bg-red-500' 
                                  : (quizTimeRemaining / quizTimeTotal) < 0.5 
                                    ? 'bg-yellow-500' 
                                    : 'bg-purple-500'
                              }`}
                              style={{ width: `${(quizTimeRemaining / quizTimeTotal) * 100}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Score Report Header */}
                      {quizSubmitted && (
                        <div className="bg-slate-800/80 border border-purple-500/30 p-6 rounded-xl text-center space-y-3 shadow-xl backdrop-blur-sm">
                          <h3 className="text-xl font-bold text-white uppercase tracking-wider">Quiz Completed</h3>
                          <div className="flex justify-center items-baseline gap-1">
                            <span className="text-5xl font-extrabold text-purple-400">
                              {Object.values(quizResults).filter(Boolean).length}
                            </span>
                            <span className="text-slate-500 text-xl">/</span>
                            <span className="text-2xl font-bold text-slate-300">{quiz.length}</span>
                          </div>
                          <p className="text-slate-300 text-sm font-medium">
                            Score: {Math.round((Object.values(quizResults).filter(Boolean).length / quiz.length) * 100)}%
                          </p>
                          <p className="text-slate-400 text-xs">
                            Time spent: {formatTime(quizTimeTotal - quizTimeRemaining)}
                          </p>
                          <div className="pt-2">
                            <button 
                              type="button"
                              onClick={() => {
                                setQuizSubmitted(false);
                                setSelectedQuizOption({});
                                setQuizResults({});
                                setQuizTimeRemaining(quizTimeTotal);
                                setIsTimerActive(true);
                              }} 
                              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 rounded-lg font-bold transition-all shadow-md shadow-purple-900/30 text-sm"
                            >
                              Retake Quiz
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Questions List */}
                      <div className="space-y-6 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                        {quiz.map((q, i) => (
                          <div key={i} className="bg-slate-800 p-6 rounded-xl border border-white/5 hover:border-white/10 transition-colors shadow-lg">
                            <h4 className="text-base font-bold text-white mb-4 flex gap-2">
                              <span className="text-purple-400 font-mono">Q{i + 1}.</span>
                              <span>{q.question}</span>
                            </h4>
                            <div className="space-y-2.5">
                              {q.options.map((opt, j) => {
                                const isSelected = selectedQuizOption[i] === opt;
                                const isCorrect = q.correct === opt;
                                
                                let bgClass = 'bg-slate-700/30 text-slate-300 border border-white/5 hover:bg-slate-700/50';
                                if (quizSubmitted) {
                                  if (isCorrect) {
                                    bgClass = 'bg-green-600/20 text-green-200 border-green-500/50';
                                  } else if (isSelected) {
                                    bgClass = 'bg-red-600/20 text-red-200 border-red-500/50';
                                  } else {
                                    bgClass = 'bg-slate-800/40 text-slate-500 opacity-60 border-transparent';
                                  }
                                } else if (isSelected) {
                                  bgClass = 'bg-purple-600/30 text-white border-purple-500';
                                }
                                
                                return (
                                  <button 
                                    key={j} 
                                    type="button"
                                    onClick={() => handleQuizOptionSelect(i, opt)} 
                                    disabled={quizSubmitted || !isTimerActive} 
                                    className={`w-full p-3 rounded-lg text-left transition-all text-sm font-medium ${bgClass}`}
                                  >
                                    <span className="inline-block mr-2 font-mono text-xs px-1.5 py-0.5 rounded bg-black/20 text-slate-400">
                                      {String.fromCharCode(65 + j)}
                                    </span>
                                    {opt}
                                  </button>
                                );
                              })}
                            </div>
                            
                            {/* Analysis & Feedback */}
                            {quizSubmitted && (
                              <div className="mt-4 pt-4 border-t border-slate-700/50 space-y-2 animate-fadeIn">
                                <p className={`text-sm font-bold flex items-center gap-1.5 ${quizResults[i] ? 'text-green-400' : 'text-red-400'}`}>
                                  {quizResults[i] ? (
                                    <><CheckCircle2 size={16} /> Correct!</>
                                  ) : (
                                    <>Incorrect (Your Answer: {selectedQuizOption[i] || 'None'})</>
                                  )}
                                </p>
                                <div className="bg-black/10 p-3 rounded-lg border border-white/5">
                                  <p className="text-slate-300 text-xs font-semibold uppercase tracking-wider text-purple-400">Explanation & Analysis</p>
                                  <p className="text-slate-400 text-sm mt-1 leading-relaxed">{q.explanation}</p>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Bottom Submit Button */}
                      {!quizSubmitted && (
                        <div className="flex justify-end pt-2">
                          <button 
                            type="button"
                            onClick={handleSubmitQuiz} 
                            className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-bold transition-all shadow-md shadow-purple-900/30 text-sm flex items-center gap-2"
                          >
                            Submit Quiz
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'history' && (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {queryHistory.length === 0 ? (
                    <p className="text-slate-500">No queries yet.</p>
                  ) : (
                    queryHistory.map((item, i) => (
                      <div key={i} className="bg-slate-800 p-4 rounded-xl">
                        <p className="text-purple-300 font-medium mb-2">Q: {item.query}</p>
                        <p className="text-slate-300 text-sm">A: {item.answer.substring(0, 200)}...</p>
                        <p className="text-xs text-slate-500 mt-2">{new Date(item.timestamp).toLocaleString()}</p>
                      </div>
                    ))
                  )}
                </div>
              )}

{activeTab === 'notes' && (
                 <div className="space-y-4">
                   <form onSubmit={async (e) => {
                     e.preventDefault();
                     if (!newNote.trim()) return;
                     try {
                       await knowledgeAPI.createNote({ document_id: 1, content: newNote });
                       setNewNote('');
                     } catch (err) {
                       alert("Failed to save note.");
                     }
                   }} className="flex gap-2">
                     <input 
                       type="text" 
                       value={newNote} 
                       onChange={e => setNewNote(e.target.value)} 
                       placeholder="Add a note..." 
                       className="flex-1 bg-slate-800 text-white p-3 rounded-lg"
                     />
                     <button type="submit" className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg">Add</button>
                   </form>
                   <div className="space-y-2 max-h-80 overflow-y-auto">
                     {notes.length === 0 ? (
                       <p className="text-slate-500">No notes yet.</p>
                     ) : (
                       notes.map(note => (
                         <div key={note.id} className="bg-slate-800 p-3 rounded-lg">
                           <p className="text-slate-200">{note.content}</p>
                           <p className="text-xs text-slate-500">{new Date(note.created_at).toLocaleString()}</p>
                         </div>
                       ))
                     )}
                   </div>
                 </div>
               )}
             </div>
           </div>
         </div>
       )}

{/* PDF Viewer Modal */}
        {pdfUrl && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 rounded-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <h3 className="text-white font-semibold">PDF Viewer</h3>
                <button onClick={() => setPdfUrl(null)} className="text-slate-400 hover:text-white">
                  ✕
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                <Document 
                  file={pdfUrl} 
                  onLoadSuccess={onDocumentLoadSuccess}
                  onLoadError={(error) => console.error('PDF load error:', error)}
                >
                  {numPages && Array.from(new Array(numPages), (_, i) => (
                    <Page
                      key={`page_${i + 1}`}
                      pageNumber={i + 1}
                      width={800}
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                      className="mb-4"
                    />
                  ))}
                </Document>
              </div>
            </div>
          </div>
        )}
     </div>
   );
}