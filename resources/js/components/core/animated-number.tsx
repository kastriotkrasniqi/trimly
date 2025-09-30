import { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

interface AnimatedNumberProps {
  value: number;
  className?: string;
  springOptions?: {
    bounce?: number;
    duration?: number;
    damping?: number;
    stiffness?: number;
  };
  format?: (value: number) => string;
}

export function AnimatedNumber({
  value,
  className = '',
  springOptions = {
    bounce: 0,
    duration: 2000,
  },
  format = (num) => Math.round(num).toLocaleString(),
}: AnimatedNumberProps) {
  const [isVisible, setIsVisible] = useState(false);

  // Create spring animation
  const spring = useSpring(0, {
    bounce: springOptions.bounce || 0,
    duration: springOptions.duration || 2000,
    damping: springOptions.damping || 30,
    stiffness: springOptions.stiffness || 100,
  });

  // Transform the spring value to the target value
  const display = useTransform(spring, (current) => format(current));

  useEffect(() => {
    setIsVisible(true);
    spring.set(value);
  }, [spring, value]);

  return (
    <motion.span
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
      transition={{ duration: 0.5 }}
    >
      {display}
    </motion.span>
  );
}
