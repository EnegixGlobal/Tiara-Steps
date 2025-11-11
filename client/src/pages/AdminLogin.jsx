import { Link, useNavigate } from "react-router-dom";
import loginImage from "../Images/abc4.png";
import { useState } from "react";
import Axios from "../Axios";
import { toast } from "react-toastify";
import useAuth from "../../hooks/useAuth";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { setAdmin } = useAuth();
  const [user, setUser] = useState({ email: "", password: "", role: "admin" });
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (user.email === "" || user.password === "") {
        toast.error("Please provide email and password");
        return;
      }
      const response = await Axios.post("/adminLogin", user);
      console.log("Admin Login Response :",response);

      if (response.data.success === true) {
        localStorage.setItem("jwtAdmin", "Bearer " + response.data.token);
        setAdmin(response.data.user);
        toast.success("Login successful. Access granted.");
        navigate("/admin");
      } else {
        toast.error(response.data.message);
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
          <h1 className="text-gray-900 text-[clamp(2rem,2.5vw,3rem)] leading-8 font-bold">Log in to your account</h1>
          <form onSubmit={handleSubmit} className="flex gap-3.5 flex-col my-7 mt-0 mb-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-base text-gray-600 font-medium text-left">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={user.email}
                onChange={(e) =>
                  setUser({ ...user, email: e.target.value.trim() })
                }
                placeholder="Enter your email"
                className="w-full rounded-lg text-gray-900 border border-gray-900 mt-2 py-2.5 px-3 text-left outline-none"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-base text-gray-600 font-medium text-left">Password</label>
              <input
                type="password"
                id="password"
                value={user.password}
                onChange={(e) =>
                  setUser({ ...user, password: e.target.value.trim() })
                }
                name="password"
                placeholder="Enter your password"
                className="w-full rounded-lg text-gray-900 border border-gray-900 mt-2 py-2.5 px-3 text-left outline-none"
              />
            </div>
            <button
              onClick={handleSubmit}
              className="py-2.5 px-3 text-base rounded-lg mt-3 border-0 font-medium text-white bg-[#d8b98f] cursor-pointer hover:bg-[#d3a15f]"
              type="submit"
            >
              Login
            </button>
          </form>
          <div className="mt-4">
            <button onClick={() => console.log("forget password")} type="button" className="border-none bg-transparent text-[15px] text-gray-600 font-medium w-full text-center cursor-pointer hover:text-[#6286a0]">
              Forget password?
            </button>
          </div>
        </div>
      </div>
      <div className="w-1/2 lg:hidden flex justify-center items-center">
        <img className="w-full h-full object-contain bg-[#d4b8b8]" src={loginImage} alt="image" />
      </div>
    </div>
  );
};

export default AdminLogin;
