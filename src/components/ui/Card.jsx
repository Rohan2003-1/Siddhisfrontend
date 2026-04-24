import { motion } from 'framer-motion';

const Card = ({ children, className = '', hover = true, glass = false, onClick }) => (
  <motion.div
    whileHover={hover ? { y: -6, boxShadow: '0 16px 48px rgba(45,106,79,0.15)' } : {}}
    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    onClick={onClick}
    className={`
      rounded-2xl shadow-card overflow-hidden transition-shadow duration-300
      ${glass ? 'glass' : 'bg-white'}
      ${onClick ? 'cursor-pointer' : ''}
      ${className}
    `}
  >
    {children}
  </motion.div>
);

export default Card;
