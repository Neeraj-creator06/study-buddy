import React, { useState, useEffect } from 'react';
import { progressService } from '../services/progressService';
import { quizService } from '../services/quizService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import BrandAuraDragCard from '../components/common/BrandAuraDragCard';
import {
  TrendingUp,
  Award,
  Layers,
  FileText,
  Flame,
  CheckCircle2,
  Clock,
  BookOpen,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

export default function ProgressPage() {
  const [data, setData] = useState(null);
  const [quizHistory, setQuizHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAll = async () => {
      try {
        const [progRes, quizRes] = await Promise.all([
          progressService.getProgressStats(),
          quizService.getQuizResults(),
        ]);

        if (progRes.success) setData(progRes.data);
        if (quizRes.success) setQuizHistory(quizRes.data.results || []);
      } catch (err) {
        console.error('Failed to load progress data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadAll();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Calculating learning velocity and metrics..." />;
  }

  const stats = data?.stats || {};
  const weeklyActivity = data?.weeklyActivity || [];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-alice tracking-tight flex items-center gap-2.5">
          <TrendingUp className="w-7 h-7 text-salesport" />
          Academic Progress & Mastery Analytics
        </h1>
        <p className="text-xs sm:text-sm text-alice-muted mt-1">
          Monitor your study velocity, retention rate, assessment scores, and daily streak metrics.
        </p>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-5 border border-brand-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-alice-muted">Study Streak</span>
            <Flame className="w-4 h-4 text-orange-400 fill-orange-400/20" />
          </div>
          <div className="text-3xl font-black text-alice">{stats.studyStreak || 1} Days</div>
          <p className="text-[11px] text-orange-400 mt-1">Active Daily Learner</p>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-brand-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-alice-muted">Average Quiz Score</span>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-alice">{stats.averageQuizScore || 0}%</div>
          <p className="text-[11px] text-emerald-400 mt-1">Overall Assessment Accuracy</p>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-brand-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-alice-muted">Mastered Flashcards</span>
            <Layers className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-3xl font-black text-alice">
            {stats.flashcardsMastered || 0} / {stats.flashcardsCreated || 0}
          </div>
          <p className="text-[11px] text-indigo-400 mt-1">Spaced Repetition Retention</p>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-brand-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-alice-muted">Roadmap Milestones</span>
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-black text-alice">
            {stats.tasksCompleted || 0} / {stats.totalTasks || 0}
          </div>
          <p className="text-[11px] text-cyan-400 mt-1">Tasks Completed</p>
        </div>
      </div>

      {/* Visual Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Weekly Study Minutes Area Chart */}
        <div className="lg:col-span-8 glass-card rounded-3xl p-6 border border-brand-border">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-bold text-alice flex items-center gap-2">
                <Clock className="w-4 h-4 text-salesport" />
                Weekly Study Time Log (Minutes)
              </h3>
              <p className="text-xs text-alice-muted">Daily distribution of active study engagement</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyActivity}>
                <defs>
                  <linearGradient id="progGradient" x1="0" y1="0" x2="0" y2="1">
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
                  fill="url(#progGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Interactive Mouse Drag Chroma Widget */}
        <div className="lg:col-span-4">
          <BrandAuraDragCard />
        </div>
      </div>

      {/* Historical Quiz Submissions Table */}
      <div className="glass-card rounded-3xl p-6 border border-brand-border space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-alice-muted flex items-center gap-2">
          <Award className="w-4 h-4 text-salesport" />
          <span>Past Quiz Performance Log</span>
        </h3>

        {quizHistory.length === 0 ? (
          <div className="text-center py-8 text-xs text-alice-muted">
            No quiz submissions on record yet. Take your first quiz in the Quizzes section!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-brand-border text-alice-muted uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-4">Quiz Title</th>
                  <th className="py-3 px-4">Score</th>
                  <th className="py-3 px-4">Percentage</th>
                  <th className="py-3 px-4">Time Spent</th>
                  <th className="py-3 px-4">Date Completed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border/60">
                {quizHistory.map((item) => (
                  <tr key={item._id} className="hover:bg-brand-surface/40 transition">
                    <td className="py-3 px-4 font-bold text-alice">
                      {item.quizId?.title || 'Study Material Quiz'}
                    </td>
                    <td className="py-3 px-4 text-alice">
                      {item.score} / {item.totalQuestions}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`font-bold px-2 py-0.5 rounded-full text-[11px] ${
                          item.percentage >= 80
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : item.percentage >= 60
                            ? 'bg-salesport/15 text-salesport-light border border-salesport/30'
                            : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        {item.percentage}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-alice-muted">
                      {item.timeSpentSeconds ? `${item.timeSpentSeconds}s` : '—'}
                    </td>
                    <td className="py-3 px-4 text-alice-muted">
                      {new Date(item.completedAt || item.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
