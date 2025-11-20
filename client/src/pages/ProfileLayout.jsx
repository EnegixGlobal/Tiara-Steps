import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const ProfileLayout = () => {
  return (
    <>
      <Navbar />
      <section className="min-h-screen">
        <Outlet />
      </section>
      <Footer />
    </>
  );
};
export default ProfileLayout;

