import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'visamedicals_db.json');

// Initial seed data based on brand_visa.sql
const initialData = {
  hcare_info: {
    id: 1,
    name: "AL SHIFA VISA & MARITIME MEDICAL CENTER",
    address: "Suite 405, Healthcare Towers, Medical District",
    city: "Mumbai",
    state: "Maharashtra",
    country: "India",
    zip_code: "400001",
    phone: "+91 22 5555 0199",
    mobile: "+91 98200 12345",
    fax: "+91 22 5555 0190",
    email: "info@alshifamedicals.com",
    gcc: "GCC-MED-88910",
    reg_no: "MH-MED-2024-9981",
    logo: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=150&h=150&fit=crop&crop=faces"
  },
  countries: [
    { id: 1, country: "Saudi Arabia", reg_fee: 9500, gcc_status: 1 },
    { id: 2, country: "Qatar", reg_fee: 7500, gcc_status: 1 },
    { id: 3, country: "UAE", reg_fee: 9500, gcc_status: 1 },
    { id: 4, country: "Oman", reg_fee: 9500, gcc_status: 1 },
    { id: 5, country: "Kuwait", reg_fee: 9500, gcc_status: 1 },
    { id: 6, country: "Bahrain", reg_fee: 9500, gcc_status: 1 },
    { id: 7, country: "UK", reg_fee: 12000, gcc_status: 0 },
    { id: 8, country: "Canada", reg_fee: 14000, gcc_status: 0 },
    { id: 9, country: "Australia", reg_fee: 15000, gcc_status: 0 },
    { id: 10, country: "Malaysia", reg_fee: 4500, gcc_status: 0 },
    { id: 11, country: "Maldives", reg_fee: 5000, gcc_status: 0 },
    { id: 12, country: "Maritime Seafarer (DG Shipping)", reg_fee: 8500, gcc_status: 0 }
  ],
  users: [
    { id: 1, employee: "ADMINISTRATOR", user_name: "admin", role: "ADMIN", status: 0 },
    { id: 2, employee: "DR. SERGIO AYALA", user_name: "drsergio", role: "DOCTOR", status: 0 },
    { id: 3, employee: "DR. FATIMA KHAN", user_name: "drfatima", role: "DOCTOR", status: 0 },
    { id: 4, employee: "RECEPTION DESK 1", user_name: "reception", role: "RECEPTION", status: 0 },
    { id: 5, employee: "CHIEF LAB TECH", user_name: "labtech", role: "LAB", status: 0 },
    { id: 6, employee: "X-RAY TECHNICIAN", user_name: "xraytech", role: "X-RAY", status: 0 },
    { id: 7, employee: "PHARMACY MANAGER", user_name: "pharma", role: "PHARMA ADMIN", status: 0 }
  ],
  machine_tests: [
    { id: 1, test: "GLUCOSE / FBS", status: 0 },
    { id: 2, test: "CREATININE ENZ", status: 0 },
    { id: 3, test: "UREA", status: 0 },
    { id: 4, test: "BILIRUBIN TOTAL", status: 0 },
    { id: 5, test: "BILIRUBIN DIRECT", status: 0 },
    { id: 6, test: "SGOT", status: 0 },
    { id: 7, test: "SGPT", status: 0 },
    { id: 8, test: "ALBUMIN", status: 0 },
    { id: 9, test: "TOTAL PROTEIN", status: 0 },
    { id: 10, test: "HIV I & II", status: 0 },
    { id: 11, test: "HBsAg", status: 0 },
    { id: 12, test: "ANTI HCV", status: 0 },
    { id: 13, test: "VDRL / TPHA", status: 0 },
    { id: 14, test: "HAEMOGLOBIN (Hb)", status: 0 }
  ],
  inventory_items: [
    { id: 1, item: "Meningococcal Vaccine (M)", manufacturer: "Sanofi Pasteur", description: "Quadrivalent ACYW Meningitis Vaccine", status: 0 },
    { id: 2, item: "MMR Vaccine", manufacturer: "GlaxoSmithKline", description: "Measles, Mumps & Rubella Combined", status: 0 },
    { id: 3, item: "Yellow Fever Vaccine", manufacturer: "Bio-Manguinhos", description: "Yellow Fever Live Attenuated", status: 0 },
    { id: 4, item: "Typhoid Conjugate Vaccine", manufacturer: "Bharat Biotech", description: "Typhoid Vi Conjugate", status: 0 }
  ],
  inventory_batches: [
    { id: 101, purchase_id: 1, item_id: 1, batch: "MEN-2026-B88", expiry: "2027-11-30", quantity: 500, stock: 342, update_history: "Initial stock load", status: 0 },
    { id: 102, purchase_id: 1, item_id: 2, batch: "MMR-9021-X4", expiry: "2026-09-15", quantity: 300, stock: 45, update_history: "Nearing expiry warning", status: 0 },
    { id: 103, purchase_id: 2, item_id: 3, batch: "YF-441-A2", expiry: "2028-04-20", quantity: 200, stock: 180, update_history: "Fresh batch", status: 0 },
    { id: 104, purchase_id: 2, item_id: 4, batch: "TYP-882-C1", expiry: "2027-08-10", quantity: 400, stock: 290, update_history: "Stock loaded", status: 0 }
  ],
  suppliers: [
    { id: 1, name: "Global Pharma Distributors Ltd", address: "Plot 42, Pharma Zone", contact: "9821099887", email: "orders@globalpharma.com", status: 0 },
    { id: 2, name: "MediCare Vaccines Corp", address: "Biotech Park, Sec 5", contact: "9821044332", email: "supply@medicarevaccines.org", status: 0 }
  ],
  registrations: [
    {
      id: 1001,
      token: 1,
      first_name: "MOHAMMED",
      middle_name: "TARIQ",
      last_name: "AL-MANSOORI",
      dob: "1994-06-15",
      age: "32",
      gender: "MALE",
      marital_status: "MARRIED",
      nationality: "INDIAN",
      place: "MUMBAI",
      passport_no: "Z9810472",
      date_issued: "2022-03-10",
      height: "175 cm",
      weight: 74,
      travelling_to: "Saudi Arabia",
      visa_no: "KSA-901844",
      visa_date: "2026-07-20",
      profession: "CIVIL ENGINEER",
      recruting_agency: "AL SHAMS OVERSEAS CONSULTANTS",
      embassy: "SAUDI CONSULATE MUMBAI",
      gamca_no: "GAMCA-SA-2026-88192",
      mofa_no: "MOFA-88102495",
      visit_date: "2026-08-12",
      time: "09:30:00",
      reg_type: "GCC_VISA",
      reg_fee: 9500,
      payment_mode: "CASH",
      phone_no: "9820199881",
      medical_status: "FIT",
      blood_taken: "YES",
      xray_taken: "YES",
      vaccination_taken: "Meningococcal, MMR",
      fingure_status: 1,
      status_stage: "COMPLETED", // RECEPTION -> LAB -> PHYSICAL -> DOCTOR -> COMPLETED
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces",
      lab_result: {
        sugar: "NIL",
        albumin: "NIL",
        bilharziasis: "NEGATIVE",
        helminthes: "NOT FOUND",
        giardia: "NOT FOUND",
        bil_culture: "NO GROWTH",
        salmonella: "NEGATIVE",
        cholera: "NEGATIVE",
        fbs: "92 mg/dL",
        lfts: "NORMAL",
        creatinine: "0.9 mg/dL",
        blood_group: "O POSITIVE",
        haemoglobin: "14.8 g/dL",
        malaria: "NEGATIVE",
        micro_filaria: "NEGATIVE",
        hiv: "NON-REACTIVE",
        hbs: "NON-REACTIVE",
        hcv: "NON-REACTIVE",
        vdrl: "NON-REACTIVE",
        tpha: "NEGATIVE",
        pregnancy_test: "N/A",
        sgpt: "24 U/L",
        urine: "NORMAL",
        status: "PASSED"
      },
      medical_result: {
        eyes_lt: "6/6",
        eyes_rt: "6/6",
        ear_lt: "NORMAL",
        ear_rt: "NORMAL",
        cardio_vascular: "NORMAL",
        bp: "120/80 mmHg",
        heart: "S1 S2 NORMAL",
        lungs: "CLEAR",
        chest: "NORMAL",
        abdomen: "SOFT NON-TENDER",
        hernia: "ABSENT",
        varicose: "ABSENT",
        extremities: "NORMAL",
        deformities: "NONE",
        skin: "HEALTHY",
        clinical: "SATISFACTORY",
        cns: "INTACT",
        psychiatry: "NORMAL",
        remarks: "CANDIDATE IS PHYSICALLY AND MENTALLY FIT FOR SAUDI ARABIA EMPLOYMENT VISA.",
        status: "FIT"
      }
    },
    {
      id: 1002,
      token: 2,
      first_name: "RAHUL",
      middle_name: "KUMAR",
      last_name: "VERMA",
      dob: "1998-11-04",
      age: "27",
      gender: "MALE",
      marital_status: "SINGLE",
      nationality: "INDIAN",
      place: "DELHI",
      passport_no: "P4521098",
      date_issued: "2021-08-14",
      height: "168 cm",
      weight: 68,
      travelling_to: "Maritime Seafarer (DG Shipping)",
      visa_no: "SEAFARER-DG-9921",
      visa_date: "2026-08-01",
      profession: "CHIEF ENGINEER SEAFARER",
      recruting_agency: "MAERSK LINE MARITIME AGENCY",
      embassy: "DG SHIPPING INDIA",
      gamca_no: "SEAFARER-INDOS-99281",
      mofa_no: "N/A",
      visit_date: "2026-08-12",
      time: "10:15:00",
      reg_type: "MARITIME",
      reg_fee: 8500,
      payment_mode: "CREDIT_CARD",
      phone_no: "9811234567",
      medical_status: "IN_PROCESS",
      blood_taken: "YES",
      xray_taken: "YES",
      vaccination_taken: "Yellow Fever, MMR",
      fingure_status: 1,
      status_stage: "PHYSICAL_EXAM",
      photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=faces",
      shipping_details: {
        cdc_no: "CDC-MUM-882194",
        indos_no: "21IN882109",
        rank: "CHIEF ENGINEER",
        vessel: "MV OCEAN MONARCH",
        type: "CONTAINER SHIP",
        route: "INTERNATIONAL WATERS",
        company: "MAERSK LINE INDIA PVT LTD"
      },
      lab_result: {
        sugar: "NIL",
        albumin: "NIL",
        fbs: "88 mg/dL",
        creatinine: "0.85 mg/dL",
        blood_group: "A POSITIVE",
        haemoglobin: "15.2 g/dL",
        hiv: "NON-REACTIVE",
        hbs: "NON-REACTIVE",
        hcv: "NON-REACTIVE",
        vdrl: "NON-REACTIVE",
        tpha: "NEGATIVE",
        status: "PASSED"
      },
      medical_result: {
        eyes_lt: "6/6",
        eyes_rt: "6/6",
        ear_lt: "NORMAL (30 dB)",
        ear_rt: "NORMAL (25 dB)",
        bp: "118/78 mmHg",
        heart: "NORMAL",
        lungs: "CLEAR",
        remarks: "Undergoing doctor physical signoff.",
        status: "IN_PROCESS"
      }
    },
    {
      id: 1003,
      token: 3,
      first_name: "FATIMA",
      middle_name: "ZAHRA",
      last_name: "SHAIKH",
      dob: "1996-03-22",
      age: "30",
      gender: "FEMALE",
      marital_status: "MARRIED",
      nationality: "INDIAN",
      place: "HYDERABAD",
      passport_no: "N7710294",
      date_issued: "2023-01-18",
      height: "162 cm",
      weight: 58,
      travelling_to: "Qatar",
      visa_no: "QTR-881920",
      visa_date: "2026-06-12",
      profession: "STAFF NURSE",
      recruting_agency: "GLOBAL CARE MANPOWER",
      embassy: "QATAR EMBASSY NEW DELHI",
      gamca_no: "GAMCA-QT-2026-11029",
      mofa_no: "MOFA-7728104",
      visit_date: "2026-08-12",
      time: "11:00:00",
      reg_type: "GCC_VISA",
      reg_fee: 7500,
      payment_mode: "UPI",
      phone_no: "9849012345",
      medical_status: "IN_PROCESS",
      blood_taken: "YES",
      xray_taken: "PENDING",
      vaccination_taken: "Meningococcal",
      fingure_status: 1,
      status_stage: "LAB_TEST",
      photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=faces"
    }
  ],
  mofa_entries: [
    { id: 1, visit_id: "1001", pass_no: "Z9810472", mofa_no: "MOFA-88102495", status: "VERIFIED", date: "2026-08-12" },
    { id: 2, visit_id: "1003", pass_no: "N7710294", mofa_no: "MOFA-7728104", status: "PENDING_SYNC", date: "2026-08-12" }
  ],
  logs: [
    { id: 1, user: "admin", action: "System Started & Seeded", timestamp: new Date().toISOString() },
    { id: 2, user: "reception", action: "Registered Patient MOHAMMED TARIQ AL-MANSOORI", timestamp: new Date().toISOString() }
  ]
};

