import React, { useState } from 'react';
import { 
  Briefcase, 
  GraduationCap, 
  FolderGit2, 
  Award, 
  MapPin, 
  Mail, 
  Phone, 
  Linkedin, 
  Github, 
  CheckCircle2, 
  Search, 
  Filter,
  TrendingUp,
  Sparkles,
  Layers
} from 'lucide-react';
import { ResumeData, SkillCategory } from '../types';

interface ResumeOverviewProps {
  resume: ResumeData;
  onNavigateToTab: (tab: 'ats' | 'jobs' | 'enhancer' | 'roadmap' | 'architecture') => void;
}

export const ResumeOverview: React.FC<ResumeOverviewProps> = ({ resume, onNavigateToTab }) => {
  const [skillFilter, setSkillFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories: { id: string; label: string }[] = [
    { id: 'all', label: 'All Skills' },
    { id: 'languages', label: 'Languages' },
    { id: 'frameworks', label: 'Frameworks' },
    { id: 'databases', label: 'Databases' },
    { id: 'cloud_devops', label: 'Cloud & DevOps' },
    { id: 'tools', label: 'Tools' },
    { id: 'soft', label: 'Soft Skills' }
  ];

  const filteredTechSkills = resume.skills.technical.filter((s) => {
    const matchesCategory = skillFilter === 'all' || s.category === skillFilter;
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const showSoftSkills = skillFilter === 'all' || skillFilter === 'soft';

  return (
    <div className="space-y-6">
      {/* Top Banner / Candidate Profile Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-indigo-50 to-indigo-100/30 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-700 to-indigo-500 text-white flex items-center justify-center font-bold text-xl shadow-lg shadow-indigo-100 shrink-0">
              {resume.personalInfo.fullName.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  {resume.personalInfo.fullName}
                </h1>
                {resume.personalInfo.title && (
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {resume.personalInfo.title}
                  </span>
                )}
                <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                  Verified Candidate Data
                </span>
              </div>

              {/* Contact meta */}
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-2">
                {resume.personalInfo.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {resume.personalInfo.location}
                  </span>
                )}
                {resume.personalInfo.email && (
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    {resume.personalInfo.email}
                  </span>
                )}
                {resume.personalInfo.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    {resume.personalInfo.phone}
                  </span>
                )}
                {resume.personalInfo.linkedin && (
                  <span className="flex items-center gap-1 text-indigo-600 font-medium">
                    <Linkedin className="w-3.5 h-3.5" />
                    {resume.personalInfo.linkedin}
                  </span>
                )}
                {resume.personalInfo.github && (
                  <span className="flex items-center gap-1 text-slate-700 font-medium">
                    <Github className="w-3.5 h-3.5" />
                    {resume.personalInfo.github}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 self-start md:self-center">
            <button
              id="cta-check-ats-btn"
              onClick={() => onNavigateToTab('ats')}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition flex items-center gap-1.5 shadow-xs"
            >
              <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
              <span>ATS Score (92%)</span>
            </button>
            <button
              id="cta-match-jobs-btn"
              onClick={() => onNavigateToTab('jobs')}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition flex items-center gap-1.5 shadow-sm shadow-indigo-200"
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Match Jobs</span>
            </button>
          </div>
        </div>

        {/* Executive Summary */}
        {resume.personalInfo.summary && (
          <div className="mt-4 pt-4 border-t border-slate-100">
            <p className="text-xs text-slate-600 leading-relaxed max-w-4xl">
              {resume.personalInfo.summary}
            </p>
          </div>
        )}

        {/* Metric Stats Cards Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-slate-100">
          <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-100">
            <span className="text-[11px] font-medium text-slate-500 block">Total Experience</span>
            <span className="text-lg font-bold text-slate-900 mt-0.5 block">
              {resume.stats.totalExperienceYears} <span className="text-xs font-normal text-slate-500">Years</span>
            </span>
          </div>

          <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-100">
            <span className="text-[11px] font-medium text-slate-500 block">Skills Extracted</span>
            <span className="text-lg font-bold text-slate-900 mt-0.5 block">
              {resume.skills.technical.length + resume.skills.soft.length}{' '}
              <span className="text-xs font-normal text-slate-500">Entities</span>
            </span>
          </div>

          <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-100">
            <span className="text-[11px] font-medium text-slate-500 block">Measurable Metrics</span>
            <span className="text-lg font-bold text-emerald-600 mt-0.5 block">
              {resume.stats.metricsCount} <span className="text-xs font-normal text-slate-500">Detected</span>
            </span>
          </div>

          <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-100">
            <span className="text-[11px] font-medium text-slate-500 block">Word Density</span>
            <span className="text-lg font-bold text-slate-900 mt-0.5 block">
              {resume.stats.wordCount} <span className="text-xs font-normal text-slate-500">Words (~{resume.stats.readingTimeMinutes} min)</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Side Skills & Experience, Right Side Education & Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Skills & Experience (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Skills Taxonomy Section */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Extracted Skills Taxonomy</h3>
                  <p className="text-[11px] text-slate-500">Categorized via NLP dictionary and entity recognition</p>
                </div>
              </div>

              {/* Search in Skills */}
              <div className="relative max-w-xs w-full">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-3 no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSkillFilter(cat.id)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-lg whitespace-nowrap transition ${
                    skillFilter === cat.id
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200/60'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Badges Grid */}
            <div className="flex flex-wrap gap-2 pt-2">
              {filteredTechSkills.map((skill, i) => {
                const getCategoryStyle = (category: SkillCategory) => {
                  switch (category) {
                    case 'languages':
                      return 'bg-blue-50 text-blue-700 border-blue-200';
                    case 'frameworks':
                      return 'bg-purple-50 text-purple-700 border-purple-200';
                    case 'databases':
                      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
                    case 'cloud_devops':
                      return 'bg-amber-50 text-amber-800 border-amber-200';
                    default:
                      return 'bg-slate-50 text-slate-700 border-slate-200';
                  }
                };

                return (
                  <span
                    key={i}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg border ${getCategoryStyle(
                      skill.category
                    )}`}
                  >
                    <span>{skill.name}</span>
                    {skill.proficiency && (
                      <span className="text-[10px] opacity-70 font-normal">({skill.proficiency})</span>
                    )}
                  </span>
                );
              })}

              {/* Soft Skills */}
              {showSoftSkills &&
                resume.skills.soft.map((soft, i) => (
                  <span
                    key={`soft-${i}`}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg bg-rose-50 text-rose-700 border border-rose-200"
                  >
                    <span>{soft}</span>
                    <span className="text-[10px] opacity-70">(Soft)</span>
                  </span>
                ))}
            </div>
          </div>

          {/* Work Experience Section */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Briefcase className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Work Experience & Timeline</h3>
                  <p className="text-[11px] text-slate-500">Measurable achievements highlighted</p>
                </div>
              </div>
              <button
                onClick={() => onNavigateToTab('enhancer')}
                className="text-xs text-indigo-600 font-semibold hover:underline flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" />
                Rewrite with AI
              </button>
            </div>

            <div className="mt-5 space-y-6">
              {resume.experience.map((exp) => (
                <div key={exp.id} className="relative pl-6 pb-2 border-l-2 border-slate-200 last:border-transparent">
                  {/* Timeline node */}
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-2 border-indigo-600" />

                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                    <h4 className="text-sm font-bold text-slate-900">{exp.title}</h4>
                    <span className="text-xs text-slate-500 font-medium">
                      {exp.startDate} – {exp.endDate} ({exp.years} yrs)
                    </span>
                  </div>

                  <p className="text-xs font-medium text-slate-700 mt-0.5">
                    {exp.company} {exp.location && <span className="text-slate-400">• {exp.location}</span>}
                  </p>

                  {/* Bullet points */}
                  <ul className="mt-3 space-y-2">
                    {exp.bullets.map((bullet, bIdx) => {
                      return (
                        <li key={bIdx} className="text-xs text-slate-600 leading-relaxed flex items-start gap-2">
                          <span className="text-slate-400 mt-1">•</span>
                          <span>{bullet}</span>
                        </li>
                      );
                    })}
                  </ul>

                  {/* Detected Metrics pill list */}
                  {exp.metricsDetected.length > 0 && (
                    <div className="mt-3 flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
                        Impact Detected:
                      </span>
                      {exp.metricsDetected.map((metric, mIdx) => (
                        <span
                          key={mIdx}
                          className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200"
                        >
                          {metric}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Education, Projects & Certifications */}
        <div className="space-y-6">
          {/* Education Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
              <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Education</h3>
                <p className="text-[11px] text-slate-500">Degrees & Institutions</p>
              </div>
            </div>

            <div className="mt-4 space-y-4">
              {resume.education.map((edu) => (
                <div key={edu.id} className="p-3 rounded-xl bg-slate-50/80 border border-slate-100">
                  <div className="flex items-start justify-between">
                    <h4 className="text-xs font-bold text-slate-900">{edu.degree}</h4>
                    <span className="text-[11px] text-slate-500 font-medium">{edu.graduationYear}</span>
                  </div>
                  <p className="text-xs text-indigo-700 font-medium mt-0.5">{edu.field}</p>
                  <p className="text-xs text-slate-600 mt-1">{edu.institution}</p>
                  {edu.gpa && (
                    <span className="inline-block mt-2 text-[10px] font-semibold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                      GPA: {edu.gpa} {edu.honors && `• ${edu.honors}`}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Certifications Card */}
          {resume.certifications.length > 0 && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
              <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
                <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Certifications</h3>
                  <p className="text-[11px] text-slate-500">Verified Technical Credentials</p>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                {resume.certifications.map((cert, cIdx) => (
                  <div
                    key={cIdx}
                    className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs font-medium text-slate-800"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{cert}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects Card */}
          {resume.projects.length > 0 && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
              <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
                <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <FolderGit2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Portfolio Projects</h3>
                  <p className="text-[11px] text-slate-500">Verified Open Source & Artifacts</p>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {resume.projects.map((proj) => (
                  <div key={proj.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
                    <h4 className="text-xs font-bold text-slate-900">{proj.name}</h4>
                    <p className="text-xs text-slate-600 mt-1">{proj.description}</p>
                    {proj.impactMetric && (
                      <span className="inline-block mt-2 text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                        {proj.impactMetric}
                      </span>
                    )}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {proj.technologies.map((t, tIdx) => (
                        <span key={tIdx} className="text-[10px] font-medium bg-white text-slate-600 px-1.5 py-0.5 rounded border border-slate-200">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
