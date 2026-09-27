import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import BrandAuraDragCard from '../components/common/BrandAuraDragCard';
import InteractiveAuraBackground from '../components/common/InteractiveAuraBackground';
import {
  Sparkles,
  BookOpen,
  Layers,
  HelpCircle,
  Calendar,
  MessageSquare,
  TrendingUp,
  ArrowRight,
  UploadCloud,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Cpu,
  Database,
  Code2,
} from 'lucide-react';

export default function LandingPage() {
  const { user } = useAuth();
  const [heroHue, setHeroHue] = useState(55);

  const features = [
    {
      icon: BookOpen,
      title: 'AI Summarization',
      desc: 'Condense dense textbooks and lecture notes into concise key concepts, definitions, and high-yield exam takeaways.',
      tag: 'Instant Overview',
    },
    {
      icon: Layers,
      title: 'Smart Flashcards',
      desc: 'Active recall made seamless with 3D interactive flashcard decks generated directly from your uploaded materials.',
      tag: 'Spaced Repetition',
    },
    {
      icon: HelpCircle,
      title: 'AI Quiz Generator',
      desc: 'Test your comprehension with customized difficulty levels, multiple-choice questions, and instant diagnostic feedback.',
      tag: 'Mastery Check',
    },
    {
      icon: Calendar,
      title: 'Personalized Study Plans',
      desc: 'Enter your exam deadline and daily hours to receive a tailored day-by-day milestone roadmap and task checklist.',
      tag: 'Smart Scheduling',
    },
    {
      icon: MessageSquare,
      title: 'Ask Your Study Material',
      desc: 'Grounded conversational AI tutor that answers strictly from your notes without hallucinating unsupported facts.',
      tag: 'Grounded Q&A',
    },
    {
      icon: TrendingUp,
      title: 'Progress Analytics',
      desc: 'Track study streaks, average quiz scores, mastered flashcards, and weekly study time via interactive charts.',
      tag: 'Growth Metrics',
    },
  ];

  const steps = [
    {
      step: '01',
      title: 'Upload Study Materials',
      desc: 'Drop in your PDF, Word document (.docx), or raw lecture notes (.txt). Our text extraction pipeline parses the content securely.',
    },
    {
      step: '02',
      title: 'Let AI Analyze',
      desc: 'Google Gemini AI parses concepts, extracts terminology, identifies relationships, and indexes high-probability exam topics.',
    },
    {
      step: '03',
      title: 'Generate Learning Assets',
      desc: 'Spin up comprehensive summaries, flashcards, diagnostic quizzes, and milestone-driven study roadmaps with one click.',
    },
    {
      step: '04',
      title: 'Study & Track Progress',
      desc: 'Practice active recall, quiz yourself under exam conditions, maintain your daily study streak, and watch your scores climb.',
    },
  ];

  const techStack = [
    { name: 'React 18 & Vite', desc: 'Lightning-fast client interface', icon: Code2 },
    { name: 'Node.js & Express', desc: 'Secure RESTful backend microservices', icon: Cpu },
    { name: 'MongoDB & Mongoose', desc: 'Scalable persistent data modeling', icon: Database },
    { name: 'Google Gemini AI', desc: 'State-of-the-art multimodal generative intelligence', icon: Sparkles },
  ];

  return (
    <div className="min-h-screen bg-brand-night text-alice relative overflow-hidden flex flex-col font-sans">
      <InteractiveAuraBackground />

      {/* Landing Header */}
      <header className="relative z-20 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between border-b border-brand-border/40">
        <div className="flex items-center space-x-2.5">
          <div className="w-10 h-10 rounded-xl bg-salesport flex items-center justify-center text-alice shadow-lg shadow-salesport/40">
            <Sparkles className="w-5 h-5 text-alice" />
          </div>
          <div>
            <span className="text-xl font-black tracking-tight text-alice">AI StudyBuddy</span>
            <span className="block text-[10px] text-alice-muted -mt-0.5 tracking-wider uppercase font-semibold">
              AI-Powered Learning
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {user ? (
            <Link
              to="/dashboard"
              className="px-5 py-2 rounded-xl text-xs font-semibold text-alice glow-button flex items-center gap-1.5"
            >
              <span>Go to Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 rounded-xl text-xs font-medium text-alice hover:text-white hover:bg-white/5 transition"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-5 py-2 rounded-xl text-xs font-semibold text-alice glow-button flex items-center gap-1.5"
              >
                <span>Get Started</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 pt-16 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Copy */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-salesport/15 border border-salesport/40 text-xs font-semibold text-alice">
              <span className="w-2 h-2 rounded-full bg-salesport animate-ping" />
              <span>Next-Gen Learning Platform with Google Gemini</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-alice leading-[1.12]">
              Study Smarter. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-salesport via-blue-400 to-alice">
                Learn Faster.
              </span>{' '}
              Achieve More.
            </h1>

            <p className="text-base sm:text-lg text-alice-muted max-w-2xl font-normal leading-relaxed">
              Your personal AI-powered study companion that transforms raw study materials into structured
              summaries, 3D smart flashcards, self-grading quizzes, and personalized learning roadmaps.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 justify-center lg:justify-start">
              <Link
                to="/register"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl text-sm font-bold text-alice glow-button flex items-center justify-center gap-2"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl text-sm font-semibold text-alice bg-brand-surface/70 hover:bg-brand-surface border border-brand-border hover:border-salesport/50 transition flex items-center justify-center"
              >
                <span>Sign In to Account</span>
              </Link>
            </div>

            <div className="pt-4 flex items-center justify-center lg:justify-start gap-6 text-xs text-alice-muted">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Free Tier Available
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-salesport" /> Secure Document Storage
              </span>
              <span className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-400" /> Powered by Gemini
              </span>
            </div>
          </div>

          {/* Interactive Mouse Drag Palette Showcase */}
          <div className="lg:col-span-5">
            <div className="relative">
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-salesport/40 to-prussian/50 blur-xl opacity-70" />
              <div className="relative">
                <BrandAuraDragCard onGradientShift={(pct) => setHeroHue(pct)} />
                <div className="mt-3 text-center">
                  <p className="text-[11px] text-alice-muted flex items-center justify-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-salesport" />
                    Drag across the canvas to test dynamic chroma & aura shift
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-salesport px-3 py-1 rounded-full bg-salesport/10 border border-salesport/30 inline-block mb-3">
            Core Superpowers
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-alice tracking-tight">
            Engineered for Deep Academic Comprehension
          </h2>
          <p className="text-alice-muted text-sm sm:text-base mt-3">
            From lecture PDFs to high-scoring mastery, AI StudyBuddy automates active recall and deep learning.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="glass-card rounded-2xl p-6 relative group transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-11 h-11 rounded-xl bg-salesport/20 border border-salesport/40 flex items-center justify-center text-salesport group-hover:scale-110 group-hover:bg-salesport group-hover:text-white transition-all">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-salesport-light px-2.5 py-1 rounded-full bg-salesport/10 border border-salesport/25">
                    {feat.tag}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-alice mb-2 group-hover:text-salesport-light transition-colors">
                  {feat.title}
                </h3>
                <p className="text-xs sm:text-sm text-alice-muted leading-relaxed">{feat.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works */}
      <section className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-t border-brand-border/40">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-salesport px-3 py-1 rounded-full bg-salesport/10 border border-salesport/30 inline-block mb-3">
            Simple 4-Step Workflow
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-alice tracking-tight">
            How AI StudyBuddy Accelerates Your Studies
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((st, i) => (
            <div key={i} className="glass-card rounded-2xl p-6 relative">
              <span className="text-3xl font-black text-salesport/40 block mb-3">{st.step}</span>
              <h3 className="text-base font-bold text-alice mb-2">{st.title}</h3>
              <p className="text-xs text-alice-muted leading-relaxed">{st.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Technology Section */}
      <section className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-t border-brand-border/40">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-alice">Built on Modern Production Architecture</h2>
          <p className="text-xs sm:text-sm text-alice-muted mt-2">
            Engineered with industry-standard web standards and official Google Gemini AI integration.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {techStack.map((tech, idx) => {
            const Icon = tech.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-brand-surface/60 border border-brand-border text-center hover:border-salesport/50 transition-colors"
              >
                <div className="w-10 h-10 mx-auto rounded-xl bg-salesport/15 border border-salesport/30 flex items-center justify-center text-salesport mb-3">
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-alice">{tech.name}</h4>
                <p className="text-[11px] text-alice-muted mt-1">{tech.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Footer */}
      <footer className="relative z-10 py-12 px-4 border-t border-brand-border/50 text-center text-xs text-alice-muted">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-md bg-salesport flex items-center justify-center text-alice">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-alice text-sm">AI StudyBuddy</span>
          </div>
          <p>© {new Date().getFullYear()} AI StudyBuddy Platform. Built with Google Gemini API.</p>
          <div className="flex space-x-4">
            <Link to="/login" className="hover:text-alice transition">
              Sign In
            </Link>
            <Link to="/register" className="hover:text-alice transition">
              Create Account
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
