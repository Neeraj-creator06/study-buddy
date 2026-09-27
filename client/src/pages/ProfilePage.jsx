import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import {
  User,
  Mail,
  Lock,
  Sparkles,
  Flame,
  CheckCircle2,
  AlertCircle,
  Clock,
  Shield,
  BookOpen,
} from 'lucide-react';

export default function ProfilePage() {
  const { user, updateUserData } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [preferredSubjects, setPreferredSubjects] = useState(
    user?.preferences?.preferredSubjects?.join(', ') || 'Computer Science, Software Architecture'
  );
  const [dailyGoal, setDailyGoal] = useState(user?.preferences?.dailyStudyGoal || 60);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword && newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    try {
      setSaving(true);
      const payload = {
        name,
        preferredSubjects: preferredSubjects.split(',').map((s) => s.trim()).filter(Boolean),
        dailyStudyGoal: Number(dailyGoal),
      };

      if (newPassword) {
        payload.currentPassword = currentPassword;
        payload.newPassword = newPassword;
      }

      const res = await authService.updateProfile(payload);
      if (res.success && res.data.user) {
        updateUserData(res.data.user);
        setSuccess('Profile updated successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-alice tracking-tight flex items-center gap-2.5">
          <User className="w-7 h-7 text-salesport" />
          Student Account & Preferences
        </h1>
        <p className="text-xs sm:text-sm text-alice-muted mt-1">
          Manage your student profile, daily study goals, and security credentials.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
          <span>{success}</span>
        </div>
      )}

      {/* Account Overview Card */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-brand-border flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-salesport/20 border border-salesport/40 flex items-center justify-center text-salesport text-2xl font-black uppercase">
            {user?.name ? user.name[0] : 'S'}
          </div>
          <div>
            <h2 className="text-lg font-bold text-alice">{user?.name}</h2>
            <p className="text-xs text-alice-muted">{user?.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-salesport/20 text-salesport border border-salesport/30 flex items-center gap-1">
                {user?.role === 'admin' ? <Shield className="w-3 h-3" /> : <BookOpen className="w-3 h-3" />}
                {user?.role}
              </span>
              <span className="text-xs text-orange-400 font-semibold flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 fill-orange-400/20" />
                {user?.streak || 1} Day Streak
              </span>
            </div>
          </div>
        </div>

        <div className="text-center sm:text-right text-xs text-alice-muted border-t sm:border-t-0 sm:border-l border-brand-border pt-4 sm:pt-0 sm:pl-6 w-full sm:w-auto">
          <p>Active Account Status: <strong className="text-emerald-400 capitalize">{user?.status || 'Active'}</strong></p>
          <p className="mt-1">Daily Study Target: <strong className="text-alice">{dailyGoal} mins</strong></p>
        </div>
      </div>

      {/* Edit Profile Form */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-brand-border">
        <form onSubmit={handleUpdateProfile} className="space-y-6">
          <h3 className="text-base font-bold text-alice flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-salesport" />
            General Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-alice mb-1.5">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-brand-surface border border-brand-border focus:border-salesport text-alice text-xs outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-alice mb-1.5">Email Address</label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full px-3.5 py-2.5 rounded-xl bg-brand-night/60 border border-brand-border text-alice-muted/60 text-xs cursor-not-allowed outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-alice mb-1.5">
                Preferred Study Subjects (Comma-separated)
              </label>
              <input
                type="text"
                value={preferredSubjects}
                onChange={(e) => setPreferredSubjects(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-brand-surface border border-brand-border focus:border-salesport text-alice text-xs outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-alice mb-1.5">
                Daily Study Target (Minutes)
              </label>
              <input
                type="number"
                min="15"
                max="480"
                value={dailyGoal}
                onChange={(e) => setDailyGoal(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-brand-surface border border-brand-border focus:border-salesport text-alice text-xs outline-none"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-brand-border/60">
            <h3 className="text-base font-bold text-alice mb-4 flex items-center gap-2">
              <Lock className="w-4 h-4 text-salesport" />
              Security & Password (Optional)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-alice mb-1.5">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-brand-surface border border-brand-border focus:border-salesport text-alice text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-alice mb-1.5">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 chars"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-brand-surface border border-brand-border focus:border-salesport text-alice text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-alice mb-1.5">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-brand-surface border border-brand-border focus:border-salesport text-alice text-xs outline-none"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl text-xs font-bold text-alice glow-button flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? <span>Saving Changes...</span> : <span>Save Changes</span>}
          </button>
        </form>
      </div>
    </div>
  );
}
