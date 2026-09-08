import React, { useState, useEffect } from 'react';
import { fetchUsers, fetchClinicInfo, updateClinicInfo } from '../../services/api';
import { Shield, UserCheck, Building, Save, Check } from 'lucide-react';

export default function UserManagement({ currentRole, setCurrentRole }) {
  const [users, setUsers] = useState([]);
  const [clinic, setClinic] = useState({
    name: '',
    address: '',
    city: '',
    phone: '',
    email: '',
    gcc: '',
    reg_no: ''
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const uList = await fetchUsers();
      setUsers(uList);
      const info = await fetchClinicInfo();
      setClinic(info);
    } catch (e) {
      console.error(e);
    }
  };

  const handleClinicSave = async (e) => {
    e.preventDefault();
    try {
      await updateClinicInfo(clinic);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      alert("Failed to update clinic info");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Shield className="w-6 h-6 text-cyan-400" /> User Roles & System Settings
          </h2>
          <p className="text-xs text-slate-400 mt-1">Configure staff RBAC permissions, role simulation, and clinic header branding.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Role Simulator */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
            <UserCheck className="w-4 h-4" /> Live Staff Role Simulator
          </h3>
          <p className="text-xs text-slate-400">Select an active staff account to switch role view context across the platform.</p>

          <div className="space-y-2">
            {users.map(u => (
              <button
                key={u.id}
                onClick={() => setCurrentRole(u.role)}
                className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                  currentRole === u.role
                    ? 'bg-cyan-500/20 border-cyan-500/40 text-white glow-cyan'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div>
                  <h4 className="text-xs font-bold">{u.employee}</h4>
                  <p className="text-[11px] text-slate-400 font-mono">@{u.user_name} ({u.role})</p>
                </div>
                {currentRole === u.role && (
                  <span className="px-2.5 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 text-[10px] font-bold">
                    Active Role
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Clinic Info Settings */}
        <form onSubmit={handleClinicSave} className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-2">
            <Building className="w-4 h-4" /> Clinic Branding & License Settings
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Clinic Center Name</label>
            <input
              type="text"
              value={clinic.name}
              onChange={e => setClinic({ ...clinic, name: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Address</label>
            <input
              type="text"
              value={clinic.address}
              onChange={e => setClinic({ ...clinic, address: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">GCC License Code</label>
              <input
                type="text"
                value={clinic.gcc}
                onChange={e => setClinic({ ...clinic, gcc: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-cyan-300 font-mono font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">State Health Reg No</label>
              <input
                type="text"
                value={clinic.reg_no}
                onChange={e => setClinic({ ...clinic, reg_no: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white font-mono"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            {saved && (
              <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                <Check className="w-4 h-4" /> Settings updated!
              </span>
            )}
            <button
              type="submit"
              className="ml-auto px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" /> Save Clinic Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
