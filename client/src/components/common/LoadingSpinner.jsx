import { motion } from 'framer-motion';

const LoadingSpinner = ({ size = 'md' }) => {
  const sizes = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
      className={`${sizes[size]} border-4 border-primary/20 border-t-primary rounded-full`}
    />
  );
};

export default LoadingSpinner;
