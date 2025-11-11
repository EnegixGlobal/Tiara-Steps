import { useNavigate } from "react-router-dom";
import loginImage from "../Images/abc4.png";
import { useState } from "react";
import Axios from "../Axios";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");
  const token = queryParams.get("token");
  console.log(token, id);
  if (token === undefined || token === "") {
    toast.error("Invalid token. Please try again.");
    navigate("/");
  }
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (password === "" || confirmPassword === "") {
        toast.error("Please provide email and password");
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
      toast.error(error.response.data.message);
    }
  };
  return (
    <div className="h-screen w-full flex bg-white flex-row-reverse">
      <div className="w-1/2 lg:w-full flex justify-center items-center">
        <div className="w-full p-[20%] lg:p-[8%] h-full flex justify-center flex-col">
          <h1 className="text-gray-900 text-[clamp(2rem,2.5vw,3rem)] leading-8 font-bold">Reset Your Password</h1>
          <form onSubmit={handleSubmit} className="flex gap-3.5 flex-col my-7 mt-0 mb-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-base text-gray-600 font-medium text-left">New Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your new password"
                className="w-full rounded-lg text-gray-900 border border-gray-900 mt-2 py-2.5 px-3 text-left outline-none"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="confirmPassword" className="text-base text-gray-600 font-medium text-left">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your new password"
                className="w-full rounded-lg text-gray-900 border border-gray-900 mt-2 py-2.5 px-3 text-left outline-none"
              />
            </div>
            <button className="py-2.5 px-3 text-base rounded-lg mt-3 border-0 font-medium text-white bg-[#d8b98f] cursor-pointer hover:bg-[#d3a15f]" type="submit">
              Reset Password
            </button>
          </form>
        </div>
      </div>
      <div className="w-1/2 lg:hidden flex justify-center items-center">
        <img className="w-full h-full object-contain bg-[#d4b8b8]" src={loginImage} alt="image" />
      </div>
    </div>
  );
};

export default ResetPassword;
