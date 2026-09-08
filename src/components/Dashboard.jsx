import React, { useEffect, useState } from 'react';
import { fetchAnalytics } from '../services/api';
import { 
  Users, CheckCircle2, XCircle, Clock, DollarSign, 
  AlertTriangle, ArrowUpRight, Activity, ShieldCheck, 
  Compass, Syringe, FileText, QrCode
} from 'lucide-react';

export default function Dashboard({ setActiveTab, setSelectedPatient, setPrintModal }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await fetchAnalytics();
      setStats(data);
    } catch (err) {
      console.error("Failed to load analytics:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  const { totalRegistrations, fitCount, unfitCount, inProcessCount, revenue, countryMap, lowStockAlerts, recentLogs } = stats || {};

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-950 via-slate-900 to-indigo-950 p-6 md:p-8 border border-cyan-500/20 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-3">
              <Activity className="w-3.5 h-3.5 animate-pulse" /> Live Operational Dashboard
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              VisaMedicals <span className="text-cyan-400">Pro</span>
            </h1>
            <p className="mt-2 text-slate-300 max-w-xl text-sm md:text-base">
              GCC & Maritime Shipping Medical Examination System with Biometric Verification, Automated Diagnostic Entry, and Token Queuing.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setActiveTab('register')}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-sm shadow-lg shadow-cyan-500/25 transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
            >
              <Users className="w-4 h-4" /> New Visa Medical
            </button>
            <button
              onClick={() => setActiveTab('shipping-register')}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
            >
              <Compass className="w-4 h-4" /> Seafarer Intake
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Patients */}
        <div className="glass-panel p-5 rounded-xl border border-slate-700/50 hover:border-cyan-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Patients</span>
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-bold text-white">{totalRegistrations}</span>
            <span className="text-xs text-emerald-400 ml-2 font-medium inline-flex items-center">
              +12% <ArrowUpRight className="w-3 h-3 ml-0.5" />
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Registered candidates today</p>
        </div>

        {/* FIT Count */}
        <div className="glass-panel p-5 rounded-xl border border-slate-700/50 hover:border-emerald-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">FIT Certified</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-bold text-emerald-400">{fitCount}</span>
            <span className="text-xs text-slate-400 ml-2 font-medium">
              ({totalRegistrations ? Math.round((fitCount / totalRegistrations) * 100) : 0}%)
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Cleared for visa / sea duty</p>
        </div>

        {/* UNFIT Count */}
        <div className="glass-panel p-5 rounded-xl border border-slate-700/50 hover:border-rose-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">UNFIT Status</span>
            <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400">
              <XCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-bold text-rose-400">{unfitCount}</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Disqualified or restricted</p>
        </div>

        {/* In Process Queue */}
        <div className="glass-panel p-5 rounded-xl border border-slate-700/50 hover:border-amber-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">In Process Queue</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-bold text-amber-300">{inProcessCount}</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Lab / Physical Exam active</p>
        </div>

        {/* Total Revenue */}
        <div className="glass-panel p-5 rounded-xl border border-slate-700/50 hover:border-purple-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Fees</span>
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-bold text-purple-300">₹{revenue?.toLocaleString()}</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Registration revenue collected</p>
        </div>
      </div>

      {/* Country Distribution & Vaccine Expiry Warning */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Country Visa Volume */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-cyan-400" /> Country & Maritime Visa Volume
            </h3>
            <span className="text-xs text-slate-400 font-medium">Real-time Data</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
            {Object.entries(countryMap || {}).map(([country, count]) => (
              <div key={country} className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/30 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-cyan-400"></div>
                  <span className="text-sm font-semibold text-slate-200">{country}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-cyan-300">{count}</span>
                  <span className="text-xs text-slate-500">candidates</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Vaccine & Expiry Alerts */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" /> Vaccine Stock & Expiry
            </h3>
            <button onClick={() => setActiveTab('inventory')} className="text-xs text-cyan-400 hover:underline">
              Manage
            </button>
          </div>

          <div className="space-y-3">
            {lowStockAlerts && lowStockAlerts.length > 0 ? (
              lowStockAlerts.map((alert, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Syringe className="w-5 h-5 text-amber-400 flex-shrink-0" />
                    <div>
                      <h4 className="text-xs font-bold text-amber-200">{alert.itemName}</h4>
                      <p className="text-xs text-amber-400/80">Batch: {alert.batch} | Exp: {alert.expiry}</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-amber-400/20 text-amber-300 font-bold text-xs">
                    {alert.stock} left
                  </span>
                </div>
              ))
            ) : (
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center text-xs text-slate-400">
                All vaccine batches are sufficiently stocked and within expiration dates.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent System Activity Logs */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-400" /> Recent System Audit Logs
          </h3>
          <span className="text-xs text-slate-400 font-medium">Automatic Activity Logging</span>
        </div>

        <div className="divide-y divide-slate-800/80">
          {recentLogs && recentLogs.map((log) => (
            <div key={log.id} className="py-3 flex items-center justify-between text-xs md:text-sm">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-0.5 rounded-md bg-slate-800 text-cyan-400 font-mono text-xs uppercase font-bold">
                  {log.user}
                </span>
                <span className="text-slate-300">{log.action}</span>
              </div>
              <span className="text-slate-500 font-mono text-xs">
                {new Date(log.timestamp).toLocaleTimeString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
