import React, { useEffect, useState } from "react";
import CustomerTable from "../components/CustomerTable";
import { toast } from "react-toastify";
import Axios from "../Axios";
import TriangleLoader from "../components/TriangleLoader";

const CategoryList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetch = async () => {
    try {
      const token = localStorage.getItem("jwtAdmin");
      if (!token) {
        return toast.error("Access denied. Please login first.");
      }
      const response = await Axios.get("/category", {
        headers: {
          Authorization: token,
        },
      });
      console.log(response.data);
      if (response.data.success) {
        setData(response.data.categories);
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
      accessor: "name",
    },
    {
      Header: "Description",
      accessor: "description",
    },
  ];

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    description: "",
  });

  const handleChange = (e) => {
    setFormData({ id: e._id, name: e.name, description: e.description });
  };
  const resetForm = () => {
    setFormData({ id: "", name: "", description: "" });
  };

  const handleUpdate = (id) => async () => {
    try {
      if (!id) {
        return toast.error("Please select a brand to update.");
      }
      const token = localStorage.getItem("jwtAdmin");
      if (!token) {
        return toast.error("Access denied.");
      }
      const response = await Axios.put(
        `/category/${id}`,
        { ...formData },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      toast.success(response.data.message);
      setData(response.data.categories);
      resetForm();
    } catch (error) {
      toast.error(error?.response?.data?.message);
      resetForm();
    }
  };

  const handleInputChange = (event) => {
    setFormData({
      ...formData,
      [event.target.id]: event.target.value,
    });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      if (!formData.name || !formData.description) {
        return toast.error("Please fill all the fields.");
      }
      const token = localStorage.getItem("jwtAdmin");
      if (!token) {
        return toast.error("Access denied.");
      }
      const response = await Axios.post(
        "/category",
        { ...formData },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      toast.success(response.data.message);
      fetch();
      resetForm();
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };
  const deleteCoupon = async (id) => {
    try {
      if (!id) {
        return toast.error("Please select a brand to delete.");
      }
      const token = localStorage.getItem("jwtAdmin");
      if (!token) {
        return toast.error("Access denied.");
      }
      const response = await Axios.delete(`/category/${id}`, {
        headers: {
          Authorization: token,
        },
      });
      fetch();
      resetForm();
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };
  if (loading) return <TriangleLoader height="500px" />;
  return (
    <div className="py-4 px-8 max-h-full max-[600px]:py-5 max-[600px]:px-4">
      <h1 className="text-2xl font-bold text-[#1a1a1a] mb-3">Category</h1>
      <div className="flex flex-row gap-4 max-[600px]:flex-col">
        <form onSubmit={handleFormSubmit} className="w-full flex flex-col">
          <div className="flex justify-between flex-row w-full gap-4 max-[768px]:flex-col max-[768px]:gap-0">
            <div className="w-full">
              <label htmlFor="name" className="text-sm font-medium text-[#1a1a1a]">Name</label>
              <input
                type="text"
                className="py-2 px-3 text-sm font-normal text-[#1a1a1a] bg-white border border-[#ccc] rounded mb-2 w-full overflow-auto font-sans"
                id="name"
                placeholder="Enter category name"
                onChange={handleInputChange}
                value={formData.name}
              />
            </div>
            <div className="w-full">
              <label htmlFor="description" className="text-sm font-medium text-[#1a1a1a]">Description</label>
              <input
                type="text"
                className="py-2 px-3 text-sm font-normal text-[#1a1a1a] bg-white border border-[#ccc] rounded mb-2 w-full overflow-auto font-sans"
                id="description"
                placeholder="Enter brand description"
                onChange={handleInputChange}
                value={formData.description}
              />
            </div>
          </div>
          <div className="flex justify-center items-center gap-4 mb-6 max-[650px]:flex-col max-[650px]:gap-0">
            <button type="button" onClick={handleUpdate(formData.id)} className="py-2 px-6 w-full text-base font-medium text-white bg-[#54bab9] border-none rounded cursor-pointer my-2">
              Update
            </button>
            <button type="button" onClick={() => deleteCoupon(formData.id)} className="py-2 px-6 w-full text-base font-medium text-white bg-[#54bab9] border-none rounded cursor-pointer my-2">
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

export default CategoryList;
