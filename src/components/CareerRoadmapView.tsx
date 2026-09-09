import React, { useState } from 'react';
import { 
  Compass, 
  BookOpen, 
  FolderGit2, 
  HelpCircle, 
  CheckCircle2, 
  Sparkles, 
  ChevronRight, 
  ExternalLink,
  Clock,
  Target,
  Layers,
  Award
} from 'lucide-react';
import { ResumeData, JobPosting, CareerRoadmap, InterviewPrepQuestion } from '../types';
import { generateCareerRoadmap } from '../utils/aiAssistant';

interface CareerRoadmapViewProps {
  resume: ResumeData;
  targetJob: JobPosting;
}

export const CareerRoadmapView: React.FC<CareerRoadmapViewProps> = ({ resume, targetJob }) => {
  const [activeTab, setActiveTab] = useState<'roadmap' | 'interview'>('roadmap');
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null);

  // Generate personalized roadmap
  const roadmap: CareerRoadmap = React.useMemo(() => {
    return generateCareerRoadmap(resume, targetJob);
  }, [resume, targetJob]);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                Career Co-Pilot
              </span>
              <span className="text-xs text-slate-500">
                Target Role: <strong className="text-slate-800">{targetJob.title}</strong> at {targetJob.company}
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              Personalized 12-Week Bridge Plan & Tailored Interview Drill
            </h2>
            <p className="text-xs text-slate-600 max-w-3xl leading-relaxed">
              Synthesized from your verified experience ({resume.stats.totalExperienceYears} yrs) and specific missing requirements in the job posting.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0">
            <button
              onClick={() => setActiveTab('roadmap')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 ${
                activeTab === 'roadmap'
                  ? 'bg-white text-indigo-700 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>12-Week Roadmap</span>
            </button>
            <button
              onClick={() => setActiveTab('interview')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 ${
                activeTab === 'interview'
                  ? 'bg-white text-indigo-700 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Interview Questions ({roadmap.interviewPrep.length})</span>
            </button>
          </div>
        </div>

        {/* Milestone Summary Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-slate-100">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Estimated Velocity</span>
            <span className="text-sm font-bold text-slate-900 mt-0.5 block">{roadmap.estimatedTimeToReady}</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Target Fit Gain</span>
            <span className="text-sm font-bold text-emerald-600 mt-0.5 block">+18% Expected Score</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Skill Gaps Addressed</span>
            <span className="text-sm font-bold text-slate-900 mt-0.5 block">{roadmap.keySkillGaps.length} Target Skills</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Portfolio Deliverables</span>
            <span className="text-sm font-bold text-indigo-600 mt-0.5 block">{roadmap.milestones.length} Real Projects</span>
          </div>
        </div>
      </div>

      {/* Roadmap Tab */}
      {activeTab === 'roadmap' && (
        <div className="space-y-6">
          {roadmap.milestones.map((milestone, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
              {/* Phase header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                    0{idx + 1}
                  </span>
                  <div>
                    <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                      {milestone.phase} ({milestone.duration})
                    </span>
                    <h3 className="text-base font-bold text-slate-900">{milestone.focusArea}</h3>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap">
                  {milestone.skillsToAcquire.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="text-xs font-semibold px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-md border border-indigo-200"
                    >
                      +{skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Recommended Project & Deliverable */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                <div className="md:col-span-8 p-4 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-2">
                  <div className="flex items-center gap-2">
                    <FolderGit2 className="w-4 h-4 text-indigo-600" />
                    <h4 className="text-xs font-bold text-slate-900">{milestone.recommendedProject.title}</h4>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {milestone.recommendedProject.description}
                  </p>
                  <div className="pt-2 border-t border-slate-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <span className="text-slate-700 font-semibold">
                      Deliverable: <span className="font-normal text-slate-600">{milestone.recommendedProject.deliverable}</span>
                    </span>
                    <div className="flex items-center gap-1 flex-wrap">
                      {milestone.recommendedProject.techStack.map((tech, tIdx) => (
                        <span key={tIdx} className="text-[10px] bg-white text-slate-700 px-1.5 py-0.5 rounded border border-slate-200 font-mono">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Curated Resources */}
                <div className="md:col-span-4 p-4 rounded-xl bg-white border border-slate-200 space-y-2.5">
                  <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Curated Resources</span>
                  </span>
                  <div className="space-y-2">
                    {milestone.curatedResources.map((res, rIdx) => (
                      <div key={rIdx} className="p-2 rounded-lg bg-slate-50 border border-slate-100 text-xs">
                        <span className="font-semibold text-slate-900 block">{res.title}</span>
                        <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                          <span>{res.platform} • {res.type}</span>
                          <span className="text-indigo-600 font-medium flex items-center gap-0.5 hover:underline">
                            Open <ExternalLink className="w-2.5 h-2.5" />
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Interview Tab */}
      {activeTab === 'interview' && (
        <div className="space-y-4">
          <div className="p-4 bg-indigo-50/70 border border-indigo-200 rounded-2xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-indigo-900">Tailored Resume Cross-Examination Drill</h3>
                <p className="text-[11px] text-indigo-700">
                  Interview questions derived by comparing your exact projects against {targetJob.title} technical demands.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {roadmap.interviewPrep.map((q) => {
              const isExpanded = activeQuestionId === q.id || activeQuestionId === null;
              return (
                <div
                  key={q.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden"
                >
                  <div
                    onClick={() => setActiveQuestionId(activeQuestionId === q.id ? null : q.id)}
                    className="p-5 cursor-pointer hover:bg-slate-50/50 transition flex items-start justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                          {q.category}
                        </span>
                        <span className="text-xs text-slate-500">
                          Relevant to: {q.contextOnYourResume}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 mt-1">"{q.question}"</h4>
                    </div>
                    <span className="text-xs font-semibold text-indigo-600 whitespace-nowrap mt-1">
                      {isExpanded ? 'Hide Model Answer' : 'Reveal Answer Framework'}
                    </span>
                  </div>

                  {isExpanded && (
                    <div className="px-5 pb-5 pt-2 border-t border-slate-100 bg-slate-50/40 space-y-4 text-xs">
                      {/* Model Answer Outline */}
                      <div>
                        <span className="font-bold text-slate-800 block mb-1">
                          Model Answer Strategy ({q.idealAnswerFramework}):
                        </span>
                        <p className="text-slate-700 leading-relaxed p-3 bg-white rounded-xl border border-slate-200">
                          {q.modelAnswerOutline}
                        </p>
                      </div>

                      {/* Key Points to highlight */}
                      <div>
                        <span className="font-bold text-slate-800 block mb-1.5">
                          Critical Engineering Signals to Highlight:
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {q.keyPointsToHighlight.map((point, pIdx) => (
                            <div
                              key={pIdx}
                              className="p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-200 text-emerald-900 font-medium flex items-start gap-1.5"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                              <span>{point}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
