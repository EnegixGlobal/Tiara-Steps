import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { Heart } from "lucide-react";
import Axios from "../Axios";
import useAuth from "../../hooks/useAuth";
import useWishlist from "../../hooks/useWishlist";
import TriangleLoader from "../components/TriangleLoader";
import FormReviews from "../components/FormReviews";

const ProductDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { auth, setAuth } = useAuth();
  const {
    wishlistIds,
    fetchWishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
  } = useWishlist();
  const [data, setData] = useState({});
  const [size, setSize] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [expandedSection, setExpandedSection] = useState(null);
  const [addingToCart, setAddingToCart] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [editingReviewIndex, setEditingReviewIndex] = useState(null);
  const [deletingReviewIndex, setDeletingReviewIndex] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loadingSimilar, setLoadingSimilar] = useState(false);

  // ✅ Fetch Product Data from API
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

  useEffect(() => {
    if (slug) {
      fetchProduct();
    }
  }, [slug, navigate]);

  // ✅ Fetch Similar Products based on category
  const fetchSimilarProducts = async (productCategory, currentProductId) => {
    if (!productCategory) {
      setSimilarProducts([]);
      return;
    }

    try {
      setLoadingSimilar(true);

      // Parse category - it can be a comma-separated string or array
      let categories = [];
      if (typeof productCategory === 'string') {
        // Split by comma and clean up
        categories = productCategory.split(',').map(cat => cat.trim()).filter(Boolean);
      } else if (Array.isArray(productCategory)) {
        categories = productCategory;
      } else {
        setSimilarProducts([]);
        return;
      }

      if (categories.length === 0) {
        setSimilarProducts([]);
        return;
      }

      // Use the first category for filtering (or you can use all)
      const categoryToFilter = categories[0];

      // Fetch products with the same category, excluding current product
      const response = await Axios.get("/product/filter", {
        params: {
          page: 1,
          limit: 8, // Fetch more to randomize
          category: [categoryToFilter], // Pass as array for consistency with API
        },
      });

      if (response.data.success && response.data.products) {
        // Filter out current product and get random 4 products
        let filtered = response.data.products.filter(
          (p) => p._id !== currentProductId && p.slug !== slug
        );

        // Shuffle and take first 4
        const shuffled = filtered.sort(() => 0.5 - Math.random());
        setSimilarProducts(shuffled.slice(0, 4));
      } else {
        setSimilarProducts([]);
      }
    } catch (error) {
      console.error("Error fetching similar products:", error);
      setSimilarProducts([]);
    } finally {
      setLoadingSimilar(false);
    }
  };

  // Fetch similar products when product data is loaded
  useEffect(() => {
    if (data && data._id && data.category) {
      fetchSimilarProducts(data.category, data._id);
    }
  }, [data?._id, data?.category, slug]);

  // Fetch wishlist items when user is authenticated
  useEffect(() => {
    if (auth) fetchWishlist();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth]);

  // Toggle wishlist for similar products
  const toggleFavorite = async (productId, event) => {
    if (event) {
      event.stopPropagation();
    }

    if (!productId) {
      toast.error("Unable to update wishlist for this product", {
        position: "bottom-right",
      });
      return;
    }

    if (!auth) {
      toast.error("Please login to add items to wishlist", {
        position: "bottom-right",
      });
      navigate("/login");
      return;
    }

    const inList = isInWishlist(productId);

    try {
      if (inList) {
        await removeFromWishlist(productId);
        toast.success("Removed from wishlist", { position: "bottom-right" });
      } else {
        await addToWishlist(productId);
        toast.success("Added to wishlist", { position: "bottom-right" });
      }
    } catch (err) {
      console.error("Error toggling wishlist:", err);
      toast.error(err?.response?.data?.message || err.message || "Something went wrong", {
        position: "bottom-right",
      });
    }
  };

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

  // Handle review submission (new or edit)
  const handleSubmitReview = async (reviewData) => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      toast.error("Please login to submit a review", {
        position: "bottom-right",
      });
      navigate("/login");
      return;
    }

    try {
      // If editing, use edit endpoint
      if (editingReviewIndex !== null) {
        const response = await Axios.put(
          "/product/review/edit",
          {
            productId: data._id,
            reviewIndex: editingReviewIndex,
            rating: reviewData.rating,
            review: reviewData.opinion,
          },
          {
            headers: {
              Authorization: token,
            },
          }
        );

        if (response.data.success) {
          toast.success(response.data.message || "Review updated successfully", {
            position: "bottom-right",
          });
          setShowReviewModal(false);
          setEditingReviewIndex(null);
          // Refresh product data to show updated review
          await fetchProduct();
        }
      } else {
        // New review
        const response = await Axios.put(
          "/product/review",
          {
            rating: reviewData.rating,
            review: reviewData.opinion,
            productId: data._id,
            // orderId is optional now - can be omitted for direct product reviews
          },
          {
            headers: {
              Authorization: token,
            },
          }
        );

        if (response.data.success) {
          toast.success(response.data.message || "Review submitted successfully", {
            position: "bottom-right",
          });
          setShowReviewModal(false);
          // Refresh product data to show new review
          await fetchProduct();
        }
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      const errorMessage = error.response?.data?.message || "Failed to submit review";
      toast.error(errorMessage, {
        position: "bottom-right",
      });
    }
  };

  // Handle edit review
  const handleEditReview = (reviewIndex) => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      toast.error("Please login to edit a review", {
        position: "bottom-right",
      });
      navigate("/login");
      return;
    }
    setEditingReviewIndex(reviewIndex);
    setShowReviewModal(true);
  };

  // Handle delete review
  const handleDeleteReview = async (reviewIndex) => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      toast.error("Please login to delete a review", {
        position: "bottom-right",
      });
      navigate("/login");
      return;
    }

    // Confirm deletion
    if (!window.confirm("Are you sure you want to delete this review?")) {
      return;
    }

    try {
      setDeletingReviewIndex(reviewIndex);
      const response = await Axios.delete(
        "/product/review/delete",
        {
          data: {
            productId: data._id,
            reviewIndex: reviewIndex,
          },
          headers: {
            Authorization: token,
          },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message || "Review deleted successfully", {
          position: "bottom-right",
        });
        // Refresh product data to show updated reviews
        await fetchProduct();
      }
    } catch (error) {
      console.error("Error deleting review:", error);
      const errorMessage = error.response?.data?.message || "Failed to delete review";
      toast.error(errorMessage, {
        position: "bottom-right",
      });
    } finally {
      setDeletingReviewIndex(null);
    }
  };

  // Calculate average rating
  const averageRating = data.ratings && data.ratings.length > 0
    ? (data.ratingScore / data.ratings.length).toFixed(1)
    : 4.5;

  // Helper function to extract image URL from various formats
  const extractImageUrl = (img) => {
    if (!img) return null;
    if (typeof img === 'string') return img;
    if (typeof img === 'object') {
      return img.url || img.src || img.image || img.thumbnail || null;
    }
    return null;
  };

  // Get main image - same logic as Product.jsx card image
  // Priority: data.image -> data.thumbnail -> data.images[0]
  const getMainImageUrl = () => {
    // First priority: data.image
    if (data.image) {
      const extracted = extractImageUrl(data.image);
      if (extracted) return extracted;
    }

    // Second priority: data.thumbnail
    if (data.thumbnail) {
      const extracted = extractImageUrl(data.thumbnail);
      if (extracted) return extracted;
    }

    // Third priority: first image from images array (same as Product.jsx)
    if (data.images && Array.isArray(data.images) && data.images.length > 0) {
      const firstImage = data.images[0];
      const extracted = extractImageUrl(firstImage);
      if (extracted) return extracted;
    }

    return null;
  };

  const mainImageUrl = getMainImageUrl();

  // Get 4 thumbnail images from images array (excluding main image if it's in the array)
  const getThumbnailImages = () => {
    if (!data.images || !Array.isArray(data.images) || data.images.length === 0) {
      // If no images array, return empty (will show only main image)
      return [];
    }

    // Extract all image URLs from images array
    const allImages = data.images
      .map(extractImageUrl)
      .filter(Boolean); // Remove null/undefined values

    if (allImages.length === 0) {
      return [];
    }

    // Remove main image from the array if it exists
    const thumbnails = allImages.filter(img => img !== mainImageUrl);

    // If we removed the main image and have less than 4, we can add it back at the end if needed
    // But first, let's try to get 4 different images
    if (thumbnails.length >= 4) {
      return thumbnails.slice(0, 4);
    }

    // If we have less than 4 unique thumbnails, fill with remaining images
    // If main image was removed and we need more, we can add it back
    const result = [...thumbnails];

    // If main image exists and we need more images, add it back
    if (mainImageUrl && result.length < 4) {
      result.push(mainImageUrl);
    }

    // Fill remaining slots with the last available image
    while (result.length < 4 && result.length > 0) {
      result.push(result[result.length - 1]);
    }

    return result.slice(0, 4);
  };

  const thumbnailImages = getThumbnailImages();

  // Total 5 images: 1 main + 4 thumbnails
  // For display, we'll show main image separately and 4 thumbnails below
  const allProductImages = mainImageUrl
    ? [mainImageUrl, ...thumbnailImages]
    : thumbnailImages;

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
          <p className="text-lg text-[#b89396] mb-4">{error || "Product not found"}</p>
          <button
            onClick={() => navigate("/products")}
            className="px-6 py-2 bg-[#b89396] text-white rounded hover:bg-[#b89396] transition-colors"
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
              src={allProductImages[selectedImage] || mainImageUrl || ""}
              alt={data.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {/* Show 4 different thumbnail images (excluding main image) */}
            {thumbnailImages.length > 0 ? (
              thumbnailImages.map((img, index) => (
                <div
                  key={index}
                  className={`aspect-square cursor-pointer border-2 rounded-lg overflow-hidden bg-gray-100 transition-colors ${selectedImage === index + 1
                      ? "border-[#b89396]"
                      : "border-transparent hover:border-[#b89396]"
                    }`}
                  onClick={() => setSelectedImage(index + 1)}
                >
                  <img
                    src={img}
                    alt={`Product view ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))
            ) : (
              // If no thumbnails, show main image 4 times as fallback
              Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className={`aspect-square cursor-pointer border-2 rounded-lg overflow-hidden bg-gray-100 transition-colors ${selectedImage === index
                      ? "border-[#b89396]"
                      : "border-transparent hover:border-[#b89396]"
                    }`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img
                    src={mainImageUrl || ""}
                    alt={`Product view ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))
            )}
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
          <div className="my-10 bg-gray-100 rounded-2xl p-6 md:p-7">

            {/* Product Details */}
            <div className="border-b border-gray-300 py-3">
              <div
                className={`bg-white px-4 py-3 rounded-lg cursor-pointer flex items-center justify-between transition-all duration-300 text-[1.05rem] font-medium text-gray-800 shadow-sm hover:shadow-md ${expandedSection === "details" ? "bg-gray-50" : ""
                  }`}
                onClick={() => toggleSection("details")}
              >
                <span>Product details and description</span>
                <span className="text-[1.5rem] text-[#b89396]">
                  {expandedSection === "details" ? "−" : "+"}
                </span>
              </div>

              {expandedSection === "details" && (
                <div className="bg-gray-100 rounded-lg mt-2 px-4 py-3 transition-all duration-300">
                  <p className="my-2.5 leading-relaxed text-gray-600 text-sm">
                    <strong>Description:</strong> {data.description || "No description available"}
                  </p>
                  <p className="my-2.5 leading-relaxed text-gray-600 text-sm">
                    <strong>Color:</strong>{" "}
                    {Array.isArray(data.color) ? data.color.join(", ") : (data.color || "N/A")}
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

            {/* Shipping Policy */}
            <div className="border-b border-gray-300 py-3">
              <div
                className={`bg-white px-4 py-3 rounded-lg cursor-pointer flex items-center justify-between transition-all duration-300 text-[1.05rem] font-medium text-gray-800 shadow-sm hover:shadow-md ${expandedSection === "shipping" ? "bg-gray-50" : ""
                  }`}
                onClick={() => toggleSection("shipping")}
              >
                <span>SHIPPING POLICY & FREE RETURNS POLICY</span>
                <span className="text-[1.5rem] text-[#b89396]">
                  {expandedSection === "shipping" ? "−" : "+"}
                </span>
              </div>

              {expandedSection === "shipping" && (
                <div className="bg-gray-100 rounded-lg mt-2 px-4 py-3 transition-all duration-300">
                  <p className="my-2.5 leading-relaxed text-gray-600 text-sm">
                    We offer free shipping on all orders above Rs. 999. Standard delivery takes
                    3-5 business days. Express delivery (1-2 business days) is available for an
                    additional charge.
                  </p>
                  <p className="my-2.5 leading-relaxed text-gray-600 text-sm">
                    <strong>Free Returns:</strong> You can return any item within 7 days of
                    delivery for a full refund. Items must be in original condition with tags
                    attached.
                  </p>
                </div>
              )}
            </div>

            {/* Manufacturer Details */}
            <div className="border-b border-gray-300 py-3">
              <div
                className={`bg-white px-4 py-3 rounded-lg cursor-pointer flex items-center justify-between transition-all duration-300 text-[1.05rem] font-medium text-gray-800 shadow-sm hover:shadow-md ${expandedSection === "manufacturer" ? "bg-gray-50" : ""
                  }`}
                onClick={() => toggleSection("manufacturer")}
              >
                <span>Manufacturer/Importer Details</span>
                <span className="text-[1.5rem] text-[#b89396]">
                  {expandedSection === "manufacturer" ? "−" : "+"}
                </span>
              </div>

              {expandedSection === "manufacturer" && (
                <div className="bg-gray-100 rounded-lg mt-2 px-4 py-3 transition-all duration-300">
                  <p className="my-2.5 leading-relaxed text-gray-600 text-sm">
                    <strong>Brand:</strong> {data.brand || "N/A"}
                  </p>
                  <p className="my-2.5 leading-relaxed text-gray-600 text-sm">
                    For more information about the manufacturer, please contact our customer
                    service.
                  </p>
                </div>
              )}
            </div>

            {/* Product Care */}
            <div className="border-b border-gray-300 py-3">
              <div
                className={`bg-white px-4 py-3 rounded-lg cursor-pointer flex items-center justify-between transition-all duration-300 text-[1.05rem] font-medium text-gray-800 shadow-sm hover:shadow-md ${expandedSection === "care" ? "bg-gray-50" : ""
                  }`}
                onClick={() => toggleSection("care")}
              >
                <span>Product Care</span>
                <span className="text-[1.5rem] text-[#b89396]">
                  {expandedSection === "care" ? "−" : "+"}
                </span>
              </div>

              {expandedSection === "care" && (
                <div className="bg-gray-100 rounded-lg mt-2 px-4 py-3 transition-all duration-300">
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
                  <span key={i} className={i < Math.floor(averageRating) ? "text-yellow-400" : "text-gray-300"}>
                    ★
                  </span>
                ))}
              </div>

              {/* Review Text */}
              <span className="text-gray-800 text-lg sm:text-[22px] font-medium">
                {data.ratings && data.ratings.length > 0
                  ? `${data.ratings.length} Review${data.ratings.length > 1 ? "s" : ""}`
                  : "Be the first to write a review"}
              </span>
            </div>

            {/* Review Button */}
            <button
              onClick={() => {
                const token = localStorage.getItem("jwt");
                if (!token) {
                  toast.error("Please login to write a review", {
                    position: "bottom-right",
                  });
                  navigate("/login");
                  return;
                }
                setEditingReviewIndex(null);
                setShowReviewModal(true);
              }}
              className="bg-gray-100 py-3 px-6 sm:px-10 text-sm sm:text-base font-medium text-gray-800 rounded transition-colors hover:bg-gray-200"
            >
              Write a review
            </button>
          </div>

          {/* Reviews List */}
          {data.ratings && data.ratings.length > 0 && (
            <div className="mt-6 space-y-6 border-t border-gray-200 pt-6">
              {data.ratings.map((review, index) => {
                const isUserReview = auth && auth.name && review.name === auth.name;
                return (
                  <div key={index} className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold">
                          {review.name ? review.name.charAt(0).toUpperCase() : "A"}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{review.name || "Anonymous"}</p>
                          <p className="text-xs text-gray-500">
                            {review.date
                              ? new Date(review.date).toLocaleDateString("en-IN", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })
                              : "Recently"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={i < review.rating ? "text-yellow-400" : "text-gray-300"}>
                              ★
                            </span>
                          ))}
                        </div>
                        {isUserReview && (
                          <div className="flex items-center gap-3 ml-2">
                            <button
                              onClick={() => handleEditReview(index)}
                              className="text-[#4b3f3f]  transition-colors p-1.5 rounded hover:bg-gray-100"
                              title="Edit review"
                            >
                              <FiEdit2 size={18} />
                            </button>
                            <button
                              onClick={() => handleDeleteReview(index)}
                              disabled={deletingReviewIndex === index}
                              className="text-[#4b3f3f]  transition-colors p-1.5 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Delete review"
                            >
                              {deletingReviewIndex === index ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#b89396] border-t-transparent"></div>
                              ) : (
                                <FiTrash2 size={18} />
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    {review.review && (
                      <p className="text-gray-700 text-sm leading-relaxed pl-[52px]">
                        {review.review}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {(!data.ratings || data.ratings.length === 0) && (
            <div className="mt-6 text-center py-8 text-gray-500">
              <p>No reviews yet. Be the first to review this product!</p>
            </div>
          )}
        </div>
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <FormReviews
          onClose={() => {
            setShowReviewModal(false);
            setEditingReviewIndex(null);
          }}
          onSubmit={handleSubmitReview}
          editData={
            editingReviewIndex !== null && data.ratings && data.ratings[editingReviewIndex]
              ? {
                rating: data.ratings[editingReviewIndex].rating,
                review: data.ratings[editingReviewIndex].review,
              }
              : null
          }
        />
      )}

      {/* ===== SIMILAR PRODUCTS ===== */}
      {similarProducts.length > 0 && (
        <div className="mt-14 sm:mt-16">
          <h3 className="text-base sm:text-lg font-semibold text-black mb-4">
            Similar Products
          </h3>

          {loadingSimilar ? (
            <div className="flex justify-center items-center py-8">
              <TriangleLoader height="100px" />
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mt-5">
              {similarProducts.map((product) => {
                const productId = product._id || product.id;
                const productImage =
                  (Array.isArray(product.images) && product.images.length > 0)
                    ? product.images[0]
                    : product.image || "";
                const productSlug = product.slug || productId;
                const productBrand = product.brand?.name || product.brand || "Tiara Steps";
                const productName = product.name || "Untitled Product";
                const productPrice = product.price != null ? Number(product.price).toLocaleString("en-IN") : "--";
                const isFavorite = productId ? isInWishlist(productId) : false;

                return (
                  <div
                    key={productId || productSlug}
                    className="text-left cursor-pointer transition-transform hover:-translate-y-1"
                    onClick={() => navigate(`/product/${productSlug}`)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        navigate(`/product/${productSlug}`);
                      }
                    }}
                  >
                    <div className="relative overflow-hidden rounded-lg shadow-sm">
                      {productImage ? (
                        <img
                          src={productImage}
                          alt={productName}
                          className="w-full h-[220px] sm:h-[240px] object-cover transition-transform duration-300 ease-in-out hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-[220px] sm:h-[240px] bg-gray-100 flex items-center justify-center text-sm text-gray-400">
                          No Image
                        </div>
                      )}
                      <button
                        className={`absolute top-2 right-2 w-[30px] h-[30px] rounded-full flex items-center justify-center transition-all duration-250 ${isFavorite
                            ? "bg-[#A37478] text-white"
                            : "bg-white/85 hover:bg-white hover:scale-110"
                          }`}
                        onClick={(event) => toggleFavorite(productId, event)}
                        type="button"
                        title={isFavorite ? "Remove from wishlist" : "Add to wishlist"}
                      >
                        <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
                      </button>
                    </div>
                    <div className="mt-2">
                      <h4 className="text-sm sm:text-base text-gray-800 font-semibold">
                        {productBrand}
                      </h4>
                      <p className="text-xs sm:text-[13px] text-gray-600 my-1 truncate">
                        {productName}
                      </p>
                      <p className="text-sm sm:text-base font-medium text-black">
                        ₹{productPrice}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductDetails;