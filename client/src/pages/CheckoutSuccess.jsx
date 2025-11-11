import React from "react";
import { Link } from "react-router-dom";
import successImage from "../Images/success-transaction.gif";
const CheckoutSuccess = () => {
  return (
    <section className="flex p-16 items-center justify-center h-screen w-full bg-[#d4b8b8]">
      <div className="max-w-[40rem] text-wrap text-center">
        <div className="-mt-[17%] -mb-[12%]">
          <img
            src={successImage}
            alt="payment-success"
            className="h-[450px] max-[500px]:h-[350px] object-contain"
          />
        </div>
        <p className="text-3xl leading-8 text-gray-700 font-bold">Yay! Your payment is successful</p>
        <p className="mt-4 mb-8 text-gray-400 text-lg font-medium">
          Thank you for shopping with us. Your order will be delivered to your
          doorstep shortly. We hope you enjoy your purchase!
        </p>
        <Link
          to="/"
          className="py-3 px-8 rounded font-semibold bg-[#05D159] no-underline text-[#E8F6EA] text-base"
        >
          Back to homepage
        </Link>
      </div>
    </section>
  );
};

export default CheckoutSuccess;
