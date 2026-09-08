import React, { useState } from 'react';
import { createRegistration } from '../../services/api';
import { Compass, User, Anchor, FileText, CheckCircle2, Shield, RefreshCw } from 'lucide-react';

export default function ShippingRegistration({ onCompleteRegistration }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  // Initialized completely empty without any placeholders
  const [formData, setFormData] = useState({
    first_name: '',
    middle_name: '',
    last_name: '',
    dob: '',
    age: '',
    gender: 'MALE',
    marital_status: 'SINGLE',
    nationality: '',
    place: '',
    passport_no: '',
    date_issued: '',
    height: '',
    weight: '',
    travelling_to: 'Maritime Seafarer (DG Shipping)',
    profession: 'SEAFARER',
    reg_fee: 8500,
    payment_mode: 'CREDIT_CARD',
    phone_no: '',
    // Maritime Shipping specifics
    cdc_no: '',
    indos_no: '',
    rank: '',
    vessel: '',
    vessel_type: '',
    route: 'UNRESTRICTED INTERNATIONAL',
    company: '',
    // Medical history checklist
    headache: 'NO',
    fits: 'NO',
    eye_problem: 'NO',
    heart_disease: 'NO',
    asthma: 'NO',
    diabetes: 'NO',
    operation: 'NO',
    alcohol: 'NO'
  });

  const fillDemoData = () => {
    setFormData({
      first_name: 'VIKRAM',
      middle_name: 'SINGH',
      last_name: 'RATHORE',
      dob: '1992-08-14',
      age: '34',
      gender: 'MALE',
      marital_status: 'MARRIED',
      nationality: 'INDIAN',
      place: 'MUMBAI',
      passport_no: 'S8810294',
      date_issued: '2021-04-10',
      height: '178',
      weight: '76',
      travelling_to: 'Maritime Seafarer (DG Shipping)',
      profession: 'CHIEF ENGINEER SEAFARER',
      reg_fee: 8500,
      payment_mode: 'CREDIT_CARD',
      phone_no: '9820011223',
      cdc_no: 'CDC-MUM-991824',
      indos_no: '22IN991024',
      rank: 'CHIEF ENGINEER',
      vessel: 'MV PACIFIC DISCOVERY',
      vessel_type: 'OIL TANKER',
      route: 'UNRESTRICTED INTERNATIONAL',
      company: 'CHEVRON SHIPPING CO',
      headache: 'NO', fits: 'NO', eye_problem: 'NO', heart_disease: 'NO',
      asthma: 'NO', diabetes: 'NO', operation: 'NO', alcohol: 'NO'
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        reg_type: 'MARITIME',
        status_stage: 'LAB_TEST',
        medical_status: 'IN_PROCESS',
        shipping_details: {
          cdc_no: formData.cdc_no,
          indos_no: formData.indos_no,
          rank: formData.rank,
          vessel: formData.vessel,
          type: formData.vessel_type,
          route: formData.route,
          company: formData.company
        }
      };

      const result = await createRegistration(payload);
      setSuccess(result);
      if (onCompleteRegistration) onCompleteRegistration(result);
    } catch (err) {
      alert("Failed seafarer registration: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="glass-panel p-8 rounded-2xl border border-indigo-500/40 text-center max-w-2xl mx-auto space-y-6">
        <div className="w-16 h-16 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto border border-indigo-500/30 glow-indigo">
          <Anchor className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Seafarer Intake Registered!</h2>
          <p className="text-sm text-slate-300 mt-1">Seafarer Token <span className="text-cyan-400 font-bold">#{success.token}</span> queued for Maritime Medical Examination.</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-left text-xs font-mono space-y-2">
          <div className="flex justify-between"><span className="text-slate-400">Seafarer Name:</span> <span className="text-slate-100 font-bold">{success.first_name} {success.last_name}</span></div>
          <div className="flex justify-between"><span className="text-slate-400">CDC Number:</span> <span className="text-cyan-400 font-bold">{formData.cdc_no}</span></div>
          <div className="flex justify-between"><span className="text-slate-400">INDOS Number:</span> <span className="text-indigo-400 font-bold">{formData.indos_no}</span></div>
          <div className="flex justify-between"><span className="text-slate-400">Vessel & Rank:</span> <span className="text-slate-100">{formData.vessel} ({formData.rank})</span></div>
        </div>

        <button
          onClick={() => {
            setSuccess(null);
            setFormData({
              first_name: '', middle_name: '', last_name: '', dob: '', age: '', gender: 'MALE',
              marital_status: 'SINGLE', nationality: '', place: '', passport_no: '', date_issued: '',
              height: '', weight: '', travelling_to: 'Maritime Seafarer (DG Shipping)', profession: 'SEAFARER',
              reg_fee: 8500, payment_mode: 'CREDIT_CARD', phone_no: '', cdc_no: '', indos_no: '',
              rank: '', vessel: '', vessel_type: '', route: 'UNRESTRICTED INTERNATIONAL', company: '',
              headache: 'NO', fits: 'NO', eye_problem: 'NO', heart_disease: 'NO', asthma: 'NO', diabetes: 'NO', operation: 'NO', alcohol: 'NO'
            });
          }}
          className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all"
        >
          Register Another Seafarer
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Compass className="w-6 h-6 text-indigo-400" /> Maritime Seafarer Intake (DG Shipping)
          </h2>
          <p className="text-xs text-slate-400 mt-1">Register seafarers, CDC & INDOS details, ship vessel rank, and maritime history.</p>
        </div>

        <button
          type="button"
          onClick={fillDemoData}
          className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold flex items-center gap-1.5 border border-slate-700"
        >
          <RefreshCw className="w-3.5 h-3.5 text-indigo-400" /> Fill Demo Data
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Maritime CDC & Vessel Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-2">
              <Anchor className="w-4 h-4" /> Seafarer CDC & Vessel Parameters
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">CDC Number *</label>
                <input
                  type="text"
                  required
                  value={formData.cdc_no}
                  onChange={e => setFormData({ ...formData, cdc_no: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-cyan-300 font-mono font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">INDOS Number *</label>
                <input
                  type="text"
                  required
                  value={formData.indos_no}
                  onChange={e => setFormData({ ...formData, indos_no: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-indigo-300 font-mono font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Rank / Designation</label>
                <input
                  type="text"
                  value={formData.rank}
                  onChange={e => setFormData({ ...formData, rank: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Vessel Name</label>
                <input
                  type="text"
                  value={formData.vessel}
                  onChange={e => setFormData({ ...formData, vessel: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Vessel Type</label>
                <input
                  type="text"
                  value={formData.vessel_type}
                  onChange={e => setFormData({ ...formData, vessel_type: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Shipping Company</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={e => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white"
                />
              </div>
            </div>
          </div>

          {/* Demographics */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
              <User className="w-4 h-4" /> Personal Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">First Name *</label>
                <input
                  type="text"
                  required
                  value={formData.first_name}
                  onChange={e => setFormData({ ...formData, first_name: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Last Name</label>
                <input
                  type="text"
                  value={formData.last_name}
                  onChange={e => setFormData({ ...formData, last_name: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Passport Number</label>
                <input
                  type="text"
                  value={formData.passport_no}
                  onChange={e => setFormData({ ...formData, passport_no: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Past History Checklist & Action */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <Shield className="w-4 h-4" /> Past Medical History
            </h3>

            <div className="space-y-2 text-xs">
              {[
                { key: 'fits', label: 'Epilepsy / Fits / Seizures' },
                { key: 'eye_problem', label: 'Eye Vision / Color Blindness' },
                { key: 'heart_disease', label: 'Heart Disease / Hypertension' },
                { key: 'asthma', label: 'Asthma / Respiratory Illness' },
                { key: 'diabetes', label: 'Diabetes Mellitus' },
                { key: 'operation', label: 'Surgical Operations / Hernia' },
                { key: 'alcohol', label: 'Alcohol / Substance Addiction' }
              ].map(item => (
                <div key={item.key} className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-slate-300">{item.label}</span>
                  <select
                    value={formData[item.key]}
                    onChange={e => setFormData({ ...formData, [item.key]: e.target.value })}
                    className="px-2 py-1 rounded bg-slate-800 text-white font-bold"
                  >
                    <option value="NO">NO</option>
                    <option value="YES">YES</option>
                  </select>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-extrabold text-base shadow-xl shadow-indigo-500/20 transition-all transform hover:-translate-y-0.5"
          >
            {loading ? 'Processing...' : 'Register Seafarer'}
          </button>
        </div>
      </div>
    </form>
  );
}
