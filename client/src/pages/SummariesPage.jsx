import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { materialService } from '../services/materialService';
import { aiService } from '../services/aiService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import {
  BookOpen,
  Sparkles,
  Copy,
  Download,
  RotateCcw,
  Check,
  AlertCircle,
  Key,
  BookMarked,
  Lightbulb,
  FileCheck,
  Layers,
  HelpCircle,
} from 'lucide-react';

export default function SummariesPage() {
  const [searchParams] = useSearchParams();
  const preselectedMaterialId = searchParams.get('materialId') || '';

  const [materials, setMaterials] = useState([]);
  const [selectedMaterialId, setSelectedMaterialId] = useState(preselectedMaterialId);
  const [rawText, setRawText] = useState('');
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const loadMaterials = async () => {
      try {
        const res = await materialService.getMaterials();
        if (res.success) {
          setMaterials(res.data.materials || []);
          if (!selectedMaterialId && res.data.materials.length > 0) {
            setSelectedMaterialId(res.data.materials[0]._id);
          }
        }
      } catch (err) {
        console.error('Failed to load materials for summary page:', err);
      }
    };
    loadMaterials();
  }, []);

  const handleGenerate = async () => {
    if (!selectedMaterialId && (!rawText || rawText.trim().length === 0)) {
      setError('Please select a study material or paste text to summarize.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const res = await aiService.generateSummary({
        materialId: selectedMaterialId || undefined,
        text: !selectedMaterialId ? rawText : undefined,
      });

      if (res.success && res.data) {
        setSummary(res.data.summary);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to generate summary.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!summary) return;
    const textToCopy = `
# STUDY SUMMARY

## Overview
${summary.overview}

## Key Concepts
${(summary.keyConcepts || []).map((c) => `### ${c.title}\n${c.description}`).join('\n\n')}

## Important Points
${(summary.importantPoints || []).map((p) => `- ${p}`).join('\n')}

## Definitions
${(summary.definitions || []).map((d) => `- **${d.term}**: ${d.definition}`).join('\n')}

## Real-World Examples
${(summary.examples || []).map((e) => `- **${e.concept}**: ${e.example}`).join('\n')}

## High-Yield Exam Points
${(summary.examPoints || []).map((p) => `- ${p}`).join('\n')}
    `.trim();

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!summary) return;
    const markdown = `# Study Summary\n\n## Overview\n${summary.overview}\n\n## Key Concepts\n${(
      summary.keyConcepts || []
    )
      .map((c) => `### ${c.title}\n${c.description}`)
      .join('\n\n')}\n\n## Important Points\n${(summary.importantPoints || [])
      .map((p) => `- ${p}`)
      .join('\n')}\n\n## High-Yield Exam Points\n${(summary.examPoints || [])
      .map((p) => `- ${p}`)
      .join('\n')}`;

    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `StudySummary_${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-alice tracking-tight flex items-center gap-2.5">
          <BookOpen className="w-7 h-7 text-salesport" />
          AI Study Summarizer
        </h1>
        <p className="text-xs sm:text-sm text-alice-muted mt-1">
          Synthesize complex documents into key concepts, precise definitions, examples, and exam-focused takeaways.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Input Selection Bar */}
      <div className="glass-card rounded-3xl p-6 border border-brand-border">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="md:col-span-8">
            <label className="block text-xs font-semibold text-alice mb-1.5">
              Select Uploaded Material
            </label>
            {materials.length > 0 ? (
              <select
                value={selectedMaterialId}
                onChange={(e) => setSelectedMaterialId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-brand-surface border border-brand-border focus:border-salesport text-alice text-xs outline-none"
              >
                {materials.map((m) => (
                  <option key={m._id} value={m._id} className="bg-brand-card text-alice">
                    {m.title} ({m.fileType.toUpperCase()})
                  </option>
                ))}
              </select>
            ) : (
              <div className="p-2.5 rounded-xl bg-brand-surface border border-brand-border text-xs text-alice-muted flex items-center justify-between">
                <span>No materials uploaded yet.</span>
                <Link to="/materials" className="text-salesport font-semibold hover:underline">
                  Upload Material
                </Link>
              </div>
            )}
          </div>

          <div className="md:col-span-4 flex items-center gap-2">
            <button
              onClick={handleGenerate}
              disabled={loading || (!selectedMaterialId && !rawText)}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-alice glow-button flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate Summary</span>
            </button>
          </div>
        </div>
      </div>

      {loading && <LoadingSpinner message="Gemini AI is analyzing concepts and compiling summary..." />}

      {/* Structured Summary Output Display */}
      {summary && !loading && (
        <div className="space-y-6">
          {/* Top Actions Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-brand-surface/70 border border-brand-border">
            <span className="text-xs font-bold text-alice flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-salesport" />
              AI Structured Summary Ready
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 rounded-xl bg-brand-surface border border-brand-border hover:border-salesport text-alice text-xs font-semibold flex items-center gap-1.5 transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>

              <button
                onClick={handleDownload}
                className="px-3 py-1.5 rounded-xl bg-brand-surface border border-brand-border hover:border-salesport text-alice text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <Download className="w-3.5 h-3.5 text-salesport" />
                <span>Export Markdown</span>
              </button>

              <button
                onClick={handleGenerate}
                className="px-3 py-1.5 rounded-xl bg-brand-surface border border-brand-border hover:border-salesport text-alice text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <RotateCcw className="w-3.5 h-3.5 text-salesport" />
                <span>Regenerate</span>
              </button>
            </div>
          </div>

          {/* Executive Overview */}
          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-salesport/40 shadow-xl">
            <h2 className="text-base font-bold text-salesport-light uppercase tracking-wider mb-3 flex items-center gap-2">
              <BookMarked className="w-5 h-5 text-salesport" />
              Executive Overview
            </h2>
            <p className="text-sm text-alice leading-relaxed font-normal">{summary.overview}</p>
          </div>

          {/* Key Concepts Grid */}
          {summary.keyConcepts && summary.keyConcepts.length > 0 && (
            <div>
              <h2 className="text-base font-bold text-alice mb-4 flex items-center gap-2">
                <Key className="w-5 h-5 text-salesport" />
                Key Concepts Breakdown
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {summary.keyConcepts.map((item, idx) => (
                  <div key={idx} className="glass-card rounded-2xl p-5 border border-brand-border">
                    <h3 className="text-sm font-bold text-alice mb-1.5 text-salesport-light">{item.title}</h3>
                    <p className="text-xs text-alice-muted leading-relaxed">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Important Points & Exam High-Yield Points */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {summary.importantPoints && summary.importantPoints.length > 0 && (
              <div className="glass-card rounded-3xl p-6 border border-brand-border">
                <h3 className="text-sm font-bold text-alice mb-4 flex items-center gap-2 text-cyan-400">
                  <FileCheck className="w-4 h-4 text-cyan-400" />
                  Core Takeaways
                </h3>
                <ul className="space-y-2.5">
                  {summary.importantPoints.map((pt, i) => (
                    <li key={i} className="text-xs text-alice-muted flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {summary.examPoints && summary.examPoints.length > 0 && (
              <div className="glass-card rounded-3xl p-6 border border-amber-500/30 bg-amber-500/5">
                <h3 className="text-sm font-bold text-alice mb-4 flex items-center gap-2 text-amber-400">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  High-Yield Exam Focus
                </h3>
                <ul className="space-y-2.5">
                  {summary.examPoints.map((ep, i) => (
                    <li key={i} className="text-xs text-alice-muted flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                      <span>{ep}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Definitions & Examples */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {summary.definitions && summary.definitions.length > 0 && (
              <div className="glass-card rounded-3xl p-6 border border-brand-border">
                <h3 className="text-sm font-bold text-alice mb-4 flex items-center gap-2 text-indigo-400">
                  <BookOpen className="w-4 h-4 text-indigo-400" />
                  Key Definitions
                </h3>
                <div className="space-y-3">
                  {summary.definitions.map((def, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-brand-surface border border-brand-border">
                      <span className="text-xs font-bold text-salesport-light block">{def.term}</span>
                      <span className="text-xs text-alice-muted mt-0.5 block">{def.definition}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {summary.examples && summary.examples.length > 0 && (
              <div className="glass-card rounded-3xl p-6 border border-brand-border">
                <h3 className="text-sm font-bold text-alice mb-4 flex items-center gap-2 text-emerald-400">
                  <Lightbulb className="w-4 h-4 text-emerald-400" />
                  Real-World Examples & Analogies
                </h3>
                <div className="space-y-3">
                  {summary.examples.map((ex, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-brand-surface border border-brand-border">
                      <span className="text-xs font-bold text-emerald-400 block">{ex.concept}</span>
                      <span className="text-xs text-alice-muted mt-0.5 block">{ex.example}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
