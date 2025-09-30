import React, { useState, useCallback } from 'react';
import { Scissors, Menu, X, Star, MapPin, Phone, MessageCircle, Clock, Users, Award, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Marquee } from '@/components/ui/marquee';
import { cn } from '@/lib/utils';
import BookingApp from '@/pages/mobile-appointment';
import { Barber } from '@/types/booking';
import { Head } from '@inertiajs/react';

interface HomePageProps {
  employees: Barber[];
}

interface Service {
  name: string;
  description: string;
  price: string;
  icon: React.ReactNode;
}

interface Testimonial {
  name: string;
  rating: number;
  comment: string;
  date: string;
}

const services: Service[] = [
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

const testimonials: Testimonial[] = [
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

const firstRow = testimonials.slice(0, Math.ceil(testimonials.length / 2));
const secondRow = testimonials.slice(Math.ceil(testimonials.length / 2));

const TestimonialCard = ({
  name,
  comment,
  rating,
  date,
}: {
  name: string;
  comment: string;
  rating: number;
  date: string;
}) => {
  // Generate avatar initials
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <figure
      className={cn(
        "relative h-full w-80 cursor-pointer overflow-hidden rounded-xl border p-6",
        // light styles
        "border-gray-200 bg-white hover:bg-gray-50",
        // dark styles
        "dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
      )}
    >
      <div className="flex flex-row items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-semibold text-sm">
          {initials}
        </div>
        <div className="flex flex-col">
          <figcaption className="text-sm font-semibold text-gray-900 dark:text-white">
            {name}
          </figcaption>
          <div className="flex items-center gap-1 mt-1">
            {[...Array(rating)].map((_, i) => (
              <Star key={i} className="w-3 h-3 text-primary fill-current" />
            ))}
            <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">{date}</span>
          </div>
        </div>
      </div>
      <blockquote className="mt-4 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
        "{comment}"
      </blockquote>
    </figure>
  );
};

export default function HomePage({ employees }: HomePageProps) {
  const [navOpen, setNavOpen] = useState(false);
  const [showBooking, setShowBooking] = useState(false);

  const handleToggleNav = useCallback(() => {
    setNavOpen(prev => !prev);
  }, []);

  const handleOpenBooking = useCallback(() => {
    setShowBooking(true);
    setNavOpen(false);
  }, []);

  const handleCloseBooking = useCallback(() => {
    setShowBooking(false);
  }, []);

  return (
    <>
      <Head>
        <title>Trimly Cutz - Premium Barbershop | Where Style Meets Precision</title>
        <meta name="description" content="Experience the finest in men's grooming at Trimly Cutz. Professional haircuts, beard trims, classic shaves, and styling services. Book your appointment today!" />
        <meta name="keywords" content="barbershop, haircut, beard trim, shave, men's grooming, styling, barbershop near me, professional barbers" />
        <meta property="og:title" content="Trimly Cutz - Premium Barbershop" />
        <meta property="og:description" content="Where Style Meets Precision - Professional men's grooming services" />
        <meta property="og:image" content="/img/hero-bg.jpg" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="canonical" href="/" />
      </Head>
      <div className="min-h-screen bg-gray-900 text-white font-sans">
      {/* Header */}
      <header className="fixed top-0 w-full bg-gray-900/95 backdrop-blur-sm shadow-lg py-4 px-4 md:px-8 flex items-center justify-between z-50">
        <motion.div
          className="flex items-center gap-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <img src="/img/logo.svg" alt="Trimly Logo" className="h-10 w-10" />
          <h1 className="text-xl font-bold text-primary font-serif">Trimly Cutz</h1>
        </motion.div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-8 text-white/90">
          <a href="#services" className="hover:text-primary transition-colors duration-300">Services</a>
          <a href="#team" className="hover:text-primary transition-colors duration-300">Our Team</a>
          <a href="#testimonials" className="hover:text-primary transition-colors duration-300">Reviews</a>
          <a href="#contact" className="hover:text-primary transition-colors duration-300">Contact</a>
          <button
            onClick={handleOpenBooking}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-all duration-300 font-semibold"
          >
            Book Now
          </button>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white p-2"
          onClick={handleToggleNav}
          aria-label="Toggle navigation"
        >
          {navOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {navOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-16 left-0 right-0 bg-gray-800/95 backdrop-blur-sm p-6 z-40 md:hidden"
          >
            <div className="flex flex-col gap-4">
              <a href="#services" className="hover:text-primary transition-colors" onClick={() => setNavOpen(false)}>Services</a>
              <a href="#team" className="hover:text-primary transition-colors" onClick={() => setNavOpen(false)}>Our Team</a>
              <a href="#testimonials" className="hover:text-primary transition-colors" onClick={() => setNavOpen(false)}>Reviews</a>
              <a href="#contact" className="hover:text-primary transition-colors" onClick={() => setNavOpen(false)}>Contact</a>
              <button
                onClick={handleOpenBooking}
                className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-all duration-300 font-semibold text-left"
              >
                Book Now
              </button>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/img/hero-bg.jpg')" }}
        >
          <div className="absolute inset-0 bg-gray-900/70"></div>
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <motion.h2
            className="text-5xl md:text-7xl font-bold mb-6 font-serif"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="text-white">Where Style</span>
            <br />
            <span className="text-primary">Meets Precision</span>
          </motion.h2>

          <motion.p
            className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Experience the art of traditional barbering with modern sophistication
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <button
              onClick={handleOpenBooking}
              className="bg-primary text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary/90 transition-all duration-300 transform hover:scale-105"
            >
              Book Your Appointment
            </button>
            <a
              href="#services"
              className="border-2 border-primary text-primary px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary hover:text-white transition-all duration-300"
            >
              View Services
            </a>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-gray-800">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="text-4xl md:text-5xl font-bold mb-4 font-serif">Our Services</h3>
            <p className="text-xl text-gray-400">Premium grooming services for the modern gentleman</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.name}
                className="bg-gray-900 p-8 rounded-xl text-center hover:bg-gray-700 transition-all duration-300 transform hover:scale-105"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-primary mb-4 flex justify-center">
                  {service.icon}
                </div>
                <h4 className="text-xl font-semibold mb-3 text-white">{service.name}</h4>
                <p className="text-gray-400 mb-4">{service.description}</p>
                <p className="text-primary font-semibold text-lg">{service.price}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-20 bg-gray-900">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="text-4xl md:text-5xl font-bold mb-4 font-serif">Meet Our Masters</h3>
            <p className="text-xl text-gray-400">Skilled artisans dedicated to your perfect look</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {employees.map((employee, index) => (
              <motion.div
                key={employee.id}
                className="bg-gray-800 rounded-xl overflow-hidden hover:bg-gray-700 transition-all duration-300 transform hover:scale-105"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="aspect-square bg-gradient-to-br from-gray-700 to-gray-600 flex items-center justify-center overflow-hidden">
                  {employee.avatar ? (
                    <img
                      src={employee.avatar}
                      alt={employee.user?.name || 'Barber'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-primary flex items-center justify-center">
                      <div className="text-white text-4xl font-bold">
                        {employee.user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'MB'}
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h4 className="text-xl font-semibold mb-2 text-white">{employee.user?.name || 'Master Barber'}</h4>
                  <p className="text-primary mb-3">
                    {employee.services && employee.services.length > 0
                      ? employee.services.slice(0, 2).map(s => s.name).join(', ')
                      : 'Hair & Beard Specialist'
                    }
                  </p>
                  <p className="text-gray-400 text-sm">Specializing in precision cuts and classic styling techniques</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="text-4xl md:text-5xl font-bold mb-4 font-serif text-white">What Our Clients Say</h3>
            <p className="text-xl text-gray-400">Real reviews from satisfied customers</p>
          </motion.div>

          <div className="relative flex w-full flex-col items-center justify-center overflow-hidden rounded-lg">
            <Marquee pauseOnHover repeat={2} className="[--duration:25s] [--gap:1rem]">
              {firstRow.map((review, index) => (
                <TestimonialCard key={`first-${index}`} {...review} />
              ))}
            </Marquee>
            <Marquee reverse pauseOnHover repeat={2} className="[--duration:25s] [--gap:1rem]">
              {secondRow.map((review, index) => (
                <TestimonialCard key={`second-${index}`} {...review} />
              ))}
            </Marquee>
            <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-gray-800 to-transparent z-10"></div>
            <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-gray-800 to-transparent z-10"></div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-900">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="text-4xl md:text-5xl font-bold mb-4 font-serif">Visit Us Today</h3>
            <p className="text-xl text-gray-400">We're here to make you look and feel your best</p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="flex items-start gap-4">
                <MapPin className="w-6 h-6 text-primary mt-1" />
                <div>
                  <h4 className="text-lg font-semibold mb-2 text-white">Location</h4>
                  <p className="text-gray-400">123 Main Street<br />Downtown District<br />City, State 12345</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Clock className="w-6 h-6 text-primary mt-1" />
                <div>
                  <h4 className="text-lg font-semibold mb-2 text-white">Hours</h4>
                  <div className="text-gray-400 space-y-1">
                    <p>Monday - Friday: 9AM - 8PM</p>
                    <p>Saturday: 8AM - 6PM</p>
                    <p>Sunday: 10AM - 4PM</p>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Phone className="w-6 h-6 text-primary mt-1" />
                <div>
                  <h4 className="text-lg font-semibold mb-2 text-white">Phone</h4>
                  <p className="text-gray-400">(555) 123-4567</p>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleOpenBooking}
                  className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-all duration-300 flex items-center gap-2"
                >
                  <Scissors size={20} />
                  Book Appointment
                </button>
                <a
                  href="https://wa.me/15551234567?text=Hi%2C%20I%27d%20like%20to%20book%20an%20appointment%20at%20Trimly%20Cutz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-2 border-primary text-primary px-6 py-3 rounded-lg font-semibold hover:bg-primary hover:text-white transition-all duration-300 flex items-center gap-2"
                >
                  <MessageCircle size={20} />
                  WhatsApp
                </a>
              </div>
            </motion.div>

            {/* Map */}
            <motion.div
              className="bg-gray-800 rounded-xl overflow-hidden"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.5273936843933!2d-74.00884368459394!3d40.71278997933033!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a316e30235d%3A0xe7eaac2badc652a7!2s123%20Main%20St%2C%20New%20York%2C%20NY%2010038%2C%20USA!5e0!3m2!1sen!2sus!4v1703875200000!5m2!1sen!2sus"
                width="100%"
                height="320"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-80"
                title="Trimly Cutz Location - 123 Main Street"
              ></iframe>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 text-center py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img src="/img/logo.svg" alt="Trimly Logo" className="h-8 w-8" />
            <span className="text-xl font-bold text-primary font-serif">Trimly Cutz</span>
          </div>
          <p className="text-gray-400">© 2025 Trimly Cutz. All rights reserved.</p>
        </div>
      </footer>

      {/* Floating Book Button for Mobile */}
      <AnimatePresence>
        {!showBooking && (
          <motion.button
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="fixed bottom-4 right-4 w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 z-30 lg:hidden hover:bg-primary/90"
            onClick={handleOpenBooking}
            aria-label="Book appointment"
          >
            <Scissors className="text-gray-900" size={24} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Booking Modal */}
      <AnimatePresence mode="wait">
        {showBooking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end md:items-center justify-center md:p-4"
            onClick={handleCloseBooking}
          >
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "tween", duration: 0.3 }}
              className="bg-white w-full max-h-[90vh] rounded-t-3xl md:rounded-2xl md:max-w-md md:w-full md:max-h-[90vh] md:h-auto overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="h-full">
                <BookingApp employees={employees} onClose={handleCloseBooking} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </>
  );
}
