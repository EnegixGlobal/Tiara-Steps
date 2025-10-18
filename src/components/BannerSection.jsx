import b1 from "../Images/tiara-steps-1.png";
import b2 from "../Images/tiara-steps-2.png";
import b3 from "../Images/tiara-steps-5.webp";
import b4 from "../Images/tiara-steps-4.png";
import b5 from "../Images/tiara-steps-3.png";

const BannerSection = () => {
  return (
    <section className="banner">
      <div className="banner-row-1">
        <img src={b1} alt="Banner-Image" />
        <img src={b2} alt="Banner-Image" />
        <img className="banner3" src={b4} alt="Banner-Image" />
      </div>
      <div className="banner-row-2">
        <img className="banner3" src={b5} alt="Banner-Image" />
        <img src={b3} alt="Banner-Image" />
      </div>
    </section>
  );
};

export default BannerSection;
