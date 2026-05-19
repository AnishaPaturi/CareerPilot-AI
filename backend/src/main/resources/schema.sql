-- Unified Database Schema for AI-CareerOS

-- Users table (unified authentication)
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    role ENUM('STUDENT', 'ADMIN', 'RECRUITER') NOT NULL DEFAULT 'STUDENT',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Student profiles
CREATE TABLE students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    cgpa DECIMAL(3,2),
    branch VARCHAR(50),
    active_backlogs INT DEFAULT 0,
    skills JSON,
    certifications JSON,
    education JSON,
    experience JSON,
    projects JSON,
    summary TEXT,
    resume_url VARCHAR(500),
    FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_branch (branch),
    INDEX idx_cgpa (cgpa)
);

-- Companies table
CREATE TABLE companies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    website VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Jobs table (merged from placement system and external job sources)
CREATE TABLE jobs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT,
    title VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    description TEXT,
    job_type VARCHAR(50),
    keywords JSON,
    url VARCHAR(500),
    source VARCHAR(50) DEFAULT 'internal',
    posted_date DATETIME,
    min_cgpa DECIMAL(3,2),
    allowed_branches JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_title (title),
    INDEX idx_location (location)
);

-- Placement drives
CREATE TABLE drives (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT NOT NULL,
    role VARCHAR(100) NOT NULL,
    package_lpa DECIMAL(5,2),
    min_cgpa DECIMAL(3,2),
    allowed_branches JSON,
    drive_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id)
);

-- Applications
CREATE TABLE applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    drive_id INT NOT NULL,
    status ENUM('APPLIED', 'SHORTLISTED', 'TEST', 'INTERVIEW', 'SELECTED', 'REJECTED') DEFAULT 'APPLIED',
    applied_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (drive_id) REFERENCES drives(id)
);

-- Interview schedules
CREATE TABLE interviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    application_id INT,
    student_id INT NOT NULL,
    drive_id INT NOT NULL,
    round VARCHAR(100),
    interview_date_time DATETIME,
    location VARCHAR(255),
    notes TEXT,
    status ENUM('SCHEDULED', 'COMPLETED', 'MISSED', 'CANCELLED') DEFAULT 'SCHEDULED',
    feedback TEXT,
    score INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (drive_id) REFERENCES drives(id)
);

-- Resume analyses (ATS scores)
CREATE TABLE resume_analyses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    ats_score INT,
    skills_match JSON,
    missing_skills JSON,
    suggestions JSON,
    raw_analysis TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id)
);

-- Resume data
CREATE TABLE resumes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    template_id VARCHAR(50),
    resume_data JSON,
    pdf_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id)
);

-- DSA Topics
CREATE TABLE dsa_topics (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50),
    difficulty ENUM('EASY', 'MEDIUM', 'HARD'),
    description TEXT,
    prerequisites JSON,
    leetcode_id VARCHAR(50)
);

-- DSA Roadmaps (personalized)
CREATE TABLE dsa_roadmaps (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    title VARCHAR(100),
    target_company VARCHAR(100),
    timeline_days INT,
    daily_goals JSON,
    weak_areas JSON,
    status ENUM('ACTIVE', 'COMPLETED', 'PAUSED') DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id)
);

-- DSA Progress tracking
CREATE TABLE dsa_progress (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    topic_id INT,
    problems_solved INT DEFAULT 0,
    last_practiced DATE,
    confidence_score INT,
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (topic_id) REFERENCES dsa_topics(id)
);

-- Mock interviews
CREATE TABLE mock_interviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    interview_type ENUM('HR', 'TECHNICAL', 'SYSTEM_DESIGN', 'BEHAVIORAL') NOT NULL,
    questions JSON,
    answers JSON,
    feedback JSON,
    overall_score DECIMAL(4,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id)
);

-- AI Knowledge Base (documents)
CREATE TABLE documents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255),
    file_path VARCHAR(500),
    chunk_count INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Query history for AI assistant
CREATE TABLE query_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    document_id INT,
    query TEXT,
    response TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (document_id) REFERENCES documents(id)
);

-- Notifications
CREATE TABLE notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255),
    message TEXT,
    type VARCHAR(50),
    is_read TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Insert default admin (password: admin123, BCrypt hashed)
INSERT INTO users (email, password, name, role) VALUES ('admin@careeros.com', '$2a$10$N9qo8gWGBm1z8vTj6p3XdeBxZZxjWpJbLcHyh0pLzzDjnGSZTHQke', 'System Admin', 'ADMIN');