import { useEffect, useState } from "react";
import Star from "../components/Star";
import RatingContainer from "../components/RatingContainer";

const ProductDetails = () => {
  const [data, setData] = useState({});
  const [size, setSize] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [expandedSection, setExpandedSection] = useState(null);

  // ✅ Mock Data (for frontend testing)
  useEffect(() => {
    const mockProduct = {
      name: "Elegant Red Heels",
      brand: "Tiara Steps",
      price: 2999,
      image: "https://adn-static1.nykaa.com/nykdesignstudio-images/pub/media/catalog/product/f/b/fb98b11Heel033Cherry_2.jpg?tr=w-512",
      ratingScore: 40,
      ratings: [5, 4, 5, 5], // ✅ not empty
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

  // ✅ Re-enable helper functions
  const handleAddToCart = () => {
    alert("🛒 Product added to cart (frontend test only)");
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText("HAPPYDIWALI420");
    alert("Coupon code copied!");
  };

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  if (loading) return <p style={{ textAlign: "center" }}>Loading...</p>;

  return (
    // <div className="grid grid-cols-2  gap-[60px] max-w-[1400px] mx-auto p-10 lg:p-[30px] lg:gap-10 bg-white">
    //   {/* Left Side - Images */}
    //   <div className="flex flex-col gap-5 lg:max-w-[570px] lg:mx-auto">
    //     <div className="w-full aspect-square overflow-hidden bg-gray-100">
    //       <img src={data.image} alt={data.name} className="w-full h-full object-cover" />
    //     </div>
    //     <div className="grid grid-cols-4 gap-4">
    //       {[data.image, data.image, data.image, data.image].map((img, index) => (
    //         <div
    //           key={index}
    //           className={`aspect-square cursor-pointer border-2 rounded-lg overflow-hidden bg-gray-100 transition-colors ${selectedImage === index ? "border-black" : "border-transparent hover:border-gray-400"
    //             }`}
    //           onClick={() => setSelectedImage(index)}
    //         >
    //           <img src={img} alt={`Product ${index + 1}`} className="w-full h-full object-cover" />
    //         </div>
    //       ))}
    //     </div>
    //   </div>

    //   {/* Right Side - Product Info */}
    //   <div className="flex flex-col gap-6">
    //     <h1 className="text-lg font-semibold text-black uppercase tracking-wide m-0">{data.brand}</h1>
    //     <h2 className="text-2xl font-normal text-gray-800 m-0 leading-tight">{data.name}</h2>
    //     <div className="text-[28px] font-bold text-black ">Rs. {data.price}</div>

    //     {/* Rating */}
    //     <div className="flex items-center gap-4 py-4 ">
    //       <span className="text-[24px] text-gray-800 font-medium">
    //         {(data.ratingScore / data.ratings.length || 0).toFixed(1)} ★ |{" "}
    //         {data.ratings.length} Ratings
    //       </span>
    //     </div>

    //     {/* Size Selection */}
    //     <div className="my-3">
    //       <h3 className="text-base font-semibold text-black mb-4">Select Size</h3>
    //       <div className="flex flex-wrap gap-3">
    //         {data.sizeQuantity &&
    //           data.sizeQuantity.map((item) => (
    //             <button
    //               key={item.size}
    //               className={`min-w-[60px] h-[50px] px-5 border-[1.5px] rounded bg-white text-[15px] font-medium text-gray-800 cursor-pointer transition-all hover:border-black ${size === item.size.toString()
    //                   ? "bg-black text-white border-black"
    //                   : "border-gray-300"
    //                 }`}
    //               onClick={() => setSize(item.size.toString())}
    //             >
    //               {item.size}
    //             </button>
    //           ))}
    //       </div>
    //     </div>

    //     {/* Add to Cart */}
    //     <button
    //       className="w-full h-[55px] bg-black text-white border-none rounded text-base font-semibold uppercase tracking-wide cursor-pointer transition-colors my-2.5 hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
    //       onClick={handleAddToCart}
    //     >
    //       Add to Cart
    //     </button>

    //     {/* Product Details Accordion */}
    //     <div className="my-8 ">
    //       <div className="border-b border-gray-200">
    //         <button
    //           className="w-full flex justify-between items-center py-2 bg-transparent border-none text-sm font-medium text-black text-left cursor-pointer transition-colors hover:text-gray-600"
    //           onClick={() => toggleSection("details")}
    //         >
    //           <span>Product details and description</span>
    //           <span className="text-2xl font-light text-gray-600">
    //             {expandedSection === "details" ? "−" : "+"}
    //           </span>
    //         </button>
    //         {expandedSection === "details" && (
    //           <div className="pb-5 animate-slideDown">
    //             <p className="my-2.5 leading-relaxed text-gray-600 text-sm"><strong>Color:</strong> {data.color}</p>
    //             <p className="my-2.5 leading-relaxed text-gray-600 text-sm"><strong>Material:</strong> {data.material}</p>
    //           </div>
    //         )}
    //       </div>

    //       <div className="border-b border-gray-200">
    //         <button
    //           className="w-full flex justify-between items-center py-2 bg-transparent border-none text-sm font-medium text-black text-left cursor-pointer transition-colors hover:text-gray-600"
    //           onClick={() => toggleSection("details")}
    //         >
    //           <span>SHIPPING POLICY & FREE RETURNS POLICY</span>
    //           <span className="text-2xl font-light text-gray-600">
    //             {expandedSection === "details" ? "−" : "+"}
    //           </span>
    //         </button>
    //         {expandedSection === "details" && (
    //           <div className="pb-5 animate-slideDown">
    //             <p className="my-2.5 leading-relaxed text-gray-600 text-sm"><strong>Color:</strong> {data.color}</p>
    //             <p className="my-2.5 leading-relaxed text-gray-600 text-sm"><strong>Material:</strong> {data.material}</p>
    //           </div>
    //         )}
    //       </div>

    //       <div className="border-b border-gray-200">
    //         <button
    //           className="w-full flex justify-between items-center py-2 bg-transparent border-none text-sm font-medium text-black text-left cursor-pointer transition-colors hover:text-gray-600"
    //           onClick={() => toggleSection("details")}
    //         >
    //           <span>Manufacturer/Importer Details</span>
    //           <span className="text-2xl font-light text-gray-600">
    //             {expandedSection === "details" ? "−" : "+"}
    //           </span>
    //         </button>
    //         {expandedSection === "details" && (
    //           <div className="pb-5 animate-slideDown">
    //             <p className="my-2.5 leading-relaxed text-gray-600 text-sm"><strong>Color:</strong> {data.color}</p>
    //             <p className="my-2.5 leading-relaxed text-gray-600 text-sm"><strong>Material:</strong> {data.material}</p>
    //           </div>
    //         )}
    //       </div>

    //       <div className="border-b border-gray-200">
    //         <button
    //           className="w-full flex justify-between items-center py-2 bg-transparent border-none text-sm font-medium text-black text-left cursor-pointer transition-colors hover:text-gray-600"
    //           onClick={() => toggleSection("details")}
    //         >
    //           <span>Product Care</span>
    //           <span className="text-2xl font-light text-gray-600">
    //             {expandedSection === "details" ? "−" : "+"}
    //           </span>
    //         </button>
    //         {expandedSection === "details" && (
    //           <div className="pb-5 animate-slideDown">
    //             <p className="my-2.5 leading-relaxed text-gray-600 text-sm"><strong>Color:</strong> {data.color}</p>
    //             <p className="my-2.5 leading-relaxed text-gray-600 text-sm"><strong>Material:</strong> {data.material}</p>
    //           </div>
    //         )}
    //       </div>

    //     </div>


    //   </div>

    //   {/* ===== CUSTOMER REVIEWS SECTION ===== */}
    //   <div className="w-[1400px] mx-auto px-5">
    //     <h3 className="text-base font-semibold text-black mb-4">Customer Reviews</h3>

    //     <div className="flex justify-between items-center border border-gray-300 p-5 rounded-lg mt-4 bg-white shadow-sm flex-wrap gap-4">
    //       <div className="flex items-center gap-2.5">
    //         <Star rating={0} />
    //         <span className="text-gray-800 text-base">Be the first to write a review</span>
    //       </div>

    //       <button className="bg-gray-100 border-none py-3 px-8 font-medium text-gray-800 rounded cursor-pointer transition-colors hover:bg-gray-200">
    //         Write a review
    //       </button>
    //     </div>
    //   </div>


    //   {/* ===== SIMILAR PRODUCTS SECTION ===== */}
    //   <div className="grid grid-cols">
    //     <h3 className="text-base font-semibold text-black mb-4">Similar Products</h3>

    //     <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-6 mt-5">
    //       {[
    //         {
    //           image:
    //             "https://img2.junaroad.com/uiproducts/21930405/pri_175_p-1746711615.jpg",
    //           brand: "MODARE",
    //           name: "Women Open Toe Flats",
    //           price: 3199,
    //         },
    //         {
    //           image:
    //             "https://img2.junaroad.com/uiproducts/21930405/pri_175_p-1746711615.jpg",
    //           brand: "MODARE",
    //           name: "Women Open Toe Flats",
    //           price: 3199,
    //         },
    //         {
    //           image:
    //             "https://img2.junaroad.com/uiproducts/21930405/pri_175_p-1746711615.jpg",
    //           brand: "Tiara Steps",
    //           name: "Women Party Heels",
    //           price: 3199,
    //         },
    //         {
    //           image:
    //             "https://img2.junaroad.com/uiproducts/21930405/pri_175_p-1746711615.jpg",
    //           brand: "Tiara Steps",
    //           name: "Women Open Toe Flats",
    //           price: 3199,
    //         },
    //       ].map((item, index) => (
    //         <div key={index} className="text-left cursor-pointer relative">
    //           <div className="relative overflow-hidden rounded-lg">
    //             <img src={item.image} alt={item.name} className="w-full h-auto block transition-transform duration-400 ease-in-out hover:scale-105" />
    //             <button className="absolute top-2.5 right-2.5 bg-white border-none text-xl rounded-full w-[34px] h-[34px] cursor-pointer text-black">♡</button>
    //           </div>
    //           <div className="mt-2.5">
    //             <h4 className="text-sm text-gray-800 font-semibold">{item.brand}</h4>
    //             <p className="text-[13px] text-gray-600 my-1">{item.name}</p>
    //             <p className="text-sm text-black font-medium">{item.price}</p>
    //           </div>
    //         </div>
    //       ))}
    //     </div>
    //   </div>

    // </div>

    <div className="max-w-[1400px] mx-auto p-10 lg:p-[30px] bg-white">
      {/* ===== TOP GRID (IMAGES + DETAILS) ===== */}
      <div className="grid grid-cols-2 gap-[60px] lg:gap-10 l">
        {/* Left Side - Images */}
        <div className="flex flex-col gap-5 lg:max-w-[570px] lg:mx-auto">
          <div className="w-full aspect-square overflow-hidden bg-gray-100">
            <img src={data.image} alt={data.name} className="w-full h-full object-cover" />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {[data.image, data.image, data.image, data.image].map((img, index) => (
              <div
                key={index}
                className={`aspect-square cursor-pointer border-2 rounded-lg overflow-hidden bg-gray-100 transition-colors ${selectedImage === index
                  ? "border-black"
                  : "border-transparent hover:border-gray-400"
                  }`}
                onClick={() => setSelectedImage(index)}
              >
                <img src={img} alt={`Product ${index + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Product Info */}
        <div className="flex flex-col gap-6">
          <h1 className="text-lg font-semibold text-black uppercase tracking-wide m-0">
            {data.brand}
          </h1>
          <h2 className="text-2xl font-normal text-gray-800 m-0 leading-tight">
            {data.name}
          </h2>
          <div className="text-[28px] font-bold text-black">Rs. {data.price}</div>

          {/* Rating */}
          <div className="flex items-center gap-4 py-4">
            <span className="text-[24px] text-gray-800 font-medium">
              {(data.ratingScore / data.ratings.length || 0).toFixed(1)} ★ |{" "}
              {data.ratings.length} Ratings
            </span>
          </div>

          {/* Size Selection */}
          <div className="my-3">
            <h3 className="text-base font-semibold text-black mb-4">Select Size</h3>
            <div className="flex flex-wrap gap-3">
              {data.sizeQuantity?.map((item) => (
                <button
                  key={item.size}
                  className={`min-w-[60px] h-[50px] px-5 border-[1.5px] rounded bg-white text-[15px] font-medium text-gray-800 cursor-pointer transition-all hover:border-black ${size === item.size.toString()
                    ? "bg-black text-white border-black"
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
            className="w-full h-[55px] bg-black text-white border-none rounded text-base font-semibold uppercase tracking-wide cursor-pointer transition-colors my-2.5 hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>

          {/* Product Details Accordion */}
          {/* Product Details Accordion */}
          <div className="my-8 ">
            <div className="border-b border-gray-200">
              <button
                className="w-full flex justify-between items-center py-2 bg-transparent border-none text-sm font-medium text-black text-left cursor-pointer transition-colors hover:text-gray-600"
                onClick={() => toggleSection("details")}
              >
                <span>Product details and description</span>
                <span className="text-2xl font-light text-gray-600">
                  {expandedSection === "details" ? "−" : "+"}
                </span>
              </button>
              {expandedSection === "details" && (
                <div className="pb-5 animate-slideDown">
                  <p className="my-2.5 leading-relaxed text-gray-600 text-sm"><strong>Color:</strong> {data.color}</p>
                  <p className="my-2.5 leading-relaxed text-gray-600 text-sm"><strong>Material:</strong> {data.material}</p>
                </div>
              )}
            </div>

            <div className="border-b border-gray-200">
              <button
                className="w-full flex justify-between items-center py-2 bg-transparent border-none text-sm font-medium text-black text-left cursor-pointer transition-colors hover:text-gray-600"
                onClick={() => toggleSection("details")}
              >
                <span>SHIPPING POLICY & FREE RETURNS POLICY</span>
                <span className="text-2xl font-light text-gray-600">
                  {expandedSection === "details" ? "−" : "+"}
                </span>
              </button>
              {expandedSection === "details" && (
                <div className="pb-5 animate-slideDown">
                  <p className="my-2.5 leading-relaxed text-gray-600 text-sm"><strong>Color:</strong> {data.color}</p>
                  <p className="my-2.5 leading-relaxed text-gray-600 text-sm"><strong>Material:</strong> {data.material}</p>
                </div>
              )}
            </div>

            <div className="border-b border-gray-200">
              <button
                className="w-full flex justify-between items-center py-2 bg-transparent border-none text-sm font-medium text-black text-left cursor-pointer transition-colors hover:text-gray-600"
                onClick={() => toggleSection("details")}
              >
                <span>Manufacturer/Importer Details</span>
                <span className="text-2xl font-light text-gray-600">
                  {expandedSection === "details" ? "−" : "+"}
                </span>
              </button>
              {expandedSection === "details" && (
                <div className="pb-5 animate-slideDown">
                  <p className="my-2.5 leading-relaxed text-gray-600 text-sm"><strong>Color:</strong> {data.color}</p>
                  <p className="my-2.5 leading-relaxed text-gray-600 text-sm"><strong>Material:</strong> {data.material}</p>
                </div>
              )}
            </div>

            <div className="border-b border-gray-200">
              <button
                className="w-full flex justify-between items-center py-2 bg-transparent border-none text-sm font-medium text-black text-left cursor-pointer transition-colors hover:text-gray-600"
                onClick={() => toggleSection("details")}
              >
                <span>Product Care</span>
                <span className="text-2xl font-light text-gray-600">
                  {expandedSection === "details" ? "−" : "+"}
                </span>
              </button>
              {expandedSection === "details" && (
                <div className="pb-5 animate-slideDown">
                  <p className="my-2.5 leading-relaxed text-gray-600 text-sm"><strong>Color:</strong> {data.color}</p>
                  <p className="my-2.5 leading-relaxed text-gray-600 text-sm"><strong>Material:</strong> {data.material}</p>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* ===== CUSTOMER REVIEWS SECTION ===== */}
      <div className="mt-[80px] w-full">
        <div className="border border-gray-300 p-6 rounded-lg bg-white shadow-sm flex flex-col items-start gap-5">
          {/* Title */}
          <h3 className="text-[34px] font-semibold text-black">Customer Reviews</h3>

          {/* Stars + Text + Button in one row */}
          <div className="flex flex-row justify-start items-center w-full flex-wrap gap-10">
            <div className="flex items-center gap-20 ">
              <div className="flex flex-row scale-290 ml-[60px] ">  {/* Increase to 125% size */}
                <Star rating={0} />
              </div>
              <span className="text-gray-800 text-[36px]">
                Be the first to write a review
              </span>
            </div>

            <button className="bg-gray-100 border-none py-4 px-32 font-medium text-gray-800 rounded cursor-pointer transition-colors hover:bg-gray-200 ml-[200px]">
              Write a review
            </button>

          </div>
        </div>
      </div>


      {/* ===== SIMILAR PRODUCTS SECTION (Below Reviews) ===== */}
      <div className="mt-[60px] w-full">
        <h3 className="text-base font-semibold text-black mb-4">Similar Products</h3>

        {/* Grid: 4 columns on desktop, 2 on tablet, 1 on mobile */}
        <div className="grid grid-cols-4 md:grid-cols-4 sm:grid-cols-1 gap-5 mt-5">
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
              className="text-left cursor-pointer relative transition-transform hover:-translate-y-1"
            >
              <div className="relative overflow-hidden rounded-lg shadow-sm">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-[240px] object-cover block transition-transform duration-300 ease-in-out hover:scale-105"
                />
                <button className="absolute top-2.5 right-2.5 bg-white border-none text-xl rounded-full w-[32px] h-[32px] cursor-pointer text-black">
                  ♡
                </button>
              </div>

              <div className="mt-2">
                <h4 className="text-sm text-gray-800 font-semibold">{item.brand}</h4>
                <p className="text-[13px] text-gray-600 my-1 truncate">{item.name}</p>
                <p className="text-sm text-black font-medium">₹{item.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>

  );
};

export default ProductDetails;

