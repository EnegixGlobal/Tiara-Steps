import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import TriangleLoader from "../components/TriangleLoader";
import EmptyImage from "../Images/empty-cart.png";
import Axios from "../Axios";
import FormReviews from "../components/FormReviews";
import ReturnRequestModal from "../components/ReturnRequestModal";
import { toast } from "react-toastify";

const MyOrders = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [currentProductId, setCurrentProductId] = useState(null);
  const [currentOrderId, setCurrentOrderId] = useState(null);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [currentProductItemId, setCurrentProductItemId] = useState(null);
  const navigate = useNavigate();
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("jwt");
      if (!token) {
        toast.error("Please login to view orders");
        setLoading(false);
        return;
      }
      
      // Check if token already has "Bearer" prefix
      const authToken = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
      
      const response = await Axios.get("/orders", {
        headers: {
          Authorization: authToken,
        },
      });
      
      if (response.data.success && response.data.orders) {
        console.log("Orders data:", response.data.orders);
        // Debug: Check delivery statuses
        response.data.orders.forEach((order, idx) => {
          console.log(`Order ${idx}: delivery_status = "${order.delivered}"`);
          order.items?.forEach((item, itemIdx) => {
            console.log(`  Item ${itemIdx}: returnRequest =`, item.returnRequest);
          });
        });
        setData(response.data.orders);
      } else {
        setData([]);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching orders:", error);
      const errorMessage = error.response?.data?.message || "Failed to fetch orders";
      toast.error(errorMessage);
      setData([]);
      setLoading(false);
    }
  };
  const openReviewModal = (status, id1, id2) => {
    if (status.toLowerCase() !== "delivered") {
      toast.error("You can only review delivered products.");
      return;
    }
    setShowModal(true);
    setCurrentProductId(id1);
    setCurrentOrderId(id2);
  };
  const submitReview = async (review, productId, orderId) => {
    try {
      console.log({
        rating: review.rating,
        review: review.opinion,
        productId,
        orderId,
      });
      const token = localStorage.getItem("jwt");
      const authToken = token?.startsWith("Bearer ") ? token : `Bearer ${token}`;
      const response = await Axios.put(
        "product/review",
        { rating: review.rating, review: review.opinion, productId, orderId },
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      if (response.data.success) {
        fetchData();
      }
      setShowModal(false);
    } catch (error) {
      console.log(error);
    }
  };

  const openReturnModal = (orderItem, productItem) => {
    const deliveryStatus = orderItem.delivered?.toLowerCase() || "";
    if (!deliveryStatus.includes("delivered")) {
      toast.error("You can only return items from delivered orders.");
      return;
    }

    // Check if return is already requested
    const returnStatus = productItem.returnRequest?.status || "none";
    if (returnStatus !== "none") {
      toast.info(`Return already ${returnStatus}`);
      return;
    }

    // Check if order is within return window (7 days)
    const orderDate = new Date(orderItem.createdAt);
    const daysSinceOrder = Math.floor(
      (Date.now() - orderDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysSinceOrder > 7) {
      toast.error("Return window has expired. Returns are only allowed within 7 days of delivery.");
      return;
    }

    setCurrentProduct(productItem);
    setCurrentOrderId(orderItem.id);
    setCurrentProductItemId(productItem.productItemId);
    setShowReturnModal(true);
  };

  const submitReturnRequest = async (returnData) => {
    try {
      const token = localStorage.getItem("jwt");
      const authToken = token?.startsWith("Bearer ") ? token : `Bearer ${token}`;
      const response = await Axios.post(
        "return/request",
        {
          orderId: currentOrderId,
          productId: currentProduct.id,
          reason: returnData.reason,
          returnQuantity: returnData.returnQuantity,
        },
        {
          headers: {
            Authorization: authToken,
          },
        }
      );

      if (response.data.success) {
        toast.success("Return request submitted successfully!");
        fetchData();
        setShowReturnModal(false);
      }
    } catch (error) {
      console.error("Return request error:", error);
      const errorMessage =
        error.response?.data?.message || 
        error.response?.data?.error ||
        "Failed to submit return request";
      toast.error(errorMessage);
      // Don't close modal on error so user can try again
    }
  };

  const getReturnStatusChip = (status) => {
    const s = status?.toLowerCase() || "none";
    let styles =
      "px-2 py-1 rounded-full text-xs font-semibold inline-block text-white";

    if (s === "requested") styles += " bg-yellow-500";
    else if (s === "approved") styles += " bg-blue-500";
    else if (s === "rejected") styles += " bg-red-500";
    else if (s === "returned" || s === "refunded") styles += " bg-green-500";
    else return null;

    return <span className={styles}>{status}</span>;
  };
  const getStatusChip = (status) => {
    const s = status.toLowerCase();
  
    let styles =
      "px-3 py-1 rounded-full text-xs font-semibold inline-block text-white";
  
    if (s === "delivered") styles += " bg-green-500";
    else if (s === "pending") styles += " bg-yellow-500";
    else if (s === "cancelled") styles += " bg-red-500";
    else if (s === "shipped") styles += " bg-blue-500";
    else styles += " bg-gray-400";
  
    return <span className={styles}>{status}</span>;
  };
  
  useEffect(() => {
    fetchData();
  }, []);
  if (loading) return <TriangleLoader height="500px" />;
  return (
    <div className="font-sans my-[2%] mx-[3%] mb-[4%]">
      <h1 className="text-2xl leading-8 font-semibold">My Orders</h1>
      <div className="flex flex-col my-4 w-full overflow-x-scroll">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="bg-gray-100 py-3 px-5 text-xs leading-4 font-bold uppercase tracking-wide text-center text-left">Product Details</th>
              <th className="bg-gray-100 py-3 px-5 text-xs leading-4 font-bold uppercase tracking-wide text-center">Order Date</th>
              <th className="bg-gray-100 py-3 px-5 text-xs leading-4 font-bold uppercase tracking-wide text-center">Order Status</th>
              <th className="bg-gray-100 py-3 px-5 text-xs leading-4 font-bold uppercase tracking-wide text-center">Return Status</th>
              <th className="bg-gray-100 py-3 px-5 text-xs leading-4 font-bold uppercase tracking-wide text-center">Total Price</th>
            </tr>
          </thead>
          <tbody>
            {data && data.length > 0 ? data.map((item, index) => (
              <tr key={index}>
                <td className="py-4 border-b-2 border-gray-200 text-sm leading-5 text-center">
                  {item.items.map((product, i) => (
                    <div key={i} className="flex justify-between py-3 px-4 items-center">
                      <div className="flex items-center">
                        <div className="w-16 h-16 flex-shrink-0">
                          <img
                            src={product.image}
                            alt="product"
                            className="object-contain w-full h-full rounded-[15%] bg-gray-100"
                          />
                        </div>
                        <div className="ml-3 text-left">
                          <p
                            className="text-base ml-3 w-[13rem] whitespace-nowrap overflow-hidden text-ellipsis"
                          >
                            {product.name}
                          </p>
                          <p className="text-sm ml-3">
                            {product.color}, size: {product.size}, {product.qty}{" "}
                            unit
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-center items-center flex-wrap gap-2">
                        <button
                          className="w-24 py-2.5 mx-1.5 text-white font-semibold rounded text-[15px] bg-[#A37478] border border-[#A37478] cursor-pointer hover:bg-[#8b686b] hover:border-[#8b686b] disabled:cursor-not-allowed disabled:opacity-50"
                          disabled={product.isReviewed}
                          onClick={() =>
                            openReviewModal(item.delivered, product.id, item.id)
                          }
                        >
                          {product.isReviewed ? "Reviewed" : "Review"}
                        </button>
                        {/* Return Button - Show for delivered orders */}
                        {(() => {
                          const deliveryStatus = String(item.delivered || "").toLowerCase().trim();
                          const returnStatus = product.returnRequest?.status;
                          
                          // Check if order is delivered (handles variations like "order delivered", "delivered", "order Delivered", etc.)
                          const isDelivered = deliveryStatus.includes("delivered");
                          
                          // Can return if status is "none", undefined (old orders), or null
                          const canReturn = !returnStatus || returnStatus === "none";
                          
                          if (isDelivered && canReturn) {
                            return (
                              <button
                                className="w-24 py-2.5 mx-1.5 text-white font-semibold rounded text-[15px] bg-orange-500 border border-orange-500 cursor-pointer hover:bg-orange-600 hover:border-orange-600"
                                onClick={() => openReturnModal(item, product)}
                                title="Return this product"
                              >
                                Return
                              </button>
                            );
                          }
                          return null;
                        })()}
                        <button
                          className="w-24 py-2.5 mx-1.5 text-white font-semibold rounded text-[15px] bg-[#A37478] border border-[#A37478] cursor-pointer hover:bg-[#8b686b] hover:border-[#8b686b]"
                          onClick={() => navigate(`/product/${product.slug}`)}
                        >
                          Buy Again
                        </button>
                      </div>
                    </div>
                  ))}
                </td>
                <td className="py-4 border-b-2 border-gray-200 text-sm leading-5 text-center">
                  {new Date(item.createdAt).toDateString()}
                </td>
                <td className="py-4 border-b-2 border-gray-200 text-sm leading-5 text-center">
                  {getStatusChip(item.delivered)}
                </td>
                <td className="py-4 border-b-2 border-gray-200 text-sm leading-5 text-center">
                  <div className="flex flex-col gap-2 items-center">
                    {item.items.map((product, i) => {
                      const returnStatus = product.returnRequest?.status || "none";
                      return (
                        <div key={i} className="flex flex-col items-center">
                          {returnStatus !== "none" ? (
                            <>
                              {getReturnStatusChip(returnStatus)}
                              {returnStatus === "returned" &&
                                product.returnRequest?.refundId && (
                                  <p className="text-xs text-gray-500 mt-1 text-center">
                                    Refund: {product.returnRequest.refundId}...
                                  </p>
                                )}
                            </>
                          ) : (
                            <span className="text-xs text-gray-400">-</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </td>
                <td className="py-4 border-b-2 border-gray-200 text-sm leading-5 text-center">₹{item.totalPrice}</td>
              </tr>
            )) : (
              <tr>
                <td colSpan="5" className="py-8 text-center text-gray-500">
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {(!data || data.length <= 0) && (
          <div className="flex justify-center items-center min-w-full flex-col gap-0">
            <img src={EmptyImage} alt="empty-cart" className="w-full max-w-[500px] h-auto my-4" />
            <p className="text-xl font-semibold text-gray-900 -mt-8 mb-8 text-center">Looks like you haven't purchased any items yet.</p>
          </div>
        )}
      </div>

      {showModal && (
        <FormReviews
          onClose={() => setShowModal(false)}
          onSubmit={(review) =>
            submitReview(review, currentProductId, currentOrderId)
          }
        />
      )}

      {showReturnModal && currentProduct && (
        <ReturnRequestModal
          onClose={() => setShowReturnModal(false)}
          onSubmit={submitReturnRequest}
          product={currentProduct}
          maxQuantity={currentProduct.qty}
        />
      )}
    </div>
  );
};

export default MyOrders;
