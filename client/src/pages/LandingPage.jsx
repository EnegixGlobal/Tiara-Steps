import { useEffect, useRef, useContext } from "react";
import image1 from "../Images/office-wear.png";
import image2 from "../Images/holiday-wear.png";
import image3 from "../Images/casual-wear.png";
import image4 from "../Images/party-wear.png";
import Card from "../components/Card";
import Container from "../components/Container";
import Countdown from "../components/Countdown";
import BannerSection from "../components/BannerSection";
import FeaturedIcon from "../components/FeaturedIcon";
import LandingBanner from "../components/LandingBanner";
import { useLocation } from "react-router-dom";
import { LoadingContext } from "./HomeLayout";
import { datas } from "../../public/dummyData";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import videoSrc from "../Images/demoCategory/bannerVideo.mp4"


// demo images
import partyWear from "../Images/demoCategory/party-wear.jpg";
import premiumEdit from "../Images/demoCategory/premium-edit.jpg";
import sparkleEdit from "../Images/demoCategory/sparkle-edit.jpg";
import weddingReady from "../Images/demoCategory/wedding-ready.jpg";
import dailyBling from "../Images/demoCategory/daily-bling.jpg";
import pearlTouch from "../Images/demoCategory/pearl-touch.jpg";


import img1 from "../Images/demoCategory/big4.png";
import img2 from "../Images/demoCategory/big5.png";


