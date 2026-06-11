import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Landing() {
  const [activeTab, setActiveTab] = useState('roadmap');

  useEffect(() => {
    // Dynamically inject Google Fonts for the landing page
    const link1 = document.createElement('link');
    link1.rel = 'preconnect';
    link1.href = 'https://fonts.googleapis.com';
    document.head.appendChild(link1);

    const link2 = document.createElement('link');
    link2.rel = 'preconnect';
    link2.href = 'https://fonts.gstatic.com';
    link2.crossOrigin = 'anonymous';
    document.head.appendChild(link2);

    const link3 = document.createElement('link');
    link3.rel = 'stylesheet';
    link3.href = 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap';
    document.head.appendChild(link3);

    return () => {
      document.head.removeChild(link1);
      document.head.removeChild(link2);
      document.head.removeChild(link3);
    };
  }, []);

  const descs = {
    roadmap: "AlgoMentor generates a day-by-day DSA plan calibrated to your target company tier. It identifies weak areas first, then schedules topics to maximise interview readiness within your deadline.",
    ats: "The ATS Auditor parses your resume against a real job description, scores keyword match density, and highlights warning areas before exporting to clean Word format.",
    mock: "The Mock Arena simulates technical or behavioral interviews. Speak your answers via the browser's Web Speech API and receive instant feedback on accuracy."
  };

  const windowLabels = {
    roadmap: "algoMentor · 30-day roadmap",
    ats: "atsAuditor · resume analysis",
    mock: "mockArena · interview simulator"
  };

  return (
    <div className="landing-root">
      {/* ── CUSTOM INLINE STYLES ── */}
      <style>{`
        .landing-root {
          background: #080C18;
          color: #F0F2FF;
          font-family: 'Space Grotesk', sans-serif;
          line-height: 1.6;
          min-height: 100-vh;
          overflow-x: hidden;
          position: relative;
        }

        .landing-root *, .landing-root *::before, .landing-root *::after {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        /* ── NOISE TEXTURE OVERLAY ── */
        .landing-root::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 0;
          opacity: 0.4;
        }

        /* ── BACKGROUND GLOW BLOBS ── */
        .bg-blob {
          position: fixed;
          border-radius: 50%;
          filter: blur(120px);
          pointer-events: none;
          z-index: 0;
          opacity: 0.15;
        }
        .bg-blob-1 { width: 600px; height: 600px; background: #6C63FF; top: -200px; left: -200px; }
        .bg-blob-2 { width: 500px; height: 500px; background: #14B8A6; bottom: 0; right: -150px; }
        .bg-blob-3 { width: 400px; height: 400px; background: #3B4ED8; top: 40%; left: 40%; }

        /* ── LAYOUT ── */
        .container { max-width: 1120px; margin: 0 auto; padding: 0 24px; position: relative; z-index: 1; }

        /* ── NAV ── */
        .landing-nav {
          position: sticky;
          top: 0;
          z-index: 100;
          padding: 0 24px;
          border-bottom: 1px solid rgba(255,255,255,0.07);
          background: rgba(8,12,24,0.75);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }
        .nav-inner {
          max-width: 1120px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 64px;
          gap: 32px;
        }
        .logo {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          flex-shrink: 0;
        }
        .logo-mark {
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, #6C63FF, #9C8DFF);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .logo-mark svg { width: 16px; height: 16px; fill: none; stroke: white; stroke-width: 2.5; }
        .logo-text { font-weight: 700; font-size: 16px; color: #F0F2FF; letter-spacing: -0.02em; }
        .logo-text span { color: #6C63FF; }
        .nav-links { display: flex; align-items: center; gap: 32px; }
        .nav-links a {
          font-size: 14px;
          font-weight: 500;
          color: #8892B0;
          text-decoration: none;
          transition: color 0.2s;
          white-space: nowrap;
        }
        .nav-links a:hover { color: #F0F2FF; }
        .nav-ctas { display: flex; align-items: center; gap: 12px; flex-shrink: 0; }
        .btn-ghost {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 14px;
          font-weight: 600;
          color: #8892B0;
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px 16px;
          border-radius: 8px;
          transition: all 0.2s;
          text-decoration: none;
        }
        .btn-ghost:hover { color: #F0F2FF; background: rgba(255,255,255,0.05); }
        .btn-primary {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 14px;
          font-weight: 600;
          color: white;
          background: #6C63FF;
          border: none;
          cursor: pointer;
          padding: 9px 20px;
          border-radius: 8px;
          transition: all 0.2s;
          text-decoration: none;
          white-space: nowrap;
        }
        .btn-primary:hover { background: #7B73FF; transform: translateY(-1px); }

        /* ── HERO ── */
        .hero {
          padding: 100px 24px 80px;
          text-align: center;
          position: relative;
          z-index: 1;
        }
        .hero-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(108,99,255,0.15);
          border: 1px solid rgba(108,99,255,0.35);
          border-radius: 100px;
          padding: 6px 14px;
          margin-bottom: 32px;
          font-size: 12px;
          font-weight: 600;
          color: #A5A0FF;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
        .hero-eyebrow .dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #6C63FF;
          animation: pulse-dot 2s ease-in-out infinite;
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.7); }
        }
        .hero h1 {
          font-size: clamp(42px, 7vw, 84px);
          font-weight: 700;
          line-height: 1.0;
          letter-spacing: -0.04em;
          margin-bottom: 24px;
          max-width: 900px;
          margin-left: auto;
          margin-right: auto;
        }
        .hero h1 .line-accent { color: #6C63FF; }
        .hero h1 .line-teal { color: #14B8A6; }
        .hero-sub {
          font-size: 18px;
          color: #8892B0;
          max-width: 560px;
          margin: 0 auto 48px;
          line-height: 1.7;
          font-weight: 400;
        }
        .hero-ctas {
          display: flex;
          gap: 16px;
          justify-content: center;
          align-items: center;
          flex-wrap: wrap;
          margin-bottom: 80px;
        }
        .btn-hero-primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #6C63FF;
          color: white;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 16px;
          font-weight: 600;
          padding: 14px 28px;
          border-radius: 10px;
          border: none;
          cursor: pointer;
          text-decoration: none;
          transition: all 0.2s;
          letter-spacing: -0.01em;
        }
        .btn-hero-primary:hover { background: #7B73FF; transform: translateY(-2px); box-shadow: 0 8px 30px rgba(108,99,255,0.35); }
        .btn-hero-secondary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255,255,255,0.05);
          color: #F0F2FF;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 16px;
          font-weight: 600;
          padding: 14px 28px;
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.07);
          cursor: pointer;
          text-decoration: none;
          transition: all 0.2s;
        }
        .btn-hero-secondary:hover { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.15); }
        .btn-arrow { transition: transform 0.2s; }
        .btn-hero-primary:hover .btn-arrow, .btn-hero-secondary:hover .btn-arrow { transform: translateX(3px); }

        /* ── TRAJECTORY DIAGRAM ── */
        .trajectory-wrapper {
          max-width: 860px;
          margin: 0 auto;
          background: #0F1628;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 20px;
          overflow: hidden;
          position: relative;
        }
        .trajectory-bar {
          background: rgba(255,255,255,0.03);
          border-bottom: 1px solid rgba(255,255,255,0.07);
          padding: 12px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .trajectory-bar-dots { display: flex; gap: 6px; }
        .trajectory-bar-dots span { width: 10px; height: 10px; border-radius: 50%; }
        .dot-r { background: #FF5F57; }
        .dot-a { background: #FFBD2E; }
        .dot-g { background: #28C840; }
        .trajectory-bar-title {
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          color: #4A5578;
        }
        .trajectory-bar-badge {
          font-size: 11px;
          font-weight: 700;
          color: #14B8A6;
          background: rgba(20,184,166,0.12);
          padding: 3px 10px;
          border-radius: 100px;
          border: 1px solid rgba(20,184,166,0.2);
        }
        .trajectory-svg-container { padding: 32px 24px 28px; }

        /* ── STATS STRIP ── */
        .stats-strip {
          border-top: 1px solid rgba(255,255,255,0.07);
          border-bottom: 1px solid rgba(255,255,255,0.07);
          padding: 40px 24px;
          margin: 0;
        }
        .stats-inner {
          max-width: 1120px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 0;
          position: relative;
          z-index: 1;
        }
        .stat-item {
          padding: 16px 24px;
          text-align: center;
          border-right: 1px solid rgba(255,255,255,0.07);
        }
        .stat-item:last-child { border-right: none; }
        .stat-number {
          font-size: 40px;
          font-weight: 700;
          letter-spacing: -0.04em;
          line-height: 1;
          margin-bottom: 6px;
        }
        .stat-number.accent { color: #6C63FF; }
        .stat-number.teal { color: #14B8A6; }
        .stat-label {
          font-size: 13px;
          color: #4A5578;
          font-weight: 500;
        }

        /* ── SECTION STYLES ── */
        section { padding: 100px 24px; position: relative; z-index: 1; }
        .section-eyebrow {
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          font-weight: 700;
          color: #6C63FF;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          margin-bottom: 16px;
        }
        .section-title {
          font-size: clamp(28px, 4vw, 44px);
          font-weight: 700;
          letter-spacing: -0.03em;
          line-height: 1.1;
          margin-bottom: 16px;
        }
        .section-sub {
          font-size: 17px;
          color: #8892B0;
          max-width: 520px;
          line-height: 1.7;
        }

        /* ── PILLARS GRID ── */
        .pillars-header { text-align: center; margin-bottom: 64px; }
        .pillars-header .section-sub { margin: 0 auto; }
        .pillars-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1px;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px;
          overflow: hidden;
          margin-bottom: 1px;
        }
        .pillars-grid-bottom {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1px;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.07);
          border-top: none;
          border-radius: 0 0 16px 16px;
          overflow: hidden;
        }
        .pillar-card {
          background: #0F1628;
          padding: 32px 28px;
          transition: background 0.2s;
          cursor: default;
        }
        .pillar-card:hover { background: #192140; }
        .pillar-icon {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
          font-size: 20px;
        }
        .pillar-icon.purple { background: rgba(108,99,255,0.15); border: 1px solid rgba(108,99,255,0.35); }
        .pillar-icon.teal { background: rgba(20,184,166,0.12); border: 1px solid rgba(20,184,166,0.25); }
        .pillar-icon svg { width: 20px; height: 20px; stroke-width: 1.75; fill: none; }
        .pillar-icon.purple svg { stroke: #6C63FF; }
        .pillar-icon.teal svg { stroke: #14B8A6; }
        .pillar-num {
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          color: #4A5578;
          margin-bottom: 10px;
          letter-spacing: 0.06em;
        }
        .pillar-title {
          font-size: 17px;
          font-weight: 600;
          letter-spacing: -0.02em;
          margin-bottom: 10px;
          color: #F0F2FF;
        }
        .pillar-desc {
          font-size: 14px;
          color: #8892B0;
          line-height: 1.65;
          margin-bottom: 20px;
        }
        .pillar-tags { display: flex; flex-wrap: wrap; gap: 6px; }
        .tag {
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 4px;
          border: 1px solid rgba(255,255,255,0.08);
          color: #4A5578;
          background: rgba(255,255,255,0.03);
        }

        /* ── INTERACTIVE DEMO SECTION ── */
        .demo-section { background: #0F1628; border-top: 1px solid rgba(255,255,255,0.07); border-bottom: 1px solid rgba(255,255,255,0.07); }
        .demo-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 64px;
          align-items: center;
          max-width: 1120px;
          margin: 0 auto;
        }
        .demo-tabs {
          display: flex;
          gap: 4px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 10px;
          padding: 4px;
          margin-bottom: 24px;
        }
        .demo-tab {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 13px;
          font-weight: 600;
          padding: 8px 14px;
          border-radius: 7px;
          border: none;
          background: none;
          color: #4A5578;
          cursor: pointer;
          transition: all 0.2s;
          flex: 1;
        }
        .demo-tab.active {
          background: #6C63FF;
          color: white;
        }
        .demo-window {
          background: #131C35;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px;
          overflow: hidden;
        }
        .demo-window-bar {
          background: rgba(255,255,255,0.03);
          border-bottom: 1px solid rgba(255,255,255,0.07);
          padding: 12px 16px;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .demo-window-dots { display: flex; gap: 5px; }
        .demo-window-dots span { width: 9px; height: 9px; border-radius: 50%; background: rgba(255,255,255,0.1); }
        .demo-window-label {
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          color: #4A5578;
        }
        .demo-window-body { padding: 20px; min-height: 280px; }
        .demo-panel { display: none; }
        .demo-panel.active { display: block; }

        /* Roadmap panel */
        .roadmap-item {
          display: flex;
          gap: 14px;
          margin-bottom: 16px;
          align-items: flex-start;
        }
        .roadmap-line-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          flex-shrink: 0;
          padding-top: 2px;
        }
        .roadmap-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          border: 2px solid;
          flex-shrink: 0;
        }
        .roadmap-dot.done { background: #6C63FF; border-color: #6C63FF; }
        .roadmap-dot.active { background: transparent; border-color: #6C63FF; animation: pulse-ring 1.5s ease-in-out infinite; }
        .roadmap-dot.pending { background: transparent; border-color: #4A5578; }
        @keyframes pulse-ring {
          0%, 100% { box-shadow: 0 0 0 0 rgba(108,99,255,0.4); }
          50% { box-shadow: 0 0 0 5px rgba(108,99,255,0); }
        }
        .roadmap-connector { width: 1px; flex: 1; min-height: 14px; background: rgba(255,255,255,0.07); margin: 2px 0; }
        .roadmap-content {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 10px;
          padding: 12px 14px;
          flex: 1;
        }
        .roadmap-content.active-card { border-color: rgba(108,99,255,0.35); background: rgba(108,99,255,0.15); }
        .roadmap-label { font-size: 12px; font-weight: 600; color: #F0F2FF; margin-bottom: 4px; }
        .roadmap-detail { font-size: 11px; color: #8892B0; }
        .roadmap-progress { margin-top: 16px; }
        .progress-bar { height: 4px; background: rgba(255,255,255,0.06); border-radius: 2px; overflow: hidden; margin-top: 6px; }
        .progress-fill { height: 100%; border-radius: 2px; background: linear-gradient(90deg, #6C63FF, #14B8A6); }

        /* ATS panel */
        .ats-score-row { display: flex; align-items: center; gap: 20px; margin-bottom: 20px; }
        .ats-circle {
          width: 68px; height: 68px;
          border-radius: 50%;
          background: conic-gradient(#6C63FF 0deg, #6C63FF 313deg, rgba(255,255,255,0.06) 313deg);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          flex-shrink: 0;
        }
        .ats-circle-inner {
          width: 52px; height: 52px;
          background: #131C35;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          font-weight: 700;
          color: #F0F2FF;
        }
        .ats-info-title { font-size: 14px; font-weight: 600; margin-bottom: 4px; }
        .ats-info-sub { font-size: 12px; color: #8892B0; }
        .ats-check-list { display: flex; flex-direction: column; gap: 8px; }
        .ats-check-item { display: flex; align-items: flex-start; gap: 10px; font-size: 12px; padding: 9px 12px; border-radius: 8px; border: 1px solid; }
        .ats-check-item.pass { color: #86efac; background: rgba(34,197,94,0.07); border-color: rgba(34,197,94,0.15); }
        .ats-check-item.warn { color: #fde68a; background: rgba(245,158,11,0.07); border-color: rgba(245,158,11,0.15); }
        .ats-check-item.fail { color: #fca5a5; background: rgba(239,68,68,0.07); border-color: rgba(239,68,68,0.15); }
        .ats-check-icon { font-size: 14px; line-height: 1; flex-shrink: 0; }

        /* Mock interview panel */
        .chat-msg { margin-bottom: 12px; }
        .chat-ai-name { font-size: 11px; font-weight: 700; color: #6C63FF; margin-bottom: 5px; letter-spacing: 0.05em; text-transform: uppercase; }
        .chat-bubble {
          font-size: 12px;
          line-height: 1.65;
          padding: 12px 14px;
          border-radius: 10px;
          color: #8892B0;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
        }
        .chat-bubble.user-msg {
          background: rgba(108,99,255,0.15);
          border-color: rgba(108,99,255,0.35);
          color: #F0F2FF;
          margin-left: 20px;
        }
        .chat-score {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 600;
          color: #22C55E;
          background: rgba(34,197,94,0.08);
          border: 1px solid rgba(34,197,94,0.15);
          padding: 6px 12px;
          border-radius: 100px;
          margin-top: 10px;
        }
        .score-live { width: 7px; height: 7px; border-radius: 50%; background: #22C55E; animation: pulse-dot 1.5s ease-in-out infinite; }

        /* ── HOW IT WORKS ── */
        .hiw-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 40px;
          max-width: 1120px;
          margin: 0 auto;
          position: relative;
        }
        .hiw-grid::before {
          content: '';
          position: absolute;
          top: 22px;
          left: calc(16.66% + 16px);
          right: calc(16.66% + 16px);
          height: 1px;
          background: linear-gradient(90deg, #6C63FF, #14B8A6);
          opacity: 0.3;
          z-index: 0;
        }
        .hiw-step { position: relative; z-index: 1; }
        .hiw-num {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: #6C63FF;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 16px;
          margin-bottom: 24px;
        }
        .hiw-title { font-size: 18px; font-weight: 600; letter-spacing: -0.02em; margin-bottom: 10px; }
        .hiw-desc { font-size: 14px; color: #8892B0; line-height: 1.7; }

        /* ── TECH STACK ── */
        .stack-section { background: #0F1628; border-top: 1px solid rgba(255,255,255,0.07); border-bottom: 1px solid rgba(255,255,255,0.07); }
        .stack-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          max-width: 1120px;
          margin: 48px auto 0;
        }
        .stack-card {
          background: #131C35;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 12px;
          padding: 20px;
          transition: border-color 0.2s, background 0.2s;
        }
        .stack-card:hover { border-color: rgba(108,99,255,0.25); background: #192140; }
        .stack-layer { font-family: 'Space Mono', monospace; font-size: 10px; color: #4A5578; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 8px; }
        .stack-name { font-size: 15px; font-weight: 600; margin-bottom: 6px; }
        .stack-detail { font-size: 12px; color: #8892B0; line-height: 1.55; }

        /* ── CTA SECTION ── */
        .cta-section {
          text-align: center;
          padding: 120px 24px;
          position: relative;
          overflow: hidden;
          z-index: 1;
        }
        .cta-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 700px;
          height: 400px;
          background: radial-gradient(ellipse, rgba(108,99,255,0.12) 0%, transparent 70%);
          pointer-events: none;
        }
        .cta-section h2 {
          font-size: clamp(36px, 5vw, 60px);
          font-weight: 700;
          letter-spacing: -0.04em;
          line-height: 1.05;
          margin-bottom: 20px;
          max-width: 700px;
          margin-left: auto;
          margin-right: auto;
          position: relative;
        }
        .cta-section p {
          font-size: 17px;
          color: #8892B0;
          max-width: 460px;
          margin: 0 auto 40px;
          position: relative;
        }
        .cta-buttons { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; position: relative; }

        /* ── FOOTER ── */
        .landing-footer {
          border-top: 1px solid rgba(255,255,255,0.07);
          padding: 40px 24px;
          position: relative;
          z-index: 1;
        }
        .footer-inner {
          max-width: 1120px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          flex-wrap: wrap;
        }
        .footer-links { display: flex; gap: 24px; }
        .footer-links a { font-size: 13px; color: #4A5578; text-decoration: none; transition: color 0.2s; }
        .footer-links a:hover { color: #8892B0; }
        .footer-copy { font-size: 13px; color: #4A5578; }

        /* ── ANIMATIONS ── */
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fade-up 0.6s ease forwards; }
        .fade-up-1 { animation-delay: 0.1s; opacity: 0; }
        .fade-up-2 { animation-delay: 0.2s; opacity: 0; }
        .fade-up-3 { animation-delay: 0.3s; opacity: 0; }
        .fade-up-4 { animation-delay: 0.4s; opacity: 0; }

        /* ── RESPONSIVE ── */
        @media (max-width: 900px) {
          .nav-links { display: none; }
          .pillars-grid { grid-template-columns: 1fr; }
          .pillars-grid-bottom { grid-template-columns: 1fr; }
          .demo-layout { grid-template-columns: 1fr; gap: 40px; }
          .hiw-grid { grid-template-columns: 1fr; }
          .hiw-grid::before { display: none; }
          .stat-item { border-right: none; border-bottom: 1px solid rgba(255,255,255,0.07); }
          .stat-item:last-child { border-bottom: none; }
          .stats-inner { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 600px) {
          .hero { padding: 60px 16px 60px; }
          .hero-ctas { flex-direction: column; align-items: stretch; }
          .btn-hero-primary, .btn-hero-secondary { text-align: center; justify-content: center; }
          .stats-inner { grid-template-columns: 1fr; }
          .cta-buttons { flex-direction: column; align-items: center; }
        }
      `}</style>

      <div className="bg-blob bg-blob-1"></div>
      <div className="bg-blob bg-blob-2"></div>
      <div className="bg-blob bg-blob-3"></div>

      {/* ── NAV ── */}
      <nav className="landing-nav">
        <div className="nav-inner">
          <Link className="logo" to="#">
            <div className="logo-mark">
              <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/>
                <rect x="9" y="3" width="6" height="4" rx="2"/>
                <path d="M9 12h6M9 16h4"/>
              </svg>
            </div>
            <span className="logo-text">AI <span>CareerOS</span></span>
          </Link>
          <div className="nav-links">
            <a href="#pillars">Ecosystem</a>
            <a href="#demo">Features</a>
            <a href="#how-it-works">How it works</a>
            <a href="https://github.com/AnishaPaturi/CareerPilot-AI" target="_blank" rel="noreferrer">GitHub ↗</a>
          </div>
          <div className="nav-ctas">
            <Link className="btn-ghost" to="/login">Log in</Link>
            <Link className="btn-primary" to="/signup">Get started free</Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="hero">
        <div className="container" style={{ maxWidth: '960px' }}>
          <div className="hero-eyebrow fade-up fade-up-1">
            <span className="dot"></span>
            Introducing AI CareerOS — Unified Career Ecosystem
          </div>
          <h1 className="fade-up fade-up-2">
            Your career.<br />
            <span className="line-accent">Planned.</span>
            <span className="line-teal"> Optimised.</span><br />
            Landed.
          </h1>
          <p className="hero-sub fade-up fade-up-3">
            One AI platform that handles your resume audit, DSA prep, mock interviews, placement tracking, and document learning — all in sync, all in one place.
          </p>
          <div className="hero-ctas fade-up fade-up-4">
            <Link to="/signup" className="btn-hero-primary">
              Build My CareerOS — It's Free
              <svg className="btn-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
            <a href="#demo" class="btn-hero-secondary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="5,3 19,12 5,21"/></svg>
              See it in action
            </a>
          </div>

          {/* TRAJECTORY DIAGRAM */}
          <div className="trajectory-wrapper fade-up fade-up-4">
            <div className="trajectory-bar">
              <div className="trajectory-bar-dots">
                <span className="dot-r"></span>
                <span className="dot-a"></span>
                <span className="dot-g"></span>
              </div>
              <span className="trajectory-bar-title">career_trajectory.careeros</span>
              <span className="trajectory-bar-badge">● 5 modules active</span>
            </div>
            <div className="trajectory-svg-container">
              <svg viewBox="0 0 800 200" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto', display: 'block' }}>
                <defs>
                  <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                    <polygon points="0 0, 8 3, 0 6" fill="rgba(108,99,255,0.5)"/>
                  </marker>
                  <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" style={{ stopColor: '#6C63FF', stopOpacity: 0.5 }}/>
                    <stop offset="100%" style={{ stopColor: '#14B8A6', stopOpacity: 0.5 }}/>
                  </linearGradient>
                </defs>

                {/* Connecting lines */}
                <path d="M 100,100 C 145,100 155,60 200,60" stroke="url(#lineGrad)" strokeWidth="1.5" fill="none" strokeDasharray="4,3" markerEnd="url(#arrowhead)"/>
                <path d="M 220,60 C 280,60 290,60 340,60" stroke="url(#lineGrad)" stroke-width="1.5" fill="none" strokeDasharray="4,3" markerEnd="url(#arrowhead)"/>
                <path d="M 360,60 C 405,60 415,100 460,100" stroke="url(#lineGrad)" stroke-width="1.5" fill="none" strokeDasharray="4,3" markerEnd="url(#arrowhead)"/>
                <path d="M 480,100 C 525,100 535,140 580,140" stroke="url(#lineGrad)" stroke-width="1.5" fill="none" strokeDasharray="4,3" markerEnd="url(#arrowhead)"/>
                <path d="M 610,140 C 660,140 670,100 710,100" stroke="url(#lineGrad)" stroke-width="1.5" fill="none" strokeDasharray="4,3" markerEnd="url(#arrowhead)"/>

                {/* Node: Start */}
                <circle cx="80" cy="100" r="22" fill="rgba(108,99,255,0.12)" stroke="rgba(108,99,255,0.4)" strokeWidth="1.5"/>
                <text x="80" y="96" textAnchor="middle" fontFamily="Space Grotesk,sans-serif" fontSize="8" fill="#A5A0FF" fontWeight="600">YOU</text>
                <text x="80" y="107" textAnchor="middle" fontFamily="Space Grotesk,sans-serif" fontSize="7" fill="rgba(165,160,255,0.6)">START</text>

                {/* Node 1: AlgoMentor DSA */}
                <rect x="182" y="38" width="56" height="44" rx="8" fill="rgba(108,99,255,0.1)" stroke="rgba(108,99,255,0.35)" strokeWidth="1.5"/>
                <text x="210" y="56" textAnchor="middle" fontFamily="Space Grotesk,sans-serif" fontSize="7.5" fill="#A5A0FF" fontWeight="700">AlgoMentor</text>
                <text x="210" y="68" textAnchor="middle" fontFamily="Space Grotesk,sans-serif" fontSize="6.5" fill="rgba(165,160,255,0.6)">DSA Prep</text>
                <text x="210" y="78" textAnchor="middle" fontFamily="Space Mono,monospace" fontSize="6" fill="#6C63FF">FastAPI · MySQL</text>

                {/* Node 2: Resume ATS */}
                <rect x="322" y="38" width="56" height="44" rx="8" fill="rgba(108,99,255,0.1)" stroke="rgba(108,99,255,0.35)" strokeWidth="1.5"/>
                <text x="350" y="56" textAnchor="middle" fontFamily="Space Grotesk,sans-serif" fontSize="7.5" fill="#A5A0FF" fontWeight="700">ATS Auditor</text>
                <text x="350" y="68" textAnchor="middle" fontFamily="Space Grotesk,sans-serif" fontSize="6.5" fill="rgba(165,160,255,0.6)">Resume AI</text>
                <text x="350" y="78" textAnchor="middle" fontFamily="Space Mono,monospace" fontSize="6" fill="#6C63FF">OpenRouter</text>

                {/* Node 3: Mock Interview */}
                <rect x="442" y="78" width="56" height="44" rx="8" fill="rgba(20,184,166,0.08)" stroke="rgba(20,184,166,0.3)" strokeWidth="1.5"/>
                <text x="470" y="96" textAnchor="middle" fontFamily="Space Grotesk,sans-serif" fontSize="7.5" fill="#5eead4" fontWeight="700">Mock Arena</text>
                <text x="470" y="108" textAnchor="middle" fontFamily="Space Grotesk,sans-serif" fontSize="6.5" fill="rgba(94,234,212,0.6)">AI Interview</text>
                <text x="470" y="118" textAnchor="middle" fontFamily="Space Mono,monospace" fontSize="6" fill="#14B8A6">Speech API</text>

                {/* Node 4: Document RAG */}
                <rect x="562" y="118" width="56" height="44" rx="8" fill="rgba(20,184,166,0.08)" stroke="rgba(20,184,166,0.3)" strokeWidth="1.5"/>
                <text x="590" y="136" textAnchor="middle" fontFamily="Space Grotesk,sans-serif" fontSize="7.5" fill="#5eead4" fontWeight="700">Knowledge</text>
                <text x="590" y="148" textAnchor="middle" fontFamily="Space Grotesk,sans-serif" fontSize="6.5" fill="rgba(94,234,212,0.6)">RAG · ChromaDB</text>
                <text x="590" y="158" textAnchor="middle" fontFamily="Space Mono,monospace" fontSize="6" fill="#14B8A6">LangChain</text>

                {/* Node: Placement */}
                <rect x="695" y="78" width="58" height="44" rx="8" fill="rgba(108,99,255,0.1)" stroke="rgba(108,99,255,0.35)" strokeWidth="1.5"/>
                <text x="724" y="96" textAnchor="middle" fontFamily="Space Grotesk,sans-serif" fontSize="7.5" fill="#A5A0FF" fontWeight="700">Placement</text>
                <text x="724" y="108" textAnchor="middle" fontFamily="Space Grotesk,sans-serif" fontSize="6.5" fill="rgba(165,160,255,0.6)">Drive Tracker</text>
                <text x="724" y="118" textAnchor="middle" fontFamily="Space Mono,monospace" fontSize="6" fill="#6C63FF">Spring Boot</text>

                {/* End node: Hired badge */}
                <rect x="763" y="82" width="28" height="16" rx="4" fill="rgba(34,197,94,0.15)" stroke="rgba(34,197,94,0.4)" strokeWidth="1"/>
                <text x="777" y="93" textAnchor="middle" fontFamily="Space Grotesk,sans-serif" fontSize="7" fill="#86efac" fontWeight="700">HIRED</text>

                {/* Labels below nodes */}
                <text x="210" y="98" textAnchor="middle" fontFamily="Space Mono,monospace" fontSize="5.5" fill="rgba(108,99,255,0.5)">STEP 01</text>
                <text x="350" y="98" textAnchor="middle" fontFamily="Space Mono,monospace" fontSize="5.5" fill="rgba(108,99,255,0.5)">STEP 02</text>
                <text x="470" y="138" textAnchor="middle" fontFamily="Space Mono,monospace" fontSize="5.5" fill="rgba(20,184,166,0.5)">STEP 03</text>
                <text x="590" y="178" textAnchor="middle" fontFamily="Space Mono,monospace" fontSize="5.5" fill="rgba(20,184,166,0.5)">STEP 04</text>
                <text x="724" y="138" textAnchor="middle" fontFamily="Space Mono,monospace" fontSize="5.5" fill="rgba(108,99,255,0.5)">STEP 05</text>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <div className="stats-strip">
        <div className="stats-inner">
          <div className="stat-item">
            <div className="stat-number accent">5</div>
            <div className="stat-label">Integrated AI modules</div>
          </div>
          <div className="stat-item">
            <div className="stat-number teal">87+</div>
            <div className="stat-label">ATS score improvement</div>
          </div>
          <div className="stat-item">
            <div className="stat-number accent">30-day</div>
            <div className="stat-label">Personalised DSA roadmaps</div>
          </div>
          <div className="stat-item">
            <div className="stat-number teal">∞</div>
            <div className="stat-label">Mock interviews, any role</div>
          </div>
        </div>
      </div>

      {/* ── PILLARS ── */}
      <section id="pillars">
        <div className="container">
          <div className="pillars-header">
            <div className="section-eyebrow">The Ecosystem</div>
            <h2 className="section-title">Five modules. One career command centre.</h2>
            <p className="section-sub">Stop juggling disconnected tools. CareerOS wires your entire placement journey into a single intelligent workspace.</p>
          </div>
          <div className="pillars-grid">
            <div className="pillar-card">
              <div className="pillar-icon teal">
                <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
                </svg>
              </div>
              <div className="pillar-num">MODULE 01</div>
              <div className="pillar-title">Smart Placement Backbone</div>
              <p className="pillar-desc">Track active campus drives, company registries, and application stages — with CGPA and backlog-based eligibility filtering built in. Full application lifecycle, from `APPLIED` to `SELECTED`.</p>
              <div className="pillar-tags">
                <span className="tag">Spring Boot</span>
                <span className="tag">Hibernate / JPA</span>
                <span className="tag">MySQL</span>
              </div>
            </div>
            <div className="pillar-card">
              <div className="pillar-icon teal">
                <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10,9 9,9 8,9"/>
                </svg>
              </div>
              <div className="pillar-num">MODULE 02</div>
              <div className="pillar-title">AI Resume ATS Auditor</div>
              <p className="pillar-desc">Score your resume against any live job listing. Get keyword gap analysis, STAR-method bullet rewrites, and download ATS-ready DOCX exports instantly.</p>
              <div className="pillar-tags">
                <span className="tag">OpenRouter API</span>
                <span className="tag">pdfplumber</span>
                <span className="tag">python-docx</span>
              </div>
            </div>
            <div className="pillar-card">
              <div className="pillar-icon purple">
                <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <div className="pillar-num">MODULE 03</div>
              <div className="pillar-title">AI Mock Interview Arena</div>
              <p className="pillar-desc">Simulate HR and technical rounds tailored to your target role. Speak answers via the Web Speech API and get real-time accuracy scores and transcript feedback.</p>
              <div className="pillar-tags">
                <span className="tag">Web Speech API</span>
                <span className="tag">FastAPI</span>
                <span className="tag">OpenRouter</span>
              </div>
            </div>
          </div>

          {/* Centered ecosystem row for Card 4 and 5 */}
          <div className="flex flex-col md:flex-row justify-center gap-6 items-stretch" style={{ marginTop: '1px' }}>
            {/* Card 4 */}
            <div className="pillar-card w-full md:w-[48%] rounded-bl-16 rounded-br-16 md:rounded-br-none md:rounded-bl-16 border border-t-0 border-slate-700/30">
              <div className="pillar-icon purple">
                <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 19V6l12-3v13M9 19c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm12-3c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2z"/>
                </svg>
              </div>
              <div className="pillar-num">MODULE 04</div>
              <div className="pillar-title">AlgoMentor DSA Planner</div>
              <p className="pillar-desc">Generate personalised 30-day practice roadmaps for your target company tier — MAANG, product, service, or startup. Track topic confidence and daily milestones.</p>
              <div className="pillar-tags">
                <span className="tag">FastAPI</span>
                <span className="tag">MySQL</span>
                <span className="tag">LangChain</span>
              </div>
            </div>

            {/* Card 5 */}
            <div className="pillar-card w-full md:w-[48%] rounded-br-16 rounded-bl-16 md:rounded-bl-none border border-t-0 border-slate-700/30">
              <div className="pillar-icon purple">
                <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
              </div>
              <div className="pillar-num">MODULE 05</div>
              <div className="pillar-title">Career Knowledge Assistant (RAG)</div>
              <p className="pillar-desc">Upload PDFs, textbooks, or study notes. Ask questions, generate quizzes, and compile flashcards — all powered by semantic embeddings with ChromaDB and LangChain retrieval.</p>
              <div className="pillar-tags">
                <span className="tag">ChromaDB</span>
                <span className="tag">Sentence Transformers</span>
                <span className="tag">LangChain</span>
                <span className="tag">react-pdf</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── INTERACTIVE DEMO ── */}
      <section id="demo" className="demo-section">
        <div className="container">
          <div className="demo-layout">
            <div>
              <div className="section-eyebrow">Interactive Preview</div>
              <h2 className="section-title">See what each module actually does.</h2>
              <p className="section-sub" style={{ marginBottom: '32px' }}>Pick a module and watch AI CareerOS in action — from DSA milestone planning to real ATS scoring and live mock interviews.</p>
              <div className="demo-tabs">
                <button className={`demo-tab ${activeTab === 'roadmap' ? 'active' : ''}`} onClick={() => setActiveTab('roadmap')}>DSA Roadmap</button>
                <button className={`demo-tab ${activeTab === 'ats' ? 'active' : ''}`} onClick={() => setActiveTab('ats')}>ATS Auditor</button>
                <button className={`demo-tab ${activeTab === 'mock' ? 'active' : ''}`} onClick={() => setActiveTab('mock')}>Mock Arena</button>
              </div>
              <div style={{ fontSize: '13px', color: '#8892B0', lineHeight: '1.6' }} id="demo-desc">
                {descs[activeTab]}
              </div>
            </div>

            <div className="demo-window">
              <div className="demo-window-bar">
                <div className="demo-window-dots"><span></span><span></span><span></span></div>
                <span className="demo-window-label" id="demo-window-label">{windowLabels[activeTab]}</span>
              </div>
              <div className="demo-window-body">

                {/* Roadmap Panel */}
                <div className={`demo-panel ${activeTab === 'roadmap' ? 'active' : ''}`} id="panel-roadmap">
                  <div className="roadmap-item">
                    <div className="roadmap-line-wrap">
                      <div className="roadmap-dot done"></div>
                      <div className="roadmap-connector"></div>
                    </div>
                    <div className="roadmap-content">
                      <div className="roadmap-label">Week 1 — Arrays & Hashing ✓</div>
                      <div className="roadmap-detail">Two Sum, Group Anagrams, Valid Sudoku — completed</div>
                    </div>
                  </div>
                  <div className="roadmap-item">
                    <div className="roadmap-line-wrap">
                      <div className="roadmap-dot active"></div>
                      <div className="roadmap-connector"></div>
                    </div>
                    <div className="roadmap-content active-card">
                      <div className="roadmap-label" style={{ color: '#A5A0FF' }}>Week 2 — Graphs &amp; BFS/DFS → Active</div>
                      <div className="roadmap-detail" style={{ color: 'rgba(165,160,255,0.7)' }}>Dijkstra's, Topological Sort, Number of Islands</div>
                    </div>
                  </div>
                  <div className="roadmap-item">
                    <div className="roadmap-line-wrap">
                      <div className="roadmap-dot pending"></div>
                      <div className="roadmap-connector"></div>
                    </div>
                    <div className="roadmap-content">
                      <div className="roadmap-label">Week 3 — Dynamic Programming</div>
                      <div className="roadmap-detail">Knapsack, LCS, Coin Change, Edit Distance</div>
                    </div>
                  </div>
                  <div className="roadmap-item">
                    <div className="roadmap-line-wrap">
                      <div className="roadmap-dot pending"></div>
                    </div>
                    <div className="roadmap-content">
                      <div className="roadmap-label">Week 4 — System Design Mock</div>
                      <div className="roadmap-detail">Rate limiting, distributed caching, DB sharding</div>
                    </div>
                  </div>
                  <div className="roadmap-progress">
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#4A5578' }}>
                      <span>Overall progress</span><span style={{ color: '#6C63FF' }}>Week 2 of 4</span>
                    </div>
                    <div className="progress-bar"><div className="progress-fill" style={{ width: '37%' }}></div></div>
                  </div>
                </div>

                {/* ATS Panel */}
                <div className={`demo-panel ${activeTab === 'ats' ? 'active' : ''}`} id="panel-ats">
                  <div className="ats-score-row">
                    <div className="ats-circle">
                      <div className="ats-circle-inner">87</div>
                    </div>
                    <div>
                      <div className="ats-info-title">ATS Compatibility Score</div>
                      <div className="ats-info-sub">Target: Senior Backend Engineer · Netflix</div>
                    </div>
                  </div>
                  <div className="ats-check-list">
                    <div className="ats-check-item pass">
                      <span className="ats-check-icon">✓</span>
                      <div>Contact header formatting — correct structure detected</div>
                    </div>
                    <div className="ats-check-item pass">
                      <span class="ats-check-icon">✓</span>
                      <div>Java, Spring Boot, MySQL keywords present in experience section</div>
                    </div>
                    <div className="ats-check-item warn">
                      <span class="ats-check-icon">⚠</span>
                      <div>Missing keywords: <strong>Kubernetes</strong>, <strong>AWS S3</strong> — add to skills section</div>
                    </div>
                    <div className="ats-check-item fail">
                      <span class="ats-check-icon">✕</span>
                      <div>3 experience bullets lack impact metrics — rewrite with STAR method</div>
                    </div>
                  </div>
                </div>

                {/* Mock Panel */}
                <div className={`demo-panel ${activeTab === 'mock' ? 'active' : ''}`} id="panel-mock">
                  <div className="chat-msg">
                    <div className="chat-ai-name">AI Interviewer · Backend Technical Round</div>
                    <div className="chat-bubble">Describe a scenario where optimistic locking in JPA would throw an <code style={{ background: 'rgba(255,255,255,0.08)', padding: '1px 4px', borderRadius: '3px', fontSize: '11px' }}>ObjectOptimisticLockingFailureException</code>. What is your resolution strategy?</div>
                  </div>
                  <div className="chat-msg">
                    <div className="chat-bubble user-msg">When two concurrent threads read the same DB row and both attempt an update, the first commit succeeds and increments the <code style={{ background: 'rgba(255,255,255,0.08)', padding: '1px 4px', borderRadius: '3px', fontSize: '11px' }}>@Version</code> field. The second commit detects the version mismatch and throws. I'd retry with exponential backoff using <code style={{ background: 'rgba(255,255,255,0.08)', padding: '1px 4px', borderRadius: '3px', fontSize: '11px' }}>@Retryable</code> or switch to pessimistic locking for high-contention entities.</div>
                  </div>
                  <div style={{ marginTop: '12px' }}>
                    <div className="chat-score">
                      <span className="score-live"></span>
                      Technical accuracy: 9.5 / 10 — Excellent depth, clear resolution strategy
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <div className="section-eyebrow">The Process</div>
            <h2 className="section-title">Up and running in three steps.</h2>
            <p className="section-sub" style={{ margin: '0 auto' }}>No prompt engineering required. CareerOS builds your personalised career workspace automatically from your context.</p>
          </div>
          <div className="hiw-grid">
            <div className="hiw-step">
              <div className="hiw-num">1</div>
              <h3 className="hiw-title">Paste your context</h3>
              <p className="hiw-desc">Drop in your resume, target role, or study notes. The backend automatically parses formatting, extracts skills, and maps eligibility criteria across every module.</p>
            </div>
            <div className="hiw-step">
              <div className="hiw-num" style={{ background: 'linear-gradient(135deg, #6C63FF, #14B8A6)' }}>2</div>
              <h3 className="hiw-title">AI builds your plan</h3>
              <p className="hiw-desc">FastAPI and Spring Boot co-ordinate to generate your DSA roadmap, ATS score checklist, and mock interview questions — all tailored to your target company in seconds.</p>
            </div>
            <div className="hiw-step">
              <div className="hiw-num" style={{ background: '#14B8A6' }}>3</div>
              <h3 className="hiw-title">Refine, practise, export</h3>
              <p className="hiw-desc">Complete roadmap milestones, practise mocks verbally, query your uploaded PDFs semantically, and download ATS-clean DOCX resumes — all from one dashboard.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── TECH STACK ── */}
      <section className="stack-section">
        <div className="container">
          <div className="section-eyebrow">Architecture</div>
          <h2 className="section-title">Built on production-grade infrastructure.</h2>
          <p className="section-sub">Microservices architecture with a Spring Boot gateway and a Python FastAPI AI core — designed to demonstrate startup-level system design.</p>
          <div className="stack-grid">
            <div className="stack-card">
              <div className="stack-layer">Frontend</div>
              <div className="stack-name">React + Vite</div>
              <div className="stack-detail">Dynamic dashboards, Recharts analytics, Lucide icons, Tailwind CSS responsive layouts</div>
            </div>
            <div className="stack-card">
              <div className="stack-layer">Primary Backend</div>
              <div className="stack-name">Spring Boot</div>
              <div className="stack-detail">Role-based JWT auth, Hibernate/JPA, placement tracking, REST API gateway</div>
            </div>
            <div className="stack-card">
              <div className="stack-layer">AI Services</div>
              <div className="stack-name">Python FastAPI</div>
              <div className="stack-detail">Async LLM ops, LangChain orchestration, multi-model failover via OpenRouter</div>
            </div>
            <div className="stack-card">
              <div className="stack-layer">Vector Store</div>
              <div className="stack-name">ChromaDB</div>
              <div className="stack-detail">Semantic document embeddings, RAG retrieval with Sentence Transformers</div>
            </div>
            <div className="stack-card">
              <div className="stack-layer">Database</div>
              <div className="stack-name">MySQL</div>
              <div className="stack-detail">Relational schema with 15+ tables: users, drives, resumes, DSA progress, interviews</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-section">
        <div className="cta-glow"></div>
        <h2>Ready to pilot your career?</h2>
        <p>Join students and engineers using AI CareerOS to land roles at top companies — for free.</p>
        <div className="cta-buttons">
          <Link to="/signup" className="btn-hero-primary">
            Get started — it's free
            <svg className="btn-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
          <a href="https://github.com/AnishaPaturi/CareerPilot-AI" target="_blank" rel="noreferrer" className="btn-hero-secondary">
            View on GitHub
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15,3 21,3 21,9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          </a>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="landing-footer">
        <div className="footer-inner">
          <Link className="logo" to="#" style={{ textDecoration: 'none' }}>
            <div className="logo-mark">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px' }}>
                <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/>
                <rect x="9" y="3" width="6" height="4" rx="2"/><path d="M9 12h6M9 16h4"/>
              </svg>
            </div>
            <span className="logo-text" style={{ color: '#8892B0' }}>AI <span style={{ color: '#6C63FF' }}>CareerOS</span></span>
          </Link>
          <span className="footer-copy">© 2026 CareerPilot AI · Built by Anisha Paturi</span>
          <div className="footer-links">
            <a href="https://github.com/AnishaPaturi/CareerPilot-AI" target="_blank" rel="noreferrer">GitHub</a>
            <a href="https://github.com/AnishaPaturi/CareerPilot-AI/blob/main/LICENSE" target="_blank" rel="noreferrer">License</a>
            <a href="#pillars">Ecosystem</a>
          </div>
        </div>
      </footer>

    </div>
  );
}