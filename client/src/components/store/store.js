import { configureStore } from '@reduxjs/toolkit';
import categoryReducer from '../features/categorySlice';
import cartReducer     from '../features/cartSlice';
import wishlistReducer from '../features/wishlistSlice';

export const store = configureStore({
  reducer: {
    category: categoryReducer,
    cart:     cartReducer,
    wishlist: wishlistReducer,
  },
});