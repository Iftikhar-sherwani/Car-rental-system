import React from 'react';
import { Rental } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

interface RevenueViewProps {
  rentals: Rental[];
}

export const RevenueView: React.FC<RevenueViewProps> = ({ rentals }) => {
  
  // Aggregate revenue by month
  const data = React.useMemo(() => {
    const map = new Map<string, number>();
    
    // Initialize last 6 months to 0 to show empty months
    for(let i=5; i>=0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const key = d.toLocaleString('default', { month: 'short', year: 'numeric' });
      map.set(key, 0);
    }

    rentals.forEach(r => {
      const date = new Date(r.startDate);
      const key = date.toLocaleString('default', { month: 'short', year: 'numeric' });
      // If the rental happened in a month not in our last-6-months window, we might miss it in the chart, 
      // but typically dashboards show recent history.
      // For simplicity, we just add to the key if it exists or create it.
      const current = map.get(key) || 0;
      map.set(key, current + r.totalAmount);
    });

    return Array.from(map.entries()).map(([name, amount]) => ({ name, amount }));
  }, [rentals]);

  const totalRevenue = rentals.reduce((acc, r) => acc + r.totalAmount, 0);
  const totalPending = rentals.reduce((acc, r) => acc + r.remainingBalance, 0);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-800">Financial Performance</h2>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
          <p className="text-indigo-100 font-medium mb-1">Total Lifetime Revenue</p>
          <h3 className="text-4xl font-bold">${totalRevenue.toLocaleString()}</h3>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <p className="text-slate-500 font-medium mb-1">Pending Balance (Receivables)</p>
          <h3 className="text-4xl font-bold text-slate-800">${totalPending.toLocaleString()}</h3>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold text-slate-700 mb-6">Monthly Revenue Breakdown</h3>
        <div style={{ width: '100%', height: 384 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} tickFormatter={(val) => `$${val}`} />
              <Tooltip 
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
              />
              <Legend />
              <Bar dataKey="amount" name="Revenue" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={50} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Transactions Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
           <h3 className="font-bold text-slate-700">Recent Transactions</h3>
        </div>
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500 font-medium">
            <tr>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Client</th>
              <th className="px-6 py-3">Car</th>
              <th className="px-6 py-3 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rentals.slice().reverse().slice(0, 5).map(r => (
              <tr key={r.id} className="hover:bg-slate-50">
                <td className="px-6 py-3">{new Date(r.startDate).toLocaleDateString()}</td>
                <td className="px-6 py-3 font-medium text-slate-800">{r.clientName}</td>
                <td className="px-6 py-3 text-slate-500">{r.carName}</td>
                <td className="px-6 py-3 text-right font-medium text-green-600">+${r.totalAmount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};