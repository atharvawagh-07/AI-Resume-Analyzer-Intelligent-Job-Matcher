import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ResumeOverview } from './components/ResumeOverview';
import { AtsScoreCard } from './components/AtsScoreCard';
import { JobMatchingView } from './components/JobMatchingView';
import { AiBulletEnhancer } from './components/AiBulletEnhancer';
import { CareerRoadmapView } from './components/CareerRoadmapView';
import { ArchitectureView } from './components/ArchitectureView';
import { RecruiterPipelineView } from './components/RecruiterPipelineView';
import { UploadModal } from './components/UploadModal';
import { ResumeData, JobPosting, UserAccount, FormulaWeights } from './types';
import { SAMPLE_RESUMES } from './data/sampleResumes';
import { SAMPLE_JOBS } from './data/sampleJobs';
import { DEFAULT_FORMULA_WEIGHTS } from './utils/matchingEngine';

export default function App() {
  // Application State with LocalStorage Persistence
  const [activeTab, setActiveTab] = useState<'overview' | 'ats' | 'jobs' | 'enhancer' | 'roadmap' | 'architecture' | 'pipeline'>('overview');

  const [currentResume, setCurrentResume] = useState<ResumeData>(() => {
    try {
      const saved = localStorage.getItem('talentvector_active_resume');
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return SAMPLE_RESUMES[0];
  });

  const [selectedJob, setSelectedJob] = useState<JobPosting>(() => {
    try {
      const saved = localStorage.getItem('talentvector_selected_job');
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return SAMPLE_JOBS[0];
  });

  const [formulaWeights, setFormulaWeights] = useState<FormulaWeights>(() => {
    try {
      const saved = localStorage.getItem('talentvector_formula_weights');
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return DEFAULT_FORMULA_WEIGHTS;
  });

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [userAccount, setUserAccount] = useState<UserAccount>({
    id: 'user-001',
    name: 'Alex Rivera',
    email: 'alex.rivera@techdomain.io',
    role: 'candidate',
    avatarInitials: 'AR',
    resumesCount: 2,
    activeMatches: 6
  });

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('talentvector_active_resume', JSON.stringify(currentResume));
    } catch {
      // Ignore quota errors
    }
  }, [currentResume]);

  useEffect(() => {
    try {
      localStorage.setItem('talentvector_selected_job', JSON.stringify(selectedJob));
    } catch {
      // Ignore quota errors
    }
  }, [selectedJob]);

  useEffect(() => {
    try {
      localStorage.setItem('talentvector_formula_weights', JSON.stringify(formulaWeights));
    } catch {
      // Ignore quota errors
    }
  }, [formulaWeights]);

  // Handle selecting a resume
  const handleSelectResume = (resume: ResumeData) => {
    setCurrentResume(resume);
    setUserAccount(prev => ({
      ...prev,
      name: resume.personalInfo.fullName,
      email: resume.personalInfo.email || prev.email,
      avatarInitials: resume.personalInfo.fullName.split(' ').map(n => n[0]).join('').slice(0, 2)
    }));
  };

  // Live in-place bullet mutation on active resume
  const handleUpdateResumeBullet = (oldBullet: string, newBullet: string) => {
    setCurrentResume(prev => {
      const updatedExperience = prev.experience.map(exp => ({
        ...exp,
        bullets: exp.bullets.map(b => (b.trim() === oldBullet.trim() ? newBullet : b))
      }));
      return {
        ...prev,
        experience: updatedExperience,
        rawText: prev.rawText.replace(oldBullet, newBullet)
      };
    });
  };

  const handleExportResume = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col selection:bg-indigo-100 selection:text-indigo-900 print:bg-white">
      {/* Top Application Header */}
      <div className="print:hidden">
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          currentResume={currentResume}
          onOpenUpload={() => setIsUploadModalOpen(true)}
          userAccount={userAccount}
          setUserAccount={setUserAccount}
          onExportResume={handleExportResume}
        />
      </div>

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 print:p-0">
        {activeTab === 'overview' && (
          <ResumeOverview
            resume={currentResume}
            onNavigateToTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'ats' && (
          <AtsScoreCard
            resume={currentResume}
            onNavigateToTab={(tab) => setActiveTab(tab)}
            onAutoFixBullet={handleUpdateResumeBullet}
          />
        )}

        {activeTab === 'jobs' && (
          <JobMatchingView
            resume={currentResume}
            selectedJob={selectedJob}
            setSelectedJob={setSelectedJob}
            onNavigateToRoadmap={() => setActiveTab('roadmap')}
            formulaWeights={formulaWeights}
            onUpdateFormulaWeights={setFormulaWeights}
          />
        )}

        {activeTab === 'enhancer' && (
          <AiBulletEnhancer
            resume={currentResume}
            onApplyBullet={handleUpdateResumeBullet}
            onRevertBullet={handleUpdateResumeBullet}
          />
        )}

        {activeTab === 'roadmap' && (
          <CareerRoadmapView
            resume={currentResume}
            targetJob={selectedJob}
          />
        )}

        {activeTab === 'pipeline' && (
          <RecruiterPipelineView
            currentResume={currentResume}
            selectedJob={selectedJob}
            onSelectCandidate={handleSelectResume}
            formulaWeights={formulaWeights}
            onNavigateToTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'architecture' && (
          <ArchitectureView 
            formulaWeights={formulaWeights}
            onUpdateWeights={setFormulaWeights}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto py-6 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800">TalentVector Enterprise</span>
            <span>•</span>
            <span>FastAPI + spaCy + Sentence Transformers + PostgreSQL pgvector</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTab('architecture')}
              className="hover:text-indigo-600 font-medium transition"
            >
              System Architecture & Schema
            </button>
            <span>•</span>
            <span>Port 3000 (Vite/Express) & Port 8000 (FastAPI)</span>
          </div>
        </div>
      </footer>

      {/* Upload / Select Modal */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSelectResume={handleSelectResume}
        activeResumeId={currentResume.id}
      />
    </div>
  );
}
