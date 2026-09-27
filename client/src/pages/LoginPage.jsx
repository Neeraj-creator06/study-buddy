import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import InteractiveAuraBackground from '../components/common/InteractiveAuraBackground';
import { Sparkles, Mail, Lock, ArrowRight, AlertCircle, Shield, User } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    try {
      setLoading(true);
      await login({ email, password });
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoStudent = () => {
    setEmail('student@studybuddy.com');
    setPassword('password123');
    setError('');
  };

  const handleDemoAdmin = () => {
    setEmail('admin@studybuddy.com');
    setPassword('password123');
    setError('');
  };

  return (
    <div className="min-h-screen bg-brand-night text-alice relative flex items-center justify-center p-4">
      <InteractiveAuraBackground />

      <div className="relative z-10 w-full max-w-md">
        {/* Brand Header */}
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
                Sign in to continue
              </span>
            </div>
          </Link>
        </div>

        {/* Card Container */}
        <div className="glass-card rounded-3xl p-8 border border-brand-border shadow-2xl relative">
          <h2 className="text-xl font-bold text-alice mb-1">Welcome Back</h2>
          <p className="text-xs text-alice-muted mb-6">Enter your credentials to access your study materials.</p>

          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-alice mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-alice-muted" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@example.com"
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
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-brand-surface border border-brand-border focus:border-salesport focus:ring-1 focus:ring-salesport text-alice text-xs placeholder:text-alice-muted/50 outline-none transition"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-xs font-bold text-alice glow-button flex items-center justify-center gap-2 disabled:opacity-60 transition"
            >
              {loading ? (
                <span>Signing In...</span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Logins for Judges/Evaluators */}
          <div className="mt-6 pt-5 border-t border-brand-border/60">
            <span className="text-[11px] font-semibold text-alice-muted uppercase tracking-wider block text-center mb-3">
              One-Click Demo Credentials
            </span>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={handleDemoStudent}
                className="px-3 py-2 rounded-xl bg-prussian border border-salesport/30 hover:border-salesport text-alice text-[11px] font-medium flex items-center justify-center gap-1.5 transition"
              >
                <User className="w-3.5 h-3.5 text-salesport" />
                <span>Demo Student</span>
              </button>

              <button
                type="button"
                onClick={handleDemoAdmin}
                className="px-3 py-2 rounded-xl bg-prussian border border-amber-500/30 hover:border-amber-400 text-alice text-[11px] font-medium flex items-center justify-center gap-1.5 transition"
              >
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                <span>Demo Admin</span>
              </button>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-alice-muted">
            Don't have an account?{' '}
            <Link to="/register" className="text-salesport font-semibold hover:underline">
              Create an Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
