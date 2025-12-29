import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { CarManager } from './components/CarManager';
import { ClientManager } from './components/ClientManager';
import { RevenueView } from './components/RevenueView';
import { MaintenanceView } from './components/MaintenanceView';
import { DataService } from './services/dataService';
import { Car, Client, Rental, MaintenanceRecord } from './types';
import { Bell, Search } from 'lucide-react';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  
  // App State
  const [cars, setCars] = useState<Car[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [maintenance, setMaintenance] = useState<MaintenanceRecord[]>([]);

  // Load Data on Mount
  useEffect(() => {
    setCars(DataService.getCars());
    setClients(DataService.getClients());
    setRentals(DataService.getRentals());
    setMaintenance(DataService.getMaintenance());
  }, []);

  // -- Handlers --

  const handleAddCar = (car: Car) => {
    const updated = [...cars, car];
    setCars(updated);
    DataService.saveCars(updated);
  };

  const handleDeleteCar = (id: string) => {
    const updated = cars.filter(c => c.id !== id);
    setCars(updated);
    DataService.saveCars(updated);
  };

  const handleAddRental = (rental: Rental, client: Client) => {
    // 1. Save Rental
    const updatedRentals = [...rentals, rental];
    setRentals(updatedRentals);
    DataService.saveRentals(updatedRentals);

    // 2. Update/Save Client if new
    let updatedClients = clients;
    if (!clients.find(c => c.id === client.id)) {
      updatedClients = [...clients, client];
      setClients(updatedClients);
      DataService.saveClients(updatedClients);
    }

    // 3. Update Car Status to Rented (Ride count is incremented upon completion)
    const updatedCars = cars.map(c => {
      if (c.id === rental.carId) {
        return { ...c, status: 'Rented' as const };
      }
      return c;
    });
    setCars(updatedCars);
    DataService.saveCars(updatedCars);
  };

  const handleReturnCar = (rentalId: string) => {
    const rental = rentals.find(r => r.id === rentalId);
    if (!rental) return;

    // 1. Mark Rental as Completed
    const updatedRentals = rentals.map(r => 
      r.id === rentalId ? { ...r, status: 'Completed' as const, remainingBalance: 0, returnDate: new Date().toISOString() } : r
    );
    setRentals(updatedRentals);
    DataService.saveRentals(updatedRentals);

    // 2. Mark Car as Available AND Increment Rides count here
    const updatedCars = cars.map(c => 
      c.id === rental.carId ? { ...c, status: 'Available' as const, totalRides: c.totalRides + 1 } : c
    );
    setCars(updatedCars);
    DataService.saveCars(updatedCars);
  };

  const handleAddMaintenance = (record: MaintenanceRecord) => {
    const updated = [...maintenance, record];
    setMaintenance(updated);
    DataService.saveMaintenance(updated);
  };

  const renderContent = () => {
    switch(currentView) {
      case 'dashboard':
        return <Dashboard cars={cars} rentals={rentals} />;
      case 'cars':
        return <CarManager cars={cars} onAddCar={handleAddCar} onDeleteCar={handleDeleteCar} />;
      case 'clients':
        return <ClientManager cars={cars} clients={clients} rentals={rentals} onAddRental={handleAddRental} onReturnCar={handleReturnCar} />;
      case 'revenue':
        return <RevenueView rentals={rentals} />;
      case 'maintenance':
        return <MaintenanceView cars={cars} records={maintenance} onAddRecord={handleAddMaintenance} />;
      default:
        return <Dashboard cars={cars} rentals={rentals} />;
    }
  };

  return (
    <div className="flex bg-slate-100 min-h-screen font-sans text-slate-800 selection:bg-blue-200 selection:text-blue-900">
      <Sidebar currentView={currentView} onChangeView={setCurrentView} />
      
      <main className="flex-1 ml-64 p-8 lg:p-12 transition-all">
        <header className="mb-10 flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-0 z-40 py-4 px-6 rounded-2xl border border-white/50 shadow-sm">
          <div>
            <h2 className="text-xl font-bold capitalize text-slate-800">{currentView === 'clients' ? 'Rental Operations' : currentView === 'cars' ? 'Fleet Inventory' : currentView}</h2>
            <p className="text-slate-500 text-xs font-medium uppercase tracking-wide mt-1">System Operational</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input type="text" placeholder="Search system..." className="pl-9 pr-4 py-2 bg-slate-100 border-none rounded-full text-sm focus:ring-2 focus:ring-blue-500 outline-none w-64" />
            </div>
            <button className="relative text-slate-500 hover:text-blue-600 transition-colors">
              <Bell size={20} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
               <div className="text-right hidden sm:block">
                 <p className="text-sm font-bold text-slate-800">Admin User</p>
                 <p className="text-xs text-slate-500">Fleet Manager</p>
               </div>
               <div className="h-10 w-10 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl flex items-center justify-center text-white font-bold shadow-lg ring-4 ring-slate-100">
                 A
               </div>
            </div>
          </div>
        </header>

        {renderContent()}
      </main>
    </div>
  );
}

export default App;