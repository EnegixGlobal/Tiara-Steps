import React from "react";
import { Link } from "react-router-dom";
import successImage from "../Images/success-transaction.gif";

const CheckoutSuccess = () => {
  return (
    <section className="relative min-h-screen w-full overflow-hidden px-6 py-12 sm:px-8 lg:px-12 bg-gradient-to-br from-[#f5e9dc] to-[#e1d5c8]">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/10 via-black/5 to-black/20 pointer-events-none" />

      <div className="relative z-10 flex items-center justify-center min-h-[80vh]">
        <div className="w-full max-w-2xl rounded-3xl border border-white/20 bg-white/30 backdrop-blur-xl px-10 py-12 text-center shadow-[0_20px_50px_rgba(0,0,0,0.25)]">
          
          {/* Success Animation */}
          <div className="flex justify-center -mt-6 mb-2">
            <img
              src={successImage}
              alt="payment-success"
              className="h-[260px] sm:h-[320px] md:h-[360px] object-contain drop-shadow-lg"
            />
          </div>

          {/* Title */}
          <h1 className="text-[clamp(1.8rem,4vw,2.5rem)] font-semibold text-gray-900 mb-3">
            Payment Successful 🎉
          </h1>

          {/* Subtitle */}
          <p className="text-gray-700/80 text-[1.05rem] leading-relaxed max-w-xl mx-auto mb-8">
            Thank you for shopping with <span className="font-semibold text-[#ab6a61]">Tiara Steps</span>.
            Your order has been placed successfully and will be delivered soon.
          </p>

          {/* CTA Button */}
          <div className="flex justify-center">
            <Link
              to="/products"
              className="
                inline-block bg-[#ba8780] text-white text-[0.95rem] font-semibold
                px-8 py-3 rounded-full no-underline
                shadow-[0_10px_30px_rgba(186,135,128,0.35)]
                transition-all duration-300 ease-in-out
                hover:bg-[#ab6a61] hover:-translate-y-0.5 
                hover:shadow-[0_14px_40px_rgba(186,135,128,0.45)]
              "
            >
              Continue Shopping
            </Link>
          </div>

          {/* Optional Link */}
          <p className="mt-6 text-sm text-gray-600">
            Want to track your order?{" "}
            <Link
              to="/orders"
              className="text-[#ab6a61] font-semibold underline-offset-4 hover:text-[#8e5851]"
            >
              View Orders
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default CheckoutSuccess;
