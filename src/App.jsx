import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import PatientRegistration from './components/Registration/PatientRegistration';
import ShippingRegistration from './components/Registration/ShippingRegistration';
import LiveQueue from './components/Queue/LiveQueue';
import LabEntry from './components/Lab/LabEntry';
import PhysicalExamination from './components/Medical/PhysicalExamination';
import VaccineInventory from './components/Inventory/VaccineInventory';
import MofaTracker from './components/Mofa/MofaTracker';
import ReportsModule from './components/Reports/ReportsModule';
import FitCertificatePrint from './components/Certificates/FitCertificatePrint';
import UserManagement from './components/Admin/UserManagement';

import { 
  LayoutDashboard, UserPlus, Compass, Radio, FlaskConical, 
  Stethoscope, Syringe, ShieldCheck, FileText, Printer, 
  Settings, Activity, Bell, ChevronDown, ChevronRight, 
  Building, Users, DollarSign, Globe, Package, Truck, 
  Shield, CheckCircle2
} from 'lucide-react';

export default function App() {
  // Navigation active tab matching legacy software sub_menu keys
  const [activeMenu, setActiveMenu] = useState('Registration');
  const [activeSubMenu, setActiveSubMenu] = useState('patient_registeration');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [currentRole, setCurrentRole] = useState('ADMIN');

  // Accordion expanded state for sidebar categories matching legacy treeviews
  const [openCategories, setOpenCategories] = useState({
    Admin: true,
    Registration: true,
    Shipping: true,
    Reports: true
  });

  const toggleCategory = (cat) => {
    setOpenCategories(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

  // Legacy navigation hierarchy
  const legacyMenuStructure = [
    {
      category: 'Dashboard',
      icon: LayoutDashboard,
      items: [
        { id: 'dashboard', label: 'Overview Dashboard', icon: LayoutDashboard }
      ]
    },
    {
      category: 'Admin',
      icon: Settings,
      items: [
        { id: 'Info', label: 'Company Info', icon: Building },
        { id: 'User', label: 'Users', icon: Users },
        { id: 'Employee', label: 'Doctors', icon: Stethoscope },
        { id: 'Regfee', label: 'Regfee', icon: DollarSign },
        { id: 'Countryfee', label: 'Country Fee', icon: Globe },
        { id: 'VaccineStock', label: 'Vaccine Stock', icon: Syringe },
        { id: 'Supplier', label: 'Supplier', icon: Truck },
        { id: 'Item', label: 'Item Catalog', icon: Package },
        { id: 'Purchase', label: 'Purchase Entry', icon: FileText },
        { id: 'Mofa_data', label: 'Mofa Data', icon: ShieldCheck }
      ]
    },
    {
      category: 'Registration',
      icon: UserPlus,
      items: [
        { id: 'patient_registeration', label: 'Register', icon: UserPlus },
        { id: 'Patient_queue', label: 'Patient Queue', icon: Radio },
        { id: 'ManageRegistration', label: 'Manage Registration', icon: FileText }
      ]
    },
    {
      category: 'Shipping',
      icon: Compass,
      items: [
        { id: 'shipping_registration', label: 'Shipping Registration', icon: Compass },
        { id: 'ManageRegistration_Shipping', label: 'Manage Registration', icon: FileText }
      ]
    },
    {
      category: 'Reports',
      icon: FileText,
      items: [
        { id: 'REG_REPORT', label: 'Registration Report', icon: FileText },
        { id: 'CONS_REPORT', label: 'Consolidated Report', icon: FileText },
        { id: 'VACCINATION_REPORT', label: 'Vaccination Report', icon: Syringe },
        { id: 'PurchaseEntry_Report', label: 'Purchase Entry Report', icon: FileText },
        { id: 'Stock_Report', label: 'Stock Report', icon: Package },
        { id: 'MOFA_DATA_REPORT', label: 'Mofa Data Report', icon: ShieldCheck },
        { id: 'excel_report', label: 'Excel Report', icon: FileText },
        { id: 'lab_register_report', label: 'Lab Register Report', icon: FlaskConical }
      ]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-white">
      {/* Header Navigation (Hidden on Print) */}
      <header className="no-print sticky top-0 z-40 border-b border-cyan-500/15 bg-slate-900/80 backdrop-blur-xl px-4 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
          {/* Logo & Brand */}
          <div 
            className="flex items-center gap-3 cursor-pointer" 
            onClick={() => {
              setActiveMenu('Dashboard');
              setActiveSubMenu('dashboard');
            }}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-0.5 shadow-lg shadow-cyan-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Activity className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black tracking-tight text-white">
                  VisaMedicals <span className="text-cyan-400">Pro</span>
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-[10px] font-bold font-mono">
                  v2.0 GCC
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                AL SHIFA VISA & MARITIME MEDICAL CENTER
              </p>
            </div>
          </div>

          {/* Active Role Indicator */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span className="text-slate-400 font-medium">User Role:</span>
              <span className="text-cyan-300 font-bold font-mono uppercase">{currentRole}</span>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setActiveMenu('Admin');
                setActiveSubMenu('User');
              }}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-all relative"
              title="Role Simulator & Settings"
            >
              <Bell className="w-4 h-4 text-cyan-400" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Body with Legacy Tab Sidebar + Workspace Content */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 gap-6">
        {/* Legacy Treeview Sidebar */}
        <aside className="no-print hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-20 glass-panel p-3 rounded-2xl border border-slate-800/80 space-y-2">
            <div className="px-3 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-2">
              System Modules (Legacy Layout)
            </div>

            <div className="space-y-1">
              {legacyMenuStructure.map((catGroup) => {
                const CatIcon = catGroup.icon;
                const isOpen = openCategories[catGroup.category];

                return (
                  <div key={catGroup.category} className="space-y-1">
                    {/* Category Header (Treeview parent) */}
                    <button
                      onClick={() => toggleCategory(catGroup.category)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-slate-200 hover:bg-slate-900/80 transition-all"
                    >
                      <div className="flex items-center gap-2.5">
                        <CatIcon className="w-4 h-4 text-cyan-400" />
                        <span>{catGroup.category}</span>
                      </div>
                      {isOpen ? (
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      )}
                    </button>

                    {/* Submenu items (Treeview children) */}
                    {isOpen && (
                      <div className="pl-4 space-y-0.5 border-l border-slate-800 ml-3">
                        {catGroup.items.map((subItem) => {
                          const SubIcon = subItem.icon;
                          const isActive = activeSubMenu === subItem.id;

                          return (
                            <button
                              key={subItem.id}
                              onClick={() => {
                                setActiveMenu(catGroup.category);
                                setActiveSubMenu(subItem.id);
                              }}
                              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                                isActive
                                  ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30 glow-cyan'
                                  : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                              }`}
                            >
                              <SubIcon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                              <span>{subItem.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Mobile Submenu Toolbar */}
        <div className="no-print lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-xl border-t border-slate-800 p-2 flex overflow-x-auto gap-2">
          {legacyMenuStructure.flatMap(g => g.items).map(item => (
            <button
              key={item.id}
              onClick={() => setActiveSubMenu(item.id)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold ${
                activeSubMenu === item.id ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 bg-slate-800'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Workspace Views based on Legacy Sub-Menu Selectors */}
        <main className="flex-1 min-w-0 pb-16 lg:pb-0">
          {/* Dashboard Module */}
          {activeSubMenu === 'dashboard' && (
            <Dashboard 
              setActiveTab={(tabKey) => {
                if (tabKey === 'register') {
                  setActiveMenu('Registration');
                  setActiveSubMenu('patient_registeration');
                } else if (tabKey === 'shipping-register') {
                  setActiveMenu('Shipping');
                  setActiveSubMenu('shipping_registration');
                } else if (tabKey === 'inventory') {
                  setActiveMenu('Admin');
                  setActiveSubMenu('VaccineStock');
                }
              }} 
              setSelectedPatient={setSelectedPatient} 
            />
          )}

          {/* Admin Category Views */}
          {(activeSubMenu === 'Info' || activeSubMenu === 'User' || activeSubMenu === 'Employee' || activeSubMenu === 'Regfee' || activeSubMenu === 'Countryfee') && (
            <UserManagement 
              currentRole={currentRole} 
              setCurrentRole={setCurrentRole} 
            />
          )}

          {(activeSubMenu === 'VaccineStock' || activeSubMenu === 'Supplier' || activeSubMenu === 'Item' || activeSubMenu === 'Purchase' || activeSubMenu === 'PurchaseEntry_Report' || activeSubMenu === 'Stock_Report') && (
            <VaccineInventory />
          )}

          {(activeSubMenu === 'Mofa_data' || activeSubMenu === 'MOFA_DATA_REPORT') && (
            <MofaTracker />
          )}

          {/* Registration Category Views */}
          {activeSubMenu === 'patient_registeration' && (
            <PatientRegistration 
              onCompleteRegistration={(pat) => {
                setSelectedPatient(pat);
                setActiveMenu('Registration');
                setActiveSubMenu('Patient_queue');
              }} 
            />
          )}

          {activeSubMenu === 'Patient_queue' && (
            <LiveQueue 
              onSelectPatient={setSelectedPatient} 
              setActiveTab={(tabKey) => {
                if (tabKey === 'lab') {
                  setActiveMenu('Registration');
                  setActiveSubMenu('lab_entry');
                } else if (tabKey === 'medical') {
                  setActiveMenu('Registration');
                  setActiveSubMenu('physical_exam');
                } else if (tabKey === 'certificate') {
                  setActiveMenu('Reports');
                  setActiveSubMenu('fit_certificate');
                }
              }} 
            />
          )}

          {(activeSubMenu === 'ManageRegistration' || activeSubMenu === 'ManageRegistration_Shipping' || activeSubMenu === 'REG_REPORT' || activeSubMenu === 'CONS_REPORT' || activeSubMenu === 'VACCINATION_REPORT' || activeSubMenu === 'excel_report' || activeSubMenu === 'lab_register_report') && (
            <ReportsModule 
              onSelectPatient={setSelectedPatient} 
              setActiveTab={(tabKey) => {
                if (tabKey === 'certificate') {
                  setActiveMenu('Reports');
                  setActiveSubMenu('fit_certificate');
                }
              }} 
            />
          )}

          {/* Shipping Category Views */}
          {activeSubMenu === 'shipping_registration' && (
            <ShippingRegistration 
              onCompleteRegistration={(pat) => {
                setSelectedPatient(pat);
                setActiveMenu('Registration');
                setActiveSubMenu('Patient_queue');
              }} 
            />
          )}

          {/* Dedicated Submodules */}
          {activeSubMenu === 'lab_entry' && (
            <LabEntry 
              selectedPatient={selectedPatient} 
              setSelectedPatient={setSelectedPatient} 
            />
          )}

          {activeSubMenu === 'physical_exam' && (
            <PhysicalExamination 
              selectedPatient={selectedPatient} 
              setSelectedPatient={setSelectedPatient} 
              onCompleteExam={(pat) => {
                setSelectedPatient(pat);
                setActiveMenu('Reports');
                setActiveSubMenu('fit_certificate');
              }}
            />
          )}

          {activeSubMenu === 'fit_certificate' && (
            <FitCertificatePrint 
              patient={selectedPatient} 
              onBack={() => {
                setActiveMenu('Registration');
                setActiveSubMenu('Patient_queue');
              }} 
            />
          )}
        </main>
      </div>
    </div>
  );
}
