import CartItems from "../components/CartItems";
import AddressForm from "../components/AddressForm";
import { useCallback, useEffect, useState } from "react";
import Axios from "../Axios";
import useAuth from "../../hooks/useAuth";
import TriangleLoader from "../components/TriangleLoader";
import { toast } from "react-toastify";
import EmptyImage from "../Images/empty-cart.png";
import { MapPin, Plus, Edit2, Trash2 } from "lucide-react";

const CartLayout = () => {
  const { auth, setAuth } = useAuth();
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(false);
  const [currentStep, setCurrentStep] = useState("cart"); // cart, address, payment
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [loadingAddresses, setLoadingAddresses] = useState(false);

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

  const fetchAddresses = async () => {
    try {
      setLoadingAddresses(true);
      const response = await Axios.get("/address", {
        headers: { Authorization: token },
      });
      if (response.data.success) {
        setAddresses(response.data.addresses || []);
        // Set default address as selected
        const defaultAddr = response.data.addresses.find((addr) => addr.isDefault);
        if (defaultAddr) {
          setSelectedAddress(defaultAddr._id);
        } else if (response.data.addresses.length > 0) {
          setSelectedAddress(response.data.addresses[0]._id);
        }
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
    } finally {
      setLoadingAddresses(false);
    }
  };

  const handleProceedToAddress = () => {
    if (!data || data?.items?.length <= 0) {
      toast.error("Cart is empty");
      return;
    }
    setCurrentStep("address");
    fetchAddresses();
  };

  const handleAddressSave = () => {
    setShowAddressForm(false);
    setEditingAddress(null);
    fetchAddresses();
  };

  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm("Are you sure you want to delete this address?")) {
      return;
    }
    try {
      const response = await Axios.delete(`/address/${addressId}`, {
        headers: { Authorization: token },
      });
      if (response.data.success) {
        toast.success("Address deleted successfully");
        fetchAddresses();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete address");
    }
  };

  const handleContinueToPayment = () => {
    if (!selectedAddress) {
      toast.error("Please select an address");
      return;
    }
    setCurrentStep("payment");
    handleCheckout();
  };

  const handleStepClick = (step) => {
    // Only allow navigation between cart and address
    if (step === "cart") {
      setCurrentStep("cart");
    } else if (step === "address") {
      // Only allow going to address if cart has items
      if (data && data.items && data.items.length > 0) {
        setCurrentStep("address");
        // Fetch addresses if not already loaded
        if (addresses.length === 0) {
          fetchAddresses();
        }
      } else {
        toast.error("Cart is empty");
      }
    }
    // Payment step is not clickable as it's handled by Razorpay
  };

  const handleCheckout = async () => {
    try {
      // Create Razorpay order
      const response = await Axios.post(
        "/payment/create-order",
        { 
          coupon: appliedCoupon ? couponCode.toUpperCase() : "",
          addressId: selectedAddress,
        },
        { headers: { Authorization: localStorage.getItem("jwt") } }
      );

      if (response.data.success && response.data.orderId) {
        console.log("Payment response:", response.data); // Debug log
        
        // Format product description for Razorpay modal
        const formatProductDescription = () => {
          // Fallback if no product data
          if (!response.data.products || response.data.products.length === 0) {
            const total = response.data.total || (response.data.amount / 100);
            return `Order Payment - Total: ₹${total}`;
          }
          
          const products = response.data.products;
          const totalItems = products.reduce((sum, p) => sum + (p.quantity || 1), 0);
          
          // Build a detailed single-line description (Razorpay displays this in the modal)
          let description = `${totalItems} item${totalItems > 1 ? 's' : ''}: `;
          
          // List products with quantity, name, size, and price
          products.forEach((product, index) => {
            if (index < 2) { // Show first 2 products in detail
              const qty = product.quantity || 1;
              const name = product.name.length > 25 
                ? product.name.substring(0, 25) + '...' 
                : product.name;
              const size = product.size ? `Size ${product.size}` : '';
              const price = product.total ? `₹${product.total}` : '';
              
              description += `${qty}x ${name}`;
              if (size) description += ` (${size})`;
              if (price && products.length === 1) description += ` - ${price}`;
              if (index < Math.min(products.length, 2) - 1) description += ', ';
            }
          });
          
          if (products.length > 2) {
            description += ` +${products.length - 2} more`;
          }
          
          // Add pricing breakdown
          description += ` | Subtotal: ₹${response.data.subtotal || (response.data.amount / 100)}`;
          if (response.data.discount > 0) {
            description += ` | Discount: -₹${response.data.discount}`;
          }
          description += ` | Total: ₹${response.data.total || (response.data.amount / 100)}`;
          
          console.log("Payment Description:", description);
          console.log("Products data:", products);
          return description;
        };

        // Check if Razorpay script is already loaded
        const loadRazorpayScript = (callback) => {
          if (window.Razorpay) {
            callback();
            return;
          }

          // Check if script already exists
          const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
          if (existingScript) {
            existingScript.onload = callback;
            return;
          }

          // Load Razorpay script dynamically
          const script = document.createElement("script");
          script.src = "https://checkout.razorpay.com/v1/checkout.js";
          script.onload = callback;
          script.onerror = () => {
            toast.error("Failed to load payment gateway");
          };
          document.body.appendChild(script);
        };

        loadRazorpayScript(() => {
          const productImage = response.data.products && response.data.products.length > 0 
            ? response.data.products[0].image 
            : undefined;

          const options = {
            key: response.data.keyId,
            amount: response.data.amount,
            currency: response.data.currency,
            name: "Tiara Steps",
            description: formatProductDescription(),
            order_id: response.data.orderId,
            image: productImage,
            handler: async function (response) {
              // Verify payment on server
              try {
                const verifyResponse = await Axios.post(
                  "/payment/verify-payment",
                  {
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature,
                  },
                  { headers: { Authorization: localStorage.getItem("jwt") } }
                );

                if (verifyResponse.data.success) {
                  toast.success("Payment successful!");
                  window.location.href = "/checkout-success";
                } else {
                  toast.error("Payment verification failed");
                  // Fall back to address section on payment verification failure
                  setCurrentStep("address");
                }
              } catch (error) {
                console.error("Payment verification error:", error);
                toast.error(error?.response?.data?.message || "Payment verification failed");
                // Fall back to address section on payment verification failure
                setCurrentStep("address");
              }
            },
            prefill: {
              name: auth?.name || "",
              email: auth?.email || "",
            },
            theme: {
              color: "#000000",
            },
            modal: {
              ondismiss: function() {
                toast.info("Payment cancelled");
                // Fall back to address section when payment is cancelled
                setCurrentStep("address");
              },
            },
          };

          console.log("Razorpay options:", options); // Debug log
          const razorpay = new window.Razorpay(options);
          razorpay.open();
        });
      } else {
        console.error("Invalid response:", response.data);
        toast.error("Failed to create payment order");
        // Fall back to address section on payment order creation failure
        setCurrentStep("address");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error(error?.response?.data?.message || "Failed to initiate payment");
      // Fall back to address section on checkout error
      setCurrentStep("address");
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

  useEffect(() => {
    if (localStorage.getItem("jwt") === null) {
      setLoading(false);
      return;
    }
    fetchData();
  }, []);

  // ✅ Dummy Data - COMMENTED OUT
  // useEffect(() => {
  //   const demoCart = {
  //     totalPrice: 4998,
  //     items: [
  //       {
  //         _id: "demo1",
  //         qty: 1,
  //         size: 38,
  //         productId: {
  //           _id: "p1",
  //           name: "Women Party Heels",
  //           brand: "Tiara Steps",
  //           price: 2499,
  //           image:
  //             "https://img2.junaroad.com/uiproducts/21930405/pri_175_p-1746711615.jpg",
  //         },
  //       },
  //       {
  //         _id: "demo2",
  //         qty: 2,
  //         size: 39,
  //         productId: {
  //           _id: "p2",
  //           name: "Open Toe Flats",
  //           brand: "Tiara Steps",
  //           price: 1249,
  //           image:
  //             "https://img2.junaroad.com/uiproducts/21930405/pri_175_p-1746711615.jpg",
  //         },
  //       },
  //     ],
  //   };

  //   setData(demoCart);
  //   setLoading(false);
  // }, []);


  if (loading) return <TriangleLoader height="500px" />;

  // Calculate delivery date (15 days from now)
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 7);
  const formattedDate = deliveryDate.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const discount = appliedCoupon ? 200 : 0;
  // Calculate subtotal from cart items using real product prices
  const subtotal = data?.items?.reduce((sum, item) => {
    return sum + (item.productId?.price || 0) * (item.qty || 0);
  }, 0) || data?.totalPrice || 0;
  const tax = 0;
  const shipping = 0;
  const total = subtotal - discount + tax + shipping;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-12">
        <div className="flex items-center gap-4">
          <button
            onClick={() => handleStepClick("cart")}
            className={`font-semibold transition-colors ${
              currentStep === "cart"
                ? "text-gray-900 cursor-default"
                : currentStep === "address" || currentStep === "payment"
                ? "text-gray-600 hover:text-gray-900 cursor-pointer"
                : "text-gray-400 cursor-default"
            }`}
            disabled={currentStep === "cart"}
          >
            CART
          </button>
          <div className={`w-16 h-0.5 ${currentStep === "address" || currentStep === "payment" ? "bg-[#b89396]" : "bg-gray-300"}`}></div>
          <button
            onClick={() => handleStepClick("address")}
            className={`font-semibold transition-colors ${
              currentStep === "address"
                ? "text-gray-900"
                : currentStep === "payment"
                ? "text-[#b89396] hover:text-gray-900 cursor-pointer"
                : currentStep === "cart" && data?.items?.length > 0
                ? "text-gray-600 hover:text-gray-900 cursor-pointer"
                : "text-gray-400 cursor-not-allowed"
            }`}
            disabled={!data || data?.items?.length <= 0}
          >
            ADDRESS
          </button>
          <div className={`w-16 h-0.5 ${currentStep === "payment" ? "bg-[#b89396]" : "bg-gray-300"}`}></div>
          <span className={`font-semibold ${currentStep === "payment" ? "text-gray-900" : "text-gray-400"}`}>
            PAYMENT
          </span>
        </div>
      </div>

      {currentStep === "cart" && (
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
                onClick={handleProceedToAddress}
                disabled={!data || data?.items?.length <= 0 || !auth}
                className={`w-full py-3 rounded-full font-semibold text-white ${!data || data?.items?.length <= 0 || !auth
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#b89396] hover:bg-gray-800"
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
      )}

      {/* Address Section */}
      {currentStep === "address" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-xl font-semibold">Select Delivery Address</h2>
                <button
                  onClick={() => {
                    setShowAddressForm(true);
                    setEditingAddress(null);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-[#A37478] text-white rounded-md hover:bg-[#8b686b] transition-colors"
                >
                  <Plus size={18} />
                  Add New Address
                </button>
              </div>

              {showAddressForm ? (
                <div className="px-6 py-6">
                  <AddressForm
                    address={editingAddress}
                    isEdit={!!editingAddress}
                    onSave={handleAddressSave}
                    onCancel={() => {
                      setShowAddressForm(false);
                      setEditingAddress(null);
                    }}
                  />
                </div>
              ) : (
                <div className="px-6 py-6">
                  {loadingAddresses ? (
                    <div className="text-center py-8">
                      <TriangleLoader height="200px" />
                    </div>
                  ) : addresses.length > 0 ? (
                    <div className="space-y-4">
                      {addresses.map((address) => (
                        <div
                          key={address._id}
                          className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                            selectedAddress === address._id
                              ? "border-[#b89396] bg-[#ece1e1]"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          onClick={() => setSelectedAddress(address._id)}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <MapPin size={18} className="text-[#b89396]" />
                                <span className="font-semibold text-[#b89396]">
                                  {address.fullName}
                                </span>
                                {address.isDefault && (
                                  <span className="px-2 py-1 text-xs bg-pink-100 text-[#b89396] rounded">
                                    DEFAULT
                                  </span>
                                )}
                                <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded uppercase">
                                  {address.addressType}
                                </span>
                              </div>
                              <p className="text-gray-700 text-sm mb-1">
                                {address.addressLine1}
                              </p>
                              {address.addressLine2 && (
                                <p className="text-gray-700 text-sm mb-1">
                                  {address.addressLine2}
                                </p>
                              )}
                              {address.landmark && (
                                <p className="text-gray-600 text-sm mb-1">
                                  Near {address.landmark}
                                </p>
                              )}
                              <p className="text-gray-700 text-sm">
                                {address.city}, {address.state} - {address.pincode}
                              </p>
                              <p className="text-gray-700 text-sm mt-1">
                                Phone: {address.phone}
                              </p>
                            </div>
                            <div className="flex gap-2 ml-4">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingAddress(address);
                                  setShowAddressForm(true);
                                }}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                title="Edit address"
                              >
                                <Edit2 size={18} className="text-gray-600" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteAddress(address._id);
                                }}
                                className="p-2 hover:bg-red-50 rounded-full transition-colors"
                                title="Delete address"
                              >
                                <Trash2 size={18} className="text-[#b89396]" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <MapPin size={48} className="mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-600 mb-4">No addresses saved yet</p>
                      <button
                        onClick={() => setShowAddressForm(true)}
                        className="px-4 py-2 bg-[#A37478] text-white rounded-md hover:bg-[#8b686b] transition-colors"
                      >
                        Add New Address
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Order Summary - Same as cart step */}
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
                  onClick={handleContinueToPayment}
                  disabled={!selectedAddress}
                  className={`w-full py-3 rounded-full font-semibold text-white ${
                    !selectedAddress
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-[#b89396] hover:bg-gray-800"
                  }`}
                >
                  Continue to Payment
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
      )}
    </div>
  );
};

export default CartLayout;