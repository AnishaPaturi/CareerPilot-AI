import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(() => localStorage.getItem('resumeai_role'));
  const [token, setToken] = useState(() => localStorage.getItem('resumeai_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('resumeai_user');
    if (stored && token) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem('resumeai_user');
      }
    }
    setLoading(false);
  }, [token]);

  const login = async (email, password) => {
    const data = await authAPI.login(email, password);
    const { token: jwt, user: userData, role: userRole } = data;
    localStorage.setItem('resumeai_token', jwt || '');
    localStorage.setItem('resumeai_user', JSON.stringify(userData));
    localStorage.setItem('resumeai_role', userRole || 'STUDENT');
    setToken(jwt);
    setUser(userData);
    setRole(userRole || 'STUDENT');
    return data;
  };

  const demoLogin = () => {
    const demoUser = { id: 1, name: 'Demo User', email: 'demo@resumeai.com' };
    const demoToken = 'demo-token-' + Date.now();
    const demoRole = 'STUDENT';
    localStorage.setItem('resumeai_token', demoToken);
    localStorage.setItem('resumeai_user', JSON.stringify(demoUser));
    localStorage.setItem('resumeai_role', demoRole);
    setToken(demoToken);
    setUser(demoUser);
    setRole(demoRole);
  };

  const register = async (name, email, password) => {
    const data = await authAPI.register(name, email, password);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('resumeai_token');
    localStorage.removeItem('resumeai_user');
    localStorage.removeItem('resumeai_role');
    setToken(null);
    setUser(null);
    setRole(null);
  };

  return (
      <AuthContext.Provider value={{ user, role, token, loading, login, logout, register, demoLogin, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
