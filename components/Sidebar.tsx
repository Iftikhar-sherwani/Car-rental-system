import React from 'react';
import { LayoutDashboard, Car, Users, BarChart3, Wrench, LogOut, Gauge } from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onChangeView: (view: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'cars', label: 'Fleet Inventory', icon: <Car size={20} /> },
    { id: 'clients', label: 'Rentals & Clients', icon: <Users size={20} /> },
    { id: 'revenue', label: 'Financials', icon: <BarChart3 size={20} /> },
    { id: 'maintenance', label: 'Service Log', icon: <Wrench size={20} /> },
  ];

  return (
    <div className="h-screen w-64 bg-slate-900 text-white flex flex-col fixed left-0 top-0 shadow-2xl z-50 font-sans">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-800 bg-gradient-to-r from-slate-900 to-slate-800">
        <h1 className="text-2xl font-bold tracking-tighter flex items-center gap-2 italic">
          <Gauge className="text-blue-500" size={28} />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            DRIVE<span className="text-blue-500">FLOW</span>
          </span>
        </h1>
        <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest font-semibold pl-9">
          Fleet Systems
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => onChangeView(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group relative overflow-hidden ${
              currentView === item.id 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            {/* Hover Glow Effect */}
            <div className={`absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 transition-opacity duration-300 ${currentView !== item.id && 'group-hover:opacity-100'}`} />
            
            <span className="relative z-10">{item.icon}</span>
            <span className="font-medium text-sm tracking-wide relative z-10">{item.label}</span>
            
            {currentView === item.id && (
              <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
            )}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-800 bg-slate-900">
        <button className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-400 transition-colors w-full rounded-lg hover:bg-slate-800/50">
          <LogOut size={20} />
          <span className="font-medium text-sm">Sign Out</span>
        </button>
      </div>
    </div>
  );
};