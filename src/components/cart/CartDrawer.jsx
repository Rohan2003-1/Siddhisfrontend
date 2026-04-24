import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, ShoppingBag, Plus, Minus } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { selectCartItems, selectCartTotal, removeFromCart, updateQuantity, setCartOpen, selectCartOpen, syncCart } from '../../features/cartSlice';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../../utils/helpers';
import Button from '../ui/Button';

const CartDrawer = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector(selectCartOpen);
  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => dispatch(setCartOpen(false))}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 bg-primary text-white">
              <div className="flex items-center gap-2">
                <ShoppingBag size={20} />
                <h2 className="font-bold text-lg">Shopping Cart</h2>
                {items.length > 0 && (
                  <span className="bg-accent text-primary text-xs font-bold px-2 py-0.5 rounded-full">{items.length}</span>
                )}
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                onClick={() => dispatch(setCartOpen(false))}
                className="p-2 hover:bg-white/10 rounded-xl transition-colors"
              >
                <X size={20} />
              </motion.button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-gray-400">
                  <ShoppingBag size={60} className="text-surface" />
                  <p className="font-medium text-lg">Your cart is empty</p>
                  <p className="text-sm">Add some products to get started</p>
                  <Link to="/products" onClick={() => dispatch(setCartOpen(false))}>
                    <Button variant="primary">Browse Products</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  <AnimatePresence>
                    {items.map(item => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -30 }}
                        className="flex gap-3 p-3 bg-background rounded-2xl border border-surface"
                      >
                        <img src={item.images?.[0]?.url || item.image} alt={item.name} className="w-20 h-20 object-cover rounded-xl flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-800 text-sm line-clamp-2">{item.name}</h4>
                          <p className="text-secondary font-bold mt-1">{formatCurrency(item.price)}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <motion.button
                              whileTap={{ scale: 0.85 }}
                              onClick={() => { dispatch(updateQuantity({ id: item._id || item.id, quantity: item.quantity - 1 })); dispatch(syncCart()); }}
                              className="w-7 h-7 bg-surface hover:bg-accent/20 rounded-lg flex items-center justify-center text-primary transition-colors"
                            >
                              <Minus size={12} />
                            </motion.button>
                            <span className="w-8 text-center font-semibold text-sm">{item.quantity}</span>
                            <motion.button
                              whileTap={{ scale: 0.85 }}
                              onClick={() => { dispatch(updateQuantity({ id: item._id || item.id, quantity: item.quantity + 1 })); dispatch(syncCart()); }}
                              className="w-7 h-7 bg-surface hover:bg-accent/20 rounded-lg flex items-center justify-center text-primary transition-colors"
                            >
                              <Plus size={12} />
                            </motion.button>
                          </div>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                          onClick={() => { dispatch(removeFromCart(item._id || item.id)); dispatch(syncCart()); }}
                          className="self-start p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </motion.button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-5 border-t border-surface bg-white space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="text-xl font-bold text-primary">{formatCurrency(total)}</span>
                </div>
                <p className="text-xs text-gray-400">Taxes and shipping calculated at checkout</p>
                <Link to="/checkout" onClick={() => dispatch(setCartOpen(false))} className="block">
                  <Button variant="primary" className="w-full justify-center text-base py-4">
                    Proceed to Checkout
                  </Button>
                </Link>
                <Link to="/cart" onClick={() => dispatch(setCartOpen(false))} className="block text-center text-sm text-secondary hover:text-primary font-medium transition-colors">
                  View Full Cart
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
