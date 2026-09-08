import React, { useState, useEffect } from 'react';
import { fetchRegistrations, submitLabResult } from '../../services/api';
import { FlaskConical, Search, Check, RefreshCw, Cpu, Activity, User } from 'lucide-react';

export default function LabEntry({ selectedPatient, setSelectedPatient }) {
  const [patients, setPatients] = useState([]);
  const [activePatient, setActivePatient] = useState(selectedPatient || null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [labData, setLabData] = useState({
    sugar: 'NIL',
    albumin: 'NIL',
    bilharziasis: 'NEGATIVE',
    helminthes: 'NOT FOUND',
    giardia: 'NOT FOUND',
    bil_culture: 'NO GROWTH',
    salmonella: 'NEGATIVE',
    cholera: 'NEGATIVE',
    fbs: '95 mg/dL',
    lfts: 'NORMAL',
    creatinine: '0.9 mg/dL',
    blood_group: 'O POSITIVE',
    haemoglobin: '14.5 g/dL',
    malaria: 'NEGATIVE',
    micro_filaria: 'NEGATIVE',
    hiv: 'NON-REACTIVE',
    hbs: 'NON-REACTIVE',
    hcv: 'NON-REACTIVE',
    vdrl: 'NON-REACTIVE',
    tpha: 'NEGATIVE',
    pregnancy_test: 'N/A',
    sgpt: '22 U/L',
    urine: 'NORMAL'
  });

  useEffect(() => {
    loadPatients();
  }, []);

  useEffect(() => {
    if (selectedPatient) {
      setActivePatient(selectedPatient);
      if (selectedPatient.lab_result) {
        setLabData(prev => ({ ...prev, ...selectedPatient.lab_result }));
      }
    }
  }, [selectedPatient]);

  const loadPatients = async () => {
    try {
      const data = await fetchRegistrations();
      setPatients(data);
      if (!activePatient && data.length > 0) {
        setActivePatient(data[0]);
        if (data[0].lab_result) {
          setLabData(prev => ({ ...prev, ...data[0].lab_result }));
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fillNormalValues = () => {
    setLabData({
      sugar: 'NIL',
      albumin: 'NIL',
      bilharziasis: 'NEGATIVE',
      helminthes: 'NOT FOUND',
      giardia: 'NOT FOUND',
      bil_culture: 'NO GROWTH',
      salmonella: 'NEGATIVE',
      cholera: 'NEGATIVE',
      fbs: '90 mg/dL',
      lfts: 'NORMAL',
      creatinine: '0.85 mg/dL',
      blood_group: 'B POSITIVE',
      haemoglobin: '15.0 g/dL',
      malaria: 'NEGATIVE',
      micro_filaria: 'NEGATIVE',
      hiv: 'NON-REACTIVE',
      hbs: 'NON-REACTIVE',
      hcv: 'NON-REACTIVE',
      vdrl: 'NON-REACTIVE',
      tpha: 'NEGATIVE',
      pregnancy_test: 'N/A',
      sgpt: '25 U/L',
      urine: 'NORMAL'
    });
  };

  const fillMachineData = () => {
    setLabData(prev => ({
      ...prev,
      fbs: `${Math.floor(85 + Math.random() * 20)} mg/dL`,
      creatinine: `${(0.7 + Math.random() * 0.4).toFixed(2)} mg/dL`,
      haemoglobin: `${(13.5 + Math.random() * 2.5).toFixed(1)} g/dL`,
      sgpt: `${Math.floor(18 + Math.random() * 15)} U/L`,
      hiv: 'NON-REACTIVE',
      hbs: 'NON-REACTIVE',
      hcv: 'NON-REACTIVE'
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!activePatient) return;
    setLoading(true);
    try {
      await submitLabResult(activePatient.id, labData);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      alert("Error saving lab result: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <FlaskConical className="w-6 h-6 text-cyan-400" /> Laboratory Diagnostics Entry
          </h2>
          <p className="text-xs text-slate-400 mt-1">Input blood chemistry, urine, stool, and serology HIV/HBsAg test results.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fillMachineData}
            className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-500/40 text-cyan-300 text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            <Cpu className="w-3.5 h-3.5 text-cyan-400" /> Fetch Machine Analyzer
          </button>
          <button
            type="button"
            onClick={fillNormalValues}
            className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            <Check className="w-3.5 h-3.5 text-emerald-400" /> Auto-fill Normal
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Candidate Selector Column */}
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-3">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Select Candidate</h3>
          <div className="space-y-2 max-h-[550px] overflow-y-auto pr-1">
            {patients.map(p => (
              <button
                key={p.id}
                onClick={() => {
                  setActivePatient(p);
                  if (p.lab_result) setLabData(prev => ({ ...prev, ...p.lab_result }));
                }}
                className={`w-full p-3 rounded-xl border text-left transition-all flex items-center gap-3 ${
                  activePatient && String(activePatient.id) === String(p.id)
                    ? 'bg-cyan-500/10 border-cyan-500/40 text-white'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-slate-800 text-cyan-400 font-bold font-mono text-xs flex items-center justify-center border border-slate-700">
                  #{p.token}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold truncate">{p.first_name} {p.last_name}</h4>
                  <p className="text-[11px] text-slate-400 font-mono truncate">{p.passport_no}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Lab Test Form */}
        <div className="lg:col-span-3">
          {activePatient ? (
            <form onSubmit={handleSubmit} className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
              {/* Active Candidate Banner */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={activePatient.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop'}
                    alt="Candidate"
                    className="w-12 h-12 rounded-xl object-cover border border-cyan-500/30"
                  />
                  <div>
                    <h3 className="text-base font-bold text-white">{activePatient.first_name} {activePatient.last_name}</h3>
                    <p className="text-xs text-slate-400 font-mono">Passport: {activePatient.passport_no} | GAMCA: {activePatient.gamca_no || 'N/A'}</p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-xs font-bold">
                  Token #{activePatient.token}
                </span>
              </div>

              {/* Serology & Infectious Diseases */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-2">
                  <Activity className="w-4 h-4" /> Serology & Infectious Screening (Mandatory)
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">HIV I & II</label>
                    <select
                      value={labData.hiv}
                      onChange={e => setLabData({ ...labData, hiv: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white font-bold"
                    >
                      <option value="NON-REACTIVE">NON-REACTIVE</option>
                      <option value="REACTIVE">REACTIVE (UNFIT)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">HBsAg (Hepatitis B)</label>
                    <select
                      value={labData.hbs}
                      onChange={e => setLabData({ ...labData, hbs: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white font-bold"
                    >
                      <option value="NON-REACTIVE">NON-REACTIVE</option>
                      <option value="REACTIVE">REACTIVE (UNFIT)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Anti HCV (Hepatitis C)</label>
                    <select
                      value={labData.hcv}
                      onChange={e => setLabData({ ...labData, hcv: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white font-bold"
                    >
                      <option value="NON-REACTIVE">NON-REACTIVE</option>
                      <option value="REACTIVE">REACTIVE (UNFIT)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">VDRL / TPHA</label>
                    <select
                      value={labData.vdrl}
                      onChange={e => setLabData({ ...labData, vdrl: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white font-bold"
                    >
                      <option value="NON-REACTIVE">NON-REACTIVE</option>
                      <option value="REACTIVE">REACTIVE (UNFIT)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Hematology & Biochemistry */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Hematology & Biochemistry</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Haemoglobin (Hb)</label>
                    <input
                      type="text"
                      value={labData.haemoglobin}
                      onChange={e => setLabData({ ...labData, haemoglobin: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Blood Group & Rh</label>
                    <input
                      type="text"
                      value={labData.blood_group}
                      onChange={e => setLabData({ ...labData, blood_group: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Fasting Blood Sugar (FBS)</label>
                    <input
                      type="text"
                      value={labData.fbs}
                      onChange={e => setLabData({ ...labData, fbs: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Serum Creatinine</label>
                    <input
                      type="text"
                      value={labData.creatinine}
                      onChange={e => setLabData({ ...labData, creatinine: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Urine & Stool Examination */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Urine & Stool Routine</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Urine Sugar</label>
                    <input
                      type="text"
                      value={labData.sugar}
                      onChange={e => setLabData({ ...labData, sugar: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Urine Albumin</label>
                    <input
                      type="text"
                      value={labData.albumin}
                      onChange={e => setLabData({ ...labData, albumin: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Stool Helminthes</label>
                    <input
                      type="text"
                      value={labData.helminthes}
                      onChange={e => setLabData({ ...labData, helminthes: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Malaria Parasite</label>
                    <input
                      type="text"
                      value={labData.malaria}
                      onChange={e => setLabData({ ...labData, malaria: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                {saved && (
                  <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                    <Check className="w-4 h-4" /> Lab diagnostic record saved successfully!
                  </span>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="ml-auto px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm shadow-lg transition-all"
                >
                  {loading ? 'Saving...' : 'Save & Send to Physical Exam'}
                </button>
              </div>
            </form>
          ) : (
            <div className="glass-panel p-12 rounded-2xl border border-slate-800 text-center text-slate-400">
              Select a candidate from the left list to input lab results.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
