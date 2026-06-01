import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../components/const';

export const fetchCategories = createAsyncThunk(
  'category/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(`${api}/getCategory`);
      if (!res.ok) throw new Error('Failed to fetch');
      return await res.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const addCategory = createAsyncThunk(
  'category/add',
  async (formData, { rejectWithValue }) => {
    try {
      const res = await fetch(`${api}/addcategory`, {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error('Failed to add');
      return await res.text();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const updateCategory = createAsyncThunk(
  'category/update',
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${api}/category/${id}`, {
        method: 'PUT',
        body: formData,
      });
      if (!res.ok) throw new Error('Failed to update');
      return await res.text();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const deleteCategory = createAsyncThunk(
  'category/delete',
  async (id, { rejectWithValue }) => {
    try {
      const res = await fetch(`${api}/category/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete');
      return id;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const categorySlice = createSlice({
  name: 'category',
  initialState: {
    categories: [],
    loading: false,
    actionLoading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending,   (state) => { state.loading = true; state.error = null; })
      .addCase(fetchCategories.fulfilled, (state, action) => { state.loading = false; state.categories = action.payload; })
      .addCase(fetchCategories.rejected,  (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(addCategory.pending,   (state) => { state.actionLoading = true; state.error = null; })
      .addCase(addCategory.fulfilled, (state, action) => { state.actionLoading = false; state.successMessage = action.payload; })
      .addCase(addCategory.rejected,  (state, action) => { state.actionLoading = false; state.error = action.payload; })

      .addCase(updateCategory.pending,   (state) => { state.actionLoading = true; state.error = null; })
      .addCase(updateCategory.fulfilled, (state, action) => { state.actionLoading = false; state.successMessage = action.payload; })
      .addCase(updateCategory.rejected,  (state, action) => { state.actionLoading = false; state.error = action.payload; })

      .addCase(deleteCategory.pending,   (state) => { state.actionLoading = true; state.error = null; })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.successMessage = 'Category deleted';
        state.categories = state.categories.filter((c) => c.id !== action.payload);
      })
      .addCase(deleteCategory.rejected,  (state, action) => { state.actionLoading = false; state.error = action.payload; });
  },
});

export const { clearMessages } = categorySlice.actions;
export default categorySlice.reducer;