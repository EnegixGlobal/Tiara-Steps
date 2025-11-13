import { create } from "zustand";
import Axios from "../Axios";

const useWishlistStore = create((set, get) => ({
  // Wishlist state - Set of product IDs for quick lookup
  wishlistIds: new Set(),
  
  // Full wishlist items (for Wishlist page)
  wishlistItems: [],
  
  // Loading state
  loading: false,
  
  // Error state
  error: null,
  
  // Initialize wishlist from API
  fetchWishlist: async () => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      set({ wishlistIds: new Set(), wishlistItems: [] });
      return;
    }

    try {
      set({ loading: true, error: null });
      const response = await Axios.get("/wishlist", {
        headers: { Authorization: token },
      });

      if (response.data?.success && response.data?.wishlist) {
        // Create Set of product IDs for quick lookup
        const productIds = new Set(
          response.data.wishlist.map(item => 
            String(item.productId?._id || item.productId || item.product?._id || item.product)
          )
        );
        
        // Transform items for Wishlist page
        const transformedItems = response.data.wishlist
          .filter(item => item.productId || item.product) // Filter out items without products
          .map((item) => ({
            _id: item._id,
            product: item.productId || item.product,
          }));

        set({ 
          wishlistIds: productIds, 
          wishlistItems: transformedItems,
          loading: false 
        });
      } else {
        set({ wishlistIds: new Set(), wishlistItems: [], loading: false });
      }
    } catch (err) {
      console.error("Error fetching wishlist:", err);
      set({ 
        error: err.response?.data?.message || "Failed to load wishlist",
        loading: false,
        wishlistIds: new Set(),
        wishlistItems: []
      });
    }
  },

  // Add to wishlist
  addToWishlist: async (productId) => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      throw new Error("Please login to add items to wishlist");
    }

    const productIdStr = String(productId);
    const { wishlistIds } = get();

    // Check if already in wishlist
    if (wishlistIds.has(productIdStr)) {
      return; // Already in wishlist
    }

    try {
      await Axios.post(
        "/wishlist/add",
        { productId },
        {
          headers: { Authorization: token },
        }
      );
      
      // Update state optimistically
      const newSet = new Set(wishlistIds);
      newSet.add(productIdStr);
      set({ wishlistIds: newSet });
    } catch (err) {
      console.error("Error adding to wishlist:", err);
      throw err;
    }
  },

  // Remove from wishlist
  removeFromWishlist: async (productId) => {
    const token = localStorage.getItem("jwt");
    if (!token) return;

    const productIdStr = String(productId);
    const { wishlistIds, wishlistItems } = get();

    try {
      await Axios.delete(`/wishlist/remove/${productId}`, {
        headers: { Authorization: token },
      });

      // Update state
      const newSet = new Set(wishlistIds);
      newSet.delete(productIdStr);
      
      const updatedItems = wishlistItems.filter(item => {
        const itemProductId = item.product?._id || item.product?.id;
        return String(itemProductId) !== productIdStr;
      });

      set({ 
        wishlistIds: newSet,
        wishlistItems: updatedItems
      });
    } catch (err) {
      console.error("Error removing from wishlist:", err);
      throw err;
    }
  },

  // Check if product is in wishlist
  isInWishlist: (productId) => {
    const { wishlistIds } = get();
    return wishlistIds.has(String(productId));
  },

  // Clear wishlist (on logout)
  clearWishlist: () => {
    set({ 
      wishlistIds: new Set(), 
      wishlistItems: [],
      error: null 
    });
  },
}));

export default useWishlistStore;

