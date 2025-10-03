import React from 'react';
import { Scissors, Award, Sparkles, Users } from 'lucide-react';

export interface Service {
  name: string;
  description: string;
  price: string;
  icon: React.ReactNode;
}

export const services: Service[] = [
  {
    name: 'Premium Haircut',
    description: 'Expert styling and cutting for the modern gentleman',
    price: 'From $45',
    icon: <Scissors className="w-8 h-8" />
  },
  {
    name: 'Beard Trim',
    description: 'Precise trimming and shaping for the perfect beard',
    price: 'From $25',
    icon: <Award className="w-8 h-8" />
  },
  {
    name: 'Classic Shave',
    description: 'Traditional hot towel shave for the ultimate experience',
    price: 'From $35',
    icon: <Sparkles className="w-8 h-8" />
  },
  {
    name: 'Hair Styling',
    description: 'Professional styling for special occasions',
    price: 'From $30',
    icon: <Users className="w-8 h-8" />
  }
];
