import React, { useState } from 'react';
import { 
  Cpu, 
  Database, 
  Terminal, 
  Layers, 
  ShieldCheck, 
  Code2, 
  Server, 
  Play, 
  CheckCircle2, 
  Copy, 
  Check,
  Sliders,
  ExternalLink,
  RotateCcw
} from 'lucide-react';
import { FormulaWeights } from '../types';
import { DEFAULT_FORMULA_WEIGHTS } from '../utils/matchingEngine';

interface ArchitectureViewProps {
  formulaWeights?: FormulaWeights;
  onUpdateWeights?: (weights: FormulaWeights) => void;
}

export const ArchitectureView: React.FC<ArchitectureViewProps> = ({
  formulaWeights,
  onUpdateWeights
}) => {
  const [activeTab, setActiveTab] = useState<'pipeline' | 'formula' | 'api' | 'docker'>('pipeline');
  const [apiResponse, setApiResponse] = useState<string | null>(null);
  const [isCallingApi, setIsCallingApi] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Interactive weights state synced with global app weights
  const weights = formulaWeights || DEFAULT_FORMULA_WEIGHTS;

  const handleWeightChange = (key: keyof FormulaWeights, val: number) => {
    if (onUpdateWeights) {
      onUpdateWeights({ ...weights, [key]: val });
    }
  };

  const handleResetWeights = () => {
    if (onUpdateWeights) {
      onUpdateWeights(DEFAULT_FORMULA_WEIGHTS);
    }
  };

  const totalWeight = (Object.values(weights) as number[]).reduce((a: number, b: number) => a + b, 0);

  const testApiHealth = async () => {
    setIsCallingApi(true);
    try {
      const res = await fetch('/api/health');
      const data = await res.json();
      setApiResponse(JSON.stringify(data, null, 2));
    } catch (err: any) {
      setApiResponse(JSON.stringify({ error: err.message }, null, 2));
    } finally {
      setIsCallingApi(false);
    }
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                Production System Architecture
              </span>
              <span className="text-xs text-slate-500">FastAPI • PostgreSQL (pgvector) • spaCy • React</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              End-to-End Enterprise NLP Pipeline & Microservices
            </h2>
            <p className="text-xs text-slate-600 max-w-3xl leading-relaxed">
              Explore the multi-factor scoring formula, PostgreSQL schema with vector indexing, spaCy NLP pipeline stages, and live API endpoints.
            </p>
          </div>

          {/* Sub-nav */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setActiveTab('pipeline')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                activeTab === 'pipeline' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              NLP Pipeline
            </button>
            <button
              onClick={() => setActiveTab('formula')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                activeTab === 'formula' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Scoring Formula
            </button>
            <button
              onClick={() => setActiveTab('api')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                activeTab === 'api' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              API & Schema
            </button>
            <button
              onClick={() => setActiveTab('docker')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                activeTab === 'docker' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Docker & Pytest
            </button>
          </div>
        </div>
      </div>

      {/* Tab: Pipeline */}
      {activeTab === 'pipeline' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600" />
              <span>Resume PDF/DOCX Ingestion to Recommendation Pipeline</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                  Step 1: Ingestion
                </span>
                <h4 className="text-xs font-bold text-slate-900">Text Extraction & Cleaning</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Extracts raw text from PDF/DOCX. Strips non-standard formatting, normalizes unicode quotes, and separates header metadata.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                  Step 2: Section & NER
                </span>
                <h4 className="text-xs font-bold text-slate-900">Entity & Section Extraction</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  spaCy NER + Regex pipelines identify candidate contacts, company organizations, timeline dates, and degree credentials.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                  Step 3: Embeddings
                </span>
                <h4 className="text-xs font-bold text-slate-900">Sentence Transformers & Vector</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Generates dense 384-dimensional vector embeddings using <code>all-MiniLM-L6-v2</code> indexed in FAISS and PostgreSQL pgvector.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                  Step 4: Decision
                </span>
                <h4 className="text-xs font-bold text-slate-900">Matching & Recommendation</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Executes transparent 6-factor composite scoring formula with explainable reasoning, skill gap diagnostics, and Google XYZ rewrite.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Formula Simulator */}
      {activeTab === 'formula' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">Transparent Scoring Math & Dynamic Weight Customizer</h3>
                <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full">
                  Live Synced with Match Engine
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Adjust the weights below — changes immediately recalibrate candidate ranking and job match scores in real time:
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleResetWeights}
                className="px-2.5 py-1 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200 flex items-center gap-1 transition"
                title="Reset formula weights to default enterprise settings"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Defaults</span>
              </button>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                totalWeight === 100 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
              }`}>
                Total: {totalWeight}%
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex justify-between text-xs font-semibold text-slate-800">
                <span>Semantic Similarity</span>
                <span className="text-indigo-600">{weights.semantic}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={60}
                value={weights.semantic}
                onChange={(e) => handleWeightChange('semantic', Number(e.target.value))}
                className="w-full accent-indigo-600"
              />
              <span className="text-[11px] text-slate-500 block">Dense vector cosine similarity</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex justify-between text-xs font-semibold text-slate-800">
                <span>Skill Overlap</span>
                <span className="text-indigo-600">{weights.skills}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={50}
                value={weights.skills}
                onChange={(e) => handleWeightChange('skills', Number(e.target.value))}
                className="w-full accent-indigo-600"
              />
              <span className="text-[11px] text-slate-500 block">Jaccard token & taxonomy match</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex justify-between text-xs font-semibold text-slate-800">
                <span>Required Technologies</span>
                <span className="text-indigo-600">{weights.tech}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={40}
                value={weights.tech}
                onChange={(e) => handleWeightChange('tech', Number(e.target.value))}
                className="w-full accent-indigo-600"
              />
              <span className="text-[11px] text-slate-500 block">Must-have primary tech stack</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex justify-between text-xs font-semibold text-slate-800">
                <span>Experience Tenure</span>
                <span className="text-indigo-600">{weights.experience}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={40}
                value={weights.experience}
                onChange={(e) => handleWeightChange('experience', Number(e.target.value))}
                className="w-full accent-indigo-600"
              />
              <span className="text-[11px] text-slate-500 block">Candidate years vs JD requirement</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex justify-between text-xs font-semibold text-slate-800">
                <span>Education Level</span>
                <span className="text-indigo-600">{weights.education}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={20}
                value={weights.education}
                onChange={(e) => handleWeightChange('education', Number(e.target.value))}
                className="w-full accent-indigo-600"
              />
              <span className="text-[11px] text-slate-500 block">Degree credentials match</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex justify-between text-xs font-semibold text-slate-800">
                <span>Seniority Alignment</span>
                <span className="text-indigo-600">{weights.seniority}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={20}
                value={weights.seniority}
                onChange={(e) => handleWeightChange('seniority', Number(e.target.value))}
                className="w-full accent-indigo-600"
              />
              <span className="text-[11px] text-slate-500 block">Staff / Lead / Senior alignment</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab: API & Database */}
      {activeTab === 'api' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Live API Tester */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Server className="w-4 h-4 text-indigo-600" />
                <span>Live REST API Tester</span>
              </h3>
              <button
                onClick={testApiHealth}
                disabled={isCallingApi}
                className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 flex items-center gap-1.5 transition disabled:opacity-50"
              >
                <Play className="w-3 h-3" />
                <span>GET /api/health</span>
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Pings the integrated Express / Gemini server API running on Port 3000:
            </p>

            <pre className="p-4 rounded-xl bg-slate-900 text-emerald-400 font-mono text-xs overflow-x-auto min-h-[140px]">
              {apiResponse || '// Click "GET /api/health" above to test API response'}
            </pre>
          </div>

          {/* Database Schema */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Database className="w-4 h-4 text-indigo-600" />
                <span>PostgreSQL pgvector Schema</span>
              </h3>
              <button
                onClick={() => handleCopy("CREATE EXTENSION vector; CREATE TABLE resumes (id UUID, embedding vector(384));", 'sql')}
                className="text-xs text-indigo-600 font-semibold hover:underline flex items-center gap-1"
              >
                {copiedText === 'sql' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedText === 'sql' ? 'Copied' : 'Copy SQL'}</span>
              </button>
            </div>

            <pre className="p-4 rounded-xl bg-slate-900 text-slate-200 font-mono text-xs overflow-x-auto max-h-64">
{`-- Vector Cosine Similarity Search
SELECT 
    j.id, 
    j.title, 
    1 - (j.embedding <=> r.embedding) AS cosine_similarity
FROM job_postings j, resumes r
WHERE r.id = 'YOUR_RESUME_UUID'
ORDER BY cosine_similarity DESC
LIMIT 5;`}
            </pre>
          </div>
        </div>
      )}

      {/* Tab: Docker & Testing */}
      {activeTab === 'docker' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Terminal className="w-4 h-4 text-indigo-600" />
            <span>Docker Deployment & Pytest Execution</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-4 rounded-xl bg-slate-900 text-slate-200 space-y-2">
              <span className="text-indigo-400 font-bold block">// Launch Full Stack with Docker</span>
              <p className="text-emerald-400">docker-compose up --build</p>
              <span className="text-slate-500 block text-[11px] font-sans">
                Boots PostgreSQL pgvector (port 5432), FastAPI (port 8000), and React/Express (port 3000).
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 text-slate-200 space-y-2">
              <span className="text-indigo-400 font-bold block">// Run NLP & Matcher Pytest Suite</span>
              <p className="text-emerald-400">pytest tests/ -v</p>
              <span className="text-slate-500 block text-[11px] font-sans">
                Verifies TF-IDF similarity, spaCy regex entity extractors, and multi-factor scoring formula.
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
