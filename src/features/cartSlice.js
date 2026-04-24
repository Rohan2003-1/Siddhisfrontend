import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { syncCartAPI } from '../services/authService';
import toast from 'react-hot-toast';

// ── Async Thunk for Syncing ──────────────────────────────────────────────────
export const syncCart = createAsyncThunk(
  'cart/sync',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { cart, auth } = getState();
      if (!auth.user) return; // Don't sync if not logged in

      const cartItems = cart.items.map(item => ({
        product: item._id || item.id,
        quantity: item.quantity,
        name: item.name,
        price: item.price,
        image: item.images?.[0]?.url || item.image
      }));

      await syncCartAPI(cartItems);
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Failed to sync cart');
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: JSON.parse(localStorage.getItem('sc_cart') || '[]'),
    isOpen: false,
    loading: false,
  },
  reducers: {
    addToCart: (state, action) => {
      const existing = state.items.find(i => (i._id || i.id) === (action.payload._id || action.payload.id));
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
      localStorage.setItem('sc_cart', JSON.stringify(state.items));
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(i => (i._id || i.id) !== action.payload);
      localStorage.setItem('sc_cart', JSON.stringify(state.items));
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find(i => (i._id || i.id) === id);
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter(i => (i._id || i.id) !== id);
        } else {
          item.quantity = quantity;
        }
      }
      localStorage.setItem('sc_cart', JSON.stringify(state.items));
    },
    clearCart: (state) => {
      state.items = [];
      localStorage.removeItem('sc_cart');
    },
    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    },
    setCartOpen: (state, action) => {
      state.isOpen = action.payload;
    },
    setCartItems: (state, action) => {
      state.items = action.payload;
      localStorage.setItem('sc_cart', JSON.stringify(state.items));
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(syncCart.pending, (state) => { state.loading = true; })
      .addCase(syncCart.fulfilled, (state) => { state.loading = false; })
      .addCase(syncCart.rejected, (state) => { state.loading = false; });
  }
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, toggleCart, setCartOpen, setCartItems } = cartSlice.actions;

export const selectCartItems = state => state.cart.items;
export const selectCartCount = state => state.cart.items.reduce((sum, i) => sum + i.quantity, 0);
export const selectCartTotal = state => state.cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
export const selectCartOpen = state => state.cart.isOpen;

export default cartSlice.reducer;
