import React, { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import {
  Shield,
  Users,
  FileText,
  HelpCircle,
  Award,
  Search,
  Trash2,
  UserCheck,
  UserX,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsRes, usersRes] = await Promise.all([
        adminService.getAdminStats(),
        adminService.getAllUsers({ search: search || undefined, role: roleFilter !== 'all' ? roleFilter : undefined }),
      ]);

      if (statsRes.success) setStats(statsRes.data);
      if (usersRes.success) setUsers(usersRes.data.users || []);
    } catch (err) {
      console.error('Failed to load admin data:', err);
      setError('Failed to fetch administrator records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [roleFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadData();
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      setError('');
      setSuccess('');
      const res = await adminService.updateUserRole(userId, newRole);
      if (res.success) {
        setSuccess(`User role updated to ${newRole}`);
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
        );
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update role.');
    }
  };

  const handleToggleStatus = async (userId) => {
    try {
      setError('');
      setSuccess('');
      const res = await adminService.toggleUserStatus(userId);
      if (res.success && res.data.user) {
        setSuccess(`User status changed to ${res.data.user.status}`);
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, status: res.data.user.status } : u))
        );
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change user status.');
    }
  };

  const handleDeleteUser = async (userId, name) => {
    if (!window.confirm(`Permanently delete account for "${name}"?`)) return;
    try {
      setError('');
      setSuccess('');
      const res = await adminService.deleteUser(userId);
      if (res.success) {
        setSuccess(`User "${name}" deleted.`);
        setUsers((prev) => prev.filter((u) => u._id !== userId));
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete user.');
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-amber-400 tracking-tight flex items-center gap-2.5">
          <Shield className="w-7 h-7 text-amber-400" />
          Administrator Control Center
        </h1>
        <p className="text-xs sm:text-sm text-alice-muted mt-1">
          Monitor global platform utilization, manage registered students, and supervise system permissions.
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

      {/* Global Analytics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="glass-card rounded-2xl p-5 border border-brand-border">
          <span className="text-xs font-semibold text-alice-muted block mb-1">Total Users</span>
          <div className="text-3xl font-black text-alice">{stats?.totalUsers || 0}</div>
          <span className="text-[10px] text-salesport-light mt-1 block">Registered Accounts</span>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-brand-border">
          <span className="text-xs font-semibold text-alice-muted block mb-1">Active Accounts</span>
          <div className="text-3xl font-black text-emerald-400">{stats?.activeUsers || 0}</div>
          <span className="text-[10px] text-emerald-400/80 mt-1 block">Operational Status</span>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-brand-border">
          <span className="text-xs font-semibold text-alice-muted block mb-1">Study Materials</span>
          <div className="text-3xl font-black text-salesport">{stats?.totalMaterials || 0}</div>
          <span className="text-[10px] text-salesport-light mt-1 block">Uploaded & Extracted</span>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-brand-border">
          <span className="text-xs font-semibold text-alice-muted block mb-1">AI Summaries</span>
          <div className="text-3xl font-black text-indigo-400">{stats?.totalSummaries || 0}</div>
          <span className="text-[10px] text-indigo-400/80 mt-1 block">Generated by Gemini</span>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-brand-border">
          <span className="text-xs font-semibold text-alice-muted block mb-1">Platform Avg Score</span>
          <div className="text-3xl font-black text-amber-400">{stats?.averageQuizScore || 0}%</div>
          <span className="text-[10px] text-amber-400/80 mt-1 block">Across All Assessments</span>
        </div>
      </div>

      {/* User Management Section */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-brand-border space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-base font-bold text-alice flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-400" />
            <span>User Directory & RBAC Management</span>
          </h2>

          {/* Search & Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-alice-muted" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name or email..."
                className="pl-8 pr-3 py-1.5 rounded-xl bg-brand-surface border border-brand-border focus:border-amber-400 text-alice text-xs outline-none"
              />
            </form>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-brand-surface border border-brand-border text-alice text-xs outline-none"
            >
              <option value="all">All Roles</option>
              <option value="student">Students</option>
              <option value="admin">Administrators</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        {loading ? (
          <LoadingSpinner message="Querying platform user directory..." />
        ) : users.length === 0 ? (
          <div className="text-center py-8 text-xs text-alice-muted">
            No matching users found in the system.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-brand-border text-alice-muted uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Joined Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border/60">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-brand-surface/40 transition">
                    <td className="py-3 px-4">
                      <div className="font-bold text-alice">{u.name}</div>
                      <div className="text-[11px] text-alice-muted">{u.email}</div>
                    </td>

                    <td className="py-3 px-4">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                        className={`text-[11px] font-bold px-2 py-1 rounded-lg border outline-none bg-brand-surface ${
                          u.role === 'admin'
                            ? 'text-amber-400 border-amber-500/40'
                            : 'text-salesport border-salesport/40'
                        }`}
                      >
                        <option value="student">Student</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                          u.status === 'active'
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        {u.status || 'active'}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-alice-muted">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>

                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleToggleStatus(u._id)}
                        className="p-1.5 rounded-lg bg-brand-surface border border-brand-border hover:border-amber-400 text-alice-muted hover:text-amber-300 transition"
                        title={u.status === 'active' ? 'Disable Account' : 'Activate Account'}
                      >
                        {u.status === 'active' ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5 text-emerald-400" />}
                      </button>

                      <button
                        onClick={() => handleDeleteUser(u._id, u.name)}
                        className="p-1.5 rounded-lg bg-brand-surface border border-brand-border hover:border-rose-500 text-alice-muted hover:text-rose-400 transition"
                        title="Delete User"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
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
