import { create } from 'zustand';
import api from '../services/api';
import useAuthStore from './useAuthStore';

const useCartStore = create((set, get) => ({
  cartItems: [],
  loading: false,
  deliveryPincode: localStorage.getItem('deliveryPincode') || '',
  
  setDeliveryPincode: (pincode) => {
    localStorage.setItem('deliveryPincode', pincode);
    set({ deliveryPincode: pincode });
  },

  fetchCart: async () => {
    const user = useAuthStore.getState().user;
    if (!user) {
      set({ cartItems: [] });
      return;
    }
    try {
      set({ loading: true });
      const { data } = await api.get('/api/cart');
      if (data && data.cartItems) set({ cartItems: data.cartItems });
      set({ loading: false });
    } catch (error) {
      console.error('Error fetching cart:', error);
      set({ loading: false });
    }
  },

  addToCart: async (productId, quantity, size, color) => {
    const user = useAuthStore.getState().user;
    if (!user) {
      alert('Please login to add to cart');
      return false;
    }
    try {
      const { data } = await api.post('/api/cart', { productId, quantity: Number(quantity), size, color });
      set({ cartItems: data.cartItems });
      return true;
    } catch (error) {
      console.error('Error adding to cart:', error);
      return false;
    }
  },

  updateQuantity: async (productId, quantity) => {
    try {
      const { data } = await api.put(`/api/cart/${productId}`, { quantity: Number(quantity) });
      set({ cartItems: data.cartItems });
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  },

  removeFromCart: async (productId) => {
    try {
      const { data } = await api.delete(`/api/cart/${productId}`);
      set({ cartItems: data.cartItems });
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  },

  clearCart: async () => {
    try {
      const { data } = await api.delete('/api/cart');
      set({ cartItems: data.cartItems });
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  }
}));

// Setup listener for auth state changes to auto-fetch cart
useAuthStore.subscribe((state, prevState) => {
  if (state.user !== prevState?.user) {
    useCartStore.getState().fetchCart();
  }
});

// Initial fetch attempt
useCartStore.getState().fetchCart();

export default useCartStore;
