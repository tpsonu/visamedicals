const BASE_URL = '/api';

export const fetchClinicInfo = async () => {
  const res = await fetch(`${BASE_URL}/info`);
  return res.json();
};

export const updateClinicInfo = async (data) => {
  const res = await fetch(`${BASE_URL}/info`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
};

export const fetchCountries = async () => {
  const res = await fetch(`${BASE_URL}/countries`);
  return res.json();
};

export const fetchUsers = async () => {
  const res = await fetch(`${BASE_URL}/users`);
  return res.json();
};

export const fetchRegistrations = async (search = '', stage = '') => {
  const params = new URLSearchParams();
  if (search) params.append('search', search);
  if (stage) params.append('status_stage', stage);
  const res = await fetch(`${BASE_URL}/registrations?${params.toString()}`);
  return res.json();
};

export const fetchRegistrationById = async (id) => {
  const res = await fetch(`${BASE_URL}/registrations/${id}`);
  return res.json();
};

export const createRegistration = async (data) => {
  const res = await fetch(`${BASE_URL}/registrations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
};

export const fetchQueue = async () => {
  const res = await fetch(`${BASE_URL}/queue`);
  return res.json();
};

export const updatePatientStage = async (id, stage, medicalStatus = null) => {
  const res = await fetch(`${BASE_URL}/registrations/${id}/stage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ stage, medical_status: medicalStatus })
  });
  return res.json();
};

export const submitLabResult = async (id, labData) => {
  const res = await fetch(`${BASE_URL}/lab/${id}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(labData)
  });
  return res.json();
};

export const submitMedicalResult = async (id, medicalData) => {
  const res = await fetch(`${BASE_URL}/medical/${id}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(medicalData)
  });
  return res.json();
};

export const fetchInventory = async () => {
  const res = await fetch(`${BASE_URL}/inventory`);
  return res.json();
};

export const addInventoryBatch = async (batchData) => {
  const res = await fetch(`${BASE_URL}/inventory/batch`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(batchData)
  });
  return res.json();
};

export const fetchMofaEntries = async () => {
  const res = await fetch(`${BASE_URL}/mofa`);
  return res.json();
};

export const addMofaEntry = async (mofaData) => {
  const res = await fetch(`${BASE_URL}/mofa`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(mofaData)
  });
  return res.json();
};

export const fetchAnalytics = async () => {
  const res = await fetch(`${BASE_URL}/analytics`);
  return res.json();
};
