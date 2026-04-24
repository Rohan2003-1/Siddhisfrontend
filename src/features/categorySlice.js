import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchCategoriesAPI, createCategoryAPI, deleteCategoryAPI } from '../services/categoryService';

// ── Async Thunks ─────────────────────────────────────────────────────────────

export const fetchCategories = createAsyncThunk(
  'categories/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await fetchCategoriesAPI();
      return data.data; // array of categories
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const createCategory = createAsyncThunk(
  'categories/create',
  async (categoryData, { rejectWithValue }) => {
    try {
      const { data } = await createCategoryAPI(categoryData);
      return data.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const deleteCategory = createAsyncThunk(
  'categories/delete',
  async (id, { rejectWithValue }) => {
    try {
      await deleteCategoryAPI(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ── Slice ────────────────────────────────────────────────────────────────────

const categorySlice = createSlice({
  name: 'categories',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create
      .addCase(createCategory.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      // Delete
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.items = state.items.filter((c) => c._id !== action.payload);
      });
  },
});

export const selectAllCategories = (state) => state.categories.items;
export const selectCategoriesLoading = (state) => state.categories.loading;

export default categorySlice.reducer;
