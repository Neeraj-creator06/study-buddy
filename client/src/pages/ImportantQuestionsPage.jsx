import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { materialService } from '../services/materialService';
import { aiService } from '../services/aiService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import {
  Award,
  Sparkles,
  HelpCircle,
  FileText,
  AlertCircle,
  CheckCircle,
  BookOpen,
} from 'lucide-react';

export default function ImportantQuestionsPage() {
  const [searchParams] = useSearchParams();
  const preselectedMaterialId = searchParams.get('materialId') || '';

  const [materials, setMaterials] = useState([]);
  const [selectedMaterialId, setSelectedMaterialId] = useState(preselectedMaterialId);
  const [difficulty, setDifficulty] = useState('all');
  const [questionsData, setQuestionsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadMaterials = async () => {
      try {
        const res = await materialService.getMaterials();
        if (res.success && res.data.materials) {
          setMaterials(res.data.materials);
          if (!selectedMaterialId && res.data.materials.length > 0) {
            setSelectedMaterialId(res.data.materials[0]._id);
          }
        }
      } catch (err) {
        console.error('Failed to load materials for important questions:', err);
      }
    };
    loadMaterials();
  }, []);

  const handleGenerate = async () => {
    if (!selectedMaterialId) {
      setError('Please select a study material first.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const res = await aiService.generateImportantQuestions({
        materialId: selectedMaterialId,
        difficulty,
      });

      if (res.success && res.data) {
        setQuestionsData(res.data.questions);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to generate important questions.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-alice tracking-tight flex items-center gap-2.5">
          <Award className="w-7 h-7 text-salesport" />
          High-Yield Exam Questions Generator
        </h1>
        <p className="text-xs sm:text-sm text-alice-muted mt-1">
          Gemini AI predicts frequently tested exam topics, short-answer questions, and practical scenarios.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Control Bar */}
      <div className="glass-card rounded-3xl p-6 border border-brand-border">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
          <div className="sm:col-span-6">
            <label className="block text-xs font-semibold text-alice mb-1.5">Study Material</label>
            <select
              value={selectedMaterialId}
              onChange={(e) => setSelectedMaterialId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-brand-surface border border-brand-border focus:border-salesport text-alice text-xs outline-none"
            >
              {materials.map((m) => (
                <option key={m._id} value={m._id} className="bg-brand-card text-alice">
                  {m.title}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-3">
            <label className="block text-xs font-semibold text-alice mb-1.5">Difficulty Focus</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-brand-surface border border-brand-border focus:border-salesport text-alice text-xs outline-none"
            >
              <option value="all">All Difficulties</option>
              <option value="easy">Foundational (2 Marks)</option>
              <option value="medium">Intermediate (5 Marks)</option>
              <option value="hard">Advanced (Scenario/Application)</option>
            </select>
          </div>

          <div className="sm:col-span-3">
            <button
              onClick={handleGenerate}
              disabled={loading || !selectedMaterialId}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-alice glow-button flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>Predict Questions</span>
            </button>
          </div>
        </div>
      </div>

      {loading && <LoadingSpinner message="Gemini AI is analyzing syllabus trends and extracting exam questions..." />}

      {/* Structured Output */}
      {questionsData && !loading && (
        <div className="space-y-6">
          {/* Short Answer Questions (2 Marks) */}
          {questionsData.shortAnswerQuestions && questionsData.shortAnswerQuestions.length > 0 && (
            <div className="glass-card rounded-3xl p-6 border border-brand-border">
              <h2 className="text-base font-bold text-salesport-light mb-4 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-salesport" />
                Short Answer Questions (2 - 3 Marks)
              </h2>
              <div className="space-y-3.5">
                {questionsData.shortAnswerQuestions.map((q, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-brand-surface border border-brand-border">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-alice">Q{idx + 1}: {q.question}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-salesport/20 text-salesport border border-salesport/30">
                        {q.marks || 2} Marks
                      </span>
                    </div>
                    {q.suggestedAnswer && (
                      <p className="text-xs text-alice-muted mt-1">
                        <strong className="text-alice">Model Answer:</strong> {q.suggestedAnswer}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Long Answer Questions (5 - 10 Marks) */}
          {questionsData.longAnswerQuestions && questionsData.longAnswerQuestions.length > 0 && (
            <div className="glass-card rounded-3xl p-6 border border-brand-border">
              <h2 className="text-base font-bold text-cyan-400 mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-cyan-400" />
                Long Descriptive Questions (5 - 10 Marks)
              </h2>
              <div className="space-y-4">
                {questionsData.longAnswerQuestions.map((q, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-brand-surface border border-brand-border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs sm:text-sm font-bold text-alice">Q{idx + 1}: {q.question}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                        {q.marks || 5} Marks
                      </span>
                    </div>
                    {q.keyPointsToInclude && q.keyPointsToInclude.length > 0 && (
                      <div className="mt-2">
                        <span className="text-[11px] font-semibold text-alice block mb-1">
                          Key Evaluation Points to Include:
                        </span>
                        <ul className="space-y-1">
                          {q.keyPointsToInclude.map((pt, pIdx) => (
                            <li key={pIdx} className="text-xs text-alice-muted flex items-start gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0" />
                              <span>{pt}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Practical Questions */}
          {questionsData.practicalQuestions && questionsData.practicalQuestions.length > 0 && (
            <div className="glass-card rounded-3xl p-6 border border-emerald-500/30 bg-emerald-500/5">
              <h2 className="text-base font-bold text-emerald-400 mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                Applied Practical / Scenario Problems
              </h2>
              <div className="space-y-3.5">
                {questionsData.practicalQuestions.map((q, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-brand-surface border border-brand-border">
                    <span className="text-xs font-bold text-alice block mb-1">Problem {idx + 1}: {q.question}</span>
                    {q.scenario && (
                      <p className="text-xs text-alice-muted mb-2">
                        <strong className="text-alice">Scenario:</strong> {q.scenario}
                      </p>
                    )}
                    {q.guidance && (
                      <p className="text-xs text-emerald-300">
                        <strong>Solution Framework:</strong> {q.guidance}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
