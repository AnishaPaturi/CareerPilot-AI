import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { studentsAPI, mockInterviewAPI } from '../services/api';

const InterviewContext = createContext(null);

export function useInterview() {
  const context = useContext(InterviewContext);
  if (!context) {
    throw new Error('useInterview must be used within an InterviewProvider');
  }
  return context;
}

const initialBadges = [
  { id: 'seed', name: 'Seed', icon: '🌱', pointsRequired: 0, unlocked: true },
  { id: 'fish', name: 'Fish', icon: '🐟', pointsRequired: 100, unlocked: false },
  { id: 'deer', name: 'Deer', icon: '🦌', pointsRequired: 300, unlocked: true },
  { id: 'wolf', name: 'Wolf', icon: '🐺', pointsRequired: 600, unlocked: false },
  { id: 'eagle', name: 'Eagle', icon: '🦅', pointsRequired: 1000, unlocked: false },
  { id: 'tiger', name: 'Tiger', icon: '🐅', pointsRequired: 1500, unlocked: false },
  { id: 'dragon', name: 'Dragon', icon: '🐉', pointsRequired: 2500, unlocked: false },
];

const sampleInterviews = [
  {
    id: '1',
    date: '2026-03-15',
    topic: 'System Design',
    role: 'Software Engineer',
    score: 85,
    accuracy: 88,
    confidence: 82,
    communication: 85,
    badge: 'deer',
    pointsEarned: 150,
    transcript: [
      { speaker: 'AI', text: 'Tell me about how you would design a URL shortener service.' },
      { speaker: 'User', text: 'I would start by understanding the requirements...' },
    ],
    feedback: {
      strengths: ['Clear communication', 'Good system thinking'],
      weaknesses: ['Need more detail on database schema'],
      improvements: ['Practice scaling considerations', 'Learn more about caching strategies'],
    },
  },
  {
    id: '2',
    date: '2026-03-10',
    topic: 'Machine Learning',
    role: 'Data Scientist',
    score: 78,
    accuracy: 75,
    confidence: 80,
    communication: 79,
    badge: 'fish',
    pointsEarned: 130,
    transcript: [
      { speaker: 'AI', text: 'Explain the difference between supervised and unsupervised learning.' },
      { speaker: 'User', text: 'Supervised learning uses labeled data...' },
    ],
    feedback: {
      strengths: ['Good understanding of concepts'],
      weaknesses: ['Could improve on practical examples'],
      improvements: ['Study more real-world ML applications'],
    },
  },
];

