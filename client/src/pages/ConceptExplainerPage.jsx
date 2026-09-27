import React, { useState } from 'react';
import { aiService } from '../services/aiService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import {
  Lightbulb,
  Sparkles,
  Smile,
  GraduationCap,
  AlertTriangle,
  FileCheck,
  Code,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';

export default function ConceptExplainerPage() {
  const [concept, setConcept] = useState('');
  const [isBeginner, setIsBeginner] = useState(true);
  const [explanation, setExplanation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleExplain = async (e) => {
    e?.preventDefault();
    if (!concept.trim()) {
      setError('Please enter a concept or topic to explain.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const res = await aiService.explainConcept({
        concept: concept.trim(),
        isBeginner,
      });

      if (res.success && res.data) {
        setExplanation(res.data.explanation);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to explain concept.');
    } finally {
      setLoading(false);
    }
  };

  const sampleConcepts = [
    'Recursion & Call Stack',
    'Normalization (1NF to 3NF)',
    'Asynchronous Event Loop',
    'Polymorphism in OOP',
    'Gradient Descent in ML',
    'CAP Theorem in Distributed Systems',
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-alice tracking-tight flex items-center gap-2.5">
          <Lightbulb className="w-7 h-7 text-salesport" />
          AI Concept Explainer & Analogy Engine
        </h1>
        <p className="text-xs sm:text-sm text-alice-muted mt-1">
          Demystify difficult academic topics through vivid analogies, intuitive mental models, and concrete examples.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Input Box */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-brand-border space-y-4">
        <form onSubmit={handleExplain} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-alice mb-1.5">
              Enter any concept or topic you find difficult:
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={concept}
                onChange={(e) => setConcept(e.target.value)}
                placeholder="e.g. Recursion, Deadlocks, Monads, Dynamic Programming..."
                className="flex-1 px-4 py-3 rounded-2xl bg-brand-surface border border-brand-border focus:border-salesport text-alice text-xs sm:text-sm outline-none"
              />

              <button
                type="submit"
                disabled={loading || !concept.trim()}
                className="px-6 py-3 rounded-2xl text-xs font-bold text-alice glow-button flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                <span>Explain Concept</span>
              </button>
            </div>
          </div>

          {/* Toggle: Beginner mode vs Technical Rigor */}
          <div className="flex items-center justify-between pt-2 border-t border-brand-border/60">
            <span className="text-xs text-alice-muted">Explanation Depth:</span>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setIsBeginner(true)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
                  isBeginner
                    ? 'bg-salesport text-alice border border-salesport shadow-md'
                    : 'bg-brand-surface text-alice-muted border border-brand-border hover:border-salesport/40'
                }`}
              >
                <Smile className="w-3.5 h-3.5" />
                <span>Explain Like I'm a Beginner</span>
              </button>

              <button
                type="button"
                onClick={() => setIsBeginner(false)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
                  !isBeginner
                    ? 'bg-salesport text-alice border border-salesport shadow-md'
                    : 'bg-brand-surface text-alice-muted border border-brand-border hover:border-salesport/40'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>University / Advanced Rigor</span>
              </button>
            </div>
          </div>
        </form>

        {/* Quick Suggestion Chips */}
        <div className="pt-2">
          <span className="text-[11px] text-alice-muted block mb-2">Try one of these high-frequency concepts:</span>
          <div className="flex flex-wrap gap-2">
            {sampleConcepts.map((sc, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setConcept(sc);
                }}
                className="px-2.5 py-1 rounded-lg bg-brand-surface/80 border border-brand-border hover:border-salesport/50 text-[11px] text-alice-muted hover:text-alice transition"
              >
                {sc}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading && <LoadingSpinner message={`Gemini AI is crafting an intuitive explanation for "${concept}"...`} />}

      {/* Explanation Presentation */}
      {explanation && !loading && (
        <div className="space-y-6">
          {/* Header Card */}
          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-salesport/40 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-salesport-light px-3 py-1 rounded-full bg-salesport/15 border border-salesport/30">
                {isBeginner ? "Beginner Friendly Analogy" : "Academic Deep Dive"}
              </span>
              <span className="text-xs text-alice-muted">Gemini Concept Synthesis</span>
            </div>

            <h2 className="text-2xl font-black text-alice">{explanation.concept}</h2>
            <p className="text-sm sm:text-base text-alice leading-relaxed font-normal">
              {explanation.simpleExplanation}
            </p>
          </div>

          {/* Vivid Analogy Box */}
          {explanation.analogy && (
            <div className="glass-card rounded-3xl p-6 border border-emerald-500/30 bg-emerald-500/5">
              <h3 className="text-sm font-bold text-emerald-400 mb-2 flex items-center gap-2">
                <Smile className="w-4 h-4 text-emerald-400" />
                Intuitive Real-World Analogy
              </h3>
              <p className="text-xs sm:text-sm text-alice leading-relaxed">{explanation.analogy}</p>
            </div>
          )}

          {/* Under-the-Hood Technical Breakdown */}
          {explanation.detailedExplanation && (
            <div className="glass-card rounded-3xl p-6 border border-brand-border">
              <h3 className="text-sm font-bold text-salesport-light mb-3 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-salesport" />
                How It Works Under the Hood
              </h3>
              <p className="text-xs sm:text-sm text-alice-muted leading-relaxed whitespace-pre-wrap">
                {explanation.detailedExplanation}
              </p>
            </div>
          )}

          {/* Concrete Practical Example */}
          {explanation.example && (
            <div className="glass-card rounded-3xl p-6 border border-cyan-500/30 bg-cyan-500/5">
              <h3 className="text-sm font-bold text-cyan-300 mb-2 flex items-center gap-2">
                <Code className="w-4 h-4 text-cyan-400" />
                Concrete Practical Application
              </h3>
              <p className="text-xs sm:text-sm text-alice leading-relaxed">{explanation.example}</p>
            </div>
          )}

          {/* Common Mistakes & Quick Revision Points */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {explanation.commonMistakes && explanation.commonMistakes.length > 0 && (
              <div className="glass-card rounded-3xl p-6 border border-rose-500/30 bg-rose-500/5">
                <h3 className="text-sm font-bold text-rose-400 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  Common Student Misconceptions
                </h3>
                <ul className="space-y-2">
                  {explanation.commonMistakes.map((m, idx) => (
                    <li key={idx} className="text-xs text-alice-muted flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 flex-shrink-0" />
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {explanation.quickRevisionPoints && explanation.quickRevisionPoints.length > 0 && (
              <div className="glass-card rounded-3xl p-6 border border-amber-500/30 bg-amber-500/5">
                <h3 className="text-sm font-bold text-amber-400 mb-3 flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-amber-400" />
                  Quick Exam Revision Bullet Points
                </h3>
                <ul className="space-y-2">
                  {explanation.quickRevisionPoints.map((p, idx) => (
                    <li key={idx} className="text-xs text-alice-muted flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
