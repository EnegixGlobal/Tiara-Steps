import React, { useEffect, useState } from "react";
import CustomerTable from "../components/CustomerTable";
import { toast } from "react-toastify";
import Axios from "../Axios";
import TriangleLoader from "../components/TriangleLoader";

const CouponList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetch = async () => {
    try {
      console.log("fetching coupons");
      const token = localStorage.getItem("jwtAdmin");
      if (!token) {
        return toast.error("Access denied. Please login first.");
      }
      const response = await Axios.get("/admin/coupons", {
        headers: {
          Authorization: token,
        },
      });
      console.log(response.data);
      if (response.data.success) {
        setData(response.data.data);
      }
      setLoading(false);
    } catch (error) {
      toast.error(error?.response?.data?.message);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetch();
  }, []);
  const columns = [
    {
      Header: "Name",
      accessor: "id",
    },
    {
      Header: "Discount",
      accessor: (row) => {
        if (row.discountType === "percentage" && row.percent_off) {
          return `${row.percent_off}%`;
        } else if (row.discountType === "fixed" && row.discount) {
          return `₹${row.discount}`;
        }
        return row.percent_off || row.discount || "N/A";
      },
    },
    {
      Header: "Max Discount",
      accessor: (row) => {
        if (row.maxDiscount) {
          return `₹${row.maxDiscount}`;
        }
        return "No limit";
      },
    },
    {
      Header: "Duration",
      accessor: "duration",
    },
    {
      Header: "Redemption Left",
      accessor: "redemption_left",
    },
  ];

  const [formData, setFormData] = useState({
    name: "",
    discount: "",
    duration: "forever",
    duration_in_months: "",
    max_redemptions: "",
    max_discount: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      name: e.id,
      discount: e.discountType === "percentage" ? e.percent_off : e.discount,
      duration: e.duration !== "forever" ? "repeating" : "forever",
      duration_in_months: e.duration_in_months || 12,
      max_redemptions: e.max_redemptions,
      max_discount: e.maxDiscount || "",
    });
  };
  const handleInputChange = (event) => {
    setFormData({
      ...formData,
      [event.target.id]: event.target.value.trim(),
    });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      if (
        !formData.name ||
        !formData.discount ||
        !formData.duration ||
        !formData.max_redemptions
      ) {
        return toast.error("Please fill all the required fields.");
      }
      const token = localStorage.getItem("jwtAdmin");
      if (!token) {
        return toast.error("Access denied.");
      }
      const response = await Axios.post(
        "/admin/coupons",
        { formData },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      toast.success(response.data.message);
      fetch();
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };
  const deleteCoupon = async () => {
    try {
      if (!formData.name) {
        return toast.error("Please select a coupon to delete.");
      }
      // Removed hardcoded coupon protection - implement database-based protection if needed

      const token = localStorage.getItem("jwtAdmin");
      if (!token) {
        return toast.error("Access denied.");
      }
      const response = await Axios.delete(
        `/admin/coupons/${formData.name.toUpperCase()}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      toast.success(response.data.message);
      setFormData({
        name: "",
        discount: "",
        duration: "forever",
        duration_in_months: "",
        max_redemptions: "",
        max_discount: "",
      });
      fetch();
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };
  if (loading) return <TriangleLoader height="500px" />;
  return (
    <div className="py-4 px-8 max-h-full max-[600px]:py-5 max-[600px]:px-4">
      <h1 className="text-2xl font-bold text-[#1a1a1a] mb-3">Coupons</h1>
      <div className="flex flex-row gap-4 max-[600px]:flex-col">
        <form onSubmit={handleFormSubmit} className="w-full flex flex-col">
          <div className="flex justify-between flex-row w-full gap-4 max-[768px]:flex-col max-[768px]:gap-0">
            <div className="w-full">
              <label htmlFor="name" className="text-sm font-medium text-[#1a1a1a]">Name</label>
              <input
                type="text"
                className="py-2 px-3 text-sm font-normal text-[#1a1a1a] bg-white border border-[#ccc] rounded mb-2 w-full overflow-auto font-sans uppercase"
                id="name"
                placeholder="Enter coupon name"
                onChange={handleInputChange}
                value={formData.name}
              />
            </div>
            <div className="w-full">
              <label htmlFor="discount" className="text-sm font-medium text-[#1a1a1a]">Discount</label>
              <input
                type="number"
                className="py-2 px-3 text-sm font-normal text-[#1a1a1a] bg-white border border-[#ccc] rounded mb-2 w-full overflow-auto font-sans"
                id="discount"
                min="0"
                placeholder="Enter discount (0-100 for %, >100 for ₹ fixed)"
                onChange={handleInputChange}
                value={formData.discount}
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter 0-100 for percentage discount, or amount in ₹ for fixed discount
              </p>
            </div>
            <div className="w-full">
              <label htmlFor="max_discount" className="text-sm font-medium text-[#1a1a1a]">Max Discount (₹)</label>
              <input
                type="number"
                className="py-2 px-3 text-sm font-normal text-[#1a1a1a] bg-white border border-[#ccc] rounded mb-2 w-full overflow-auto font-sans disabled:bg-gray-100"
                id="max_discount"
                min="0"
                placeholder="Max discount amount (optional, for % coupons only)"
                disabled={!formData.discount || formData.discount > 100}
                onChange={handleInputChange}
                value={formData.max_discount}
              />
              <p className="text-xs text-gray-500 mt-1">
                Maximum discount amount (only for percentage coupons)
              </p>
            </div>
            <div className="w-full">
              <label htmlFor="duration" className="text-sm font-medium text-[#1a1a1a]">Coupon Type</label>
              <select
                className="py-2 px-3 text-sm font-normal text-[#1a1a1a] bg-white border border-[#ccc] rounded mb-2 w-full overflow-auto font-sans"
                id="duration"
                onChange={handleInputChange}
                value={formData.duration}
              >
                <option value="forever">Forever</option>
                <option value="repeating">Repeating</option>
              </select>
            </div>
            <div className="w-full">
              <label htmlFor="duration_in_months" className="text-sm font-medium text-[#1a1a1a]">Duration</label>
              <input
                type="number"
                className="py-2 px-3 text-sm font-normal text-[#1a1a1a] bg-white border border-[#ccc] rounded mb-2 w-full overflow-auto font-sans disabled:bg-gray-100"
                id="duration_in_months"
                min="0"
                max="12"
                placeholder="valid for how many months?"
                disabled={formData.duration === "forever"}
                onChange={handleInputChange}
                value={formData.duration_in_months}
              />
            </div>
            <div className="w-full">
              <label htmlFor="max_redemptions" className="text-sm font-medium text-[#1a1a1a]">Max Redemptions</label>
              <input
                min={0}
                type="number"
                className="py-2 px-3 text-sm font-normal text-[#1a1a1a] bg-white border border-[#ccc] rounded mb-2 w-full overflow-auto font-sans"
                id="max_redemptions"
                placeholder="Enter 999 for unlimited redemptions"
                onChange={handleInputChange}
                value={formData.max_redemptions}
              />
            </div>
          </div>
          <div className="flex justify-center items-center gap-4 mb-6 max-[650px]:flex-col max-[650px]:gap-0">
            <button type="button" onClick={deleteCoupon} className="py-2 px-6 w-full text-base font-medium text-white bg-[#54bab9] border-none rounded cursor-pointer my-2">
              Delete
            </button>
            <button type="submit" className="py-2 px-6 w-full text-base font-medium text-white bg-[#54bab9] border-none rounded cursor-pointer my-2">
              Add
            </button>
          </div>
        </form>
      </div>
      <div className="flex flex-row gap-4 overflow-auto max-[600px]:flex-col">
        <CustomerTable
          columns={columns}
          data={data}
          handleChange={handleChange}
        />
      </div>
    </div>
  );
};

export default CouponList;
