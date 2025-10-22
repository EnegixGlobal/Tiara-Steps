import { useEffect, useRef, useContext } from "react";
import kid from "../Images/kid.png";
import oldwomen from "../Images/oldwomen.png";
import women from "../Images/women.webp";
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


const LandingPage = () => {
  // const { data, setData } = useContext(LoadingContext);
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



  const data = {
    featured: datas.featured,
    trending: datas.Products,
  };
  

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

      <section id="trending" className="title reveal-hidden reveal-delay-1">
        <h1>Who You Are Shopping For?</h1>
      </section>

      <section className="shopping-gender">
        <img className="reveal-hidden reveal-delay-1" src={oldwomen} alt="" />
        <img className="reveal-hidden reveal-delay-2" src={women} alt="" />
        <img className="reveal-hidden reveal-delay-3" src={kid} alt="" />
      </section>

      <section id="trending" className="title reveal-hidden reveal-delay-1">
        <h1>New Arrivals</h1>
        <h2>summer collection new modern design</h2>
      </section>

      <div className="reveal-hidden reveal-delay-2">
        <Container />
      </div>

      {data?.featured && data.featured.length > 0 && (
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
      )}

      <div className="reveal-hidden reveal-delay-1">
        <Countdown />
      </div>
      <div ref={trendingRef} style={{ marginBottom: "15px" }}></div>
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
      {data?.trending && data.trending.length > 0 && (
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
      </div>
    </>
  );
};

export default LandingPage;
