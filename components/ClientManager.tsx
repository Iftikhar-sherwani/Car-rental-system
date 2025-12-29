import React, { useState } from 'react';
import { Car, Client, Rental } from '../types';
import { CheckCircle, Clock, Calendar, X, CreditCard, Banknote } from 'lucide-react';

interface ClientManagerProps {
  cars: Car[];
  clients: Client[];
  rentals: Rental[];
  onAddRental: (rental: Rental, client: Client) => void;
  onReturnCar: (rentalId: string) => void;
}

export const ClientManager: React.FC<ClientManagerProps> = ({ 
  cars, clients, rentals, onAddRental, onReturnCar 
}) => {
  const [activeTab, setActiveTab] = useState<'new' | 'active'>('new');
  const [returnModal, setReturnModal] = useState<{isOpen: boolean, rental: Rental | null}>({ isOpen: false, rental: null });
  
  // Form State
  const [selectedClient, setSelectedClient] = useState<string>('new');
  const [clientForm, setClientForm] = useState<Partial<Client>>({ name: '', phone: '', nic: '' });
  const [rentalForm, setRentalForm] = useState({
    carId: '',
    days: 1,
    discount: 0,
    startDate: new Date().toISOString().slice(0, 16),
    advance: 0
  });

  // Derived Calculations
  const selectedCar = cars.find(c => c.id === rentalForm.carId);
  const totalRaw = selectedCar ? selectedCar.rentPerDay * rentalForm.days : 0;
  const discountAmount = (totalRaw * rentalForm.discount) / 100;
  const finalTotal = totalRaw - discountAmount;
  const remaining = finalTotal - rentalForm.advance;
  
  const endDate = new Date(rentalForm.startDate);
  endDate.setDate(endDate.getDate() + rentalForm.days);
  const endDateStr = endDate.toLocaleString();

  const handleRentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rentalForm.carId) return alert("Please select a car");

    const clientId = selectedClient === 'new' ? crypto.randomUUID() : selectedClient;
    const clientData: Client = selectedClient === 'new' 
      ? { id: clientId, ...clientForm } as Client
      : clients.find(c => c.id === selectedClient)!;

    if (selectedClient === 'new' && (!clientData.name || !clientData.nic)) {
      return alert("Please fill client details");
    }

    const newRental: Rental = {
      id: crypto.randomUUID(),
      clientId: clientId,
      carId: rentalForm.carId,
      clientName: clientData.name,
      carName: selectedCar!.name,
      startDate: rentalForm.startDate,
      endDate: endDate.toISOString(),
      days: rentalForm.days,
      discountPercent: rentalForm.discount,
      totalAmount: finalTotal,
      advance: rentalForm.advance,
      remainingBalance: remaining,
      status: 'Active'
    };

    onAddRental(newRental, clientData);
    
    // Reset
    setRentalForm({ carId: '', days: 1, discount: 0, startDate: new Date().toISOString().slice(0, 16), advance: 0 });
    setClientForm({ name: '', phone: '', nic: '' });
    setSelectedClient('new');
    setActiveTab('active');
  };

  const handleReturnConfirm = () => {
    if (returnModal.rental) {
      onReturnCar(returnModal.rental.id);
      setReturnModal({ isOpen: false, rental: null });
    }
  };

  const availableCars = cars.filter(c => c.status === 'Available');

  return (
    <div className="space-y-6">
      <div className="flex space-x-1 p-1 bg-white border border-slate-200 rounded-xl w-fit">
        <button 
          onClick={() => setActiveTab('new')}
          className={`px-6 py-2 text-sm font-bold rounded-lg transition-all ${
            activeTab === 'new' 
              ? 'bg-blue-600 text-white shadow-md' 
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          New Booking
        </button>
        <button 
          onClick={() => setActiveTab('active')}
          className={`px-6 py-2 text-sm font-bold rounded-lg transition-all ${
            activeTab === 'active' 
              ? 'bg-blue-600 text-white shadow-md' 
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          Active Rentals
        </button>
      </div>

      {activeTab === 'new' ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <div className="flex items-center gap-3 mb-8 border-b border-slate-100 pb-4">
            <div className="p-3 bg-blue-50 rounded-full text-blue-600">
               <Calendar size={24} />
            </div>
            <div>
               <h2 className="text-xl font-bold text-slate-900">Book a Vehicle</h2>
               <p className="text-sm text-slate-500">Create a new rental agreement</p>
            </div>
          </div>
          
          <form onSubmit={handleRentSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Left Column: Client & Car */}
            <div className="space-y-6">
              <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide mb-4 flex items-center gap-2">
                   <span className="w-2 h-2 rounded-full bg-blue-500"></span> Client Information
                </h3>
                
                <div className="mb-4">
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Customer Profile</label>
                  <select 
                    value={selectedClient} 
                    onChange={(e) => setSelectedClient(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 font-medium"
                  >
                    <option value="new">+ Create New Profile</option>
                    {clients.map(c => <option key={c.id} value={c.id}>{c.name} ({c.phone})</option>)}
                  </select>
                </div>

                {selectedClient === 'new' && (
                  <div className="space-y-4 animate-fade-in">
                    <input 
                      type="text" placeholder="Full Name" required 
                      className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 placeholder-slate-400"
                      value={clientForm.name} onChange={e => setClientForm({...clientForm, name: e.target.value})}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input 
                        type="text" placeholder="Phone Number" required 
                        className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 placeholder-slate-400"
                        value={clientForm.phone} onChange={e => setClientForm({...clientForm, phone: e.target.value})}
                      />
                      <input 
                        type="text" placeholder="NIC / ID" required 
                        className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 placeholder-slate-400"
                        value={clientForm.nic} onChange={e => setClientForm({...clientForm, nic: e.target.value})}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Select Vehicle</label>
                <select 
                  required
                  value={rentalForm.carId} 
                  onChange={(e) => setRentalForm({...rentalForm, carId: e.target.value})}
                  className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 font-medium shadow-sm"
                >
                  <option value="">-- Choose Available Car --</option>
                  {availableCars.map(car => (
                    <option key={car.id} value={car.id}>
                      {car.name} — {car.color} ({car.engineCC}) - ${car.rentPerDay}/day
                    </option>
                  ))}
                </select>
                {availableCars.length === 0 && <p className="text-red-500 text-sm mt-2 font-medium bg-red-50 p-2 rounded-lg">No cars available in fleet.</p>}
              </div>
            </div>

            {/* Right Column: Rental Terms & Financials */}
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-5">
                 <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Pickup Date/Time</label>
                    <input 
                      type="datetime-local" 
                      required
                      className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-900"
                      value={rentalForm.startDate}
                      onChange={e => setRentalForm({...rentalForm, startDate: e.target.value})}
                    />
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Duration (Days)</label>
                    <input 
                      type="number" min="1" required
                      className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-900"
                      value={rentalForm.days}
                      onChange={e => setRentalForm({...rentalForm, days: parseInt(e.target.value) || 0})}
                    />
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-5">
                 <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Discount (%)</label>
                    <input 
                      type="number" min="0" max="100"
                      className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-900"
                      value={rentalForm.discount}
                      onChange={e => setRentalForm({...rentalForm, discount: parseFloat(e.target.value) || 0})}
                    />
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Advance Paid ($)</label>
                    <input 
                      type="number" min="0"
                      className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-900"
                      value={rentalForm.advance}
                      onChange={e => setRentalForm({...rentalForm, advance: parseFloat(e.target.value) || 0})}
                    />
                 </div>
              </div>

              {/* Invoice Summary */}
              <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl shadow-slate-900/10 mt-2 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full blur-3xl opacity-20 -mr-10 -mt-10"></div>
                <h4 className="text-slate-400 text-xs uppercase tracking-widest font-bold mb-4 border-b border-slate-800 pb-2">Invoice Summary</h4>
                <div className="space-y-3 text-sm relative z-10">
                   <div className="flex justify-between">
                      <span className="text-slate-300">Base Rent ({rentalForm.days} days)</span>
                      <span className="font-mono">${totalRaw.toFixed(2)}</span>
                   </div>
                   <div className="flex justify-between text-emerald-400">
                      <span>Discount ({rentalForm.discount}%)</span>
                      <span className="font-mono">- ${discountAmount.toFixed(2)}</span>
                   </div>
                   <div className="border-t border-slate-800 my-2 pt-2 flex justify-between font-bold text-xl text-white">
                      <span>Total</span>
                      <span>${finalTotal.toFixed(2)}</span>
                   </div>
                   <div className="flex justify-between text-slate-400 pt-1">
                      <span>Advance</span>
                      <span className="font-mono">${rentalForm.advance.toFixed(2)}</span>
                   </div>
                   <div className="flex justify-between text-orange-400 font-bold text-lg border-t border-slate-800 pt-3 mt-1">
                      <span>Balance Due</span>
                      <span>${remaining.toFixed(2)}</span>
                   </div>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-800 text-xs text-slate-500 flex items-center gap-2">
                   <Clock size={14} /> Expected Return: {endDateStr}
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold shadow-lg shadow-blue-500/30 transition-all hover:scale-[1.01]"
              >
                Confirm Booking & Generate Invoice
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs uppercase font-bold text-slate-500 border-b border-slate-200 tracking-wider">
                <tr>
                  <th className="px-6 py-5">Client</th>
                  <th className="px-6 py-5">Vehicle</th>
                  <th className="px-6 py-5">Duration</th>
                  <th className="px-6 py-5">Financials</th>
                  <th className="px-6 py-5">Status</th>
                  <th className="px-6 py-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rentals.filter(r => r.status === 'Active').length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-400 italic">No active rentals found.</td>
                  </tr>
                ) : (
                  rentals.filter(r => r.status === 'Active').map(rental => (
                    <tr key={rental.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-6 py-5 font-bold text-slate-800">{rental.clientName}</td>
                      <td className="px-6 py-5 font-medium text-blue-600">{rental.carName}</td>
                      <td className="px-6 py-5">
                        <div className="text-xs font-semibold text-slate-500 uppercase mb-1">From</div>
                        <div className="text-slate-700">{new Date(rental.startDate).toLocaleDateString()}</div>
                      </td>
                      <td className="px-6 py-5">
                         <div className="font-bold text-slate-800">${rental.totalAmount}</div>
                         <div className="text-xs font-bold text-orange-500">Bal: ${rental.remainingBalance}</div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200">
                          Active
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <button 
                          onClick={() => setReturnModal({ isOpen: true, rental })}
                          className="text-blue-600 hover:text-white hover:bg-blue-600 font-medium text-xs border border-blue-200 px-4 py-2 rounded-lg transition-all"
                        >
                          Return Vehicle
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Return & Payment Modal */}
      {returnModal.isOpen && returnModal.rental && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-fade-in relative border border-slate-100">
            <button 
              onClick={() => setReturnModal({ isOpen: false, rental: null })}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X size={20} />
            </button>

            <div className="mb-6">
               <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4 mx-auto">
                 <CheckCircle size={24} />
               </div>
               <h3 className="text-2xl font-bold text-slate-900 text-center">Complete Rental</h3>
               <p className="text-slate-500 text-center text-sm mt-1">Confirm return and settle final payment.</p>
            </div>

            <div className="bg-slate-50 rounded-xl p-6 border border-slate-100 space-y-4 mb-8">
              <div className="flex justify-between items-center text-sm">
                 <span className="text-slate-500 font-medium">Customer</span>
                 <span className="font-bold text-slate-800">{returnModal.rental.clientName}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                 <span className="text-slate-500 font-medium">Vehicle</span>
                 <span className="font-bold text-slate-800">{returnModal.rental.carName}</span>
              </div>
              <div className="h-px bg-slate-200 my-2"></div>
              <div className="flex justify-between items-center">
                 <span className="text-slate-600 font-medium">Total Amount</span>
                 <span className="font-bold text-slate-800">${returnModal.rental.totalAmount}</span>
              </div>
              <div className="flex justify-between items-center">
                 <span className="text-emerald-600 font-medium flex items-center gap-1"><CreditCard size={14}/> Paid (Advance)</span>
                 <span className="font-bold text-emerald-600">-${returnModal.rental.advance}</span>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-slate-200 mt-2">
                 <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Remaining Balance</span>
                 <div className="flex items-center gap-2 text-3xl font-bold text-orange-600">
                    <Banknote size={28} />
                    ${returnModal.rental.remainingBalance}
                 </div>
                 <p className="text-xs text-orange-600/80 mt-1 font-medium">Collect this amount from customer.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => setReturnModal({ isOpen: false, rental: null })}
                className="flex-1 px-4 py-3 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 font-bold transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleReturnConfirm}
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-bold shadow-lg shadow-blue-500/30 transition-all"
              >
                Confirm Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};