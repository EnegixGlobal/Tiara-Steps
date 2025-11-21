import { useEffect, useState } from "react";
import TriangleLoader from "../components/TriangleLoader";
import Axios from "../Axios";
import { toast } from "react-toastify";
import Pagination from "./Pagination";

const AdminReturns = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [statusFilter, setStatusFilter] = useState("all");

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
      setLoading(true);
      const response = await Axios.get("/return/all", {
        params: { limit, page, status: statusFilter },
        headers: {
          Authorization: token,
        },
      });

      setData(response.data.returns);
      setTotalPages(Math.ceil(response.data.count / limit));
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error(error?.response?.data?.message || "Failed to fetch returns");
    }
  };

  const handleApprove = async (orderId, productItemId) => {
    try {
      const token = localStorage.getItem("jwtAdmin");
      if (!token) {
        return toast.error("Access denied.");
      }

      if (!window.confirm("Are you sure you want to approve this return request?")) {
        return;
      }

      const response = await Axios.put(
        "/return/approve",
        { orderId, productItemId },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      if (response.data.success) {
        toast.success("Return request approved");
        fetchData();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to approve return");
    }
  };

  const handleReject = async (orderId, productItemId) => {
    try {
      const token = localStorage.getItem("jwtAdmin");
      if (!token) {
        return toast.error("Access denied.");
      }

      if (!window.confirm("Are you sure you want to reject this return request?")) {
        return;
      }

      const response = await Axios.put(
        "/return/reject",
        { orderId, productItemId },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      if (response.data.success) {
        toast.success("Return request rejected");
        fetchData();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to reject return");
    }
  };

  const handleComplete = async (orderId, productItemId) => {
    try {
      const token = localStorage.getItem("jwtAdmin");
      if (!token) {
        return toast.error("Access denied.");
      }

      if (
        !window.confirm(
          "Are you sure you want to complete this return? This will process the refund and restore product quantity."
        )
      ) {
        return;
      }

      const response = await Axios.put(
        "/return/complete",
        { orderId, productItemId },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      if (response.data.success) {
        toast.success("Return completed and refund processed");
        fetchData();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to complete return");
    }
  };

  const getStatusChip = (status) => {
    const s = status?.toLowerCase() || "";
    let styles =
      "px-3 py-1 rounded-full text-xs font-semibold inline-block text-white";

    if (s === "requested") styles += " bg-yellow-500";
    else if (s === "approved") styles += " bg-blue-500";
    else if (s === "rejected") styles += " bg-red-500";
    else if (s === "returned" || s === "refunded") styles += " bg-green-500";
    else styles += " bg-gray-400";

    return <span className={styles}>{status}</span>;
  };

  useEffect(() => {
    fetchData();
  }, [page, statusFilter]);

  if (loading) return <TriangleLoader height="500px" />;

  return (
    <div className="font-sans my-[2%] mx-[3%] mb-[4%]">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl leading-8 font-semibold text-left">
          Return Requests
        </h1>
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A37478]"
        >
          <option value="all">All Status</option>
          <option value="requested">Requested</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="returned">Returned</option>
        </select>
      </div>

      <div className="flex flex-col my-4 w-full overflow-x-scroll">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="bg-gray-100 py-3 px-5 text-xs leading-4 font-bold uppercase tracking-wide text-center text-left">
                Product Details
              </th>
              <th className="bg-gray-100 py-3 px-5 text-xs leading-4 font-bold uppercase tracking-wide text-center">
                Customer
              </th>
              <th className="bg-gray-100 py-3 px-5 text-xs leading-4 font-bold uppercase tracking-wide text-center">
                Return Reason
              </th>
              <th className="bg-gray-100 py-3 px-5 text-xs leading-4 font-bold uppercase tracking-wide text-center">
                Quantity
              </th>
              <th className="bg-gray-100 py-3 px-5 text-xs leading-4 font-bold uppercase tracking-wide text-center">
                Status
              </th>
              <th className="bg-gray-100 py-3 px-5 text-xs leading-4 font-bold uppercase tracking-wide text-center">
                Requested Date
              </th>
              <th className="bg-gray-100 py-3 px-5 text-xs leading-4 font-bold uppercase tracking-wide text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan="7" className="py-8 text-center text-gray-500">
                  No return requests found
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr key={index}>
                  <td className="py-4 border-b-2 border-gray-200 text-sm leading-5">
                    <div className="flex items-center px-4">
                      <div className="w-16 h-16 flex-shrink-0">
                        <img
                          src={item.product.image}
                          alt="product"
                          className="object-contain w-full h-full rounded-[15%] bg-gray-100"
                        />
                      </div>
                      <div className="ml-3 text-left">
                        <p className="text-base font-medium">{item.product.name}</p>
                        <p className="text-sm text-gray-600">
                          {item.product.color}, Size: {item.product.size}
                        </p>
                        <p className="text-sm text-gray-600">
                          Ordered: {item.product.orderedQuantity} unit(s)
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 border-b-2 border-gray-200 text-sm leading-5 text-center">
                    <div>
                      <p className="font-medium">{item.user.name}</p>
                      <p className="text-xs text-gray-500">{item.user.email}</p>
                    </div>
                  </td>
                  <td className="py-4 border-b-2 border-gray-200 text-sm leading-5 text-center">
                    <p className="text-sm">{item.returnRequest.reason}</p>
                  </td>
                  <td className="py-4 border-b-2 border-gray-200 text-sm leading-5 text-center">
                    <p className="font-medium">{item.returnRequest.returnQuantity}</p>
                  </td>
                  <td className="py-4 border-b-2 border-gray-200 text-sm leading-5 text-center">
                    {getStatusChip(item.returnRequest.status)}
                    {item.returnRequest.refundId && (
                      <p className="text-xs text-gray-500 mt-1">
                        Refund: {item.returnRequest.refundId}
                      </p>
                    )}
                  </td>
                  <td className="py-4 border-b-2 border-gray-200 text-sm leading-5 text-center">
                    {item.returnRequest.requestedAt
                      ? new Date(item.returnRequest.requestedAt).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="py-4 border-b-2 border-gray-200 text-sm leading-5 text-center">
                    <div className="flex flex-col gap-2 items-center">
                      {item.returnRequest.status === "requested" && (
                        <>
                          <button
                            className="w-24 py-2 text-white font-semibold rounded text-sm bg-green-500 border border-green-500 cursor-pointer hover:bg-green-600 hover:border-green-600 transition-colors"
                            onClick={() =>
                              handleApprove(item.orderId, item.productItemId)
                            }
                          >
                            Approve
                          </button>
                          <button
                            className="w-24 py-2 text-white font-semibold rounded text-sm bg-red-500 border border-red-500 cursor-pointer hover:bg-red-600 hover:border-red-600 transition-colors"
                            onClick={() =>
                              handleReject(item.orderId, item.productItemId)
                            }
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {item.returnRequest.status === "approved" && (
                        <button
                          className="w-28 py-2 text-white font-semibold rounded text-sm bg-blue-500 border border-blue-500 cursor-pointer hover:bg-blue-600 hover:border-blue-600 transition-colors"
                          onClick={() =>
                            handleComplete(item.orderId, item.productItemId)
                          }
                        >
                          Complete Return
                        </button>
                      )}
                      {(item.returnRequest.status === "rejected" ||
                        item.returnRequest.status === "returned") && (
                        <span className="text-xs text-gray-500">
                          {item.returnRequest.status === "rejected"
                            ? "Rejected"
                            : "Completed"}
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {data.length > 0 && (
        <Pagination
          totalPageCount={totalPages}
          previousPage={() => setPage(page - 1)}
          canPreviousPage={canPreviousPage}
          nextPage={() => setPage(page + 1)}
          canNextPage={canNextPage}
          gotoPage={gotoPage}
          pageIndex={page - 1}
        />
      )}
    </div>
  );
};

export default AdminReturns;

