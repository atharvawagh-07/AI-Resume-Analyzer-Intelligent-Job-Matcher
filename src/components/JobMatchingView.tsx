import React, { useState, useMemo } from 'react';
import { 
  Briefcase, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  MapPin, 
  DollarSign, 
  ArrowRight, 
  PlusCircle, 
  HelpCircle,
  TrendingUp,
  Cpu,
  Compass,
  Link as LinkIcon,
  Loader2
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts';
import { ResumeData, JobPosting, JobMatchResult, FormulaWeights } from '../types';
import { SAMPLE_JOBS } from '../data/sampleJobs';
import { calculateJobMatch } from '../utils/matchingEngine';
import { Sliders, RefreshCw, AlertCircle, ShieldAlert } from 'lucide-react';

interface JobMatchingViewProps {
  resume: ResumeData;
  selectedJob: JobPosting;
  setSelectedJob: (job: JobPosting) => void;
  onNavigateToRoadmap: () => void;
  formulaWeights?: FormulaWeights;
  onUpdateFormulaWeights?: (weights: FormulaWeights) => void;
}

export const JobMatchingView: React.FC<JobMatchingViewProps> = ({
  resume,
  selectedJob,
  setSelectedJob,
  onNavigateToRoadmap,
  formulaWeights,
  onUpdateFormulaWeights
}) => {
  const [jobs, setJobs] = useState<JobPosting[]>(SAMPLE_JOBS);
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [isTuningWeights, setIsTuningWeights] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const [customCompany, setCustomCompany] = useState('');
  const [customSkills, setCustomSkills] = useState('');
  const [customDescription, setCustomDescription] = useState('');
  const [scrapeUrlInput, setScrapeUrlInput] = useState('');
  const [isScraping, setIsScraping] = useState(false);
  const [scrapeError, setScrapeError] = useState<string | null>(null);
  const [scrapeWarning, setScrapeWarning] = useState<string | null>(null);

  // Default weights state fallback
  const currentWeights = formulaWeights || { semantic: 35, skills: 25, tech: 15, experience: 15, education: 5, seniority: 5 };

  // Calculate current match with dynamic weights
  const matchResult: JobMatchResult = useMemo(() => {
    return calculateJobMatch(resume, selectedJob, currentWeights);
  }, [resume, selectedJob, currentWeights]);

  // Chart data for formula breakdown with dynamic percentage indicators
  const weights = currentWeights;
  const totalWeight = (weights.semantic + weights.skills + weights.tech + weights.experience + weights.education + weights.seniority) || 100;
  const pSem = Math.round((weights.semantic / totalWeight) * 100);
  const pSkill = Math.round((weights.skills / totalWeight) * 100);
  const pTech = Math.round((weights.tech / totalWeight) * 100);
  const pExp = Math.round((weights.experience / totalWeight) * 100);
  const pEdu = Math.round((weights.education / totalWeight) * 100);
  const pSen = Math.round((weights.seniority / totalWeight) * 100);

  const formulaChartData = [
    { name: `Semantic Sim (${pSem}%)`, score: matchResult.formulaBreakdown.semanticSimilarityScore, weight: pSem, color: '#4f46e5' },
    { name: `Skill Overlap (${pSkill}%)`, score: matchResult.formulaBreakdown.skillOverlapScore, weight: pSkill, color: '#0ea5e9' },
    { name: `Required Tech (${pTech}%)`, score: matchResult.formulaBreakdown.requiredTechScore, weight: pTech, color: '#10b981' },
    { name: `Experience (${pExp}%)`, score: matchResult.formulaBreakdown.experienceScore, weight: pExp, color: '#f59e0b' },
    { name: `Education (${pEdu}%)`, score: matchResult.formulaBreakdown.educationScore, weight: pEdu, color: '#8b5cf6' },
    { name: `Seniority (${pSen}%)`, score: matchResult.formulaBreakdown.seniorityScore, weight: pSen, color: '#ec4899' },
  ];

  const handleSliderChange = (key: keyof FormulaWeights, val: number) => {
    if (onUpdateFormulaWeights) {
      onUpdateFormulaWeights({
        ...currentWeights,
        [key]: val,
      });
    }
  };

  const handleResetWeights = () => {
    if (onUpdateFormulaWeights) {
      onUpdateFormulaWeights({
        semantic: 35,
        skills: 25,
        tech: 15,
        experience: 15,
        education: 5,
        seniority: 5
      });
    }
  };

  const handleScrapeJobUrl = async () => {
    if (!scrapeUrlInput.trim()) return;
    setIsScraping(true);
    setScrapeError(null);
    setScrapeWarning(null);

    try {
      const res = await fetch('/api/jobs/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: scrapeUrlInput.trim() })
      });

      if (!res.ok) {
        throw new Error(`Scraper failed with status ${res.status}`);
      }

      const data = await res.json();
      if (data.job) {
        setCustomTitle(data.job.title || '');
        setCustomCompany(data.job.company || '');
        if (Array.isArray(data.job.requiredSkills) && data.job.requiredSkills.length > 0) {
          setCustomSkills(data.job.requiredSkills.join(', '));
        } else if (Array.isArray(data.job.skills) && data.job.skills.length > 0) {
          setCustomSkills(data.job.skills.join(', '));
        }
        if (data.job.description) {
          setCustomDescription(data.job.description);
        }
      }

      if (data.blocked) {
        setScrapeWarning(data.message || 'Target portal bot detection active. Pre-filled job role & company — please paste full job description text below.');
      }
    } catch (err: any) {
      setScrapeError(err.message || 'Failed to auto-parse job URL. Please paste description manually.');
    } finally {
      setIsScraping(false);
    }
  };

  const handleAddCustomJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle.trim() || !customDescription.trim()) return;

    const skillsArray = customSkills.split(',').map(s => s.trim()).filter(Boolean);
    const newJob: JobPosting = {
      id: `custom-job-${Date.now()}`,
      title: customTitle,
      company: customCompany || 'Target Employer',
      department: 'Engineering',
      location: 'Target Location',
      workplaceType: 'Remote',
      seniority: 'Senior',
      minExperienceYears: 4,
      salaryRange: 'Competitive',
      educationRequired: 'BS in Computer Science or related',
      description: customDescription,
      requiredSkills: skillsArray.length > 0 ? skillsArray : ['TypeScript', 'System Architecture', 'Cloud Services'],
      preferredSkills: ['Leadership', 'Mentorship', 'CI/CD'],
      requiredTechnologies: skillsArray.slice(0, 3),
      responsibilities: ['Architect scalable systems and deliver production features.'],
      postedDate: 'Custom Added'
    };

    setJobs([newJob, ...jobs]);
    setSelectedJob(newJob);
    setIsCustomMode(false);
  };

  return (
    <div className="space-y-6">
      {/* Job Selector Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap pl-2">
            Target Role:
          </span>
          {jobs.map((job) => {
            const isSelected = job.id === selectedJob.id;
            return (
              <button
                key={job.id}
                id={`select-job-btn-${job.id}`}
                onClick={() => {
                  setSelectedJob(job);
                  setIsCustomMode(false);
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition flex items-center gap-2 border ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span>{job.title}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-normal ${
                  isSelected ? 'bg-indigo-700 text-indigo-100' : 'bg-slate-200 text-slate-600'
                }`}>
                  {job.company.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>

        <button
          id="custom-jd-modal-trigger-btn"
          onClick={() => setIsCustomMode(!isCustomMode)}
          className="px-3.5 py-1.5 text-xs font-semibold rounded-xl border border-dashed border-indigo-300 text-indigo-700 bg-indigo-50/50 hover:bg-indigo-50 transition flex items-center justify-center gap-1.5 shrink-0"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>{isCustomMode ? 'Cancel Custom JD' : 'Paste Custom Job'}</span>
        </button>
      </div>

      {/* Custom Job Input Form if active */}
      {isCustomMode && (
        <form onSubmit={handleAddCustomJob} className="bg-white p-6 rounded-2xl border border-indigo-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-indigo-600" />
              <span>Match Against Any Target Job Description</span>
            </h3>
            <span className="text-xs text-slate-500">Computes real-time semantic & multi-factor match</span>
          </div>

          {/* Quick Auto-Extraction from Job URL */}
          <div className="p-3.5 bg-indigo-50/50 rounded-xl border border-indigo-100 space-y-2">
            <label className="block text-xs font-semibold text-indigo-900 flex items-center gap-1.5">
              <LinkIcon className="w-3.5 h-3.5 text-indigo-600" />
              <span>Auto-Fill from Job URL (Lever, Greenhouse, LinkedIn, Career Page)</span>
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                placeholder="https://jobs.lever.co/company/job-id or company careers URL..."
                value={scrapeUrlInput}
                onChange={(e) => setScrapeUrlInput(e.target.value)}
                className="flex-1 text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white focus:ring-1 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={handleScrapeJobUrl}
                disabled={!scrapeUrlInput.trim() || isScraping}
                className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition disabled:opacity-50 shrink-0"
              >
                {isScraping ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Extracting...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Extract JD Details</span>
                  </>
                )}
              </button>
            </div>
            {scrapeError && (
              <p className="text-[11px] text-rose-600 font-medium">{scrapeError}</p>
            )}
            {scrapeWarning && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Bot Protection / Login Detected: </span>
                  <span>{scrapeWarning}</span>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Job Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Senior Backend Go Engineer"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Company / Organization</label>
              <input
                type="text"
                placeholder="e.g. OpenAI, Stripe, Google"
                value={customCompany}
                onChange={(e) => setCustomCompany(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Required Skills (comma-separated)
            </label>
            <input
              type="text"
              placeholder="e.g. Go, PostgreSQL, Distributed Systems, Docker, AWS"
              value={customSkills}
              onChange={(e) => setCustomSkills(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Full Job Description / Requirements *
            </label>
            <textarea
              required
              rows={4}
              placeholder="Paste the full job listing, responsibilities, and qualifications..."
              value={customDescription}
              onChange={(e) => setCustomDescription(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-1 focus:ring-indigo-500 font-mono"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsCustomMode(false)}
              className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Calculate Match
            </button>
          </div>
        </form>
      )}

      {/* Main Score & Job Hero */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                {selectedJob.workplaceType} • {selectedJob.seniority} Level
              </span>
              <span className="text-xs text-slate-500">Posted {selectedJob.postedDate}</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">{selectedJob.title}</h2>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
              <span className="font-semibold text-slate-800">{selectedJob.company}</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {selectedJob.location}
              </span>
              <span className="flex items-center gap-1 font-semibold text-slate-700">
                <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                {selectedJob.salaryRange}
              </span>
            </div>
            <p className="text-xs text-slate-600 max-w-3xl leading-relaxed mt-2 line-clamp-2">
              {selectedJob.description}
            </p>
          </div>

          {/* Match Score Display */}
          <div className="flex flex-col items-center lg:items-end justify-center shrink-0 p-4 bg-slate-50 rounded-2xl border border-slate-200/80 min-w-[200px]">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Composite Fit Score
            </span>
            <div className="flex items-baseline gap-1 my-1">
              <span className="text-4xl font-extrabold text-indigo-600">{matchResult.overallMatchScore}%</span>
              <span className="text-xs font-bold text-slate-400">Match</span>
            </div>
            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
              matchResult.overallMatchScore >= 85
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : matchResult.overallMatchScore >= 70
                ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                : 'bg-amber-50 text-amber-700 border border-amber-200'
            }`}>
              {matchResult.matchLevel}
            </span>

            <button
              onClick={onNavigateToRoadmap}
              className="mt-3 text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              <span>View Learning Roadmap</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Transparent Formula Breakdown & Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chart Column (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-indigo-600" />
                <span>Transparent Scoring Formula</span>
              </h3>
              <p className="text-[11px] text-slate-500">
                Formula: {pSem}% Semantic + {pSkill}% Skills + {pTech}% Tech + {pExp}% Exp + {pEdu}% Edu + {pSen}% Seniority
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsTuningWeights(!isTuningWeights)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition flex items-center gap-1.5 ${
                  isTuningWeights
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>{isTuningWeights ? 'Close Tuning' : 'Tune Weights'}</span>
              </button>
              <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded">
                Score: {matchResult.overallMatchScore}/100
              </span>
            </div>
          </div>

          {/* Inline Weight Tuning Controls */}
          {isTuningWeights && (
            <div className="p-4 bg-indigo-50/40 rounded-xl border border-indigo-100 space-y-3 animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-950 uppercase tracking-wider flex items-center gap-1">
                  <Sliders className="w-3.5 h-3.5 text-indigo-600" />
                  Live Formula Weight Customizer
                </span>
                <button
                  type="button"
                  onClick={handleResetWeights}
                  className="text-[11px] text-slate-500 hover:text-indigo-600 font-semibold flex items-center gap-1 transition"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Reset Model Defaults</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <div className="flex justify-between text-slate-700 font-medium mb-1">
                    <span>Semantic Similarity:</span>
                    <span className="font-bold text-indigo-700">{weights.semantic} pts ({pSem}%)</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={60}
                    value={weights.semantic}
                    onChange={(e) => handleSliderChange('semantic', Number(e.target.value))}
                    className="w-full accent-indigo-600"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-slate-700 font-medium mb-1">
                    <span>Skill Token Overlap:</span>
                    <span className="font-bold text-sky-700">{weights.skills} pts ({pSkill}%)</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={60}
                    value={weights.skills}
                    onChange={(e) => handleSliderChange('skills', Number(e.target.value))}
                    className="w-full accent-sky-600"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-slate-700 font-medium mb-1">
                    <span>Required Tech Stack:</span>
                    <span className="font-bold text-emerald-700">{weights.tech} pts ({pTech}%)</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={40}
                    value={weights.tech}
                    onChange={(e) => handleSliderChange('tech', Number(e.target.value))}
                    className="w-full accent-emerald-600"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-slate-700 font-medium mb-1">
                    <span>Experience Tenure:</span>
                    <span className="font-bold text-amber-700">{weights.experience} pts ({pExp}%)</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={40}
                    value={weights.experience}
                    onChange={(e) => handleSliderChange('experience', Number(e.target.value))}
                    className="w-full accent-amber-600"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-slate-700 font-medium mb-1">
                    <span>Education Fit:</span>
                    <span className="font-bold text-purple-700">{weights.education} pts ({pEdu}%)</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={20}
                    value={weights.education}
                    onChange={(e) => handleSliderChange('education', Number(e.target.value))}
                    className="w-full accent-purple-600"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-slate-700 font-medium mb-1">
                    <span>Seniority Fit:</span>
                    <span className="font-bold text-pink-700">{weights.seniority} pts ({pSen}%)</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={20}
                    value={weights.seniority}
                    onChange={(e) => handleSliderChange('seniority', Number(e.target.value))}
                    className="w-full accent-pink-600"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={formulaChartData} layout="vertical" margin={{ top: 5, right: 20, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: '#334155' }} width={120} />
                <Tooltip
                  formatter={(value: any) => [`${value}% Score`, 'Factor Component']}
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '11px' }}
                />
                <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                  {formulaChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Quick Explanation */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-center">
            <div className="p-2 bg-slate-50 rounded-lg">
              <span className="text-[10px] text-slate-400 block font-medium">Candidate Tenure</span>
              <span className="text-xs font-bold text-slate-800">
                {matchResult.experienceComparison.candidateYears} yrs
              </span>
            </div>
            <div className="p-2 bg-slate-50 rounded-lg">
              <span className="text-[10px] text-slate-400 block font-medium">Required Tenure</span>
              <span className="text-xs font-bold text-slate-800">
                {matchResult.experienceComparison.requiredYears} yrs
              </span>
            </div>
            <div className="p-2 bg-slate-50 rounded-lg">
              <span className="text-[10px] text-slate-400 block font-medium">Seniority Fit</span>
              <span className="text-xs font-bold text-emerald-600 capitalize">
                {matchResult.experienceComparison.status}
              </span>
            </div>
          </div>
        </div>

        {/* Explainable Reasoning Column (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Explainable Match Reasoning</h3>

          {/* Why You Matched */}
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Core Strengths & Alignment:</span>
            </span>
            <ul className="space-y-1 pl-5 list-disc text-xs text-slate-600">
              {matchResult.explainableReasoning.whyYouMatched.map((m, i) => (
                <li key={i}>{m}</li>
              ))}
            </ul>
          </div>

          {/* Potential Gaps */}
          {matchResult.explainableReasoning.potentialGaps.length > 0 && (
            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <span className="text-xs font-bold text-amber-800 flex items-center gap-1.5">
                <XCircle className="w-4 h-4 text-amber-600" />
                <span>Identified Keyword / Skill Gaps:</span>
              </span>
              <ul className="space-y-1 pl-5 list-disc text-xs text-slate-600">
                {matchResult.explainableReasoning.potentialGaps.map((g, i) => (
                  <li key={i}>{g}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Key Differentiators */}
          {matchResult.explainableReasoning.keyDifferentiators.length > 0 && (
            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <span className="text-xs font-bold text-indigo-800 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>Key Differentiators:</span>
              </span>
              <ul className="space-y-1 pl-5 list-disc text-xs text-slate-600">
                {matchResult.explainableReasoning.keyDifferentiators.map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Actionable Strategy */}
          <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-xl text-xs text-indigo-900">
            <span className="font-bold block mb-1">Next Actionable Step:</span>
            <p className="leading-relaxed">{matchResult.explainableReasoning.actionableAdvice}</p>
          </div>
        </div>
      </div>

      {/* Skill Overlap Matrix */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900">Skill Alignment & Gap Matrix</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Matched Skills */}
          <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Matched Skills
              </span>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                {matchResult.matchedSkills.length}
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-2">
              {matchResult.matchedSkills.map((s, i) => (
                <span key={i} className="px-2 py-1 bg-white text-emerald-800 border border-emerald-200 rounded text-xs font-medium">
                  ✓ {s}
                </span>
              ))}
            </div>
          </div>

          {/* Missing Skills */}
          <div className="p-4 bg-rose-50/50 rounded-xl border border-rose-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-800 flex items-center gap-1">
                <XCircle className="w-3.5 h-3.5 text-rose-600" /> Missing Job Skills
              </span>
              <span className="text-[11px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full">
                {matchResult.missingSkills.length}
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-2">
              {matchResult.missingSkills.length > 0 ? (
                matchResult.missingSkills.map((s, i) => (
                  <span key={i} className="px-2 py-1 bg-white text-rose-800 border border-rose-200 rounded text-xs font-medium">
                    ✕ {s}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-500">100% of required skills present.</span>
              )}
            </div>
          </div>

          {/* Preferred / Bonus Skills */}
          <div className="p-4 bg-purple-50/50 rounded-xl border border-purple-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-800 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-purple-600" /> Bonus / Preferred Match
              </span>
              <span className="text-[11px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
                {matchResult.bonusSkills.length}
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-2">
              {matchResult.bonusSkills.map((s, i) => (
                <span key={i} className="px-2 py-1 bg-white text-purple-800 border border-purple-200 rounded text-xs font-medium">
                  ★ {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
