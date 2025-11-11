import { Link, useNavigate } from "react-router-dom";
// import loginImage from "../Images/pnghe.png";
import bgImage from "../Images/80566.jpg";
import { useRef, useState } from "react";
import Axios from "../Axios";
import { toast } from "react-toastify";
import useAuth from "../../hooks/useAuth";

const ForgetPasswordModal = ({ onClose }) => {
  const modelRef = useRef();
  const [email, setEmail] = useState("");
  const closeModal = (e) => {
    if (modelRef.current === e.target) {
      onClose();
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (email === "") {
        toast.error("Please provide email");
        return;
      }
      const response = await Axios.get(`/forgetpassword/${email}`);
      if (response.data.success === true) {
        toast.success(response.data.message);
        onClose();
      }
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error);
    }
  };
  return (
    <div
      ref={modelRef}
      onClick={closeModal}
      className="fixed inset-0 z-[100000] bg-black/40 backdrop-blur-sm flex justify-center items-center px-4"
    >
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-white/15 bg-white/15 backdrop-blur-lg shadow-[0_18px_50px_rgba(0,0,0,0.3)] p-6 sm:p-7">
          <div className="text-center">
            <h2 className="text-[clamp(1.25rem,2.5vw,1.5rem)] font-semibold text-white m-0">
              Forgot Password
            </h2>
            <p className="text-white/80 mt-2">
              Enter your email below and we'll send you a reset link.
            </p>
          </div>
          <form className="flex flex-col gap-4 mt-6" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm font-medium text-white/80">
                Email address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-2xl border border-white/30 bg-white/60 px-4 py-3 text-base text-gray-900 placeholder:text-gray-500 outline-none transition focus:border-[#d3a15f] focus:ring-4 focus:ring-[#d3a15f]/30"
              />
            </div>
            <div className="flex w-full gap-3 sm:gap-4">
              <button
                className="w-1/2 rounded-2xl border border-white/30 bg-white/10 py-2.5 text-sm font-semibold text-white/90 transition hover:bg-white/20"
                type="button"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                className="w-1/2 rounded-2xl bg-[#ba8780] py-2.5 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(211,161,95,0.35)] transition hover:bg-[#ab6a61] hover:shadow-[0_12px_32px_rgba(211,161,95,0.45)]"
                type="submit"
              >
                Send Link
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const LoginPage = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const [user, setUser] = useState({ email: "", password: "", role: "user" });
  const [showForgetPassword, setShowForgetPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (user.email === "" || user.password === "") {
        toast.error("Please provide email and password", {
          position: "bottom-right",
        });
        return;
      }
      const response = await Axios.post("/login", user);
      console.log(response);

      if (response.data.success === true) {
        localStorage.setItem("jwt", "Bearer " + response.data.token);
        setAuth(response.data.user);
        toast.success("Login successful. Access granted.", {
          position: "bottom-right",
        });
        navigate("/products");
      } else {
        toast.error(response.data.message, {
          position: "bottom-right",
        });
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message, {
        position: "bottom-right",
      });
    }
  };
  return (
    <div
      className="relative min-h-screen w-full overflow-hidden px-6 py-12 sm:px-8 lg:px-12"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/20 to-black/50" />

      <div className="relative z-10 flex min-h-[calc(100vh-6rem)] items-center justify-center">
        <div className="w-full max-w-md">
          <div className="rounded-3xl border border-white/15 bg-white/15 p-7 backdrop-blur-lg shadow-[0_20px_60px_rgba(0,0,0,0.28)] sm:p-8 lg:p-8">
            <div className="mb-8 text-center">
              <span className="inline-flex items-center rounded-full border border-white/40 bg-white/30 px-4 py-1 text-xs font-medium uppercase tracking-[0.2em] text-white/90">
                Welcome Back
              </span>
              <h1 className="mt-5 text-[clamp(2rem,4vw,2.75rem)] font-semibold text-white">
                Sign in to your account
              </h1>
              <p className="mt-3 text-sm text-white/70">
                Pick up where you left off and continue exploring Tiara Steps.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
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
                <div className="flex items-center justify-between text-sm">
                  <label htmlFor="password" className="font-medium text-white/80">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgetPassword(true)}
                    className="font-medium text-[#ab6a61] underline-offset-4 transition hover:text-[#8e5851]"
                  >
                    Forgot password?
                  </button>
                </div>
                <input
                  type="password"
                  id="password"
                  value={user.password}
                  onChange={(e) => setUser({ ...user, password: e.target.value })}
                  name="password"
                  placeholder="••••••••"
                  className="w-full rounded-2xl border border-white/30 bg-white/60 px-4 py-3 text-base text-gray-900 placeholder:text-gray-500 outline-none transition focus:border-[#d3a15f] focus:ring-4 focus:ring-[#d3a15f]/30"
                />
              </div>

              <button
                className="w-full rounded-2xl bg-[#ba8780] py-3 text-base font-semibold text-white shadow-[0_12px_30px_rgba(211,161,95,0.35)] transition hover:bg-[#ab6a61] hover:shadow-[0_18px_40px_rgba(211,161,95,0.45)]"
                type="submit"
              >
                Sign In
              </button>
            </form>

            <div className="mt-8 space-y-6">
              <div className="flex items-center gap-4">
                <span className="h-px flex-1 bg-white/30" />
                <span className="text-xs uppercase tracking-[0.3em] text-white/50">
                  or continue with
                </span>
                <span className="h-px flex-1 bg-white/30" />
              </div>
            </div>

            <p className="mt-10 text-center text-sm text-white/70">
              Don&apos;t have an account?{" "}
              <Link className="font-semibold text-[#ab6a61] underline-offset-4 transition hover:text-[#8e5851]" to="/signup">
                Create one now
              </Link>
            </p>
          </div>
        </div>
      </div>

      {showForgetPassword && (
        <ForgetPasswordModal onClose={() => setShowForgetPassword(false)} />
      )}
    </div>
  );
};

export default LoginPage;
