import React from 'react';
import { 
  FileText, 
  Briefcase, 
  Sparkles, 
  Compass, 
  Cpu, 
  Upload, 
  ShieldCheck, 
  UserCheck,
  Users,
  Printer
} from 'lucide-react';
import { ResumeData, UserAccount } from '../types';

interface HeaderProps {
  activeTab: 'overview' | 'ats' | 'jobs' | 'enhancer' | 'roadmap' | 'architecture' | 'pipeline';
  setActiveTab: (tab: 'overview' | 'ats' | 'jobs' | 'enhancer' | 'roadmap' | 'architecture' | 'pipeline') => void;
  currentResume: ResumeData;
  onOpenUpload: () => void;
  userAccount: UserAccount;
  setUserAccount: React.Dispatch<React.SetStateAction<UserAccount>>;
  onExportResume?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  currentResume,
  onOpenUpload,
  userAccount,
  setUserAccount,
  onExportResume
}) => {
  const toggleRole = () => {
    const nextRole = userAccount.role === 'candidate' ? 'recruiter' : 'candidate';
    setUserAccount(prev => ({
      ...prev,
      role: nextRole
    }));
    if (nextRole === 'recruiter') {
      setActiveTab('pipeline');
    } else if (activeTab === 'pipeline') {
      setActiveTab('overview');
    }
  };

  const navItems = [
    { id: 'overview', label: 'Resume Profile', icon: FileText },
    { id: 'ats', label: 'ATS Audit', icon: ShieldCheck },
    { id: 'jobs', label: 'Job Matching', icon: Briefcase },
    { id: 'enhancer', label: 'AI Bullet Rewriter', icon: Sparkles },
    { id: 'roadmap', label: 'Career Roadmap', icon: Compass },
    ...(userAccount.role === 'recruiter' ? [{ id: 'pipeline', label: 'Candidate Pipeline', icon: Users }] : []),
    { id: 'architecture', label: 'Architecture & APIs', icon: Cpu },
  ] as const;

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-800 flex items-center justify-center text-white shadow-md shadow-indigo-200">
              <Sparkles className="w-5 h-5 text-indigo-100" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-slate-900 tracking-tight">TalentVector</span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Enterprise
                </span>
                {userAccount.role === 'recruiter' && (
                  <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Recruiter View
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">Intelligent Resume NLP & Semantic Matching</p>
            </div>
          </div>

          {/* Center Navigation */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/80">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-tab-${item.id}`}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    isActive
                      ? 'bg-white text-indigo-700 shadow-sm border border-slate-200/60'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Area */}
          <div className="flex items-center gap-2.5">
            {/* Export button */}
            {onExportResume && (
              <button
                id="export-resume-btn"
                onClick={onExportResume}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition"
                title="Print or export formatted resume"
              >
                <Printer className="w-3.5 h-3.5 text-slate-500" />
                <span>Export</span>
              </button>
            )}

            {/* Upload Modal Trigger */}
            <button
              id="header-upload-btn"
              onClick={onOpenUpload}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100/70 border border-indigo-200 text-indigo-700 text-xs font-semibold transition"
            >
              <Upload className="w-3.5 h-3.5" />
              <span className="max-w-[130px] truncate hidden sm:inline font-semibold text-slate-800">
                {currentResume.fileName}
              </span>
              <span className="sm:hidden font-semibold">Switch</span>
            </button>

            {/* Role switch toggle */}
            <button
              id="user-role-toggle-btn"
              onClick={toggleRole}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition ${
                userAccount.role === 'recruiter'
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-semibold'
                  : 'bg-slate-100 hover:bg-slate-200/70 border-slate-200 text-slate-700'
              }`}
              title="Click to toggle between Candidate and Recruiter perspective"
            >
              <UserCheck className={`w-3.5 h-3.5 ${userAccount.role === 'recruiter' ? 'text-emerald-700' : 'text-slate-500'}`} />
              <span className="capitalize hidden lg:inline">{userAccount.role} View</span>
            </button>

            {/* User Avatar */}
            <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-xs ring-2 ring-indigo-500/20">
              {userAccount.avatarInitials}
            </div>
          </div>
        </div>

        {/* Mobile Sub-Navigation */}
        <div className="md:hidden flex items-center gap-1 overflow-x-auto py-2 border-t border-slate-100 no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium whitespace-nowrap rounded-md ${
                  isActive ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
