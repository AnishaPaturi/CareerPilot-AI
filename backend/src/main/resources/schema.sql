-- Unified Database Schema for AI-CareerOS

-- Users table (unified authentication)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    role ENUM('STUDENT', 'ADMIN', 'RECRUITER') NOT NULL DEFAULT 'STUDENT',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Student profiles
CREATE TABLE IF NOT EXISTS students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    password VARCHAR(255),
    cgpa DECIMAL(3,2),
    branch VARCHAR(50),
    active_backlogs INT DEFAULT 0,
    skills TEXT,
    certifications TEXT,
    resume_url VARCHAR(500),
    education TEXT,
    experience TEXT,
    projects TEXT,
    summary TEXT,
    reset_token VARCHAR(255)
);

-- Companies table
CREATE TABLE IF NOT EXISTS companies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    website VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Jobs table (merged from placement system and external job sources)
CREATE TABLE IF NOT EXISTS jobs (
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
CREATE TABLE IF NOT EXISTS drives (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT NOT NULL,
    company_name VARCHAR(255),
    role VARCHAR(100) NOT NULL,
    package_lpa DECIMAL(5,2),
    min_cgpa DECIMAL(3,2),
    allowed_branches JSON,
    drive_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id)
);

-- Sample companies
INSERT IGNORE INTO companies (id, name, description, website) VALUES
(1,  'Google',                 'A global technology company known for Android, Search, Cloud, and AI products.',                    'https://careers.google.com'),
(2,  'Microsoft',              'A multinational technology corporation developing software, hardware, and cloud services.',          'https://careers.microsoft.com'),
(3,  'Amazon Web Services',    'Amazon cloud computing division delivering AWS infrastructure and AI-powered solutions.',          'https://aws.amazon.com/careers'),
(4,  'Infosys',                'A leading Indian multinational IT services and consulting company.',                              'https://www.infosys.com/careers'),
(5,  'Tata Consultancy Services','The world largest IT services company headquartered in India.',                                 'https://www.tcs.com/careers'),
(6,  'Walmart',                'A multinational retail corporation building next-gen e-commerce and supply-chain technology.',   'https://careers.walmart.com');

-- Sample drives (sample data seeded for demo purposes)
INSERT IGNORE INTO drives (id, company_id, company_name, role, package_lpa, min_cgpa, allowed_branches, drive_date, created_at) VALUES
(1,  1, 'Google',             'Software Engineer',           25.0, 7.5, '["CSE","IT","ECE"]',                 DATE_ADD(CURDATE(), INTERVAL 30 DAY), NOW()),
(2,  2, 'Microsoft',          'Software Developer (Azure)',  18.0, 7.0, '["CSE","IT"]',                        DATE_ADD(CURDATE(), INTERVAL 30 DAY), NOW()),
(3,  3, 'Amazon Web Services','Cloud Engineer',              22.0, 8.0, '["CSE","IT","ECE","EEE"]',            DATE_ADD(CURDATE(), INTERVAL 60 DAY), NOW()),
(4,  4, 'Infosys',            'Data Analyst',                12.0, 6.5, '["CSE","IT","ECE"]',                  DATE_ADD(CURDATE(), INTERVAL 60 DAY), NOW()),
(5,  5, 'TCS',                'Full Stack Developer',        15.0, 7.0, '["CSE","IT"]',                        DATE_ADD(CURDATE(), INTERVAL 90 DAY), NOW()),
(6,  1, 'Google',             'Machine Learning Engineer',   35.0, 8.5, '["CSE","ECE"]',                       DATE_ADD(CURDATE(), INTERVAL 90 DAY), NOW()),
(7,  6, 'Walmart',            'Backend Engineer (Java)',     16.0, 7.0, '["CSE","IT"]',                        DATE_ADD(CURDATE(), INTERVAL 120 DAY),NOW()),
(8,  4, 'Infosys',            'QA Engineer',                 10.0, 6.0, '["CSE","IT","ECE","EEE","MECH"]',    DATE_ADD(CURDATE(), INTERVAL 120 DAY),NOW()),
(9,  3, 'Amazon Web Services','DevOps Engineer',             20.0, 7.5, '["CSE","IT"]',                        DATE_ADD(CURDATE(), INTERVAL 120 DAY),NOW()),
(10, 2, 'Microsoft',          'Frontend Developer (React)',  14.0, 7.0, '["CSE","IT"]',                        DATE_ADD(CURDATE(), INTERVAL 120 DAY),NOW());

-- Applications
CREATE TABLE IF NOT EXISTS applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    drive_id INT NOT NULL,
    status ENUM('APPLIED', 'SHORTLISTED', 'TEST', 'INTERVIEW', 'SELECTED', 'REJECTED') DEFAULT 'APPLIED',
    applied_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (drive_id) REFERENCES drives(id)
);

-- Interview schedules
CREATE TABLE IF NOT EXISTS interviews (
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
CREATE TABLE IF NOT EXISTS resume_analyses (
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
CREATE TABLE IF NOT EXISTS resumes (
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
CREATE TABLE IF NOT EXISTS dsa_topics (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50),
    difficulty ENUM('EASY', 'MEDIUM', 'HARD'),
    description TEXT,
    prerequisites JSON,
    leetcode_id VARCHAR(50)
);

-- DSA Roadmaps (personalized)
CREATE TABLE IF NOT EXISTS dsa_roadmaps (
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
CREATE TABLE IF NOT EXISTS dsa_progress (
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
CREATE TABLE IF NOT EXISTS mock_interviews (
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
CREATE TABLE IF NOT EXISTS documents (
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
CREATE TABLE IF NOT EXISTS query_logs (
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
CREATE TABLE IF NOT EXISTS notifications (
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
INSERT IGNORE INTO users (email, password, name, role) VALUES ('admin@careeros.com', '$2a$10$N9qo8gWGBm1z8vTj6p3XdeBxZZxjWpJbLcHyh0pLzzDjnGSZTHQke', 'System Admin', 'ADMIN');