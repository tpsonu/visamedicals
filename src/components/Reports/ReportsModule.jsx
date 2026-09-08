import React, { useState, useEffect } from 'react';
import { fetchRegistrations } from '../../services/api';
import { FileText, Download, Printer, Filter, CheckCircle2, XCircle, Search } from 'lucide-react';

export default function ReportsModule({ onSelectPatient, setActiveTab }) {
  const [registrations, setRegistrations] = useState([]);
  const [filterType, setFilterType] = useState('ALL'); // ALL, FIT, UNFIT, GCC, MARITIME
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await fetchRegistrations();
      setRegistrations(data);
    } catch (e) {
      console.error(e);
    }
  };

  const filtered = registrations.filter(r => {
    if (filterType === 'FIT' && r.medical_status !== 'FIT') return false;
    if (filterType === 'UNFIT' && r.medical_status !== 'UNFIT') return false;
    if (filterType === 'GCC' && r.reg_type !== 'GCC_VISA') return false;
    if (filterType === 'MARITIME' && r.reg_type !== 'MARITIME') return false;

    if (search) {
      const q = search.toLowerCase();
      return (
        (r.first_name && r.first_name.toLowerCase().includes(q)) ||
        (r.last_name && r.last_name.toLowerCase().includes(q)) ||
        (r.passport_no && r.passport_no.toLowerCase().includes(q)) ||
        (r.gamca_no && r.gamca_no.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const exportCSV = () => {
    const headers = ['Token', 'Name', 'Passport', 'Country', 'Type', 'Status', 'Reg Fee', 'Date'];
    const rows = filtered.map(r => [
      r.token,
      `"${r.first_name} ${r.last_name}"`,
      r.passport_no,
      `"${r.travelling_to}"`,
      r.reg_type,
      r.medical_status,
      r.reg_fee,
      r.visit_date
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `VisaMedicals_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-purple-400" /> Consolidated Medical Reports & Register
          </h2>
          <p className="text-xs text-slate-400 mt-1">Generate diagnostic registers, vaccination logs, financial revenue statements, and export data.</p>
        </div>

        <button
          onClick={exportCSV}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg transition-all"
        >
          <Download className="w-4 h-4" /> Export Excel / CSV
        </button>
      </div>

      {/* Filters & Search */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {['ALL', 'GCC', 'MARITIME', 'FIT', 'UNFIT'].map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
                filterType === type
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search candidate / passport..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-purple-500"
          />
        </div>
      </div>

      {/* Consolidated Table */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 uppercase font-mono border-b border-slate-800">
              <tr>
                <th className="p-3">Token #</th>
                <th className="p-3">Candidate Name</th>
                <th className="p-3">Passport No</th>
                <th className="p-3">Travelling To</th>
                <th className="p-3">Type</th>
                <th className="p-3">Status</th>
                <th className="p-3">Vaccinations</th>
                <th className="p-3">Reg Fee</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map(r => (
                <tr key={r.id} className="hover:bg-slate-900/40 transition-all">
                  <td className="p-3 font-mono font-bold text-cyan-300">#{r.token}</td>
                  <td className="p-3 font-bold text-white">
                    {r.first_name} {r.last_name}
                  </td>
                  <td className="p-3 font-mono text-slate-300">{r.passport_no}</td>
                  <td className="p-3 text-slate-200">{r.travelling_to}</td>
                  <td className="p-3 font-mono text-indigo-400">{r.reg_type}</td>
                  <td className="p-3">
                    <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                      r.medical_status === 'FIT' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                      r.medical_status === 'UNFIT' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                      'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      {r.medical_status}
                    </span>
                  </td>
                  <td className="p-3 text-slate-400 text-[11px] truncate max-w-[150px]">
                    {r.vaccination_taken || 'Meningococcal'}
                  </td>
                  <td className="p-3 font-mono font-bold text-purple-300">₹{r.reg_fee}</td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => {
                        if (onSelectPatient) onSelectPatient(r);
                        if (setActiveTab) setActiveTab('certificate');
                      }}
                      className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[11px] font-semibold border border-slate-700"
                    >
                      Print Certificate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
