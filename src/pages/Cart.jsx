import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Tag } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { selectCartItems, selectCartTotal, removeFromCart, updateQuantity, clearCart, syncCart } from '../features/cartSlice';
import { formatCurrency } from '../utils/helpers';
import PageWrapper from '../components/layout/PageWrapper';
import Button from '../components/ui/Button';
import { useState } from 'react';

const Cart = () => {
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);
  const [coupon, setCoupon] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const discount = couponApplied ? Math.round(total * 0.1) : 0;

  const handleCoupon = () => {
    if (coupon.toUpperCase() === 'SIDDHI10') {
      setCouponApplied(true);
    } else {
      alert('Invalid coupon code');
    }
  };

  if (items.length === 0) return (
    <PageWrapper>
      <div className="min-h-screen bg-background pt-20 flex items-center justify-center">
        <div className="text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
            <ShoppingBag size={100} className="text-surface mx-auto mb-6" />
          </motion.div>
          <h2 className="text-3xl font-bold text-gray-700 mb-3">Your cart is empty</h2>
          <p className="text-gray-500 mb-8">Add some amazing products to get started!</p>
          <Link to="/products"><Button size="lg">Start Shopping</Button></Link>
        </div>
      </div>
    </PageWrapper>
  );

  return (
    <PageWrapper>
      <div className="min-h-screen bg-background pt-20">
        <div className="page-container py-10">
          <div className="flex items-center gap-4 mb-8">
            <Link to="/products" className="flex items-center gap-2 text-secondary hover:text-primary font-medium transition-colors">
              <ArrowLeft size={18} /> Continue Shopping
            </Link>
            <h1 className="text-3xl font-bold text-primary">Shopping Cart</h1>
            <span className="bg-surface text-secondary px-3 py-1 rounded-full text-sm font-semibold">{items.length} items</span>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Items */}
            <div className="lg:col-span-2 space-y-4">
              <AnimatePresence>
                {items.map(item => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -60, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-2xl p-4 shadow-card flex gap-4"
                  >
                    <Link to={`/products/${item._id || item.id}`}>
                      <img src={item.images?.[0]?.url || item.image} alt={item.name} className="w-24 h-24 object-cover rounded-xl flex-shrink-0" />
                    </Link>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <div>
                          <p className="text-xs text-secondary font-semibold">{item.brand}</p>
                          <Link to={`/products/${item._id || item.id}`}>
                            <h3 className="font-semibold text-gray-800 hover:text-primary transition-colors">{item.name}</h3>
                          </Link>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                          onClick={() => { dispatch(removeFromCart(item._id || item.id)); dispatch(syncCart()); }}
                          className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors h-fit"
                        >
                          <Trash2 size={16} />
                        </motion.button>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-2 bg-surface rounded-xl p-1">
                          <motion.button whileTap={{ scale: 0.85 }}
                            onClick={() => { dispatch(updateQuantity({ id: item._id || item.id, quantity: item.quantity - 1 })); dispatch(syncCart()); }}
                            className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-primary hover:bg-accent/20 transition-colors">
                            <Minus size={14} />
                          </motion.button>
                          <span className="w-8 text-center font-bold">{item.quantity}</span>
                          <motion.button whileTap={{ scale: 0.85 }}
                            onClick={() => { dispatch(updateQuantity({ id: item._id || item.id, quantity: item.quantity + 1 })); dispatch(syncCart()); }}
                            className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-primary hover:bg-accent/20 transition-colors">
                            <Plus size={14} />
                          </motion.button>
                        </div>
                        <span className="font-bold text-primary text-lg">{formatCurrency(item.price * item.quantity)}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={() => { dispatch(clearCart()); dispatch(syncCart()); }}
                className="text-red-400 hover:text-red-600 text-sm font-medium flex items-center gap-2 transition-colors"
              >
                <Trash2 size={15} /> Clear Cart
              </motion.button>
            </div>

            {/* Summary */}
            <div className="space-y-4">
              {/* Coupon */}
              <div className="bg-white rounded-2xl p-5 shadow-card">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2"><Tag size={18} className="text-secondary" /> Coupon Code</h3>
                <div className="flex gap-2">
                  <input
                    value={coupon}
                    onChange={e => setCoupon(e.target.value)}
                    placeholder="Enter code (SIDDHI10)"
                    className="input-field flex-1 py-2.5"
                    disabled={couponApplied}
                  />
                  <Button onClick={handleCoupon} disabled={couponApplied} size="sm">
                    {couponApplied ? '✓ Applied' : 'Apply'}
                  </Button>
                </div>
                {couponApplied && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-green-600 text-sm mt-2 font-medium">
                    🎉 10% discount applied!
                  </motion.p>
                )}
              </div>

              {/* Order Summary */}
              <div className="bg-white rounded-2xl p-5 shadow-card">
                <h3 className="font-bold text-gray-800 mb-4 text-lg">Order Summary</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between"><span className="text-gray-500">Subtotal ({items.length} items)</span><span className="font-medium">{formatCurrency(total)}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Shipping</span><span className="text-green-600 font-medium">Free</span></div>
                  {discount > 0 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-between text-green-600">
                      <span>Coupon Discount</span><span>-{formatCurrency(discount)}</span>
                    </motion.div>
                  )}
                  <div className="border-t border-surface pt-3 flex justify-between">
                    <span className="font-bold text-gray-800 text-base">Total</span>
                    <span className="font-extrabold text-primary text-xl">{formatCurrency(total - discount)}</span>
                  </div>
                </div>
                <Link to="/checkout" className="block mt-5">
                  <Button className="w-full justify-center py-4 text-base">Proceed to Checkout</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Cart;
