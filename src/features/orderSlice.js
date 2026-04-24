import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createOrderAPI, fetchMyOrdersAPI, fetchAllOrdersAPI, updateOrderStatusAPI } from '../services/orderService';

// ── Async Thunks ─────────────────────────────────────────────────────────────

export const placeOrder = createAsyncThunk(
  'orders/place',
  async (orderData, { rejectWithValue }) => {
    try {
      const { data } = await createOrderAPI(orderData);
      return data.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchMyOrders = createAsyncThunk(
  'orders/fetchMine',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await fetchMyOrdersAPI();
      return data.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchAllOrders = createAsyncThunk(
  'orders/fetchAll',
  async (params = {}, { rejectWithValue }) => {
    try {
      const { data } = await fetchAllOrdersAPI(params);
      return data.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const changeOrderStatus = createAsyncThunk(
  'orders/changeStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const { data } = await updateOrderStatusAPI(id, status);
      return data.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ── Slice ────────────────────────────────────────────────────────────────────

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    orders: [],
    currentOrder: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrentOrder: (state) => { state.currentOrder = null; },
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    // Place order
    builder
      .addCase(placeOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
        state.orders.unshift(action.payload);
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch my orders
    builder
      .addCase(fetchMyOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch all orders (admin)
    builder
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Change order status (admin)
    builder.addCase(changeOrderStatus.fulfilled, (state, action) => {
      const index = state.orders.findIndex((o) => o._id === action.payload._id);
      if (index !== -1) state.orders[index] = action.payload;
    });
  },
});

export const { clearCurrentOrder, clearError } = orderSlice.actions;
export const selectOrders = (state) => state.orders.orders;
export const selectCurrentOrder = (state) => state.orders.currentOrder;
export const selectOrdersLoading = (state) => state.orders.loading;
export const selectOrdersError = (state) => state.orders.error;
export default orderSlice.reducer;
