import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchProductsAPI, createProductAPI, updateProductAPI, deleteProductAPI } from '../services/productService';

// ── Async Thunks ─────────────────────────────────────────────────────────────

export const fetchProducts = createAsyncThunk(
  'products/fetchAll',
  async (params = {}, { rejectWithValue }) => {
    try {
      const { data } = await fetchProductsAPI(params);
      return data; // { success, count, products }
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const createProduct = createAsyncThunk(
  'products/create',
  async (productData, { rejectWithValue }) => {
    try {
      const { data } = await createProductAPI(productData);
      return data.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const updateProduct = createAsyncThunk(
  'products/update',
  async ({ id, data: productData }, { rejectWithValue }) => {
    try {
      const { data } = await updateProductAPI(id, productData);
      return data.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'products/delete',
  async (id, { rejectWithValue }) => {
    try {
      await deleteProductAPI(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ── Slice ────────────────────────────────────────────────────────────────────

const productSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    filtered: [],
    selectedCategory: 'All',
    sortBy: 'default',
    priceRange: [0, 200000],
    searchQuery: '',
    loading: false,
    error: null,
    totalCount: 0,
  },
  reducers: {
    setCategory: (state, action) => {
      state.selectedCategory = action.payload;
      productSlice.caseReducers.applyFilters(state);
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
      productSlice.caseReducers.applyFilters(state);
    },
    setPriceRange: (state, action) => {
      state.priceRange = action.payload;
      productSlice.caseReducers.applyFilters(state);
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
      productSlice.caseReducers.applyFilters(state);
    },
    applyFilters: (state) => {
      let result = [...state.items];
      if (state.selectedCategory !== 'All') {
        result = result.filter(
          (p) =>
            p.category === state.selectedCategory ||
            p.category?.name === state.selectedCategory
        );
      }
      if (state.searchQuery) {
        result = result.filter(
          (p) =>
            p.name?.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
            p.brand?.toLowerCase().includes(state.searchQuery.toLowerCase())
        );
      }
      result = result.filter(
        (p) => p.price >= state.priceRange[0] && p.price <= state.priceRange[1]
      );
      if (state.sortBy === 'price-asc') result.sort((a, b) => a.price - b.price);
      else if (state.sortBy === 'price-desc') result.sort((a, b) => b.price - a.price);
      else if (state.sortBy === 'rating') result.sort((a, b) => b.rating - a.rating);
      else if (state.sortBy === 'newest')
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      state.filtered = result;
    },
    // Keep these synchronous actions for local mock-based admin operations
    addProductLocal: (state, action) => {
      state.items.unshift(action.payload);
      productSlice.caseReducers.applyFilters(state);
    },
    updateProductLocal: (state, action) => {
      const index = state.items.findIndex(
        (p) => p._id === action.payload._id || p.id === action.payload.id
      );
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...action.payload };
        productSlice.caseReducers.applyFilters(state);
      }
    },
    deleteProductLocal: (state, action) => {
      state.items = state.items.filter(
        (p) => p._id !== action.payload && p.id !== action.payload
      );
      productSlice.caseReducers.applyFilters(state);
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch products
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.products || action.payload.data || [];
        state.totalCount = action.payload.count ?? state.items.length;
        productSlice.caseReducers.applyFilters(state);
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Create product (admin)
    builder
      .addCase(createProduct.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
        productSlice.caseReducers.applyFilters(state);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.error = action.payload;
      });

    // Update product (admin)
    builder
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (p) => p._id === action.payload._id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
          productSlice.caseReducers.applyFilters(state);
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.error = action.payload;
      });

    // Delete product (admin)
    builder
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter((p) => p._id !== action.payload);
        productSlice.caseReducers.applyFilters(state);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const {
  setCategory,
  setSortBy,
  setPriceRange,
  setSearchQuery,
  applyFilters,
  addProductLocal,
  updateProductLocal,
  deleteProductLocal,
  clearError,
} = productSlice.actions;

export const selectAllProducts = (state) => state.products.items;
export const selectFilteredProducts = (state) => state.products.filtered;
export const selectSelectedCategory = (state) => state.products.selectedCategory;
export const selectSortBy = (state) => state.products.sortBy;
export const selectProductsLoading = (state) => state.products.loading;
export const selectProductsError = (state) => state.products.error;

export default productSlice.reducer;
