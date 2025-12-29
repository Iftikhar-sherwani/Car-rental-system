import React, { useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { Car, Rental } from '../types';
import { Car as CarIcon, Banknote, Users, Activity, TrendingUp } from 'lucide-react';

interface DashboardProps {
  cars: Car[];
  rentals: Rental[];
}

export const Dashboard: React.FC<DashboardProps> = ({ cars, rentals }) => {
  
  const stats = useMemo(() => {
    const availableCars = cars.filter(c => c.status === 'Available').length;
    const activeRentals = rentals.filter(r => r.status === 'Active').length;
    
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
    const monthlyRevenue = rentals
      .filter(r => r.startDate.startsWith(currentMonth))
      .reduce((acc, curr) => acc + curr.totalAmount, 0);

    const totalRides = cars.reduce((acc, curr) => acc + curr.totalRides, 0);

    return { availableCars, activeRentals, monthlyRevenue, totalRides };
  }, [cars, rentals]);

  const chartData = useMemo(() => {
    const data = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const monthStr = d.toISOString().slice(0, 7);
      const monthName = d.toLocaleString('default', { month: 'short' });
      
      const revenue = rentals
        .filter(r => r.startDate.startsWith(monthStr))
        .reduce((acc, curr) => acc + curr.totalAmount, 0);
        
      data.push({ name: monthName, revenue });
    }
    return data;
  }, [rentals]);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Mission Control</h2>
          <p className="text-slate-500 mt-1">Real-time fleet analytics and performance metrics.</p>
        </div>
        <div className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100 flex items-center gap-1">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
          System Online
        </div>
      </div>
      
      {/* Stats Cards - Widget Style */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Fleet Availability" 
          value={stats.availableCars} 
          icon={<CarIcon size={22} className="text-white" />}
          color="bg-blue-600"
          trend="Vehicles Ready"
          accent="border-blue-600"
        />
        <StatCard 
          title="Revenue (Month)" 
          value={`$${stats.monthlyRevenue.toLocaleString()}`} 
          icon={<Banknote size={22} className="text-white" />}
          color="bg-emerald-600"
          trend="+12% vs last mo"
          accent="border-emerald-600"
        />
        <StatCard 
          title="Total Rides" 
          value={stats.totalRides} 
          icon={<Activity size={22} className="text-white" />}
          color="bg-violet-600"
          trend="Lifetime Trips"
          accent="border-violet-600"
        />
        <StatCard 
          title="Active Rentals" 
          value={stats.activeRentals} 
          icon={<Users size={22} className="text-white" />}
          color="bg-orange-500"
          trend="Currently Out"
          accent="border-orange-500"
        />
      </div>

      {/* Chart Section */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="text-lg font-bold text-slate-800">Revenue Performance</h3>
            <p className="text-sm text-slate-500">6-Month Trend Analysis</p>
          </div>
          <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
            <TrendingUp className="text-slate-400" size={20} />
          </div>
        </div>
        
        {/* Explicit height style helps Recharts render correctly on initial load */}
        <div style={{ width: '100%', height: 320 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} tickFormatter={(value) => `$${value}`} />
              <Tooltip 
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px' }}
              />
              <Bar dataKey="revenue" radius={[6, 6, 0, 0]} barSize={40}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill="url(#colorRevenue)" />
                ))}
              </Bar>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563eb" stopOpacity={1}/>
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.8}/>
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color, trend, accent }: any) => (
  <div className={`relative bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden group`}>
    <div className={`absolute top-0 left-0 w-full h-1 ${color}`}></div>
    <div className="flex justify-between items-start">
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-slate-900 tracking-tight">{value}</h3>
      </div>
      <div className={`p-3 rounded-xl shadow-lg shadow-slate-200 ${color} transition-transform group-hover:scale-110`}>
        {icon}
      </div>
    </div>
    <div className="mt-4 flex items-center gap-2 text-xs font-medium text-slate-500">
      <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
      {trend}
    </div>
  </div>
);