export interface Barber {
  id: string;
  name: string;
  image: string;
  rating: number;
  specialties: string[];
  bio: string;
}

export interface Service {
  id: string;
  name: string;
  duration: number; // in minutes
  price: number;
  description: string;
}

export interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

export interface BookingData {
  selectedBarber?: Barber;
  selectedServices: Service[];
  selectedTimeSlot?: TimeSlot;
  selectedDate?: Date;
}

export type BookingStep = 1 | 2 | 3;
