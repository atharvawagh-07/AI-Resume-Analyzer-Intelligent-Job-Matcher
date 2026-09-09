import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Briefcase, 
  ShieldCheck, 
  Filter, 
  Download, 
  ArrowRight, 
  Search, 
  Star, 
  CheckCircle2, 
  AlertCircle,
  FileSpreadsheet
} from 'lucide-react';
import { ResumeData, JobPosting, FormulaWeights } from '../types';
import { SAMPLE_RESUMES } from '../data/sampleResumes';
import { calculateJobMatch } from '../utils/matchingEngine';
import { analyzeAtsCompatibility } from '../utils/atsScoring';

interface RecruiterPipelineViewProps {
  currentResume: ResumeData;
  selectedJob: JobPosting;
  onSelectCandidate: (resume: ResumeData) => void;
  formulaWeights?: FormulaWeights;
  onNavigateToTab: (tab: 'overview' | 'ats' | 'jobs' | 'enhancer') => void;
}

export const RecruiterPipelineView: React.FC<RecruiterPipelineViewProps> = ({
  currentResume,
  selectedJob,
  onSelectCandidate,
  formulaWeights,
  onNavigateToTab
}) => {
  const [minAtsFilter, setMinAtsFilter] = useState<number>(70);
  const [searchTerm, setSearchTerm] = useState('');

  // Collect all available candidates (pre-loaded + currently active if custom)
  const candidatePool: ResumeData[] = useMemo(() => {
    const pool = [...SAMPLE_RESUMES];
    if (!pool.some(r => r.id === currentResume.id)) {
      pool.unshift(currentResume);
    }
    return pool;
  }, [currentResume]);

  // Compute match results for each candidate
  const rankedCandidates = useMemo(() => {
    return candidatePool
      .map((cand) => {
        const matchResult = calculateJobMatch(cand, selectedJob, formulaWeights);
        const atsResult = analyzeAtsCompatibility(cand);
        return {
          resume: cand,
          matchResult,
          atsResult,
          matchScore: matchResult.overallMatchScore,
          atsScore: atsResult.overallScore
        };
      })
      .filter(item => item.atsScore >= minAtsFilter)
      .filter(item => {
        if (!searchTerm) return true;
        const q = searchTerm.toLowerCase();
        return (
          item.resume.personalInfo.fullName.toLowerCase().includes(q) ||
          item.resume.personalInfo.title?.toLowerCase().includes(q) ||
          item.resume.skills.technical.some(s => s.name.toLowerCase().includes(q))
        );
      })
      .sort((a, b) => b.matchScore - a.matchScore);
  }, [candidatePool, selectedJob, formulaWeights, minAtsFilter, searchTerm]);

  const handleExportCsv = () => {
    const headers = 'Rank,Candidate Name,Title,Match Score,ATS Score,Years Experience,Key Matched Skills\n';
    const rows = rankedCandidates.map((c, idx) => 
      `${idx + 1},"${c.resume.personalInfo.fullName}","${c.resume.personalInfo.title || ''}",${c.matchScore}%,${c.atsScore}%,${c.resume.stats.totalExperienceYears},"${c.matchResult.matchedSkills.slice(0, 4).join('; ')}"`
    ).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Candidate_Shortlist_${selectedJob.title.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                <Users className="w-3 h-3 text-emerald-600" />
                <span>Recruiter Talent Intelligence</span>
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Multi-Candidate Ranking & ATS Threshold Filter
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 mt-1">
              Active Candidate Pipeline for: <span className="text-indigo-600">{selectedJob.title}</span>
            </h2>
            <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
              Transparent multi-factor ranking across your candidate pool. Evaluates semantic relevance, technical stack requirements, experience tenure, and ATS indexability.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCsv}
              className="px-4 py-2 bg-slate-900 text-white rounded-xl font-semibold text-xs hover:bg-slate-800 transition flex items-center gap-2 shadow-xs"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Export Shortlist CSV</span>
            </button>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <div className="flex-1 relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search candidate name, skills (e.g. Python, Kubernetes)..."
              className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <label className="text-xs font-semibold text-slate-700 whitespace-nowrap flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span>Min ATS Score:</span>
            </label>
            <select
              value={minAtsFilter}
              onChange={(e) => setMinAtsFilter(Number(e.target.value))}
              className="text-xs px-3 py-1.5 rounded-lg border border-slate-300 bg-white"
            >
              <option value={0}>All Candidates</option>
              <option value={70}>70+ (Standard)</option>
              <option value={80}>80+ (High Compatibility)</option>
              <option value={85}>85+ (Elite ATS Pass)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Candidate Pipeline Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-500 px-1">
          <span>Showing {rankedCandidates.length} candidate{rankedCandidates.length === 1 ? '' : 's'} matching criteria</span>
          <span>Sorted by Weighted Match Score</span>
        </div>

        <div className="space-y-3">
          {rankedCandidates.map((item, idx) => {
            const isCurrentlySelected = item.resume.id === currentResume.id;

            return (
              <div
                key={item.resume.id}
                className={`bg-white rounded-2xl p-5 border transition shadow-xs ${
                  isCurrentlySelected ? 'border-indigo-500 ring-2 ring-indigo-100' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Candidate Identity & Basic Stats */}
                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center justify-center shrink-0">
                      #{idx + 1}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-slate-900">
                          {item.resume.personalInfo.fullName}
                        </h3>
                        {isCurrentlySelected && (
                          <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                            Currently Active
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500">
                        {item.resume.personalInfo.title || 'Senior Software Engineer'} • {item.resume.stats.totalExperienceYears} Years Exp • {item.resume.personalInfo.location}
                      </p>

                      {/* Skills pill tags */}
                      <div className="flex flex-wrap gap-1 mt-2">
                        {item.matchResult.matchedSkills.slice(0, 5).map((sk) => (
                          <span key={sk} className="text-[10px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded">
                            ✓ {sk}
                          </span>
                        ))}
                        {item.matchResult.missingSkills.slice(0, 3).map((sk) => (
                          <span key={sk} className="text-[10px] font-medium bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded">
                            Missing: {sk}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Score Indicators & Action */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 pt-3 sm:pt-0">
                    <div className="text-center">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Job Fit</span>
                      <span className="text-xl font-black text-indigo-600">
                        {item.matchScore}%
                      </span>
                    </div>

                    <div className="text-center">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">ATS Score</span>
                      <span className="text-xl font-black text-slate-800">
                        {item.atsScore}%
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        onSelectCandidate(item.resume);
                        onNavigateToTab('overview');
                      }}
                      className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition flex items-center gap-1.5 shadow-xs"
                    >
                      <span>Review Profile</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
