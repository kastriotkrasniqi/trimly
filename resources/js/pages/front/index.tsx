import React, { useState, useCallback, useEffect } from 'react';
import { Scissors, Menu, X, Star, MapPin, Phone, MessageCircle, Clock, Users, Award, Sparkles, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ScrollVelocityContainer,
  ScrollVelocityRow,
} from '@/components/ui/scroll-based-velocity';
import { cn } from '@/lib/utils';
import BookingApp from '@/pages/mobile-appointment';
import { Barber } from '@/types/booking';
import { Head } from '@inertiajs/react';
import { BorderBeam } from '@/components/ui/border-beam';
import { AnimatedThemeToggler } from '@/components/ui/animated-theme-toggler';
import { LineShadowText } from '@/components/ui/line-shadow-text';
import TeamSection from '@/components/TeamSection';
import { services ,type Service} from '@/data/services';
import { testimonials,firstRow,secondRow, type Testimonial } from '@/data/testimonials';

interface HomePageProps {
  employees: Barber[];
}

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
                "relative w-80 cursor-pointer rounded-xl border p-6 flex flex-col",
                // light styles
                "border-gray-200 bg-white hover:bg-gray-50",
                // dark styles
                "dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
            )}
            style={{ height: 'auto', minHeight: '200px' }}
        >
            <div className="flex flex-row items-center gap-3 mb-4 flex-shrink-0 w-full">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                    {initials}
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                    <figcaption className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                        {name}
                    </figcaption>
                    <div className="flex items-center gap-1 mt-1 flex-wrap">
                        {[...Array(rating)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 text-primary fill-current flex-shrink-0" />
                        ))}
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-1 whitespace-nowrap">{date}</span>
                    </div>
                </div>
            </div>
            <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed break-words whitespace-normal line-clamp-4">
                "{comment}"
            </div>

        </figure>
    );
};

