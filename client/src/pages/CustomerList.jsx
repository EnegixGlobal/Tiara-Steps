import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Axios from "../Axios";
import CustomerTable from "../components/CustomerTable";
import TriangleLoader from "../components/TriangleLoader";
const CustomerList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetch = async () => {
      try {
        const token = localStorage.getItem("jwtAdmin");
        if (!token) {
          return toast.error("Access denied. Please login first.");
        }
        const response = await Axios.get("/admin/users", {
          headers: {
            Authorization: token,
          },
        });
        if (response.data.success) {
          setData(response.data.users);
        }
        setLoading(false);
      } catch (error) {
        toast.error(error?.response?.data?.message);
        setLoading(false);
      }
    };
    fetch();
  }, []);
  const columns = [
    {
      Header: "Id",
      accessor: "index",
    },
    {
      Header: "Name",
      accessor: "name",
    },
    {
      Header: "Email",
      accessor: "email",
    },
    {
      Header: "Created At",
      accessor: "createdAt",
      sortType: (rowA, rowB, columnId) => {
        const dateA = new Date(rowA.values[columnId]);
        const dateB = new Date(rowB.values[columnId]);
        return dateA - dateB;
      },
    },
  ];
  if (loading) return <TriangleLoader height="500px" />;
  return (
    <div className="py-4 px-8 max-h-full max-[600px]:py-5 max-[600px]:px-4">
      <h1 className="text-2xl font-bold text-[#1a1a1a] mb-3">Customers</h1>
      <div className="flex flex-row gap-4 overflow-auto max-[600px]:flex-col">
        <CustomerTable columns={columns} data={data} />
      </div>
    </div>
  );
};

export default CustomerList;
