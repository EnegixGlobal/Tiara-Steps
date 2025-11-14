import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Axios from "../Axios";
import useAuth from "../../hooks/useAuth";
import TriangleLoader from "../components/TriangleLoader";

const ProductDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { auth, setAuth } = useAuth();
  const [data, setData] = useState({});
  const [size, setSize] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [expandedSection, setExpandedSection] = useState(null);
  const [addingToCart, setAddingToCart] = useState(false);

  // ✅ Fetch Product Data from API
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await Axios.get(`/product/${slug}`);
        
        if (response.data.success && response.data.data) {
          setData(response.data.data);
        } else {
          setError("Product not found");
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        const errorMessage = err.response?.data?.message || "Failed to load product";
        setError(errorMessage);
        toast.error(errorMessage, {
          position: "bottom-right",
        });
        // Navigate back to products page after 2 seconds
        setTimeout(() => {
          navigate("/products");
        }, 2000);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProduct();
    }
  }, [slug, navigate]);

  // ✅ Mock Data (for frontend testing) - COMMENTED OUT
  // useEffect(() => {
  //   const mockProduct = {
  //     name: "Elegant Red Heels",
  //     brand: "Tiara Steps",
  //     price: 2999,
  //     image: "https://adn-static1.nykaa.com/nykdesignstudio-images/pub/media/catalog/product/f/b/fb98b11Heel033Cherry_2.jpg?tr=w-512",
  //     ratingScore: 40,
  //     ratings: [5, 4, 5, 5], // ✅ not empty
  //     color: "Red",
  //     material: "Synthetic",
  //     sizeQuantity: [
  //       { size: 36, quantity: 4 },
  //       { size: 37, quantity: 2 },
  //       { size: 38, quantity: 5 },
  //       { size: 39, quantity: 6 },
  //       { size: 40, quantity: 3 },
  //       { size: 41, quantity: 5 },
  //       { size: 42, quantity: 4 },
  //     ],
  //   };

  //   setData(mockProduct);
  //   setLoading(false);
  // }, []);

  // ✅ Add to Cart Function
  const handleAddToCart = async () => {
    // Check if user is authenticated
    const token = localStorage.getItem("jwt");
    if (!token) {
      toast.error("Please login to add items to cart", {
        position: "bottom-right",
      });
      navigate("/login");
      return;
    }

    // Check if size is selected
    if (!size) {
      toast.error("Please select a size", {
        position: "bottom-right",
      });
      return;
    }

    // Check if product has the selected size in stock
    const sizeItem = data.sizeQuantity?.find((item) => item.size.toString() === size);
    if (!sizeItem || sizeItem.quantity <= 0) {
      toast.error("Selected size is out of stock", {
        position: "bottom-right",
      });
      return;
    }

    try {
      setAddingToCart(true);
      const response = await Axios.post(
        "/cart/add",
        {
          productId: data._id,
          size: parseInt(size),
          qty: 1,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      if (response.data.message) {
        toast.success(response.data.message || "Product added to cart successfully", {
          position: "bottom-right",
        });
        // Update cart size in auth context
        if (auth && setAuth) {
          setAuth({ ...auth, cartSize: (auth.cartSize || 0) + 1 });
        }
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      const errorMessage = error.response?.data?.message || "Failed to add product to cart";
      toast.error(errorMessage, {
        position: "bottom-right",
      });
    } finally {
      setAddingToCart(false);
    }
  };

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  // Calculate average rating
  const averageRating = data.ratings && data.ratings.length > 0
    ? (data.ratingScore / data.ratings.length).toFixed(1)
    : 4.5;

  // Get available images - support both single image and multiple images
  // Option 1: If product has 'images' array, use that
  // Option 2: If product has only 'image' (single), use that and repeat
  // Option 3: Always show 4 thumbnails (fill with available images or repeat)
  const getProductImages = () => {
    // Check if product has multiple images array
    if (data.images && Array.isArray(data.images) && data.images.length > 0) {
      // If we have multiple images, use them and fill remaining slots if needed
      const images = [...data.images];
      // If we have less than 4 images, fill with the last image
      while (images.length < 4 && images.length > 0) {
        images.push(images[images.length - 1]);
      }
      // Return first 4 images
      return images.slice(0, 4);
    }
    // Fallback to single image field (backward compatibility)
    if (data.image) {
      return [data.image, data.image, data.image, data.image];
    }
    return [];
  };

  const productImages = getProductImages();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] bg-white">
        <TriangleLoader height="200px" />
      </div>
    );
  }

  if (error || !data || !data.name) {
    return (
      <div className="max-w-[1400px] mx-auto p-10 lg:p-[30px] bg-white">
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-lg text-red-600 mb-4">{error || "Product not found"}</p>
          <button
            onClick={() => navigate("/products")}
            className="px-6 py-2 bg-pink-600 text-white rounded hover:bg-pink-700 transition-colors"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto p-4 sm:p-6 md:p-10 bg-white">
      {/* ===== TOP GRID (IMAGES + DETAILS) ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14">
        {/* Left Side - Images */}
        <div className="flex flex-col gap-5 lg:max-w-[570px] lg:mx-auto">
          <div className="w-full aspect-square overflow-hidden bg-gray-100">
            <img 
              src={productImages[selectedImage] || data.image} 
              alt={data.name} 
              className="w-full h-full object-cover" 
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {productImages.map((img, index) => (
              <div
                key={index}
                className={`aspect-square cursor-pointer border-2 rounded-lg overflow-hidden bg-gray-100 transition-colors ${
                  selectedImage === index
                    ? "border-[#b89396]"
                    : "border-transparent hover:border-[#b89396]"
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
          <div className="text-[28px] font-bold text-black">
            Rs. {data.price != null ? Number(data.price).toLocaleString("en-IN") : "--"}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-4 py-4">
            <span className="text-[24px] text-gray-800 font-medium">
              {averageRating} ★ |{" "}
              {data.ratings?.length || 10} Ratings
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
                  className={`min-w-[60px] h-[50px] px-5 border-[1.5px] rounded bg-white text-[15px] font-medium text-gray-800 cursor-pointer transition-all hover:border-[#b89396] ${size === item.size.toString()
                    ? "bg-black text-black border-[#b89396]"
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
            className="w-full h-[55px] bg-[#b89396] text-white border-none rounded text-base font-semibold uppercase tracking-wide cursor-pointer transition-colors my-2.5 hover:bg-[#8b5e3c] disabled:bg-gray-400 disabled:cursor-not-allowed"
            onClick={handleAddToCart}
            disabled={addingToCart || !size}
          >
            {addingToCart ? "Adding..." : "Add to Cart"}
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
                  <p className="my-2.5 leading-relaxed text-gray-600 text-sm">
                    <strong>Description:</strong> {data.description || "No description available"}
                  </p>
                  <p className="my-2.5 leading-relaxed text-gray-600 text-sm">
                    <strong>Color:</strong> {data.color || "N/A"}
                  </p>
                  <p className="my-2.5 leading-relaxed text-gray-600 text-sm">
                    <strong>Material:</strong> {data.material || "N/A"}
                  </p>
                  <p className="my-2.5 leading-relaxed text-gray-600 text-sm">
                    <strong>Category:</strong> {data.category || "N/A"}
                  </p>
                  <p className="my-2.5 leading-relaxed text-gray-600 text-sm">
                    <strong>SKU:</strong> {data.sku || "N/A"}
                  </p>
                </div>
              )}
            </div>

            <div className="border-b border-gray-200">
              <button
                className="w-full flex justify-between items-center py-2 bg-transparent border-none text-sm font-medium text-black text-left cursor-pointer transition-colors hover:text-gray-600"
                onClick={() => toggleSection("shipping")}
              >
                <span>SHIPPING POLICY & FREE RETURNS POLICY</span>
                <span className="text-2xl font-light text-gray-600">
                  {expandedSection === "shipping" ? "−" : "+"}
                </span>
              </button>
              {expandedSection === "shipping" && (
                <div className="pb-5 animate-slideDown">
                  <p className="my-2.5 leading-relaxed text-gray-600 text-sm">
                    We offer free shipping on all orders above Rs. 999. Standard delivery takes 3-5 business days. 
                    Express delivery (1-2 business days) is available for an additional charge.
                  </p>
                  <p className="my-2.5 leading-relaxed text-gray-600 text-sm">
                    <strong>Free Returns:</strong> You can return any item within 7 days of delivery for a full refund. 
                    Items must be in original condition with tags attached.
                  </p>
                </div>
              )}
            </div>

            <div className="border-b border-gray-200">
              <button
                className="w-full flex justify-between items-center py-2 bg-transparent border-none text-sm font-medium text-black text-left cursor-pointer transition-colors hover:text-gray-600"
                onClick={() => toggleSection("manufacturer")}
              >
                <span>Manufacturer/Importer Details</span>
                <span className="text-2xl font-light text-gray-600">
                  {expandedSection === "manufacturer" ? "−" : "+"}
                </span>
              </button>
              {expandedSection === "manufacturer" && (
                <div className="pb-5 animate-slideDown">
                  <p className="my-2.5 leading-relaxed text-gray-600 text-sm">
                    <strong>Brand:</strong> {data.brand || "N/A"}
                  </p>
                  <p className="my-2.5 leading-relaxed text-gray-600 text-sm">
                    For more information about the manufacturer, please contact our customer service.
                  </p>
                </div>
              )}
            </div>

            <div className="border-b border-gray-200">
              <button
                className="w-full flex justify-between items-center py-2 bg-transparent border-none text-sm font-medium text-black text-left cursor-pointer transition-colors hover:text-gray-600"
                onClick={() => toggleSection("care")}
              >
                <span>Product Care</span>
                <span className="text-2xl font-light text-gray-600">
                  {expandedSection === "care" ? "−" : "+"}
                </span>
              </button>
              {expandedSection === "care" && (
                <div className="pb-5 animate-slideDown">
                  <p className="my-2.5 leading-relaxed text-gray-600 text-sm">
                    <strong>Material:</strong> {data.material || "N/A"}
                  </p>
                  <p className="my-2.5 leading-relaxed text-gray-600 text-sm">
                    Clean with a soft, dry cloth. Avoid exposure to water and direct sunlight. 
                    Store in a cool, dry place when not in use.
                  </p>
                </div>
              )}
            </div>

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
                  className="w-full h-[220px] sm:h-\[240px\] object-cover transition-transform duration-300 ease-in-out hover:scale-105"
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