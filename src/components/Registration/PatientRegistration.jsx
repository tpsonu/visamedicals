import React, { useState, useEffect, useRef } from 'react';
import { fetchCountries, createRegistration, fetchInventory } from '../../services/api';
import { 
  User, Calendar, Globe, Building, DollarSign, 
  Camera, Fingerprint, Syringe, Check, AlertCircle, RefreshCw, Barcode, Printer
} from 'lucide-react';

export default function PatientRegistration({ onCompleteRegistration }) {
  const [countries, setCountries] = useState([]);
  const [inventory, setInventory] = useState({ items: [] });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  // Form State - Initialized completely empty without any placeholders
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
    travelling_to: '',
    visa_no: '',
    visa_date: '',
    profession: '',
    recruting_agency: '',
    embassy: '',
    gamca_no: '',
    mofa_no: '',
    reg_fee: '',
    payment_mode: 'CASH',
    phone_no: '',
    blood_taken: 'YES',
    vaccines: []
  });

  // Biometrics & Camera
  const [cameraActive, setCameraActive] = useState(false);
  const [photoData, setPhotoData] = useState('');
  const [biometricScanning, setBiometricScanning] = useState(false);
  const [biometricDone, setBiometricDone] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    loadInitData();
  }, []);

  const loadInitData = async () => {
    try {
      const cList = await fetchCountries();
      setCountries(cList);
      const invData = await fetchInventory();
      setInventory(invData);
    } catch (e) {
      console.error("Init load error:", e);
    }
  };

  const handleCountryChange = (countryName) => {
    if (!countryName) {
      setFormData(prev => ({
        ...prev,
        travelling_to: '',
        reg_fee: '',
        gamca_no: ''
      }));
      return;
    }
    const matched = countries.find(c => c.country === countryName);
    const fee = matched ? matched.reg_fee : '';
    const gamca = matched && matched.gcc_status ? `GAMCA-${countryName.substring(0, 2).toUpperCase()}-2026-${Math.floor(10000 + Math.random() * 90000)}` : '';
    setFormData(prev => ({
      ...prev,
      travelling_to: countryName,
      reg_fee: fee,
      gamca_no: gamca
    }));
  };

  // WebRTC Camera
  const startCamera = async () => {
    try {
      setCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (e) {
      alert("Webcam device not found or permission denied.");
      setCameraActive(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = 300;
      canvas.height = 300;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(videoRef.current, 0, 0, 300, 300);
      const data = canvas.toDataURL('image/png');
      setPhotoData(data);
      if (videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
      setCameraActive(false);
    }
  };

  // Fingerprint Scanner Simulation
  const triggerBiometricScan = () => {
    setBiometricScanning(true);
    setTimeout(() => {
      setBiometricScanning(false);
      setBiometricDone(true);
    }, 1800);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.first_name || !formData.passport_no) {
      alert("First Name and Passport Number are required!");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        ...formData,
        photo: photoData || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=faces',
        reg_type: 'GCC_VISA',
        vaccination_taken: formData.vaccines.map(id => {
          const item = inventory.items.find(i => String(i.id) === String(id));
          return item ? item.item : 'Vaccine';
        }).join(', ')
      };

      const result = await createRegistration(payload);
      setSuccess(result);
      if (onCompleteRegistration) onCompleteRegistration(result);
    } catch (e) {
      alert("Failed to submit registration: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="glass-panel p-8 rounded-2xl border border-emerald-500/40 text-center max-w-2xl mx-auto space-y-6 animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30 glow-emerald">
          <Check className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Registration Successful!</h2>
          <p className="text-sm text-slate-300 mt-1">Patient Token <span className="text-cyan-400 font-bold">#{success.token}</span> has been assigned and queued for laboratory diagnostic testing.</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-left text-xs font-mono space-y-2">
          <div className="flex justify-between"><span className="text-slate-400">Patient Name:</span> <span className="text-slate-100 font-bold">{success.first_name} {success.last_name}</span></div>
          <div className="flex justify-between"><span className="text-slate-400">Passport Number:</span> <span className="text-cyan-400 font-bold">{success.passport_no}</span></div>
          <div className="flex justify-between"><span className="text-slate-400">Travelling To:</span> <span className="text-slate-100">{success.travelling_to}</span></div>
          <div className="flex justify-between"><span className="text-slate-400">GAMCA / GCC Ref:</span> <span className="text-emerald-400 font-bold">{success.gamca_no || 'N/A'}</span></div>
          <div className="flex justify-between"><span className="text-slate-400">Registration Fee:</span> <span className="text-purple-300 font-bold">₹{success.reg_fee} ({success.payment_mode})</span></div>
        </div>

        <div className="flex justify-center gap-4">
          <button
            onClick={() => {
              setSuccess(null);
              setFormData({
                first_name: '', middle_name: '', last_name: '', dob: '', age: '', gender: 'MALE',
                marital_status: 'SINGLE', nationality: '', place: '', passport_no: '', date_issued: '',
                height: '', weight: '', travelling_to: '', visa_no: '', visa_date: '', profession: '',
                recruting_agency: '', embassy: '', gamca_no: '', mofa_no: '', reg_fee: '', payment_mode: 'CASH',
                phone_no: '', blood_taken: 'YES', vaccines: []
              });
              setPhotoData('');
              setBiometricDone(false);
            }}
            className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-sm transition-all"
          >
            Register Another Candidate
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <User className="w-6 h-6 text-cyan-400" /> Patient Intake & GCC Registration
          </h2>
          <p className="text-xs text-slate-400 mt-1">Capture candidate demographics, passport info, webcam photo & biometrics.</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setFormData({
              first_name: 'MOHAMMED',
              middle_name: 'TARIQ',
              last_name: 'KHAN',
              dob: '1995-05-12',
              age: '31',
              gender: 'MALE',
              marital_status: 'MARRIED',
              nationality: 'INDIAN',
              place: 'MUMBAI',
              passport_no: `Z${Math.floor(1000000 + Math.random() * 9000000)}`,
              date_issued: '2022-01-10',
              height: '172',
              weight: '70',
              travelling_to: 'Saudi Arabia',
              visa_no: `V-${Math.floor(100000 + Math.random() * 900000)}`,
              visa_date: '2026-08-01',
              profession: 'ACCOUNTANT',
              recruting_agency: 'GLOBAL HUMAN RESOURCES',
              embassy: 'SAUDI CONSULATE',
              gamca_no: `GAMCA-SA-2026-${Math.floor(10000 + Math.random() * 90000)}`,
              mofa_no: '',
              reg_fee: 9500,
              payment_mode: 'CASH',
              phone_no: '9820199000',
              blood_taken: 'YES',
              vaccines: [1, 2]
            });
            setPhotoData('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=faces');
          }}
          className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold flex items-center gap-1.5 border border-slate-700"
        >
          <RefreshCw className="w-3.5 h-3.5 text-cyan-400" /> Fill Demo Data
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Demographics & Passport Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
              <User className="w-4 h-4" /> Personal & Passport Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">First Name *</label>
                <input
                  type="text"
                  required
                  value={formData.first_name}
                  onChange={e => setFormData({ ...formData, first_name: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Middle Name</label>
                <input
                  type="text"
                  value={formData.middle_name}
                  onChange={e => setFormData({ ...formData, middle_name: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Last Name</label>
                <input
                  type="text"
                  value={formData.last_name}
                  onChange={e => setFormData({ ...formData, last_name: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Passport No *</label>
                <input
                  type="text"
                  required
                  value={formData.passport_no}
                  onChange={e => setFormData({ ...formData, passport_no: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white font-mono uppercase focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Date of Issue</label>
                <input
                  type="date"
                  value={formData.date_issued}
                  onChange={e => setFormData({ ...formData, date_issued: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Date of Birth</label>
                <input
                  type="date"
                  value={formData.dob}
                  onChange={e => setFormData({ ...formData, dob: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Age & Gender</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.age}
                    onChange={e => setFormData({ ...formData, age: e.target.value })}
                    className="w-1/2 px-2 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white text-center"
                  />
                  <select
                    value={formData.gender}
                    onChange={e => setFormData({ ...formData, gender: e.target.value })}
                    className="w-1/2 px-2 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                  >
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Nationality</label>
                <input
                  type="text"
                  value={formData.nationality}
                  onChange={e => setFormData({ ...formData, nationality: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Profession</label>
                <input
                  type="text"
                  value={formData.profession}
                  onChange={e => setFormData({ ...formData, profession: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Mobile Phone No</label>
                <input
                  type="text"
                  value={formData.phone_no}
                  onChange={e => setFormData({ ...formData, phone_no: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white font-mono"
                />
              </div>
            </div>
          </div>

          {/* Visa Destination & Agency Mapping */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-2">
              <Globe className="w-4 h-4" /> Country Destination & Fees
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Travelling To Country</label>
                <select
                  value={formData.travelling_to}
                  onChange={e => handleCountryChange(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white font-bold"
                >
                  <option value="">-- Select Country --</option>
                  {countries.map(c => (
                    <option key={c.id} value={c.country}>
                      {c.country} {c.gcc_status ? '(GCC)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">GAMCA / GCC Slip No</label>
                <input
                  type="text"
                  value={formData.gamca_no}
                  onChange={e => setFormData({ ...formData, gamca_no: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-emerald-400 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Registration Fee (₹)</label>
                <div className="relative">
                  <input
                    type="number"
                    value={formData.reg_fee}
                    onChange={e => setFormData({ ...formData, reg_fee: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-purple-300 font-bold"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Recruiting Agency</label>
                <input
                  type="text"
                  value={formData.recruting_agency}
                  onChange={e => setFormData({ ...formData, recruting_agency: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Embassy / Consulate</label>
                <input
                  type="text"
                  value={formData.embassy}
                  onChange={e => setFormData({ ...formData, embassy: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Payment Mode</label>
                <select
                  value={formData.payment_mode}
                  onChange={e => setFormData({ ...formData, payment_mode: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white"
                >
                  <option value="CASH">Cash</option>
                  <option value="UPI">UPI / GPay</option>
                  <option value="CREDIT_CARD">Credit / Debit Card</option>
                  <option value="AGENCY_BILLING">Agency Monthly Bill</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Photo Capture & Biometric Finger Scanner */}
        <div className="space-y-6">
          {/* Photo Webcam Capture */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4 text-center">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center justify-center gap-2">
              <Camera className="w-4 h-4 text-cyan-400" /> Candidate Photo Capture
            </h3>

            <div className="relative w-40 h-40 mx-auto rounded-2xl overflow-hidden border-2 border-cyan-500/40 bg-slate-900 shadow-xl flex items-center justify-center">
              {cameraActive ? (
                <video ref={videoRef} autoPlay className="w-full h-full object-cover" />
              ) : photoData ? (
                <img src={photoData} alt="Candidate Photo" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center text-slate-500 text-xs">
                  <User className="w-12 h-12 stroke-[1.5]" />
                  <span>No Photo</span>
                </div>
              )}
            </div>

            <div className="flex justify-center gap-2">
              {cameraActive ? (
                <button
                  type="button"
                  onClick={capturePhoto}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all"
                >
                  Snap Photo
                </button>
              ) : (
                <button
                  type="button"
                  onClick={startCamera}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 font-semibold text-xs transition-all flex items-center gap-1.5"
                >
                  <Camera className="w-3.5 h-3.5" /> Start Webcam
                </button>
              )}
            </div>
          </div>

          {/* Fingerprint Scanner */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4 text-center">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center justify-center gap-2">
              <Fingerprint className="w-4 h-4 text-emerald-400" /> Biometric Finger Verification
            </h3>

            <div className={`w-24 h-24 mx-auto rounded-2xl border-2 flex items-center justify-center transition-all ${
              biometricDone ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400' :
              biometricScanning ? 'border-amber-500 bg-amber-500/10 text-amber-400 animate-pulse' :
              'border-slate-700 bg-slate-900 text-slate-500'
            }`}>
              <Fingerprint className={`w-12 h-12 ${biometricScanning ? 'animate-bounce' : ''}`} />
            </div>

            <p className="text-xs text-slate-400">
              {biometricDone ? 'Biometric fingerprint template verified.' :
               biometricScanning ? 'Scanning thumbprint on optical sensor...' :
               'Connect USB Fingerprint Scanner or click below.'}
            </p>

            <button
              type="button"
              onClick={triggerBiometricScan}
              disabled={biometricScanning}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-slate-700 font-semibold text-xs transition-all"
            >
              {biometricDone ? 'Re-scan Fingerprint' : 'Simulate Scan'}
            </button>
          </div>

          {/* Submit Action Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-extrabold text-base shadow-xl shadow-cyan-500/20 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
          >
            {loading ? 'Registering...' : 'Register & Assign Token Queue'}
          </button>
        </div>
      </div>
    </form>
  );
}
