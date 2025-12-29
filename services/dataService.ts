import { Car, Client, Rental, MaintenanceRecord } from '../types';

const KEYS = {
  CARS: 'driveflow_cars',
  CLIENTS: 'driveflow_clients',
  RENTALS: 'driveflow_rentals',
  MAINTENANCE: 'driveflow_maintenance',
};

// --- Helpers ---

const get = <T>(key: string, defaultVal: T): T => {
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : defaultVal;
};

const set = <T>(key: string, val: T): void => {
  localStorage.setItem(key, JSON.stringify(val));
};

// --- Initial Dummy Data ---
const seedData = () => {
  if (!localStorage.getItem(KEYS.CARS)) {
    const cars: Car[] = [
      { id: '1', name: 'Toyota Corolla', engineCC: '1800cc', seatingCapacity: 5, color: 'White', rentPerDay: 50, totalRides: 12, status: 'Available' },
      { id: '2', name: 'Honda Civic', engineCC: '1500cc', seatingCapacity: 5, color: 'Black', rentPerDay: 65, totalRides: 8, status: 'Available' },
      { id: '3', name: 'Suzuki Alto', engineCC: '660cc', seatingCapacity: 4, color: 'Silver', rentPerDay: 30, totalRides: 25, status: 'Rented' },
      { id: '4', name: 'Kia Sportage', engineCC: '2000cc', seatingCapacity: 5, color: 'White', rentPerDay: 90, totalRides: 5, status: 'Available' },
    ];
    set(KEYS.CARS, cars);
  }
  if (!localStorage.getItem(KEYS.CLIENTS)) {
    set(KEYS.CLIENTS, [
      { id: 'c1', name: 'John Doe', phone: '555-0101', nic: '12345-6789012-3' },
    ]);
  }
};

seedData();

// --- API ---

export const DataService = {
  getCars: (): Car[] => get<Car[]>(KEYS.CARS, []),
  saveCars: (cars: Car[]) => set(KEYS.CARS, cars),
  
  getClients: (): Client[] => get<Client[]>(KEYS.CLIENTS, []),
  saveClients: (clients: Client[]) => set(KEYS.CLIENTS, clients),

  getRentals: (): Rental[] => get<Rental[]>(KEYS.RENTALS, []),
  saveRentals: (rentals: Rental[]) => set(KEYS.RENTALS, rentals),

  getMaintenance: (): MaintenanceRecord[] => get<MaintenanceRecord[]>(KEYS.MAINTENANCE, []),
  saveMaintenance: (records: MaintenanceRecord[]) => set(KEYS.MAINTENANCE, records),

  // Business Logic Helpers
  getAvailableCars: (): Car[] => {
    const cars = get<Car[]>(KEYS.CARS, []);
    return cars.filter(c => c.status === 'Available');
  },

  calculateRevenue: (monthStr: string): number => {
    // monthStr format YYYY-MM
    const rentals = get<Rental[]>(KEYS.RENTALS, []);
    return rentals
      .filter(r => r.startDate.startsWith(monthStr) || (r.returnDate && r.returnDate.startsWith(monthStr)))
      .reduce((sum, r) => sum + r.totalAmount, 0);
  }
};