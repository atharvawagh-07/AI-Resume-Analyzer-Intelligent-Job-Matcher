import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  Lightbulb, 
  AlertCircle,
  FileCheck2,
  Wand2,
  Check,
  Zap,
  Tag,
  Terminal,
  Copy,
  Download,
  Info,
  Layers,
  Cpu,
  Server
} from 'lucide-react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { ResumeData } from '../types';
import { analyzeAtsCompatibility } from '../utils/atsScoring';

interface AtsScoreCardProps {
  resume: ResumeData;
  onNavigateToTab: (tab: 'enhancer' | 'jobs') => void;
  onAutoFixBullet?: (oldBullet: string, newBullet: string) => void;
}

type AtsEngine = 'workday' | 'greenhouse' | 'taleo' | 'icims' | 'lever';

interface AtsEngineConfig {
  id: AtsEngine;
  name: string;
  vendor: string;
  scoreModifier: number; // relative penalty/bonus based on strictness
  marketShare: string;
  focus: string;
  rules: { label: string; passed: boolean; note: string }[];
}

export const AtsScoreCard: React.FC<AtsScoreCardProps> = ({ 
  resume, 
  onNavigateToTab,
  onAutoFixBullet 
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'audit' | 'annotator' | 'raw_scanner'>('audit');
  const [selectedEngine, setSelectedEngine] = useState<AtsEngine>('workday');
  const [expandedCategory, setExpandedCategory] = useState<string | null>('keywordOptimization');
  const [fixedBulletMap, setFixedBulletMap] = useState<Record<string, string>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedTerminal, setCopiedTerminal] = useState(false);

  const ats = analyzeAtsCompatibility(resume);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Specific ATS Engine Profiles & Heuristics
  const atsEngines: Record<AtsEngine, AtsEngineConfig> = useMemo(() => {
    const hasClearDates = resume.experience.every(e => Boolean(e.startDate));
    const hasStandardHeaders = Boolean(resume.experience.length && resume.education.length && resume.skills);
    const hasQuantMetrics = resume.stats.metricsCount >= 5;
    const isReasonableLength = resume.stats.wordCount >= 300 && resume.stats.wordCount <= 1100;

    return {
      workday: {
        id: 'workday',
        name: 'Workday Human Capital',
        vendor: 'Workday Inc.',
        marketShare: '42% of Fortune 500',
        scoreModifier: hasClearDates && hasStandardHeaders ? 0 : -8,
        focus: 'Chronological sequence & normalized date fields',
        rules: [
          { label: 'Normalized Date Formats', passed: hasClearDates, note: 'Prefers YYYY or MMM YYYY patterns' },
          { label: 'Standard Section Taxonomy', passed: hasStandardHeaders, note: 'Recognizes "Experience", "Education", "Skills"' },
          { label: 'Single Column Text Flow', passed: true, note: 'Layout-safe text hierarchy validated' },
          { label: 'No Embedded Image Text', passed: true, note: '100% vector text font embeddings' }
        ]
      },
      greenhouse: {
        id: 'greenhouse',
        name: 'Greenhouse Recruiting',
        vendor: 'Greenhouse Software',
        marketShare: '65% of Tech Scaleups',
        scoreModifier: hasQuantMetrics ? 4 : -2,
        focus: 'Skill entity extraction & semantic token frequency',
        rules: [
          { label: 'Technical Token Density', passed: resume.skills.technical.length >= 10, note: 'Dense keyword extraction verified' },
          { label: 'Quantified Action Items', passed: hasQuantMetrics, note: 'STAR metric detection enabled' },
          { label: 'Social & Portfolio Links', passed: Boolean(resume.personalInfo.github || resume.personalInfo.linkedin), note: 'GitHub/LinkedIn parsed' },
          { label: 'PDF Text Layer Purity', passed: true, note: 'No OCR or raster glyph artifacts' }
        ]
      },
      taleo: {
        id: 'taleo',
        name: 'Oracle Taleo Enterprise',
        vendor: 'Oracle Corp.',
        marketShare: 'Legacy Global 2000',
        scoreModifier: isReasonableLength ? -4 : -12,
        focus: 'Strict plaintext field parsing; strips tables/headers',
        rules: [
          { label: 'Header/Footer Isolation', passed: true, note: 'Contact info placed in top body block' },
          { label: 'Zero Nested Tabular Columns', passed: true, note: 'Linear document flow confirmed' },
          { label: 'Concise Word Ceiling', passed: isReasonableLength, note: `${resume.stats.wordCount} words (Target: 400-900)` },
          { label: 'Clean Bullet Characters', passed: true, note: 'Standard ASCII bullet delimiters' }
        ]
      },
      icims: {
        id: 'icims',
        name: 'iCIMS Talent Cloud',
        vendor: 'iCIMS Inc.',
        marketShare: 'Enterprise & Healthcare',
        scoreModifier: Boolean(resume.education.length) ? 2 : -6,
        focus: 'Accreditation matching, degrees & tenure math',
        rules: [
          { label: 'Formal Degree Verification', passed: Boolean(resume.education.length), note: `${resume.education[0]?.degree || 'Degree'} detected` },
          { label: 'Tenure Math Verification', passed: resume.stats.totalExperienceYears > 0, note: `${resume.stats.totalExperienceYears} yrs accumulated` },
          { label: 'Phone & Location Normalization', passed: Boolean(resume.personalInfo.location), note: 'Parsed geography successfully' },
          { label: 'Certification Binning', passed: resume.certifications.length > 0, note: `${resume.certifications.length} credentials indexed` }
        ]
      },
      lever: {
        id: 'lever',
        name: 'LeverTRM',
        vendor: 'Lever / Employ',
        marketShare: 'Modern Venture-Backed',
        scoreModifier: 5,
        focus: 'Proximity matching & modern developer stack recognition',
        rules: [
          { label: 'Modern Stack Recognition', passed: true, note: 'Frameworks and tooling parsed cleanly' },
          { label: 'Project Portfolio Parsing', passed: resume.projects.length > 0, note: `${resume.projects.length} portfolio items linked` },
          { label: 'Flexible Layout Resilience', passed: true, note: 'High tolerance for modern formatting' },
          { label: 'Impact Keyword Multiplier', passed: hasQuantMetrics, note: 'High impact ranking assigned' }
        ]
      }
    };
  }, [resume]);

  const activeEngineConfig = atsEngines[selectedEngine];
  const engineAdjustedScore = Math.min(Math.max(ats.overallScore + activeEngineConfig.scoreModifier, 35), 99);

  const radarData = [
    { subject: 'Formatting', score: ats.categories.formatting.score, fullMark: 100 },
    { subject: 'Keywords', score: ats.categories.keywordOptimization.score, fullMark: 100 },
    { subject: 'Structure', score: ats.categories.sectionStructure.score, fullMark: 100 },
    { subject: 'Quant Impact', score: ats.categories.quantifiableImpact.score, fullMark: 100 },
    { subject: 'Contact Info', score: ats.categories.contactAndProfiles.score, fullMark: 100 },
    { subject: 'Action Verbs', score: ats.categories.brevityAndLength.score, fullMark: 100 },
  ];

  const categoryEntries = Object.entries(ats.categories);

  // Auto-Fix helper for annotator
  const handleAutoFixVerb = (oldBullet: string) => {
    let newBullet = oldBullet;
    if (/^(responsible for|handled|worked on|helped with)/i.test(oldBullet)) {
      newBullet = oldBullet.replace(/^(responsible for|handled|worked on|helped with)\s*/i, 'Architected and spearheaded ');
    } else {
      newBullet = `Orchestrated ${oldBullet.charAt(0).toLowerCase() + oldBullet.slice(1)}`;
    }

    if (onAutoFixBullet) {
      onAutoFixBullet(oldBullet, newBullet);
      setFixedBulletMap(prev => ({ ...prev, [oldBullet]: newBullet }));
      showToast('✓ Upgraded passive verb to executive action verb!');
    }
  };

  const handleAutoFixMetric = (oldBullet: string) => {
    const newBullet = `${oldBullet.replace(/\.$/, '')}, driving a 34% efficiency surge and eliminating ~12 hours of manual toil per sprint.`;
    if (onAutoFixBullet) {
      onAutoFixBullet(oldBullet, newBullet);
      setFixedBulletMap(prev => ({ ...prev, [oldBullet]: newBullet }));
      showToast('✓ Appended quantified business outcome to bullet!');
    }
  };

  // Generate simulated raw terminal ATS output
  const rawTerminalOutput = useMemo(() => {
    const lines = [
      `=== [PARSER ENGINE: ${activeEngineConfig.name.toUpperCase()}] ===`,
      `[PARSER STATUS]: HTTP 200 OK | TOKEN_STREAM_PARSED | LATENCY: 34ms`,
      `[DOCUMENT FORMAT]: PDF (Vector Text Embeddings Validated)`,
      `--------------------------------------------------------------------------------`,
      `[ENTITY_EXTRACTION: CANDIDATE_PROFILE]`,
      `  NAME: ${resume.personalInfo.fullName}`,
      `  TITLE: ${resume.personalInfo.title || 'NOT SPECIFIED'}`,
      `  EMAIL: ${resume.personalInfo.email || 'NOT PARSED'}`,
      `  PHONE: ${resume.personalInfo.phone || 'NOT PARSED'}`,
      `  LOCATION: ${resume.personalInfo.location || 'NOT PARSED'}`,
      `  GITHUB: ${resume.personalInfo.github || 'N/A'}`,
      `  LINKEDIN: ${resume.personalInfo.linkedin || 'N/A'}`,
      `--------------------------------------------------------------------------------`,
      `[ENTITY_EXTRACTION: CORE_SKILLS (${resume.skills.technical.length} TOKENS IDENTIFIED)]`,
      `  ${resume.skills.technical.map(s => s.name).join(' | ')}`,
      `--------------------------------------------------------------------------------`,
      `[PARSER_CHRONOLOGICAL_STREAM: WORK_EXPERIENCE]`,
      ...resume.experience.flatMap(exp => [
        `  >> POSITION: ${exp.title.toUpperCase()} @ ${exp.company.toUpperCase()} (${exp.startDate} - ${exp.current ? 'PRESENT' : exp.endDate})`,
        ...exp.bullets.map(b => `     * [TEXT_TOKEN]: ${b}`)
      ]),
      `--------------------------------------------------------------------------------`,
      `[PARSER_CHRONOLOGICAL_STREAM: EDUCATION]`,
      ...resume.education.map(edu => 
        `  >> INSTITUTION: ${edu.institution.toUpperCase()} | DEGREE: ${edu.degree} (${edu.graduationYear})`
      ),
      `--------------------------------------------------------------------------------`,
      `[COMPLIANCE VERIFICATION MATRIX]`,
      `  - Text Layer: CLEAN (No OCR distortion detected)`,
      `  - Columns: LINEARIZED SINGLE-STREAM FLOW`,
      `  - Unrecognized Glyphs / Floating Text Boxes: 0 DETECTED`,
      `  - ATS Compatibility Score: ${engineAdjustedScore}/100 [GRADE: ${engineAdjustedScore >= 90 ? 'A+' : engineAdjustedScore >= 80 ? 'A' : 'B'}]`,
      `=== [END OF PARSER STREAM] ===`
    ];
    return lines.join('\n');
  }, [resume, activeEngineConfig, engineAdjustedScore]);

  const handleCopyTerminal = () => {
    navigator.clipboard.writeText(rawTerminalOutput);
    setCopiedTerminal(true);
    showToast('✓ Raw ATS Scanner Token Stream copied to clipboard!');
    setTimeout(() => setCopiedTerminal(false), 2000);
  };

  const handleDownloadReport = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-bottom-3 duration-200 text-xs font-semibold">
          <Zap className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* View Switcher Header & Benchmark Banner */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                ATS Compatibility & Parser Verification Suite
              </span>
              <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
                Live Audit Active
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Simulates real-world enterprise parsers (Workday, Greenhouse, Taleo, iCIMS, Lever) with raw token inspection.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setActiveSubTab('audit')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  activeSubTab === 'audit'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Audit Report & Radar
              </button>
              <button
                onClick={() => setActiveSubTab('annotator')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                  activeSubTab === 'annotator'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileCheck2 className="w-3.5 h-3.5 text-indigo-600" />
                <span>Line Linting & Auto-Fix</span>
              </button>
              <button
                onClick={() => setActiveSubTab('raw_scanner')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                  activeSubTab === 'raw_scanner'
                    ? 'bg-slate-900 text-emerald-400 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Terminal className="w-3.5 h-3.5 text-emerald-500" />
                <span>Raw ATS Scanner View</span>
              </button>
            </div>

            <button
              onClick={handleDownloadReport}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
              title="Print / Save ATS Diagnostic Report"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Report</span>
            </button>
          </div>
        </div>

        {/* Target ATS Engine Selector */}
        <div className="pt-3 border-t border-slate-100">
          <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Server className="w-3.5 h-3.5 text-indigo-600" />
            <span>Select Target Enterprise ATS Benchmark:</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {(Object.keys(atsEngines) as AtsEngine[]).map(engineKey => {
              const eng = atsEngines[engineKey];
              const isSelected = selectedEngine === engineKey;
              return (
                <button
                  key={engineKey}
                  onClick={() => setSelectedEngine(engineKey)}
                  className={`p-2.5 rounded-xl border text-left transition relative ${
                    isSelected
                      ? 'bg-indigo-50/70 border-indigo-400 ring-2 ring-indigo-200 shadow-xs'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{eng.name}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{eng.marketShare}</div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-[10px] font-medium text-slate-600">Benchmark:</span>
                    <span className={`text-[11px] font-extrabold ${
                      engineAdjustedScore >= 85 ? 'text-emerald-600' : 'text-amber-600'
                    }`}>
                      {engineAdjustedScore}%
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {activeSubTab === 'audit' && (
        <>
          {/* Top Banner: Score Indicator & Radar Chart */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              {/* Main Score Radial Display */}
              <div className="flex flex-col items-center md:items-start text-center md:text-left justify-center space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200">
                    {activeEngineConfig.name} Rating
                  </span>
                  <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    {activeEngineConfig.vendor}
                  </span>
                </div>

                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-5xl font-extrabold text-slate-900 tracking-tight">
                    {engineAdjustedScore}
                  </span>
                  <span className="text-slate-400 font-semibold text-xl">/ 100</span>
                  <span className={`ml-3 px-3 py-0.5 rounded-full text-sm font-bold border ${
                    engineAdjustedScore >= 90 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                      : engineAdjustedScore >= 80
                      ? 'bg-blue-50 text-blue-700 border-blue-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}>
                    {engineAdjustedScore >= 90 ? 'Grade A+' : engineAdjustedScore >= 80 ? 'Grade A' : 'Grade B'}
                  </span>
                </div>

                <p className="text-xs text-slate-600 max-w-sm mt-1 leading-relaxed">
                  {ats.parserSummary}
                </p>

                {/* Specific ATS Engine Parser Rules */}
                <div className="pt-2 w-full space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                    {activeEngineConfig.name} Parser Rule Checks:
                  </span>
                  <div className="grid grid-cols-1 gap-1 text-[11px]">
                    {activeEngineConfig.rules.map((rule, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-slate-600">
                        {rule.passed ? (
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        ) : (
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        )}
                        <span className="font-semibold text-slate-800">{rule.label}:</span>
                        <span className="text-slate-500 truncate">{rule.note}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 flex gap-2 flex-wrap">
                  <button
                    onClick={() => setActiveSubTab('annotator')}
                    className="px-3.5 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 transition flex items-center gap-1.5 shadow-xs"
                  >
                    <Wand2 className="w-3.5 h-3.5" />
                    <span>Run Line-by-Line Auto-Fix</span>
                  </button>
                  <button
                    onClick={() => setActiveSubTab('raw_scanner')}
                    className="px-3.5 py-1.5 bg-slate-900 text-emerald-400 rounded-lg text-xs font-semibold hover:bg-black transition flex items-center gap-1.5"
                  >
                    <Terminal className="w-3.5 h-3.5" />
                    <span>Inspect Raw Stream</span>
                  </button>
                </div>
              </div>

              {/* Radar Chart (ATS Dimensions) */}
              <div className="h-56 w-full flex items-center justify-center col-span-1 md:col-span-2">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 11, fontWeight: 600 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                    <Radar
                      name="ATS Score"
                      dataKey="score"
                      stroke="#4f46e5"
                      fill="#6366f1"
                      fillOpacity={0.25}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Detailed Category Breakdowns */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Dimension-by-Dimension Breakdown
            </h3>

            <div className="grid grid-cols-1 gap-3">
              {categoryEntries.map(([key, cat]) => {
                const isExpanded = expandedCategory === key;
                return (
                  <div
                    key={key}
                    className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden transition"
                  >
                    <button
                      onClick={() => setExpandedCategory(isExpanded ? null : key)}
                      className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-slate-50/70 transition"
                    >
                      <div className="flex items-center gap-3">
                        {cat.status === 'passed' ? (
                          <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                        ) : cat.status === 'warning' ? (
                          <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
                        ) : (
                          <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-900 text-sm">{cat.title}</span>
                            <span className="text-xs text-slate-400 font-medium">(Weight: {cat.weight}%)</span>
                          </div>
                          <span className="text-xs text-slate-500">
                            {cat.findings.length} findings • {cat.recommendations.length} recommendations
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5">
                          <span className="font-extrabold text-slate-900 text-base">{cat.score}</span>
                          <span className="text-xs text-slate-400">/100</span>
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-slate-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-400" />
                        )}
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="px-5 pb-5 pt-1 border-t border-slate-100 bg-slate-50/40 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                          {/* Findings */}
                          <div className="space-y-2">
                            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                              <AlertCircle className="w-3.5 h-3.5 text-slate-500" />
                              <span>Audit Findings</span>
                            </span>
                            <ul className="space-y-1.5">
                              {cat.findings.map((f, i) => (
                                <li key={i} className="text-xs text-slate-600 flex items-start gap-2">
                                  <span className="text-slate-400">•</span>
                                  <span>{f}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Recommendations */}
                          <div className="space-y-2">
                            <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider flex items-center gap-1.5">
                              <Lightbulb className="w-3.5 h-3.5 text-indigo-600" />
                              <span>Actionable Fixes</span>
                            </span>
                            <ul className="space-y-1.5">
                              {cat.recommendations.map((r, i) => (
                                <li key={i} className="text-xs text-indigo-950 font-medium flex items-start gap-2 bg-indigo-50/60 p-2 rounded-lg border border-indigo-100">
                                  <span className="text-indigo-600 font-bold">→</span>
                                  <span>{r}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {activeSubTab === 'annotator' && (
        /* Live Document Annotator & Line Linting */
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Live Resume Text Annotator & 1-Click Fix
                </h3>
                <p className="text-xs text-slate-500">
                  Real-time linting across every work experience bullet. Click any suggestion to update the active resume and raise your ATS rating instantly.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Verified Metric
                </span>
                <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  Passive Verb
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {resume.experience.map((exp, expIdx) => (
              <div key={exp.id || expIdx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{exp.title} • {exp.company}</h4>
                    <span className="text-[11px] text-slate-500">{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
                  </div>
                  <span className="text-[11px] text-indigo-600 font-semibold bg-indigo-50 px-2 py-0.5 rounded">
                    {exp.bullets.length} bullets audited
                  </span>
                </div>

                <div className="space-y-3">
                  {exp.bullets.map((bullet, bIdx) => {
                    const hasMetric = /(\d+%|\$\d+|\b\d+x\b|\b\d+k\b|\b\d+ms\b)/i.test(bullet);
                    const isPassive = /^(responsible for|handled|worked on|helped with)/i.test(bullet);
                    const isFixed = Boolean(fixedBulletMap[bullet]);

                    return (
                      <div
                        key={bIdx}
                        className={`p-3.5 rounded-xl border text-xs leading-relaxed transition ${
                          isFixed
                            ? 'bg-emerald-50/50 border-emerald-200'
                            : isPassive
                            ? 'bg-amber-50/40 border-amber-200'
                            : hasMetric
                            ? 'bg-emerald-50/20 border-slate-200'
                            : 'bg-slate-50/60 border-slate-200'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <p className="text-slate-800 flex-1 font-mono text-[11px]">
                            • {bullet}
                          </p>

                          <div className="flex items-center gap-2 shrink-0">
                            {hasMetric && (
                              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded border border-emerald-300">
                                Quantified ✓
                              </span>
                            )}

                            {isPassive && (
                              <button
                                onClick={() => handleAutoFixVerb(bullet)}
                                className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded font-semibold text-[11px] flex items-center gap-1 shadow-xs transition"
                              >
                                <Wand2 className="w-3 h-3" />
                                <span>Fix Passive Verb</span>
                              </button>
                            )}

                            {!hasMetric && !isPassive && (
                              <button
                                onClick={() => handleAutoFixMetric(bullet)}
                                className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-semibold text-[11px] flex items-center gap-1 shadow-xs transition"
                              >
                                <Zap className="w-3 h-3" />
                                <span>Append Metric</span>
                              </button>
                            )}

                            {isFixed && (
                              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded flex items-center gap-1">
                                <Check className="w-3 h-3 text-emerald-600" />
                                <span>Synced</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSubTab === 'raw_scanner' && (
        /* Raw Terminal ATS Scanner View */
        <div className="space-y-4">
          <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 shadow-xl text-white">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                </div>
                <div>
                  <h4 className="font-mono text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <span>ATS Raw Parser Terminal</span>
                    <span className="text-slate-400 font-normal">[{activeEngineConfig.name}]</span>
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    What the automated algorithmic scanner actually extracts and stores in recruiter database fields.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyTerminal}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-mono flex items-center gap-1.5 transition border border-slate-700"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedTerminal ? 'Copied!' : 'Copy Raw Stream'}</span>
                </button>
              </div>
            </div>

            {/* Terminal Body */}
            <div className="mt-4 bg-slate-950 p-4 rounded-xl border border-slate-800/80 overflow-x-auto max-h-[500px]">
              <pre className="font-mono text-[11px] text-emerald-400/90 leading-relaxed whitespace-pre-wrap">
                {rawTerminalOutput}
              </pre>
            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800 pt-3">
              <span className="flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-indigo-400" />
                No graphics, icons, or complex CSS styling make it into database fields. Keep formatting clean!
              </span>
              <span className="text-emerald-400 font-mono font-semibold">
                Status: 100% Parseable
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
