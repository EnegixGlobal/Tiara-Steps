import { useEffect, useState } from "react";

const ProductDetails = () => {
  const [data, setData] = useState({});
  const [size, setSize] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [expandedSection, setExpandedSection] = useState(null);

  // ✅ Mock Data
  useEffect(() => {
    const mockProduct = {
      name: "Elegant Red Heels",
      brand: "Tiara Steps",
      price: 2999,
      image:
        "https://adn-static1.nykaa.com/nykdesignstudio-images/pub/media/catalog/product/f/b/fb98b11Heel033Cherry_2.jpg?tr=w-512",
      ratingScore: 4,
      totalRatings: 38,
      color: "Red",
      material: "Synthetic",
      sizeQuantity: [
        { size: 36, quantity: 4 },
        { size: 37, quantity: 2 },
        { size: 38, quantity: 5 },
        { size: 39, quantity: 6 },
        { size: 40, quantity: 3 },
        { size: 41, quantity: 5 },
        { size: 42, quantity: 4 },
      ],
    };

    setData(mockProduct);
    setLoading(false);
  }, []);

  const handleAddToCart = () => {
    alert("🛒 Product added to cart (frontend test only)");
  };

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  if (loading) return <p className="text-center py-10">Loading...</p>;

  return (
    <div className="max-w-[1400px] mx-auto p-4 sm:p-6 md:p-10 bg-white">
      {/* ===== TOP GRID (IMAGES + DETAILS) ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14">
        {/* Left Side - Images */}
        <div className="flex flex-col gap-4">
          <div className="w-full aspect-square overflow-hidden bg-gray-100 rounded-lg">
            <img
              src={data.image}
              alt={data.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Thumbnail Images */}
          <div className="grid grid-cols-4 gap-3">
            {[data.image, data.image, data.image, data.image].map((img, index) => (
              <div
                key={index}
                className={`aspect-square cursor-pointer border-2 rounded-lg overflow-hidden transition-colors ${
                  selectedImage === index
                    ? "border-black"
                    : "border-transparent hover:border-gray-400"
                }`}
                onClick={() => setSelectedImage(index)}
              >
                <img
                  src={img}
                  alt={`Product ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Product Info */}
        <div className="flex flex-col gap-5 sm:gap-6">
          <h1 className="text-sm sm:text-base font-semibold text-black uppercase tracking-wide">
            {data.brand}
          </h1>

          <h2 className="text-xl sm:text-2xl md:text-3xl font-normal text-gray-800 leading-tight">
            {data.name}
          </h2>

          <div className="text-2xl sm:text-[28px] font-bold text-black">
            ₹{data.price}
          </div>

          {/* ⭐ Rating Section */}
          <div className="flex items-center gap-2 py-2 sm:py-4">
            <span className="text-lg sm:text-[20px] font-semibold text-gray-900">
              {data.ratingScore}
            </span>
            <span className="text-black text-lg sm:text-xl">★</span>
            <span className="text-gray-400 text-base sm:text-[18px]">|</span>
            <span className="text-gray-800 text-base sm:text-[18px]">
              {data.totalRatings} Ratings
            </span>
          </div>

          {/* Size Selection */}
          <div className="my-2 sm:my-3">
            <h3 className="text-base font-semibold text-black mb-3 sm:mb-4">
              Select Size
            </h3>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {data.sizeQuantity?.map((item) => (
                <button
                  key={item.size}
                  className={`min-w-[55px] sm:min-w-[60px] h-[45px] sm:h-[50px] px-4 border-[1.5px] rounded bg-white text-[14px] sm:text-[15px] font-medium text-gray-800 transition-all hover:border-black ${
                    size === item.size.toString()
                      ? "bg-black text-red-300 border-black"
                      : "border-gray-300"
                  }`}
                  onClick={() => setSize(item.size.toString())}
                >
                  {item.size}
                </button>
              ))}
            </div>
          </div>

          {/* Add to Cart */}
          <button
            className="w-full h-[50px] sm:h-[55px] bg-[#A37478] text-white rounded text-sm sm:text-base font-semibold uppercase tracking-wide transition-colors hover:bg-gray-800"
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>

          {/* Product Details Accordion */}
          <div className="my-6 sm:my-8">
            {[
              { key: "details", label: "Product details and description" },
              { key: "shipping", label: "Shipping Policy & Free Returns Policy" },
              { key: "manufacturer", label: "Manufacturer/Importer Details" },
              { key: "care", label: "Product Care" },
            ].map((section) => (
              <div key={section.key} className="border-b border-gray-200">
                <button
                  className="w-full flex justify-between items-center py-3 text-sm sm:text-base font-medium text-black text-left hover:text-gray-600"
                  onClick={() => toggleSection(section.key)}
                >
                  <span>{section.label}</span>
                  <span className="text-xl sm:text-2xl text-gray-600">
                    {expandedSection === section.key ? "−" : "+"}
                  </span>
                </button>
                {expandedSection === section.key && (
                  <div className="pb-4 text-sm sm:text-[15px] text-gray-600 leading-relaxed">
                    <p>
                      <strong>Color:</strong> {data.color}
                    </p>
                    <p>
                      <strong>Material:</strong> {data.material}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== CUSTOMER REVIEWS ===== */}
      <div className="mt-16 sm:mt-20 w-full">
        <div className="border border-gray-300 p-5 sm:p-6 rounded-lg bg-white shadow-sm flex flex-col gap-5">
          <h3 className="text-2xl sm:text-[34px] font-semibold text-black">
            Customer Reviews
          </h3>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5 sm:gap-10">
            <div className="flex items-center gap-4 sm:gap-6">
              {/* Stars Section */}
              <div className="flex items-center text-yellow-400 text-xl sm:text-2xl">
                {[...Array(5)].map((_, i) => (
                  <span key={i}>★</span>
                ))}
              </div>

              {/* Review Text */}
              <span className="text-gray-800 text-lg sm:text-[22px] font-medium">
                Be the first to write a review
              </span>
            </div>

            {/* Review Button */}
            <button className="bg-gray-100 py-3 px-6 sm:px-10 text-sm sm:text-base font-medium text-gray-800 rounded transition-colors hover:bg-gray-200">
              Write a review
            </button>
          </div>
        </div>
      </div>

      {/* ===== SIMILAR PRODUCTS ===== */}
      <div className="mt-14 sm:mt-16">
        <h3 className="text-base sm:text-lg font-semibold text-black mb-4">
          Similar Products
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mt-5">
          {[
            {
              image:
                "https://img2.junaroad.com/uiproducts/21930405/pri_175_p-1746711615.jpg",
              brand: "Tiara Steps",
              name: "Women Open Toe Flats",
              price: 3199,
            },
            {
              image:
                "https://img2.junaroad.com/uiproducts/21930405/pri_175_p-1746711615.jpg",
              brand: "Tiara Steps",
              name: "Women Open Toe Flats",
              price: 3199,
            },
            {
              image:
                "https://img2.junaroad.com/uiproducts/21930405/pri_175_p-1746711615.jpg",
              brand: "Tiara Steps",
              name: "Women Party Heels",
              price: 3199,
            },
            {
              image:
                "https://img2.junaroad.com/uiproducts/21930405/pri_175_p-1746711615.jpg",
              brand: "Tiara Steps",
              name: "Women Open Toe Flats",
              price: 3199,
            },
          ].map((item, index) => (
            <div
              key={index}
              className="text-left cursor-pointer transition-transform hover:-translate-y-1"
            >
              <div className="relative overflow-hidden rounded-lg shadow-sm">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-[220px] sm:h-[240px] object-cover transition-transform duration-300 ease-in-out hover:scale-105"
                />
                <button className="absolute top-2 right-2 bg-white text-xl rounded-full w-[30px] h-[30px] cursor-pointer">
                  ♡
                </button>
                
              </div>
              <div className="mt-2">
                <h4 className="text-sm sm:text-base text-gray-800 font-semibold">
                  {item.brand}
                </h4>
                <p className="text-xs sm:text-[13px] text-gray-600 my-1 truncate">
                  {item.name}
                </p>
                <p className="text-sm sm:text-base font-medium text-black">
                  ₹{item.price}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
