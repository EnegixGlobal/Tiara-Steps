import { Link, useNavigate } from "react-router-dom";
// import loginImage from "../Images/adcffc.png";
import bgImage from "../Images/80566.jpg";
import { useState } from "react";
import Axios from "../Axios";
import { toast } from "react-toastify";

const SignUpPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    email: "",
    password: "",
    role: "user",
    name: "",
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await Axios.post("/register", user);
      console.log(response);
      if (response.data.success === true) {
        toast.success("Account created successfully ", {
          position: "bottom-right",
        });
        navigate("/login");
      } else {
        toast.error(response.data.message, {
          position: "bottom-right",
        });
      }
    } catch (error) {
      toast.error(error.response.data.message || "Something went wrong", {
        position: "bottom-right",
      });
    }
  };
  return (
    <div className="relative min-h-screen w-full overflow-hidden px-6 py-12 sm:px-8 lg:px-12">
      <img
        src={bgImage}
        alt="background"
        className="absolute inset-0 h-full w-full object-cover -scale-y-100"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/20 to-black/50" />

      <div className="relative z-10 flex min-h-[calc(100vh-6rem)] items-center justify-center">
        <div className="w-full max-w-md">
          <div className="rounded-3xl border border-white/15 bg-white/15 p-7 backdrop-blur-lg shadow-[0_20px_60px_rgba(0,0,0,0.28)] sm:p-8 lg:p-9">
            <div className="mb-8 text-center">
              <span className="inline-flex items-center rounded-full border border-white/40 bg-white/30 px-4 py-1 text-xs font-medium uppercase tracking-[0.2em] text-white/90">
                Create Account
              </span>
              <h1 className="mt-5 text-[clamp(2rem,4vw,2.5rem)] font-semibold text-white">
                Join Tiara Steps
              </h1>
              <p className="mt-3 text-sm text-white/70">
                Sign up to personalize your experience and track your orders.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-white/80">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={user.name}
                  onChange={(e) => setUser({ ...user, name: e.target.value })}
                  placeholder="Your full name"
                  className="w-full rounded-2xl border border-white/30 bg-white/60 px-4 py-3 text-base text-gray-900 placeholder:text-gray-500 outline-none transition focus:border-[#d3a15f] focus:ring-4 focus:ring-[#d3a15f]/30"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-white/80">
                  Email address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={user.email}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                  placeholder="you@example.com"
                  className="w-full rounded-2xl border border-white/30 bg-white/60 px-4 py-3 text-base text-gray-900 placeholder:text-gray-500 outline-none transition focus:border-[#d3a15f] focus:ring-4 focus:ring-[#d3a15f]/30"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-white/80">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={user.password}
                  onChange={(e) => setUser({ ...user, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full rounded-2xl border border-white/30 bg-white/60 px-4 py-3 text-base text-gray-900 placeholder:text-gray-500 outline-none transition focus:border-[#d3a15f] focus:ring-4 focus:ring-[#d3a15f]/30"
                />
              </div>

              <button
                className="w-full rounded-2xl bg-[#ba8780] py-3 text-base font-semibold text-white shadow-[0_12px_30px_rgba(211,161,95,0.35)] transition hover:bg-[#ab6a61] hover:shadow-[0_18px_40px_rgba(211,161,95,0.45)]"
                type="submit"
              >
                Create Account
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-white/70">
              Already have an account?{" "}
              <Link className="font-semibold text-[#ab6a61] underline-offset-4 transition hover:text-[#8e5851]" to="/login">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
