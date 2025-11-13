import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Demo data
const DEMO_WISHLIST = [
  {
    _id: '1',
    product: {
      _id: 'p1',
      slug: 'women-open-toe-flats',
      brand: 'MODARE',
      name: 'Women Open Toe Flats',
      price: 3199,
      stock: 10,
      inStock: true,
      image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=400&fit=crop'
    }
  },
  {
    _id: '2',
    product: {
      _id: 'p2',
      slug: 'tiara-luxe-slides',
      brand: 'TIARA',
      name: 'Tiara Luxe Slides - Trendy ankle style',
      price: 1299,
      stock: 5,
      inStock: true,
      image: 'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=400&h=400&fit=crop'
    }
  },
  {
    _id: '3',
    product: {
      _id: 'p3',
      slug: 'bella-charm-heels',
      brand: 'BELLA',
      name: 'Bella Charm Heels - Elegant party wear',
      price: 999,
      stock: 0,
      inStock: false,
      image: 'https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?w=400&h=400&fit=crop'
    }
  },
  {
    _id: '4',
    product: {
      _id: 'p4',
      slug: 'classic-comfort-loafers',
      brand: 'COMFORT',
      name: 'Classic Comfort Loafers - Lightweight everyday wear',
      price: 799,
      stock: 0,
      inStock: false,
      image: 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=400&h=400&fit=crop'
    }
  },
  {
    _id: '5',
    product: {
      _id: 'p5',
      slug: 'crystal-bloom-heels',
      brand: 'CRYSTAL',
      name: 'Crystal Bloom Heels - Sparkling evening charm',
      price: 890,
      stock: 0,
      inStock: false,
      image: 'https://images.unsplash.com/photo-1596702062351-8c2c14d1fdd0?w=400&h=400&fit=crop'
    }
  },
  {
    _id: '6',
    product: {
      _id: 'p6',
      slug: 'midnight-glam-sandals',
      brand: 'MIDNIGHT',
      name: 'Midnight Glam Sandals - Chic black design',
      price: 745,
      stock: 8,
      inStock: true,
      image: 'https://images.unsplash.com/photo-1562183241-b937e95585b6?w=400&h=400&fit=crop'
    }
  },
  {
    _id: '7',
    product: {
      _id: 'p7',
      slug: 'rust-aura-flats',
      brand: 'AURA',
      name: 'Rust Aura Flats - Trendy daily comfort',
      price: 599,
      stock: 12,
      inStock: true,
      image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400&h=400&fit=crop'
    }
  },
  {
    _id: '8',
    product: {
      _id: 'p8',
      slug: 'silver-bow-slides',
      brand: 'SILVER',
      name: 'Silver Bow Slides - Graceful wedding style',
      price: 845,
      stock: 6,
      inStock: true,
      image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=400&fit=crop'
    }
  },
  {
    _id: '9',
    product: {
      _id: 'p9',
      slug: 'pearl-elegance-heels',
      brand: 'PEARL',
      name: 'Pearl Elegance Heels - Sophisticated design',
      price: 1199,
      stock: 4,
      inStock: true,
      image: 'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=400&h=400&fit=crop'
    }
  },
  {
    _id: '10',
    product: {
      _id: 'p10',
      slug: 'rose-gold-sandals',
      brand: 'ROSE',
      name: 'Rose Gold Sandals - Shimmering party footwear',
      price: 950,
      stock: 7,
      inStock: true,
      image: 'https://images.unsplash.com/photo-1549298222-1cacd8d2c90f?w=400&h=400&fit=crop'
    }
  }
];

const WishlistPage = () => {
  const [wishlistItems, setWishlistItems] = useState(DEMO_WISHLIST);
  const [loading, setLoading] = useState(false);

  const moveToCart = (productId) => {
    alert(`Moving product ${productId} to cart!`);
  };

  const showSimilar = (productId) => {
    alert(`Showing similar products for ${productId}`);
  };

  if (loading) return <div>Loading...</div>;

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
          {wishlistItems.map((item) => (
            <WishlistCard
              key={item._id}
              product={item.product}
              onMoveToCart={() => moveToCart(item.product._id)}
              onShowSimilar={() => showSimilar(item.product._id)}
            />
          ))}
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

const WishlistCard = ({ product, onMoveToCart, onShowSimilar }) => {
    const isOutOfStock = product.stock === 0 || !product.inStock;
  
    return (
      <div className="bg-[#F2E6E1] rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
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
            Rs. {product.price}
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

