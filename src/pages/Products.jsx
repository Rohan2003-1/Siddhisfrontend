import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, X, ChevronDown, Search, Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchProducts,
  setCategory,
  setSortBy,
  setPriceRange,
  setSearchQuery,
  selectFilteredProducts,
  selectSelectedCategory,
  selectSortBy,
  selectProductsLoading,
} from '../features/productSlice';
import ProductCard from '../components/product/ProductCard';
import PageWrapper from '../components/layout/PageWrapper';
import { useSearchParams } from 'react-router-dom';
import { fetchCategoriesAPI } from '../services/categoryService';

const sortOptions = [
  { value: 'default', label: 'Default' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'newest', label: 'Newest First' },
];

const Products = () => {
  const [searchParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState('');
  const [categories, setCategories] = useState(['All']);

  const dispatch = useDispatch();
  const products = useSelector(selectFilteredProducts);
  const selectedCategory = useSelector(selectSelectedCategory);
  const sortBy = useSelector(selectSortBy);
  const loading = useSelector(selectProductsLoading);

  // Load products from backend on mount
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Load categories from backend
  useEffect(() => {
    fetchCategoriesAPI()
      .then(({ data }) => {
        const names = (data.categories || data.data || []).map((c) => c.name);
        setCategories(['All', ...names]);
      })
      .catch(() => {
        // fallback — categories stay as ['All']
      });
  }, []);

  // Apply URL category param
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) dispatch(setCategory(cat));
  }, [searchParams, dispatch]);

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(setSearchQuery(localSearch));
  };

  return (
    <PageWrapper>
      <div className="min-h-screen bg-background pt-20">
        {/* Header */}
        <div className="bg-primary text-white py-12">
          <div className="page-container">
            <h1 className="text-4xl font-bold mb-2">All Products</h1>
            <p className="text-white/70">Browse our complete collection of premium tech products</p>
          </div>
        </div>

        <div className="page-container py-8">
          {/* Search + Filter bar */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <form onSubmit={handleSearch} className="flex-1 flex gap-2">
              <div className="relative flex-1">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  placeholder="Search products..."
                  className="input-field pl-10"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                type="submit"
                className="px-5 py-3 bg-secondary text-white rounded-xl font-semibold hover:bg-accent transition-colors"
              >
                Search
              </motion.button>
            </form>

            <div className="flex gap-3">
              {/* Sort */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => dispatch(setSortBy(e.target.value))}
                  className="input-field pr-8 appearance-none cursor-pointer min-w-[160px]"
                >
                  {sortOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>

              {/* Mobile filter toggle */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setFiltersOpen(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-3 bg-white border-2 border-surface rounded-xl font-medium text-gray-700 hover:border-secondary transition-colors"
              >
                <SlidersHorizontal size={18} />
                Filters
              </motion.button>
            </div>
          </div>

          <div className="flex gap-8">
            {/* Sidebar Filters (Desktop) */}
            <aside className="hidden lg:block w-60 flex-shrink-0">
              <FilterPanel categories={categories} />
            </aside>

            {/* Mobile Filters Drawer */}
            <AnimatePresence>
              {filtersOpen && (
                <>
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    onClick={() => setFiltersOpen(false)}
                    className="fixed inset-0 bg-black/40 z-40 lg:hidden"
                  />
                  <motion.div
                    initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className="fixed left-0 top-0 h-full w-72 bg-white shadow-2xl z-50 overflow-y-auto p-5"
                  >
                    <div className="flex justify-between items-center mb-5">
                      <h3 className="font-bold text-primary text-lg">Filters</h3>
                      <button onClick={() => setFiltersOpen(false)} className="p-2 hover:bg-surface rounded-xl">
                        <X size={20} />
                      </button>
                    </div>
                    <FilterPanel categories={categories} onClose={() => setFiltersOpen(false)} />
                  </motion.div>
                </>
              )}
            </AnimatePresence>

            {/* Products Grid */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-4">
                <p className="text-gray-500 text-sm">{products.length} products found</p>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-24">
                  <Loader2 size={40} className="animate-spin text-primary" />
                </div>
              ) : products.length === 0 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-bold text-gray-700 mb-2">No products found</h3>
                  <p className="text-gray-500">Try adjusting your filters or search query</p>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {products.map((p, i) => <ProductCard key={p._id || p.id} product={p} index={i} />)}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

const FilterPanel = ({ categories, onClose }) => {
  const dispatch = useDispatch();
  const selectedCategory = useSelector(selectSelectedCategory);
  const [price, setPrice] = useState([0, 150000]);

  return (
    <div className="space-y-6">
      <div>
        <h4 className="font-semibold text-gray-800 mb-3 text-sm uppercase tracking-wide">Category</h4>
        <div className="space-y-1.5">
          {categories.map((cat) => (
            <motion.button
              key={cat}
              whileHover={{ x: 4 }}
              onClick={() => { dispatch(setCategory(cat)); onClose?.(); }}
              className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                selectedCategory === cat ? 'bg-primary text-white' : 'text-gray-700 hover:bg-surface'
              }`}
            >
              {cat}
            </motion.button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-semibold text-gray-800 mb-3 text-sm uppercase tracking-wide">Price Range</h4>
        <div className="px-1">
          <input
            type="range"
            min={0} max={150000} step={1000}
            value={price[1]}
            onChange={(e) => setPrice([0, +e.target.value])}
            onMouseUp={() => dispatch(setPriceRange(price))}
            className="w-full accent-secondary"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>₹0</span>
            <span className="font-semibold text-primary">Up to ₹{price[1].toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
