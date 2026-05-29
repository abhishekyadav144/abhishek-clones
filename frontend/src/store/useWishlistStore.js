import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useWishlistStore = create(
  persist(
    (set, get) => ({
      wishlistItems: [],

      toggleWishlist: (product) => {
        const { wishlistItems } = get();
        const pId = product._id || product.id;
        const existingItem = wishlistItems.find((x) => (x._id || x.id) === pId);

        if (existingItem) {
          set({
            wishlistItems: wishlistItems.filter((x) => (x._id || x.id) !== pId),
          });
        } else {
          set({
            wishlistItems: [...wishlistItems, product],
          });
        }
      },

      removeFromWishlist: (id) => {
        set((state) => ({
          wishlistItems: state.wishlistItems.filter((x) => (x._id || x.id) !== id),
        }));
      },
      
      isInWishlist: (id) => {
        return get().wishlistItems.some((x) => (x._id || x.id) === id);
      }
    }),
    {
      name: 'abhishekcart-wishlist',
    }
  )
);

export default useWishlistStore;
