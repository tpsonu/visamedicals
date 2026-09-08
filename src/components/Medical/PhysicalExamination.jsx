import React, { useState, useEffect } from 'react';
import { fetchRegistrations, submitMedicalResult } from '../../services/api';
import { Stethoscope, CheckCircle2, XCircle, AlertCircle, Eye, Ear, Heart, Activity } from 'lucide-react';

export default function PhysicalExamination({ selectedPatient, setSelectedPatient, onCompleteExam }) {
  const [patients, setPatients] = useState([]);
  const [activePatient, setActivePatient] = useState(selectedPatient || null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [examData, setExamData] = useState({
    eyes_lt: '6/6',
    eyes_rt: '6/6',
    ear_lt: 'NORMAL',
    ear_rt: 'NORMAL',
    cardio_vascular: 'NORMAL',
    bp: '120/80 mmHg',
    heart: 'S1 S2 NORMAL',
    lungs: 'CLEAR',
    chest: 'NORMAL',
    abdomen: 'SOFT NON-TENDER',
    hernia: 'ABSENT',
    varicose: 'ABSENT',
    extremities: 'NORMAL',
    deformities: 'NONE',
    skin: 'HEALTHY',
    clinical: 'SATISFACTORY',
    cns: 'INTACT',
    psychiatry: 'NORMAL',
    remarks: 'CANDIDATE IS PHYSICALLY AND MENTALLY FIT FOR EMPLOYMENT VISA.',
    status: 'FIT'
  });

  useEffect(() => {
    loadPatients();
  }, []);

  useEffect(() => {
    if (selectedPatient) {
      setActivePatient(selectedPatient);
      if (selectedPatient.medical_result) {
        setExamData(prev => ({ ...prev, ...selectedPatient.medical_result }));
      }
    }
  }, [selectedPatient]);

  const loadPatients = async () => {
    try {
      const data = await fetchRegistrations();
      setPatients(data);
      if (!activePatient && data.length > 0) {
        setActivePatient(data[0]);
        if (data[0].medical_result) {
          setExamData(prev => ({ ...prev, ...data[0].medical_result }));
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const setPresetStatus = (statusVal) => {
    let remarkText = '';
    if (statusVal === 'FIT') {
      remarkText = 'CANDIDATE IS PHYSICALLY AND MENTALLY FIT FOR EMPLOYMENT VISA / SEA DUTY.';
    } else if (statusVal === 'UNFIT') {
      remarkText = 'UNFIT DUE TO MEDICAL GROUNDS (REFERRAL DOCUMENTED).';
    } else {
      remarkText = 'RE-EXAMINATION REQUIRED FOR FURTHER EVALUATION.';
    }
    setExamData(prev => ({
      ...prev,
      status: statusVal,
      remarks: remarkText
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!activePatient) return;
    setLoading(true);
    try {
      const updated = await submitMedicalResult(activePatient.id, examData);
      setSaved(true);
      if (onCompleteExam) onCompleteExam(updated);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      alert("Error saving exam result: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Stethoscope className="w-6 h-6 text-indigo-400" /> Clinical Examination & Doctor Signoff
          </h2>
          <p className="text-xs text-slate-400 mt-1">Physical exam evaluation, visual acuity, hearing, vitals, and FIT/UNFIT status determination.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Candidate Selector */}
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-3">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Select Candidate</h3>
          <div className="space-y-2 max-h-[550px] overflow-y-auto pr-1">
            {patients.map(p => (
              <button
                key={p.id}
                onClick={() => {
                  setActivePatient(p);
                  if (p.medical_result) setExamData(prev => ({ ...prev, ...p.medical_result }));
                }}
                className={`w-full p-3 rounded-xl border text-left transition-all flex items-center gap-3 ${
                  activePatient && String(activePatient.id) === String(p.id)
                    ? 'bg-indigo-500/10 border-indigo-500/40 text-white'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-slate-800 text-indigo-400 font-bold font-mono text-xs flex items-center justify-center border border-slate-700">
                  #{p.token}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold truncate">{p.first_name} {p.last_name}</h4>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    p.medical_status === 'FIT' ? 'bg-emerald-500/20 text-emerald-300' :
                    p.medical_status === 'UNFIT' ? 'bg-rose-500/20 text-rose-300' : 'bg-amber-500/20 text-amber-300'
                  }`}>
                    {p.medical_status}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Physical Exam Form */}
        <div className="lg:col-span-3">
          {activePatient ? (
            <form onSubmit={handleSubmit} className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
              {/* Active Candidate Details */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={activePatient.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop'}
                    alt="Candidate"
                    className="w-12 h-12 rounded-xl object-cover border border-indigo-500/30"
                  />
                  <div>
                    <h3 className="text-base font-bold text-white">{activePatient.first_name} {activePatient.last_name}</h3>
                    <p className="text-xs text-slate-400 font-mono">Passport: {activePatient.passport_no} | Target: {activePatient.travelling_to}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setPresetStatus('FIT')}
                    className={`px-4 py-1.5 rounded-xl font-bold text-xs border transition-all ${
                      examData.status === 'FIT' ? 'bg-emerald-500 text-white border-emerald-400 glow-emerald' : 'bg-slate-900 text-emerald-400 border-emerald-500/40'
                    }`}
                  >
                    FIT
                  </button>
                  <button
                    type="button"
                    onClick={() => setPresetStatus('UNFIT')}
                    className={`px-4 py-1.5 rounded-xl font-bold text-xs border transition-all ${
                      examData.status === 'UNFIT' ? 'bg-rose-500 text-white border-rose-400 glow-rose' : 'bg-slate-900 text-rose-400 border-rose-500/40'
                    }`}
                  >
                    UNFIT
                  </button>
                  <button
                    type="button"
                    onClick={() => setPresetStatus('RE_EXAM')}
                    className={`px-4 py-1.5 rounded-xl font-bold text-xs border transition-all ${
                      examData.status === 'RE_EXAM' ? 'bg-amber-500 text-white border-amber-400' : 'bg-slate-900 text-amber-400 border-amber-500/40'
                    }`}
                  >
                    RE-EXAM
                  </button>
                </div>
              </div>

              {/* Vision & Hearing */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                  <Eye className="w-4 h-4" /> Visual Acuity & Hearing Assessment
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Vision Left Eye</label>
                    <input
                      type="text"
                      value={examData.eyes_lt}
                      onChange={e => setExamData({ ...examData, eyes_lt: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Vision Right Eye</label>
                    <input
                      type="text"
                      value={examData.eyes_rt}
                      onChange={e => setExamData({ ...examData, eyes_rt: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Hearing Left Ear</label>
                    <input
                      type="text"
                      value={examData.ear_lt}
                      onChange={e => setExamData({ ...examData, ear_lt: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Hearing Right Ear</label>
                    <input
                      type="text"
                      value={examData.ear_rt}
                      onChange={e => setExamData({ ...examData, ear_rt: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Physical Systemic Examination */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-2">
                  <Heart className="w-4 h-4" /> Systemic Physical Examination
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Blood Pressure (BP)</label>
                    <input
                      type="text"
                      value={examData.bp}
                      onChange={e => setExamData({ ...examData, bp: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Heart Sounds</label>
                    <input
                      type="text"
                      value={examData.heart}
                      onChange={e => setExamData({ ...examData, heart: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Lungs / Respiration</label>
                    <input
                      type="text"
                      value={examData.lungs}
                      onChange={e => setExamData({ ...examData, lungs: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Abdomen</label>
                    <input
                      type="text"
                      value={examData.abdomen}
                      onChange={e => setExamData({ ...examData, abdomen: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Hernia</label>
                    <input
                      type="text"
                      value={examData.hernia}
                      onChange={e => setExamData({ ...examData, hernia: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Varicose Veins</label>
                    <input
                      type="text"
                      value={examData.varicose}
                      onChange={e => setExamData({ ...examData, varicose: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Deformities</label>
                    <input
                      type="text"
                      value={examData.deformities}
                      onChange={e => setExamData({ ...examData, deformities: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Psychiatry / CNS</label>
                    <input
                      type="text"
                      value={examData.psychiatry}
                      onChange={e => setExamData({ ...examData, psychiatry: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Remarks */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Doctor Remarks & Evaluation Statement</label>
                <textarea
                  rows="3"
                  value={examData.remarks}
                  onChange={e => setExamData({ ...examData, remarks: e.target.value })}
                  className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                ></textarea>
              </div>

              {/* Submit Action */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                {saved && (
                  <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Medical assessment finalized successfully!
                  </span>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="ml-auto px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg transition-all"
                >
                  {loading ? 'Finalizing...' : 'Finalize Medical Decision & Generate Fit Certificate'}
                </button>
              </div>
            </form>
          ) : (
            <div className="glass-panel p-12 rounded-2xl border border-slate-800 text-center text-slate-400">
              Select a candidate from the left list to perform clinical examination.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
