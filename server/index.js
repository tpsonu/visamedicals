import express from 'express';
import cors from 'cors';
import { db } from './db.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// 1. Healthcheck & Clinic Info
app.get('/api/health', (req, res) => {
  res.json({ status: 'ONLINE', timestamp: new Date().toISOString(), app: 'VisaMedicals Pro Node Backend' });
});

app.get('/api/info', (req, res) => {
  res.json(db.data.hcare_info);
});

app.put('/api/info', (req, res) => {
  db.data.hcare_info = { ...db.data.hcare_info, ...req.body };
  db.save();
  res.json(db.data.hcare_info);
});

// 2. Countries & Registration Fee Matrix
app.get('/api/countries', (req, res) => {
  res.json(db.get('countries'));
});

// 3. User Roles & Accounts
app.get('/api/users', (req, res) => {
  res.json(db.get('users'));
});

// 4. Registrations & Patient Intake
app.get('/api/registrations', (req, res) => {
  let regs = db.get('registrations');
  if (req.query.search) {
    const q = req.query.search.toLowerCase();
    regs = regs.filter(r => 
      (r.first_name && r.first_name.toLowerCase().includes(q)) ||
      (r.last_name && r.last_name.toLowerCase().includes(q)) ||
      (r.passport_no && r.passport_no.toLowerCase().includes(q)) ||
      (r.gamca_no && r.gamca_no.toLowerCase().includes(q)) ||
      (r.id && String(r.id).includes(q))
    );
  }
  if (req.query.status_stage) {
    regs = regs.filter(r => r.status_stage === req.query.status_stage);
  }
  res.json(regs);
});

app.get('/api/registrations/:id', (req, res) => {
  const reg = db.get('registrations').find(r => String(r.id) === String(req.params.id));
  if (!reg) return res.status(404).json({ error: 'Registration not found' });
  res.json(reg);
});

app.post('/api/registrations', (req, res) => {
  const regs = db.get('registrations');
  const token = regs.length + 1;
  const newReg = {
    ...req.body,
    reg_fee: parseFloat(req.body.reg_fee) || 0,
    token,
    visit_date: new Date().toISOString().split('T')[0],
    time: new Date().toLocaleTimeString('en-US', { hour12: false }),
    medical_status: 'IN_PROCESS',
    blood_taken: req.body.blood_taken || 'YES',
    xray_taken: req.body.xray_taken || 'PENDING',
    status_stage: 'LAB_TEST',
    fingure_status: 1
  };

  // Stock deduction for assigned vaccines if any
  if (req.body.vaccines && Array.isArray(req.body.vaccines)) {
    const batches = db.get('inventory_batches');
    req.body.vaccines.forEach(vId => {
      const batch = batches.find(b => String(b.item_id) === String(vId) && b.stock > 0);
      if (batch) {
        batch.stock = Math.max(0, batch.stock - 1);
      }
    });
    db.set('inventory_batches', batches);
  }

  const created = db.insert('registrations', newReg);
  
  // Log activity
  db.insert('logs', {
    user: req.body.registered_by || 'reception',
    action: `Registered patient ${created.first_name} ${created.last_name} (Passport: ${created.passport_no})`,
    timestamp: new Date().toISOString()
  });

  res.json(created);
});

