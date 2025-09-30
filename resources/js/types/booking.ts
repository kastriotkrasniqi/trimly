import { User } from ".";

export interface Barber {
  id: string;
  user: User;
  phone: string;
  avatar?: string;
  services?: Service[];
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


export interface Client {
    id: string;
    user_id: string;
    phone?: string;
    created_at?: string;
    updated_at?: string;
}
