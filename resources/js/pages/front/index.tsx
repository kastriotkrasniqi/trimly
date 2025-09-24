import React, { useState, useCallback } from 'react';
import { Scissors } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import BookingApp from '@/pages/mobile-appointment';
import { Barber } from '@/types/booking';

interface HomePageProps {
  employees: Barber[];
}

export default function HomePage({ employees }: HomePageProps) {
  const [navOpen, setNavOpen] = useState(false);
  const [showBooking, setShowBooking] = useState(false);

  const handleToggleNav = useCallback(() => {
    setNavOpen(prev => !prev);
  }, []);

  const handleOpenBooking = useCallback(() => {
    setShowBooking(true);
    setNavOpen(false); // Close nav when opening booking
  }, []);

  const handleCloseBooking = useCallback(() => {
    setShowBooking(false);
  }, []);

  return (
    <div className="h-screen bg-[url('img/homepage_banner.jpeg')] bg-cover bg-center bg-no-repeat flex flex-col relative overflow-hidden">
      {/* Header */}
      <header className="bg-transparent backdrop-blur-sm shadow-md py-4 sm:py-6 px-4 flex items-center justify-between relative z-30">
        {/* Logo on the left */}
        <div className="flex items-center gap-2 sm:gap-3">
          <img src="/img/logo.svg" alt="Trimly Logo" className="h-10 w-10 sm:h-12 sm:w-12" />
          <h1 className="text-lg sm:text-xl font-bold text-primary">Trimly Cutz</h1>
        </div>

        {/* Three bars (hamburger) on the right */}
        <button
          className="md:hidden flex flex-col justify-center items-center w-10 h-10 focus:outline-none focus:ring-2 focus:ring-primary/50 rounded"
          aria-label="Open navigation menu"
          aria-expanded={navOpen}
          onClick={handleToggleNav}
        >
          <span className="block w-6 h-0.5 bg-white mb-1 transition-transform"></span>
          <span className="block w-6 h-0.5 bg-white mb-1 transition-transform"></span>
          <span className="block w-6 h-0.5 bg-white transition-transform"></span>
        </button>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-6 text-white/80">
          <a href="#services" className="hover:text-white transition-colors">Services</a>
          <a href="#about" className="hover:text-white transition-colors">About</a>
          <a href="#contact" className="hover:text-white transition-colors">Contact</a>
          <a href="/login" className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 transition-colors">
            Book Now
          </a>
        </nav>
      </header>

      {/* Mobile Nav */}
      <AnimatePresence>
        {navOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="md:hidden flex flex-col gap-4 bg-white/95 backdrop-blur-sm shadow-lg px-4 py-6 relative z-20"
          >
            <a href="#services" className="hover:text-primary transition-colors">Services</a>
            <a href="#about" className="hover:text-primary transition-colors">About</a>
            <a href="#contact" className="hover:text-primary transition-colors">Contact</a>
            <button
              onClick={handleOpenBooking}
              className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 transition-colors text-left"
            >
              Book Now
            </button>
          </motion.nav>
        )}
      </AnimatePresence>
      {/* Scissors Button */}
      <AnimatePresence>
        {!showBooking && (
          <motion.button
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="h-24 w-24 sm:h-28 sm:w-28 rounded-ss-4xl bg-primary absolute bottom-2 right-2 sm:bottom-[-10px] sm:right-[-10px] flex items-center justify-center shadow-lg shadow-gray-700/40 hover:shadow-xl active:translate-y-[2px] active:shadow-md bg-gradient-to-br from-primary to-primary/80 transition-all z-20 focus:outline-none focus:ring-2 focus:ring-primary/50"
            onClick={handleOpenBooking}
            aria-label="Book appointment"
          >
            <Scissors className="text-white" size={36} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Animated Mobile Appointment View */}
      <AnimatePresence mode="wait">
        {showBooking && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'tween', duration: 0.35, ease: 'easeInOut' }}
            className="absolute inset-0 top-16 sm:top-20 z-40 bg-background/95 backdrop-blur-sm"
          >
            <div className="h-full w-full max-w-md mx-auto">
              <BookingApp employees={employees} onClose={handleCloseBooking} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
