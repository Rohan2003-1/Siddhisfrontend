import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, ArrowLeft, Star, Shield, Truck, Package, Plus, Minus, Heart, Share2, Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { selectAllProducts } from '../features/productSlice';
import { addToCart } from '../features/cartSlice';
import { fetchProductByIdAPI } from '../services/productService';

import { formatCurrency, getDiscount } from '../utils/helpers';
import PageWrapper from '../components/layout/PageWrapper';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import StarRating from '../components/ui/StarRating';
import ProductCard from '../components/product/ProductCard';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const products = useSelector(selectAllProducts);
  // Support both MongoDB _id string and old numeric id
  const storeProduct = products.find((p) => p._id === id || String(p.id) === id);

  const [product, setProduct] = useState(storeProduct || null);
  const [fetchLoading, setFetchLoading] = useState(!storeProduct);

  // If not in store, fetch directly from backend
  useEffect(() => {
    if (!storeProduct) {
      setFetchLoading(true);
      fetchProductByIdAPI(id)
        .then(({ data }) => { setProduct(data.data); })
        .catch(() => { setProduct(null); })
        .finally(() => setFetchLoading(false));
    } else {
      setProduct(storeProduct);
    }
  }, [id, storeProduct]);

  const related = products
    .filter((p) => (p._id || p.id) !== (product?._id || product?.id) && p.category === product?.category)
    .slice(0, 4);

  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [cartAnim, setCartAnim] = useState(false);
  const [tab, setTab] = useState('specs');

  if (fetchLoading) return (
    <div className="min-h-screen flex items-center justify-center pt-20">
      <Loader2 size={48} className="animate-spin text-primary" />
    </div>
  );

  if (!product) return (
    <div className="min-h-screen flex items-center justify-center pt-20">
      <div className="text-center">
        <div className="text-6xl mb-4">😕</div>
        <h2 className="text-2xl font-bold text-gray-700 mb-4">Product not found</h2>
        <Link to="/products"><Button>Back to Products</Button></Link>
      </div>
    </div>
  );

  const discount = getDiscount(product.originalPrice, product.price);

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) dispatch(addToCart(product));
    setCartAnim(true);
    setTimeout(() => setCartAnim(false), 600);
    toast.success('Added to cart!', {
      icon: '🛒',
      style: { borderRadius: '12px', background: '#D8F3DC', color: '#2D6A4F', fontWeight: '600' },
    });
  };

  return (
    <PageWrapper>
      <div className="min-h-screen bg-background pt-20">
        <div className="page-container py-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <Link to="/products" className="hover:text-primary transition-colors">Products</Link>
            <span>/</span>
            <span className="text-primary font-medium">{product.name}</span>
          </div>

          <Link to="/products" className="inline-flex items-center gap-2 text-secondary hover:text-primary font-medium mb-6 transition-colors">
            <ArrowLeft size={18} /> Back to Products
          </Link>

          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            {/* Left - Images */}
            <div>
              <motion.div
                key={activeImg}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-3xl overflow-hidden bg-surface/40 mb-4 h-96"
              >
                <img
                  src={product.images?.[activeImg]?.url || product.images?.[activeImg] || product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </motion.div>
              {product.images?.length > 1 && (
                <div className="flex gap-3">
                  {product.images.map((img, i) => (
                    <button key={i} onClick={() => setActiveImg(i)}
                      className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors ${activeImg === i ? 'border-secondary' : 'border-surface'}`}>
                      <img src={img.url || img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right - Details */}
            <div>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-sm text-secondary font-semibold uppercase tracking-wide mb-1">{product.brand}</p>
                  <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>
                </div>
                <div className="flex gap-2">
                  <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                    className="p-2.5 bg-surface rounded-xl text-gray-500 hover:text-red-500 transition-colors">
                    <Heart size={18} />
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                    className="p-2.5 bg-surface rounded-xl text-gray-500 hover:text-primary transition-colors">
                    <Share2 size={18} />
                  </motion.button>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-4">
                <StarRating rating={product.rating} size={18} />
                <span className="text-gray-500 text-sm">{product.rating} ({product.reviewCount} reviews)</span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-4 mb-6 p-4 bg-surface/60 rounded-2xl">
                <span className="text-4xl font-extrabold text-primary">{formatCurrency(product.price)}</span>
                {discount > 0 && (
                  <>
                    <span className="text-gray-400 line-through text-lg">{formatCurrency(product.originalPrice)}</span>
                    <Badge variant="success" className="text-sm px-3 py-1">Save {discount}%</Badge>
                  </>
                )}
              </div>

              {product.badge && <Badge variant="dark" className="mb-4 text-sm px-4 py-1.5">{product.badge}</Badge>}

              <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>

              {/* Qty + Add to Cart */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-3 bg-surface rounded-xl p-1">
                  <motion.button whileTap={{ scale: 0.85 }}
                    onClick={() => setQty(q => Math.max(1, q - 1))}
                    className="w-9 h-9 bg-white rounded-lg flex items-center justify-center text-primary hover:bg-accent/20 transition-colors font-bold shadow-sm">
                    <Minus size={16} />
                  </motion.button>
                  <span className="w-10 text-center font-bold text-lg">{qty}</span>
                  <motion.button whileTap={{ scale: 0.85 }}
                    onClick={() => setQty(q => Math.min(product.stock, q + 1))}
                    className="w-9 h-9 bg-white rounded-lg flex items-center justify-center text-primary hover:bg-accent/20 transition-colors font-bold shadow-sm">
                    <Plus size={16} />
                  </motion.button>
                </div>
                <span className="text-sm text-gray-400">{product.stock} in stock</span>
              </div>

              <div className="flex gap-3 mb-8">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  animate={cartAnim ? { scale: [1, 1.15, 1] } : {}}
                  onClick={handleAddToCart}
                  className="flex-1 flex items-center justify-center gap-2 bg-secondary text-white font-bold py-4 rounded-xl hover:bg-accent transition-colors shadow-md"
                >
                  <ShoppingCart size={20} />
                  Add to Cart
                </motion.button>
                <Link to="/checkout" className="flex-1">
                  <Button variant="dark" className="w-full py-4 text-base">Buy Now</Button>
                </Link>
              </div>

              {/* Guarantees */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: Shield, label: '1 Year Warranty' },
                  { icon: Truck, label: 'Free Delivery' },
                  { icon: Package, label: 'Easy Returns' },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex flex-col items-center gap-2 p-3 bg-surface/50 rounded-xl text-center">
                    <Icon size={20} className="text-secondary" />
                    <p className="text-xs font-medium text-gray-700">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Specs / Reviews tabs */}
          <div className="bg-white rounded-3xl shadow-card overflow-hidden mb-12">
            <div className="flex border-b border-surface">
              {['specs', 'reviews'].map(t => (
                <button key={t} onClick={() => setTab(t)}
                  className={`flex-1 py-4 font-semibold capitalize transition-colors ${tab === t ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-primary'}`}>
                  {t === 'specs' ? 'Specifications' : `Reviews (${(product.reviews || []).length})`}
                </button>
              ))}
            </div>
            <div className="p-6">
              <AnimatePresence mode="wait">
                {tab === 'specs' ? (
                  <motion.div key="specs" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {Object.entries(product.specs || {}).map(([key, val]) => (
                        <div key={key} className="flex justify-between p-3 bg-surface/50 rounded-xl">
                          <span className="text-gray-500 text-sm capitalize">{key}</span>
                          <span className="font-semibold text-gray-800 text-sm">{val}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div key="reviews" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                    className="space-y-4">
                    {product.reviews && product.reviews.length > 0 ? (
                      product.reviews.map(r => (
                        <div key={r._id} className="p-4 bg-surface/50 rounded-2xl">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                              {r.name?.[0]?.toUpperCase() || 'U'}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800 text-sm">{r.name}</p>
                              <p className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div className="ml-auto flex">
                              {[1,2,3,4,5].map(s => <Star key={s} size={14} className={s <= r.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'} />)}
                            </div>
                          </div>
                          <p className="text-gray-600 text-sm">{r.comment}</p>
                        </div>
                      ))
                    ) : (
                      <div className="py-12 text-center">
                        <div className="text-4xl mb-4">💬</div>
                        <p className="text-gray-500 font-medium">No reviews yet for this product.</p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Related Products */}
          {related.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-primary mb-6">Related Products</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
                {related.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
              </div>
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
};

export default ProductDetail;
