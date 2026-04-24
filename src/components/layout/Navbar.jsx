import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Menu, X, Search, User, Monitor, ChevronDown, LogOut, LayoutDashboard, Package, Calendar } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { selectCartCount, toggleCart } from '../../features/cartSlice';
import { selectIsAuthenticated, selectUser, logout } from '../../features/authSlice';
import { setSearchQuery } from '../../features/productSlice';
import toast from 'react-hot-toast';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');

  const cartCount = useSelector(selectCartCount);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(setSearchQuery(searchVal));
    navigate('/products');
    setSearchOpen(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
    navigate('/');
    setProfileOpen(false);
  };

  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'Products', to: '/products' },
    { label: 'Book Service', to: '/booking' },
  ];

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-primary/95 backdrop-blur-md shadow-xl' : 'bg-primary'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ rotate: 15 }}
              className="p-2 bg-accent/20 rounded-xl"
            >
              <Monitor size={22} className="text-accent" />
            </motion.div>
            <div>
              <span className="text-white font-bold text-lg leading-none">Siddhis</span>
              <span className="text-accent font-bold text-lg leading-none"> Computers</span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `nav-link px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive ? 'text-accent bg-white/10' : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <motion.button
              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
            >
              <Search size={20} />
            </motion.button>

            {/* Cart */}
            <motion.button
              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
              animate={cartCount > 0 ? { scale: [1, 1.2, 1] } : {}}
              key={cartCount}
              onClick={() => dispatch(toggleCart())}
              className="relative p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-primary text-xs font-bold rounded-full flex items-center justify-center"
                >
                  {cartCount}
                </motion.span>
              )}
            </motion.button>

            {/* Profile */}
            {isAuthenticated ? (
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 px-3 py-2 text-white/90 hover:bg-white/10 rounded-xl transition-colors"
                >
                  <div className="w-7 h-7 bg-accent text-primary rounded-full flex items-center justify-center font-bold text-sm">
                    {user?.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <ChevronDown size={14} className="hidden sm:block" />
                </motion.button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-12 w-52 bg-white rounded-2xl shadow-cardHover border border-surface overflow-hidden z-50"
                    >
                      <div className="px-4 py-3 bg-surface/50 border-b border-surface">
                        <p className="font-semibold text-primary text-sm">{user?.name}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>
                      {[
                        { label: 'Dashboard', icon: LayoutDashboard, to: '/dashboard' },
                        { label: 'My Orders', icon: Package, to: '/dashboard' },
                        { label: 'My Bookings', icon: Calendar, to: '/dashboard' },
                        ...(user?.role === 'admin' ? [{ label: 'Admin Panel', icon: LayoutDashboard, to: '/admin' }] : []),
                      ].map(item => (
                        <Link
                          key={item.to + item.label}
                          to={item.to}
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-surface transition-colors"
                        >
                          <item.icon size={16} className="text-secondary" />
                          {item.label}
                        </Link>
                      ))}
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors border-t border-surface"
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link to="/login">
                <motion.button
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-1.5 px-4 py-2 bg-accent text-primary font-semibold text-sm rounded-xl hover:bg-accent/90 transition-colors"
                >
                  <User size={16} />
                  Login
                </motion.button>
              </Link>
            )}

            {/* Mobile menu toggle */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl"
            >
              {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-white/10 bg-primary-dark overflow-hidden"
          >
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto px-4 py-3 flex gap-3">
              <input
                autoFocus
                value={searchVal}
                onChange={e => setSearchVal(e.target.value)}
                placeholder="Search laptops, desktops, accessories..."
                className="flex-1 px-4 py-2.5 bg-white/10 text-white placeholder-white/50 border border-white/20 rounded-xl focus:outline-none focus:border-accent"
              />
              <motion.button
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                type="submit"
                className="px-5 py-2.5 bg-accent text-primary font-semibold rounded-xl"
              >
                Search
              </motion.button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-0 top-16 bg-primary z-40 md:hidden"
          >
            <div className="p-6 flex flex-col gap-2">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.to}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <NavLink
                    to={link.to}
                    onClick={() => setIsMenuOpen(false)}
                    className={({ isActive }) =>
                      `block px-4 py-3 rounded-xl text-lg font-medium transition-colors ${
                        isActive ? 'bg-white/20 text-white' : 'text-white/80 hover:bg-white/10 hover:text-white'
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
