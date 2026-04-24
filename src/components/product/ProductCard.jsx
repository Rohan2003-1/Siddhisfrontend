import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart, syncCart } from '../../features/cartSlice';
import { ShoppingCart, Star, Check } from 'lucide-react';
import { formatCurrency, getDiscount } from '../../utils/helpers';
import toast from 'react-hot-toast';
import Badge from '../ui/Badge';

const ProductCard = ({ product, index = 0 }) => {
  const dispatch = useDispatch();
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    dispatch(addToCart(product));
    dispatch(syncCart());
    setAdded(true);
    
    setTimeout(() => setAdded(false), 1500);

    toast.success(`${product.name} added to cart!`, {
      icon: '🛒',
      style: { borderRadius: '12px', background: '#D8F3DC', color: '#2D6A4F', fontWeight: '600' },
    });
  };

  const discount = product.originalPrice ? getDiscount(product.originalPrice, product.price) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
      whileHover={{ y: -8 }}
      className="group bg-white rounded-2xl shadow-card hover:shadow-cardHover overflow-hidden transition-shadow duration-300"
    >
      <Link to={`/products/${product._id || product.id}`}>
        {/* Image */}
        <div className="relative overflow-hidden h-52 bg-surface/40">
          <motion.img
            src={product.images?.[0]?.url || product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1">
            {product.badge && <Badge variant="dark">{product.badge}</Badge>}
            {discount > 0 && <Badge variant="success">-{discount}%</Badge>}
          </div>
          {/* Quick add overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            className="absolute inset-0 bg-primary/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleAddToCart}
              className={`flex items-center gap-2 font-semibold px-5 py-2.5 rounded-xl shadow-lg transition-all duration-300 ${
                added ? 'bg-green-500 text-white' : 'bg-white text-primary hover:bg-surface'
              }`}
            >
              <AnimatePresence mode="wait">
                {added ? (
                  <motion.div key="check" initial={{ scale: 0, rotate: -45 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0 }} className="flex items-center gap-2">
                    <Check size={18} />
                    Added!
                  </motion.div>
                ) : (
                  <motion.div key="cart" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="flex items-center gap-2">
                    <ShoppingCart size={18} />
                    Quick Add
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </motion.div>
        </div>

        {/* Details */}
        <div className="p-4">
          <p className="text-xs text-secondary font-semibold uppercase tracking-wide mb-1">{product.brand}</p>
          <h3 className="font-semibold text-gray-800 text-sm leading-snug line-clamp-2 mb-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-3">
            <div className="flex">
              {[1,2,3,4,5].map(s => (
                <Star key={s} size={12} className={s <= Math.round(product.ratings || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'} />
              ))}
            </div>
            <span className="text-xs text-gray-400">({product.numReviews || 0})</span>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-lg font-bold text-primary">{formatCurrency(product.price)}</span>
              {product.originalPrice > product.price && (
                <span className="ml-2 text-xs text-gray-400 line-through">{formatCurrency(product.originalPrice)}</span>
              )}
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleAddToCart}
              className={`p-2.5 rounded-xl transition-all duration-300 shadow-md ${
                added ? 'bg-green-500 text-white' : 'bg-secondary text-white hover:bg-accent'
              }`}
            >
              <AnimatePresence mode="wait">
                {added ? (
                  <motion.div key="check" initial={{ scale: 0, rotate: -45 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0 }}>
                    <Check size={16} />
                  </motion.div>
                ) : (
                  <motion.div key="cart" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                    <ShoppingCart size={16} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
