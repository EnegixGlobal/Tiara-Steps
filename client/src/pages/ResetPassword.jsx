import { useNavigate } from "react-router-dom";
import loginImage from "../Images/80566.jpg";
import { useState, useEffect } from "react";
import Axios from "../Axios";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [id, setId] = useState(null);
  const [token, setToken] = useState(null);
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const tokenParam = queryParams.get("token");
    const idParam = queryParams.get("id");

    console.log("Reset Password - Token:", tokenParam ? "Present" : "Missing");
    console.log("Reset Password - ID:", idParam ? "Present" : "Missing");

    if (!tokenParam || !idParam) {
      setIsValid(false);
      toast.error("Invalid token. Please try again.");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } else {
      try {
        // Decode the token if it was URL encoded
        const decodedToken = decodeURIComponent(tokenParam);
        setToken(decodedToken);
        setId(idParam);
        setIsValid(true);
      } catch (error) {
        console.error("Error decoding token:", error);
        setIsValid(false);
        toast.error("Invalid token format. Please try again.");
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    }
  }, [navigate]);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // NEW: show / hide toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (password === "" || confirmPassword === "") {
        toast.error("Please provide password and confirm password");
        return;
      } else if (password !== confirmPassword) {
        toast.error("Passwords do not match");
        return;
      } else {
        const response = await Axios.post(
          "/resetpassword",
          {
            userId: id,
            password: password,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response);

        if (response.data.success === true) {
          toast.success("Password reset successfully");
          navigate("/login");
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "An error occurred. Please try again.");
    }
  };

  if (!isValid) {
    return (
      <div className="h-screen w-full flex justify-center items-center">
        <div className="text-center">
          <p className="text-[#b89396]">Invalid or missing reset token. Redirecting...</p>
        </div>
      </div>
    );
  }

  if (!token || !id) {
    return (
      <div className="h-screen w-full flex justify-center items-center">
        <div className="text-center">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // return (
  //   <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#f5e9dc] to-[#e1d5c8] px-4">
  //     <div className="bg-white/80 backdrop-blur-xl shadow-lg rounded-2xl w-full max-w-md p-8 border border-white/40">
  //       <h2 className="text-3xl font-bold text-gray-900 text-center mb-2">Reset Password</h2>
  //       <p className="text-center text-gray-600 mb-6 text-sm">Create a new password for your account</p>

  //       <form onSubmit={handleSubmit} className="space-y-5">
  //         {/* New Password */}
  //         <div className="flex flex-col gap-1">
  //           <label htmlFor="password" className="text-gray-700 font-medium text-sm">
  //             New Password
  //           </label>

  //           <div className="relative">
  //             <input
  //               type={showPassword ? "text" : "password"}
  //               id="password"
  //               value={password}
  //               onChange={(e) => setPassword(e.target.value)}
  //               placeholder="Enter new password"
  //               className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#d3a15f] focus:outline-none bg-white"
  //             />

  //             <button
  //               type="button"
  //               onClick={() => setShowPassword((s) => !s)}
  //               className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer p-1"
  //               aria-label={showPassword ? "Hide password" : "Show password"}
  //             >
  //               {showPassword ? (
  //                 // Eye Off
  //                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
  //                   <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.264.234-2.474.66-3.588M6.42 6.42A9.956 9.956 0 0112 5c5.523 0 10 4.477 10 10 0 1.603-.376 3.117-1.043 4.45M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  //                   <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
  //                 </svg>
  //               ) : (
  //                 // Eye On
  //                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
  //                   <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  //                   <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  //                 </svg>
  //               )}
  //             </button>
  //           </div>
  //         </div>

  //         {/* Confirm Password */}
  //         <div className="flex flex-col gap-1">
  //           <label htmlFor="confirmPassword" className="text-gray-700 font-medium text-sm">
  //             Confirm Password
  //           </label>

  //           <div className="relative">
  //             <input
  //               type={showConfirmPassword ? "text" : "password"}
  //               id="confirmPassword"
  //               value={confirmPassword}
  //               onChange={(e) => setConfirmPassword(e.target.value)}
  //               placeholder="Re-enter new password"
  //               className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#d3a15f] focus:outline-none bg-white"
  //             />

  //             <button
  //               type="button"
  //               onClick={() => setShowConfirmPassword((s) => !s)}
  //               className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer p-1"
  //               aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
  //             >
  //               {showConfirmPassword ? (
  //                 // Eye Off
  //                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
  //                   <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.264.234-2.474.66-3.588M6.42 6.42A9.956 9.956 0 0112 5c5.523 0 10 4.477 10 10 0 1.603-.376 3.117-1.043 4.45M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  //                   <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
  //                 </svg>
  //               ) : (
  //                 // Eye On
  //                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
  //                   <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  //                   <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  //                 </svg>
  //               )}
  //             </button>
  //           </div>
  //         </div>

  //         {/* Button */}
  //         <button
  //           className="
  //             inline-block w-full 
  //             bg-[#B89396] text-white text-[0.9rem] font-semibold
  //             px-5 py-3 rounded-full no-underline
  //             transition-all duration-300 ease-in-out
  //             hover:bg-[#8b5e3c] hover:-translate-y-0.5
  //             shadow-md
  //           "
  //           type="submit"
  //         >
  //           Reset Password
  //         </button>
  //       </form>

  //       <div className="text-center mt-6">
  //         <button onClick={() => navigate("/login")} className="text-sm text-gray-600 hover:text-gray-900 underline cursor-pointer">
  //           Back to Login
  //         </button>
  //       </div>
  //     </div>
  //   </div>
  // );

  return (
    <div
      className="relative min-h-screen w-full overflow-hidden px-6 py-12 sm:px-8 lg:px-12"
      style={{
        backgroundImage: `url(${loginImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/20 to-black/50" />
  
      <div className="relative z-10 flex min-h-[calc(100vh-6rem)] items-center justify-center">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="rounded-3xl border border-white/15 bg-white/15 p-7 backdrop-blur-lg shadow-[0_20px_60px_rgba(0,0,0,0.28)] sm:p-8 lg:p-8">
  
            {/* Heading */}
            <div className="text-center mb-8">
              <span className="inline-flex items-center rounded-full border border-white/40 bg-white/30 px-4 py-1 text-xs font-medium uppercase tracking-[0.2em] text-white/90">
                Reset Password
              </span>
              <h1 className="mt-5 text-[clamp(1.8rem,4vw,2.4rem)] font-semibold text-white">
                Create a New Password
              </h1>
              <p className="mt-3 text-sm text-white/70">
                Enter your new credentials and continue exploring Tiara Steps.
              </p>
            </div>
  
            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* New Password */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">
                  New Password
                </label>
  
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full rounded-2xl border border-white/30 bg-white/60 px-4 py-3 pr-12 text-base text-gray-900 placeholder:text-gray-500 outline-none transition focus:border-[#d3a15f] focus:ring-4 focus:ring-[#d3a15f]/30"
                  />
  
                  {/* Eye toggle */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer p-1 text-gray-700"
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3l18 18M10.477 10.477A3 3 0 0012 15a3 3 0 003-3c0-.62-.188-1.197-.523-1.677M6.94 6.94C5.633 7.86 4.56 9.228 3.836 10.9a10.049 10.049 0 009.747 5.948M17.06 17.06A10.05 10.05 0 0020.164 10.9c-.724-1.672-1.797-3.04-3.104-3.96" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.5c4.97 0 9.167 3.134 10.244 7.5C21.167 16.866 16.97 20 12 20s-9.167-3.134-10.244-7.5C2.833 7.634 7.03 4.5 12 4.5z" />
                        <circle cx="12" cy="12" r="3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
  
              {/* Confirm Password */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">
                  Confirm Password
                </label>
  
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    className="w-full rounded-2xl border border-white/30 bg-white/60 px-4 py-3 pr-12 text-base text-gray-900 placeholder:text-gray-500 outline-none transition focus:border-[#d3a15f] focus:ring-4 focus:ring-[#d3a15f]/30"
                  />
  
                  {/* Eye toggle */}
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer p-1 text-gray-700"
                  >
                    {showConfirmPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3l18 18M10.477 10.477A3 3 0 0012 15a3 3 0 003-3c0-.62-.188-1.197-.523-1.677M6.94 6.94C5.633 7.86 4.56 9.228 3.836 10.9a10.049 10.049 0 009.747 5.948M17.06 17.06A10.05 10.05 0 0020.164 10.9c-.724-1.672-1.797-3.04-3.104-3.96" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.5c4.97 0 9.167 3.134 10.244 7.5C21.167 16.866 16.97 20 12 20s-9.167-3.134-10.244-7.5C2.833 7.634 7.03 4.5 12 4.5z" />
                        <circle cx="12" cy="12" r="3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
  
              {/* Submit Button */}
              <button
                className="w-full rounded-2xl bg-[#ba8780] py-3 text-base font-semibold text-white shadow-[0_12px_30px_rgba(211,161,95,0.35)] transition hover:bg-[#ab6a61] hover:shadow-[0_18px_40px_rgba(211,161,95,0.45)]"
                type="submit"
              >
                Reset Password
              </button>
            </form>
  
            {/* Back Link */}
            <p className="mt-8 text-center text-sm text-white/70">
              Changed your mind?{" "}
              <button
                onClick={() => navigate("/login")}
                className="font-semibold text-[#d3a15f] underline-offset-4 hover:text-[#bb8a50] cursor-pointer"
              >
                Back to Login
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
  
};

export default ResetPassword;