export default function HomePage({ employees }: HomePageProps) {
  const [navOpen, setNavOpen] = useState(false);
  const [showBooking, setShowBooking] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Check if user is near bottom of page
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // Consider "at bottom" when within 200px of the bottom
      const threshold = 600;
      const isNearBottom = scrollTop + windowHeight >= documentHeight - threshold;

      setIsAtBottom(isNearBottom);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check theme changes
  useEffect(() => {
    const checkTheme = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    };

    checkTheme();

    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

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

  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-sans">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-lg py-4 px-4 md:px-8 flex items-center justify-between z-50">
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
        <nav className="hidden md:flex gap-8 text-gray-700 dark:text-white/90 items-center">
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
          className="md:hidden text-gray-700 dark:text-white p-2"
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
                        className="fixed top-16 left-0 right-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm p-6 z-40 md:hidden"
          >
            <div className="flex flex-col gap-4">
              <a href="#services" className="text-gray-700 dark:text-white hover:text-primary transition-colors" onClick={() => setNavOpen(false)}>Services</a>
              <a href="#team" className="text-gray-700 dark:text-white hover:text-primary transition-colors" onClick={() => setNavOpen(false)}>Our Team</a>
              <a href="#testimonials" className="text-gray-700 dark:text-white hover:text-primary transition-colors" onClick={() => setNavOpen(false)}>Reviews</a>
              <a href="#contact" className="text-gray-700 dark:text-white hover:text-primary transition-colors" onClick={() => setNavOpen(false)}>Contact</a>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 dark:text-white/70">Theme</span>
                <AnimatedThemeToggler />
              </div>
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
            <span className="text-primary">Meets </span>
            <LineShadowText
              className="text-primary italic"
              shadowColor={isDarkMode ? "white" : "black"}
            >
              Precision
            </LineShadowText>
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
            <section id="services" className="py-20 bg-gray-100 dark:bg-gray-800">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="text-4xl md:text-5xl font-bold mb-4 font-serif text-gray-900 dark:text-white">Our Services</h3>
            <p className="text-xl text-gray-600 dark:text-gray-400">Premium grooming services for the modern gentleman</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.name}
                className="bg-white dark:bg-gray-900 p-8 rounded-xl text-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 transform hover:scale-105 shadow-md dark:shadow-none"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-primary mb-4 flex justify-center">
                  {service.icon}
                </div>
                <h4 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">{service.name}</h4>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{service.description}</p>
                <p className="text-primary font-semibold text-lg">{service.price}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <TeamSection employees={employees} />

      {/* Testimonials Section */}
            <section id="testimonials" className="py-20 bg-gray-100 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="text-4xl md:text-5xl font-bold mb-4 font-serif text-gray-900 dark:text-white">What Our Clients Say</h3>
            <p className="text-xl text-gray-600 dark:text-gray-400">Real reviews from satisfied customers</p>
          </motion.div>

          <div className="relative flex w-full flex-col items-center justify-center overflow-hidden py-8">
            <ScrollVelocityContainer className="w-full">
              <ScrollVelocityRow baseVelocity={6} direction={1} className="py-4">
                {firstRow.map((review, index) => (
                  <div key={`first-${index}`} className="mx-4">
                    <TestimonialCard {...review} />
                  </div>
                ))}
              </ScrollVelocityRow>
              <ScrollVelocityRow baseVelocity={6} direction={-1} className="py-4">
                {secondRow.map((review, index) => (
                  <div key={`second-${index}`} className="mx-4">
                    <TestimonialCard {...review} />
                  </div>
                ))}
              </ScrollVelocityRow>
            </ScrollVelocityContainer>
          </div>
        </div>
      </section>

      {/* Contact Section */}
            <section id="contact" className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="text-4xl md:text-5xl font-bold mb-4 font-serif text-gray-900 dark:text-white">Visit Us Today</h3>
            <p className="text-xl text-gray-600 dark:text-gray-400">We're here to make you look and feel your best</p>
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
                  <h4 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Location</h4>
                  <p className="text-gray-600 dark:text-gray-400">123 Main Street<br />Downtown District<br />City, State 12345</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Clock className="w-6 h-6 text-primary mt-1" />
                <div>
                  <h4 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Hours</h4>
                  <div className="text-gray-600 dark:text-gray-400 space-y-1">
                    <p>Monday - Friday: 9AM - 8PM</p>
                    <p>Saturday: 8AM - 6PM</p>
                    <p>Sunday: 10AM - 4PM</p>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Phone className="w-6 h-6 text-primary mt-1" />
                <div>
                  <h4 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Phone</h4>
                  <p className="text-gray-600 dark:text-gray-400">(555) 123-4567</p>
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
              className="bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden shadow-md dark:shadow-none"
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
      <footer className="bg-gray-200 dark:bg-gray-950 text-center py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img src="/img/logo.svg" alt="Trimly Logo" className="h-8 w-8" />
            <span className="text-xl font-bold text-primary font-serif">Trimly Cutz</span>
          </div>
          <p className="text-gray-600 dark:text-gray-400">© 2025 Trimly Cutz. All rights reserved.</p>
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

      {/* Floating Theme Toggle / Scroll to Top for Desktop */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.2 }}
        className="fixed bottom-4 right-4 lg:bottom-6 lg:right-6 z-30 hidden lg:block"
      >
        {isAtBottom ? (
          <motion.button
            key="scroll-top"
            initial={{ scale: 0, rotate: 180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: -180 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            onClick={scrollToTop}
            className="w-14 h-14 bg-primary text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 border border-primary/20 flex items-center justify-center hover:bg-primary/90"
            aria-label="Scroll to top"
          >
            <ChevronUp size={24} />
          </motion.button>
        ) : (
          <AnimatedThemeToggler
            key="theme-toggle"
            className="w-14 h-14 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 flex items-center justify-center"
          />
        )}
      </motion.div>

      {/* Booking Modal */}
      <AnimatePresence mode="wait">
        {showBooking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end md:items-center justify-center md:p-4"
            onClick={handleCloseBooking}
          >
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "tween", duration: 0.3 }}
              className="relative bg-white w-full max-h-[90vh] rounded-t-3xl md:rounded-2xl md:max-w-md md:w-full md:max-h-[90vh] md:h-auto overflow-hidden"
              onClick={(e) => e.stopPropagation()}
              style={{
                msOverflowStyle: 'none',
                scrollbarWidth: 'none'
              }}
            >
              <style jsx>{`
                div::-webkit-scrollbar {
                  display: none;
                }
              `}</style>
              <div className="h-full">
                <BookingApp employees={employees} onClose={handleCloseBooking} />
              </div>
              <BorderBeam
                duration={6}
                size={400}
                className="from-transparent via-red-500 to-transparent"
              />
              <BorderBeam
                duration={6}
                delay={3}
                size={400}
                borderWidth={2}
                className="from-transparent via-blue-500 to-transparent"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </>
  );
}
