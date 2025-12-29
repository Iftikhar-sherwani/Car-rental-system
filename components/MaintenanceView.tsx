import React, { useState } from 'react';
import { Car, MaintenanceRecord } from '../types';
import { Wrench, Calendar, Droplet, Wind, FileText } from 'lucide-react';

interface MaintenanceViewProps {
  cars: Car[];
  records: MaintenanceRecord[];
  onAddRecord: (record: MaintenanceRecord) => void;
}

export const MaintenanceView: React.FC<MaintenanceViewProps> = ({ cars, records, onAddRecord }) => {
  const [form, setForm] = useState<Partial<MaintenanceRecord>>({
    carId: '',
    type: 'Oil Change',
    notes: '',
    cost: 0,
    date: new Date().toISOString().slice(0, 10)
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.carId) return alert('Select a car');
    
    const car = cars.find(c => c.id === form.carId);
    onAddRecord({
      id: crypto.randomUUID(),
      carName: car?.name || 'Unknown',
      ...form
    } as MaintenanceRecord);
    
    setForm({ ...form, carId: '', notes: '', cost: 0, type: 'Oil Change' });
  };

  // Sort records by date descending
  const sortedRecords = [...records].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Input Column */}
      <div className="lg:col-span-1">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 sticky top-6">
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="p-2 bg-slate-900 rounded-lg text-white">
               <Wrench size={20} />
            </div>
            Log Service
          </h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Target Vehicle</label>
              <select 
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 font-medium"
                value={form.carId}
                onChange={e => setForm({...form, carId: e.target.value})}
                required
              >
                <option value="">Select Vehicle</option>
                {cars.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Service Type</label>
              <select 
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-900"
                value={form.type}
                onChange={e => setForm({...form, type: e.target.value as any})}
              >
                <option value="Oil Change">Oil Change</option>
                <option value="Tuning">Engine Tuning</option>
                <option value="Air Filter">Air Filter Replacement</option>
                <option value="AC Filter">AC Filter Replacement</option>
                <option value="Other">General Repair/Other</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Service Date</label>
              <input 
                type="date"
                required
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-900"
                value={form.date}
                onChange={e => setForm({...form, date: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Total Cost ($)</label>
              <input 
                type="number"
                min="0"
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-900"
                value={form.cost}
                onChange={e => setForm({...form, cost: parseFloat(e.target.value) || 0})}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Technician Notes</label>
              <textarea 
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none text-slate-900"
                rows={3}
                value={form.notes}
                onChange={e => setForm({...form, notes: e.target.value})}
                placeholder="Details about parts, mechanic, etc..."
              ></textarea>
            </div>
            <button className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
              Save Maintenance Record
            </button>
          </form>
        </div>
      </div>

      {/* History Column */}
      <div className="lg:col-span-2">
         <h2 className="text-2xl font-bold text-slate-900 mb-6">Service History Log</h2>
         <div className="space-y-4">
            {sortedRecords.length === 0 && (
              <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-400">
                <FileText size={48} className="mx-auto mb-4 opacity-20" />
                <p>No maintenance records found in the database.</p>
              </div>
            )}
            {sortedRecords.map(rec => (
              <div key={rec.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-start gap-5 hover:border-blue-200 transition-colors">
                <div className={`p-4 rounded-xl shrink-0 ${
                  rec.type === 'Oil Change' ? 'bg-amber-100 text-amber-600' : 
                  rec.type.includes('Filter') ? 'bg-cyan-100 text-cyan-600' : 'bg-slate-100 text-slate-600'
                }`}>
                   {rec.type === 'Oil Change' ? <Droplet size={24} /> : rec.type.includes('Filter') ? <Wind size={24} /> : <Wrench size={24} />}
                </div>
                <div className="flex-1">
                   <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-lg font-bold text-slate-900">{rec.carName}</h4>
                        <span className="inline-block mt-1 text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{rec.type}</span>
                      </div>
                      <div className="text-right">
                        <span className="block text-lg font-bold text-slate-900">${rec.cost}</span>
                        <span className="block text-xs text-slate-400 font-medium flex items-center justify-end gap-1 mt-1">
                          <Calendar size={12} /> {rec.date}
                        </span>
                      </div>
                   </div>
                   {rec.notes && (
                     <div className="mt-3 text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                       <span className="font-semibold text-slate-400 text-xs uppercase mr-2">Notes:</span>
                       {rec.notes}
                     </div>
                   )}
                </div>
              </div>
            ))}
         </div>
      </div>
    </div>
  );
};