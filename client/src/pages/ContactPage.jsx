import React, { useState } from "react";
import { FiMail, FiPhone, FiClock, FiMapPin } from "react-icons/fi";
import bgImg from "../Images/demoCategory/contactPage.png";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you for contacting us! We will get back to you soon.");
    setFormData({ name: "", email: "", phone: "", message: "" });
  };

  return (
    <div className="font-sans w-full overflow-x-hidden">
      {/* ✅ HERO SECTION — FULL RECTANGULAR, NO GAP */}
      <section
        className="
          relative flex items-center justify-center 
          text-white text-center 
          w-full aspect-[16/4] sm:aspect-[21/9] lg:aspect-[24/5]
        "
        style={{
          backgroundImage: `url(${bgImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40 sm:bg-black/20"></div>

        <div className="relative z-10 px-4 sm:px-6">
         
        </div>
      </section>

      {/* ✅ CONTACT DETAILS & FORM */}
      <section className="py-10 sm:py-16 px-4 sm:px-8 md:px-12 bg-gray-100 w-full">
        <div
          className="
            w-full max-w-[1300px] mx-auto bg-white 
            p-5 sm:p-8 md:p-10 rounded-none sm:rounded-xl 
            shadow-lg grid grid-cols-1 lg:grid-cols-2 gap-10
          "
        >
          {/* LEFT SIDE — Contact Info */}
          <div className="flex flex-col justify-center w-full">
            <h2 className="text-2xl sm:text-3xl text-[#a87171] mb-2 font-semibold">
              GET IN TOUCH
            </h2>
            <p className="text-lg sm:text-xl text-gray-800 mb-6">
              Visit one of our agency locations or contact us today
            </p>

            <h3 className="text-base sm:text-lg font-semibold mb-4 text-gray-800">
              Head Office
            </h3>

            <div className="flex flex-col gap-4 text-sm sm:text-base text-gray-600 mb-8">
              <div className="flex items-start gap-3">
                <FiMail className="text-[18px] sm:text-[20px] text-[#a87171] mt-1" />
                <span>contactus@tiarasteps.com</span>
              </div>

              <div className="flex items-start gap-3">
                <FiPhone className="text-[18px] sm:text-[20px] text-[#a87171] mt-1" />
                <span>+91 1234567890</span>
              </div>

              <div className="flex items-start gap-3">
                <FiClock className="text-[18px] sm:text-[20px] text-[#a87171] mt-1" />
                <span>Monday to Saturday: 9:00am to 10:00pm</span>
              </div>

              <div className="flex items-start gap-3">
                <FiMapPin className="text-[18px] sm:text-[20px] text-[#a87171] mt-1" />
                <span>Linking Road, Mumbai, Maharashtra</span>
              </div>
            </div>

            {/* MAP */}
            <div className="overflow-hidden rounded-lg w-full">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3770.969887353291!2d72.82850807473652!3d19.06823095208257!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c90f7a1f98cd%3A0x4f67aaf3caa290b9!2sLinking%20Rd%2C%20Khar%20West%2C%20Mumbai%2C%20Maharashtra%20400052!5e0!3m2!1sen!2sin!4v1731052265000!5m2!1sen!2sin"
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                title="Office Location"
              ></iframe>
            </div>
          </div>

          {/* RIGHT SIDE — Form */}
          <div className="flex flex-col justify-center w-full">
            <form className="flex flex-col gap-5 w-full" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="py-3 px-4 text-[15px] border border-gray-300 rounded-md outline-none focus:border-[#d4a5a5]"
                  placeholder="Enter your name"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="py-3 px-4 text-[15px] border border-gray-300 rounded-md outline-none focus:border-[#d4a5a5]"
                  placeholder="Enter your email"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="py-3 px-4 text-[15px] border border-gray-300 rounded-md outline-none focus:border-[#d4a5a5]"
                  placeholder="Enter your phone number"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">Message</label>
                <textarea
                  name="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  className="py-3 px-4 text-[15px] border border-gray-300 rounded-md outline-none focus:border-[#d4a5a5] resize-y min-h-[120px]"
                  placeholder="Enter your message"
                ></textarea>
              </div>

              <button
                type="submit"
                className="bg-[#9b7b7b] text-white py-3 px-8 text-base font-semibold rounded-md cursor-pointer transition-colors hover:bg-[#8a6b6b]"
              >
                Send
              </button>
            </form>

            {/* FOOTER TEXT */}
            <div className="mt-10 text-center md:text-left">
              <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900 leading-snug mb-3">
                Let’s Stay in Touch,<br /> Fashionably
              </h2>
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                Reach out for personalized styling tips, size guidance, or
                product support.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactUs;
