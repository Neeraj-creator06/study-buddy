import React, { useState, useEffect } from 'react';
import { studyPlanService } from '../services/studyPlanService';
import { aiService } from '../services/aiService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import {
  Calendar,
  Sparkles,
  CheckCircle2,
  Clock,
  Target,
  Trash2,
  AlertCircle,
  Plus,
  BookOpen,
  ArrowRight,
  ListTodo,
} from 'lucide-react';

export default function StudyPlanPage() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);

  // Form states
  const [subject, setSubject] = useState('');
  const [examDate, setExamDate] = useState('');
  const [dailyHours, setDailyHours] = useState(2);
  const [currentLevel, setCurrentLevel] = useState('intermediate');
  const [topics, setTopics] = useState('');
  const [preferredTime, setPreferredTime] = useState('Evening');

  const fetchPlans = async () => {
    try {
      const res = await studyPlanService.getStudyPlans();
      if (res.success && res.data.plans) {
        setPlans(res.data.plans);
      }
    } catch (err) {
      console.error('Failed to load study plans:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleCreatePlan = async (e) => {
    e.preventDefault();
    if (!subject || !examDate || !dailyHours) {
      setError('Please provide subject, exam date, and daily study hours.');
      return;
    }

    try {
      setGenerating(true);
      setError('');
      const res = await aiService.generateStudyPlan({
        subject,
        examDate,
        dailyHours: Number(dailyHours),
        currentKnowledgeLevel: currentLevel,
        topics: topics.split(',').map((t) => t.trim()).filter(Boolean),
        preferredStudyTime: preferredTime,
      });

      if (res.success) {
        setShowForm(false);
        setSubject('');
        setExamDate('');
        setTopics('');
        fetchPlans();
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to generate study plan.');
    } finally {
      setGenerating(false);
    }
  };

  const handleToggleTask = async (planId, taskId, currentStatus) => {
    try {
      const res = await studyPlanService.updateTaskStatus(planId, taskId, !currentStatus);
      if (res.success) {
        setPlans((prev) =>
          prev.map((p) => {
            if (p._id !== planId) return p;
            const updatedTasks = p.tasks.map((t) =>
              t._id === taskId ? { ...t, isCompleted: !currentStatus } : t
            );
            return {
              ...p,
              tasks: updatedTasks,
              progress: res.data.progress,
            };
          })
        );
      }
    } catch (err) {
      console.error('Failed to update task status:', err);
    }
  };

  const handleDeletePlan = async (id, subject) => {
    if (!window.confirm(`Delete study plan for "${subject}"?`)) return;
    try {
      await studyPlanService.deleteStudyPlan(id);
      setPlans((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      setError('Failed to delete study plan.');
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-alice tracking-tight flex items-center gap-2.5">
            <Calendar className="w-7 h-7 text-salesport" />
            Personalized Study Roadmaps
          </h1>
          <p className="text-xs sm:text-sm text-alice-muted mt-1">
            Gemini AI calculates milestones, daily hour budgets, and targeted tasks calibrated to your exam date.
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="px-5 py-2.5 rounded-xl text-xs font-bold text-alice glow-button flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{showForm ? 'Close Builder' : 'Create New Roadmap'}</span>
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Plan Builder Modal/Drawer */}
      {showForm && (
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-salesport/40 shadow-2xl">
          <h2 className="text-base font-bold text-alice mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-salesport" />
            Configure Your AI Study Roadmap
          </h2>

          <form onSubmit={handleCreatePlan} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-alice mb-1">Target Subject / Course</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Distributed Operating Systems"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-brand-surface border border-brand-border focus:border-salesport text-alice text-xs outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-alice mb-1">Target Exam / Deadline Date</label>
                <input
                  type="date"
                  value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-brand-surface border border-brand-border focus:border-salesport text-alice text-xs outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-alice mb-1">Daily Study Commitment</label>
                <select
                  value={dailyHours}
                  onChange={(e) => setDailyHours(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-brand-surface border border-brand-border focus:border-salesport text-alice text-xs outline-none"
                >
                  <option value={1}>1 hour per day</option>
                  <option value={2}>2 hours per day</option>
                  <option value={3}>3 hours per day</option>
                  <option value={4}>4+ hours per day (Intensive)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-alice mb-1">Current Knowledge Level</label>
                <select
                  value={currentLevel}
                  onChange={(e) => setCurrentLevel(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-brand-surface border border-brand-border focus:border-salesport text-alice text-xs outline-none"
                >
                  <option value="beginner">Beginner (Starting from scratch)</option>
                  <option value="intermediate">Intermediate (Basic foundation)</option>
                  <option value="advanced">Advanced (Exam polish & practice)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-alice mb-1">Preferred Time of Day</label>
                <select
                  value={preferredTime}
                  onChange={(e) => setPreferredTime(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-brand-surface border border-brand-border focus:border-salesport text-alice text-xs outline-none"
                >
                  <option value="Morning">Early Morning (6 AM - 10 AM)</option>
                  <option value="Afternoon">Afternoon (12 PM - 4 PM)</option>
                  <option value="Evening">Evening (6 PM - 10 PM)</option>
                  <option value="Night">Late Night (10 PM - 2 AM)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-alice mb-1">
                  Focus Topics / Syllabus (Comma-separated)
                </label>
                <input
                  type="text"
                  value={topics}
                  onChange={(e) => setTopics(e.target.value)}
                  placeholder="Concurrency, Raft, Mutex, Deadlocks"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-brand-surface border border-brand-border focus:border-salesport text-alice text-xs outline-none"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2.5 rounded-xl bg-brand-surface text-alice-muted hover:text-alice text-xs font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={generating}
                className="px-6 py-2.5 rounded-xl text-xs font-bold text-alice glow-button flex items-center gap-2 disabled:opacity-50"
              >
                {generating ? (
                  <span>Generating Custom Roadmap...</span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Roadmap</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <LoadingSpinner message="Retrieving your study schedules..." />
      ) : plans.length === 0 ? (
        <div className="glass-card rounded-3xl p-12 text-center border border-brand-border">
          <Calendar className="w-12 h-12 mx-auto text-alice-muted/40 mb-3" />
          <h3 className="text-base font-bold text-alice">No Study Plans Active</h3>
          <p className="text-xs text-alice-muted max-w-sm mx-auto mt-1 mb-4">
            Create an AI study roadmap to stay organized, manage your deadlines, and complete tasks systematically.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-alice glow-button inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create First Plan</span>
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {plans.map((plan) => (
            <div
              key={plan._id}
              className="glass-card rounded-3xl p-6 sm:p-8 border border-brand-border shadow-xl space-y-6"
            >
              {/* Plan Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-salesport/15 text-salesport-light border border-salesport/30">
                      {plan.currentKnowledgeLevel} Level
                    </span>
                    <span className="text-xs text-alice-muted">
                      Preferred: {plan.preferredStudyTime}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-alice mt-1">{plan.subject}</h2>
                  <div className="flex items-center gap-4 text-xs text-alice-muted mt-1">
                    <span className="flex items-center gap-1">
                      <Target className="w-3.5 h-3.5 text-salesport" />
                      Exam: {new Date(plan.examDate).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-salesport" />
                      {plan.dailyHours} hrs / day
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-sm font-black text-salesport-light">{plan.progress}% Complete</div>
                    <div className="w-32 h-2 bg-brand-surface rounded-full overflow-hidden border border-brand-border mt-1">
                      <div
                        className="h-full bg-salesport transition-all duration-300"
                        style={{ width: `${plan.progress}%` }}
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeletePlan(plan._id, plan.subject)}
                    className="p-2 rounded-xl text-alice-muted hover:text-rose-400 hover:bg-rose-500/10 transition"
                    title="Delete Plan"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Day-by-Day Milestone Task List */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-alice-muted flex items-center gap-2">
                  <ListTodo className="w-4 h-4 text-salesport" />
                  <span>Daily Milestones & Checklist</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {plan.tasks.map((task) => (
                    <div
                      key={task._id}
                      onClick={() => handleToggleTask(plan._id, task._id, task.isCompleted)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                        task.isCompleted
                          ? 'bg-emerald-500/10 border-emerald-500/30'
                          : 'bg-brand-surface/60 border-brand-border hover:border-salesport/40'
                      }`}
                    >
                      <button
                        type="button"
                        className={`mt-0.5 w-5 h-5 rounded-lg border flex items-center justify-center transition-colors ${
                          task.isCompleted
                            ? 'bg-emerald-500 border-emerald-400 text-black'
                            : 'border-brand-border bg-brand-surface'
                        }`}
                      >
                        {task.isCompleted && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </button>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className={`text-xs font-bold ${
                              task.isCompleted ? 'line-through text-alice-muted' : 'text-alice'
                            }`}
                          >
                            {task.dayLabel || `Day ${task.day}: ${task.topic}`}
                          </span>
                          <span className="text-[10px] text-alice-muted px-2 py-0.5 rounded bg-brand-surface border border-brand-border flex-shrink-0">
                            {task.durationMinutes} min
                          </span>
                        </div>

                        {task.description && (
                          <p className="text-[11px] text-alice-muted mt-1 leading-snug">
                            {task.description}
                          </p>
                        )}

                        {task.actionItems && task.actionItems.length > 0 && (
                          <ul className="mt-2 space-y-1">
                            {task.actionItems.map((item, iIdx) => (
                              <li
                                key={iIdx}
                                className={`text-[10px] flex items-center gap-1.5 ${
                                  task.isCompleted ? 'text-alice-muted/60' : 'text-alice-muted'
                                }`}
                              >
                                <span className="w-1 h-1 rounded-full bg-salesport" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
