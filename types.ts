export interface Car {
  id: string;
  name: string;
  engineCC: string;
  seatingCapacity: number;
  color: string;
  rentPerDay: number;
  totalRides: number;
  status: 'Available' | 'Rented' | 'Maintenance';
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  nic: string;
}

export interface Rental {
  id: string;
  clientId: string;
  carId: string;
  clientName: string; // Denormalized for easier display
  carName: string;    // Denormalized
  startDate: string;
  endDate: string;
  days: number;
  discountPercent: number;
  totalAmount: number;
  advance: number;
  remainingBalance: number;
  status: 'Active' | 'Completed';
  returnDate?: string;
}

export interface MaintenanceRecord {
  id: string;
  carId: string;
  carName: string;
  date: string;
  type: 'Oil Change' | 'Tuning' | 'Air Filter' | 'AC Filter' | 'Other';
  notes: string;
  cost: number;
}

export interface MonthlyRevenue {
  month: string; // Format YYYY-MM
  amount: number;
}