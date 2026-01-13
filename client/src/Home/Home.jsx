import HeroSlider from "./components/HeroSlider";
import CategoryStrip from "./components/CategoryStrip";
import VideoBanner from "./components/VideoBanner";
import CollectionGrid from "./components/CollectionGrid";
import Bestsellers from "./components/Bestseller";
import DualBanner from "./components/DualBanner";
import ReelsSection from "./components/ReelsSection";
import InstagramSection from "./components/InstagramSection";
import MidBannerSlider from "./components/MidBannerSlider";

const Home = () => {
  return (
    <div className="home-page">
      <HeroSlider />
      <CategoryStrip />
      <VideoBanner />
      {/* <CollectionGrid /> */}
      <Bestsellers />
      <DualBanner />
      <MidBannerSlider/>
      <ReelsSection />
      <InstagramSection />
    </div>
  );
};

export default Home;
