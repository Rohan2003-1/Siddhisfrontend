import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Truck, Headphones, Star, ChevronRight, Zap } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts, selectAllProducts } from '../features/productSlice';
import { fetchCategories, selectAllCategories } from '../features/categorySlice';
import { mockTestimonials } from '../data/mockData';
import ProductCard from '../components/product/ProductCard';
import PageWrapper from '../components/layout/PageWrapper';
import Button from '../components/ui/Button';
import { formatCurrency } from '../utils/helpers';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

const Home = () => {
  const dispatch = useDispatch();
  const products = useSelector(selectAllProducts) || [];
  const categories = useSelector(selectAllCategories) || [];

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

  const featured = products.slice(0, 4);
  const topRated = [...products].sort((a, b) => (b.ratings || 0) - (a.ratings || 0)).slice(0, 4);
  const heroProduct = products[0]; // Use the first product for the hero section instead of index 4

  return (
    <PageWrapper>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-hero">
        {/* Animated background orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="absolute -top-40 -right-40 w-96 h-96 bg-accent/10 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ scale: [1.2, 1, 1.2], rotate: [360, 180, 0] }}
            transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
            className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/5 rounded-full blur-3xl"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary/40" />
        </div>

        <div className="relative page-container py-20 pt-36 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Text */}
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="visible"
              className="text-white"
            >
              <motion.div variants={fadeUp} className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-accent mb-6 border border-white/20">
                <Zap size={14} className="fill-accent" />
                🎉 New Arrivals — Up to 30% Off!
              </motion.div>

              <motion.h1 variants={fadeUp} className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6">
                Your Trusted
                <span className="block text-accent">Tech Partner</span>
              </motion.h1>

              <motion.p variants={fadeUp} className="text-lg text-white/80 leading-relaxed mb-8 max-w-lg">
                Premium computers, accessories, and expert repair services — all under one roof. Experience the best in technology at Siddhis Computers.
              </motion.p>

              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4">
                <Link to="/products">
                  <Button size="lg" className="bg-accent text-primary hover:bg-white hover:text-primary font-bold shadow-glow">
                    Shop Now <ArrowRight size={18} />
                  </Button>
                </Link>
                <Link to="/booking">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                    Book Service
                  </Button>
                </Link>
              </motion.div>

              {/* Quick stats */}
              <motion.div variants={fadeUp} className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-white/10">
                {[
                  { value: '10K+', label: 'Happy Customers' },
                  { value: '500+', label: 'Products' },
                  { value: '24/7', label: 'Support' },
                ].map(stat => (
                  <div key={stat.label}>
                    <div className="text-2xl font-bold text-accent">{stat.value}</div>
                    <div className="text-white/60 text-sm">{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right - Featured product card */}
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="hidden lg:flex justify-end"
            >
              {heroProduct && (
                <div className="relative">
                  <motion.div
                    animate={{ y: [-10, 10, -10] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    className="glass rounded-3xl p-6 max-w-sm border border-white/20"
                  >
                    <img
                      src={heroProduct.images?.[0]?.url || heroProduct.image}
                      alt="Featured"
                      className="w-full h-52 object-cover rounded-2xl mb-4"
                    />
                    <h3 className="text-white font-bold text-lg">{heroProduct.name}</h3>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-accent text-xl font-extrabold">{formatCurrency(heroProduct.price)}</span>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map(s => (
                          <Star key={s} size={14} className={s <= Math.round(heroProduct.ratings || 5) ? "fill-yellow-400 text-yellow-400" : "text-gray-400"} />
                        ))}
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="w-full bg-white/20 rounded-full h-1.5">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: '72%' }}
                          transition={{ delay: 1, duration: 1.5 }}
                          className="bg-accent h-1.5 rounded-full"
                        />
                      </div>
                      <p className="text-white/60 text-xs mt-1.5">{heroProduct.stock > 0 ? `Only ${heroProduct.stock} left!` : 'Out of stock'}</p>
                    </div>
                  </motion.div>
                  {/* Floating badges */}
                  <motion.div
                    animate={{ y: [-5, 5, -5] }}
                    transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                    className="absolute -top-4 -left-4 glass rounded-2xl px-4 py-2 border border-white/20"
                  >
                    <p className="text-accent text-xs font-bold">🔥 Trending</p>
                  </motion.div>
                  <motion.div
                    animate={{ y: [5, -5, 5] }}
                    transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                    className="absolute -bottom-4 -right-4 glass rounded-2xl px-4 py-2 border border-white/20"
                  >
                    <p className="text-white text-xs font-bold">✅ Verified Store</p>
                  </motion.div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="bg-white border-y border-surface">
        <div className="page-container py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Truck, label: 'Free Delivery', sub: 'On orders above ₹2,000' },
              { icon: Shield, label: 'Genuine Products', sub: '100% authentic guarantee' },
              { icon: Headphones, label: '24/7 Support', sub: 'Expert assistance always' },
              { icon: Star, label: 'Top Rated Store', sub: '4.8★ on Google Reviews' },
            ].map(({ icon: Icon, label, sub }) => (
              <motion.div
                key={label}
                whileHover={{ y: -3 }}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface transition-colors"
              >
                <div className="p-2.5 bg-surface rounded-xl"><Icon size={22} className="text-secondary" /></div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{label}</p>
                  <p className="text-xs text-gray-500">{sub}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-background">
        <div className="page-container">
          <motion.div
            variants={stagger} initial="hidden"
            whileInView="visible" viewport={{ once: true }}
            className="text-center mb-12"
          >
            <motion.h2 variants={fadeUp} className="section-heading">Shop by Category</motion.h2>
            <motion.p variants={fadeUp} className="section-subheading">Explore our wide range of product categories</motion.p>
          </motion.div>

          <motion.div
            variants={stagger} initial="hidden"
            whileInView="visible" viewport={{ once: true }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4"
          >
            {categories.map(cat => (
              <motion.div key={cat._id} variants={fadeUp}>
                <Link
                  to={`/products?category=${cat.name}`}
                  className="block group"
                >
                  <motion.div
                    whileHover={{ y: -6, scale: 1.03 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    className="bg-white rounded-2xl p-5 text-center shadow-card hover:shadow-cardHover transition-shadow"
                  >
                    <div className="text-4xl mb-3">{cat.icon || '📦'}</div>
                    <p className="font-semibold text-gray-800 text-sm group-hover:text-primary transition-colors">{cat.name}</p>
                    <p className="text-xs text-gray-400 mt-1">{cat.productCount || 0} items</p>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-surface/40">
        <div className="page-container">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="section-heading">Featured Products</h2>
              <p className="section-subheading">Hand-picked top sellers for you</p>
            </div>
            <Link to="/products">
              <Button variant="outline" icon={<ChevronRight size={16} />}>View All</Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        </div>
      </section>

      {/* Banner CTA */}
      <section className="py-20 bg-hero relative overflow-hidden">
        <div className="absolute inset-0">
          <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 8, repeat: Infinity }} className="absolute top-10 right-20 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
        </div>
        <div className="relative page-container text-center text-white">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-extrabold mb-4"
          >
            Need a Repair? <span className="text-accent">We Got You.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="text-white/80 text-lg mb-8 max-w-xl mx-auto"
          >
            Our certified technicians handle everything from laptop repairs to complete PC assemblies. Book a slot in minutes.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
            <Link to="/booking">
              <Button size="lg" className="bg-accent text-primary hover:bg-white font-bold shadow-glow">
                Book an Appointment <ArrowRight size={18} />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Top Rated */}
      <section className="py-20 bg-background">
        <div className="page-container">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="section-heading">Top Rated</h2>
              <p className="section-subheading">Loved by thousands of customers</p>
            </div>
            <Link to="/products"><Button variant="outline">View All</Button></Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {topRated.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-surface/40">
        <div className="page-container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-12">
            <motion.h2 variants={fadeUp} className="section-heading">What Customers Say</motion.h2>
            <motion.p variants={fadeUp} className="section-subheading">Real reviews from our valued customers</motion.p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mockTestimonials.map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl p-6 shadow-card"
              >
                <div className="flex mb-3">
                  {[1,2,3,4,5].map(s => <Star key={s} size={16} className={s <= t.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'} />)}
                </div>
                <p className="text-gray-600 leading-relaxed mb-5 text-sm">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold">{t.avatar}</div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </PageWrapper>
  );
};

export default Home;
