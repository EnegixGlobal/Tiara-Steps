import React, { useState } from 'react';
import { Heart, ChevronLeft, ChevronRight } from 'lucide-react';

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

// Main Component
const CategoryPage = () => {
  const [favorites, setFavorites] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    categories: ['Flats'],
    sizes: [],
    colors: [],
    minPrice: 300,
    maxPrice: 1200
  });

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

  const updateMinPrice = (val) => {
    setFilters(prev => {
      const newMin = Math.min(Number(val), prev.maxPrice);
      return { ...prev, minPrice: newMin };
    });
  };

  const updateMaxPrice = (val) => {
    setFilters(prev => {
      const newMax = Math.max(Number(val), prev.minPrice);
      return { ...prev, maxPrice: newMax };
    });
  };

    return (

        <div className="max-w-[1400px] mx-auto p-5">
          <div className="bg-white rounded-lg shadow-sm py-4 px-3 mb-6">
            <div className="flex flex-wrap justify-center items-center gap-5 py-2.5 overflow-x-auto">
              {categories.map((cat, idx) => (
                <div key={idx} className="flex flex-col items-center gap-3 min-w-[180px] cursor-pointer transition-transform hover:-translate-y-1">
                  <div className="w-[140px] h-[140px] rounded-full bg-white flex items-center justify-center overflow-hidden shadow-md">
                    <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="text-base font-semibold text-gray-800">{cat.name}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-5">
            <div className="flex gap-[30px] ">
              <aside className="w-[320px] flex-shrink lg:[350px]">
                <div className="bg-white p-5 rounded-lg mb-5 shadow-sm">
                  <div className="flex items-center gap-2.5 text-base font-semibold mb-4 cursor-pointer">
                    <span className="text-xs">▼</span>
                    <span>Categories</span>
                  </div>
                  <div className="flex flex-col gap-3">
                    {['Flats', 'Sneakers', 'Wedges', 'Heels', 'Platform' , 'Kolhapuri', 'Belly'].map(cat => (
                      <label key={cat} className="flex items-center gap-2.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.categories.includes(cat)}
                          onChange={() => toggleFilter('categories', cat)}
                          className="hidden"
                        />
                        <div className={`w-[18px] h-[18px] border-2 rounded border-gray-300 flex items-center justify-center transition-all ${filters.categories.includes(cat) ? 'bg-pink-600 border-pink-600' : ''}`}>
                          {filters.categories.includes(cat) && <span className="text-white text-xs">✓</span>}
                        </div>
                        <span className="text-sm text-gray-600">{cat}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-5 rounded-lg mb-5 shadow-sm">
                  <div className="flex items-center gap-2.5 text-base font-semibold mb-4 cursor-pointer">
                    <span className="text-xs">▼</span>
                    <span>Size</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2.5">
                    {['35', '36', '37', '38', '39', '40', '41', '42'].map(size => (
                      <div
                        key={size}
                        className={`p-2 border rounded text-center text-[13px] cursor-pointer transition-all ${filters.sizes.includes(size) ? 'bg-pink-600 text-white border-pink-600' : 'border-gray-300'}`}
                        onClick={() => toggleFilter('sizes', size)}
                      >
                        {size}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-5 rounded-lg mb-5 shadow-sm">
                  <div className="flex items-center gap-2.5 text-base font-semibold mb-4 cursor-pointer">
                    <span className="text-xs">▼</span>
                    <span>Colour</span>
                  </div>
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
                        <div className="w-[25px] h-[25px] rounded-full border-2 border-gray-300" style={{ backgroundColor: color.color }} />
                        <span className="text-sm text-gray-600">{color.name}</span>
                      </div>
                    ))}
                  </div>
                  <div className="text-pink-600 text-sm cursor-pointer mt-2.5">show More</div>
                </div>

                <div className="bg-white p-5 rounded-lg mb-5 shadow-sm">
                  <div className="text-base font-semibold mb-4">
                    <span>Price</span>
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between text-[13px] text-gray-600 mb-2.5">
                      <span>Rs 0</span>
                      <span>Up to Rs {filters.maxPrice}</span>
                    </div>
                    <input
                      className="w-full h-1.5 bg-gradient-to-r from-pink-600 to-pink-600 bg-no-repeat rounded-full appearance-none cursor-pointer"
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
                    <div className="flex flex-wrap gap-2 mt-2.5">
                      {[999, 1999, 4999, 9999].map(v => (
                        <button
                          key={v}
                          className={`px-2.5 py-1.5 rounded-full border text-xs cursor-pointer transition-all ${filters.maxPrice === v ? 'bg-pink-600 text-white border-pink-600' : 'border-gray-300 bg-white'}`}
                          onClick={() => updateMaxPrice(v)}
                          type="button"
                        >
                          Up to Rs {v}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </aside>

              <main className="flex-1">
                <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-[30px] lg:grid-cols-[repeat(auto-fill,minmax(240px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] md:gap-5">
                  {products.map((product) => (
                    <div key={product.id} className="bg-white rounded-lg overflow-hidden shadow-md transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:shadow-lg">
                      <div className="relative w-full pt-[100%] rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center transition-all duration-300 hover:scale-[1.02] hover:shadow-md">
                        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center overflow-hidden">
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-400 ease-in-out hover:scale-[1.08]" />
                        </div>

                        <button
                          className={`absolute top-3 right-3 w-[38px] h-[38px] border-none rounded-full flex items-center justify-center cursor-pointer transition-all duration-250 z-[2] ${favorites[product.id] ? "bg-pink-600 text-white" : "bg-white/85 hover:bg-white hover:scale-110"}`}
                          onClick={() => toggleFavorite(product.id)}
                        >
                          <Heart
                            size={18}
                            fill={favorites[product.id] ? "white" : "none"}
                            color={favorites[product.id] ? "white" : "#333"}
                          />
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


                <div className="flex justify-center items-center gap-4 mt-[50px] py-[30px]">
                  <button className="w-10 h-10 border border-gray-300 bg-white rounded flex items-center justify-center cursor-pointer transition-all hover:bg-gray-100">
                    <ChevronLeft size={20} />
                  </button>
                  {[1, 2, 3].map(num => (
                    <div
                      key={num}
                      className={`w-10 h-10 border rounded flex items-center justify-center cursor-pointer transition-all text-sm ${currentPage === num ? 'bg-pink-600 text-white border-pink-600' : 'border-gray-300 bg-white hover:bg-gray-100'}`}
                      onClick={() => setCurrentPage(num)}
                    >
                      {num}
                    </div>
                  ))}
                  <button className="w-10 h-10 border border-gray-300 bg-white rounded flex items-center justify-center cursor-pointer transition-all hover:bg-gray-100">
                    <ChevronRight size={20} />
                  </button>
                </div>
              </main>
            </div>
          </div>
        </div>

    );

  
};

export default CategoryPage;