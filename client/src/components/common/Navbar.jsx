import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import {
  Sparkles,
  Flame,
  LogOut,
  User,
  Shield,
  Sun,
  Moon,
  Menu,
  X,
  BookOpen,
} from 'lucide-react';

export default function Navbar({ onToggleSidebar }) {
  const { user, logout, isAdmin } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-brand-night/80 backdrop-blur-xl border-b border-brand-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left Side: Mobile Menu Button & Brand */}
        <div className="flex items-center space-x-3">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-lg text-alice-muted hover:text-alice hover:bg-prussian-light/50 transition"
              aria-label="Toggle Navigation"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <Link to={user ? '/dashboard' : '/'} className="flex items-center space-x-2.5 group">
            {/* Logo Badge matching user's SalesPort brand aesthetic */}
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-salesport to-prussian border border-salesport/50 flex items-center justify-center text-alice shadow-lg shadow-salesport/30 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-alice" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-extrabold tracking-tight text-alice flex items-center gap-1.5">
                AI StudyBuddy
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded bg-salesport/20 text-salesport-light border border-salesport/30">
                  GenAI
                </span>
              </span>
              <span className="text-[10px] text-alice-muted -mt-0.5 tracking-wide">
                Smart Learning Assistant
              </span>
            </div>
          </Link>
        </div>

        {/* Right Side: Streak, Theme Toggle, Profile Menu */}
        <div className="flex items-center space-x-3">
          {user && (
            <div
              className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-semibold shadow-inner"
              title="Consecutive Daily Study Streak"
            >
              <Flame className="w-4 h-4 text-orange-400 fill-orange-400/30 animate-bounce" />
              <span>{user.streak || 1} Day Streak</span>
            </div>
          )}

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-alice-muted hover:text-alice bg-brand-surface/60 border border-brand-border hover:border-salesport/40 transition"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-salesport" />}
          </button>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-2 p-1.5 pl-2 rounded-xl bg-brand-card border border-brand-border hover:border-salesport/50 transition focus:outline-none"
              >
                <div className="w-7 h-7 rounded-lg bg-salesport/20 border border-salesport/40 flex items-center justify-center text-salesport font-bold text-xs uppercase">
                  {user.name ? user.name[0] : 'S'}
                </div>
                <span className="hidden md:inline text-xs font-medium text-alice max-w-[120px] truncate">
                  {user.name}
                </span>
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-brand-card/95 backdrop-blur-xl border border-brand-border shadow-2xl z-50 py-2 divide-y divide-brand-border">
                    <div className="px-4 py-2.5">
                      <p className="text-xs font-semibold text-alice truncate">{user.name}</p>
                      <p className="text-[11px] text-alice-muted truncate">{user.email}</p>
                      <span className="inline-flex items-center gap-1 mt-1.5 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-salesport/20 text-salesport border border-salesport/30">
                        {user.role === 'admin' ? (
                          <>
                            <Shield className="w-2.5 h-2.5" /> Admin
                          </>
                        ) : (
                          <>
                            <BookOpen className="w-2.5 h-2.5" /> Student
                          </>
                        )}
                      </span>
                    </div>

                    <div className="py-1">
                      <Link
                        to="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center space-x-2 px-4 py-2 text-xs text-alice hover:bg-salesport/15 hover:text-white transition"
                      >
                        <User className="w-4 h-4 text-salesport" />
                        <span>Profile & Settings</span>
                      </Link>

                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center space-x-2 px-4 py-2 text-xs text-amber-300 hover:bg-amber-400/15 transition"
                        >
                          <Shield className="w-4 h-4 text-amber-400" />
                          <span>Admin Control Panel</span>
                        </Link>
                      )}
                    </div>

                    <div className="py-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-2 px-4 py-2 text-xs text-rose-400 hover:bg-rose-500/15 transition text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link
                to="/login"
                className="px-3.5 py-1.5 rounded-xl text-xs font-medium text-alice hover:text-white hover:bg-white/5 transition"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-4 py-1.5 rounded-xl text-xs font-semibold text-alice glow-button flex items-center gap-1"
              >
                <span>Get Started</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