class JSONDatabase {
  constructor() {
    this.data = initialData;
    this.init();
  }

  init() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf8');
        this.data = JSON.parse(raw);
      } else {
        this.save();
      }
    } catch (e) {
      console.error("DB File load error, resetting to seed:", e);
      this.save();
    }
  }

  save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf8');
    } catch (e) {
      console.error("DB File write error:", e);
    }
  }

  get(table) {
    return this.data[table] || [];
  }

  set(table, records) {
    this.data[table] = records;
    this.save();
  }

  insert(table, item) {
    if (!this.data[table]) this.data[table] = [];
    const maxId = this.data[table].reduce((max, i) => i.id > max ? i.id : max, 1000);
    item.id = item.id || maxId + 1;
    this.data[table].unshift(item);
    this.save();
    return item;
  }

  update(table, id, patch) {
    if (!this.data[table]) return null;
    const idx = this.data[table].findIndex(i => String(i.id) === String(id));
    if (idx !== -1) {
      this.data[table][idx] = { ...this.data[table][idx], ...patch };
      this.save();
      return this.data[table][idx];
    }
    return null;
  }

  delete(table, id) {
    if (!this.data[table]) return false;
    this.data[table] = this.data[table].filter(i => String(i.id) !== String(id));
    this.save();
    return true;
  }
}

export const db = new JSONDatabase();
