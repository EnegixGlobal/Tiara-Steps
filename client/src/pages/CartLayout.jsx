import CartItems from "../components/CartItems";
import { useCallback, useEffect, useState } from "react";
import Axios from "../Axios";
import useAuth from "../../hooks/useAuth";
import TriangleLoader from "../components/TriangleLoader";
import { toast } from "react-toastify";
import EmptyImage from "../Images/empty-cart.png";

const CartLayout = () => {
  const { auth, setAuth } = useAuth();
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(false);

  const token = localStorage.getItem("jwt");

  const updateData = useCallback(async (e) => {
    setData(e);
  }, []);

  const deleteItem = async (id, qty) => {
    try {
      const response = await Axios.delete(`/cart/delete/${id}`, {
        headers: {
          Authorization: token,
        },
      });
      if (response.data.success === true) {
        toast.success("Product removed from cart successfully");
        setData(response.data.cart);
        setAuth({ ...auth, cartSize: auth.cartSize - qty });
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  const fetchData = async () => {
    try {
      const response = await Axios.get("/cart", {
        headers: {
          Authorization: token,
        },
      });
      setData(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const handleCheckout = async () => {
    try {
      const response = await Axios.post(
        "/payment/create-checkout-session",
        { coupon: appliedCoupon ? couponCode.toUpperCase() : "" },
        { headers: { Authorization: localStorage.getItem("jwt") } }
      );

      if (response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const applyCoupon = (coupon) => {
    if (!data || data.items.length <= 0) return toast.error("Cart is empty.");
    const listOfCoupons = ["SUMILSUTHAR197", "NIKE2024"];
    if (listOfCoupons.includes(coupon.toUpperCase())) {
      setCouponCode(coupon);
      setAppliedCoupon(true);
      toast.success("Coupon applied successfully!");
    } else {
      toast.error("Invalid coupon code.");
    }
  };

  // useEffect(() => {
  //   if (localStorage.getItem("jwt") === null) {
  //     setLoading(false);
  //     return;
  //   }
  //   fetchData();
  // }, []);

  useEffect(() => {
    const demoCart = {
      totalPrice: 4998,
      items: [
        {
          _id: "demo1",
          qty: 1,
          size: 38,
          productId: {
            _id: "p1",
            name: "Women Party Heels",
            brand: "Tiara Steps",
            price: 2499,
            image:
              "https://img2.junaroad.com/uiproducts/21930405/pri_175_p-1746711615.jpg",
          },
        },
        {
          _id: "demo2",
          qty: 2,
          size: 39,
          productId: {
            _id: "p2",
            name: "Open Toe Flats",
            brand: "Tiara Steps",
            price: 1249,
            image:
              "https://img2.junaroad.com/uiproducts/21930405/pri_175_p-1746711615.jpg",
          },
        },
      ],
    };

    setData(demoCart);
    setLoading(false);
  }, []);


  if (loading) return <TriangleLoader height="500px" />;

  // Calculate delivery date (15 days from now)
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 15);
  const formattedDate = deliveryDate.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const discount = appliedCoupon ? 200 : 0;
  const subtotal = data?.totalPrice ? (data.totalPrice - data.totalPrice * 0.12) : 0;
  const tax = 0;
  const shipping = 60;
  const total = subtotal - discount + tax + shipping;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-12">
        <div className="flex items-center gap-4">
          <span className="text-gray-900 font-semibold">CART</span>
          <div className="w-16 h-0.5 bg-gray-300"></div>
          <span className="text-gray-400">ADDRESS</span>
          <div className="w-16 h-0.5 bg-gray-300"></div>
          <span className="text-gray-400">PAYMENT</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold">
                {data?.items?.length || 0} ITEMS
              </h2>
            </div>

            <div className="divide-y divide-gray-200">
              {data && data.items && data.items.length > 0 ? (
                data.items.map((item) => (
                  <CartItems
                    key={item._id}
                    cartId={item._id}
                    data={item.productId}
                    qty={item.qty}
                    size={item.size}
                    updateData={updateData}
                    deleteItem={() => deleteItem(item._id, item.qty)}
                  />
                ))
              ) : (
                <div className="flex justify-center items-center flex-col gap-4 py-12">
                  <img src={EmptyImage} alt="empty-cart" className="w-full max-w-[400px] h-auto" />
                  <p className="text-xl font-semibold text-gray-900 text-center">
                    Looks like you haven't added any items to the cart yet.
                  </p>
                </div>
              )}
            </div>
          </div>
          {/* Coupon Section */}
          {data && data.items && data.items.length > 0 && (
            <div className="px-6 py-4 bg-[#f7eaea] rounded-md mt-[20px]">
              <h3 className="text-[#8a5c5c] font-medium mb-3">Have a Coupon ?</h3>
              <div className="flex items-center bg-white rounded-md overflow-hidden border border-[#e6cfcf]">
                <input
                  type="text"
                  value={couponCode}
                  disabled={appliedCoupon}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Coupon code"
                  className={`flex-1 px-4 py-2 text-gray-600 placeholder-gray-400 focus:outline-none ${appliedCoupon ? "bg-green-50 text-green-600" : ""
                    }`}
                />
                <button
                  onClick={() => applyCoupon(couponCode)}
                  disabled={appliedCoupon}
                  className={`px-5 py-2 text-[#8a5c5c] font-medium hover:bg-[#f7eaea] transition-colors duration-300 ${appliedCoupon ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                >
                  Apply
                </button>
              </div>
            </div>
          )}

        </div>


        {/* Order Summary Section */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-gray-200 sticky top-4">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold">Order Summary</h2>
            </div>

            <div className="px-6 py-4 space-y-3">
              <div className="flex justify-between text-base">
                <span>Sub Total</span>
                <span className="font-semibold">Rs {subtotal.toFixed(2)}</span>
              </div>

              {appliedCoupon && (
                <div className="flex justify-between text-base text-green-600">
                  <span>Discount</span>
                  <span className="font-semibold">Rs {discount}</span>
                </div>
              )}

              <div className="flex justify-between text-base">
                <span>Tax</span>
                <span className="font-semibold">{tax}</span>
              </div>

              <div className="flex justify-between text-base">
                <span>Shipping</span>
                <span className="font-semibold">Rs {shipping}</span>
              </div>

              <div className="flex justify-between text-lg font-semibold pt-3 border-t border-gray-200">
                <span>Total</span>
                <span>Rs {total.toFixed(2)}</span>
              </div>
            </div>

            <div className="px-6 pb-6">
              <button
                onClick={handleCheckout}
                disabled={!data || data?.items?.length <= 0 || !auth}
                className={`w-full py-3 rounded-full font-semibold text-white ${!data || data?.items?.length <= 0 || !auth
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-black hover:bg-gray-800"
                  }`}
              >
                Proceed to next
              </button>
            </div>

            <div className="px-6 pb-6 text-center border-t border-gray-200 pt-4">
              <p className="text-sm text-gray-600">
                Estimated delivery by {formattedDate}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartLayout;