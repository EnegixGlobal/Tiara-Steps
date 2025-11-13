// import Header from "../components/Header";
// import { FaRegMap, FaPhoneAlt, FaClock } from "react-icons/fa";
// import { FiMail } from "react-icons/fi";
// import ContactForm from "../components/ContactForm";

// const ContactPage = () => {
//   const combinedText = {
//     text1: "#lets's_talk",
//     text2: "Leave A Message, We love to hear from you!",
//     url: "https://nike0197.netlify.app/assets/1-f4da6767.jpg",
//   };
//   return (
//     <>
//       <div>
//         <Header combinedText={combinedText} />
//       </div>
//       <div className="contact-details">
//         <div className="company-details">
//           <span>GET IN TOUCH</span>
//           <h2>Visit one of our agency location or contact us today</h2>
//           <h3>Head Office</h3>
//           <div className="contactAddress">
//             <ul type="none">
//               <li>
//                 <div>
//                   <FaRegMap />
//                 </div>{" "}
//                 Linking Road, Mumbai, Maharashtra
//               </li>
//               <li>
//                 <div>
//                   <FiMail />
//                 </div>{" "}
//                 contactus@tiarasteps.com
//               </li>
//               <li>
//                 <div>
//                   <FaPhoneAlt />
//                 </div>{" "}
//                 +91 1234567890
//               </li>
//               <li>
//                 <div>
//                   <FaClock />
//                 </div>{" "}
//                 Monday to Saturday: 9:00am to 10:00pm
//               </li>
//             </ul>
//           </div>
//         </div>
//         <div className="map">
//           <iframe
//             title="map"
//             src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3770.983463068892!2d72.83328527507607!3d19.064464682137803!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c91130392c07%3A0x3c47bf391c8de931!2sThadomal%20Shahani%20Engineering%20College!5e0!3m2!1sen!2sin!4v1692991846645!5m2!1sen!2sin"
//             height="450"
//             style={{ border: "0", width: "-webkit-fill-available" }}
//             allowFullScreen
//             loading="lazy"
//             referrerPolicy="no-referrer-when-downgrade"
//           ></iframe>
//         </div>
//       </div>
//       <ContactForm />
//     </>
//   );
// };

// export default ContactPage;


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
    <div className="font-sans m-0 p-0">
      {/* Hero Section */}
      <section className="flex items-center justify-center py-24 px-10 min-h-[400px] text-white text-center" style={{
        backgroundImage: `url(${bgImg})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}>

      </section>

      {/* Contact Section */}
      <section className="py-20 px-10 bg-gray-100">
        <div className="max-w-[1400px] mx-auto bg-white p-10 rounded-xl shadow-lg grid grid-cols-2 gap-10 lg:grid-cols-1">

          {/* Left Column */}
          <div className="flex flex-row justify-content-center">
            {/* Top: Get in Touch */}
            <div className="ml-[50px] mt-2">
              <h2 className="text-[34px] text-[#a87171] mb-2 font-semibold">GET IN TOUCH</h2>
              <p className="text-[30px] text-gray-800 mb-6 ">
                Visit one of our agency locations or contact us today
              </p>

              <h3 className="text-lg font-semibold mb-4 text-gray-800">Head Office</h3>

              <div className="flex flex-col gap-4 text-[15px] text-gray-600 mb-8">
                <div className="flex items-start gap-3">
                  <FiMail className="text-[20px] text-[#a87171] mt-1" />
                  <span>contactus@tiarasteps.com</span>
                </div>

                <div className="flex items-start gap-3">
                  <FiPhone className="text-[20px] text-[#a87171] mt-1" />
                  <span>+91 1234567890</span>
                </div>

                <div className="flex items-start gap-3">
                  <FiClock className="text-[20px] text-[#a87171] mt-1" />
                  <span>Monday to Saturday: 9:00am to 10:00pm</span>
                </div>

                <div className="flex items-start gap-3">
                  <FiMapPin className="text-[20px] text-[#a87171] mt-1" />
                  <span>Linking Road, Mumbai, Maharashtra</span>
                </div>
              </div>



            </div>

            {/* Top-right: Map */}
            <div className=" overflow-hidden  mb-10 w-[750px] ml-[30px] mt-[40px]">
              <iframe
                 src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3770.969887353291!2d72.82850807473652!3d19.06823095208257!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c90f7a1f98cd%3A0x4f67aaf3caa290b9!2sLinking%20Rd%2C%20Khar%20West%2C%20Mumbai%2C%20Maharashtra%20400052!5e0!3m2!1sen!2sin!4v1731052265000!5m2!1sen!2sin"
                width="100%"
                height="350"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                title="Office Location"
              ></iframe>
            </div>

          </div>

          {/* Right Column */}
          <div className="flex flex-row justify-content-center">
            {/* Bottom-: Contact Form */}
            <form className="flex flex-col gap-6 w-[650px] ml-[50px]" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="py-3.5 px-4 text-[15px] border border-gray-300 rounded-md outline-none focus:border-[#d4a5a5]"
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
                  className="py-3.5 px-4 text-[15px] border border-gray-300 rounded-md outline-none focus:border-[#d4a5a5]"
                  placeholder="Enter your email"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="py-3.5 px-4 text-[15px] border border-gray-300 rounded-md outline-none focus:border-[#d4a5a5]"
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
                  className="py-3.5 px-4 text-[15px] border border-gray-300 rounded-md outline-none focus:border-[#d4a5a5] resize-y min-h-[120px]"
                  placeholder="Enter your message"
                ></textarea>
              </div>

              <button
                type="submit"
                className="bg-[#9b7b7b] text-white py-4 px-8 text-base font-semibold rounded-md cursor-pointer transition-colors hover:bg-[#8a6b6b]"
              >
                Send
              </button>
            </form>

            {/* Bottom-right: Text */}
            <div className="flex flex-col ml-[100px] mt-[10px]">
              <h2 className="text-[66px] font-semibold text-gray-900 leading-snug mb-3">
                Let’s Stay in Touch,<br /> Fashionably
              </h2>
              <p className="text-[25px] text-gray-600 leading-relaxed">
                Reach out for personalized styling tips, size guidance, or product
                support.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default ContactUs;