const LandingPage = () => {
  const { data, setData } = useContext(LoadingContext);
  const trendingRef = useRef(null);
  const scrollToTop = () => {
    trendingRef.current.scrollIntoView({ behavior: "smooth" });
  };
  const location = useLocation();
  useEffect(() => {
    if (location.state?.scrollToTop) {
      scrollToTop();
    }
  }, [location.state]);



  // const data = {
  //   featured: datas.featured,
  //   trending: datas.Products,
  // };

  const categories = [
    { name: 'Party Wear', image: partyWear },
    { name: 'Premium Edit', image: premiumEdit },
    { name: 'Sparkle Edit', image: sparkleEdit },
    { name: 'Wedding Ready', image: weddingReady },
    { name: 'Daily Bling', image: dailyBling },
    { name: 'Pearl Touch', image: pearlTouch }
  ];

  const collections = [
    {
      id: 1,
      title: "The Wedding Edit",
      image: partyWear,
    },
    {
      id: 2,
      title: "Party Glam",
      image: premiumEdit,
    },
    {
      id: 3,
      title: "Daily Bling ",
      image: sparkleEdit,
    },
    {
      id: 4,
      title: "Festive Collection",
      image: weddingReady,
    },
    {
      id: 5,
      title: "Timeless Embroidery",
      image: dailyBling,
    },
    {
      id: 6,
      title: "Pearl Touch",
      image: pearlTouch,
    },
  ];

  const bestsellers = [
    {
      id: 101,
      name: "Sandy Canvas Two Strap Slider",
      image: pearlTouch,
      price: 2999,
      originalPrice: 3999,
    },
    {
      id: 102,
      name: "Lazercut Tan Flats",
      image: partyWear, // tan flat shoes
      price: 3499,
      originalPrice: 4499,
    },
    {
      id: 103,
      name: "Spongy Pink Slip On",
      image: dailyBling, // pink slip-ons
      price: 999,
      originalPrice: 1299,
    },
    {
      id: 104,
      name: "Blushing Floral Flats",
      image: sparkleEdit, // floral flat sandals
      price: 4999,
      originalPrice: 5799,
    },
    {
      id: 105,
      name: "Chandelier Heels",
      image: premiumEdit, // elegant heels
      price: 3899,
      originalPrice: 4599,
    },
    {
      id: 106,
      name: "Three Strapped Tan Chained Flats",
      image: weddingReady, // tan flats with straps
      price: 2899,
      originalPrice: 3599,
    },
  ];

  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 0, // no delay
    speed: 4000, // slow constant movement
    cssEase: "linear", // constant smooth motion
    arrows: false,
    pauseOnHover: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 600, settings: { slidesToShow: 1 } },
    ],
  };





  // Scroll reveal on sections, images, and product cards
  useEffect(() => {
    const elements = document.querySelectorAll('.reveal-hidden');
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-show');
            observer.unobserve(entry.target);
          }
        });
      },
      { root: null, rootMargin: '0px 0px -10% 0px', threshold: 0.1 }
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <LandingBanner />

      {/* <section id="trending" className="title reveal-hidden reveal-delay-1">
        <h1>Who You Are Shopping For?</h1>
      </section>

      <section className="shopping-gender">
        <img className="reveal-hidden reveal-delay-1" src={image1} alt="" />
        <img className="reveal-hidden reveal-delay-2" src={image2} alt="" />
        <img className="reveal-hidden reveal-delay-3" src={image3} alt="" />
        <img className="reveal-hidden reveal-delay-4" src={image4} alt="" />
      </section> */}

      <div className="bg-white rounded-lg shadow-sm py-4 px-3 mb-6">
        <div className="flex flex-wrap justify-center items-center gap-5 py-2.5 overflow-x-auto">
          {categories.map((cat, idx) => (
            <div key={idx} className="flex flex-col items-center gap-3 min-w-[180px] cursor-pointer transition-transform hover:-translate-y-1">
              <div className="w-[140px] h-[140px] rounded-full bg-white flex items-center justify-center overflow-hidden shadow-md">
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
              </div>
              <div className="text-base font-semibold text-gray-800">{cat.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* <section id="trending" className="title reveal-hidden reveal-delay-1">
        <h1>New Arrivals</h1>
        <h2>summer collection new modern design</h2>
      </section>

      <div className="reveal-hidden reveal-delay-2">
        <Container />
      </div> */}

      <section className="w-screen -ml-[calc(50vw-50%)] overflow-hidden relative">
        <video
          className="w-full h-[450px] object-cover block transition-all duration-400 ease-in-out"
          src={videoSrc}
          width="1137"
          height="355"
          autoPlay
          muted
          loop
          playsInline
        />
      </section>


      {/* {data?.featured && data.featured.length > 0 && (
        <>
          <section
            id="featuredProd"
            className="title reveal-hidden reveal-delay-1"
          >
            <h1>Featured Products</h1>
            <h2>The new modern design summer collection</h2>
          </section>

          <section className="Featured-products">
            <div className="product-container">
              {data.featured.map((item, index) => {
                const delayClass = `reveal-delay-${(index % 5) + 1}`;
                return (
                  <div key={item._id} className={`reveal-hidden ${delayClass}`}>
                    <Card {...item} />
                  </div>
                );
              })}
            </div>
          </section>
        </>
      )} */}


      {/* Collections Section */}
      <div className="mb-[60px]">
        <div className="grid grid-cols-3 md:grid-cols-3 sm:grid-cols-2 gap-x-[10px] gap-y-[30px] mt-10 mb-10 justify-items-center">
          {collections.map((collection) => (
            <div key={collection.id} className="bg-transparent cursor-pointer transition-transform hover:-translate-y-1 text-center">
              <div className="w-[428px] md:w-[450px] sm:w-[170px] h-[418px] md:h-[450px] sm:h-[170px] overflow-hidden transition-transform duration-300 ease-in-out">
                <img src={collection.image} alt={collection.title} className="w-full h-full object-cover transition-transform duration-400 ease-in-out hover:scale-95" />
              </div>
              <h3 className="mt-3 text-lg sm:text-base font-semibold text-gray-800">{collection.title}</h3>
            </div>
          ))}
        </div>
      </div>

      {/* Bestsellers Section */}
      <div className="bg-white py-[50px] px-10">
        <h2 className="text-center text-[32px] sm:text-[22px] font-semibold text-gray-900 mb-[50px] sm:mb-[30px] tracking-tight font-inter">
          Bestsellers to light up your Party wardrobe.
        </h2>

        {/* Grid Section */}
        <div className="grid grid-cols-2 lg:grid-cols-6 sm:grid-cols-2 gap-[25px] sm:gap-[15px] mb-10 justify-items-center">
          {bestsellers.map((product) => (
            <div
              key={product.id}
              className="bg-transparent border-none text-center cursor-pointer transition-transform hover:-translate-y-1"
            >
              {/* Image Container */}
              <div className="w-[210px] h-[210px] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center  shadow-sm">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-105"
                />
              </div>

              {/* Product Info */}
              <div className="pt-3">
                <h4 className="text-base font-semibold text-gray-800 mb-1 font-inter">
                  {product.name}
                </h4>
                <div className="text-sm text-gray-900 font-medium">
                  <span>Rs. {product.price.toLocaleString()}</span>
                  {product.originalPrice && (
                    <span className="line-through text-gray-400 ml-2">
                      Rs. {product.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="flex justify-center mt-5">
          <button className="py-3 px-10 border-2 border-gray-900 rounded-full bg-white text-gray-900 font-semibold uppercase cursor-pointer transition-all duration-300 hover:bg-gray-900 hover:text-white">
            VIEW ALL Products
          </button>
        </div>
      </div>


      {/* Dual Image Promo Section */}
      <div className="bg-white py-[60px] pl-19 flex justify-center">
        <div className="grid grid-cols-2 lg:grid-cols-2 md:grid-cols-1 gap-10 md:gap-[25px] max-w-[1400px] w-full">
          <div className="w-full max-w-[620px] aspect-square overflow-hidden shadow-md bg-gray-100 transition-all duration-300 hover:scale-105 hover:shadow-lg">
            <img
              src={img1}
              alt="Promo 1"
              className="w-full h-full object-cover block transition-transform duration-400 ease-in-out hover:scale-[1.08]"
            />
          </div>
          <div className="w-full max-w-[620px] aspect-square overflow-hidden shadow-md bg-gray-100 transition-all duration-300 hover:scale-105 hover:shadow-lg">
            <img
              src={img2}
              alt="Promo 2"
              className="w-full h-full object-cover block transition-transform duration-400 ease-in-out hover:scale-[1.08]"
            />
          </div>
        </div>
      </div>

      <LandingBanner />




      {/* <div className="reveal-hidden reveal-delay-1">
        <Countdown />
      </div> */}

      {/* <div ref={trendingRef} style={{ marginBottom: "15px" }}></div> */}
      {/* {data?.trending && data.trending.length > 0 && (
        <>
          <section className="title reveal-hidden reveal-delay-1">
            <h1>Hot Deal On Sales</h1>
            <h2>The new modern design summer collection</h2>
          </section>
          <section className="Featured-products">
            <div className="product-container">
              {data.trending.map((item, index) => {
                const delayClass = `reveal-delay-${(index % 5) + 1}`;
                return (
                  <div key={item._id} className={`reveal-hidden ${delayClass}`}>
                    <Card {...item} />
                  </div>
                );
              })}
            </div>
          </section>
        </>
      )} */}
      {/* {data?.trending && data.trending.length > 0 && (
        <>
          <section className="title reveal-hidden reveal-delay-1">
            <h1>Hot Deal On Sales</h1>
            <h2>The new modern design summer collection</h2>
          </section>
          <section className="Featured-products">
            <Slider {...settings}>
              {data.trending.map((item) => (
                <div key={item._id} className="reveal-hidden">
                  <Card {...item} />
                </div>
              ))}
            </Slider>
          </section>
        </>
      )}

      <div className="reveal-hidden reveal-delay-2">
        <FeaturedIcon />
      </div>
      <div className="reveal-hidden reveal-delay-3">
        <BannerSection />
      </div> */}
    </>
  );
};

export default LandingPage;
