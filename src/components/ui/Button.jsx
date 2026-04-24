import { motion } from 'framer-motion';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  onClick,
  type = 'button',
  className = '',
  icon,
  ...props
}) => {
  const base = 'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent/50 disabled:opacity-60 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-secondary text-white hover:bg-accent focus:ring-secondary shadow-md',
    outline: 'border-2 border-secondary text-secondary hover:bg-secondary hover:text-white',
    ghost: 'text-primary hover:bg-surface',
    danger: 'bg-red-500 text-white hover:bg-red-600',
    dark: 'bg-primary text-white hover:bg-primary-light',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  };

  return (
    <motion.button
      whileHover={!disabled && !loading ? { scale: 1.04 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.96 } : {}}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading ? (
        <>
          <motion.div
            className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
          />
          <span>Loading...</span>
        </>
      ) : (
        <>
          {icon && <span>{icon}</span>}
          {children}
        </>
      )}
    </motion.button>
  );
};

export default Button;
