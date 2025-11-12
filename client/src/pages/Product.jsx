import React, { useState } from 'react';
import { Heart, ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';

// demo images
import partyWear from "../Images/demoCategory/party-wear.jpg";
import premiumEdit from "../Images/demoCategory/premium-edit.jpg";
import sparkleEdit from "../Images/demoCategory/sparkle-edit.jpg";
import weddingReady from "../Images/demoCategory/wedding-ready.jpg";
import dailyBling from "../Images/demoCategory/daily-bling.jpg";
import pearlTouch from "../Images/demoCategory/pearl-touch.jpg";

// demo products
import product1 from "../Images/demoCategory/category1.jpg";
import product2 from "../Images/demoCategory/category2.jpg";
import product3 from "../Images/demoCategory/category3.jpg";
import product4 from "../Images/demoCategory/category4.jpg";
import product5 from "../Images/demoCategory/category5.jpg";
import product6 from "../Images/demoCategory/category6.jpg";
import product7 from "../Images/demoCategory/category7.jpg";
import product8 from "../Images/demoCategory/category8.jpg";
import product9 from "../Images/demoCategory/category9.jpg";

const CategoryPage = () => {
  const [favorites, setFavorites] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    categories: ['Flats'],
    heelsType: '', // for the radio buttons
    sizes: [],
    colors: [],
    minPrice: 300,
    maxPrice: 1200
  });

  const [showFilters, setShowFilters] = useState(false);
  const [showHeelsOptions, setShowHeelsOptions] = useState(false);

  const categories = [
    { name: 'Party Wear', image: partyWear },
    { name: 'Premium Edit', image: premiumEdit },
    { name: 'Sparkle Edit', image: sparkleEdit },
    { name: 'Wedding Ready', image: weddingReady },
    { name: 'Daily Bling', image: dailyBling },
    { name: 'Pearl Touch', image: pearlTouch }
  ];

  const products = [
    { id: 1, brand: 'Tiara Steps', name: 'Women Open Toe Flats', price: 2199, image: product1 },
    { id: 2, brand: 'Tiara Steps', name: 'Women Open Toe Flats', price: 3199, image: product2 },
    { id: 3, brand: 'Tiara Steps', name: 'Women Open Toe Flats', price: 4199, image: product3 },
    { id: 4, brand: 'Tiara Steps', name: 'Women Open Toe Flats', price: 5199, image: product4 },
    { id: 5, brand: 'Tiara Steps', name: 'Women Open Toe Flats', price: 6699, image: product5 },
    { id: 6, brand: 'Tiara Steps', name: 'Women Open Toe Flats', price: 7199, image: product6 },
    { id: 7, brand: 'Tiara Steps', name: 'Women Open Toe Flats', price: 8199, image: product7 },
    { id: 8, brand: 'Tiara Steps', name: 'Women Open Toe Flats', price: 6899, image: product8 },
    { id: 9, brand: 'Tiara Steps', name: 'Women Open Toe Flats', price: 5899, image: product9 }
  ];

  const toggleFavorite = (id) => {
    setFavorites(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleFilter = (category, value) => {
    setFilters(prev => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter(v => v !== value)
        : [...prev[category], value]
    }));
  };

  const updateMaxPrice = (val) => {
    setFilters(prev => {
      const newMax = Math.max(Number(val), prev.minPrice);
      return { ...prev, maxPrice: newMax };
    });
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 py-6">
      {/* Category Slider */}
      <div className="bg-white rounded-lg shadow-sm py-4 px-3 mb-8">
        <div className="flex flex-wrap justify-center items-center gap-5 sm:gap-7 overflow-x-auto">
          {categories.map((cat, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center gap-3 min-w-[150px] sm:min-w-[180px] cursor-pointer transition-transform hover:-translate-y-1"
            >
              <div className="w-[120px] h-[120px] sm:w-[140px] sm:h-[140px] rounded-full overflow-hidden shadow-md">
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
              </div>
              <div className="text-sm sm:text-base font-semibold text-gray-800">{cat.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Filter Toggle */}
      <div className="flex justify-between items-center mb-5 md:hidden">
        <h2 className="text-lg font-semibold text-gray-800">All Products</h2>
        <button
          className="flex items-center gap-2 border border-gray-300 px-3 py-2 rounded-md bg-white text-gray-700 text-sm shadow-sm active:scale-[0.98]"
          onClick={() => setShowFilters(!showFilters)}
        >
          <SlidersHorizontal size={16} /> Filters
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className={`md:w-[320px] flex-shrink-0 ${showFilters ? 'block' : 'hidden'} md:block`}>
          <div className="space-y-5">
            
            {/* Categories */}
            <div className="bg-white p-5 rounded-lg shadow-sm">
              <div className="text-base font-semibold mb-4">Categories</div>
              <div className="flex flex-col gap-3">
                {['Flats', 'Sneakers', 'Wedges', 'Heels', 'Platform', 'Kolhapuri', 'Belly'].map(cat => (
                  <div key={cat}>
                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.categories.includes(cat)}
                        onChange={() => toggleFilter('categories', cat)}
                        className="hidden"
                      />
                      <div
                        className={`w-[18px] h-[18px] border-2 rounded border-gray-300 flex items-center justify-center transition-all ${
                          filters.categories.includes(cat) ? 'bg-pink-600 border-pink-600' : ''
                        }`}
                      >
                        {filters.categories.includes(cat) && <span className="text-white text-xs">✓</span>}
                      </div>
                      <span
                        className="text-sm text-gray-600"
                        onClick={() => cat === 'Heels' && setShowHeelsOptions(!showHeelsOptions)}
                      >
                        {cat}
                      </span>
                    </label>

                    {/* Sub-options for Heels */}
                    {cat === 'Heels' && showHeelsOptions && (
                      <div className="pl-7 mt-2 flex flex-col gap-2 text-sm text-gray-600">
                        {['Block Heels', 'Pencil Heels', 'Wedge Heels'].map(option => (
                          <label key={option} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="heelsType"
                              value={option}
                              checked={filters.heelsType === option}
                              onChange={(e) => setFilters({ ...filters, heelsType: e.target.value })}
                              className="accent-pink-600"
                            />
                            <span>{option}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Other filters below... */}
            {/* Size */}
            <div className="bg-white p-5 rounded-lg shadow-sm">
              <div className="text-base font-semibold mb-4">Size</div>
              <div className="grid grid-cols-4 gap-2.5">
                {['35','36','37','38','39','40','41','42'].map(size => (
                  <div
                    key={size}
                    className={`p-2 border rounded text-center text-[13px] cursor-pointer transition-all ${
                      filters.sizes.includes(size)
                        ? 'bg-pink-600 text-white border-pink-600'
                        : 'border-gray-300'
                    }`}
                    onClick={() => toggleFilter('sizes', size)}
                  >
                    {size}
                  </div>
                ))}
              </div>
            </div>

            {/* Color */}
            <div className="bg-white p-5 rounded-lg shadow-sm">
              <div className="text-base font-semibold mb-4">Colour</div>
              <div className="flex flex-wrap gap-2.5">
                {[
                  { name: 'Pink', color: '#FFC0CB' },
                  { name: 'Blush', color: '#F4C2C2' },
                  { name: 'Lavender', color: '#E6E6FA' },
                  { name: 'Cream', color: '#FFFDD0' },
                  { name: 'Yellow', color: '#FFD700' },
                  { name: 'Blue', color: '#4169E1' },
                  { name: 'Black', color: '#000000' }
                ].map(color => (
                  <div key={color.name} className="flex items-center gap-2 cursor-pointer">
                    <div
                      className="w-[25px] h-[25px] rounded-full border-2 border-gray-300"
                      style={{ backgroundColor: color.color }}
                    />
                    <span className="text-sm text-gray-600">{color.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Price */}
            <div className="bg-white p-5 rounded-lg shadow-sm">
              <div className="text-base font-semibold mb-4">Price</div>
              <div className="mt-4">
                <div className="flex justify-between text-[13px] text-gray-600 mb-2.5">
                  <span>Rs 0</span>
                  <span>Up to Rs {filters.maxPrice}</span>
                </div>
                <input
                  className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                  type="range"
                  min={0}
                  max={20000}
                  step={50}
                  value={filters.maxPrice}
                  onChange={(e) => updateMaxPrice(e.target.value)}
                  style={{
                    background: `linear-gradient(to right, #e91e63 0%, #e91e63 ${(filters.maxPrice / 20000) * 100}%, #eee ${(filters.maxPrice / 20000) * 100}%, #eee 100%)`
                  }}
                />
              </div>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <main className="flex-1">
          <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(230px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-6 sm:gap-8">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg overflow-hidden shadow-md transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative w-full pt-[100%] overflow-hidden">
                  <img src={product.image} alt={product.name} className="absolute top-0 left-0 w-full h-full object-cover transition-transform hover:scale-[1.08]" />
                  <button
                    className={`absolute top-3 right-3 w-[38px] h-[38px] rounded-full flex items-center justify-center transition-all duration-250 ${
                      favorites[product.id]
                        ? "bg-pink-600 text-white"
                        : "bg-white/85 hover:bg-white hover:scale-110"
                    }`}
                    onClick={() => toggleFavorite(product.id)}
                  >
                    <Heart size={18} fill={favorites[product.id] ? "white" : "none"} color={favorites[product.id] ? "white" : "#333"} />
                  </button>
                </div>
                <div className="p-4">
                  <div className="text-[13px] text-gray-600 uppercase tracking-wide mb-1">{product.brand}</div>
                  <div className="text-[15px] text-gray-800 mb-2.5 font-medium">{product.name}</div>
                  <div className="text-base font-semibold text-pink-600">Rs. {product.price}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-4 mt-[50px] py-[30px]">
            <button className="w-10 h-10 border border-gray-300 bg-white rounded flex items-center justify-center hover:bg-gray-100">
              <ChevronLeft size={20} />
            </button>
            {[1, 2, 3].map(num => (
              <div
                key={num}
                className={`w-10 h-10 border rounded flex items-center justify-center cursor-pointer transition-all text-sm ${
                  currentPage === num
                    ? 'bg-pink-600 text-white border-pink-600'
                    : 'border-gray-300 bg-white hover:bg-gray-100'
                }`}
                onClick={() => setCurrentPage(num)}
              >
                {num}
              </div>
            ))}
            <button className="w-10 h-10 border border-gray-300 bg-white rounded flex items-center justify-center hover:bg-gray-100">
              <ChevronRight size={20} />
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CategoryPage;
