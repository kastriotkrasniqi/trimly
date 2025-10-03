export interface Testimonial {
  name: string;
  rating: number;
  comment: string;
  date: string;
}

export const testimonials: Testimonial[] = [
  {
    name: 'Marcus Johnson',
    rating: 5,
    comment: 'Best barbershop experience I\'ve ever had. The attention to detail is incredible and the atmosphere is exactly what you want in a quality barbershop.',
    date: '2 weeks ago'
  },
  {
    name: 'David Rodriguez',
    rating: 5,
    comment: 'Professional service, skilled barbers, and a great atmosphere. Been coming here for over a year and never disappointed.',
    date: '1 month ago'
  },
  {
    name: 'James Wilson',
    rating: 5,
    comment: 'Trimly Cutz has become my go-to spot. The barbers really know their craft and the place has a great vibe.',
    date: '3 weeks ago'
  },
  {
    name: 'Michael Chen',
    rating: 5,
    comment: 'Outstanding service every time. The staff is friendly and professional. Highly recommend!',
    date: '1 week ago'
  },
  {
    name: 'Robert Taylor',
    rating: 5,
    comment: 'Clean facility, skilled barbers, and great customer service. Worth every penny.',
    date: '2 days ago'
  },
  {
    name: 'Alex Martinez',
    rating: 5,
    comment: 'The best haircut I\'ve had in years. The attention to detail is amazing.',
    date: '5 days ago'
  }
];

export const firstRow = testimonials.slice(0, Math.ceil(testimonials.length / 2));
export const secondRow = testimonials.slice(Math.ceil(testimonials.length / 2));
