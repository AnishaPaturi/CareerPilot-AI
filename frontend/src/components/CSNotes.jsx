import { useState, useMemo } from 'react';
import csNotesData from '../data/csNotesData';
import {
  Search, PanelLeft as MenuIcon, ChevronRight, ChevronLeft, ChevronRight as ChevronRightIcon,
  Brain, Cpu, Database, BrainCircuit, Blocks, Box,
  Lightbulb, Link, Lock, BookOpen,
  CloudSun, Coffee, FunctionSquare, Code2,
  Bug, Ban, GitBranch, Diamond, Fingerprint, Gavel, Hammer,
  FileSearch, Hourglass, History, Layers, Carrot, Flag, Award,
} from 'lucide-react';

const ICONS = {
  // verified in lucide-react 0.303.0
  Brain, Cpu, Database, BrainCircuit, Blocks, Box,
  Lightbulb, Link, Lock, BookOpen,
  CloudSun, Coffee, FunctionSquare, Code2,
  Bug, Ban, GitBranch, Diamond, Fingerprint, Gavel, Hammer,
  FileSearch, Hourglass, History, Layers, Carrot, Flag, Award,
};

const ICON_COLORS = {
  generativeAI: '#A32D2D',
  operatingSystems: '#185FA5',
  dbms: '#0F6E56',
  sql: '#8B6914',
  dataStructures: '#7F77DD',
  algorithms: '#BA7517',
  oops: '#D85A30',
  computerNetworks: '#533AB7',
  programmingFundamentals: '#072C53',
  'ai ml genai': '#A32D2D',
  softwareEngineering: '#5F5E5A',
  cybersecurity: '#3C3489',
  cloudDevops: '#185FA5',
  javaSE8: '#D85A30',
  daa: '#6B3FA0',
  competitiveProgramming: '#B5451B',
  python: '#3B6D11',
};

function getIcon(name) {
  return ICONS[name] || BookOpen;
}

function sectionIconColor(sectionName) {
  const key = sectionName.toLowerCase();
  return ICON_COLORS[key] ?? '#9490B8';
}

function highlightCode(code) {
  if (!code) return [];
  const lines = code.split('\n');
  const result = [];
  let inBlock = false;
  for (const line of lines) {
    const trimmed = line.trim();
    const isBlockStart = /^─{4,}\s+[\w\s]+\s+─{2,}/.test(trimmed);
    const isBlockEnd   = /^─{4,}\s*$/.test(trimmed);
    if (isBlockStart || isBlockEnd) {
      result.push({ type: 'comment', text: line });
      inBlock = isBlockStart;
      continue;
    }
    if (inBlock) {
      result.push({ type: 'comment', text: line });
      continue;
    }
    if (trimmed.startsWith('//') || trimmed.startsWith('#') || trimmed.startsWith('"') || trimmed.startsWith("'")) {
      result.push({ type: 'comment', text: line });
      continue;
    }
    if (trimmed === '') {
      result.push({ type: 'blank', text: '' });
      continue;
    }
    result.push({ type: 'code', tokens: tokenizeLine(line) });
  }
  return result;
}

