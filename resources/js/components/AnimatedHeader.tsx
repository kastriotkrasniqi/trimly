    import React, { useState, useCallback, useEffect } from 'react';
    import { Menu, X } from 'lucide-react';
    import { motion, AnimatePresence } from 'framer-motion';
    import { cn } from '@/lib/utils';
    import { usePage } from '@inertiajs/react';

    interface AnimatedHeaderProps {
    navOpen: boolean;
    setNavOpen: (value: boolean) => void;
    isDarkMode: boolean;
    onOpenBooking: () => void;
    }

    const AnimatedHeader: React.FC<AnimatedHeaderProps> = ({
    navOpen,
    setNavOpen,
    isDarkMode,
    onOpenBooking
    }) => {
    const { auth } = usePage().props as any;
    const [isScrolled, setIsScrolled] = useState(false);

    const handleToggleNav = useCallback(() => {
        setNavOpen(!navOpen);
    }, [navOpen, setNavOpen]);

    useEffect(() => {
        const handleScroll = () => {
        setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <motion.header
        className="fixed top-4 left-1/2 z-50 -translate-x-1/2 px-4 bg-transparent"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
            duration: 0.6,
            ease: [0.25, 0.1, 0.25, 1]
        }}
        >
        <div
            className={cn(
            "flex items-center h-14 lg:h-16 relative px-5 py-1.5 backdrop-blur-[40px]",
            "border border-white/[0.08] dark:border-white/[0.05]",
            "transition-all duration-400 ease-out will-change-transform",
            // Desktop: always show full nav, Mobile: toggle between centered and spread
            "md:justify-between",
            navOpen ? "justify-between" : "justify-center",
            // Desktop: always full width, Mobile: match dropdown width when open
            "md:w-[720px] md:max-w-[720px]",
            navOpen
                ? "w-[calc(90vw-2rem)] max-w-[360px] sm:w-[500px] sm:max-w-[500px]"
                : "w-[280px] sm:w-[350px]",
            // Desktop: always rounded, Mobile: remove bottom border radius when menu is open
            "md:rounded-[20px]",
            navOpen ? "rounded-t-[20px] rounded-b-none" : "rounded-[20px]"
            )}
            style={{
            backgroundColor: navOpen
                ? (isDarkMode ? 'rgba(20,20,25,0.92)' : 'rgba(255,255,255,0.88)')
                : (isDarkMode ? 'rgba(20,20,25,0.75)' : 'rgba(255,255,255,0.72)'),
            backdropFilter: 'blur(40px) saturate(180%)',
            boxShadow: navOpen
                ? (isDarkMode
                    ? '0 20px 60px rgba(0,0,0,0.4), 0 8px 25px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.1)'
                    : '0 20px 60px rgba(0,0,0,0.08), 0 8px 25px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.8)')
                : (isDarkMode
                    ? '0 12px 40px rgba(0,0,0,0.25), 0 4px 12px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.08)'
                    : '0 12px 40px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.03), inset 0 1px 0 rgba(255,255,255,0.6)'),
            // Remove bottom border on mobile when menu is open
            borderBottomWidth: navOpen ? '0' : '1px'
            }}
        >
            {/* Logo - always visible on mobile, positioned on left */}
            <AnimatePresence mode="wait">
                <motion.span
                    key={navOpen ? 'open' : 'closed'}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{
                        duration: 0.4,
                        ease: [0.25, 0.1, 0.25, 1],
                        // Only delay on desktop when closing to prevent layout jump
                        delay: !navOpen && (typeof window !== 'undefined' && window.innerWidth >= 768) ? 0.2 : 0
                    }}
                    className={cn(
                        "text-lg lg:text-xl font-semibold tracking-tight text-black/90 dark:text-white/95",
                        // Desktop: always show with margin, Mobile: always show
                        "md:mr-3"
                    )}
                    style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif' }}
                >
                    TRIMLY CUTZ
                </motion.span>
            </AnimatePresence>

            {/* Hamburger/Close button - only show on mobile, positioned on right */}
            <div className="flex items-center gap-2 md:hidden ml-4">
            <button
                className={cn(
                "flex items-center justify-center w-9 h-9 rounded-[12px] transition-all duration-300",
                "hover:bg-black/[0.08] dark:hover:bg-white/[0.12]",
                "active:scale-95 active:bg-black/[0.12] dark:active:bg-white/[0.18]",
                "backdrop-blur-sm border border-black/[0.04] dark:border-white/[0.08]"
                )}
                onClick={handleToggleNav}
                aria-label="Toggle menu"
            >
                {navOpen
                ? <X className="w-5 h-5 text-black/80 dark:text-white/90" strokeWidth={2.5} />
                : <Menu className="w-5 h-5 text-black/80 dark:text-white/90" strokeWidth={2.5} />
                }
            </button>
            </div>

            {/* Desktop navigation - always visible */}
            <div
                className="hidden md:flex items-center gap-5 ml-6"
                style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif' }}
            >
                {[
                    ...(auth?.user ? [{ label: 'Dashboard', href: '/dashboard' }] : []),
                    { label: 'Services', href: '#services' },
                    { label: 'Our Team', href: '#team' },
                    { label: 'Reviews', href: '#testimonials' },
                    { label: 'Contact', href: '#contact' }
                ].map((item, index) => (
                    <a
                        key={item.label}
                        href={item.href}
                        className="text-[15px] font-medium text-black/80 dark:text-white/85 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 whitespace-nowrap hover:scale-105 active:scale-95"
                    >
                        {item.label}
                    </a>
                ))}

                <button
                    onClick={onOpenBooking}
                    className={cn(
                    "bg-gradient-to-b from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500",
                    "text-white px-4 py-2 rounded-[12px] font-medium text-[14px]",
                    "shadow-[0_4px_16px_rgba(59,130,246,0.3)] dark:shadow-[0_4px_16px_rgba(96,165,250,0.4)]",
                    "hover:shadow-[0_6px_20px_rgba(59,130,246,0.4)] dark:hover:shadow-[0_6px_20px_rgba(96,165,250,0.5)]",
                    "hover:scale-105 active:scale-95 transition-all duration-200",
                    "border border-blue-400/20 dark:border-blue-300/20",
                    "whitespace-nowrap"
                    )}
                >
                    Book Now
                </button>
            </div>
        </div>
        </motion.header>
    );
    };

    export default AnimatedHeader;
