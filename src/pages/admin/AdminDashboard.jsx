import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatCurrency, getStatusColor, formatDate } from '../../utils/helpers';
import { TrendingUp, ShoppingBag, Package, Calendar, LayoutDashboard, Users, Settings, Menu, X, Plus, Edit2, Trash2, ExternalLink, Upload, Image as ImageIcon, List, User, Lock, Save } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser, updateProfileDetails, updateUserPassword } from '../../features/authSlice';
import { fetchProducts, selectAllProducts, createProduct, updateProduct, deleteProduct, selectProductsLoading } from '../../features/productSlice';
import { fetchAllOrders, selectOrders, selectOrdersLoading, changeOrderStatus } from '../../features/orderSlice';
import { fetchAllBookings, selectBookings, selectBookingsLoading, changeBookingStatus } from '../../features/bookingSlice';
import PageWrapper from '../../components/layout/PageWrapper';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const user = useSelector(selectUser);
  const products = useSelector(selectAllProducts);
  const productsLoading = useSelector(selectProductsLoading);
  const orders = useSelector(selectOrders);
  const ordersLoading = useSelector(selectOrdersLoading);
  const bookings = useSelector(selectBookings);
  const bookingsLoading = useSelector(selectBookingsLoading);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [categories, setCategories] = useState([]);
  
  // Product Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({ 
    name: '', category: '', price: '', originalPrice: '', stock: '', description: '', image: '', brand: '', badge: '' 
  });

  // Category State
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryForm, setCategoryForm] = useState({ name: '', description: '', icon: '📦', image: '' });

  // Settings State
  const [profileForm, setProfileForm] = useState({ name: user?.name || '', email: user?.email || '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    dispatch(fetchProducts());
    dispatch(fetchAllOrders());
    dispatch(fetchAllBookings());
    loadCategories();
  }, [dispatch, user, navigate]);

  const loadCategories = async () => {
    try {
      const { data } = await api.get('/categories');
      setCategories(data.data || []);
      if (data.data?.length > 0) {
        setProductForm(prev => ({ ...prev, category: data.data[0]._id }));
      }
    } catch (err) {
      toast.error('Failed to load categories');
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      const payload = { 
        name: categoryForm.name, 
        description: categoryForm.description || `All products under ${categoryForm.name} category`,
        icon: categoryForm.icon,
        image: categoryForm.image
      };

      if (editingCategory) {
        await api.put(`/categories/${editingCategory._id}`, payload);
        toast.success('Category updated!');
      } else {
        await api.post('/categories', payload);
        toast.success('Category added!');
      }

      setCategoryForm({ name: '', description: '', icon: '📦', image: '' });
      setEditingCategory(null);
      setIsCategoryModalOpen(false);
      loadCategories();
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to process category';
      toast.error(errorMsg);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Image too large (max 2MB)');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductForm({ ...productForm, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    if (!productForm.category) {
      toast.error('Please select or add a category first');
      return;
    }
    if (!productForm.image) {
      toast.error('Please upload or provide an image URL');
      return;
    }

    try {
      const result = editingProduct 
        ? await dispatch(updateProduct({ id: editingProduct._id, data: productForm })).unwrap()
        : await dispatch(createProduct(productForm)).unwrap();
      
      toast.success(`Product ${editingProduct ? 'updated' : 'created'}!`);
      setIsProductModalOpen(false);
      setEditingProduct(null);
      setProductForm({ name: '', category: categories[0]?._id || '', price: '', originalPrice: '', stock: '', description: '', image: '', brand: '', badge: '' });
    } catch (err) {
      toast.error(err || 'Operation failed');
    }
  };

  const handleStatusChange = (orderId, status) => {
    dispatch(changeOrderStatus({ id: orderId, status }));
    toast.success(`Order status updated to ${status}`);
  };

  const handleBookingStatus = (bookingId, status) => {
    dispatch(changeBookingStatus({ id: bookingId, status }));
    toast.success(`Booking status updated to ${status}`);
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateProfileDetails(profileForm)).unwrap();
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err || 'Update failed');
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      await dispatch(updateUserPassword({ currentPassword: passwordForm.currentPassword, newPassword: passwordForm.newPassword })).unwrap();
      toast.success('Password changed successfully!');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err || 'Password update failed');
    }
  };

  const stats = [
    { label: 'Total Revenue', value: formatCurrency(orders.reduce((sum, o) => sum + o.totalPrice, 0)), icon: TrendingUp, color: 'text-green-600 bg-green-50' },
    { label: 'Total Orders', value: orders.length, icon: ShoppingBag, color: 'text-blue-600 bg-blue-50' },
    { label: 'Active Products', value: products.length, icon: Package, color: 'text-purple-600 bg-purple-50' },
    { label: 'Service Bookings', value: bookings.length, icon: Calendar, color: 'text-orange-600 bg-orange-50' },
  ];

  const menuItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'categories', label: 'Categories', icon: List },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'bookings', label: 'Bookings', icon: Calendar },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  if (!user || user.role !== 'admin') return null;

  return (
    <PageWrapper>
      <div className="min-h-screen bg-gray-50 flex">
        {/* Desktop Sidebar */}
        <aside className={`fixed inset-y-0 left-0 bg-primary w-64 transform transition-transform duration-300 z-50 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:static`}>
          <div className="h-full flex flex-col">
            <div className="p-8 border-b border-white/10">
              <Link to="/" className="flex items-center gap-2">
                <span className="text-white font-black text-xl tracking-tight">Siddhis<span className="text-accent">Admin</span></span>
              </Link>
            </div>
            
            <nav className="flex-1 p-4 space-y-1">
              {menuItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => { setActiveMenu(item.id); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                    activeMenu === item.id ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <item.icon size={18} className={activeMenu === item.id ? 'text-accent' : ''} />
                  {item.label}
                </button>
              ))}
            </nav>

            <div className="p-6 border-t border-white/10">
              <Link to="/" className="flex items-center gap-2 text-white/50 hover:text-white text-sm font-bold transition-colors">
                <ExternalLink size={16} />
                Visit Website
              </Link>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 min-w-0 flex flex-col">
          <header className="bg-white border-b border-gray-100 h-16 flex items-center justify-between px-6 sticky top-0 z-40">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-gray-500 hover:bg-gray-50 rounded-lg">
              <Menu size={20} />
            </button>
            <h2 className="text-lg font-black text-gray-800 capitalize">{activeMenu}</h2>
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-black text-gray-800">{user.name}</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase">Administrator</p>
              </div>
              <div className="w-9 h-9 bg-surface text-secondary rounded-xl flex items-center justify-center font-black">
                {user.name[0].toUpperCase()}
              </div>
            </div>
          </header>

          <main className="p-8 flex-1 overflow-auto">
            <AnimatePresence mode="wait">
              {/* ── Overview ────────────────────────────────────────── */}
              {activeMenu === 'dashboard' && (
                <motion.div key="dash" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map((s, i) => (
                      <div key={s.label} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${s.color}`}>
                          <s.icon size={24} />
                        </div>
                        <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">{s.label}</p>
                        <h3 className="text-2xl font-black text-gray-800">{s.value}</h3>
                      </div>
                    ))}
                  </div>

                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                      <h3 className="font-black text-gray-800">Recent Orders</h3>
                      <button onClick={() => setActiveMenu('orders')} className="text-secondary text-sm font-bold hover:underline">View All</button>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-widest">
                            <th className="px-6 py-4 text-left">Order ID</th>
                            <th className="px-6 py-4 text-left">User</th>
                            <th className="px-6 py-4 text-left">Amount</th>
                            <th className="px-6 py-4 text-left">Status</th>
                            <th className="px-6 py-4 text-left">Date</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {orders.slice(0, 5).map(o => (
                            <tr key={o._id} className="hover:bg-gray-50/50 transition-colors">
                              <td className="px-6 py-4 font-bold text-gray-800">#{o._id.slice(-6).toUpperCase()}</td>
                              <td className="px-6 py-4 font-medium text-gray-600">{o.user?.name || 'Customer'}</td>
                              <td className="px-6 py-4 font-black text-gray-800">{formatCurrency(o.totalPrice)}</td>
                              <td className="px-6 py-4">
                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${getStatusColor(o.orderStatus)}`}>
                                  {o.orderStatus}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-gray-400 font-medium">{formatDate(o.createdAt)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ── Products ────────────────────────────────────────── */}
              {activeMenu === 'products' && (
                <motion.div key="prod" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-black text-gray-800 text-xl">Product Management</h3>
                    <Button onClick={() => { setEditingProduct(null); setProductForm({ name: '', category: categories[0]?._id || '', price: '', originalPrice: '', stock: '', description: '', image: '', brand: '', badge: '' }); setIsProductModalOpen(true); }} icon={<Plus size={18} />}>
                      Add Product
                    </Button>
                  </div>
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-widest text-left">
                        <tr>
                          <th className="px-6 py-4">Product</th>
                          <th className="px-6 py-4">Category</th>
                          <th className="px-6 py-4">Price</th>
                          <th className="px-6 py-4">Stock</th>
                          <th className="px-6 py-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {products.map(p => (
                          <tr key={p._id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <img src={p.images?.[0]?.url || p.image} className="w-10 h-10 rounded-lg object-cover bg-gray-100" />
                                <span className="font-bold text-gray-800">{p.name}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-gray-600 font-medium">{p.category?.name || 'General'}</td>
                            <td className="px-6 py-4 font-black text-gray-800">{formatCurrency(p.price)}</td>
                            <td className="px-6 py-4">
                              <span className={`font-bold ${p.stock < 5 ? 'text-red-500' : 'text-gray-600'}`}>{p.stock}</span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex gap-2">
                                <button onClick={() => { 
                                  setEditingProduct(p); 
                                  setProductForm({ 
                                    name: p.name, 
                                    category: p.category?._id || p.category, 
                                    price: p.price, 
                                    originalPrice: p.originalPrice || '',
                                    stock: p.stock, 
                                    description: p.description, 
                                    image: p.images?.[0]?.url || p.image,
                                    brand: p.brand || '',
                                    badge: p.badge || ''
                                  }); 
                                  setIsProductModalOpen(true); 
                                }} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"><Edit2 size={16} /></button>
                                <button onClick={() => { if(window.confirm('Delete product?')) dispatch(deleteProduct(p._id)); }} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}

              {/* ── Categories ──────────────────────────────────────── */}
              {activeMenu === 'categories' && (
                <motion.div key="cats" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-black text-gray-800 text-xl">Category Management</h3>
                    <Button onClick={() => { setEditingCategory(null); setCategoryForm({ name: '', description: '', icon: '📦', image: '' }); setIsCategoryModalOpen(true); }} icon={<Plus size={18} />}>Add Category</Button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map(c => (
                      <div key={c._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between group">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl w-10 h-10 bg-surface rounded-xl flex items-center justify-center">
                            {c.icon || '📦'}
                          </div>
                          <div>
                            <p className="font-black text-gray-800">{c.name}</p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">ID: {c._id.slice(-6)}</p>
                          </div>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => { setEditingCategory(c); setCategoryForm({ name: c.name, description: c.description, icon: c.icon || '📦', image: c.image || '' }); setIsCategoryModalOpen(true); }} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg">
                            <Edit2 size={16} />
                          </button>
                          <button onClick={() => { if(window.confirm('Delete category?')) api.delete(`/categories/${c._id}`).then(() => loadCategories()); }} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* ── Orders ─────────────────────────────────────────── */}
              {activeMenu === 'orders' && (
                <motion.div key="orders" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <h3 className="font-black text-gray-800 text-xl mb-6">Store Orders</h3>
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-widest text-left">
                        <tr>
                          <th className="px-6 py-4">Order ID</th>
                          <th className="px-6 py-4">Customer</th>
                          <th className="px-6 py-4">Items</th>
                          <th className="px-6 py-4">Total</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4">Update</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {orders.map(o => (
                          <tr key={o._id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-6 py-4 font-bold text-gray-800">#{o._id.slice(-6).toUpperCase()}</td>
                            <td className="px-6 py-4 font-medium text-gray-600">{o.user?.name || 'Customer'}</td>
                            <td className="px-6 py-4 text-gray-500">{o.orderItems?.length || 1}</td>
                            <td className="px-6 py-4 font-black text-gray-800">{formatCurrency(o.totalPrice)}</td>
                            <td className="px-6 py-4">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${getStatusColor(o.orderStatus)}`}>
                                {o.orderStatus}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <select 
                                value={o.orderStatus}
                                onChange={(e) => handleStatusChange(o._id, e.target.value)}
                                className="text-xs font-bold bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 focus:outline-none"
                              >
                                <option>Processing</option>
                                <option>Shipped</option>
                                <option>Delivered</option>
                                <option>Cancelled</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}

              {/* ── Bookings ───────────────────────────────────────── */}
              {activeMenu === 'bookings' && (
                <motion.div key="book" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <h3 className="font-black text-gray-800 text-xl mb-6">Service Bookings</h3>
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-widest">
                        <tr>
                          <th className="px-6 py-4">ID</th>
                          <th className="px-6 py-4">Service</th>
                          <th className="px-6 py-4">Customer</th>
                          <th className="px-6 py-4">Schedule</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {bookings.map(b => (
                          <tr key={b._id}>
                            <td className="px-6 py-4 font-bold text-gray-800">#{b._id.slice(-6).toUpperCase()}</td>
                            <td className="px-6 py-4 font-bold text-secondary">{b.serviceType}</td>
                            <td className="px-6 py-4 font-medium text-gray-600">{b.user?.name || 'Guest'}</td>
                            <td className="px-6 py-4 text-xs font-bold text-gray-400">{formatDate(b.appointmentDate)} @ {b.timeSlot}</td>
                            <td className="px-6 py-4">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${getStatusColor(b.status)}`}>
                                {b.status}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <select 
                                value={b.status}
                                onChange={(e) => handleBookingStatus(b._id, e.target.value)}
                                className="text-xs font-bold bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 focus:outline-none"
                              >
                                <option>Pending</option>
                                <option>Approved</option>
                                <option>Completed</option>
                                <option>Rejected</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}

              {/* ── Settings ────────────────────────────────────────── */}
              {activeMenu === 'settings' && (
                <motion.div key="settings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <h3 className="font-black text-gray-800 text-xl mb-6">Admin Settings</h3>
                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Profile Section */}
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                      <div className="flex items-center gap-3 mb-6">
                        <User className="text-secondary" />
                        <h4 className="font-black text-gray-800">Profile Information</h4>
                      </div>
                      <form onSubmit={handleProfileUpdate} className="space-y-4">
                        <div>
                          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 block">Full Name</label>
                          <input className="input-field" value={profileForm.name} onChange={e => setProfileForm({...profileForm, name: e.target.value})} />
                        </div>
                        <div>
                          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 block">Email Address</label>
                          <input className="input-field" value={profileForm.email} onChange={e => setProfileForm({...profileForm, email: e.target.value})} />
                        </div>
                        <Button type="submit" icon={<Save size={18} />}>Update Profile</Button>
                      </form>
                    </div>

                    {/* Password Section */}
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                      <div className="flex items-center gap-3 mb-6">
                        <Lock className="text-secondary" />
                        <h4 className="font-black text-gray-800">Security / Password</h4>
                      </div>
                      <form onSubmit={handlePasswordUpdate} className="space-y-4">
                        <div>
                          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 block">Current Password</label>
                          <input className="input-field" type="password" value={passwordForm.currentPassword} onChange={e => setPasswordForm({...passwordForm, currentPassword: e.target.value})} />
                        </div>
                        <div>
                          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 block">New Password</label>
                          <input className="input-field" type="password" value={passwordForm.newPassword} onChange={e => setPasswordForm({...passwordForm, newPassword: e.target.value})} />
                        </div>
                        <div>
                          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 block">Confirm New Password</label>
                          <input className="input-field" type="password" value={passwordForm.confirmPassword} onChange={e => setPasswordForm({...passwordForm, confirmPassword: e.target.value})} />
                        </div>
                        <Button type="submit" variant="secondary" icon={<Lock size={18} />}>Change Password</Button>
                      </form>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>

      {/* Product Modal */}
      <Modal isOpen={isProductModalOpen} onClose={() => setIsProductModalOpen(false)} title={editingProduct ? 'Edit Product' : 'Add Product'}>
        <form onSubmit={handleProductSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Product Name</label>
            <input className="input-field" placeholder="e.g. Gaming Laptop X1" value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Brand Name *</label>
              <input className="input-field" placeholder="e.g. Dell" value={productForm.brand} onChange={e => setProductForm({...productForm, brand: e.target.value})} required />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Category *</label>
              {categories.length > 0 ? (
                <select className="input-field" value={productForm.category} onChange={e => setProductForm({...productForm, category: e.target.value})} required>
                  {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              ) : (
                <div className="p-2 bg-red-50 rounded-lg text-[10px] font-bold text-red-500 uppercase">No Categories</div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Sale Price *</label>
              <input type="number" className="input-field" placeholder="0.00" value={productForm.price} onChange={e => setProductForm({...productForm, price: e.target.value})} required />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Original Price</label>
              <input type="number" className="input-field" placeholder="0.00" value={productForm.originalPrice} onChange={e => setProductForm({...productForm, originalPrice: e.target.value})} />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Stock *</label>
              <input type="number" className="input-field" placeholder="0" value={productForm.stock} onChange={e => setProductForm({...productForm, stock: e.target.value})} required />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Product Badge (Optional)</label>
            <input className="input-field" placeholder="e.g. New, Limited, Hot" value={productForm.badge} onChange={e => setProductForm({...productForm, badge: e.target.value})} />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Description</label>
            <textarea className="input-field h-20" placeholder="Product details..." value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})} required />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Product Image</label>
            <div className="flex gap-4 items-start">
              <div className="flex-1">
                <input 
                  type="text" 
                  className="input-field text-xs mb-2" 
                  placeholder="Paste Image URL or Upload below" 
                  value={productForm.image} 
                  onChange={e => setProductForm({...productForm, image: e.target.value})} 
                />
                <div className="relative">
                  <input 
                    type="file" 
                    id="product-image-upload" 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleImageUpload} 
                  />
                  <label 
                    htmlFor="product-image-upload" 
                    className="flex items-center justify-center gap-2 w-full py-2.5 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:bg-gray-100 hover:border-secondary transition-all text-xs font-bold text-gray-500"
                  >
                    <Upload size={14} />
                    Upload from Laptop
                  </label>
                </div>
              </div>
              <div className="w-24 h-24 bg-gray-50 rounded-xl border-2 border-gray-100 flex items-center justify-center overflow-hidden shrink-0">
                {productForm.image ? (
                  <img src={productForm.image} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon size={24} className="text-gray-200" />
                )}
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full mt-4" icon={<Plus size={18} />}>
            {editingProduct ? 'Update Product' : 'Create Product'}
          </Button>
        </form>
      </Modal>

      {/* Category Modal */}
      <Modal isOpen={isCategoryModalOpen} onClose={() => { setIsCategoryModalOpen(false); setEditingCategory(null); setCategoryForm({ name: '', description: '', icon: '📦', image: '' }); }} title={editingCategory ? 'Edit Category' : 'Add New Category'}>
        <form onSubmit={handleAddCategory} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Category Name</label>
            <input className="input-field" placeholder="e.g. Storage" value={categoryForm.name} onChange={e => setCategoryForm({ ...categoryForm, name: e.target.value })} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Icon (Emoji)</label>
              <input className="input-field" placeholder="e.g. 💻" value={categoryForm.icon} onChange={e => setCategoryForm({ ...categoryForm, icon: e.target.value })} />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Image URL (Optional)</label>
              <input className="input-field" placeholder="https://..." value={categoryForm.image} onChange={e => setCategoryForm({ ...categoryForm, image: e.target.value })} />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Description</label>
            <textarea className="input-field h-20" placeholder="Category description..." value={categoryForm.description} onChange={e => setCategoryForm({ ...categoryForm, description: e.target.value })} />
          </div>
          <Button type="submit" className="w-full">{editingCategory ? 'Update Category' : 'Create Category'}</Button>
        </form>
      </Modal>
    </PageWrapper>
  );
};

export default AdminDashboard;
