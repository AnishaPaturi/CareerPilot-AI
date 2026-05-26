import { useState, useRef, useEffect } from 'react';
import { knowledgeAPI } from '../services/api';
import { UploadCloud, MessageSquare, FileText, HelpCircle, Copy, Download, FileDown, ChevronLeft, ChevronRight, PlusCircle, Trash2, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Document, Page, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.min.js`;

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
    try {
      const data = await knowledgeAPI.quiz(quizTopic, 5);
      setQuiz(data);
    } catch (err) {
      alert("Failed to generate quiz.");
    } finally {
      setGeneratingQuiz(false);
    }
  };

  const handleQuizOptionSelect = (qIndex, option) => {
    setSelectedQuizOption(prev => ({ ...prev, [qIndex]: option }));
  };

  const checkQuizAnswer = (qIndex, correct) => {
    const selected = selectedQuizOption[qIndex];
    const isCorrect = selected === correct;
    setQuizResults(prev => ({ ...prev, [qIndex]: isCorrect }));
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
    const fileUrl = `http://localhost:9999/uploads/user_1/${encodeURIComponent(doc.filename)}`;
    setPdfUrl(fileUrl);
    setPdfSidebarOpen(true);
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
                    <div className="space-y-6 max-h-96 overflow-y-auto pr-2">
                      {quiz.map((q, i) => (
                        <div key={i} className="bg-slate-800 p-6 rounded-xl">
                          <h4 className="text-lg font-bold text-white mb-4">{i + 1}. {q.question}</h4>
                          <div className="space-y-2">
                            {q.options.map((opt, j) => {
                              const isSelected = selectedQuizOption[i] === opt;
                              const isCorrect = q.correct === opt;
                              const showResult = quizResults[i] !== undefined;
                              let bgClass = 'bg-slate-700/50 text-slate-300';
                              if (showResult) {
                                if (isCorrect) bgClass = 'bg-green-600/50 text-white';
                                else if (isSelected) bgClass = 'bg-red-600/50 text-white';
                              } else if (isSelected) bgClass = 'bg-purple-600/50 text-white';
                              return (
                                <button key={j} onClick={() => handleQuizOptionSelect(i, opt)} disabled={quizResults[i] !== undefined} className={`w-full p-3 rounded-lg text-left transition-colors ${bgClass}`}>
                                  {opt}
                                </button>
                              );
                            })}
                          </div>
                          {quizResults[i] === undefined ? (
                            <button onClick={() => checkQuizAnswer(i, q.correct)} disabled={!selectedQuizOption[i]} className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg">Check Answer</button>
                          ) : (
                            <div className="mt-4 pt-4 border-t border-slate-700">
                              <p className={`font-bold ${quizResults[i] ? 'text-green-400' : 'text-red-400'}`}>
                                {quizResults[i] ? <><CheckCircle2 className="inline mr-1" size={18} /> Correct!</> : 'Incorrect'}
                              </p>
                              <p className="text-slate-400 text-sm mt-1">{q.explanation}</p>
                            </div>
                          )}
                        </div>
                      ))}
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
    </div>
  );
}