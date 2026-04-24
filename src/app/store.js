import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '../features/cartSlice';
import authReducer from '../features/authSlice';
import productReducer from '../features/productSlice';
import bookingReducer from '../features/bookingSlice';
import orderReducer from '../features/orderSlice';
import categoryReducer from '../features/categorySlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer,
    products: productReducer,
    bookings: bookingReducer,
    orders: orderReducer,
    categories: categoryReducer,
  },
});

export default store;
