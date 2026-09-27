import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { progressService } from '../services/progressService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import BrandAuraDragCard from '../components/common/BrandAuraDragCard';
import {
  FileText,
  BookOpen,
  Layers,
  HelpCircle,
  Flame,
  Award,
  UploadCloud,
  Calendar,
  MessageSquare,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

export default function DashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await progressService.getProgressStats();
        if (res.success) {
          setData(res.data);
        }
      } catch (err) {
        console.error('Failed to fetch dashboard progress stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const stats = data?.stats || {
    totalMaterials: 0,
    summariesGenerated: 0,
    flashcardsCreated: 0,
    quizzesCompleted: 0,
    averageQuizScore: 0,
    studyStreak: user?.streak || 1,
  };

  const statCards = [
    {
      title: 'Total Materials',
      value: stats.totalMaterials,
      icon: FileText,
      color: 'text-salesport',
      bgColor: 'bg-salesport/15',
      borderColor: 'border-salesport/30',
    },
    {
      title: 'Summaries Generated',
      value: stats.summariesGenerated,
      icon: BookOpen,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/15',
      borderColor: 'border-blue-400/30',
    },
    {
      title: 'Flashcards Created',
      value: stats.flashcardsCreated,
      icon: Layers,
      color: 'text-indigo-400',
      bgColor: 'bg-indigo-400/15',
      borderColor: 'border-indigo-400/30',
    },
    {
      title: 'Quizzes Completed',
      value: stats.quizzesCompleted,
      icon: HelpCircle,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-400/15',
      borderColor: 'border-cyan-400/30',
    },
    {
      title: 'Avg. Quiz Score',
      value: `${stats.averageQuizScore}%`,
      icon: Award,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-400/15',
      borderColor: 'border-emerald-400/30',
    },
    {
      title: 'Study Streak',
      value: `${stats.studyStreak} Days`,
      icon: Flame,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/15',
      borderColor: 'border-orange-500/30',
    },
  ];

  const quickActions = [
    { label: 'Upload Material', to: '/materials', icon: UploadCloud, primary: true },
    { label: 'Generate Summary', to: '/summaries', icon: BookOpen },
    { label: 'Study Flashcards', to: '/flashcards', icon: Layers },
    { label: 'Take Quiz', to: '/quiz', icon: HelpCircle },
    { label: 'Plan Roadmap', to: '/study-plan', icon: Calendar },
    { label: 'Ask AI Tutor', to: '/ask-ai', icon: MessageSquare },
  ];

  const weeklyActivity = data?.weeklyActivity || [
    { day: 'Mon', studyMinutes: 45 },
    { day: 'Tue', studyMinutes: 60 },
    { day: 'Wed', studyMinutes: 30 },
    { day: 'Thu', studyMinutes: 90 },
    { day: 'Fri', studyMinutes: 75 },
    { day: 'Sat', studyMinutes: 120 },
    { day: 'Sun', studyMinutes: 80 },
  ];

  if (loading) {
    return <LoadingSpinner message="Loading your student learning dashboard..." />;
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-prussian via-brand-surface to-[#020d2c] border border-salesport/40 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-salesport/20 border border-salesport/40 text-xs font-semibold text-alice">
              <Sparkles className="w-3.5 h-3.5 text-salesport" />
              <span>AI Study Assistance Active</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-alice tracking-tight">
              Welcome back, {user?.name || 'Student'}!
            </h1>
            <p className="text-xs sm:text-sm text-alice-muted max-w-xl">
              You are on a <span className="text-orange-400 font-bold">{stats.studyStreak}-day streak</span>!
              Upload materials, review flashcards, or take a quiz to maintain your learning momentum.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/materials"
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-alice glow-button flex items-center gap-2"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Upload Notes</span>
            </Link>
            <Link
              to="/ask-ai"
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-alice bg-brand-surface/80 hover:bg-brand-surface border border-brand-border hover:border-salesport/60 transition flex items-center gap-1.5"
            >
              <MessageSquare className="w-4 h-4 text-salesport" />
              <span>Ask AI Tutor</span>
            </Link>
          </div>
        </div>

        {/* Ambient Gradient Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-salesport/15 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      </div>

      {/* 6 Key Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="glass-card rounded-2xl p-4 border border-brand-border hover:border-salesport/50 transition-all flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-semibold text-alice-muted truncate">
                  {card.title}
                </span>
                <div className={`p-2 rounded-xl ${card.bgColor} ${card.borderColor} border ${card.color}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="text-2xl font-black text-alice tracking-tight">{card.value}</div>
            </div>
          );
        })}
      </div>

      {/* Quick Action Buttons */}
      <div>
        <h2 className="text-sm font-bold uppercase tracking-wider text-alice-muted mb-3 flex items-center gap-2">
          <span>Quick Actions</span>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {quickActions.map((qa, i) => {
            const Icon = qa.icon;
            return (
              <Link
                key={i}
                to={qa.to}
                className={`p-3.5 rounded-2xl border transition-all flex flex-col items-center justify-center text-center gap-2 group ${
                  qa.primary
                    ? 'bg-salesport/20 hover:bg-salesport text-alice border-salesport/50 shadow-md shadow-salesport/20'
                    : 'bg-brand-surface/60 hover:bg-brand-surface text-alice border-brand-border hover:border-salesport/50'
                }`}
              >
                <div className="w-9 h-9 rounded-xl bg-brand-night/80 flex items-center justify-center text-salesport group-hover:scale-110 transition-transform">
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold">{qa.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Analytics Chart & Interactive Chroma Drag Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Weekly Study Time Activity Chart */}
        <div className="lg:col-span-7 glass-card rounded-3xl p-6 border border-brand-border">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-alice flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-salesport" />
                Weekly Learning Activity
              </h3>
              <p className="text-xs text-alice-muted">Study focus minutes logged over past 7 days</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-salesport/10 text-salesport-light border border-salesport/30">
              Active Pace
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyActivity}>
                <defs>
                  <linearGradient id="salesportArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#185DF1" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#031130" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(24, 93, 241, 0.15)" />
                <XAxis dataKey="day" stroke="#C4D4F5" fontSize={11} tickLine={false} />
                <YAxis stroke="#C4D4F5" fontSize={11} tickLine={false} unit="m" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#050D24',
                    borderColor: 'rgba(24, 93, 241, 0.4)',
                    borderRadius: '12px',
                    color: '#F3F7FE',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="studyMinutes"
                  name="Study Minutes"
                  stroke="#185DF1"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#salesportArea)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Interactive Mouse Drag Chroma Card */}
        <div className="lg:col-span-5 space-y-4">
          <BrandAuraDragCard />
        </div>
      </div>

      {/* Recent Activity Timeline */}
      <div className="glass-card rounded-3xl p-6 border border-brand-border">
        <h3 className="text-base font-bold text-alice mb-4 flex items-center gap-2">
          <Clock className="w-4 h-4 text-salesport" />
          Recent Academic Activity
        </h3>

        {data?.recentActivity && data.recentActivity.length > 0 ? (
          <div className="divide-y divide-brand-border/60">
            {data.recentActivity.map((act) => (
              <div key={act.id} className="py-3 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-alice">{act.title}</p>
                    <p className="text-[11px] text-alice-muted">{act.detail}</p>
                  </div>
                </div>
                <span className="text-[10px] text-alice-muted">
                  {new Date(act.timestamp).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-xs text-alice-muted">No recent quiz attempts yet.</p>
            <Link
              to="/materials"
              className="inline-flex items-center gap-1.5 mt-2 text-xs font-semibold text-salesport hover:underline"
            >
              <span>Upload your first study note to start</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
