import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createBookingAPI, fetchMyBookingsAPI, updateBookingStatusAPI, fetchAllBookingsAPI } from '../services/bookingService';

// ── Async Thunks ─────────────────────────────────────────────────────────────

export const submitBooking = createAsyncThunk(
  'bookings/submit',
  async (bookingData, { rejectWithValue }) => {
    try {
      const { data } = await createBookingAPI(bookingData);
      return data.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchMyBookings = createAsyncThunk(
  'bookings/fetchMine',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await fetchMyBookingsAPI();
      return data.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchAllBookings = createAsyncThunk(
  'bookings/fetchAll',
  async (params = {}, { rejectWithValue }) => {
    try {
      const { data } = await fetchAllBookingsAPI(params);
      return data.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const changeBookingStatus = createAsyncThunk(
  'bookings/changeStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const { data } = await updateBookingStatusAPI(id, status);
      return data.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ── Slice ────────────────────────────────────────────────────────────────────

const bookingSlice = createSlice({
  name: 'bookings',
  initialState: {
    bookings: [],
    selectedDate: null,
    selectedTime: null,
    selectedService: null,
    loading: false,
    error: null,
  },
  reducers: {
    setSelectedDate: (state, action) => { state.selectedDate = action.payload; },
    setSelectedTime: (state, action) => { state.selectedTime = action.payload; },
    setSelectedService: (state, action) => { state.selectedService = action.payload; },
    clearSelection: (state) => {
      state.selectedDate = null;
      state.selectedTime = null;
      state.selectedService = null;
    },
    // kept for backwards-compat with local/offline flow
    addBooking: (state, action) => {
      state.bookings.unshift(action.payload);
      state.selectedDate = null;
      state.selectedTime = null;
      state.selectedService = null;
    },
    updateBookingStatus: (state, action) => {
      const { id, status } = action.payload;
      const booking = state.bookings.find((b) => b._id === id || b.id === id);
      if (booking) booking.status = status;
    },
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    // Submit booking
    builder
      .addCase(submitBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings.unshift(action.payload);
        state.selectedDate = null;
        state.selectedTime = null;
        state.selectedService = null;
      })
      .addCase(submitBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch my bookings
    builder
      .addCase(fetchMyBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      })
      .addCase(fetchMyBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch all bookings (admin)
    builder
      .addCase(fetchAllBookings.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      })
      .addCase(fetchAllBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Change booking status (admin)
    builder
      .addCase(changeBookingStatus.fulfilled, (state, action) => {
        const index = state.bookings.findIndex(
          (b) => b._id === action.payload._id
        );
        if (index !== -1) state.bookings[index] = action.payload;
      });
  },
});

export const {
  setSelectedDate,
  setSelectedTime,
  setSelectedService,
  addBooking,
  clearSelection,
  updateBookingStatus,
  clearError,
} = bookingSlice.actions;

export const selectBookings = (state) => state.bookings.bookings;
export const selectSelectedDate = (state) => state.bookings.selectedDate;
export const selectSelectedTime = (state) => state.bookings.selectedTime;
export const selectSelectedService = (state) => state.bookings.selectedService;
export const selectBookingsLoading = (state) => state.bookings.loading;
export const selectBookingsError = (state) => state.bookings.error;

export default bookingSlice.reducer;
