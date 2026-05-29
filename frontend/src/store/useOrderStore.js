import { create } from 'zustand';
import api from '../services/api';

const useOrderStore = create((set) => ({
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,

  createOrder: async (orderData) => {
    try {
      set({ loading: true, error: null });
      const { data } = await api.post('/api/orders', orderData);
      set({ currentOrder: data, loading: false });
      return data;
    } catch (error) {
      set({ 
        error: error.response && error.response.data.message ? error.response.data.message : error.message, 
        loading: false 
      });
      throw error;
    }
  },

  getMyOrders: async () => {
    try {
      set({ loading: true, error: null });
      const { data } = await api.get('/api/orders/myorders');
      set({ orders: data, loading: false });
    } catch (error) {
      set({ 
        error: error.response && error.response.data.message ? error.response.data.message : error.message, 
        loading: false 
      });
    }
  },

  getOrderDetails: async (id) => {
    try {
      set({ loading: true, error: null });
      const { data } = await api.get(`/api/orders/${id}`);
      set({ currentOrder: data, loading: false });
    } catch (error) {
      set({ 
        error: error.response && error.response.data.message ? error.response.data.message : error.message, 
        loading: false 
      });
    }
  }
}));

export default useOrderStore;
