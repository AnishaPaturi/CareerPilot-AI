import { useState } from 'react';
import { useInterview } from '../../context/InterviewContext';
import { Upload, X, FileText } from 'lucide-react';
import { aiInterviewAPI } from '../../services/api';

const ROLES = ['Software Engineer', 'Data Scientist', 'Product Manager', 'Designer'];
const TYPES = ['technical', 'behavioral', 'system_design'];
const LEVELS = ['entry-level', 'mid-level', 'senior'];

export function InterviewSetup() {
  const { setInterviewTab, setCurrentInterview } = useInterview();
  const [selectedRole, setSelectedRole] = useState('Software Engineer');
  const [customRole, setCustomRole] = useState('');
  const [selectedType, setSelectedType] = useState('technical');
  const [selectedLevel, setSelectedLevel] = useState('entry-level');
  
  const [topics, setTopics] = useState(['Algorithms', 'System Design']);
  const [topicInput, setTopicInput] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const addTopic = () => {
    if (topicInput.trim() && !topics.includes(topicInput.trim())) {
      setTopics([...topics, topicInput.trim()]);
      setTopicInput('');
    }
  };

  const removeTopic = (topic) => {
    setTopics(topics.filter(t => t !== topic));
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    const newFiles = files.map(f => ({ name: f.name, type: f.type }));
    setUploadedFiles([...uploadedFiles, ...newFiles]);
  };

  const removeFile = (fileName) => {
    setUploadedFiles(uploadedFiles.filter(f => f.name !== fileName));
  };

  const startInterview = async () => {
    setLoading(true);
    try {
      const finalRole = customRole.trim() || selectedRole;
      
      // Call actual API to generate questions
      const fetchedQuestions = await aiInterviewAPI.generateQuestions(
        finalRole, 
        selectedType, 
        selectedLevel, 
        topics
      );
      
      // Initialize a new interview record
      const newInterviewSession = {
        role: finalRole,
        type: selectedType,
        level: selectedLevel,
        topics: [...topics],
        questions: fetchedQuestions || [],
        currentQuestionIndex: 0,
        answers: [],
        feedbacks: [],
        startTime: Date.now()
      };
      
      setCurrentInterview(newInterviewSession);
      setInterviewTab('room');
    } catch (err) {
      console.error(err);
      alert("Failed to generate AI interview questions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-1 max-w-4xl mx-auto text-white">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Setup Your Interview</h1>
        <p className="text-slate-400">Configure your AI interview session</p>
      </div>

      {/* Target Role */}
      <div className="bg-white/5 backdrop-blur-xl border border-purple-500/20 rounded-xl p-6 shadow-lg mb-6">
        <h2 className="text-xl font-semibold text-white mb-4">Target Role</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {ROLES.map((role) => (
            <button
              key={role}
              onClick={() => { setSelectedRole(role); setCustomRole(''); }}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedRole === role && !customRole
                  ? 'border-purple-500 bg-purple-500/20 text-white'
                  : 'border-purple-500/30 bg-white/5 text-slate-400 hover:border-purple-500/50 hover:text-white'
              }`}
            >
              <div className="text-sm font-medium">{role}</div>
            </button>
          ))}
        </div>
        <div className="mt-4">
          <label className="block text-sm text-slate-400 mb-2">Or enter a custom role</label>
          <input
            type="text"
            placeholder="e.g., Full Stack Engineer, Blockchain Developer"
            value={customRole}
            onChange={(e) => setCustomRole(e.target.value)}
            className="w-full px-4 py-3 bg-white/5 border border-purple-500/30 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
          />
        </div>
      </div>

      {/* Config Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Interview Type */}
        <div className="bg-white/5 backdrop-blur-xl border border-purple-500/20 rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-white mb-4">Interview Type</h2>
          <div className="space-y-3">
            {TYPES.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`w-full p-4 rounded-lg border-2 text-left capitalize transition-all ${
                  selectedType === type
                    ? 'border-purple-500 bg-purple-500/20 text-white'
                    : 'border-purple-500/30 bg-white/5 text-slate-400 hover:border-purple-500/50 hover:text-white'
                }`}
              >
                <div className="font-semibold">{type.replace('_', ' ')}</div>
                <div className="text-xs text-slate-400 mt-1">
                  {type === 'technical' && 'Focuses on coding, DS/Algo, and tech concepts.'}
                  {type === 'behavioral' && 'Focuses on situational queries and past experience.'}
                  {type === 'system_design' && 'Focuses on scaling systems and architecture.'}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Experience Level */}
        <div className="bg-white/5 backdrop-blur-xl border border-purple-500/20 rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-white mb-4">Experience Level</h2>
          <div className="space-y-3">
            {LEVELS.map((level) => (
              <button
                key={level}
                onClick={() => setSelectedLevel(level)}
                className={`w-full p-4 rounded-lg border-2 text-left capitalize transition-all ${
                  selectedLevel === level
                    ? 'border-purple-500 bg-purple-500/20 text-white'
                    : 'border-purple-500/30 bg-white/5 text-slate-400 hover:border-purple-500/50 hover:text-white'
                }`}
              >
                <div className="font-semibold">{level.replace('-', ' ')}</div>
                <div className="text-xs text-slate-400 mt-1">
                  {level === 'entry-level' && '0-2 years of experience. Standard fundamentals.'}
                  {level === 'mid-level' && '3-5 years of experience. Solid system understanding.'}
                  {level === 'senior' && '5+ years of experience. Leadership and design depth.'}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Topics */}
      <div className="bg-white/5 backdrop-blur-xl border border-purple-500/20 rounded-xl p-6 shadow-lg mb-6">
        <h2 className="text-xl font-semibold text-white mb-4">Interview Topics</h2>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Add topic (e.g., React, Databases, Spring Boot)"
            value={topicInput}
            onChange={(e) => setTopicInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTopic()}
            className="flex-1 px-4 py-3 bg-white/5 border border-purple-500/30 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
          />
          <button
            onClick={addTopic}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg font-medium text-white hover:shadow-lg transition-all"
          >
            Add
          </button>
        </div>

        {topics.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {topics.map((topic) => (
              <span
                key={topic}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-500/10 border border-purple-500/30 rounded-full text-sm text-purple-300"
              >
                {topic}
                <button
                  onClick={() => removeTopic(topic)}
                  className="hover:text-red-400 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500 italic">No custom topics added yet.</p>
        )}
      </div>

      {/* Reference Resume/Materials */}
      <div className="bg-white/5 backdrop-blur-xl border border-purple-500/20 rounded-xl p-6 shadow-lg mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">Reference Resume / Job Description</h2>
        
        <div className="border-2 border-dashed border-purple-500/30 rounded-lg p-8 text-center hover:border-purple-500/50 transition-all cursor-pointer relative">
          <input
            type="file"
            multiple
            onChange={handleFileUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <Upload className="w-10 h-10 text-purple-400 mx-auto mb-3" />
          <p className="text-sm font-semibold text-white">Drag & drop files here, or click to browse</p>
          <p className="text-xs text-slate-500 mt-1">Supports PDF, DOCX, TXT (Max 10MB)</p>
        </div>

        {uploadedFiles.length > 0 && (
          <div className="mt-4 space-y-2">
            {uploadedFiles.map((file) => (
              <div
                key={file.name}
                className="flex items-center justify-between p-3 bg-white/5 border border-purple-500/20 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-purple-400" />
                  <span className="text-sm text-white truncate max-w-md">{file.name}</span>
                </div>
                <button
                  onClick={() => removeFile(file.name)}
                  className="text-slate-400 hover:text-red-400 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Start Button */}
      <button
        onClick={startInterview}
        disabled={loading}
        className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl font-bold text-lg text-white shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/50 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
      >
        {loading ? 'Preparing Mock Interview...' : 'Start Interview Session'}
      </button>
    </div>
  );
}
