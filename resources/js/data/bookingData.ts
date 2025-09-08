import { Barber, Service, TimeSlot } from "@/types/booking";

export const barbers: Barber[] = [
//   {
//     id: "1",
//     name: "Alex Johnson",
//     image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
//     rating: 4.8,
//     specialties: ["Classic Cuts", "Beard Styling", "Hair Washing"],
//     bio: "Master barber with 8 years of experience specializing in classic and modern cuts."
//   },
  {
    id: "2",
    name: "Maria Rodriguez",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b194?w=150&h=150&fit=crop&crop=face",
    rating: 4.9,
    specialties: ["Color Treatment", "Styling", "Hair Treatment"],
    bio: "Expert colorist and stylist with a passion for creating unique looks."
  },
  {
    id: "3",
    name: "David Kim",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    rating: 4.7,
    specialties: ["Fade Cuts", "Beard Trim", "Modern Styling"],
    bio: "Trendy barber known for precision fades and contemporary styling."
  }
];

export const services: Service[] = [
  {
    id: "1",
    name: "Classic Haircut",
    duration: 30,
    price: 35,
    description: "Traditional scissor cut with styling"
  },
  {
    id: "2",
    name: "Fade Cut",
    duration: 45,
    price: 45,
    description: "Modern fade with precise blending"
  },
  {
    id: "3",
    name: "Beard Trim & Style",
    duration: 20,
    price: 25,
    description: "Professional beard trimming and styling"
  },
  {
    id: "4",
    name: "Hair Wash & Condition",
    duration: 15,
    price: 15,
    description: "Deep cleansing shampoo and conditioning treatment"
  },
  {
    id: "5",
    name: "Color Treatment",
    duration: 90,
    price: 85,
    description: "Professional hair coloring service"
  },
  {
    id: "6",
    name: "Styling & Blowout",
    duration: 30,
    price: 40,
    description: "Professional styling and blowout"
  }
];

export const generateTimeSlots = (date: Date): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const startHour = 9;
  const endHour = 18;

  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      slots.push({
        id: `${hour}-${minute}`,
        time,
        available: Math.random() > 0.3 // 70% chance of being available
      });
    }
  }

  return slots;
};
