import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import TriangleLoader from "../components/TriangleLoader";
import EmptyImage from "../Images/empty-cart.png";
import Axios from "../Axios";
import { toast } from "react-toastify";
import Pagination from "./Pagination";
import { FiSearch } from "react-icons/fi";

const AdminProductList = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debounce, setDebounce] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();

  // ✅ ADD THIS useEffect HERE
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }, [page]);

  const canPreviousPage = page > 1;
  const canNextPage = page < totalPages;
  const gotoPage = (p) => {
    setPage(p);
  };
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("jwtAdmin");
      if (!token) {
        return toast.error("Access denied.");
      }
      const response = await Axios.get("/admin/products", {
        params: { limit, page, searchTerm },
        headers: {
          Authorization: token,
        },
      });

      setData(response.data.products);
      setTotalPages(Math.ceil(response.data.count / limit));
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const updateProductStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("jwtAdmin");
      if (!token) {
        return toast.error("Access denied.");
      }
      const response = await Axios.put(
        `/admin/product/${id}`,
        {},
        {
          headers: { Authorization: token },
        }
      );
      if (response.data.success) {
        const updatedData = data.map((item) => {
          if (item._id === id) {
            item.status = status;
          }
          return item;
        });
        setData(updatedData);
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }
    try {
      const token = localStorage.getItem("jwtAdmin");
      if (!token) {
        return toast.error("Access denied.");
      }
      const response = await Axios.delete(`/admin/product/${id}`, {
        headers: { Authorization: token },
      });
      if (response.data.success) {
        const updatedData = data.filter((item) => item._id !== id);
        setData(updatedData);
        toast.success(response.data.message);
        // Refresh data to update pagination
        fetchData();
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to delete product."
      );
    }
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounce(searchTerm);
    }, 700);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    fetchData();
  }, [page, debounce]);

  if (loading) return <TriangleLoader height="500px" />;
  return (
    <div className="font-sans my-[2%] mx-[3%] mb-[4%]">
      <h1 className="text-2xl leading-8 font-semibold text-left">
        Product List
      </h1>
      <div className="w-full flex gap-2 mb-4">
        <div className="w-[43%] relative font-sans">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="What shoes are you looking for ?"
            className="w-full h-9 pl-8 text-base outline-none border-2 border-gray-300 text-gray-600"
          />
          <div className="absolute z-[99] top-[18%] left-1.5 text-xl font-semibold flex bg-white text-gray-600">
            <FiSearch />
          </div>
        </div>
        <button
          className="m-0 text-lg font-semibold border-none text-white bg-[#b89396] outline-none cursor-pointer py-1.5 px-5 h-9"
          onClick={() => navigate("/admin/product/add")}
          type="button"
        >
          Add Product
        </button>
      </div>
      <div className="flex flex-col my-4 w-full overflow-x-scroll">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="bg-gray-100 py-3 px-5 text-xs leading-4 font-bold uppercase tracking-wide text-center text-left">
                Product Details
              </th>
              <th className="bg-gray-100 py-3 px-5 text-xs leading-4 font-bold uppercase tracking-wide text-center">
                Brand
              </th>
              <th className="bg-gray-100 py-3 px-5 text-xs leading-4 font-bold uppercase tracking-wide text-center">
                Size(UK)
              </th>
              <th className="bg-gray-100 py-3 px-5 text-xs leading-4 font-bold uppercase tracking-wide text-center">
                Status
              </th>
              <th className="bg-gray-100 py-3 px-5 text-xs leading-4 font-bold uppercase tracking-wide text-center">
                New Tag
              </th>
              <th className="bg-gray-100 py-3 px-5 text-xs leading-4 font-bold uppercase tracking-wide text-center">
                Price
              </th>
              <th className="bg-gray-100 py-3 px-5 text-xs leading-4 font-bold uppercase tracking-wide text-center">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td className="py-4 border-b-2 border-gray-200 text-sm leading-5 text-center">
                  <div
                    key={item._id}
                    className="flex justify-between py-3 px-4 items-center"
                  >
                    <div className="flex items-center">
                      <div className="w-16 h-16 flex-shrink-0">
                        <img
                          src={item.image}
                          alt="product"
                          className="object-contain w-full h-full rounded-[15%] bg-gray-100"
                        />
                      </div>
                      <div className="ml-3 text-left">
                        <p className="text-base ml-3 w-[13rem] whitespace-nowrap overflow-hidden text-ellipsis">
                          {item.name}
                        </p>
                        <p className="text-sm ml-3">{item.desc}</p>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-4 border-b-2 border-gray-200 text-sm leading-5 text-center">
                  {item.brand}
                </td>
                <td className="py-4 border-b-2 border-gray-200 text-sm leading-5 text-center">
                  {item.size.split(", ").map((s, i) => (
                    <div key={i}>
                      {s}
                      <br />
                    </div>
                  ))}
                </td>
                <td className="py-4 border-b-2 border-gray-200 text-sm leading-5 text-center">
                  {item.status}
                </td>
                <td className="py-4 border-b-2 border-gray-200 text-sm leading-5 text-center">
                  <button
                    className={`w-24 py-2.5 mx-1.5 text-white font-semibold rounded text-[13px] border cursor-pointer transition-colors ${
                      item.isNew
                        ? "bg-green-600 border-green-600 hover:bg-green-700 hover:border-green-700"
                        : "bg-gray-400 border-gray-400 hover:bg-gray-500 hover:border-gray-500"
                    }`}
                    onClick={async () => {
                      try {
                        const token = localStorage.getItem("jwtAdmin");
                        if (!token) {
                          return toast.error("Access denied.");
                        }
                        const response = await Axios.put(
                          `/admin/product/new/${item._id}`,
                          {},
                          {
                            headers: { Authorization: token },
                          }
                        );
                        if (response.data.success) {
                          const updatedData = data.map((prod) =>
                            prod._id === item._id
                              ? { ...prod, isNew: response.data.isNew }
                              : prod
                          );
                          setData(updatedData);
                          toast.success(response.data.message);
                        }
                      } catch (error) {
                        toast.error(
                          error?.response?.data?.message ||
                            "Failed to update New tag."
                        );
                      }
                    }}
                  >
                    {item.isNew ? "New On" : "New Off"}
                  </button>
                </td>
                <td className="py-4 border-b-2 border-gray-200 text-sm leading-5 text-center">
                  ₹{item.price}
                </td>
                <td className="py-4 border-b-2 border-gray-200 text-sm leading-5 text-center">
                  <div className="flex justify-center items-center flex-col">
                    <button
                      className="w-24 py-2.5 mx-1.5 mb-1.5 text-white font-semibold rounded text-[15px] bg-[#54bab9] border border-[#54bab9] cursor-pointer hover:bg-[#3f8f8e] hover:border-[#3f8f8e]"
                      onClick={() =>
                        navigate(`/admin/product/update/${item.slug}`)
                      }
                    >
                      Edit
                    </button>
                    <button
                      className="w-24 py-2.5 mx-1.5 mb-1.5 text-white font-semibold rounded text-[15px] bg-[#54bab9] border border-[#54bab9] cursor-pointer hover:bg-[#3f8f8e] hover:border-[#3f8f8e]"
                      onClick={() =>
                        updateProductStatus(
                          item._id,
                          item.status === "Active" ? "Inactive" : "Active"
                        )
                      }
                    >
                      {item.status === "Active" ? "Deactivate" : "Activate"}
                    </button>
                    {item.status === "Inactive" && (
                      <button
                        className="w-24 py-2.5 mx-1.5 text-white font-semibold rounded text-[15px] bg-[#b89396] border border-[#b89396] cursor-pointer hover:bg-[#b89396] hover:border-[#b89396]"
                        onClick={() => deleteProduct(item._id)}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!data || data.length <= 0) && (
          <div className="flex justify-center items-center min-w-full flex-col gap-0">
            <img
              src={EmptyImage}
              alt="empty-cart"
              className="w-full max-w-[500px] h-auto my-4"
            />
            <p className="text-xl font-semibold text-gray-900 -mt-8 mb-8 text-center">
              No products have been added yet. Start adding some!
            </p>
          </div>
        )}
      </div>
      <Pagination
        totalPageCount={totalPages}
        previousPage={() => setPage(page - 1)}
        canPreviousPage={canPreviousPage}
        nextPage={() => setPage(page + 1)}
        canNextPage={canNextPage}
        gotoPage={gotoPage}
        pageIndex={page - 1}
      />
    </div>
  );
};

export default AdminProductList;
