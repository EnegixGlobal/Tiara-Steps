import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import TriangleLoader from "../components/TriangleLoader";
import EmptyImage from "../Images/empty-cart.png";
import Axios from "../Axios";
import FormReviews from "../components/FormReviews";
import { toast } from "react-toastify";

const MyOrders = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentProductId, setCurrentProductId] = useState(null);
  const [currentOrderId, setCurrentOrderId] = useState(null);
  const navigate = useNavigate();
  const fetchData = async () => {
    try {
      const response = await Axios.get("/orders", {
        headers: {
          Authorization: localStorage.getItem("jwt"),
        },
      });
      console.log(response.data.orders);
      setData(response.data.orders);
      setLoading(false);
    } catch (error) {
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
      const response = await Axios.put(
        "product/review",
        { rating: review.rating, review: review.opinion, productId, orderId },
        {
          headers: {
            Authorization: localStorage.getItem("jwt"),
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
              <th className="bg-gray-100 py-3 px-5 text-xs leading-4 font-bold uppercase tracking-wide text-center">Status</th>
              <th className="bg-gray-100 py-3 px-5 text-xs leading-4 font-bold uppercase tracking-wide text-center">Total Price</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
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
                      <div className="flex justify-center items-center">
                        <button
                          className="w-24 py-2.5 mx-1.5 text-white font-semibold rounded text-[15px] bg-[#A37478] border border-[#A37478] cursor-pointer hover:bg-[#8b686b] hover:border-[#8b686b] disabled:cursor-not-allowed disabled:opacity-50"
                          disabled={product.isReviewed}
                          onClick={() =>
                            openReviewModal(item.delivered, product.id, item.id)
                          }
                        >
                          {product.isReviewed ? "Reviewed" : "Review"}
                        </button>
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

                <td className="py-4 border-b-2 border-gray-200 text-sm leading-5 text-center">₹{item.totalPrice}</td>
              </tr>
            ))}
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
    </div>
  );
};

export default MyOrders;
