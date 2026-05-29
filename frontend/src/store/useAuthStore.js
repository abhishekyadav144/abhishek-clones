import { create } from 'zustand';
import api from '../services/api';

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('userInfo')) || null,
  loading: false,
  error: null,
  
  login: async (email, password) => {
    try {
      set({ error: null });
      const { data } = await api.post('/api/auth/login', { email, password });
      set({ user: data });
      localStorage.setItem('userInfo', JSON.stringify(data));
      return true;
    } catch (err) {
      set({ error: err.response?.data?.message || err.message });
      return false;
    }
  },
  
  register: async (name, email, password) => {
    try {
      set({ error: null });
      const { data } = await api.post('/api/auth/register', { name, email, password });
      set({ user: data });
      localStorage.setItem('userInfo', JSON.stringify(data));
      return true;
    } catch (err) {
      set({ error: err.response?.data?.message || err.message });
      return false;
    }
  },
  
  updateProfile: async (userData) => {
    try {
      set({ error: null });
      const { user } = useAuthStore.getState();
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await api.put('/api/auth/profile', userData, config);
      set({ user: data });
      localStorage.setItem('userInfo', JSON.stringify(data));
      return true;
    } catch (err) {
      set({ error: err.response?.data?.message || err.message });
      return false;
    }
  },
  
  logout: () => {
    set({ user: null });
    localStorage.removeItem('userInfo');
  }
}));

export default useAuthStore;
