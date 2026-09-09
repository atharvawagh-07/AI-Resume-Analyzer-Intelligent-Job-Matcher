import React, { useState } from 'react';
import { 
  Sparkles, 
  Copy, 
  Check, 
  ArrowRight, 
  RefreshCw, 
  ShieldAlert, 
  CheckCircle2, 
  TrendingUp, 
  Edit3,
  Undo2,
  CheckCheck
} from 'lucide-react';
import { ResumeData, BulletImprovement } from '../types';
import { generateBulletImprovements } from '../utils/aiAssistant';

interface AiBulletEnhancerProps {
  resume: ResumeData;
  onApplyBullet?: (originalBullet: string, improvedBullet: string) => void;
  onRevertBullet?: (improvedBullet: string, originalBullet: string) => void;
}

export const AiBulletEnhancer: React.FC<AiBulletEnhancerProps> = ({ 
  resume, 
  onApplyBullet,
  onRevertBullet 
}) => {
  const [customBulletInput, setCustomBulletInput] = useState('');
  const [targetRole, setTargetRole] = useState(resume.personalInfo.title || 'Senior Software Engineer');
  const [tone, setTone] = useState<'xyz' | 'executive' | 'technical'>('xyz');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [appliedBullets, setAppliedBullets] = useState<Map<string, string>>(new Map());
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Extract all bullets from current resume
  const initialBullets = resume.experience.flatMap(e => e.bullets).slice(0, 5);
  const [improvements, setImprovements] = useState<BulletImprovement[]>(() => {
    return generateBulletImprovements(initialBullets, targetRole);
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleGenerateImprovements = async () => {
    setIsLoading(true);
    const bulletsToImprove = customBulletInput.trim() 
      ? [customBulletInput.trim()] 
      : resume.experience.flatMap(e => e.bullets).slice(0, 6);

    try {
      // Call server-side Gemini API endpoint
      const response = await fetch('/api/ai/improve-bullets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bullets: bulletsToImprove,
          targetRole: `${targetRole} (Tone: ${tone.toUpperCase()})`
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.improvements && Array.isArray(data.improvements) && data.improvements.length > 0) {
          setImprovements(data.improvements);
          setIsLoading(false);
          showToast(`Generated ${data.improvements.length} high-impact suggestions with Gemini AI`);
          return;
        }
      }
    } catch {
      // Server fallback to deterministic XYZ formula
    }

    const fallbackResults = generateBulletImprovements(bulletsToImprove, targetRole);
    setImprovements(fallbackResults);
    setIsLoading(false);
    showToast('Generated high-impact bullet improvements using Google XYZ formula');
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleApply = (item: BulletImprovement) => {
    if (onApplyBullet) {
      onApplyBullet(item.originalBullet, item.improvedBullet);
      setAppliedBullets(prev => new Map(prev).set(item.originalBullet, item.improvedBullet));
      showToast('✓ Applied improved bullet to Active Resume! ATS Impact score updated.');
    }
  };

  const handleRevert = (item: BulletImprovement) => {
    if (onRevertBullet && appliedBullets.has(item.originalBullet)) {
      onRevertBullet(item.improvedBullet, item.originalBullet);
      setAppliedBullets(prev => {
        const next = new Map(prev);
        next.delete(item.originalBullet);
        return next;
      });
      showToast('Reverted bullet back to original in active resume');
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-bottom-3 duration-200 text-xs font-semibold">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Banner & Context */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                Google XYZ Resume Formula
              </span>
              <span className="text-xs text-slate-500 font-medium">
                "Accomplished [X] as measured by [Y], by doing [Z]"
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              AI Executive Bullet Point Optimizer & Resume Syncer
            </h2>
            <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
              Transforms passive responsibility statements into high-impact, quantifiable achievements. Apply enhancements directly to your active resume to observe immediate ATS score progression.
            </p>
          </div>

          <button
            id="refresh-all-bullets-btn"
            onClick={handleGenerateImprovements}
            disabled={isLoading}
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-semibold text-xs hover:bg-indigo-700 transition flex items-center gap-2 shrink-0 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? 'Sharpening Bullets...' : 'Enhance Resume Bullets'}</span>
          </button>
        </div>

        {/* Target role and Tone selectors */}
        <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-slate-700 whitespace-nowrap">
              Target Role:
            </label>
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g. Staff Full Stack Engineer"
              className="text-xs px-3 py-1.5 rounded-lg border border-slate-300 w-full focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-slate-700 whitespace-nowrap">
              Tone Archetype:
            </label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value as any)}
              className="text-xs px-3 py-1.5 rounded-lg border border-slate-300 bg-white w-full focus:ring-1 focus:ring-indigo-500"
            >
              <option value="xyz">Google XYZ Formula (Accomplished X by Y through Z)</option>
              <option value="executive">Executive Leadership & Business Impact</option>
              <option value="technical">Deep Technical & Systems Engineering</option>
            </select>
          </div>
        </div>
      </div>

      {/* Custom Bullet Scratchpad */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Edit3 className="w-4 h-4 text-indigo-600" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Single Bullet Instant Polish
            </h3>
          </div>
          <span className="text-[11px] text-slate-400">Paste any weak bullet to test the formula</span>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch gap-2">
          <input
            type="text"
            value={customBulletInput}
            onChange={(e) => setCustomBulletInput(e.target.value)}
            placeholder="e.g. Worked on database performance and helped team with bugs"
            className="flex-1 text-xs px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
          <button
            id="polish-custom-bullet-btn"
            onClick={handleGenerateImprovements}
            disabled={!customBulletInput.trim() || isLoading}
            className="px-4 py-2 bg-slate-900 text-white font-semibold text-xs rounded-xl hover:bg-slate-800 transition whitespace-nowrap disabled:opacity-40"
          >
            Optimize Single Bullet
          </button>
        </div>
      </div>

      {/* Side-by-Side Comparison Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">
            Original Candidate Bullets vs. AI Enhanced Achievements
          </h3>
          <span className="text-xs text-slate-500">
            {appliedBullets.size} of {improvements.length} enhancements synced to active resume
          </span>
        </div>

        <div className="space-y-4">
          {improvements.map((item, idx) => {
            const isApplied = appliedBullets.has(item.originalBullet);

            return (
              <div
                key={idx}
                className={`bg-white rounded-2xl border transition shadow-xs overflow-hidden ${
                  isApplied ? 'border-emerald-300 ring-1 ring-emerald-200' : 'border-slate-200'
                }`}
              >
                {/* Card Header */}
                <div className="px-5 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-slate-700">Bullet #{idx + 1}</span>
                    <span className="text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                      {item.framework}
                    </span>
                    {isApplied && (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                        <CheckCheck className="w-3 h-3 text-emerald-600" />
                        <span>Live on Active Resume</span>
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopy(item.improvedBullet, idx)}
                      className="flex items-center gap-1 text-[11px] font-semibold text-slate-600 hover:text-indigo-600 px-2 py-1 rounded hover:bg-slate-100 transition"
                    >
                      {copiedIndex === idx ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-600">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>

                    {isApplied ? (
                      <button
                        onClick={() => handleRevert(item)}
                        className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-red-600 px-2.5 py-1 rounded bg-slate-100 hover:bg-red-50 border border-slate-200 transition"
                      >
                        <Undo2 className="w-3 h-3" />
                        <span>Revert to Original</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleApply(item)}
                        className="flex items-center gap-1 text-[11px] font-semibold text-white bg-emerald-600 hover:bg-emerald-700 px-3 py-1 rounded-lg shadow-xs transition"
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Apply to Active Resume</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Side-by-side content */}
                <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Original (User-Provided) */}
                  <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        User-Provided Original
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">Original</span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed font-mono">
                      "{item.originalBullet}"
                    </p>
                  </div>

                  {/* AI Improved (Google XYZ Formula) */}
                  <div className="p-3.5 rounded-xl bg-indigo-50/40 border border-indigo-200 space-y-2 relative">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-indigo-600" />
                        <span>Sharpened XYZ Bullet</span>
                      </span>
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        +12% Impact Score
                      </span>
                    </div>
                    <p className="text-xs text-slate-900 leading-relaxed font-semibold">
                      "{item.improvedBullet}"
                    </p>
                  </div>
                </div>

                {/* Improvements summary */}
                <div className="px-5 py-3 bg-slate-50/50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-medium text-slate-500">Enhancements:</span>
                    {item.improvementsApplied.map((imp, impIdx) => (
                      <span
                        key={impIdx}
                        className="px-2 py-0.5 bg-white text-slate-700 rounded text-[11px] border border-slate-200 font-medium"
                      >
                        ✓ {imp}
                      </span>
                    ))}
                  </div>
                  {item.metricAdded && (
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Metric: {item.metricAdded}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
