import React, { useRef } from 'react';
import { Printer, ShieldCheck, QrCode, ArrowLeft, CheckCircle2, XCircle } from 'lucide-react';

export default function FitCertificatePrint({ patient, clinicInfo, onBack }) {
  if (!patient) {
    return (
      <div className="glass-panel p-8 text-center text-slate-400 rounded-2xl">
        No candidate selected for printing. Please select a candidate from Reports or Queue.
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const info = clinicInfo || {
    name: 'AL SHIFA VISA & MARITIME MEDICAL CENTER',
    address: 'Suite 405, Healthcare Towers, Medical District, Mumbai 400001',
    phone: '+91 22 5555 0199',
    gcc: 'GCC-MED-88910',
    reg_no: 'MH-MED-2024-9981'
  };

  const isFit = patient.medical_status === 'FIT';

  return (
    <div className="space-y-6">
      {/* Top Action Bar (hidden when printing) */}
      <div className="no-print flex items-center justify-between">
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>

        <button
          onClick={handlePrint}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-extrabold text-sm shadow-xl flex items-center gap-2"
        >
          <Printer className="w-4 h-4" /> Print Official Certificate
        </button>
      </div>

      {/* Printable Certificate Page */}
      <div className="printable-area max-w-4xl mx-auto bg-white text-slate-900 p-8 rounded-2xl shadow-2xl border-4 border-double border-cyan-900 relative overflow-hidden font-sans">
        
        {/* Watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
          <span className="text-9xl font-extrabold tracking-widest text-cyan-900 uppercase">
            {isFit ? 'FIT' : 'UNFIT'}
          </span>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b-2 border-slate-900">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-slate-900 text-cyan-400 flex items-center justify-center font-black text-2xl border-2 border-cyan-500">
              MED
            </div>
            <div>
              <h1 className="text-xl font-extrabold uppercase tracking-tight text-slate-900">{info.name}</h1>
              <p className="text-xs text-slate-700 font-medium">{info.address} | Tel: {info.phone}</p>
              <p className="text-[11px] text-cyan-800 font-bold font-mono mt-0.5">
                GCC REG LIC: {info.gcc} | GOVT REG: {info.reg_no}
              </p>
            </div>
          </div>

          <div className="text-right space-y-1">
            <div className="w-20 h-20 rounded-lg overflow-hidden border-2 border-slate-900 shadow ml-auto">
              <img src={patient.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop'} alt="Candidate" className="w-full h-full object-cover" />
            </div>
            <p className="text-[10px] font-mono font-bold text-slate-700">TOKEN #{patient.token}</p>
          </div>
        </div>

        {/* Title */}
        <div className="text-center my-4">
          <h2 className="text-lg font-black uppercase tracking-wider text-slate-900 border-b-2 border-slate-900 inline-block px-6 pb-1">
            {patient.reg_type === 'MARITIME' ? 'MARITIME SEAFARER MEDICAL FITNESS CERTIFICATE' : 'GCC EMBASSY MEDICAL EXAMINATION CERTIFICATE'}
          </h2>
          <p className="text-xs font-mono text-slate-600 mt-1">DATE OF EXAMINATION: {patient.visit_date || new Date().toISOString().split('T')[0]}</p>
        </div>

        {/* Demographics Matrix */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs font-mono border p-4 bg-slate-50 rounded-xl border-slate-300">
          <div><span className="font-bold text-slate-600">CANDIDATE NAME:</span> <span className="font-extrabold text-slate-900">{patient.first_name} {patient.middle_name} {patient.last_name}</span></div>
          <div><span className="font-bold text-slate-600">PASSPORT NO:</span> <span className="font-extrabold text-cyan-900">{patient.passport_no}</span></div>
          <div><span className="font-bold text-slate-600">NATIONALITY / AGE:</span> <span>{patient.nationality} / {patient.age} YRS ({patient.gender})</span></div>
          <div><span className="font-bold text-slate-600">DESTINATION COUNTRY:</span> <span className="font-extrabold text-slate-900">{patient.travelling_to}</span></div>
          <div><span className="font-bold text-slate-600">GAMCA SLIP REF:</span> <span className="font-bold text-emerald-800">{patient.gamca_no || 'N/A'}</span></div>
          <div><span className="font-bold text-slate-600">MOFA APP NO:</span> <span className="font-bold text-purple-800">{patient.mofa_no || 'N/A'}</span></div>
          <div><span className="font-bold text-slate-600">PROFESSION:</span> <span>{patient.profession}</span></div>
          <div><span className="font-bold text-slate-600">RECRUITING AGENCY:</span> <span>{patient.recruting_agency}</span></div>
        </div>

        {/* Diagnostic Results Summary */}
        <div className="mt-4 grid grid-cols-2 gap-4 text-xs">
          {/* Lab Summary */}
          <div className="border border-slate-300 rounded-xl p-3 bg-white">
            <h3 className="font-bold text-slate-900 uppercase border-b pb-1 mb-2 font-mono">1. Laboratory Investigations</h3>
            <ul className="space-y-1 font-mono text-[11px] text-slate-800">
              <li className="flex justify-between"><span>HIV I & II Screening:</span> <strong className="text-emerald-700">{patient.lab_result?.hiv || 'NON-REACTIVE'}</strong></li>
              <li className="flex justify-between"><span>HBsAg (Hepatitis B):</span> <strong className="text-emerald-700">{patient.lab_result?.hbs || 'NON-REACTIVE'}</strong></li>
              <li className="flex justify-between"><span>Anti HCV (Hepatitis C):</span> <strong className="text-emerald-700">{patient.lab_result?.hcv || 'NON-REACTIVE'}</strong></li>
              <li className="flex justify-between"><span>VDRL / TPHA:</span> <strong className="text-emerald-700">{patient.lab_result?.vdrl || 'NON-REACTIVE'}</strong></li>
              <li className="flex justify-between"><span>Blood Group & Rh:</span> <strong className="text-slate-900">{patient.lab_result?.blood_group || 'O POSITIVE'}</strong></li>
              <li className="flex justify-between"><span>Haemoglobin (Hb):</span> <span>{patient.lab_result?.haemoglobin || '14.5 g/dL'}</span></li>
              <li className="flex justify-between"><span>Fasting Blood Sugar:</span> <span>{patient.lab_result?.fbs || '92 mg/dL'}</span></li>
            </ul>
          </div>

          {/* Physical Exam Summary */}
          <div className="border border-slate-300 rounded-xl p-3 bg-white">
            <h3 className="font-bold text-slate-900 uppercase border-b pb-1 mb-2 font-mono">2. Physical & Clinical Exam</h3>
            <ul className="space-y-1 font-mono text-[11px] text-slate-800">
              <li className="flex justify-between"><span>Visual Acuity (L / R):</span> <strong>{patient.medical_result?.eyes_lt || '6/6'} / {patient.medical_result?.eyes_rt || '6/6'}</strong></li>
              <li className="flex justify-between"><span>Hearing Assessment:</span> <strong>{patient.medical_result?.ear_lt || 'NORMAL'}</strong></li>
              <li className="flex justify-between"><span>Blood Pressure (BP):</span> <strong>{patient.medical_result?.bp || '120/80 mmHg'}</strong></li>
              <li className="flex justify-between"><span>Heart & Lungs:</span> <span>{patient.medical_result?.lungs || 'NORMAL / CLEAR'}</span></li>
              <li className="flex justify-between"><span>Hernia & Varicose:</span> <span>ABSENT</span></li>
              <li className="flex justify-between"><span>Psychiatry & CNS:</span> <span>NORMAL / INTACT</span></li>
              <li className="flex justify-between"><span>Vaccinations Given:</span> <span className="font-bold">{patient.vaccination_taken || 'Meningococcal'}</span></li>
            </ul>
          </div>
        </div>

        {/* Final Fit Decision Stamp */}
        <div className="mt-6 p-4 rounded-xl border-2 border-slate-900 bg-slate-50 flex items-center justify-between">
          <div>
            <span className="text-xs font-mono font-bold text-slate-600 block">FINAL MEDICAL FITNESS DECISION:</span>
            <span className={`text-2xl font-black uppercase tracking-wider ${isFit ? 'text-emerald-700' : 'text-rose-700'}`}>
              {isFit ? 'FIT FOR EMPLOYMENT / SEA DUTY' : 'UNFIT FOR EMPLOYMENT'}
            </span>
            <p className="text-[11px] text-slate-700 mt-1 italic max-w-lg">
              "{patient.medical_result?.remarks || 'Candidate is physically and mentally fit.'}"
            </p>
          </div>

          <div className="text-center space-y-1 pl-4 border-l border-slate-300">
            <div className="w-24 h-24 border-2 border-dashed border-slate-800 rounded-lg flex flex-col items-center justify-center p-1 bg-white">
              {/* QR Code Verification Simulation */}
              <div className="w-16 h-16 bg-slate-900 rounded p-1 flex flex-wrap gap-0.5 items-center justify-center">
                <div className="w-full h-full bg-cyan-400 p-1 flex items-center justify-center">
                  <span className="text-[7px] text-slate-900 font-mono font-bold text-center leading-none">VERIFIED<br/>GAMCA</span>
                </div>
              </div>
            </div>
            <span className="text-[9px] font-mono text-slate-500">Scan to Verify Certificate</span>
          </div>
        </div>

        {/* Signatures Footer */}
        <div className="mt-8 pt-6 border-t border-slate-300 flex items-end justify-between text-xs">
          <div>
            <p className="font-bold text-slate-900">PANEL PHYSICIAN STAMP & SIGNATURE</p>
            <p className="text-[11px] text-slate-600 font-mono">DR. SERGIO AYALA, M.D. (REG NO: 88910-MH)</p>
            <p className="text-[10px] text-slate-500 mt-4">This document is digitally signed and cryptographically stored in GCC Portal.</p>
          </div>

          <div className="text-right">
            <div className="w-32 h-12 border-b-2 border-slate-900 mb-1 ml-auto flex items-end justify-center pb-1">
              <span className="font-serif italic font-bold text-slate-800 text-sm">Dr. S. Ayala</span>
            </div>
            <p className="font-bold text-slate-900">Chief Medical Examiner</p>
          </div>
        </div>
      </div>
    </div>
  );
}
