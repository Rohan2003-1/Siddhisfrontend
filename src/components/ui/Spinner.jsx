import { motion } from 'framer-motion';

const Spinner = ({ size = 'md', color = 'white' }) => {
  const sizes = { sm: 'w-4 h-4', md: 'w-5 h-5', lg: 'w-8 h-8' };
  return (
    <motion.div
      className={`${sizes[size]} border-2 border-${color}/30 border-t-${color} rounded-full`}
      animate={{ rotate: 360 }}
      transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
    />
  );
};

export default Spinner;
