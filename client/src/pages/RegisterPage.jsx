import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import InteractiveAuraBackground from '../components/common/InteractiveAuraBackground';
import { Sparkles, User, Mail, Lock, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    try {
      setLoading(true);
      await register({ name, email, password, confirmPassword, role });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-night text-alice relative flex items-center justify-center p-4">
      <InteractiveAuraBackground />

      <div className="relative z-10 w-full max-w-md my-8">
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center space-x-2.5 group">
            <div className="w-11 h-11 rounded-2xl bg-salesport flex items-center justify-center text-alice shadow-lg shadow-salesport/40 group-hover:scale-105 transition-transform">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="text-left">
              <span className="text-2xl font-black tracking-tight text-alice block leading-none">
                AI StudyBuddy
              </span>
              <span className="text-[11px] text-alice-muted uppercase tracking-wider font-semibold">
                Student Registration
              </span>
            </div>
          </Link>
        </div>

        <div className="glass-card rounded-3xl p-8 border border-brand-border shadow-2xl relative">
          <h2 className="text-xl font-bold text-alice mb-1">Create Your Account</h2>
          <p className="text-xs text-alice-muted mb-6">Join AI StudyBuddy and supercharge your academic journey.</p>

          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-alice mb-1.5">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-3.5 text-alice-muted" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Johnson"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-brand-surface border border-brand-border focus:border-salesport focus:ring-1 focus:ring-salesport text-alice text-xs placeholder:text-alice-muted/50 outline-none transition"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-alice mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-alice-muted" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@university.edu"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-brand-surface border border-brand-border focus:border-salesport focus:ring-1 focus:ring-salesport text-alice text-xs placeholder:text-alice-muted/50 outline-none transition"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-alice mb-1.5">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-alice-muted" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-brand-surface border border-brand-border focus:border-salesport focus:ring-1 focus:ring-salesport text-alice text-xs placeholder:text-alice-muted/50 outline-none transition"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-alice mb-1.5">Confirm Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-alice-muted" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-brand-surface border border-brand-border focus:border-salesport focus:ring-1 focus:ring-salesport text-alice text-xs placeholder:text-alice-muted/50 outline-none transition"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-alice mb-1.5">Account Role</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('student')}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border transition ${
                    role === 'student'
                      ? 'bg-salesport text-alice border-salesport shadow-md'
                      : 'bg-brand-surface text-alice-muted border-brand-border hover:border-salesport/40'
                  }`}
                >
                  Student
                </button>
                <button
                  type="button"
                  onClick={() => setRole('admin')}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border transition ${
                    role === 'admin'
                      ? 'bg-amber-500 text-black border-amber-500 shadow-md font-bold'
                      : 'bg-brand-surface text-alice-muted border-brand-border hover:border-amber-500/40'
                  }`}
                >
                  Admin (Demo)
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 rounded-xl text-xs font-bold text-alice glow-button flex items-center justify-center gap-2 disabled:opacity-60 transition"
            >
              {loading ? (
                <span>Creating Account...</span>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-alice-muted">
            Already registered?{' '}
            <Link to="/login" className="text-salesport font-semibold hover:underline">
              Sign In Instead
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
