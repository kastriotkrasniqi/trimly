import React, { useState } from 'react';
import { Scissors } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import BookingApp from '@/pages/mobile-appointment';

const services = [
  { name: 'Haircut', description: 'Classic, modern, and trendy styles.' },
  { name: 'Beard Trim', description: 'Expert shaping and grooming.' },
  { name: 'Shave', description: 'Hot towel and straight razor.' },
  { name: 'Facial', description: 'Relaxing skin treatments.' },
];



export default function HomePage({ employees }: { employees: any[] }) {
  const [navOpen, setNavOpen] = useState(false);
  const [showBooking, setShowBooking] = useState(false);

  return (
    <div className="h-screen bg-[url('img/homepage_banner.jpeg')] from-gray-100 to-gray-300 flex flex-col relative">
      {/* Header */}
      <header className="bg-transparent shadow-md py-6 px-4 flex items-center justify-between">
        {/* Logo on the left */}
        <div className="flex items-center gap-3">
            <img src="/img/logo.svg" alt="Trimly Logo" className="h-12 w-12" />
            <h1 className="text-xl font-bold text-primary">Trimly Cutz</h1>
        </div>
        {/* Three bars (hamburger) on the right */}
        <button
          className="md:hidden flex flex-col justify-center items-center w-10 h-10  focus:outline-none"
          aria-label="Open navigation menu"
          onClick={() => setNavOpen(!navOpen)}
        >
          <span className="block w-6 h-0.5 bg-white mb-1"></span>
          <span className="block w-6 h-0.5 bg-white mb-1"></span>
          <span className="block w-6 h-0.5 bg-white"></span>
        </button>
        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-6 text-gray-600">
          <a href="#services" className="hover:text-gray-900">Services</a>
          <a href="#about" className="hover:text-gray-900">About</a>
          <a href="#contact" className="hover:text-gray-900">Contact</a>
          <a href="/login" className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 transition">Book Now</a>
        </nav>
      </header>
      {/* Mobile Nav */}
      {navOpen && (
        <nav className="md:hidden flex flex-col gap-4 bg-white shadow px-4 py-6">
          <a href="#services" className="hover:text-gray-900">Services</a>
          <a href="#about" className="hover:text-gray-900">About</a>
          <a href="#contact" className="hover:text-gray-900">Contact</a>
          <a href="/login" className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 transition">Book Now</a>
        </nav>
      )}
      {/* Scissors Button */}
      {!showBooking && (
        <div className="h-28 w-28 rounded-ss-4xl bg-primary absolute bottom-[-10px] right-[-10px] flex items-center justify-center shadow-lg shadow-gray-700/40 hover:shadow-xl active:translate-y-[2px] active:shadow-md bg-gradient-to-br from-primary to-primary/80 transition-all z-20"
          onClick={() => setShowBooking(true)}
          style={{ cursor: 'pointer' }}
        >
          <Scissors className="text-white" size={48} />
        </div>
      )}
      {/* Animated Mobile Appointment View */}
      <AnimatePresence>
        {showBooking && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 300, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="absolute top-[90px] left-0 w-full z-10"
          >
            <BookingApp employees={employees} onClose={() => setShowBooking(false)} />
          </motion.div>
        )}
      </AnimatePresence>


    </div>
  );
}