app.put('/api/registrations/:id', (req, res) => {
  const updated = db.update('registrations', req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Registration not found' });
  res.json(updated);
});

// 5. Token Queue State
app.get('/api/queue', (req, res) => {
  const regs = db.get('registrations');
  const queue = {
    reception: regs.filter(r => r.status_stage === 'RECEPTION'),
    lab: regs.filter(r => r.status_stage === 'LAB_TEST'),
    xray: regs.filter(r => r.status_stage === 'XRAY_TEST'),
    physical: regs.filter(r => r.status_stage === 'PHYSICAL_EXAM'),
    doctor: regs.filter(r => r.status_stage === 'DOCTOR_SIGNOFF'),
    completed: regs.filter(r => r.status_stage === 'COMPLETED')
  };
  res.json(queue);
});

app.post('/api/registrations/:id/stage', (req, res) => {
  const { stage, medical_status } = req.body;
  const patch = { status_stage: stage };
  if (medical_status) patch.medical_status = medical_status;
  const updated = db.update('registrations', req.params.id, patch);
  res.json(updated);
});

// 6. Lab Diagnostics Entry
app.post('/api/lab/:id', (req, res) => {
  const regId = req.params.id;
  const reg = db.get('registrations').find(r => String(r.id) === String(regId));
  if (!reg) return res.status(404).json({ error: 'Patient not found' });

  const lab_result = { ...req.body, status: 'PASSED', updated_at: new Date().toISOString() };
  const updated = db.update('registrations', regId, {
    lab_result,
    blood_taken: 'YES',
    status_stage: 'PHYSICAL_EXAM'
  });
  res.json(updated);
});

// 7. Clinical / Medical Physical Examination Entry
app.post('/api/medical/:id', (req, res) => {
  const regId = req.params.id;
  const reg = db.get('registrations').find(r => String(r.id) === String(regId));
  if (!reg) return res.status(404).json({ error: 'Patient not found' });

  const medical_result = { ...req.body, updated_at: new Date().toISOString() };
  const status = req.body.status || 'FIT';
  const updated = db.update('registrations', regId, {
    medical_result,
    medical_status: status,
    status_stage: 'COMPLETED'
  });

  db.insert('logs', {
    user: 'doctor',
    action: `Finalized medical assessment for ${reg.first_name} ${reg.last_name}: ${status}`,
    timestamp: new Date().toISOString()
  });

  res.json(updated);
});

// 8. Inventory & Vaccine Batches
app.get('/api/inventory', (req, res) => {
  const items = db.get('inventory_items');
  const batches = db.get('inventory_batches');
  const suppliers = db.get('suppliers');
  
  const mergedItems = items.map(item => {
    const itemBatches = batches.filter(b => String(b.item_id) === String(item.id));
    const totalStock = itemBatches.reduce((acc, b) => acc + (b.stock || 0), 0);
    return { ...item, batches: itemBatches, totalStock };
  });

  res.json({ items: mergedItems, batches, suppliers });
});

app.post('/api/inventory/batch', (req, res) => {
  const batch = db.insert('inventory_batches', req.body);
  res.json(batch);
});

app.put('/api/inventory/batch/:id', (req, res) => {
  const updated = db.update('inventory_batches', req.params.id, req.body);
  res.json(updated);
});

// 9. MOFA Tracking
app.get('/api/mofa', (req, res) => {
  res.json(db.get('mofa_entries'));
});

app.post('/api/mofa', (req, res) => {
  const entry = db.insert('mofa_entries', {
    ...req.body,
    status: 'VERIFIED',
    date: new Date().toISOString().split('T')[0]
  });
  res.json(entry);
});

// 10. Analytics Dashboard Stats
app.get('/api/analytics', (req, res) => {
  const regs = db.get('registrations');
  const totalRegistrations = regs.length;
  const fitCount = regs.filter(r => r.medical_status === 'FIT').length;
  const unfitCount = regs.filter(r => r.medical_status === 'UNFIT').length;
  const inProcessCount = regs.filter(r => r.medical_status === 'IN_PROCESS').length;
  
  const revenue = regs.reduce((sum, r) => sum + (parseFloat(r.reg_fee) || 0), 0);
  
  // Country breakdown
  const countryMap = {};
  regs.forEach(r => {
    const c = r.travelling_to || 'Other';
    countryMap[c] = (countryMap[c] || 0) + 1;
  });

  // Low stock vaccine alerts
  const batches = db.get('inventory_batches');
  const items = db.get('inventory_items');
  const lowStockAlerts = batches.filter(b => b.stock < 50).map(b => {
    const item = items.find(i => String(i.id) === String(b.item_id));
    return {
      batch: b.batch,
      stock: b.stock,
      expiry: b.expiry,
      itemName: item ? item.item : 'Vaccine Item'
    };
  });

  res.json({
    totalRegistrations,
    fitCount,
    unfitCount,
    inProcessCount,
    revenue,
    countryMap,
    lowStockAlerts,
    recentLogs: db.get('logs').slice(0, 10)
  });
});

app.listen(PORT, () => {
  console.log(`VisaMedicals Pro API Server running on port ${PORT}`);
});
