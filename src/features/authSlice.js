import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginAPI, registerAPI, verifyOTPAPI, logoutAPI, getMeAPI } from '../services/authService';

// ── Async Thunks ─────────────────────────────────────────────────────────────

export const loginUser = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const { data } = await loginAPI(credentials);
    return data; // returns { user, token }
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const registerUser = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
  try {
    const { data } = await registerAPI(userData);
    return data; // { success, message } — OTP sent
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const verifyOTP = createAsyncThunk('auth/verifyOTP', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await verifyOTPAPI(payload);
    return data; // returns { user, token }
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const logoutUser = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    await logoutAPI();
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const fetchMe = createAsyncThunk('auth/fetchMe', async (_, { rejectWithValue }) => {
  try {
    const { data } = await getMeAPI();
    return data.user;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const updateProfileDetails = createAsyncThunk('auth/updateDetails', async (userData, { rejectWithValue }) => {
  try {
    const { data } = await updateDetailsAPI(userData);
    return data.data; // user object
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || err.message);
  }
});

export const updateUserPassword = createAsyncThunk('auth/updatePassword', async (passwords, { rejectWithValue }) => {
  try {
    const { data } = await updatePasswordAPI(passwords);
    return data; // success
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || err.message);
  }
});

// ── Slice ────────────────────────────────────────────────────────────────────

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: JSON.parse(localStorage.getItem('sc_user') || 'null'),
    isAuthenticated: !!localStorage.getItem('sc_user'),
    loading: false,
    error: null,
    // used during OTP flow
    pendingEmail: null,
  },
  reducers: {
    // Keep these for direct dispatch (e.g., profile edit without API round-trip)
    loginSuccess: (state, action) => {
      state.user = action.payload.user || action.payload;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
      localStorage.setItem('sc_user', JSON.stringify(state.user));
      if (action.payload.token) localStorage.setItem('sc_token', action.payload.token);
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.pendingEmail = null;
      localStorage.removeItem('sc_user');
      localStorage.removeItem('sc_token');
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    updateProfile: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem('sc_user', JSON.stringify(state.user));
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        localStorage.setItem('sc_user', JSON.stringify(action.payload.user));
        localStorage.setItem('sc_token', action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Register (sends OTP)
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        // store email so verify-otp step can use it
        state.pendingEmail = action.meta.arg.email;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Verify OTP
    builder
      .addCase(verifyOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOTP.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.pendingEmail = null;
        localStorage.setItem('sc_user', JSON.stringify(action.payload.user));
        localStorage.setItem('sc_token', action.payload.token);
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Logout
    builder
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        localStorage.removeItem('sc_user');
        localStorage.removeItem('sc_token');
      });

    // Fetch current user
    builder
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        localStorage.setItem('sc_user', JSON.stringify(action.payload));
      })
      .addCase(fetchMe.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        localStorage.removeItem('sc_user');
        localStorage.removeItem('sc_token');
      })
      .addCase(updateProfileDetails.fulfilled, (state, action) => {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem('sc_user', JSON.stringify(state.user));
      });
  },
});

export const { loginSuccess, logout, setLoading, updateProfile, clearError } = authSlice.actions;
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;
export const selectPendingEmail = (state) => state.auth.pendingEmail;
export default authSlice.reducer;
