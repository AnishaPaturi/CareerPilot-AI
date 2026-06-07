import { atsAPI } from "../services/api";

export const parseResumeTextToHTML = (text) => {
  if (!text) return "";
  
  const lines = text.split('\n').map(line => line.trim());
  let name = "";
  let email = "";
  let phone = "";
  let linkedin = "";
  let github = "";
  
  // RegEx patterns
  const emailRegex = /([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6})/;
  const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
  const linkedinRegex = /(linkedin\.com\/in\/[a-zA-Z0-9_-]+)/i;
  const githubRegex = /(github\.com\/[a-zA-Z0-9_-]+)/i;

  const contentLines = [];
  
  // First pass: extract contact details and candidate name
  let firstNonEmptyLine = "";
  for (let line of lines) {
    if (!line) continue;
    
    // Find email
    const emailMatch = line.match(emailRegex);
    if (emailMatch && !email) email = emailMatch[0];
    
    // Find phone
    const phoneMatch = line.match(phoneRegex);
    if (phoneMatch && !phone) phone = phoneMatch[0];
    
    // Find LinkedIn
    const linkedinMatch = line.match(linkedinRegex);
    if (linkedinMatch && !linkedin) linkedin = linkedinMatch[0];
    
    // Find GitHub
    const githubMatch = line.match(githubRegex);
    if (githubMatch && !github) github = githubMatch[0];
    
    // Check if this line is just contact details or separator, if so skip adding to body content
    const isContactLine = 
      line.includes('@') || 
      line.includes('linkedin.com') || 
      line.includes('github.com') ||
      (phone && line.includes(phone)) ||
      (line.includes('|') && (line.includes('@') || line.toLowerCase().includes('phone') || line.toLowerCase().includes('email')));
      
    if (isContactLine) {
      continue;
    }
    
    if (!firstNonEmptyLine && !line.startsWith('#')) {
      firstNonEmptyLine = line;
    }
    
    contentLines.push(line);
  }

  // Determine Candidate Name
  const firstLine = lines.find(l => l.length > 0) || "";
  if (firstLine.startsWith('#')) {
    name = firstLine.replace(/^[#\s]+/, '');
  } else if (firstNonEmptyLine && firstNonEmptyLine.length < 40 && !firstNonEmptyLine.includes(':')) {
    name = firstNonEmptyLine;
    // remove from content lines so it doesn't repeat in body
    const idx = contentLines.indexOf(firstNonEmptyLine);
    if (idx > -1) contentLines.splice(idx, 1);
  } else {
    name = "Resume";
  }

  // Group text into sections
  const sections = [];
  let currentSection = null;

  const isHeader = (line) => {
    if (line.startsWith('#')) return true;
    
    const upper = line.toUpperCase();
    const commonHeaders = [
      "SUMMARY", "PROFESSIONAL SUMMARY", "EXPERIENCE", "WORK EXPERIENCE",
      "EDUCATION", "SKILLS", "TECHNICAL SKILLS", "PROJECTS", "CERTIFICATIONS",
      "ORGANIZATIONS", "LANGUAGES", "COURSES", "INTERNSHIPS", "SUMMARY OF QUALIFICATIONS"
    ];
    
    if (commonHeaders.includes(upper)) return true;
    
    // If it's a short all-caps line without common sentence punctuation
    if (line.length > 2 && line.length < 35 && upper === line && !line.includes('|') && !line.includes('*') && !line.includes(':') && !line.includes('-')) {
      return true;
    }
    return false;
  };

  for (let line of contentLines) {
    if (isHeader(line)) {
      if (currentSection) {
        sections.push(currentSection);
      }
      currentSection = {
        title: line.replace(/^[#\s\-\:]+/, ''),
        items: []
      };
    } else {
      if (!currentSection) {
        currentSection = { title: "Profile", items: [] };
      }
      currentSection.items.push(line);
    }
  }
  if (currentSection) {
    sections.push(currentSection);
  }

  // Format HTML body sections
  let sectionsHTML = "";
  for (let sec of sections) {
    if (sec.items.length === 0) continue;
    
    let secContentHTML = "";
    let inList = false;
    
    for (let item of sec.items) {
      const isBullet = item.startsWith('-') || item.startsWith('*') || item.startsWith('•') || item.startsWith('+');
      
      // Parse markdown bold and italic styles
      let formattedText = item
        .replace(/^[\-\*\•\+]\s*/, '')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>');
        
      if (isBullet) {
        if (!inList) {
          secContentHTML += '<ul class="bullet-points">';
          inList = true;
        }
        secContentHTML += `<li>${formattedText}</li>`;
      } else {
        if (inList) {
          secContentHTML += '</ul>';
          inList = false;
        }
        
        // Format company header/title lines (e.g. "Software Engineer | Google | 2021-Present")
        if (item.includes('|') || item.includes('  ') || (item.includes(' - ') && item.length < 100)) {
          const parts = item.split(/[|]|\s{2,}/).map(p => p.trim()).filter(Boolean);
          if (parts.length >= 2) {
            secContentHTML += `
              <div class="item-header">
                <span class="item-title">${parts[0]}</span>
                <span class="item-date">${parts[parts.length - 1]}</span>
              </div>
            `;
            if (parts.length > 2) {
              secContentHTML += `
                <div class="item-subheader">
                  <span>${parts.slice(1, parts.length - 1).join(', ')}</span>
                </div>
              `;
            }
          } else {
            secContentHTML += `<div class="item-text">${formattedText}</div>`;
          }
        } else {
          secContentHTML += `<p class="item-text">${formattedText}</p>`;
        }
      }
    }
    
    if (inList) {
      secContentHTML += '</ul>';
    }

    sectionsHTML += `
      <div class="section">
        <h2 class="section-title">${sec.title}</h2>
        ${secContentHTML}
      </div>
    `;
  }

  // Create links HTML
  const contactParts = [];
  if (email) contactParts.push(`<a href="mailto:${email}">${email}</a>`);
  if (phone) contactParts.push(`<span>${phone}</span>`);
  if (linkedin) {
    const cleanLnk = linkedin.startsWith('http') ? linkedin : `https://${linkedin}`;
    contactParts.push(`<a href="${cleanLnk}" target="_blank">LinkedIn</a>`);
  }
  if (github) {
    const cleanGit = github.startsWith('http') ? github : `https://${github}`;
    contactParts.push(`<a href="${cleanGit}" target="_blank">GitHub</a>`);
  }

  const contactHTML = contactParts.join(' &nbsp;|&nbsp; ');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${name} - Resume</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,600;0,700;1,400&display=swap');
  
  body {
    font-family: 'Outfit', sans-serif;
    color: #1e293b;
    line-height: 1.6;
    margin: 0;
    padding: 40px;
    background-color: #f8fafc;
  }
  
  .resume-paper {
    background-color: #ffffff;
    max-width: 800px;
    margin: 0 auto;
    padding: 50px 60px;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05);
    border-radius: 8px;
    border: 1px solid #e2e8f0;
  }
  
  .header {
    text-align: center;
    border-bottom: 2px solid #3b82f6;
    padding-bottom: 24px;
    margin-bottom: 28px;
  }
  
  .header h1 {
    font-family: 'Playfair Display', serif;
    font-size: 34px;
    margin: 0 0 8px 0;
    color: #0f172a;
    font-weight: 700;
    letter-spacing: -0.01em;
  }
  
  .contact-info {
    font-size: 14px;
    color: #475569;
    font-weight: 400;
  }
  
  .contact-info a {
    color: #3b82f6;
    text-decoration: none;
    border-bottom: 1px solid transparent;
    transition: border-color 0.2s;
  }
  
  .contact-info a:hover {
    border-bottom-color: #3b82f6;
  }
  
  .section {
    margin-bottom: 28px;
  }
  
  .section-title {
    font-family: 'Playfair Display', serif;
    font-size: 18px;
    font-weight: 700;
    color: #0f172a;
    border-bottom: 1px solid #cbd5e1;
    padding-bottom: 6px;
    margin-top: 0;
    margin-bottom: 14px;
    letter-spacing: 0.02em;
  }
  
  .item-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    font-weight: 600;
    color: #0f172a;
    font-size: 15px;
    margin-top: 10px;
    margin-bottom: 2px;
  }
  
  .item-title {
    color: #0f172a;
  }
  
  .item-date {
    font-size: 13px;
    color: #64748b;
    font-weight: 500;
  }
  
  .item-subheader {
    font-size: 13.5px;
    color: #475569;
    font-weight: 500;
    margin-bottom: 8px;
    font-style: italic;
  }
  
  .bullet-points {
    font-size: 14px;
    color: #334155;
    margin: 0 0 12px 0;
    padding-left: 20px;
  }
  
  .bullet-points li {
    margin-bottom: 5px;
    line-height: 1.5;
  }
  
  .item-text {
    font-size: 14px;
    color: #334155;
    margin: 0 0 10px 0;
    text-align: justify;
  }
  
  @media print {
    body {
      background-color: #ffffff;
      padding: 0;
      color: #000;
    }
    .resume-paper {
      padding: 0;
      box-shadow: none;
      border: none;
      max-width: 100%;
    }
    .header {
      border-bottom-color: #000;
    }
    .section-title {
      border-bottom-color: #000;
    }
    .contact-info a {
      color: #000;
    }
  }
</style>
</head>
<body>
<div class="resume-paper">
  <div class="header">
    <h1>${name}</h1>
    <div class="contact-info">
      ${contactHTML}
    </div>
  </div>
  ${sectionsHTML}
</div>
</body>
</html>`;
};

export const downloadResume = async (improvedText, mode) => {
  if (!improvedText) {
    alert("No resume text available to download.");
    return;
  }
  try {
    const data = await atsAPI.convertDocx(improvedText, mode);
    if (data.word_base64) {
      const link = document.createElement("a");
      link.href = `data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,${data.word_base64}`;
      link.download = mode === "scratch" ? "new_resume.docx" : "improved_resume.docx";
      link.click();
    } else if (data.error) {
      alert(data.error);
    }
  } catch (err) {
    console.error(err);
    alert("Failed to export Word document: " + err.message);
  }
};
