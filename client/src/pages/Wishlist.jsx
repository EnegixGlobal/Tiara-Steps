import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import useWishlist from '../../hooks/useWishlist';

const WishlistPage = () => {
  const { wishlistItems, loading, error, fetchWishlist, removeFromWishlist } = useWishlist();

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      return;
    }
    fetchWishlist();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRemoveFromWishlist = async (productId) => {
    try {
      await removeFromWishlist(productId);
      toast.success("Removed from wishlist", {
        position: "bottom-right",
      });
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Failed to remove from wishlist", {
        position: "bottom-right",
      });
    }
  };

  const moveToCart = (productId) => {
    alert(`Moving product ${productId} to cart!`);
  };

  const showSimilar = (productId) => {
    alert(`Showing similar products for ${productId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-6 px-4 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading wishlist...</div>
      </div>
    );
  }

  const token = localStorage.getItem("jwt");
  if (!token && !loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-16">
            <p className="text-xl text-red-600 mb-4">Please login to view your wishlist</p>
            <Link
              to="/products"
              className="mt-4 inline-block px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-16">
            <p className="text-xl text-red-600 mb-4">{error}</p>
            <Link
              to="/products"
              className="mt-4 inline-block px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Wishlist{' '}
            <span className="text-gray-600">({wishlistItems.length} items)</span>
          </h1>
        </div>

        {/* Wishlist Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 ">
          {wishlistItems.map((item) => {
            const product = item.product || item;
            const productId = product._id || product.id;
            return (
              <WishlistCard
                key={item._id || productId}
                product={product}
                onMoveToCart={() => moveToCart(productId)}
                onShowSimilar={() => showSimilar(productId)}
                onRemove={() => handleRemoveFromWishlist(productId)}
              />
            );
          })}
        </div>

        {/* Empty State */}
        {wishlistItems.length === 0 && (
          <div className="text-center py-16">
            <p className="text-xl text-gray-600">Your wishlist is empty</p>
            <Link
              to="/products"
              className="mt-4 inline-block px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800"
            >
              Continue Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

const WishlistCard = ({ product, onMoveToCart, onShowSimilar, onRemove }) => {
    const isOutOfStock = product.stock === 0 || !product.inStock;
    const productId = product._id || product.id;
  
    return (
      <div className="bg-[#F2E6E1] rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow relative">
        {/* Remove Button */}
        <button
          onClick={onRemove}
          className="absolute top-2 right-2 z-10 w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-md transition-all hover:scale-110"
          type="button"
          title="Remove from wishlist"
        >
          <span className="text-gray-700 text-lg">×</span>
        </button>

        {/* Product Image */}
        <div className="relative aspect-square bg-[#F2E6E1] overflow-hidden group p-3 rounded-lg">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover rounded-md group-hover:scale-105 transition-transform duration-300"
          />
  
          {/* Out of Stock Overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-gray-900/60 flex items-center justify-center rounded-md">
              <span className="text-white font-semibold text-lg">Out of stock</span>
            </div>
          )}
        </div>
  
        {/* Product Info */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-1 uppercase text-sm tracking-wide">
            {product.brand}
          </h3>
          <p className="text-gray-700 text-sm mb-2 line-clamp-2 h-10">
            {product.name}
          </p>
  
          <p className="text-gray-900 font-semibold mb-3">
            Rs. {product.price != null ? Number(product.price).toLocaleString("en-IN") : "--"}
          </p>
  
          {/* Action Buttons */}
          <button
            onClick={isOutOfStock ? onShowSimilar : onMoveToCart}
            className="w-full py-2.5  bg-[#b89396] text-white rounded font-semibold text-sm uppercase hover:bg-gray-800 transition-colors"
          >
            {isOutOfStock ? 'Show Similar' : 'Move to Bag'}
          </button>
        </div>
      </div>
    );
  };
  

export default WishlistPage;

