import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../api/admin.api';
import { useSocket } from '../context/SocketContext';
import { 
  BarChart, Bar, 
  XAxis, YAxis, Tooltip, Legend, 
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { 
  Loader2, 
  AlertCircle, 
  ClipboardList, 
  CheckCircle2, 
  Clock, 
  ShieldAlert, 
  Layers, 
  Sparkles, 
  User, 
  Building2, 
  Map, 
  TrendingUp,
  Activity,
  Bell
} from 'lucide-react';
import { toast } from 'react-toastify';

const COLORS = ['#2563EB', '#F59E0B', '#16A34A', '#DC2626', '#8B5CF6', '#EC4899', '#64748B'];

export default function AdminDashboard() {
  const socket = useSocket();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = useCallback(async (showLoading = true) => {
    if (showLoading) setLoading(true);
    setError('');
    try {
      const res = await adminApi.dashboard();
      if (res.data.success) {
        setData(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching admin dashboard stats:', err);
      setError(err.message || 'Failed to sync with command center analytics.');
    } finally {
      if (showLoading) setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData(true);
  }, [loadData]);

  // Real-time socket updates for Admin Dashboard
  useEffect(() => {
    if (!socket) return;

    const handleDashboardSocketUpdate = (payload) => {
      console.log('🔄 Sockets update received on Admin Dashboard:', payload);
      // Reload stats silently in the background
      loadData(false);
    };

    socket.on('notification', handleDashboardSocketUpdate);
    socket.on('status-updated', handleDashboardSocketUpdate);
    socket.on('ai-completed', handleDashboardSocketUpdate);
    socket.on('worker-assigned', handleDashboardSocketUpdate);

    return () => {
      socket.off('notification', handleDashboardSocketUpdate);
      socket.off('status-updated', handleDashboardSocketUpdate);
      socket.off('ai-completed', handleDashboardSocketUpdate);
      socket.off('worker-assigned', handleDashboardSocketUpdate);
    };
  }, [socket, loadData]);

  if (loading && !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-2">
          <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto" />
          <p className="text-xs font-semibold text-slate-400">Syncing Civic Incident Control Center...</p>
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="bg-white p-6 rounded-card border border-slate-200 shadow-soft max-w-md text-center space-y-4">
          <AlertCircle className="w-10 h-10 text-danger mx-auto" />
          <h2 className="text-base font-bold text-slate-800">Connection Interrupted</h2>
          <p className="text-xs text-slate-500">{error}</p>
          <button 
            onClick={() => loadData(true)}
            className="w-full bg-primary text-white py-2 rounded-button text-xs font-bold hover:bg-primary-dark transition"
          >
            Reconnect
          </button>
        </div>
      </div>
    );
  }

  const { overview, categoryDistribution, priorityDistribution, statusDistribution, departmentPerformance, workerPerformance } = data || {};

  // Formatted charts data
  const statusChartData = statusDistribution?.map(item => ({
    name: item._id,
    value: item.count
  })) || [];

  const categoryChartData = categoryDistribution?.map(item => ({
    name: item._id,
    value: item.count
  })) || [];

  const deptChartData = departmentPerformance?.map(dept => ({
    name: dept.code,
    resolved: dept.performance?.totalResolved || 0,
    active: dept.performance?.activeComplaints || 0
  })) || [];

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Navigation & Action Header */}
        <header className="bg-white border border-slate-200 rounded-card p-5 shadow-soft flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="text-[10px] font-bold text-primary uppercase tracking-wider font-outfit bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
              Administrative Control Console
            </span>
            <h1 className="text-xl font-extrabold font-outfit text-slate-900 mt-1">Civic Operations Control Center</h1>
            <p className="text-xs text-slate-500 mt-0.5">Real-time supervision desk for city departments, field units, and AI workflows.</p>
          </div>
          
          <nav className="flex flex-wrap gap-2.5">
            <Link to="/admin/complaints" className="inline-flex items-center gap-1.5 bg-white border border-slate-200 text-slate-700 px-3.5 py-2 rounded-button text-xs font-bold shadow-sm hover:bg-slate-50 transition">
              <ClipboardList className="w-3.5 h-3.5" />
              <span>Complaints</span>
            </Link>
            <Link to="/admin/map" className="inline-flex items-center gap-1.5 bg-white border border-slate-200 text-slate-700 px-3.5 py-2 rounded-button text-xs font-bold shadow-sm hover:bg-slate-50 transition">
              <Map className="w-3.5 h-3.5" />
              <span>Operations Map</span>
            </Link>
            <Link to="/admin/workers" className="inline-flex items-center gap-1.5 bg-white border border-slate-200 text-slate-700 px-3.5 py-2 rounded-button text-xs font-bold shadow-sm hover:bg-slate-50 transition">
              <User className="w-3.5 h-3.5" />
              <span>Workers</span>
            </Link>
            <Link to="/admin/departments" className="inline-flex items-center gap-1.5 bg-white border border-slate-200 text-slate-700 px-3.5 py-2 rounded-button text-xs font-bold shadow-sm hover:bg-slate-50 transition">
              <Building2 className="w-3.5 h-3.5" />
              <span>Departments</span>
            </Link>
            <Link to="/admin/analytics" className="inline-flex items-center gap-1.5 bg-white border border-slate-200 text-slate-700 px-3.5 py-2 rounded-button text-xs font-bold shadow-sm hover:bg-slate-50 transition">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Deep Analytics</span>
            </Link>
            <Link to="/admin/notifications" className="inline-flex items-center gap-1.5 bg-primary text-white px-3.5 py-2 rounded-button text-xs font-bold shadow hover:bg-primary-dark transition">
              <Bell className="w-3.5 h-3.5" />
              <span>Alert Logs</span>
            </Link>
          </nav>
        </header>

        {/* 10 KPI Overview Card Grid */}
        <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="bg-white border border-slate-200 p-4 rounded-card shadow-soft">
            <div className="mb-2.5 h-8 w-8 rounded-lg bg-blue-50 text-primary flex items-center justify-center">
              <ClipboardList className="h-4.5 w-4.5" />
            </div>
            <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Total Incidents</p>
            <p className="mt-0.5 font-outfit text-xl font-extrabold text-slate-900">{overview?.totalComplaints || 0}</p>
          </div>

          <div className="bg-white border border-slate-200 p-4 rounded-card shadow-soft">
            <div className="mb-2.5 h-8 w-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
              <Clock className="h-4.5 w-4.5" />
            </div>
            <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Pending Review</p>
            <p className="mt-0.5 font-outfit text-xl font-extrabold text-slate-900">{overview?.pendingComplaints || 0}</p>
          </div>

          <div className="bg-white border border-slate-200 p-4 rounded-card shadow-soft">
            <div className="mb-2.5 h-8 w-8 rounded-lg bg-amber-50 text-warning flex items-center justify-center">
              <Clock className="h-4.5 w-4.5 animate-pulse" />
            </div>
            <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Queue Assigned</p>
            <p className="mt-0.5 font-outfit text-xl font-extrabold text-slate-900">{overview?.assignedComplaints || 0}</p>
          </div>

          <div className="bg-white border border-slate-200 p-4 rounded-card shadow-soft">
            <div className="mb-2.5 h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Activity className="h-4.5 w-4.5" />
            </div>
            <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">In Progress</p>
            <p className="mt-0.5 font-outfit text-xl font-extrabold text-slate-900">{overview?.inProgressComplaints || 0}</p>
          </div>

          <div className="bg-white border border-slate-200 p-4 rounded-card shadow-soft">
            <div className="mb-2.5 h-8 w-8 rounded-lg bg-emerald-50 text-success flex items-center justify-center">
              <CheckCircle2 className="h-4.5 w-4.5" />
            </div>
            <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Resolved</p>
            <p className="mt-0.5 font-outfit text-xl font-extrabold text-slate-900">{overview?.resolvedComplaints || 0}</p>
          </div>

          <div className="bg-white border border-slate-200 p-4 rounded-card shadow-soft">
            <div className="mb-2.5 h-8 w-8 rounded-lg bg-slate-50 text-slate-500 flex items-center justify-center">
              <CheckCircle2 className="h-4.5 w-4.5" />
            </div>
            <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Closed (Audited)</p>
            <p className="mt-0.5 font-outfit text-xl font-extrabold text-slate-900">{overview?.closedComplaints || 0}</p>
          </div>

          <div className="bg-white border border-slate-200 p-4 rounded-card shadow-soft">
            <div className="mb-2.5 h-8 w-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
              <ShieldAlert className="h-4.5 w-4.5 animate-bounce" />
            </div>
            <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">High Priority</p>
            <p className="mt-0.5 font-outfit text-xl font-extrabold text-slate-900">{overview?.highPriority || 0}</p>
          </div>

          <div className="bg-white border border-slate-200 p-4 rounded-card shadow-soft">
            <div className="mb-2.5 h-8 w-8 rounded-lg bg-red-50 text-danger flex items-center justify-center">
              <ShieldAlert className="h-4.5 w-4.5 animate-pulse" />
            </div>
            <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Critical Priority</p>
            <p className="mt-0.5 font-outfit text-xl font-extrabold text-slate-900">{overview?.criticalPriority || 0}</p>
          </div>

          <div className="bg-white border border-slate-200 p-4 rounded-card shadow-soft">
            <div className="mb-2.5 h-8 w-8 rounded-lg bg-emerald-50 text-success flex items-center justify-center">
              <Sparkles className="h-4.5 w-4.5" />
            </div>
            <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">AI Verified Resolved</p>
            <p className="mt-0.5 font-outfit text-xl font-extrabold text-slate-900">{overview?.aiVerified || 0}</p>
          </div>

          <div className="bg-white border border-slate-200 p-4 rounded-card shadow-soft">
            <div className="mb-2.5 h-8 w-8 rounded-lg bg-blue-50 text-primary flex items-center justify-center">
              <Clock className="h-4.5 w-4.5" />
            </div>
            <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Avg Resolution Time</p>
            <p className="mt-0.5 font-outfit text-sm font-extrabold text-slate-900">
              {overview?.averageCompletionHours ? `${overview.averageCompletionHours.toFixed(1)} hours` : 'N/A'}
            </p>
          </div>
        </section>

        {/* Charts Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Status distribution */}
          <div className="bg-white border border-slate-200 rounded-card p-5 shadow-soft space-y-4">
            <h3 className="font-outfit font-extrabold text-slate-900 text-sm">Complaint Status distribution</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statusChartData}>
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip />
                  <Bar dataKey="value" name="Complaints" fill="#2563EB" radius={[4, 4, 0, 0]}>
                    {statusChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category distribution */}
          <div className="bg-white border border-slate-200 rounded-card p-5 shadow-soft space-y-4">
            <h3 className="font-outfit font-extrabold text-slate-900 text-sm">Incident category distribution</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryChartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {categoryChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Department Performance */}
          <div className="bg-white border border-slate-200 rounded-card p-5 shadow-soft space-y-4 col-span-1 lg:col-span-2">
            <h3 className="font-outfit font-extrabold text-slate-900 text-sm">Department Resolution Performance</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={deptChartData}>
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="resolved" name="Resolved Tasks" fill="#16A34A" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="active" name="Active Tasks" fill="#2563EB" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* Dense Summaries Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Department performance detail summary */}
          <div className="bg-white border border-slate-200 rounded-card p-5 shadow-soft space-y-3">
            <h3 className="font-outfit font-extrabold text-slate-900 text-sm">Department Performance Overview</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs divide-y divide-slate-100">
                <thead>
                  <tr className="text-slate-500 font-bold bg-slate-50">
                    <th className="p-2.5">Code</th>
                    <th className="p-2.5">Name</th>
                    <th className="p-2.5 text-center">Active</th>
                    <th className="p-2.5 text-center">Resolved</th>
                    <th className="p-2.5 text-center">Rating</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  {departmentPerformance?.slice(0, 5).map((dept) => (
                    <tr key={dept._id} className="hover:bg-slate-50/50">
                      <td className="p-2.5 font-bold text-slate-900">{dept.code}</td>
                      <td className="p-2.5 truncate max-w-[150px]">{dept.name}</td>
                      <td className="p-2.5 text-center">{dept.performance?.activeComplaints || 0}</td>
                      <td className="p-2.5 text-center">{dept.performance?.totalResolved || 0}</td>
                      <td className="p-2.5 text-center font-bold text-amber-600">
                        {dept.performance?.rating ? `${dept.performance.rating.toFixed(1)} ★` : '5.0 ★'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Worker summary stats */}
          <div className="bg-white border border-slate-200 rounded-card p-5 shadow-soft space-y-3">
            <h3 className="font-outfit font-extrabold text-slate-900 text-sm">Top Field Agents</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs divide-y divide-slate-100">
                <thead>
                  <tr className="text-slate-500 font-bold bg-slate-50">
                    <th className="p-2.5">Agent</th>
                    <th className="p-2.5">Department</th>
                    <th className="p-2.5 text-center">Active Load</th>
                    <th className="p-2.5 text-center">Completed</th>
                    <th className="p-2.5 text-center">Rating</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  {workerPerformance?.slice(0, 5).map((worker) => (
                    <tr key={worker._id} className="hover:bg-slate-50/50">
                      <td className="p-2.5 font-semibold text-slate-900">{worker.fullName}</td>
                      <td className="p-2.5">{worker.department?.code || 'N/A'}</td>
                      <td className="p-2.5 text-center">{worker.workload || 0}</td>
                      <td className="p-2.5 text-center">{worker.performance?.totalResolved || 0}</td>
                      <td className="p-2.5 text-center font-bold text-amber-600">
                        {worker.performance?.rating ? `${worker.performance.rating.toFixed(1)} ★` : '5.0 ★'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
