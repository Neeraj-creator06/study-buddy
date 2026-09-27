import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  FileText,
  BookOpen,
  Layers,
  HelpCircle,
  Calendar,
  MessageSquare,
  Sparkles,
  Award,
  TrendingUp,
  User,
  Shield,
  Lightbulb,
  X,
} from 'lucide-react';

export default function Sidebar({ isOpen, onClose }) {
  const { user, isAdmin } = useAuth();

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/materials', label: 'Study Materials', icon: FileText },
    { to: '/summaries', label: 'AI Summarizer', icon: BookOpen },
    { to: '/flashcards', label: 'Smart Flashcards', icon: Layers },
    { to: '/quiz', label: 'AI Quizzes', icon: HelpCircle },
    { to: '/study-plan', label: 'Study Roadmaps', icon: Calendar },
    { to: '/ask-ai', label: 'Ask AI Tutor', icon: MessageSquare },
    { to: '/important-questions', label: 'Exam Questions', icon: Award },
    { to: '/explainer', label: 'Concept Explainer', icon: Lightbulb },
    { to: '/progress', label: 'Progress & Stats', icon: TrendingUp },
    { to: '/profile', label: 'Student Profile', icon: User },
  ];

  const adminLinks = [
    { to: '/admin', label: 'Admin Dashboard', icon: Shield },
    { to: '/admin/users', label: 'User Directory', icon: User },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 w-64 bg-brand-surface/95 backdrop-blur-xl border-r border-brand-border flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Mobile Close Header */}
        <div className="flex items-center justify-between p-4 lg:hidden border-b border-brand-border">
          <span className="text-xs font-bold uppercase tracking-wider text-alice-muted">Navigation Menu</span>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-alice-muted hover:text-alice hover:bg-white/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1.5 scrollbar-thin">
          <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-alice-muted/70">
            Study Center
          </div>

          {navLinks.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-salesport text-alice shadow-lg shadow-salesport/30 font-semibold'
                      : 'text-alice-muted hover:text-alice hover:bg-prussian-light/40'
                  }`
                }
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}

          {/* Admin Management Section */}
          {isAdmin && (
            <div className="pt-5 mt-4 border-t border-brand-border">
              <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-amber-400/90 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" />
                <span>Admin Administration</span>
              </div>
              {adminLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold shadow-md'
                          : 'text-alice-muted hover:text-amber-200 hover:bg-amber-500/10'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4 flex-shrink-0 text-amber-400" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
          )}
        </div>

        {/* Bottom AI Status Badge */}
        <div className="p-3 border-t border-brand-border bg-brand-surface/40">
          <div className="p-3 rounded-xl bg-prussian/80 border border-salesport/25 flex items-center space-x-2.5">
            <div className="w-7 h-7 rounded-lg bg-salesport/20 flex items-center justify-center text-salesport flex-shrink-0">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-semibold text-alice truncate">Gemini AI Engine</p>
              <p className="text-[10px] text-salesport-light truncate">Ready & Grounded</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
