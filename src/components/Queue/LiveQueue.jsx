import React, { useState, useEffect } from 'react';
import { fetchQueue, updatePatientStage } from '../../services/api';
import { 
  Clock, FlaskConical, Stethoscope, FileCheck, ArrowRight, 
  User, CheckCircle2, AlertCircle, RefreshCw, Radio
} from 'lucide-react';

export default function LiveQueue({ onSelectPatient, setActiveTab }) {
  const [queue, setQueue] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQueue();
    const interval = setInterval(loadQueue, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadQueue = async () => {
    try {
      const data = await fetchQueue();
      setQueue(data);
    } catch (e) {
      console.error("Failed to load token queue:", e);
    } finally {
      setLoading(false);
    }
  };

  const advanceStage = async (id, nextStage) => {
    try {
      await updatePatientStage(id, nextStage);
      loadQueue();
    } catch (e) {
      alert("Failed to advance queue stage");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  const stages = [
    { key: 'lab', title: '1. Laboratory Testing', icon: FlaskConical, color: 'text-cyan-400', nextKey: 'physical', nextLabel: 'Send to Exam' },
    { key: 'physical', title: '2. Clinical Physical Exam', icon: Stethoscope, color: 'text-indigo-400', nextKey: 'doctor', nextLabel: 'Send to Doctor' },
    { key: 'doctor', title: '3. Doctor Signoff & Decision', icon: FileCheck, color: 'text-amber-400', nextKey: 'completed', nextLabel: 'Finalize Fit' },
    { key: 'completed', title: '4. Certificate Ready', icon: CheckCircle2, color: 'text-emerald-400', nextKey: null, nextLabel: null }
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Radio className="w-6 h-6 text-cyan-400 animate-pulse" /> Live Token Queue Board
          </h2>
          <p className="text-xs text-slate-400 mt-1">Real-time candidate routing from Intake &rarr; Lab &rarr; Physical Exam &rarr; Doctor Signoff.</p>
        </div>
        <button
          onClick={loadQueue}
          className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-500/40 text-slate-300 text-xs font-semibold flex items-center gap-2 transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5 text-cyan-400" /> Refresh Board
        </button>
      </div>

      {/* 4 Column Queue Stage Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stages.map(stage => {
          const StageIcon = stage.icon;
          const items = queue ? (queue[stage.key] || []) : [];

          return (
            <div key={stage.key} className="glass-panel p-4 rounded-2xl border border-slate-800/80 flex flex-col min-h-[500px]">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <StageIcon className={`w-4 h-4 ${stage.color}`} />
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">{stage.title}</h3>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-slate-800 text-cyan-400 text-xs font-bold font-mono">
                  {items.length}
                </span>
              </div>

              <div className="flex-1 space-y-3 overflow-y-auto max-h-[600px] pr-1">
                {items.length === 0 ? (
                  <div className="text-center py-12 text-slate-500 text-xs italic">
                    No candidates waiting in this queue.
                  </div>
                ) : (
                  items.map(patient => (
                    <div
                      key={patient.id}
                      className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 transition-all space-y-3 shadow-lg"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center justify-center font-bold font-mono text-sm">
                            #{patient.token}
                          </span>
                          <div>
                            <h4 className="text-sm font-bold text-white leading-tight">
                              {patient.first_name} {patient.last_name}
                            </h4>
                            <p className="text-xs text-slate-400 font-mono">{patient.passport_no}</p>
                          </div>
                        </div>
                        <img
                          src={patient.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop'}
                          alt="Patient"
                          className="w-8 h-8 rounded-full object-cover border border-slate-700"
                        />
                      </div>

                      <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                        <span>To: <strong className="text-slate-200">{patient.travelling_to}</strong></span>
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-emerald-400 text-[10px] font-bold">
                          {patient.reg_type}
                        </span>
                      </div>

                      {/* Action buttons depending on stage */}
                      <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                        {stage.key === 'lab' && (
                          <button
                            onClick={() => {
                              if (onSelectPatient) onSelectPatient(patient);
                              if (setActiveTab) setActiveTab('lab');
                            }}
                            className="flex-1 py-1.5 rounded-lg bg-cyan-600/30 hover:bg-cyan-600/50 border border-cyan-500/40 text-cyan-200 text-xs font-semibold transition-all text-center"
                          >
                            Enter Lab Tests
                          </button>
                        )}

                        {stage.key === 'physical' && (
                          <button
                            onClick={() => {
                              if (onSelectPatient) onSelectPatient(patient);
                              if (setActiveTab) setActiveTab('medical');
                            }}
                            className="flex-1 py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-indigo-200 text-xs font-semibold transition-all text-center"
                          >
                            Perform Exam
                          </button>
                        )}

                        {stage.key === 'doctor' && (
                          <button
                            onClick={() => {
                              if (onSelectPatient) onSelectPatient(patient);
                              if (setActiveTab) setActiveTab('medical');
                            }}
                            className="flex-1 py-1.5 rounded-lg bg-amber-600/30 hover:bg-amber-600/50 border border-amber-500/40 text-amber-200 text-xs font-semibold transition-all text-center"
                          >
                            Doctor Signoff
                          </button>
                        )}

                        {stage.key === 'completed' && (
                          <button
                            onClick={() => {
                              if (onSelectPatient) onSelectPatient(patient);
                              if (setActiveTab) setActiveTab('certificate');
                            }}
                            className="flex-1 py-1.5 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-500/40 text-emerald-200 text-xs font-semibold transition-all text-center flex items-center justify-center gap-1"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Print Certificate
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
