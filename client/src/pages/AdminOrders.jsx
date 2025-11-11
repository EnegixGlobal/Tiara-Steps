import { useEffect, useState } from "react";
import TriangleLoader from "../components/TriangleLoader";
import EmptyImage from "../Images/empty-cart.png";
import Axios from "../Axios";
import { toast } from "react-toastify";
import Pagination from "./Pagination";

const AdminOrders = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(8);
  const [totalPages, setTotalPages] = useState(0);
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
      const response = await Axios.get("/admin/order", {
        params: { limit, page },
        headers: {
          Authorization: token,
        },
      });

      console.log(response.data);
      setData(response.data.orders);
      setTotalPages(Math.ceil(response.data.count / limit));
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (id, status, paymentId) => {
    try {
      const token = localStorage.getItem("jwtAdmin");
      if (!token) {
        return toast.error("Access denied.");
      }
      const response = await Axios.put(
        "/admin/order",
        { id, status, paymentId },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      if (response.data.success) {
        const updatedData = data.map((item) => {
          if (item._id === id) {
            item.delivered = status;
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
  useEffect(() => {
    fetchData();
  }, [page]);

  if (loading) return <TriangleLoader height="500px" />;
  return (
    <div className="font-sans my-[2%] mx-[3%] mb-[4%]">
      <h1 className="text-2xl leading-8 font-semibold text-left">
        Orders List
      </h1>
      <div className="flex flex-col my-4 w-full overflow-x-scroll">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="bg-gray-100 py-3 px-5 text-xs leading-4 font-bold uppercase tracking-wide text-center text-left">Product Details</th>
              <th className="bg-gray-100 py-3 px-5 text-xs leading-4 font-bold uppercase tracking-wide text-center">Customer</th>
              <th className="bg-gray-100 py-3 px-5 text-xs leading-4 font-bold uppercase tracking-wide text-center">Order Date</th>
              <th className="bg-gray-100 py-3 px-5 text-xs leading-4 font-bold uppercase tracking-wide text-center">Status</th>
              <th className="bg-gray-100 py-3 px-5 text-xs leading-4 font-bold uppercase tracking-wide text-center">Total Price</th>
              <th className="bg-gray-100 py-3 px-5 text-xs leading-4 font-bold uppercase tracking-wide text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td className="py-4 border-b-2 border-gray-200 text-sm leading-5 text-center">
                  {item.products.map((product) => (
                    <div key={product._id} className="flex justify-between py-3 px-4 items-center">
                      <div className="flex items-center">
                        <div className="w-16 h-16 flex-shrink-0">
                          <img
                            src={product.image}
                            alt="product"
                            className="object-contain w-full h-full rounded-[15%] bg-gray-100"
                          />
                        </div>
                        <div className="ml-3 text-left">
                          <p className="text-base ml-3 w-[13rem] whitespace-nowrap overflow-hidden text-ellipsis">
                            {product.name}
                          </p>
                          <p className="text-sm ml-3">{product.desc}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </td>
                <td className="py-4 border-b-2 border-gray-200 text-sm leading-5 text-center">{item.user}</td>
                <td className="py-4 border-b-2 border-gray-200 text-sm leading-5 text-center">{item.createdAt}</td>
                <td className="py-4 border-b-2 border-gray-200 text-sm leading-5 text-center">{item.delivered}</td>
                <td className="py-4 border-b-2 border-gray-200 text-sm leading-5 text-center">₹{item.total}</td>
                <td className="py-4 border-b-2 border-gray-200 text-sm leading-5 text-center">
                  <div className="flex justify-center items-center flex-col">
                    <button
                      className="w-24 py-2.5 mx-1.5 mb-1.5 text-white font-semibold rounded text-[15px] bg-[#54bab9] border border-[#54bab9] cursor-pointer hover:bg-[#3f8f8e] hover:border-[#3f8f8e] disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={item.delivered !== "pending"}
                      onClick={() =>
                        updateOrderStatus(item._id, "Delivered", item.paymentId)
                      }
                    >
                      Delivered
                    </button>
                    <button
                      className="w-24 py-2.5 mx-1.5 text-white font-semibold rounded text-[15px] bg-[#54bab9] border border-[#54bab9] cursor-pointer hover:bg-[#3f8f8e] hover:border-[#3f8f8e] disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={item.delivered !== "pending"}
                      onClick={() =>
                        updateOrderStatus(item._id, "Cancelled", item.paymentId)
                      }
                    >
                      Cancel
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!data || data.length <= 0) && (
          <div className="flex justify-center items-center min-w-full flex-col gap-0">
            <img src={EmptyImage} alt="empty-cart" className="w-full max-w-[500px] h-auto my-4" />
            <p className="text-xl font-semibold text-gray-900 -mt-8 mb-8 text-center">No orders have been placed yet.</p>
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

export default AdminOrders;
