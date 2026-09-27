import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { materialService } from '../services/materialService';
import { aiService } from '../services/aiService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import confetti from 'canvas-confetti';
import {
  Layers,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  RotateCw,
  CheckCircle,
  HelpCircle,
  Shuffle,
  AlertCircle,
  Check,
  Award,
} from 'lucide-react';

export default function FlashcardsPage() {
  const [searchParams] = useSearchParams();
  const preselectedMaterialId = searchParams.get('materialId') || '';

  const [materials, setMaterials] = useState([]);
  const [selectedMaterialId, setSelectedMaterialId] = useState(preselectedMaterialId);
  const [count, setCount] = useState(10);
  const [difficulty, setDifficulty] = useState('medium');
  const [flashcards, setFlashcards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
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
        console.error('Failed to load materials for flashcards:', err);
      }
    };
    loadMaterials();
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (flashcards.length === 0) return;
      if (e.code === 'Space') {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      } else if (e.code === 'ArrowRight') {
        handleNext();
      } else if (e.code === 'ArrowLeft') {
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [flashcards, currentIndex]);

  const handleGenerate = async () => {
    if (!selectedMaterialId) {
      setError('Please select a study material to generate flashcards.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setIsFlipped(false);
      const res = await aiService.generateFlashcards({
        materialId: selectedMaterialId,
        count: Number(count),
        difficulty,
      });

      if (res.success && res.data.flashcards) {
        setFlashcards(res.data.flashcards);
        setCurrentIndex(0);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to generate flashcards.');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setIsFlipped(false);
      setCurrentIndex((prev) => prev + 1);
    } else if (flashcards.length > 0) {
      // Completed deck celebratory confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleShuffle = () => {
    if (flashcards.length === 0) return;
    const shuffled = [...flashcards].sort(() => Math.random() - 0.5);
    setFlashcards(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const toggleMastered = () => {
    if (flashcards.length === 0) return;
    setFlashcards((prev) => {
      const copy = [...prev];
      copy[currentIndex] = {
        ...copy[currentIndex],
        mastered: !copy[currentIndex].mastered,
      };
      return copy;
    });
  };

  const currentCard = flashcards[currentIndex];
  const masteredCount = flashcards.filter((f) => f.mastered).length;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-alice tracking-tight flex items-center gap-2.5">
          <Layers className="w-7 h-7 text-salesport" />
          Smart Flashcards Deck
        </h1>
        <p className="text-xs sm:text-sm text-alice-muted mt-1">
          Master high-yield concepts via interactive 3D cards, spaced repetition, and active recall.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Generator Configuration Bar */}
      <div className="glass-card rounded-3xl p-6 border border-brand-border">
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
            <label className="block text-xs font-semibold text-alice mb-1.5">Card Count</label>
            <select
              value={count}
              onChange={(e) => setCount(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-brand-surface border border-brand-border focus:border-salesport text-alice text-xs outline-none"
            >
              <option value={5}>5 Flashcards</option>
              <option value={10}>10 Flashcards</option>
              <option value={15}>15 Flashcards</option>
              <option value={20}>20 Flashcards</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-alice mb-1.5">Difficulty</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-brand-surface border border-brand-border focus:border-salesport text-alice text-xs outline-none"
            >
              <option value="easy">Easy (Fundamentals)</option>
              <option value="medium">Medium (Standard)</option>
              <option value="hard">Hard (Advanced / Exam)</option>
            </select>
          </div>

          <div>
            <button
              onClick={handleGenerate}
              disabled={loading || !selectedMaterialId}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-alice glow-button flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate Flashcards</span>
            </button>
          </div>
        </div>
      </div>

      {loading && <LoadingSpinner message="Gemini AI is crafting high-retention flashcards..." />}

      {/* Interactive 3D Flashcard Deck */}
      {flashcards.length > 0 && !loading && (
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Deck Stats & Controls */}
          <div className="flex items-center justify-between px-2 text-xs text-alice-muted">
            <span className="font-semibold text-alice">
              Card {currentIndex + 1} of {flashcards.length}
            </span>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <Award className="w-3.5 h-3.5" />
                {masteredCount} Mastered
              </span>
              <button
                onClick={handleShuffle}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-brand-surface border border-brand-border hover:border-salesport text-alice text-xs transition"
              >
                <Shuffle className="w-3 h-3 text-salesport" />
                <span>Shuffle</span>
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-1.5 bg-brand-surface rounded-full overflow-hidden border border-brand-border">
            <div
              className="h-full bg-salesport transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / flashcards.length) * 100}%` }}
            />
          </div>

          {/* 3D Flip Card Container */}
          <div
            onClick={() => setIsFlipped((prev) => !prev)}
            className="perspective-1000 cursor-pointer min-h-[340px] select-none"
          >
            <div
              className={`relative w-full h-full min-h-[340px] rounded-3xl transition-transform duration-500 transform-style-3d shadow-2xl ${
                isFlipped ? 'rotate-y-180' : ''
              }`}
            >
              {/* FRONT OF CARD (Question) */}
              <div
                className="absolute inset-0 rounded-3xl p-8 flex flex-col justify-between backface-hidden border border-salesport/40"
                style={{
                  background:
                    'radial-gradient(ellipse at center, rgba(24, 93, 241, 0.25) 0%, rgba(3, 17, 48, 0.95) 70%, #010818 100%)',
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-salesport/20 text-salesport-light border border-salesport/30">
                    Front: Question
                  </span>
                  <span className="text-xs text-alice-muted flex items-center gap-1">
                    <RotateCw className="w-3 h-3 text-salesport animate-spin" /> Click or Space to Flip
                  </span>
                </div>

                <div className="py-6 text-center">
                  <p className="text-lg sm:text-xl font-bold text-alice leading-relaxed">
                    {currentCard.question}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs text-alice-muted">
                  <span className="capitalize text-[11px]">Difficulty: {currentCard.difficulty || difficulty}</span>
                  {currentCard.mastered && (
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Mastered
                    </span>
                  )}
                </div>
              </div>

              {/* BACK OF CARD (Answer) */}
              <div
                className="absolute inset-0 rounded-3xl p-8 flex flex-col justify-between backface-hidden rotate-y-180 border border-emerald-500/40"
                style={{
                  background:
                    'radial-gradient(ellipse at center, rgba(16, 185, 129, 0.2) 0%, rgba(3, 17, 48, 0.95) 70%, #010818 100%)',
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Back: Explanation & Answer
                  </span>
                  <span className="text-xs text-alice-muted">Click or Space to Flip</span>
                </div>

                <div className="py-6 text-center">
                  <p className="text-sm sm:text-base text-alice leading-relaxed font-normal">
                    {currentCard.answer}
                  </p>
                </div>

                <div className="text-center text-[11px] text-alice-muted">
                  {currentCard.mastered ? 'Marked as known' : 'Keep practicing to master'}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="px-4 py-2.5 rounded-xl bg-brand-surface border border-brand-border hover:border-salesport text-alice text-xs font-semibold flex items-center gap-1.5 disabled:opacity-30 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <button
              onClick={toggleMastered}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 ${
                currentCard.mastered
                  ? 'bg-emerald-500 text-black border-emerald-400 shadow-md'
                  : 'bg-brand-surface text-alice border-brand-border hover:border-emerald-500'
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              <span>{currentCard.mastered ? 'Mastered' : 'Mark as Known'}</span>
            </button>

            <button
              onClick={handleNext}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-alice glow-button flex items-center gap-1.5 transition"
            >
              <span>{currentIndex === flashcards.length - 1 ? 'Finish Deck' : 'Next'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
