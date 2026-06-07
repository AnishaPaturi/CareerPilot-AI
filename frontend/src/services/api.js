const BASE_URL = "http://localhost:9999";
const AI_BASE_URL = "http://localhost:8000";

export { AI_BASE_URL };

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

export const knowledgeAPI = {
  upload: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${AI_BASE_URL}/api/ai/knowledge/upload`, {
      method: "POST",
      body: formData
    });
    if (!res.ok) throw new Error('Failed to upload document');
    return res.json();
  },
  getDocuments: async () => {
    const res = await fetch(`${AI_BASE_URL}/api/ai/knowledge/documents`);
    if (!res.ok) throw new Error('Failed to fetch documents');
    return res.json();
  },
  deleteDocument: async (docId) => {
    const res = await fetch(`${AI_BASE_URL}/api/ai/knowledge/document/${docId}`, {
      method: "DELETE"
    });
    if (!res.ok) throw new Error('Failed to delete document');
    return res.json();
  },
  viewDocument: async (docId) => {
    const res = await fetch(`${AI_BASE_URL}/api/ai/knowledge/document/${docId}/file`);
    if (!res.ok) throw new Error('Failed to view document');
    return res.json();
  },
  chat: async (query, document_ids) => {
    const res = await fetch(`${AI_BASE_URL}/api/ai/knowledge/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, document_ids })
    });
    if (!res.ok) throw new Error('Failed to chat with document');
    return res.json();
  },
  getHistory: async () => {
    const res = await fetch(`${AI_BASE_URL}/api/ai/knowledge/history`);
    if (!res.ok) throw new Error('Failed to fetch history');
    return res.json();
  },
  summarize: async () => {
    const res = await fetch(`${AI_BASE_URL}/api/ai/knowledge/summarize`, {
      method: "POST"
    });
    if (!res.ok) throw new Error('Failed to summarize document');
    return res.json();
  },
  exportSummaryPDF: async (summary) => {
    const res = await fetch(`${AI_BASE_URL}/api/ai/knowledge/summary/convert/pdf`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ summary })
    });
    return res.json();
  },
  exportSummaryWord: async (summary) => {
    const res = await fetch(`${AI_BASE_URL}/api/ai/knowledge/summary/convert/word`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ summary })
    });
    return res.json();
  },
  quiz: async (topic, num_questions = 5) => {
    const res = await fetch(`${AI_BASE_URL}/api/ai/knowledge/quiz?topic=${encodeURIComponent(topic)}&num_questions=${num_questions}`, {
      method: "POST"
    });
    if (!res.ok) throw new Error('Failed to generate quiz');
    return res.json();
  },
  createNote: async (note) => {
    const res = await fetch(`${AI_BASE_URL}/api/ai/knowledge/notes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(note)
    });
    if (!res.ok) throw new Error('Failed to create note');
    return res.json();
  },
  getNotes: async () => {
    const res = await fetch(`${AI_BASE_URL}/api/ai/knowledge/notes`);
    if (!res.ok) throw new Error('Failed to fetch notes');
    return res.json();
  }
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

export const studentsAPI = {
  getAll: async () => {
    const res = await fetch(`${BASE_URL}/api/students`);
    if (!res.ok) throw new Error('Failed to fetch students');
    return res.json();
  }
};

export const jobsAPI = {
  /**
   * Fetch live external job listings — always filtered to India via the backend.
   * @param {string} keyword  title / skill keyword (e.g. "software engineer")
   * @param {string} type     job type filter (e.g. "full-time", "remote")
   * @param {number} limit    max results
   */
  search: async (keyword = '', type = '', limit = 30) => {
    const params = new URLSearchParams();
    if (keyword)  params.set('keyword', keyword);
    if (type)     params.set('type', type);
    params.set('limit', String(limit));
    const res = await fetch(`http://localhost:9999/api/jobs?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch jobs');
    return res.json();
  },
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

export const atsAPI = {
  analyze: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${BASE_URL}/api/ai/ats/analyze`, {
      method: "POST",
      body: formData
    });
    if (!res.ok) throw new Error('Failed to analyze resume');
    return res.json();
  },
  matchJob: async (resumeText, jobDescription) => {
    const res = await fetch(`${BASE_URL}/api/ai/ats/match-job`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resume_text: resumeText, job_description: jobDescription })
    });
    if (!res.ok) throw new Error('Failed to match resume');
    return res.json();
  },
  rewrite: async ({ section, job_description, mode } = {}) => {
    const res = await fetch(`${BASE_URL}/api/ai/ats/rewrite`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ section, job_description, mode })
    });
    if (!res.ok) throw new Error('Failed to rewrite resume');
    return res.json();
  },
  chat: async (resumeText, question) => {
    const res = await fetch(`${BASE_URL}/api/ai/ats/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resume_text: resumeText, question })
    });
    if (!res.ok) throw new Error('Failed to chat with resume');
    return res.json();
  },
  convertDocx: async (text, mode = "improve") => {
    const res = await fetch(`${BASE_URL}/api/ai/ats/convert-docx`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, mode })
    });
    if (!res.ok) throw new Error('Failed to convert resume to Word document');
    return res.json();
  }
};