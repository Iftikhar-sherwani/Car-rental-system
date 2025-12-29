import React, { useState } from 'react';
import { Car } from '../types';
import { Plus, Trash2, Gauge, Users, Palette, DollarSign, Fuel, Car as CarIcon } from 'lucide-react';

interface CarManagerProps {
  cars: Car[];
  onAddCar: (car: Car) => void;
  onDeleteCar: (id: string) => void;
}

export const CarManager: React.FC<CarManagerProps> = ({ cars, onAddCar, onDeleteCar }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCar, setNewCar] = useState<Partial<Car>>({
    name: '',
    engineCC: '',
    seatingCapacity: 4,
    color: '',
    rentPerDay: 0,
    status: 'Available',
    totalRides: 0
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCar.name && newCar.engineCC && newCar.rentPerDay) {
      onAddCar({
        ...newCar,
        id: crypto.randomUUID(),
        totalRides: 0,
        status: 'Available'
      } as Car);
      setIsModalOpen(false);
      setNewCar({ name: '', engineCC: '', seatingCapacity: 4, color: '', rentPerDay: 0 });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end border-b border-slate-200 pb-6">
        <div>
           <h2 className="text-3xl font-bold text-slate-900">Fleet Inventory</h2>
           <p className="text-slate-500 mt-1">Manage and track your vehicle assets.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-all font-semibold shadow-lg shadow-blue-500/30 hover:-translate-y-0.5"
        >
          <Plus size={20} /> Add New Vehicle
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {cars.map(car => (
          <div key={car.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 relative group">
            {/* Status Indicator Line */}
            <div className={`absolute top-6 left-0 w-1 h-12 rounded-r-lg ${
               car.status === 'Available' ? 'bg-emerald-500' : car.status === 'Rented' ? 'bg-orange-500' : 'bg-red-500'
            }`}></div>

            <div className="flex justify-between items-start mb-6 pl-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{car.name}</h3>
                <span className={`inline-block mt-2 text-[10px] uppercase font-bold px-3 py-1 rounded-full border ${
                  car.status === 'Available' 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                    : car.status === 'Rented' 
                    ? 'bg-orange-50 text-orange-700 border-orange-100' 
                    : 'bg-red-50 text-red-700 border-red-100'
                }`}>
                  {car.status}
                </span>
              </div>
              <div className="bg-slate-50 p-2 rounded-lg group-hover:bg-slate-100 transition-colors">
                 <CarIcon size={24} className="text-slate-400" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div className="flex items-center gap-2">
                <Gauge size={16} className="text-slate-400" />
                <span className="font-medium text-slate-700">{car.engineCC}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users size={16} className="text-slate-400" />
                <span className="font-medium text-slate-700">{car.seatingCapacity} Seats</span>
              </div>
              <div className="flex items-center gap-2">
                <Palette size={16} className="text-slate-400" />
                <span className="font-medium text-slate-700">{car.color}</span>
              </div>
              <div className="flex items-center gap-2">
                <Fuel size={16} className="text-slate-400" />
                <span className="font-medium text-slate-700">Petrol</span>
              </div>
            </div>

            <div className="mt-6 flex justify-between items-center">
               <div>
                  <span className="block text-xs text-slate-400 font-semibold uppercase">Daily Rate</span>
                  <div className="text-2xl font-bold text-slate-900 flex items-center">
                    <span className="text-lg text-slate-400 font-normal mr-1">$</span>
                    {car.rentPerDay}
                  </div>
               </div>
               
               <div className="flex gap-2">
                 <button 
                  onClick={() => { if(confirm('Delete this car?')) onDeleteCar(car.id) }}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete Vehicle"
                 >
                  <Trash2 size={20} />
                 </button>
               </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Car Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 animate-fade-in border border-slate-100">
            <h3 className="text-2xl font-bold text-slate-900 mb-1">Add New Vehicle</h3>
            <p className="text-slate-500 mb-6 text-sm">Enter the technical specifications of the new fleet unit.</p>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Vehicle Name</label>
                <input 
                  required
                  type="text" 
                  value={newCar.name} 
                  onChange={e => setNewCar({...newCar, name: e.target.value})}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-slate-900 placeholder-slate-400 font-medium"
                  placeholder="e.g. Toyota Camry 2024"
                />
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Engine Capacity</label>
                  <input 
                    required
                    type="text" 
                    value={newCar.engineCC} 
                    onChange={e => setNewCar({...newCar, engineCC: e.target.value})}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-slate-900 placeholder-slate-400"
                    placeholder="e.g. 2500cc"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Seats</label>
                  <input 
                    required
                    type="number" 
                    value={newCar.seatingCapacity} 
                    onChange={e => setNewCar({...newCar, seatingCapacity: parseInt(e.target.value)})}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-slate-900"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Exterior Color</label>
                  <input 
                    required
                    type="text" 
                    value={newCar.color} 
                    onChange={e => setNewCar({...newCar, color: e.target.value})}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-slate-900 placeholder-slate-400"
                    placeholder="e.g. Midnight Black"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Rent / Day ($)</label>
                  <input 
                    required
                    type="number" 
                    value={newCar.rentPerDay} 
                    onChange={e => setNewCar({...newCar, rentPerDay: parseFloat(e.target.value)})}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-slate-900"
                  />
                </div>
              </div>
              <div className="flex gap-4 mt-8">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-3 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 font-bold transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-bold shadow-lg shadow-blue-500/30 transition-all hover:scale-[1.02]"
                >
                  Confirm Addition
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};