import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Scissors, Menu, X, Star, MapPin, Phone, MessageCircle, Clock, Users, Award, Sparkles, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import {
  ScrollVelocityContainer,
  ScrollVelocityRow,
} from '@/components/ui/scroll-based-velocity';
import { cn } from '@/lib/utils';
import BookingApp from '@/pages/appointment';
import { Barber } from '@/types/booking';
import { Head } from '@inertiajs/react';
import { AnimatedThemeToggler } from '@/components/ui/animated-theme-toggler';
import { LineShadowText } from '@/components/ui/line-shadow-text';
import { AnimatedText } from '@/components/ui/animated-text';
import TeamSection from '@/components/TeamSection';
import AnimatedHeader from '@/components/AnimatedHeader';
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

  // Scroll animation refs
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const contentY = useTransform(scrollYProgress, [0, 1], [0, 50]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.02, 1.05]);
  const imageY = useTransform(scrollYProgress, [0, 1], [0, -25]);

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
      {/* Header Component */}
      <AnimatedHeader
        navOpen={navOpen}
        setNavOpen={setNavOpen}
        isDarkMode={isDarkMode}
        onOpenBooking={handleOpenBooking}
      />

      {/* Mobile Navigation - Sticky to Header */}
      <AnimatePresence>
        {navOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed top-[72px] left-1/2 -translate-x-1/2 z-40 md:hidden overflow-hidden"
            style={{
              width: "calc(90vw - 2rem)",
              maxWidth: "360px"
            }}
          >
            <div
              className={cn(
                "backdrop-blur-[50px]",
                "border-l border-r border-b border-white/[0.08] dark:border-white/[0.05]",
                "rounded-b-[20px]",
                "shadow-[0_20px_60px_rgba(0,0,0,0.08)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.4)]"
              )}
              style={{
                backgroundColor: isDarkMode ? 'rgba(20,20,25,0.92)' : 'rgba(255,255,255,0.88)',
                backdropFilter: 'blur(40px) saturate(180%)',
                boxShadow: isDarkMode
                  ? '0 20px 60px rgba(0,0,0,0.4), 0 8px 25px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.1)'
                  : '0 20px 60px rgba(0,0,0,0.08), 0 8px 25px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.8)'
              }}
            >
            <motion.div
              className="p-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif' }}
            >
              <div className="flex flex-col gap-1 mb-6">
                <a href="#services"
                   className="text-[17px] font-medium text-black/85 dark:text-white/90 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 py-3 px-4 rounded-[14px] hover:bg-black/[0.04] dark:hover:bg-white/[0.08] active:scale-[0.98]"
                   onClick={() => setNavOpen(false)}>Services</a>
                <a href="#team"
                   className="text-[17px] font-medium text-black/85 dark:text-white/90 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 py-3 px-4 rounded-[14px] hover:bg-black/[0.04] dark:hover:bg-white/[0.08] active:scale-[0.98]"
                   onClick={() => setNavOpen(false)}>Our Team</a>
                <a href="#testimonials"
                   className="text-[17px] font-medium text-black/85 dark:text-white/90 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 py-3 px-4 rounded-[14px] hover:bg-black/[0.04] dark:hover:bg-white/[0.08] active:scale-[0.98]"
                   onClick={() => setNavOpen(false)}>Reviews</a>
                <a href="#contact"
                   className="text-[17px] font-medium text-black/85 dark:text-white/90 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 py-3 px-4 rounded-[14px] hover:bg-black/[0.04] dark:hover:bg-white/[0.08] active:scale-[0.98]"
                   onClick={() => setNavOpen(false)}>Contact</a>
              </div>

              <AnimatedThemeToggler
                className={cn(
                  "flex items-center justify-between py-3 px-4 mb-4 rounded-[14px] bg-black/[0.03] dark:bg-white/[0.05]",
                  "text-[16px] font-medium text-black/70 dark:text-white/70",
                  "hover:bg-black/[0.06] dark:hover:bg-white/[0.08] transition-all duration-200"
                )}
                label="Theme"
              />
            </motion.div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Hero Section - iOS 17+ Inspired */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gray-50 dark:bg-gray-900">
        {/* Background Image - no brightness filter in light mode */}
        <motion.div
          className="absolute inset-0"
          style={{ scale: imageScale, y: imageY }}
        >
          {/* Show image with no overlay/filter in light mode, keep accent overlay only in dark mode */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-100"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=2074&auto=format&fit=crop')"
            }}
          />
          {/* Accent overlay only in dark mode for style */}
          <div className="hidden dark:block absolute inset-0 bg-gradient-to-tr from-blue-950/40 via-transparent to-purple-950/40 pointer-events-none"></div>
        </motion.div>

        {/* Content Container */}
        <motion.div
          className="relative z-10 container mx-auto px-6 lg:px-8 pt-24 lg:pt-32"
          style={{ y: contentY, opacity: contentOpacity }}
        >
          <div className="max-w-6xl mx-auto">
            {/* Main Heading */}
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-8 text-white dark:text-white"
                  style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif' }}>
                <span className="block text-white dark:text-white">
                  <AnimatedText text="Craft premium" className="text-white dark:text-white" delay={0.2} />
                </span>
                <span className="block text-blue-100 dark:text-blue-200 italic font-light">
                  <AnimatedText text="barbering experiences" className="text-blue-100 dark:text-blue-200 italic font-light" delay={0.6} />
                </span>
              </h1>

              <motion.p
                className="text-lg md:text-xl text-gray-100 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed mb-12"
                style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                Designed in the heart of the city, crafted to endure — timeless grooming for modern gentlemen.
              </motion.p>

              {/* Feature Pills */}
              <motion.div
                className="flex flex-wrap justify-center gap-3 mb-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif' }}
              >
                <div className={cn(
                  "flex items-center gap-2.5 px-4 py-2.5 rounded-full",
                  "bg-white/75 dark:bg-black/60 backdrop-blur-[20px]",
                  "border border-white/30 dark:border-white/20",
                  "shadow-[0_8px_32px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)]",
                  "hover:bg-white/85 dark:hover:bg-black/70 transition-all duration-300",
                  "hover:scale-105 active:scale-95"
                )}>
                  <div className="w-2 h-2 bg-green-500 rounded-full shadow-sm"></div>
                  <span className="text-[14px] font-medium text-gray-800 dark:text-gray-200">Walk-ins welcome</span>
                </div>
                <div className={cn(
                  "flex items-center gap-2.5 px-4 py-2.5 rounded-full",
                  "bg-white/75 dark:bg-black/60 backdrop-blur-[20px]",
                  "border border-white/30 dark:border-white/20",
                  "shadow-[0_8px_32px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)]",
                  "hover:bg-white/85 dark:hover:bg-black/70 transition-all duration-300",
                  "hover:scale-105 active:scale-95"
                )}>
                  <div className="w-2 h-2 bg-blue-500 rounded-full shadow-sm"></div>
                  <span className="text-[14px] font-medium text-gray-800 dark:text-gray-200">Expert barbers</span>
                </div>
                <div className={cn(
                  "flex items-center gap-2.5 px-4 py-2.5 rounded-full",
                  "bg-white/75 dark:bg-black/60 backdrop-blur-[20px]",
                  "border border-white/30 dark:border-white/20",
                  "shadow-[0_8px_32px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)]",
                  "hover:bg-white/85 dark:hover:bg-black/70 transition-all duration-300",
                  "hover:scale-105 active:scale-95"
                )}>
                  <div className="w-2 h-2 bg-amber-500 rounded-full shadow-sm"></div>
                  <span className="text-[14px] font-medium text-gray-800 dark:text-gray-200">Premium service</span>
                </div>
              </motion.div>

              {/* CTA Button */}
              <motion.div
                className="hidden md:flex justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.0 }}
              >
                <button
                  onClick={handleOpenBooking}
                  className={cn(
                    "group relative overflow-hidden",
                    "bg-white text-gray-900 dark:bg-gradient-to-b dark:from-white dark:via-gray-100 dark:to-white dark:text-black",
                    "px-8 py-4 rounded-[22px] font-semibold text-[17px]",
                    "shadow-lg dark:shadow-xl",
                    "hover:scale-105 active:scale-95 transition-all duration-300",
                    "border border-gray-200 dark:border-gray-300/20",
                    "flex items-center gap-3"
                  )}
                  style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif' }}
                >
                  <span>Book Your Experience</span>
                  <motion.div
                    className="w-5 h-5 flex items-center justify-center"
                    whileHover={{ x: 3 }}
                    transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                  >
                    <Scissors className="w-4 h-4 text-gray-900 dark:text-black" strokeWidth={2.5} />
                  </motion.div>
                </button>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Services Section - iOS 17+ Inspired */}
      <section id="services" className="py-24 lg:py-32 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-6 lg:px-8">
          <motion.div
            className="max-w-4xl mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif' }}
          >
            <h3 className="text-5xl lg:text-6xl font-bold mb-6 text-gray-900 dark:text-white tracking-tight">
              Premium services
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
              Meticulously crafted grooming experiences that blend traditional techniques with modern sophistication.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8 lg:gap-10">
            {services.map((service, index) => {
              // Service-specific images for better visual appeal
              const serviceImages = {
                'Classic Haircut': 'https://images.unsplash.com/photo-1622286346003-c4b4f0ca3b4e?q=80&w=2073&auto=format&fit=crop',
                'Beard Trim': 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=2074&auto=format&fit=crop',
                'Hot Shave': 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=2074&auto=format&fit=crop',
                'Hair Styling': 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=2073&auto=format&fit=crop'
              };

              return (
                <motion.div
                  key={service.name}
                  className={cn(
                    "group relative aspect-[4/5] overflow-hidden rounded-[28px]",
                    "bg-white/80 dark:bg-black/60 backdrop-blur-[20px]",
                    "border border-white/30 dark:border-white/10",
                    "shadow-[0_20px_60px_rgba(0,0,0,0.08)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.3)]",
                    "hover:shadow-[0_25px_80px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_25px_80px_rgba(0,0,0,0.4)]",
                    "hover:scale-[1.02] transition-all duration-500 ease-out",
                    "cursor-pointer"
                  )}
                  initial={{ opacity: 0, y: 40, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
                  viewport={{ once: true }}
                  onClick={handleOpenBooking}
                >
                  {/* Service Image */}
                  <div className="absolute inset-0 rounded-[28px] overflow-hidden">
                    <img
                      src={serviceImages[service.name] || 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=2074&auto=format&fit=crop'}
                      alt={service.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-purple-600/10"></div>
                  </div>

                  {/* Content */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-end"
                       style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif' }}>
                    {/* Price Badge */}
                    <div className="absolute top-6 right-6">
                      <span className={cn(
                        "bg-white/25 dark:bg-black/40 backdrop-blur-[20px] text-white px-3.5 py-2 rounded-[14px]",
                        "text-[14px] font-semibold border border-white/20",
                        "shadow-[0_8px_32px_rgba(0,0,0,0.2)]"
                      )}>
                        {service.price}
                      </span>
                    </div>

                    {/* Service Info */}
                    <div className="text-white">
                      <div className="mb-4 text-white/90 opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                        {service.icon}
                      </div>

                      <h4 className="text-xl lg:text-2xl font-bold mb-3 group-hover:text-blue-300 transition-colors duration-500">
                        {service.name}
                      </h4>

                      <p className="text-white/85 text-[15px] leading-relaxed mb-5 font-medium">
                        {service.description}
                      </p>

                      <motion.div
                        className={cn(
                          "flex items-center text-[13px] font-semibold text-white/70",
                          "group-hover:text-white transition-colors duration-300",
                          "bg-white/10 backdrop-blur-sm px-3 py-2 rounded-[10px] w-fit",
                          "border border-white/20"
                        )}
                        whileHover={{ x: 3, scale: 1.05 }}
                        transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                      >
                        <span>Book now</span>
                        <div className="ml-2 w-3 h-3">
                          <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </div>
                      </motion.div>
                    </div>
                  </div>

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-600/10 via-transparent to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[28px]"></div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <TeamSection employees={employees} />

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 lg:py-32 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="text-5xl lg:text-6xl font-bold mb-6 text-gray-900 dark:text-white tracking-tight">Client Reviews</h3>
            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">Hear what our valued clients have to say about their experience</p>
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
            <section id="contact" className="py-24 lg:py-32 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-6 lg:px-8">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="text-5xl lg:text-6xl font-bold mb-6 text-gray-900 dark:text-white tracking-tight">Visit Us Today</h3>
            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">We're here to make you look and feel your best</p>
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

      {/* Footer - Professional Layout */}
      <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 pt-10 pb-6">
        <div className="container mx-auto px-6 lg:px-8 flex flex-col items-center">
          <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-2xl mb-6 gap-4">
            <div className="flex items-center gap-3">
              <img src="/img/logo.svg" alt="Trimly Logo" className="h-10 w-10 rounded-full shadow-sm" />
              <span className="text-2xl font-bold text-primary font-serif tracking-tight">Trimly Cutz</span>
            </div>
            <div className="flex gap-4 mt-2 md:mt-0">
              {/* Social icons - add your links */}
              <a href="https://instagram.com" target="_blank" rel="noopener" aria-label="Instagram" className="hover:text-primary transition-colors">
                <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-gray-500 dark:text-gray-400 hover:text-primary"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.5" y2="6.5"/></svg>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener" aria-label="Facebook" className="hover:text-primary transition-colors">
                <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-gray-500 dark:text-gray-400 hover:text-primary"><path d="M18 2h-3a4 4 0 0 0-4 4v3H7v4h4v8h4v-8h3l1-4h-4V6a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href="mailto:info@trimlycutz.com" aria-label="Email" className="hover:text-primary transition-colors">
                <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-gray-500 dark:text-gray-400 hover:text-primary"><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="22,6 12,13 2,6"/></svg>
              </a>
            </div>
          </div>
          <div className="w-full max-w-2xl border-t border-gray-200 dark:border-gray-800 mb-4"></div>
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">© 2025 Trimly Cutz. All rights reserved.</p>
        </div>
      </footer>

      {/* Floating Book Button for Mobile */}
      <AnimatePresence>
        {!showBooking && (
          <motion.button
            initial={{ scale: 0, rotate: -180, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            exit={{ scale: 0, rotate: 180, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className={cn(
              "fixed bottom-6 right-6 w-16 h-16 rounded-[20px] z-30 lg:hidden",
              "bg-gradient-to-b from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500",
              "shadow-lg dark:shadow-xl",
              "hover:scale-110 active:scale-95 transition-all duration-300",
              "border border-blue-400/20 dark:border-blue-300/20",
              "backdrop-blur-sm flex items-center justify-center"
            )}
            onClick={handleOpenBooking}
            aria-label="Book appointment"
          >
            <Scissors className="text-white" size={24} strokeWidth={2.5} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Floating Theme Toggle / Scroll to Top for Desktop */}
      <motion.div
        initial={{ scale: 0, rotate: -180, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.2 }}
        className="fixed bottom-6 right-6 z-30 hidden lg:block"
      >
        {isAtBottom ? (
          <motion.button
            key="scroll-top"
            initial={{ scale: 0, rotate: 180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: -180 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            onClick={scrollToTop}
            className={cn(
              "w-14 h-14 rounded-[18px] flex items-center justify-center",
              "bg-white/80 dark:bg-black/70 backdrop-blur-[20px]",
              "border border-white/30 dark:border-white/20",
              "shadow-[0_12px_40px_rgba(0,0,0,0.08)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.3)]",
              "hover:shadow-[0_16px_50px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_16px_50px_rgba(0,0,0,0.4)]",
              "hover:scale-110 active:scale-95 transition-all duration-300",
              "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
            )}
            aria-label="Scroll to top"
          >
            <ChevronUp size={22} strokeWidth={2.5} />
          </motion.button>
        ) : (
          <AnimatedThemeToggler
            key="theme-toggle"
            className={cn(
              "w-14 h-14 rounded-[18px] flex items-center justify-center",
              "bg-white/80 dark:bg-black/70 backdrop-blur-[20px]",
              "border border-white/30 dark:border-white/20",
              "shadow-[0_12px_40px_rgba(0,0,0,0.08)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.3)]",
              "hover:shadow-[0_16px_50px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_16px_50px_rgba(0,0,0,0.4)]",
              "hover:scale-110 active:scale-95 transition-all duration-300"
            )}
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
            className="fixed inset-0 bg-black/60 backdrop-blur-[10px] z-50 flex items-end md:items-center justify-center md:p-4"
            onClick={handleCloseBooking}
          >
            <motion.div
              initial={{ y: "100%", opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: "100%", opacity: 0, scale: 0.95 }}
              transition={{ type: "tween", duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
              className={cn(
                "relative w-full max-h-[90vh] md:max-w-md md:w-full md:max-h-[90vh] md:h-auto overflow-hidden",
                "bg-white/95 dark:bg-black/90 backdrop-blur-[40px]",
                "rounded-t-[32px] md:rounded-[28px]",
                "border-t border-white/20 md:border md:border-white/30 dark:md:border-white/10",
                "shadow-[0_-10px_40px_rgba(0,0,0,0.1)] md:shadow-[0_25px_80px_rgba(0,0,0,0.15)]",
                "dark:shadow-[0_-10px_40px_rgba(0,0,0,0.3)] md:dark:shadow-[0_25px_80px_rgba(0,0,0,0.5)]"
              )}
              onClick={(e) => e.stopPropagation()}
              style={{
                msOverflowStyle: 'none',
                scrollbarWidth: 'none',
                backdropFilter: 'blur(40px) saturate(180%)'
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </>
  );
}
