import b1 from "../Images/tiara-steps-1.png";
import b2 from "../Images/tiara-steps-2.png";
import b3 from "../Images/tiara-steps-5.webp";
import b4 from "../Images/tiara-steps-4.png";
import b5 from "../Images/tiara-steps-3.png";

const BannerSection = () => {
  return (
    <section className="my-[2.778vw] mx-[5.5vw] flex gap-[2.778vw] flex-col">
      <div className="flex justify-between items-center flex-wrap max-[700px]:flex-col">
        <img src={b1} alt="Banner-Image" className="w-[31.5%] h-[fill-available] max-[700px]:w-full max-[700px]:my-2.5 max-[700px]:mx-0" />
        <img src={b2} alt="Banner-Image" className="w-[31.5%] h-[fill-available] max-[700px]:w-full max-[700px]:my-2.5 max-[700px]:mx-0" />
        <img src={b4} alt="Banner-Image" className="w-[31.5%] h-[fill-available] max-[700px]:w-full max-[700px]:my-2.5 max-[700px]:mx-0" />
      </div>
      <div className="flex justify-between items-center flex-wrap max-[700px]:hidden">
        <img src={b5} alt="Banner-Image" className="w-[48%] h-[fill-available]" />
        <img src={b3} alt="Banner-Image" className="w-[48%] h-[fill-available]" />
      </div>
    </section>
  );
};

export default BannerSection;
