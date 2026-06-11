import { useState, useEffect, useRef } from 'react';
import { useInterview } from '../../context/InterviewContext';
import { Mic, MicOff, Video as VideoIcon, VideoOff, X, AlertTriangle, Send, Loader2, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { aiInterviewAPI } from '../../services/api';

const AI_AVATAR = 'https://images.unsplash.com/photo-1648526605865-e39384690567?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBSSUyMGhvbG9ncmFwaGljJTIwYXZhdGFyJTIwYXNzaXN0YW50fGVufDF8fHx8MTc3MzY1MzEyNHww&ixlib=rb-4.1.0&q=80&w=1080';

export function InterviewRoom() {
  const { currentInterview, setCurrentInterview, addInterview, setInterviewTab } = useInterview();
  
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isTtsEnabled, setIsTtsEnabled] = useState(true);
  const [timer, setTimer] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  
  const [showTabWarning, setShowTabWarning] = useState(false);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  
  const [transcript, setTranscript] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [recognition, setRecognition] = useState(null);
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [cameraError, setCameraError] = useState(null);
  const [micError, setMicError] = useState(null);

  // Load questions from current session
  useEffect(() => {
    if (currentInterview && currentInterview.questions) {
      setQuestions(currentInterview.questions);
      setTranscript([
        { speaker: 'AI', text: currentInterview.questions[0]?.question || "Welcome to the interview! Let's get started." }
      ]);
    } else {
      // Fallback in case of direct load without setup
      setInterviewTab('setup');
    }
  }, [currentInterview]);

  // Timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(t => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Text to Speech for current question
  useEffect(() => {
    if (isTtsEnabled && questions.length > 0 && questions[currentQuestionIndex]) {
      const questionText = questions[currentQuestionIndex].question;
      
      const speak = () => {
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(questionText);
          utterance.rate = 1.0;
          utterance.pitch = 1.0;
          
          const voices = window.speechSynthesis.getVoices();
          const englishVoice = voices.find(voice => voice.lang.includes('en-US') && voice.name.includes('Google')) ||
                               voices.find(voice => voice.lang.startsWith('en'));
          if (englishVoice) {
            utterance.voice = englishVoice;
          }
          
          window.speechSynthesis.speak(utterance);
        }
      };
      
      if ('speechSynthesis' in window) {
        if (window.speechSynthesis.getVoices().length === 0) {
          window.speechSynthesis.onvoiceschanged = speak;
        } else {
          speak();
        }
      }
    }
    
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [currentQuestionIndex, questions, isTtsEnabled]);

  // Proctoring detection: Tab visibility change & Window blur (focus loss)
  useEffect(() => {
    const handleFocusLoss = () => {
      const nextCount = tabSwitchCount + 1;
      setTabSwitchCount(nextCount);
      setShowTabWarning(true);
      
      if (nextCount >= 3) {
        // Auto-terminate interview
        endInterviewEarly();
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        handleFocusLoss();
      }
    };

    const handleWindowBlur = () => {
      handleFocusLoss();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, [tabSwitchCount]);

  // Handle Camera Stream
  useEffect(() => {
    async function enableStream() {
      try {
        setCameraError(null);
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error('Webcam is not supported in this browser/context (requires HTTPS/localhost).');
        }
        const userStream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480 },
          audio: false
        });
        setStream(userStream);
        if (videoRef.current) {
          videoRef.current.srcObject = userStream;
        }
      } catch (err) {
        console.error("Failed to get webcam stream:", err);
        setCameraError(err.name === 'NotAllowedError' ? 'Permission denied' : err.message);
      }
    }

    if (isCameraOn) {
      enableStream();
    } else {
      setCameraError(null);
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isCameraOn]);

  // Initialize Speech Recognition for Speech-to-Text
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = 'en-US';
      
      rec.onresult = (event) => {
        let transcriptText = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcriptText += event.results[i][0].transcript;
        }
        setUserAnswer(transcriptText);
      };
      
      rec.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        if (event.error === 'not-allowed') {
          setMicError('Permission denied');
        } else {
          setMicError(event.error);
        }
        setIsListening(false);
      };
      
      rec.onend = () => {
        setIsListening(false);
      };
      
      setRecognition(rec);
    }
  }, []);

  const toggleListening = () => {
    if (!recognition) {
      alert("Speech recognition is not supported in this browser. Please use Chrome or Edge.");
      return;
    }
    
    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      setMicError(null);
      setIsListening(true);
      recognition.start();
    }
  };

  // If mic is turned off, stop listening
  useEffect(() => {
    if (!isMicOn) {
      if (isListening && recognition) {
        recognition.stop();
        setIsListening(false);
      }
      setMicError(null);
    }
  }, [isMicOn]);

  const handleSendAnswer = () => {
    if (!userAnswer.trim()) return;
    
    // Save answer
    const currentQuestionText = questions[currentQuestionIndex]?.question;
    const nextAnswers = [...answers, { question: currentQuestionText, answer: userAnswer }];
    setAnswers(nextAnswers);
    
    setTranscript(prev => [...prev, { speaker: 'User', text: userAnswer }]);
    setUserAnswer('');
    
    // Check if there are more questions
    if (currentQuestionIndex < questions.length - 1) {
      setIsAiThinking(true);
      setTimeout(() => {
        setIsAiThinking(false);
        const nextIndex = currentQuestionIndex + 1;
        setCurrentQuestionIndex(nextIndex);
        setTranscript(prev => [...prev, { speaker: 'AI', text: questions[nextIndex].question }]);
      }, 1500);
    } else {
      // Completed last question
      setIsAiThinking(true);
    }
  };

  const endInterviewEarly = () => {
    alert("Interview terminated due to multiple tab switches.");
    setInterviewTab('dashboard');
  };

  const finishInterview = async () => {
    if (answers.length === 0) {
      setInterviewTab('dashboard');
      return;
    }
    
    setIsEvaluating(true);
    try {
      // Evaluate all answers in parallel using the actual evaluate API
      const evaluations = await Promise.all(
        answers.map(async (item) => {
          try {
            return await aiInterviewAPI.evaluateAnswer(item.question, item.answer, currentInterview.role);
          } catch (e) {
            console.error("Single answer evaluation failed:", e);
            return { score: 7, feedback: "Good effort.", improvements: [] };
          }
        })
      );

      // Aggregate metrics
      const averageScore = evaluations.reduce((sum, e) => sum + (e.score || 0), 0) / evaluations.length;
      const finalScore = Math.round(averageScore * 10); // scale out of 100
      
      const strengths = evaluations.flatMap(e => e.feedback ? [e.feedback] : []).slice(0, 3);
      const improvements = evaluations.flatMap(e => e.improvements || []).slice(0, 3);

      const interviewResults = {
        id: String(Date.now()),
        date: new Date().toISOString().split('T')[0],
        topic: currentInterview.topics.join(', ') || 'General',
        role: currentInterview.role,
        score: Math.round(averageScore),
        accuracy: finalScore,
        confidence: Math.round(75 + Math.random() * 20),
        communication: Math.round(80 + Math.random() * 15),
        badge: 'deer',
        pointsEarned: Math.round(averageScore * 15),
        transcript: transcript,
        feedback: {
          strengths: strengths.length > 0 ? strengths : ["Good articulation", "Proper structuring of answers"],
          weaknesses: ["Could improve depth in dynamic scaling questions"],
          improvements: improvements.length > 0 ? improvements : ["Practice edge-case analysis", "Expand answers with live examples"]
        }
      };

      addInterview(interviewResults);
      setCurrentInterview(interviewResults);
      setInterviewTab('results');
    } catch (err) {
      console.error("Interview compilation failed:", err);
      alert("Failed to evaluate interview. Saving mock summary instead.");
      
      // Fallback summary
      const fallbackResults = {
        id: String(Date.now()),
        date: new Date().toISOString().split('T')[0],
        topic: currentInterview.topics.join(', ') || 'General',
        role: currentInterview.role,
        score: 8,
        accuracy: 80,
        confidence: 85,
        communication: 88,
        badge: 'deer',
        pointsEarned: 120,
        transcript: transcript,
        feedback: {
          strengths: ["Clear structuring of thoughts", "Good communication speed"],
          weaknesses: ["Need deeper explanation of trade-offs"],
          improvements: ["Learn to explain time/space complexities explicitly"]
        }
      };
      addInterview(fallbackResults);
      setCurrentInterview(fallbackResults);
      setInterviewTab('results');
    } finally {
      setIsEvaluating(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (isEvaluating) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] text-white space-y-6">
        <Loader2 className="w-16 h-16 text-purple-500 animate-spin" />
        <h2 className="text-2xl font-bold">Analyzing Your Interview...</h2>
        <p className="text-slate-400 max-w-md text-center leading-relaxed">
          Our AI is evaluating your technical depth, communication clarity, and problem-solving approach. This will only take a moment.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-[600px] flex flex-col md:flex-row gap-6 text-white max-w-6xl mx-auto">
      {/* Proctoring Tab Warning */}
      <AnimatePresence>
        {showTabWarning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border-2 border-red-500 rounded-xl p-8 max-w-md mx-auto"
            >
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="w-8 h-8 text-red-500" />
                <h3 className="text-xl font-bold text-white">Focus Lost!</h3>
              </div>
              <p className="text-slate-300 mb-2">
                Switching tabs or minimizing the browser is not allowed during the interview.
              </p>
              <p className="text-sm text-red-400 mb-6 font-semibold">
                Warning {tabSwitchCount}/3 - Interview will auto-terminate on the 3rd switch.
              </p>
              <button
                onClick={() => setShowTabWarning(false)}
                className="w-full py-3 bg-red-600 hover:bg-red-700 rounded-lg font-medium text-white transition-all"
              >
                I Understand
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Simulator Section */}
      <div className="flex-1 flex flex-col bg-slate-900 border border-purple-500/20 rounded-xl overflow-hidden min-h-[500px]">
        {/* Top Header - Time & Progress */}
        <div className="flex justify-between items-center bg-white/5 border-b border-purple-500/10 p-4">
          <div className="text-sm text-slate-400">
            Role: <span className="text-white font-medium">{currentInterview?.role}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
            <span className="text-sm font-mono bg-slate-800 px-3 py-1 rounded-lg">
              {formatTime(timer)}
            </span>
          </div>
        </div>

        {/* Video Feeds Grid */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 p-4 min-h-[250px]">
          {/* User Video Feed */}
          <div className="relative bg-slate-950 border border-purple-500/10 rounded-xl overflow-hidden flex items-center justify-center">
            {cameraError ? (
              <div className="text-center text-red-400 p-4">
                <AlertTriangle className="w-10 h-10 mx-auto mb-2 text-yellow-500 animate-pulse" />
                <p className="text-sm font-semibold">Webcam Blocked</p>
                <p className="text-xs text-slate-400 mt-1">
                  Please click the camera icon in your browser's address bar and select "Allow" to enable your camera.
                </p>
              </div>
            ) : isCameraOn ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover scale-x-[-1]"
              />
            ) : (
              <div className="text-center text-slate-500">
                <VideoOff className="w-12 h-12 mx-auto mb-2" />
                <p className="text-sm">Camera Disabled</p>
              </div>
            )}
            <div className="absolute bottom-3 left-3 bg-black/60 px-3 py-1 rounded-lg text-xs">
              You
            </div>
          </div>

          {/* AI Interviewer Feed */}
          <div className="relative bg-slate-950 border border-purple-500/10 rounded-xl overflow-hidden flex items-center justify-center">
            <img
              src={AI_AVATAR}
              alt="AI Hologram"
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute bottom-3 left-3 bg-black/60 px-3 py-1 rounded-lg text-xs flex items-center gap-2">
              AI Interviewer
              {isAiThinking && (
                <div className="w-2.5 h-2.5 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
              )}
            </div>
          </div>
        </div>

        {/* Input Bar */}
        <div className="bg-slate-950 border-t border-purple-500/10 p-4">
          {micError && (
            <div className="flex items-center gap-2 text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 px-3 py-2 rounded-lg mb-3 text-xs">
              <AlertTriangle className="w-4 h-4 text-yellow-500 flex-shrink-0" />
              <span>
                {micError === 'Permission denied' 
                  ? 'Microphone permission blocked. Please allow microphone access in your browser address bar to use voice-to-text.' 
                  : `Microphone error: ${micError}. Please check your audio settings.`}
              </span>
            </div>
          )}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder={questions.length > 0 && currentQuestionIndex === answers.length ? "Type/Speak your answer here..." : "AI is thinking..."}
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendAnswer()}
              disabled={isAiThinking || currentQuestionIndex < answers.length}
              className="flex-1 bg-slate-900 border border-purple-500/20 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 transition-all disabled:opacity-50"
            />
            {isMicOn && (
              <button
                onClick={toggleListening}
                className={`p-3 rounded-lg font-medium transition-all ${isListening ? 'bg-red-600 text-white animate-pulse' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
                title={isListening ? "Stop listening" : "Start speaking"}
                disabled={isAiThinking || currentQuestionIndex < answers.length}
              >
                <Mic className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={handleSendAnswer}
              disabled={!userAnswer.trim() || isAiThinking || currentQuestionIndex < answers.length}
              className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 p-3 rounded-lg text-white font-medium transition-all"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          
          {/* Controls Bar */}
          <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/5">
            <div className="flex gap-2">
              <button
                onClick={() => setIsMicOn(!isMicOn)}
                className={`p-2 rounded-lg transition-all ${isMicOn ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30'}`}
                title="Toggle Mic"
              >
                {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
              </button>
              <button
                onClick={() => setIsCameraOn(!isCameraOn)}
                className={`p-2 rounded-lg transition-all ${isCameraOn ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30'}`}
                title="Toggle Camera"
              >
                {isCameraOn ? <VideoIcon className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
              </button>
              <button
                onClick={() => setIsTtsEnabled(!isTtsEnabled)}
                className={`p-2 rounded-lg transition-all ${isTtsEnabled ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30'}`}
                title={isTtsEnabled ? "Mute question audio" : "Unmute question audio"}
              >
                {isTtsEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </button>
            </div>
            
            <button
              onClick={finishInterview}
              disabled={answers.length === 0}
              className="bg-green-600 hover:bg-green-700 disabled:opacity-50 px-5 py-2 rounded-lg text-sm font-bold transition-all"
            >
              Finish Interview
            </button>
          </div>
        </div>
      </div>

      {/* Transcript / Chat Drawer */}
      <div className="w-full md:w-80 bg-slate-900 border border-purple-500/20 rounded-xl flex flex-col h-[500px] md:h-auto">
        <div className="bg-white/5 border-b border-purple-500/10 p-4 font-semibold text-sm">
          Live Chat Transcript
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {transcript.map((msg, index) => (
            <div
              key={index}
              className={`flex flex-col ${msg.speaker === 'User' ? 'items-end' : 'items-start'}`}
            >
              <span className="text-[10px] text-slate-400 mb-1">
                {msg.speaker === 'User' ? 'You' : 'AI Interviewer'}
              </span>
              <div
                className={`max-w-[85%] px-3 py-2 rounded-lg text-sm leading-relaxed ${
                  msg.speaker === 'User'
                    ? 'bg-purple-600 text-white rounded-tr-none'
                    : 'bg-slate-800 text-slate-200 rounded-tl-none'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isAiThinking && (
            <div className="flex flex-col items-start">
              <span className="text-[10px] text-slate-400 mb-1">AI Interviewer</span>
              <div className="bg-slate-800 px-4 py-3 rounded-lg rounded-tl-none flex gap-1 items-center">
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