export function InterviewProvider({ children }) {
  const { user: authUser } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [interviews, setInterviews] = useState([]);
  const [badges, setBadges] = useState(initialBadges);
  const [currentInterview, setCurrentInterview] = useState(null);
  const [students, setStudents] = useState([]);

  const [user, setUser] = useState({
    name: authUser?.name || 'Alex Morgan',
    email: authUser?.email || 'alex@example.com',
    points: 0,
    currentBadge: 'seed',
    totalInterviews: 0,
    avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${authUser?.name || 'Alex'}`,
  });

  // Fetch registered students from gateway
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const data = await studentsAPI.getAll();
        setStudents(data);
      } catch (err) {
        console.error("Failed to load students in InterviewContext:", err);
      }
    };
    fetchStudents();
  }, [authUser]);

  // Sync auth user details and fetch mock interviews from backend
  useEffect(() => {
    if (authUser?.id) {
      mockInterviewAPI.getByStudent(authUser.id)
        .then(data => {
          if (!data || data.length === 0) {
            setInterviews([]);
            setUser({
              name: authUser.name,
              email: authUser.email,
              points: 0,
              totalInterviews: 0,
              currentBadge: 'seed',
              avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${authUser.name}`
            });
            setBadges(initialBadges);
            return;
          }

          const formatted = data.map(i => {
            let parsedFeedback = { strengths: [], weaknesses: [], improvements: [] };
            try {
              if (i.feedback) {
                parsedFeedback = typeof i.feedback === 'string' ? JSON.parse(i.feedback) : i.feedback;
              }
            } catch(e) {
              console.error("Failed to parse feedback:", e);
            }

            let parsedQuestions = [];
            try {
              if (i.questions) {
                parsedQuestions = typeof i.questions === 'string' ? JSON.parse(i.questions) : i.questions;
              }
            } catch(e) {}

            let parsedAnswers = [];
            try {
              if (i.answers) {
                parsedAnswers = typeof i.answers === 'string' ? JSON.parse(i.answers) : i.answers;
              }
            } catch(e) {}

            const transcript = [];
            const maxLen = Math.max(parsedQuestions.length, parsedAnswers.length);
            for (let idx = 0; idx < maxLen; idx++) {
              if (idx < parsedQuestions.length) transcript.push({ speaker: 'AI', text: parsedQuestions[idx] });
              if (idx < parsedAnswers.length) transcript.push({ speaker: 'User', text: parsedAnswers[idx] });
            }

            const accuracy = Math.round(i.overallScore || 0);
            const score = Math.round(accuracy / 10);
            const pointsEarned = Math.round(score * 15);

            return {
              id: String(i.id),
              date: i.createdAt ? i.createdAt.split('T')[0] : new Date().toISOString().split('T')[0],
              topic: i.interviewType === 'SYSTEM_DESIGN' ? 'System Design' :
                     i.interviewType === 'HR' ? 'HR / Behavioral' : 'Technical Coding',
              role: 'Software Engineer',
              score,
              accuracy,
              confidence: Math.round(75 + (i.id % 20)),
              communication: Math.round(80 + (i.id % 15)),
              badge: 'seed',
              pointsEarned,
              transcript,
              feedback: parsedFeedback
            };
          });

          setInterviews(formatted);

          const points = formatted.reduce((sum, item) => sum + item.pointsEarned, 0);
          const updatedBadges = initialBadges.map(badge => ({
            ...badge,
            unlocked: points >= badge.pointsRequired
          }));
          setBadges(updatedBadges);

          let highestBadgeId = 'seed';
          updatedBadges.forEach(badge => {
            if (badge.unlocked && badge.pointsRequired > (initialBadges.find(b => b.id === highestBadgeId)?.pointsRequired || 0)) {
              highestBadgeId = badge.id;
            }
          });

          setUser({
            name: authUser.name,
            email: authUser.email,
            points: points,
            totalInterviews: formatted.length,
            currentBadge: highestBadgeId,
            avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${authUser.name}`
          });
        })
        .catch(err => {
          console.error("Failed to load student mock interviews:", err);
        });
    } else {
      setInterviews([]);
      setUser({
        name: 'Guest User',
        email: 'guest@example.com',
        points: 0,
        currentBadge: 'seed',
        totalInterviews: 0,
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=Guest`
      });
      setBadges(initialBadges);
    }
  }, [authUser]);

  const addInterview = (interview) => {
    if (authUser?.id) {
      let mappedType = 'TECHNICAL';
      if (interview.topic.includes('System Design')) mappedType = 'SYSTEM_DESIGN';
      else if (interview.topic.includes('HR') || interview.topic.includes('Behavioral')) mappedType = 'HR';

      const dbPayload = {
        studentId: authUser.id,
        interviewType: mappedType,
        questions: JSON.stringify(interview.transcript.filter(t => t.speaker === 'AI').map(t => t.text)),
        answers: JSON.stringify(interview.transcript.filter(t => t.speaker === 'User').map(t => t.text)),
        feedback: JSON.stringify(interview.feedback),
        overallScore: parseFloat(interview.accuracy || (interview.score * 10))
      };

      mockInterviewAPI.save(dbPayload)
        .then(saved => {
          const newFormatted = {
            ...interview,
            id: String(saved.id)
          };
          setInterviews(prev => [newFormatted, ...prev]);
        })
        .catch(err => {
          console.error("Failed to save mock interview to DB:", err);
          setInterviews(prev => [interview, ...prev]);
        });
    } else {
      setInterviews(prev => [interview, ...prev]);
    }

    const updatedUserPoints = user.points + interview.pointsEarned;
    const updatedBadges = badges.map(badge => {
      if (!badge.unlocked && updatedUserPoints >= badge.pointsRequired) {
        return { ...badge, unlocked: true };
      }
      return badge;
    });
    setBadges(updatedBadges);

    let highestBadgeId = user.currentBadge;
    updatedBadges.forEach(badge => {
      if (badge.unlocked && badge.pointsRequired > (badges.find(b => b.id === highestBadgeId)?.pointsRequired || 0)) {
        highestBadgeId = badge.id;
      }
    });

    setUser(prev => ({
      ...prev,
      points: updatedUserPoints,
      totalInterviews: prev.totalInterviews + 1,
      currentBadge: highestBadgeId
    }));
  };

  const unlockBadge = (badgeId) => {
    setBadges(prev =>
      prev.map(badge =>
        badge.id === badgeId ? { ...badge, unlocked: true } : badge
      )
    );
  };

  return (
    <InterviewContext.Provider
      value={{
        user,
        setUser,
        interviews,
        addInterview,
        badges,
        unlockBadge,
        currentInterview,
        setCurrentInterview,
        activeTab,
        setInterviewTab: setActiveTab,
        students
      }}
    >
      {children}
    </InterviewContext.Provider>
  );
}
