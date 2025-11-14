import React, { useState } from "react";
import aboutImg from "../Images/demoCategory/aboutimg.png";
import aboutVideo from "../Images/demoCategory/about page video.mp4";

// feature icons
import targetIcon from "../Images/demoCategory/target.png";
import sparkleIcon from "../Images/demoCategory/sparkle.png";
import diamondIcon from "../Images/demoCategory/diamond.png";
import heelIcon from "../Images/demoCategory/high-heel.png";

const features = [
  { icon: targetIcon, text: "Designed to Impress" },
  { icon: sparkleIcon, text: "Comfort in Every Step" },
  { icon: diamondIcon, text: "Crafted with Care" },
  { icon: heelIcon, text: "Style for Every Step" },
];

const faqs = [
  {
    question: "What makes Tiara Steps different from other footwear brands?",
    answer:
      "Tiara focuses on combining luxury design with lasting comfort. Every shoe is handmade with premium materials and tested for all-day wearability.",
  },
  {
    question: "Are Tiara Steps heels comfortable for daily wear?",
    answer:
      "Absolutely! Each pair features cushioned insoles and ergonomic arches to support your feet through long days and events.",
  },
  {
    question: "How do I find my perfect shoe size?",
    answer:
      "We provide a detailed size chart on our product pages. You can also measure your foot length and compare it for a perfect fit.",
  },
  {
    question: "Do you offer customization or limited editions?",
    answer:
      "Yes! Tiara Steps releases exclusive limited-edition heels every season and offers custom designs on request.",
  },
  {
    question: "What is your exchange and return policy?",
    answer:
      "You can return or exchange unworn items within 7 days of delivery. Our process is simple and customer-friendly.",
  },
];

const About = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const toggleFAQ = (index) =>
    setActiveIndex(activeIndex === index ? null : index);

  return (
    <div className="font-poppins text-gray-800">
      {/* ---------- HERO ---------- */}
      <section className="max-w-[1400px] mx-auto my-16 px-6 lg:px-24">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 text-center lg:text-left">
          <div className="lg:w-2/3">
            <img
              src={aboutImg}
              alt="About Tiara Steps"
              className="w-full lg:w-[95%] rounded-xl object-cover lg:ml-[-15%]"
            />
          </div>
          <div className="lg:w-1/3 flex flex-col justify-center gap-2">
            <h1 className="text-[3rem] md:text-[3.5rem] lg:text-[3.9rem] font-playfair text-[#5d4345] mb-4">
              About
            </h1>
            <p className="text-[1.2rem] md:text-[1.4rem] font-light text-[#8b5e3c] mb-4">
              Where Elegance Walks with Confidence
            </p>
            <p className="text-[1.05rem] md:text-[1.25rem] leading-relaxed">
              At Tiara Steps, we craft footwear that blends style, comfort, and
              confidence in every step. From elegant heels to chic sandals, each
              design celebrates modern femininity with timeless grace and
              superior comfort — because every woman deserves to walk
              beautifully, every day.
            </p>
          </div>
        </div>
      </section>

      {/* ---------- FEATURES ---------- */}
      <section className="flex flex-col lg:flex-row justify-between items-stretch my-24 px-4 md:px-8 lg:px-12 gap-8 lg:gap-20 h-auto lg:h-[600px]">
        {/* Left */}
        <div className="flex-1 flex flex-col justify-center gap-10 p-4 md:p-8 lg:p-12 text-center lg:text-left">
          <h2 className="text-[2rem] md:text-[2.5rem] font-playfair uppercase text-[#111827]">
      What Makes Tiara Steps Unique
    </h2>

          <div className="flex flex-col gap-6">
      {features.map((f, i) => (
        <div key={i} className="flex items-center gap-4">
          <div className="bg-[#b88b8b] w-10 h-10 rounded-full flex items-center justify-center shrink-0">
            <img
              src={f.icon}
              alt={f.text}
              className="w-5 h-5 object-contain"
            />
          </div>

          <div className="bg-[#b88b8b] text-white text-[1rem] w-70 font-medium py-2.5 px-8 rounded-full hover:bg-[#a37474] transition-all duration-300">
            <p>{f.text}</p>
          </div>
        </div>
      ))}
    </div>
        </div>
        

        {/* Right Video */}
        <div className="flex-1 flex justify-center items-center">
          <video
            src={aboutVideo}
            autoPlay
            loop
            muted
            playsInline
            className="w-[90%] lg:w-[70%] h-[500px] rounded-xl object-cover shadow-lg"
          />
        </div>
      </section>


      {/* ---------- FAQ ---------- */}
      <section className="flex flex-col lg:flex-row justify-between items-start gap-10 px-6 md:px-12 py-16 bg-white">
        {/* Left */}
        <div className="flex-1 text-center lg:text-left">
          <h2 className="font-playfair text-[2rem] md:text-[2.8rem] uppercase tracking-wider text-gray-900 leading-tight">
            Frequently Asked Questions
          </h2>
        </div>

        {/* Right */}
        <div className="flex-[1.5]">
          <div className="bg-gray-100 rounded-2xl p-6 md:p-10">
            {faqs.map((faq, i) => (
              <div key={i} className="border-b border-gray-300 py-3">
                <div
                  className={`bg-white px-4 py-3 rounded-lg cursor-pointer flex items-center gap-4 transition-all duration-300 text-[1.05rem] font-medium text-gray-800 shadow-sm hover:shadow-md ${
                    activeIndex === i ? "bg-gray-50" : ""
                  }`}
                  onClick={() => toggleFAQ(i)}
                >
                  <span className="text-[1.5rem] text-[#b89396] w-6 text-center">
                    {activeIndex === i ? "−" : "+"}
                  </span>
                  <span>{faq.question}</span>
                </div>
                {activeIndex === i && (
                  <div className="bg-gray-100 rounded-lg mt-2 ml-0 lg:ml-12 px-4 py-3 transition-all duration-300">
                    <p className="text-[0.95rem] text-gray-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
