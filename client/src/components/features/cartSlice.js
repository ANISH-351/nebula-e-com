import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../components/const';

// GET CART
export const fetchCart = createAsyncThunk(
  'cart/fetchAll',
  async (user_id, { rejectWithValue }) => {
    try {
      const res = await fetch(`${api}/cartList/${user_id}`);
      if (!res.ok) throw new Error('Failed to fetch cart');
      return await res.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ADD TO CART
export const addToCart = createAsyncThunk(
  'cart/add',
  async ({ user_id, product_id }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${api}/cart`, {
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

// INCREASE QUANTITY
export const increaseQuantity = createAsyncThunk(
  'cart/increase',
  async (id, { rejectWithValue }) => {
    try {
      const res = await fetch(`${api}/increaseQuantity/${id}`, { method: 'PUT' });
      if (!res.ok) throw new Error('Failed to increase');
      return id;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// DECREASE QUANTITY
export const decreaseQuantity = createAsyncThunk(
  'cart/decrease',
  async (id, { rejectWithValue }) => {
    try {
      const res = await fetch(`${api}/decreaseQuantity/${id}`, { method: 'PUT' });
      if (!res.ok) throw new Error('Failed to decrease');
      return id;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// DELETE CART ITEM
export const removeFromCart = createAsyncThunk(
  'cart/remove',
  async (id, { rejectWithValue }) => {
    try {
      const res = await fetch(`${api}/removeCart/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to remove');
      return id;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cartItems: [],
    loading: false,
    actionLoading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearCartMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchCart.pending,   (state) => { state.loading = true; state.error = null; })
      .addCase(fetchCart.fulfilled, (state, action) => { state.loading = false; state.cartItems = action.payload; })
      .addCase(fetchCart.rejected,  (state, action) => { state.loading = false; state.error = action.payload; })

      // ADD
      .addCase(addToCart.pending,   (state) => { state.actionLoading = true; state.error = null; })
      .addCase(addToCart.fulfilled, (state, action) => { state.actionLoading = false; state.successMessage = action.payload; })
      .addCase(addToCart.rejected,  (state, action) => { state.actionLoading = false; state.error = action.payload; })

      // INCREASE
      .addCase(increaseQuantity.pending,   (state) => { state.actionLoading = true; })
      .addCase(increaseQuantity.fulfilled, (state, action) => {
        state.actionLoading = false;
        const item = state.cartItems.find((c) => c.id === action.payload);
        if (item) item.quantity += 1;
      })
      .addCase(increaseQuantity.rejected,  (state, action) => { state.actionLoading = false; state.error = action.payload; })

      // DECREASE
      .addCase(decreaseQuantity.pending,   (state) => { state.actionLoading = true; })
      .addCase(decreaseQuantity.fulfilled, (state, action) => {
        state.actionLoading = false;
        const item = state.cartItems.find((c) => c.id === action.payload);
        if (item) {
          if (item.quantity <= 1) {
            // remove from state if quantity hits 0 (matches backend logic)
            state.cartItems = state.cartItems.filter((c) => c.id !== action.payload);
          } else {
            item.quantity -= 1;
          }
        }
      })
      .addCase(decreaseQuantity.rejected,  (state, action) => { state.actionLoading = false; state.error = action.payload; })

      // REMOVE
      .addCase(removeFromCart.pending,   (state) => { state.actionLoading = true; })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.cartItems = state.cartItems.filter((c) => c.id !== action.payload);
      })
      .addCase(removeFromCart.rejected,  (state, action) => { state.actionLoading = false; state.error = action.payload; })
  },
});

export const { clearCartMessages } = cartSlice.actions;
export default cartSlice.reducer;