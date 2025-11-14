import useWishlistStore from "../src/store/wishlistStore";

const useWishlist = () => {
  const {
    wishlistIds,
    wishlistItems,
    loading,
    error,
    fetchWishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist,
  } = useWishlistStore();

  return {
    wishlistIds,
    wishlistItems,
    loading,
    error,
    fetchWishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist,
  };
};

export default useWishlist;

