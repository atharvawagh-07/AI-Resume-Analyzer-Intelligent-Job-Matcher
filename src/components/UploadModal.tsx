import React, { useState, useRef } from 'react';
import { X, Upload, FileText, CheckCircle2, Sparkles, ArrowRight, AlertCircle } from 'lucide-react';
import { ResumeData } from '../types';
import { SAMPLE_RESUMES } from '../data/sampleResumes';
import { parseResumeText } from '../utils/localParser';
import { extractTextFromFile } from '../utils/pdfExtractor';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectResume: (resume: ResumeData) => void;
  activeResumeId: string;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onSelectResume,
  activeResumeId
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'paste' | 'samples'>('samples');
  const [pasteText, setPasteText] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileProcess = async (file: File) => {
    setIsProcessing(true);
    setStatusMessage(`Extracting text from ${file.name} using PDF/Document reader...`);

    try {
      const text = await extractTextFromFile(file);

      if (!text || text.trim().length < 20) {
        throw new Error('Extracted text is too short or empty. Please ensure document has selectable text.');
      }

      setStatusMessage(`Running NLP entity extraction and skills classification...`);

      // Call server deep parse endpoint if available
      try {
        const res = await fetch('/api/ai/parse-resume', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ rawText: text })
        });
        if (res.ok) {
          const data = await res.json();
          if (data.parsed && data.parsed.personalInfo) {
            const parsedResume: ResumeData = {
              id: `resume-${Date.now()}`,
              fileName: file.name,
              fileSize: `${Math.round(file.size / 1024)} KB`,
              uploadDate: 'Just now',
              rawText: text,
              personalInfo: data.parsed.personalInfo,
              skills: data.parsed.skills || { technical: [], soft: [], domain: [] },
              experience: data.parsed.experience || [],
              education: data.parsed.education || [],
              projects: data.parsed.projects || [],
              certifications: data.parsed.certifications || [],
              stats: data.parsed.stats || {
                wordCount: text.split(/\s+/).length,
                readingTimeMinutes: Math.max(1, Math.round(text.split(/\s+/).length / 200)),
                totalExperienceYears: 4,
                bulletCount: 8,
                metricsCount: 5
              }
            };
            onSelectResume(parsedResume);
            setIsProcessing(false);
            onClose();
            return;
          }
        }
      } catch {
        // Fallback to local high-precision parser
      }

      // Local parser
      const parsed = parseResumeText(text, file.name);
      onSelectResume(parsed);
      setIsProcessing(false);
      onClose();
    } catch (err: any) {
      setStatusMessage(`Failed to read file: ${err?.message || 'Unsupported format'}`);
      setIsProcessing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handlePasteSubmit = () => {
    if (!pasteText.trim() || pasteText.length < 50) return;
    setIsProcessing(true);
    setStatusMessage('Analyzing pasted resume text...');
    setTimeout(() => {
      const parsed = parseResumeText(pasteText, 'Pasted_Resume_Profile.txt');
      onSelectResume(parsed);
      setIsProcessing(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-700">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Select or Upload Resume</h3>
              <p className="text-xs text-slate-500">Test with ready enterprise profiles or upload your own</p>
            </div>
          </div>
          <button
            id="close-upload-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-200 px-6 bg-white gap-6">
          <button
            id="tab-samples-btn"
            onClick={() => setActiveTab('samples')}
            className={`py-3 text-xs font-semibold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'samples'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Pre-Loaded Demo Resumes</span>
          </button>
          <button
            id="tab-upload-btn"
            onClick={() => setActiveTab('upload')}
            className={`py-3 text-xs font-semibold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'upload'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload File (PDF / DOCX / TXT)</span>
          </button>
          <button
            id="tab-paste-btn"
            onClick={() => setActiveTab('paste')}
            className={`py-3 text-xs font-semibold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'paste'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Paste Raw Text</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          {isProcessing && (
            <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl flex items-center gap-3 text-indigo-800 text-xs animate-pulse">
              <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              <span>{statusMessage}</span>
            </div>
          )}

          {activeTab === 'samples' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-500">
                Choose a pre-analyzed production resume to test semantic matching, ATS metrics, and career roadmaps immediately:
              </p>
              <div className="grid grid-cols-1 gap-3">
                {SAMPLE_RESUMES.map((sample) => {
                  const isSelected = sample.id === activeResumeId;
                  return (
                    <div
                      key={sample.id}
                      id={`sample-resume-card-${sample.id}`}
                      onClick={() => {
                        onSelectResume(sample);
                        onClose();
                      }}
                      className={`p-4 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'border-indigo-500 bg-indigo-50/50 ring-2 ring-indigo-500/20'
                          : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-indigo-100/80 text-indigo-700 flex items-center justify-center font-bold text-sm shrink-0">
                          {sample.personalInfo.fullName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-slate-900">{sample.personalInfo.fullName}</h4>
                            <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                              {sample.personalInfo.title}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                            {sample.personalInfo.location} • {sample.stats.totalExperienceYears} yrs exp • {sample.skills.technical.slice(0, 5).map(s => s.name).join(', ')}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {isSelected ? (
                          <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Active
                          </span>
                        ) : (
                          <span className="text-xs text-indigo-600 font-semibold flex items-center gap-1 hover:underline">
                            Load <ArrowRight className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'upload' && (
            <div className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.txt,.rtf"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileProcess(e.target.files[0]);
                  }
                }}
              />
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-8 text-center transition cursor-pointer flex flex-col items-center justify-center ${
                  isDragging
                    ? 'border-indigo-500 bg-indigo-50/50'
                    : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50/50'
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
                  <Upload className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-800">Drop your resume file here, or click to browse</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-sm">
                  Supports standard text-readable PDF, DOCX, TXT. Our NLP engine will extract contact details, skills, timeline, and impact metrics.
                </p>
                <span className="mt-4 px-3 py-1.5 text-xs font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
                  Browse Files
                </span>
              </div>
            </div>
          )}

          {activeTab === 'paste' && (
            <div className="space-y-3">
              <label className="block text-xs font-medium text-slate-700">
                Paste raw resume text or markdown:
              </label>
              <textarea
                id="paste-resume-textarea"
                value={pasteText}
                onChange={(e) => setPasteText(e.target.value)}
                placeholder="Paste the plain text of your resume here including contact details, experience, skills, and education..."
                rows={8}
                className="w-full text-xs font-mono p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50/50"
              />
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>{pasteText.length} characters • {pasteText.split(/\s+/).filter(Boolean).length} words</span>
                <button
                  id="submit-pasted-resume-btn"
                  onClick={handlePasteSubmit}
                  disabled={pasteText.trim().length < 50 || isProcessing}
                  className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Parse & Analyze</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
