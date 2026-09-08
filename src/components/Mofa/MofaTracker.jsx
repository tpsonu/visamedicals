import React, { useState, useEffect } from 'react';
import { fetchMofaEntries, addMofaEntry } from '../../services/api';
import { ShieldCheck, Search, Plus, RefreshCw, CheckCircle2, FileText } from 'lucide-react';

export default function MofaTracker() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newMofa, setNewMofa] = useState({
    visit_id: '',
    pass_no: '',
    mofa_no: ''
  });

  useEffect(() => {
    loadMofa();
  }, []);

  const loadMofa = async () => {
    try {
      const data = await fetchMofaEntries();
      setEntries(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newMofa.pass_no || !newMofa.mofa_no) return;
    try {
      await addMofaEntry(newMofa);
      setNewMofa({ visit_id: '', pass_no: '', mofa_no: '' });
      loadMofa();
    } catch (e) {
      alert("Failed to add MOFA record: " + e.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-cyan-400" /> MOFA Data Tracker & Verification Portal
          </h2>
          <p className="text-xs text-slate-400 mt-1">Verify Ministry of Foreign Affairs (MOFA) numbers and GCC embassy portal submission logs.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Entry Form */}
        <form onSubmit={handleAdd} className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider">Add MOFA Number Record</h3>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Registration / Token Visit ID</label>
            <input
              type="text"
              value={newMofa.visit_id}
              onChange={e => setNewMofa({ ...newMofa, visit_id: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Passport Number *</label>
            <input
              type="text"
              required
              value={newMofa.pass_no}
              onChange={e => setNewMofa({ ...newMofa, pass_no: e.target.value.toUpperCase() })}
              className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white font-mono uppercase"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">MOFA Application Reference No *</label>
            <input
              type="text"
              required
              value={newMofa.mofa_no}
              onChange={e => setNewMofa({ ...newMofa, mofa_no: e.target.value.toUpperCase() })}
              className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-cyan-300 font-mono font-bold"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-lg transition-all"
          >
            Record & Verify MOFA Number
          </button>
        </form>

        {/* MOFA Records List */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-slate-800">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center justify-between">
            <span>Verified MOFA Records</span>
            <span className="text-xs text-slate-400 font-mono">{entries.length} Synced</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400 uppercase font-mono border-b border-slate-800">
                <tr>
                  <th className="p-3">Visit ID</th>
                  <th className="p-3">Passport No</th>
                  <th className="p-3">MOFA Reference</th>
                  <th className="p-3">Sync Status</th>
                  <th className="p-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {entries.map(item => (
                  <tr key={item.id} className="hover:bg-slate-900/40">
                    <td className="p-3 font-mono text-slate-400">#{item.visit_id}</td>
                    <td className="p-3 font-mono font-bold text-white">{item.pass_no}</td>
                    <td className="p-3 font-mono text-cyan-300 font-bold">{item.mofa_no}</td>
                    <td className="p-3">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[11px]">
                        {item.status}
                      </span>
                    </td>
                    <td className="p-3 text-slate-400 font-mono">{item.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
