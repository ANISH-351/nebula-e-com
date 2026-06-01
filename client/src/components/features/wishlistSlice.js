import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../components/const';

// GET WISHLIST
export const fetchWishlist = createAsyncThunk(
  'wishlist/fetchAll',
  async (user_id, { rejectWithValue }) => {
    try {
      const res = await fetch(`${api}/getWishlist/${user_id}`);
      if (!res.ok) throw new Error('Failed to fetch wishlist');
      return await res.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ADD TO WISHLIST
export const addToWishlist = createAsyncThunk(
  'wishlist/add',
  async ({ user_id, product_id }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${api}/addWishlist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id, product_id }),
      });
      if (!res.ok) throw new Error(await res.text());
      return await res.text();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// DELETE FROM WISHLIST
export const removeFromWishlist = createAsyncThunk(
  'wishlist/remove',
  async (id, { rejectWithValue }) => {
    try {
      const res = await fetch(`${api}/deleteWishlist/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to remove');
      return id;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    wishlistItems: [],
    loading: false,
    actionLoading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearWishlistMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchWishlist.pending,   (state) => { state.loading = true; state.error = null; })
      .addCase(fetchWishlist.fulfilled, (state, action) => { state.loading = false; state.wishlistItems = action.payload; })
      .addCase(fetchWishlist.rejected,  (state, action) => { state.loading = false; state.error = action.payload; })

      // ADD
      .addCase(addToWishlist.pending,   (state) => { state.actionLoading = true; state.error = null; })
      .addCase(addToWishlist.fulfilled, (state, action) => { state.actionLoading = false; state.successMessage = action.payload; })
      .addCase(addToWishlist.rejected,  (state, action) => { state.actionLoading = false; state.error = action.payload; })

      // REMOVE
      .addCase(removeFromWishlist.pending,   (state) => { state.actionLoading = true; })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.wishlistItems = state.wishlistItems.filter((w) => w.id !== action.payload);
      })
      .addCase(removeFromWishlist.rejected,  (state, action) => { state.actionLoading = false; state.error = action.payload; })
  },
});

export const { clearWishlistMessages } = wishlistSlice.actions;
export default wishlistSlice.reducer;