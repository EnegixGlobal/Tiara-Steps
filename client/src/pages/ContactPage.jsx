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

      {/* ----------- HERO BANNER ----------- */}
      <section className="w-full">
        <img
          src={bgImg}
          alt="Contact Banner"
          className="w-full h-auto object-cover"
        />
      </section>

      {/* ----------- CONTACT CONTENT ----------- */}
      <section className="py-16 px-6 bg-gray-100">
        <div className="max-w-[1300px] mx-auto bg-white p-8 md:p-12 rounded-xl shadow-lg 
                        grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* ------------ LEFT SIDE: DETAILS + MAP ------------ */}
          <div className="flex flex-col gap-10">

            {/* Contact Details */}
            <div>
              <h2 className="text-[30px] text-[#a87171] mb-2 font-semibold">
                GET IN TOUCH
              </h2>

              <p className="text-[24px] text-gray-800 mb-6 leading-tight">
                Visit one of our agency locations or contact us today
              </p>

              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                Head Office
              </h3>

              <div className="flex flex-col gap-4 text-[16px] text-gray-600">
                <div className="flex items-start gap-3">
                  <FiMail className="text-[20px] text-[#a87171]" />
                  <span>contactus@tiarasteps.com</span>
                </div>

                <div className="flex items-start gap-3">
                  <FiPhone className="text-[20px] text-[#a87171]" />
                  <span>+91 1234567890</span>
                </div>

                <div className="flex items-start gap-3">
                  <FiClock className="text-[20px] text-[#a87171]" />
                  <span>Mon - Sat: 9:00 AM – 10:00 PM</span>
                </div>

                <div className="flex items-start gap-3">
                  <FiMapPin className="text-[20px] text-[#a87171]" />
                  <span>Linking Road, Mumbai, Maharashtra</span>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="w-full h-[300px] overflow-hidden rounded-xl shadow">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3770.969887353291!2d72.82850807473652!3d19.06823095208257!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c90f7a1f98cd%3A0x4f67aaf3caa290b9!2sLinking%20Rd%2C%20Khar%20West%2C%20Mumbai%2C%20Maharashtra%20400052!5e0!3m2!1sen!2sin!4v1731052265000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen=""
                title="Office Location"
              ></iframe>
            </div>
          </div>

          {/* ------------ RIGHT SIDE: FORM + TEXT ------------ */}
          <div className="flex flex-col gap-10 justify-center">

            {/* Contact Form */}
            <form
              className="flex flex-col gap-6 w-full"
              onSubmit={handleSubmit}
            >
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="py-3 px-4 border border-gray-300 rounded-md outline-none 
                             focus:border-[#d4a5a5]"
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
                  className="py-3 px-4 border border-gray-300 rounded-md outline-none 
                             focus:border-[#d4a5a5]"
                  placeholder="Enter your email"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="py-3 px-4 border border-gray-300 rounded-md outline-none 
                             focus:border-[#d4a5a5]"
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
                  className="py-3 px-4 border border-gray-300 rounded-md outline-none 
                             focus:border-[#d4a5a5] resize-y min-h-[120px]"
                  placeholder="Enter your message"
                ></textarea>
              </div>

              <button
                type="submit"
                className="bg-[#9b7b7b] text-white py-3 px-6 rounded-md hover:bg-[#8a6b6b] 
                           transition font-semibold"
              >
                Send
              </button>
            </form>

            {/* Right Text */}
            <div>
              <h2 className="text-[34px] md:text-[50px] lg:text-[60px] font-semibold 
                             text-gray-900 leading-tight mb-3">
                Let’s Stay in Touch,<br /> Fashionably
              </h2>

              <p className="text-[18px] md:text-[22px] text-gray-600">
                Reach out for personalized styling tips, size guidance, or product support.
              </p>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
};

export default ContactUs;