function tokenizeLine(line) {
  // Pattern: longest operator first to prevent partial match
  const m = line.match(
    /^(?:@[\w.]+|"[^"\\]*(?:\\.[^"\\]*)*"|'[^'\\]*(?:\\.[^'\\]*)*'|0[xX][\da-fA-F]+|==|!=|<=|>=|\+{1,2}|-{1,2}|\*{1,2}|=>|->|:=|[a-zA-Z_]\w*|\d[\d_]*\.?\d*|[{}()\[\],.;:<>\/])/
  );
  if (!m) return [{ type: 'default', text: line }];
  const first = m[0];
  const rest  = line.slice(first.length);
  return [{ type: 'default', text: first }, ...tokenizeLine(rest)];
}

export default function CSNotes() {
  const sections = useMemo(() => Object.keys(csNotesData), []);
  const firstSection = sections[0];
  const firstTopic   = firstSection ? Object.keys(csNotesData[firstSection].topics)[0] : '';

  const [activeSection, setActiveSection] = useState(firstSection);
  const [activeTopic,   setActiveTopic]   = useState(firstTopic);
  const [search,        setSearch]        = useState('');
  const [sidebarOpen,   setSidebarOpen]   = useState(true);

  const allTopics = useMemo(() =>
    sections.flatMap(s => Object.keys(csNotesData[s].topics).map(t => ({ section: s, topic: t })))
  , [sections]);

  const searchResults = useMemo(() => {
    if (!search.trim()) return [];
    const q = search.toLowerCase();
    return allTopics
      .filter(({ topic, section }) => topic.toLowerCase().includes(q) || section.toLowerCase().includes(q))
      .slice(0, 10);
  }, [search, allTopics]);

  const currentNote = csNotesData[activeSection]?.topics?.[activeTopic];
  const topics      = activeSection ? Object.keys(csNotesData[activeSection].topics) : [];
  const topicIdx    = topics.indexOf(activeTopic);
  const prevTopic   = topicIdx > 0 ? topics[topicIdx - 1] : null;
  const nextTopic   = topicIdx < topics.length - 1 ? topics[topicIdx + 1] : null;

  const selectTopic = (section, topic) => {
    setActiveSection(section);
    setActiveTopic(topic);
    setSearch('');
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-slate-100 overflow-hidden">

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── SIDEBAR ─────────────────────────────────────── */}
      <aside
        className={`fixed lg:relative inset-y-0 left-0 z-30
          bg-slate-900/95 backdrop-blur-xl border-r border-white/[0.06]
          flex flex-col transition-transform duration-200 w-72
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Header */}
        <div className="p-4 border-b border-white/[0.06] flex items-center gap-2">
          <Brain className="text-purple-400" size={18} />
          <span className="text-white font-medium text-sm">CS Notes</span>
          <span className="text-slate-500 text-xs ml-auto">{sections.length} subjects</span>
        </div>

        {/* Search */}
        <div className="p-3 border-b border-white/[0.04]">
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => { if (e.key === 'Escape') setSearch(''); }}
              placeholder="Search topics…"
              className="w-full pl-8 pr-3 py-2 bg-white/[0.04] border border-white/[0.07] rounded-lg
                         text-slate-200 text-sm placeholder:text-slate-500 focus:outline-none
                         focus:border-purple-500/50 transition-colors"
            />
          </div>
          {searchResults.length > 0 && (
            <div className="mt-2 max-h-52 overflow-y-auto rounded-lg border border-white/[0.07] bg-slate-800/80">
              {searchResults.map(({ section, topic }) => (
                <button
                  key={`${section}::${topic}`}
                  onClick={() => selectTopic(section, topic)}
                  className="w-full text-left px-3 py-2 hover:bg-white/[0.06] transition-colors
                             border-b border-white/[0.04] last:border-b-0"
                >
                  <p className="text-slate-200 text-xs font-medium truncate">{topic}</p>
                  <p className="text-slate-500 text-[10px] truncate">{section}</p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Section / Topic List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-3">
          {sections.map(section => {
            const d  = csNotesData[section];
            const ac = sectionIconColor(section);
            const IC = getIcon(d.icon);
            const on = activeSection === section;
            return (
              <div key={section}>
                <button
                  onClick={() => setActiveSection(section)}
                  className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md
                             hover:bg-white/[0.04] transition-colors"
                >
                  <span style={{ color: ac }}><IC size={13} /></span>
                  <span className="text-[11px] font-semibold uppercase tracking-wider
                                  text-slate-400 flex-1 text-left">{section}</span>
                </button>
                {on && Object.keys(d.topics).map(t => (
                  <button
                    key={t}
                    onClick={() => selectTopic(section, t)}
                    className={`w-full text-left px-3 py-1.5 rounded-md text-xs transition-colors
                      ${activeTopic === t
                        ? 'bg-purple-600/18 text-white'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            );
          })}
        </div>
      </aside>

      {/* ── MAIN ────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Top Bar */}
        <header className="px-5 py-3.5 bg-slate-900/60 border-b border-white/[0.06]
                          flex items-center gap-3 shrink-0">
          <button
            onClick={() => setSidebarOpen(o => !o)}
            className="text-slate-400 hover:text-white transition-colors lg:hidden"
            aria-label="Toggle sidebar"
          >
            <MenuIcon size={18} />
          </button>
          <span className="text-xs text-slate-500 truncate">{activeSection}</span>
          <ChevronRight size={13} className="text-slate-600 shrink-0" />
          <span className="text-xs text-white font-medium truncate">{activeTopic}</span>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto px-6 py-5">
          {currentNote ? (() => {
            const sc = sectionIconColor(activeSection);
            const Ic = getIcon(csNotesData[activeSection].icon);
            const code = highlightCode(currentNote.example);
            return (
              <div className="max-w-4xl mx-auto">
                {/* Section badge */}
                <div className="inline-flex items-center gap-1.5 bg-white/[0.04] border border-white/[0.07]
                               rounded-full px-3 py-1 mb-4">
                  <Ic size={12} style={{ color: sc }} />
                  <span className="text-[11px] text-slate-400">{activeSection}</span>
                </div>

                {/* Title */}
                <h1 className="text-2xl font-semibold text-white mb-3">{activeTopic}</h1>

                {/* Explanation */}
                <p className="text-slate-400 leading-relaxed mb-6 text-sm">
                  {currentNote.explanation}
                </p>

                {/* Key Points */}
                {currentNote.details?.length > 0 && (
                  <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-5 mb-6
                                  border-l-[3px]" style={{ borderLeftColor: sc }}>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-3">
                      Key Points
                    </p>
                    <ul className="space-y-2">
                      {currentNote.details.map((d, i) => (
                        <li key={i} className="flex gap-2 text-slate-300 text-sm leading-relaxed">
                          <span className="shrink-0 mt-1.5" style={{ color: sc }}>
                            <span className="text-xs font-bold">●</span>
                          </span>
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Code Example */}
                {currentNote.example && (
                  <div className="mb-6">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-2">
                      Code &amp; Examples
                    </p>
                    <div className="rounded-xl bg-slate-950 border border-white/[0.07] overflow-x-auto">
                      <pre className="p-4 text-[12.5px] leading-7 text-slate-300 font-mono whitespace-pre-wrap break-words">
                        {code.map((line, i) => {
                          if (line.type === 'comment' || line.type === 'blank')
                            return <div key={i} className="text-slate-600 italic">{line.text}</div>;
                          return (
                            <div key={i}>
                              {line.tokens.map((tok, j) => (
                                <span key={j} data-lexeme={tok.type}>{tok.text}</span>
                              ))}
                            </div>
                          );
                        })}
                      </pre>
                    </div>
                  </div>
                )}

                {/* Prev / Next */}
                <div className="flex items-center justify-between border-t border-white/[0.06] pt-4 mt-10">
                  {prevTopic ? (
                    <button
                      onClick={() => { setActiveTopic(prevTopic); window.scrollTo(0, 0); }}
                      className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors text-sm"
                    >
                      <ChevronLeft size={16} /> {prevTopic}
                    </button>
                  ) : <span />}
                  {nextTopic ? (
                    <button
                      onClick={() => { setActiveTopic(nextTopic); window.scrollTo(0, 0); }}
                      className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors text-sm"
                    >
                      {nextTopic} <ChevronRightIcon size={16} />
                    </button>
                  ) : <span />}
                </div>
              </div>
            );
          })() : (
            <div className="text-slate-500 text-center mt-20">Select a topic from the sidebar.</div>
          )}
        </main>
      </div>
    </div>
  );
}
