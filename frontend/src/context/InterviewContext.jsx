import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { studentsAPI } from '../services/api';

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
  const [interviews, setInterviews] = useState(sampleInterviews);
  const [badges, setBadges] = useState(initialBadges);
  const [currentInterview, setCurrentInterview] = useState(null);
  const [students, setStudents] = useState([]);

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
  
  const [user, setUser] = useState({
    name: authUser?.name || 'Alex Morgan',
    email: authUser?.email || 'alex@example.com',
    points: 450,
    currentBadge: 'deer',
    totalInterviews: 12,
    avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${authUser?.name || 'Alex'}`,
  });

  // Sync auth user details
  useEffect(() => {
    if (authUser) {
      setUser(prev => ({
        ...prev,
        name: authUser.name,
        email: authUser.email,
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${authUser.name}`,
      }));
    }
  }, [authUser]);

  const addInterview = (interview) => {
    setInterviews(prev => [interview, ...prev]);
    const updatedUserPoints = user.points + interview.pointsEarned;
    
    // Check for badge unlocks
    const updatedBadges = badges.map(badge => {
      if (!badge.unlocked && updatedUserPoints >= badge.pointsRequired) {
        return { ...badge, unlocked: true };
      }
      return badge;
    });
    
    setBadges(updatedBadges);
    
    // Find highest unlocked badge
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
