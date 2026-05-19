const BASE_URL = "http://localhost:8080";

export const authAPI = {
  login: async (email, password) => {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    return data;
  },

  register: async (name, email, password) => {
    const res = await fetch(`${BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Registration failed");
    return data;
  },
};

export const drivesAPI = {
  getAll: async () => {
    const res = await fetch(`${BASE_URL}/api/drives`);
    if (!res.ok) throw new Error('Failed to fetch drives');
    return res.json();
  },
  create: async (driveData) => {
    const res = await fetch(`${BASE_URL}/api/drives`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(driveData),
    });
    if (!res.ok) throw new Error('Failed to create drive');
    return res.text();
  },
  apply: async (driveId, studentId) => {
    const res = await fetch(`${BASE_URL}/api/drives/${driveId}/apply/${studentId}`, {
      method: "POST"
    });
    if (!res.ok) throw new Error('Failed to apply for drive');
    return res.text();
  }
};

export const applicationsAPI = {
  getByStudent: async (studentId) => {
    const res = await fetch(`${BASE_URL}/api/applications/student/${studentId}`);
    if (!res.ok) throw new Error('Failed to fetch applications');
    return res.json();
  }
};

export const aiInterviewAPI = {
  generateQuestions: async (role, interview_type, experience_level, tech_stack) => {
    const res = await fetch(`${BASE_URL}/api/ai/interview/generate-questions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role, interview_type, experience_level, tech_stack })
    });
    if (!res.ok) throw new Error('Failed to generate questions');
    return res.json();
  },
  evaluateAnswer: async (question, answer, role) => {
    const res = await fetch(`${BASE_URL}/api/ai/interview/evaluate-answer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, answer, role })
    });
    if (!res.ok) throw new Error('Failed to evaluate answer');
    return res.json();
  }
};

export const dsaPlannerAPI = {
  generateRoadmap: async (profile, days) => {
    const res = await fetch(`${BASE_URL}/api/ai/dsa/generate-roadmap`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profile, days })
    });
    if (!res.ok) throw new Error('Failed to generate roadmap');
    return res.json();
  },
  recommendProblems: async (topic, count, difficulty) => {
    let url = `${BASE_URL}/api/ai/dsa/recommend-problems?topic=${encodeURIComponent(topic)}`;
    if (count) url += `&count=${count}`;
    if (difficulty) url += `&difficulty=${encodeURIComponent(difficulty)}`;
    const res = await fetch(url, { method: "POST" });
    if (!res.ok) throw new Error('Failed to recommend problems');
    return res.json();
  }
};
