import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { materialService } from '../services/materialService';
import { aiService } from '../services/aiService';
import { quizService } from '../services/quizService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import confetti from 'canvas-confetti';
import {
  HelpCircle,
  Sparkles,
  CheckCircle2,
  XCircle,
  Timer,
  Award,
  ArrowRight,
  RotateCcw,
  AlertCircle,
  BookOpen,
} from 'lucide-react';

export default function QuizPage() {
  const [searchParams] = useSearchParams();
  const preselectedMaterialId = searchParams.get('materialId') || '';

  const [materials, setMaterials] = useState([]);
  const [selectedMaterialId, setSelectedMaterialId] = useState(preselectedMaterialId);
  const [count, setCount] = useState(5);
  const [difficulty, setDifficulty] = useState('medium');
  const [questionType, setQuestionType] = useState('multiple_choice');

  const [quiz, setQuiz] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isTaking, setIsTaking] = useState(false);
  const [results, setResults] = useState(null);

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
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
        console.error('Failed to load materials for quiz:', err);
      }
    };
    loadMaterials();
  }, []);

  // Timer while taking quiz
  useEffect(() => {
    let interval = null;
    if (isTaking && !results) {
      interval = setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTaking, results]);

  const handleGenerateQuiz = async () => {
    if (!selectedMaterialId) {
      setError('Please select a study material to generate a quiz.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setResults(null);
      setSelectedAnswers({});
      setTimeElapsed(0);

      const res = await aiService.generateQuiz({
        materialId: selectedMaterialId,
        count: Number(count),
        difficulty,
        questionType,
      });

      if (res.success && res.data) {
        setQuiz(res.data);
        setCurrentStep(0);
        setIsTaking(true);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to generate quiz.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (questionId, option) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: option,
    }));
  };

  const handleSubmitQuiz = async () => {
    if (!quiz) return;
    try {
      setSubmitting(true);
      setError('');
      const res = await quizService.submitQuiz(quiz.quizId, selectedAnswers, timeElapsed);
      if (res.success && res.data) {
        setResults(res.data);
        setIsTaking(false);
        if (res.data.percentage >= 70) {
          confetti({
            particleCount: 100,
            spread: 80,
            origin: { y: 0.6 },
          });
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to submit quiz.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-alice tracking-tight flex items-center gap-2.5">
          <HelpCircle className="w-7 h-7 text-salesport" />
          AI Quiz Generator & Assessment
        </h1>
        <p className="text-xs sm:text-sm text-alice-muted mt-1">
          Validate comprehension with AI-generated test questions, self-grading logic, and diagnostic feedback.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Quiz Configuration Panel */}
      {!isTaking && !results && (
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-brand-border">
          <h2 className="text-base font-bold text-alice mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-salesport" />
            Configure Your Quiz Parameters
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div>
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

            <div>
              <label className="block text-xs font-semibold text-alice mb-1.5">Question Count</label>
              <select
                value={count}
                onChange={(e) => setCount(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-brand-surface border border-brand-border focus:border-salesport text-alice text-xs outline-none"
              >
                <option value={5}>5 Questions (Quick Check)</option>
                <option value={10}>10 Questions (Standard Quiz)</option>
                <option value={15}>15 Questions (Midterm Review)</option>
                <option value={20}>20 Questions (Comprehensive Exam)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-alice mb-1.5">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-brand-surface border border-brand-border focus:border-salesport text-alice text-xs outline-none"
              >
                <option value="easy">Easy (Definitions & Syntax)</option>
                <option value="medium">Medium (Standard Concepts)</option>
                <option value="hard">Hard (Tricky / Deep Application)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-alice mb-1.5">Question Style</label>
              <select
                value={questionType}
                onChange={(e) => setQuestionType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-brand-surface border border-brand-border focus:border-salesport text-alice text-xs outline-none"
              >
                <option value="multiple_choice">Multiple Choice (4 options)</option>
                <option value="true_false">True / False</option>
                <option value="mixed">Mixed Question Types</option>
              </select>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={handleGenerateQuiz}
              disabled={loading || !selectedMaterialId}
              className="py-3 px-8 rounded-xl text-xs font-bold text-alice glow-button flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate Quiz with Gemini</span>
            </button>
          </div>
        </div>
      )}

      {loading && <LoadingSpinner message="Gemini AI is designing your rigorous quiz assessment..." />}

      {/* Active Quiz Taking Interface */}
      {isTaking && quiz && (
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Top Timer & Progress Bar */}
          <div className="glass-card rounded-2xl p-4 border border-brand-border flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-alice">
                Question {currentStep + 1} of {quiz.questions.length}
              </span>
              <p className="text-[11px] text-alice-muted">{quiz.title}</p>
            </div>

            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-salesport/15 border border-salesport/30 text-xs font-mono text-alice">
              <Timer className="w-3.5 h-3.5 text-salesport" />
              <span>{formatTime(timeElapsed)}</span>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="w-full h-1.5 bg-brand-surface rounded-full overflow-hidden border border-brand-border">
            <div
              className="h-full bg-salesport transition-all duration-300"
              style={{ width: `${((currentStep + 1) / quiz.questions.length) * 100}%` }}
            />
          </div>

          {/* Question Card */}
          {(() => {
            const curQ = quiz.questions[currentStep];
            return (
              <div className="glass-card rounded-3xl p-6 sm:p-8 border border-brand-border space-y-6">
                <h3 className="text-base sm:text-lg font-bold text-alice leading-relaxed">
                  {curQ.question}
                </h3>

                {/* Options List */}
                <div className="space-y-3">
                  {curQ.options.map((opt, oIdx) => {
                    const isSelected = selectedAnswers[curQ._id] === opt;
                    return (
                      <button
                        key={oIdx}
                        type="button"
                        onClick={() => handleSelectOption(curQ._id, opt)}
                        className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm font-medium transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-salesport/25 border-salesport text-alice shadow-lg shadow-salesport/20'
                            : 'bg-brand-surface/70 border-brand-border text-alice-muted hover:border-salesport/40 hover:text-alice'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <span
                            className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center border ${
                              isSelected
                                ? 'bg-salesport text-alice border-salesport'
                                : 'bg-brand-card border-brand-border text-alice-muted'
                            }`}
                          >
                            {String.fromCharCode(65 + oIdx)}
                          </span>
                          <span>{opt}</span>
                        </div>

                        {isSelected && <CheckCircle2 className="w-4 h-4 text-salesport" />}
                      </button>
                    );
                  })}
                </div>

                {/* Bottom Navigation in Quiz */}
                <div className="flex items-center justify-between pt-4 border-t border-brand-border/60">
                  <button
                    onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
                    disabled={currentStep === 0}
                    className="px-4 py-2 rounded-xl bg-brand-surface border border-brand-border text-alice text-xs disabled:opacity-40"
                  >
                    Previous
                  </button>

                  {currentStep < quiz.questions.length - 1 ? (
                    <button
                      onClick={() => setCurrentStep((prev) => prev + 1)}
                      className="px-6 py-2 rounded-xl text-xs font-bold text-alice glow-button flex items-center gap-1.5"
                    >
                      <span>Next</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmitQuiz}
                      disabled={submitting}
                      className="px-6 py-2 rounded-xl text-xs font-bold text-alice bg-emerald-500 hover:bg-emerald-400 text-black shadow-lg shadow-emerald-500/20 flex items-center gap-1.5 transition"
                    >
                      {submitting ? 'Grading Answers...' : 'Submit Final Quiz'}
                    </button>
                  )}
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Quiz Results Screen */}
      {results && (
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Score Header Card */}
          <div className="glass-card rounded-3xl p-8 border border-salesport/50 text-center relative overflow-hidden shadow-2xl">
            <div className="relative z-10 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-salesport-light px-3 py-1 rounded-full bg-salesport/15 border border-salesport/30 inline-block">
                Assessment Completed
              </span>

              <div className="text-5xl sm:text-6xl font-black text-alice tracking-tight">
                {results.percentage}%
              </div>

              <p className="text-sm font-semibold text-alice">
                You scored {results.score} out of {results.totalQuestions} questions correct.
              </p>

              <p className="text-xs text-alice-muted max-w-md mx-auto">{results.feedback}</p>

              <div className="pt-4 flex items-center justify-center gap-3">
                <button
                  onClick={() => {
                    setResults(null);
                    setIsTaking(false);
                  }}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-alice glow-button flex items-center gap-2"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Take Another Quiz</span>
                </button>
              </div>
            </div>
          </div>

          {/* Diagnostic Answer Review Breakdown */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-alice-muted flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-salesport" />
              <span>Detailed Question Analysis & Explanations</span>
            </h3>

            {results.answers.map((item, idx) => (
              <div
                key={idx}
                className={`glass-card rounded-2xl p-5 border ${
                  item.isCorrect ? 'border-emerald-500/40 bg-emerald-500/5' : 'border-rose-500/40 bg-rose-500/5'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <span className="text-xs font-bold text-alice">
                    Question {idx + 1}: {item.question}
                  </span>
                  {item.isCorrect ? (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md flex-shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Correct
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-md flex-shrink-0">
                      <XCircle className="w-3.5 h-3.5" /> Incorrect
                    </span>
                  )}
                </div>

                <div className="text-xs space-y-1 mt-3">
                  <p className="text-alice-muted">
                    <strong className="text-alice">Your Answer:</strong> {item.selectedOption}
                  </p>
                  {!item.isCorrect && (
                    <p className="text-emerald-400">
                      <strong>Correct Answer:</strong> {item.correctAnswer}
                    </p>
                  )}
                </div>

                <div className="mt-3 p-3 rounded-xl bg-brand-surface/70 border border-brand-border text-xs text-alice-muted">
                  <strong className="text-alice block mb-0.5">Gemini Explanation:</strong>
                  {item.explanation}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
