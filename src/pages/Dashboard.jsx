import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser, logoutUser } from '../features/authSlice';
import { fetchMyOrders, selectOrders, selectOrdersLoading } from '../features/orderSlice';
import { fetchMyBookings, selectBookings, selectBookingsLoading } from '../features/bookingSlice';
import { formatCurrency, formatDate, getStatusColor } from '../utils/helpers';
import { Package, Calendar, User, LogOut, Edit3, Save, X, Loader2, ChevronRight, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../components/layout/PageWrapper';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';

const tabs = [
  { id: 'orders', label: 'My Orders', icon: ShoppingBag },
  { id: 'bookings', label: 'My Bookings', icon: Calendar },
  { id: 'profile', label: 'Account Settings', icon: User },
];

const Dashboard = () => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('orders');
  const [editing, setEditing] = useState(false);
  const [profileData, setProfileData] = useState({ name: user?.name || '', phone: user?.phone || '' });

  const orders = useSelector(selectOrders);
  const ordersLoading = useSelector(selectOrdersLoading);
  const bookings = useSelector(selectBookings);
  const bookingsLoading = useSelector(selectBookingsLoading);

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  // Load data when tabs are selected
  useEffect(() => {
    if (activeTab === 'orders') dispatch(fetchMyOrders());
    if (activeTab === 'bookings') dispatch(fetchMyBookings());
  }, [activeTab, dispatch]);

  const handleSaveProfile = () => {
    // Note: This only updates local state for now as backend endpoint doesn't exist
    toast.success('Profile updated locally! (Persistence coming soon)');
    setEditing(false);
  };

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/');
    toast.success('Logged out successfully');
  };

  if (!user) return null;

  return (
    <PageWrapper>
      <div className="min-h-screen bg-gray-50 pt-24 pb-12">
        <div className="page-container">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-20 h-20 bg-surface text-secondary rounded-2xl flex items-center justify-center text-3xl font-black shadow-inner">
                {user.name?.[0]?.toUpperCase()}
              </div>
              <div className="text-center md:text-left flex-1">
                <h1 className="text-3xl font-black text-gray-800 tracking-tight">Welcome, {user.name.split(' ')[0]}!</h1>
                <p className="text-gray-500 font-medium">{user.email} · Customer since {new Date().getFullYear()}</p>
              </div>
              <div className="flex gap-3">
                <Button variant="ghost" className="text-red-500 hover:bg-red-50" onClick={handleLogout} icon={<LogOut size={18} />}>
                  Sign Out
                </Button>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <aside className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
                <div className="p-4 bg-gray-50/50 border-b border-gray-100">
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Manage Account</p>
                </div>
                {tabs.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id)}
                    className={`w-full flex items-center justify-between px-5 py-4 text-sm font-bold transition-all ${
                      activeTab === t.id 
                        ? 'bg-secondary/5 text-secondary border-r-4 border-secondary' 
                        : 'text-gray-600 hover:bg-gray-50 border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <t.icon size={18} className={activeTab === t.id ? 'text-secondary' : 'text-gray-400'} />
                      {t.label}
                    </div>
                    {activeTab === t.id && <ChevronRight size={14} />}
                  </button>
                ))}
              </div>
            </aside>

            {/* Content Area */}
            <main className="lg:col-span-3">
              <AnimatePresence mode="wait">
                {/* ── Orders Tab ──────────────────────────────────────── */}
                {activeTab === 'orders' && (
                  <motion.div key="orders" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold text-gray-800">My Orders</h2>
                      <span className="text-xs font-bold text-gray-400 uppercase bg-gray-100 px-3 py-1 rounded-full">{orders.length} Total</span>
                    </div>

                    {ordersLoading ? (
                      <div className="bg-white rounded-2xl p-20 shadow-sm border border-gray-100 flex justify-center"><Loader2 size={32} className="animate-spin text-secondary" /></div>
                    ) : orders.length === 0 ? (
                      <div className="bg-white rounded-2xl p-16 shadow-sm border border-gray-100 text-center">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                          <ShoppingBag size={28} className="text-gray-300" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-800">No orders found</h3>
                        <p className="text-gray-500 text-sm mt-1 mb-6">Looks like you haven't placed any orders yet.</p>
                        <Button onClick={() => navigate('/products')}>Start Shopping</Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {orders.map((order) => (
                          <motion.div key={order._id} whileHover={{ y: -2 }} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                              <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-gray-50 rounded-xl overflow-hidden flex items-center justify-center border border-gray-100">
                                  {order.orderItems?.[0]?.image ? (
                                    <img src={order.orderItems[0].image} alt="Product" className="w-full h-full object-cover" />
                                  ) : (
                                    <Package size={24} className="text-secondary" />
                                  )}
                                </div>
                                <div>
                                  <p className="font-bold text-gray-800 truncate max-w-[180px] sm:max-w-[250px]">
                                    {order.orderItems?.[0]?.name || 'Computer Order'}
                                  </p>
                                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                    ID: {order._id.slice(-8).toUpperCase()} · {formatDate(order.createdAt)}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3 self-end sm:self-center">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusColor(order.orderStatus)}`}>
                                  {order.orderStatus}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                              <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">{order.orderItems?.length || 1} Item(s)</span>
                              <span className="text-lg font-black text-secondary">{formatCurrency(order.totalPrice)}</span>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}

                {/* ── Bookings Tab ─────────────────────────────────────── */}
                {activeTab === 'bookings' && (
                  <motion.div key="bookings" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold text-gray-800">My Bookings</h2>
                      <span className="text-xs font-bold text-gray-400 uppercase bg-gray-100 px-3 py-1 rounded-full">{bookings.length} Total</span>
                    </div>

                    {bookingsLoading ? (
                      <div className="bg-white rounded-2xl p-20 shadow-sm border border-gray-100 flex justify-center"><Loader2 size={32} className="animate-spin text-secondary" /></div>
                    ) : bookings.length === 0 ? (
                      <div className="bg-white rounded-2xl p-16 shadow-sm border border-gray-100 text-center">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Calendar size={28} className="text-gray-300" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-800">No bookings yet</h3>
                        <p className="text-gray-500 text-sm mt-1 mb-6">Book a service appointment for your computer.</p>
                        <Button onClick={() => navigate('/booking')}>Book a Service</Button>
                      </div>
                    ) : (
                      <div className="grid md:grid-cols-2 gap-4">
                        {bookings.map((b) => (
                          <motion.div key={b._id} whileHover={{ y: -2 }} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between mb-4">
                              <div className="p-2.5 bg-secondary/10 text-secondary rounded-xl">
                                <Calendar size={20} />
                              </div>
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusColor(b.status)}`}>
                                {b.status}
                              </span>
                            </div>
                            <h4 className="font-bold text-gray-800 mb-1">{b.service}</h4>
                            <p className="text-xs text-gray-400 font-bold uppercase mb-4 tracking-tighter">ID: {b._id.slice(-8).toUpperCase()}</p>
                            
                            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-50 text-[11px] font-bold uppercase tracking-tighter">
                              <div>
                                <p className="text-gray-400 mb-0.5">Date & Time</p>
                                <p className="text-gray-700">{formatDate(b.date)} @ {b.time}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-gray-400 mb-0.5">Technician</p>
                                <p className="text-secondary">{b.technician || 'Pending'}</p>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                        <div className="md:col-span-2 mt-2">
                          <Button variant="outline" className="w-full justify-center" onClick={() => navigate('/booking')}>Book New Service</Button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* ── Profile Tab ──────────────────────────────────────── */}
                {activeTab === 'profile' && (
                  <motion.div key="profile" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold text-gray-800">Account Settings</h2>
                      {!editing
                        ? <Button variant="outline" size="sm" icon={<Edit3 size={16} />} onClick={() => setEditing(true)}>Edit Profile</Button>
                        : <div className="flex gap-2">
                            <Button size="sm" icon={<Save size={16} />} onClick={handleSaveProfile}>Save</Button>
                            <Button size="sm" variant="ghost" icon={<X size={16} />} onClick={() => setEditing(false)}>Cancel</Button>
                          </div>
                      }
                    </div>
                    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 space-y-6">
                      {[
                        { label: 'Full Name', key: 'name', value: user.name, editable: true },
                        { label: 'Email Address', key: 'email', value: user.email, editable: false },
                        { label: 'Phone Number', key: 'phone', value: user.phone || 'Add phone number', editable: true },
                        { label: 'Account Type', key: 'role', value: user.role?.toUpperCase(), editable: false },
                      ].map((field) => (
                        <div key={field.key} className="grid sm:grid-cols-3 gap-2 sm:items-center">
                          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">{field.label}</label>
                          <div className="sm:col-span-2">
                            {editing && field.editable ? (
                              <input
                                value={profileData[field.key]}
                                onChange={(e) => setProfileData((d) => ({ ...d, [field.key]: e.target.value }))}
                                className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-2.5 text-sm font-semibold focus:border-secondary focus:bg-white focus:outline-none transition-all"
                              />
                            ) : (
                              <p className="font-bold text-gray-700">{field.value || '—'}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </main>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Dashboard;
