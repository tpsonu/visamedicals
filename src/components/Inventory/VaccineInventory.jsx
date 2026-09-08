import React, { useState, useEffect } from 'react';
import { fetchInventory, addInventoryBatch } from '../../services/api';
import { Syringe, Package, AlertTriangle, Plus, ShieldCheck, RefreshCw, Calendar } from 'lucide-react';

export default function VaccineInventory() {
  const [inventory, setInventory] = useState({ items: [], batches: [], suppliers: [] });
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  const [newBatch, setNewBatch] = useState({
    item_id: 1,
    batch: '',
    expiry: '2027-12-31',
    quantity: 100,
    stock: 100,
    update_history: 'New stock delivery'
  });

  useEffect(() => {
    loadInv();
  }, []);

  const loadInv = async () => {
    try {
      const data = await fetchInventory();
      setInventory(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBatchSubmit = async (e) => {
    e.preventDefault();
    try {
      await addInventoryBatch(newBatch);
      setShowAddModal(false);
      loadInv();
    } catch (e) {
      alert("Failed to add batch: " + e.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  const { items, batches } = inventory;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Syringe className="w-6 h-6 text-amber-400" /> Vaccine & Pharmacy Inventory Manager
          </h2>
          <p className="text-xs text-slate-400 mt-1">Track country-required vaccines, batch numbers, expiration alerts, and stock adjustments.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg"
        >
          <Plus className="w-4 h-4" /> Add Vaccine Stock Batch
        </button>
      </div>

      {/* Vaccine Catalog Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map(item => (
          <div key={item.id} className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                <Syringe className="w-5 h-5" />
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                item.totalStock > 100 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
              }`}>
                {item.totalStock} Doses Total
              </span>
            </div>
            <div>
              <h3 className="text-base font-bold text-white">{item.item}</h3>
              <p className="text-xs text-slate-400 mt-0.5">{item.manufacturer}</p>
            </div>
            <p className="text-xs text-slate-500">{item.description}</p>
          </div>
        ))}
      </div>

      {/* Batches Table */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
          <Package className="w-4 h-4 text-cyan-400" /> Active Vaccine Batches & Expiration Tracker
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 uppercase font-mono border-b border-slate-800">
              <tr>
                <th className="p-3">Item / Vaccine Name</th>
                <th className="p-3">Batch Number</th>
                <th className="p-3">Expiry Date</th>
                <th className="p-3">Initial Quantity</th>
                <th className="p-3">Remaining Stock</th>
                <th className="p-3">Expiry Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {batches.map(batch => {
                const item = items.find(i => String(i.id) === String(batch.item_id));
                const expDate = new Date(batch.expiry);
                const isNearingExp = expDate < new Date('2026-12-31');

                return (
                  <tr key={batch.id} className="hover:bg-slate-900/40 transition-all">
                    <td className="p-3 font-bold text-white">{item ? item.item : 'Vaccine'}</td>
                    <td className="p-3 font-mono text-cyan-300 font-bold">{batch.batch}</td>
                    <td className="p-3 font-mono text-slate-300">{batch.expiry}</td>
                    <td className="p-3 text-slate-400">{batch.quantity} doses</td>
                    <td className="p-3 font-bold text-amber-300">{batch.stock} doses</td>
                    <td className="p-3">
                      {isNearingExp ? (
                        <span className="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 font-bold text-[11px] inline-flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> Expiry Alert
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[11px] inline-flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" /> Valid Stock
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Batch Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-panel p-6 rounded-2xl border border-slate-700 w-full max-w-md space-y-4">
            <h3 className="text-lg font-bold text-white">Add New Vaccine Stock Batch</h3>

            <form onSubmit={handleAddBatchSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Vaccine Item</label>
                <select
                  value={newBatch.item_id}
                  onChange={e => setNewBatch({ ...newBatch, item_id: parseInt(e.target.value) })}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white"
                >
                  {items.map(i => (
                    <option key={i.id} value={i.id}>{i.item}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Batch Number</label>
                <input
                  type="text"
                  required
                  value={newBatch.batch}
                  onChange={e => setNewBatch({ ...newBatch, batch: e.target.value.toUpperCase() })}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white font-mono"
                  placeholder="MEN-2026-X99"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Expiry Date</label>
                  <input
                    type="date"
                    required
                    value={newBatch.expiry}
                    onChange={e => setNewBatch({ ...newBatch, expiry: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Quantity (Doses)</label>
                  <input
                    type="number"
                    required
                    value={newBatch.quantity}
                    onChange={e => setNewBatch({ ...newBatch, quantity: parseInt(e.target.value) || 0, stock: parseInt(e.target.value) || 0 })}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs"
                >
                  Save Batch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
