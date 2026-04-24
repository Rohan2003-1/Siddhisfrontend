import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { selectCartItems, selectCartTotal, clearCart } from '../features/cartSlice';
import { placeOrder, selectOrdersLoading } from '../features/orderSlice';
import { formatCurrency } from '../utils/helpers';
import { CheckCircle, CreditCard, MapPin, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import PageWrapper from '../components/layout/PageWrapper';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';

const steps = ['Address', 'Payment', 'Review'];

const Checkout = () => {
  const [step, setStep] = useState(0);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [addressData, setAddressData] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('upi');

  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);
  const loading = useSelector(selectOrdersLoading);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onAddressSubmit = (data) => { setAddressData(data); setStep(1); };

  const handlePayment = async () => {
    // Build order payload matching backend schema
    const orderPayload = {
      orderItems: items.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        image: item.images?.[0]?.url || item.image,
        price: item.price,
        product: item._id || item.id,
      })),
      shippingInfo: {
        address: addressData.address,
        city: addressData.city,
        state: addressData.state,
        zipCode: addressData.pincode,
        country: 'India',
        phoneNo: addressData.phone,
      },
      paymentMethod,
      itemsPrice: total,
      taxPrice: Math.round(total * 0.18),
      shippingPrice: total > 500 ? 0 : 50,
      totalPrice: total + Math.round(total * 0.18) + (total > 500 ? 0 : 50),
    };

    const result = await dispatch(placeOrder(orderPayload));

    if (placeOrder.fulfilled.match(result)) {
      const id = result.payload?._id?.slice(-8).toUpperCase() || 'SC' + Date.now().toString(36).toUpperCase();
      setOrderId(id);
      setOrderPlaced(true);
      dispatch(clearCart());
      toast.success('Order placed successfully!');
    } else {
      toast.error(result.payload || 'Failed to place order. Please try again.');
    }
  };

  if (orderPlaced) return (
    <PageWrapper>
      <div className="min-h-screen bg-background pt-20 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="text-center p-10"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-28 h-28 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle size={60} className="text-green-500" />
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="text-4xl font-extrabold text-primary mb-3">Order Placed!</motion.h1>
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="text-gray-500 text-lg mb-2">Thank you for shopping with Siddhis Computers</motion.p>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
            className="text-secondary font-bold text-xl mb-8">Order ID: #{orderId}</motion.p>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => navigate('/')}>Back to Home</Button>
            <Button variant="outline" onClick={() => navigate('/dashboard')}>View Orders</Button>
          </div>
        </motion.div>
      </div>
    </PageWrapper>
  );

  const shakeVariant = { shake: { x: [-10, 10, -10, 10, 0], transition: { duration: 0.4 } } };

  return (
    <PageWrapper>
      <div className="min-h-screen bg-background pt-20">
        <div className="page-container py-10 max-w-5xl">
          <h1 className="text-3xl font-bold text-primary mb-8">Checkout</h1>

          {/* Steps */}
          <div className="flex items-center mb-10">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center">
                <div className={`flex items-center gap-2 ${i <= step ? 'text-primary' : 'text-gray-400'}`}>
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                    i < step ? 'bg-primary text-white' : i === step ? 'bg-secondary text-white shadow-glow' : 'bg-surface text-gray-400'
                  }`}>
                    {i < step ? <CheckCircle size={18} /> : i + 1}
                  </div>
                  <span className="font-semibold text-sm hidden sm:block">{s}</span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-3 transition-colors ${i < step ? 'bg-primary' : 'bg-surface'} w-12 sm:w-24`} />
                )}
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <AnimatePresence mode="wait">
                {/* Step 0: Address */}
                {step === 0 && (
                  <motion.div key="address"
                    initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
                    className="bg-white rounded-2xl p-6 shadow-card"
                  >
                    <h2 className="text-xl font-bold text-gray-800 mb-5 flex items-center gap-2">
                      <MapPin size={20} className="text-secondary" /> Delivery Address
                    </h2>
                    <form onSubmit={handleSubmit(onAddressSubmit)} className="space-y-4">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-1.5 block">Full Name *</label>
                          <motion.div variants={shakeVariant} animate={errors.name ? 'shake' : ''}>
                            <input {...register('name', { required: true })} className={`input-field ${errors.name ? 'border-red-400' : ''}`} placeholder="Your full name" />
                          </motion.div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-1.5 block">Phone *</label>
                          <motion.div variants={shakeVariant} animate={errors.phone ? 'shake' : ''}>
                            <input {...register('phone', { required: true, pattern: /^[0-9]{10}$/ })} className={`input-field ${errors.phone ? 'border-red-400' : ''}`} placeholder="10-digit mobile number" />
                          </motion.div>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1.5 block">Address Line 1 *</label>
                        <motion.div variants={shakeVariant} animate={errors.address ? 'shake' : ''}>
                          <input {...register('address', { required: true })} className={`input-field ${errors.address ? 'border-red-400' : ''}`} placeholder="House/Flat no., Street, Colony" />
                        </motion.div>
                      </div>
                      <div className="grid sm:grid-cols-3 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-1.5 block">City *</label>
                          <input {...register('city', { required: true })} className="input-field" placeholder="City" />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-1.5 block">State *</label>
                          <input {...register('state', { required: true })} className="input-field" placeholder="State" />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-1.5 block">Pincode *</label>
                          <input {...register('pincode', { required: true })} className="input-field" placeholder="Pincode" />
                        </div>
                      </div>
                      <Button type="submit" size="lg" className="w-full justify-center mt-2">Continue to Payment</Button>
                    </form>
                  </motion.div>
                )}

                {/* Step 1: Payment */}
                {step === 1 && (
                  <motion.div key="payment"
                    initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
                    className="bg-white rounded-2xl p-6 shadow-card"
                  >
                    <h2 className="text-xl font-bold text-gray-800 mb-5 flex items-center gap-2">
                      <CreditCard size={20} className="text-secondary" /> Payment Method
                    </h2>
                    <div className="space-y-3 mb-6">
                      {[
                        { id: 'card', label: 'Credit / Debit Card', icon: '💳', desc: 'Visa, Mastercard, RuPay' },
                        { id: 'upi', label: 'UPI', icon: '📱', desc: 'PhonePe, GPay, Paytm' },
                        { id: 'cod', label: 'Cash on Delivery', icon: '💵', desc: 'Pay when you receive' },
                        { id: 'netbanking', label: 'Net Banking', icon: '🏦', desc: 'All major banks' },
                      ].map((m) => (
                        <label key={m.id} className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-colors ${
                          paymentMethod === m.id ? 'border-secondary bg-surface/50' : 'border-surface hover:border-secondary'
                        }`}>
                          <input
                            type="radio"
                            name="payment"
                            value={m.id}
                            checked={paymentMethod === m.id}
                            onChange={() => setPaymentMethod(m.id)}
                            className="accent-secondary"
                          />
                          <span className="text-2xl">{m.icon}</span>
                          <div>
                            <p className="font-semibold text-gray-800">{m.label}</p>
                            <p className="text-xs text-gray-500">{m.desc}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                    <div className="flex gap-3">
                      <Button variant="outline" onClick={() => setStep(0)}>Back</Button>
                      <Button onClick={() => setStep(2)} className="flex-1 justify-center">Review Order</Button>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Review */}
                {step === 2 && (
                  <motion.div key="review"
                    initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
                    className="bg-white rounded-2xl p-6 shadow-card"
                  >
                    <h2 className="text-xl font-bold text-gray-800 mb-5 flex items-center gap-2">
                      <Eye size={20} className="text-secondary" /> Review Order
                    </h2>
                    {addressData && (
                      <div className="p-4 bg-surface/50 rounded-xl mb-5">
                        <p className="font-semibold text-gray-700 mb-1">Delivering to:</p>
                        <p className="text-gray-600 text-sm">{addressData.name} • {addressData.phone}</p>
                        <p className="text-gray-600 text-sm">{addressData.address}, {addressData.city}, {addressData.state} - {addressData.pincode}</p>
                      </div>
                    )}
                    <div className="space-y-2 mb-5">
                      {items.map((item) => (
                        <div key={item._id || item.id} className="flex justify-between text-sm py-2 border-b border-surface">
                          <span className="text-gray-700">{item.name} × {item.quantity}</span>
                          <span className="font-semibold">{formatCurrency(item.price * item.quantity)}</span>
                        </div>
                      ))}
                      <div className="flex justify-between font-bold text-base pt-2">
                        <span className="text-primary">Total</span>
                        <span className="text-primary">{formatCurrency(total)}</span>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                      <Button loading={loading} onClick={handlePayment} className="flex-1 justify-center py-4">
                        Place Order
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Cart Summary Sidebar */}
            <div className="bg-white rounded-2xl p-5 shadow-card h-fit sticky top-24">
              <h3 className="font-bold text-gray-800 mb-4">Order Summary</h3>
              <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                {items.map((item) => (
                  <div key={item._id || item.id} className="flex gap-3">
                    <img src={item.images?.[0]?.url || item.image} alt={item.name} className="w-12 h-12 object-cover rounded-lg flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-700 truncate">{item.name}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      <p className="text-xs font-bold text-primary">{formatCurrency(item.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-surface pt-3 flex justify-between font-bold">
                <span>Total</span>
                <span className="text-primary text-lg">{formatCurrency(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Checkout;
