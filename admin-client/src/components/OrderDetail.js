import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import Spinner from "./Spinner";
import { useNavigate } from "react-router-dom";
import { DayPicker, isDatesArray } from "react-day-picker";
import "react-day-picker/dist/style.css";
import AOS from "aos";
import "aos/dist/aos.css";

const OrderDetail = ({ token }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchName, setSearchName] = useState("");
  const [orders, setOrders] = useState([]);
  const [admin, setAdmin] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(8);

  const storedRole = localStorage.getItem("role");
  const storedAdminId = localStorage.getItem("userId");

  useEffect(() => {
    fetchOrders(storedRole, storedAdminId);
    fetchAdmin();
  }, []);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  const navigateWithLoading = (path) => {
    setLoading(true); // Start loading when navigating
    setTimeout(() => {
      navigate(path);
      setLoading(false); // Stop loading after navigation
    }, 500); // Simulate some loading time
  };

  const fetchAdmin = async () => {
    setLoading(true);
    try {
      const response = await axios(
        `https://multishop-ecommerce-wbac.onrender.com/api/adminuser/`,
        {
          headers: {
            "x-access-token": token,
          },
        }
      );
      setAdmin(response.data);
    } catch (error) {
      console.error("Failed to fetch admin: ", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async (role, adminId) => {
    setLoading(true);
    try {
      let url = "https://multishop-ecommerce-wbac.onrender.com/api/order/";

      if (role === "shop admin") {
        url = `https://multishop-ecommerce-wbac.onrender.com/api/order/admin/${adminId}`;
      }

      const response = await axios.get(url, {
        headers: {
          "x-access-token": token,
        },
      });

      // console.log("API Response:", response.data);

      if (role === "shop admin") {
        if (Array.isArray(response.data)) {
          setOrders(response.data);
        } else {
          setOrders([]);
        }
      } else {
        if (Array.isArray(response.data.orders)) {
          setOrders(response.data.orders);
        } else {
          setOrders([]);
        }
      }

      // console.log("Orders state after setting:", orders);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(
    (order) =>
      (filterStatus === "all" ? true : order.status === filterStatus) &&
      (selectedDate
        ? new Date(order.createAt).toDateString() ===
          selectedDate.toDateString()
        : true) &&
      (searchName
        ? order.username.toLowerCase().includes(searchName.toLowerCase())
        : true)
  );
  // console.log("Filtered orders for super admin:", filteredOrders);

  // Pagination logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const nextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  return (
    <div className="h-screen flex">
      {loading && <Spinner />}
      <div>
        <Sidebar />
      </div>
      <div className="sideB w-full h-full">
        <div className="flex">
          <div className="px-5 h-screen w-[27%] bg-slate-100">
            <div className="daypicker-container">
              <DayPicker
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
              />
              {selectedDate && (
                <p className="m-3 text-center" data-aos="zoom-in">
                  Selected Date: {selectedDate.toDateString()}
                </p>
              )}
            </div>
            <div className="mt-10">
              <div
                className="bg-slate-400 rounded-2xl mb-2 cursor-pointer"
                onClick={() => setFilterStatus("pending")}
              >
                <div className="flex justify-between p-2 text-white">
                  <h1 className="mt-3 ms-5 text-lg">Pending Orders</h1>
                  <p className="border border-slate-200 rounded-full py-3 px-4">
                    {
                      orders.filter(
                        (order) =>
                          order.status === "pending" &&
                          (selectedDate
                            ? new Date(order.createAt).toDateString() ===
                              selectedDate.toDateString()
                            : true)
                      ).length
                    }
                  </p>
                </div>
              </div>
              <div
                className="bg-slate-400 rounded-2xl mb-2 cursor-pointer"
                onClick={() => setFilterStatus("completed")}
              >
                <div className="flex justify-between p-2 text-white">
                  <h1 className="mt-3 ms-5 text-lg">Completed Orders</h1>
                  <p className="border border-slate-200 rounded-full py-3 px-4">
                    {
                      orders.filter(
                        (order) =>
                          order.status === "completed" &&
                          (selectedDate
                            ? new Date(order.createAt).toDateString() ===
                              selectedDate.toDateString()
                            : true)
                      ).length
                    }
                  </p>
                </div>
              </div>
              <div
                className="bg-slate-400 rounded-2xl mb-2 cursor-pointer"
                onClick={() => setFilterStatus("declined")}
              >
                <div className="flex justify-between p-2 text-white">
                  <h1 className="mt-3 ms-5 text-lg">Declined Orders</h1>
                  <p className="border border-slate-200 rounded-full py-3 px-4">
                    {
                      orders.filter(
                        (order) =>
                          order.status === "declined" &&
                          (selectedDate
                            ? new Date(order.createAt).toDateString() ===
                              selectedDate.toDateString()
                            : true)
                      ).length
                    }
                  </p>
                </div>
              </div>
              <div
                className="bg-slate-400 rounded-2xl mb-2 cursor-pointer"
                onClick={() => setFilterStatus("canceled")}
              >
                <div className="flex justify-between p-2 text-white">
                  <h1 className="mt-3 ms-5 text-lg">Canceled Orders</h1>
                  <p className="border border-slate-200 rounded-full py-3 px-4">
                    {
                      orders.filter(
                        (order) =>
                          order.status === "canceled" &&
                          (selectedDate
                            ? new Date(order.createAt).toDateString() ===
                              selectedDate.toDateString()
                            : true)
                      ).length
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="w-[73%] h-screen">
            <div className="p-4 flex justify-between mx-5">
              <h1 className="text-2xl text-slate-600">Orders</h1>
              <input
                type="text"
                placeholder="Search..."
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                className="p-2 px-3 outline-none rounded-lg w-[30%]"
              />
            </div>
            <div className="mx-3">
              <div className=" bg-slate-400 p-2 rounded-lg">
                <div className="flex text-center text-white font-semibold">
                  <h1 className="w-[5%]">No</h1>
                  <div className="grid grid-cols-4 gap-5 w-[65%]">
                    <h2>Customer Name</h2>
                    <h2>Shop Logo</h2>
                    <h3>Amount</h3>
                    <h4>Date</h4>
                  </div>
                  <div className="grid grid-cols-2">
                    <h5 className="ms-10">Status</h5>
                  </div>
                </div>
              </div>
              {currentOrders.length > 0 ? (
                currentOrders.map((order, index) => (
                  <div
                    key={order._id}
                    className="border-b-2 border-slate-300 p-3"
                  >
                    <div className="flex items-center text-center">
                      <h1 className="w-[5%]">
                        {indexOfFirstOrder + index + 1}
                      </h1>
                      <div className="grid grid-cols-4 gap-5 w-[65%] ">
                        <h2 className="font-bold text-slate-600 ">
                          {order.username}
                        </h2>
                        <img
                          src={
                            admin.find(
                              (adminUser) =>
                                adminUser._id === order.items[0]?.adminId
                            )?.shopLogo || "default_logo_url"
                          }
                          alt="Shop Logo"
                          className="w-8 h-8 ms-11 object-cover rounded-full"
                        />
                        <h3>{order.total} mmk</h3>
                        <h4>{new Date(order.createAt).toLocaleDateString()}</h4>
                      </div>
                      <div className="grid grid-cols-2 gap-12">
                        <h5
                          className={`ms-10 ${
                            order.status === "pending"
                              ? "text-yellow-500"
                              : order.status === "completed"
                              ? "text-green-500"
                              : order.status === "declined"
                              ? "text-red-500"
                              : order.status === "canceled"
                              ? "text-red-500"
                              : ""
                          } font-semibold mt-1`}
                        >
                          {order.status}
                        </h5>
                        <button
                          className="border-2 border-lime-600 rounded-lg p-1 text-lime-600 font-semibold"
                          onClick={() =>
                            navigateWithLoading(`/orderdetail/${order._id}`)
                          }
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center">No orders found.</p>
              )}
            </div>
            {/* Pagination controls */}
            <div className="flex justify-center my-8 items-center">
              <button
                onClick={prevPage}
                disabled={currentPage === 1}
                className={`mx-1 px-3 py-1 rounded ${
                  currentPage === 1
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-lime-600 text-white"
                }`}
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => paginate(i + 1)}
                  className={`mx-1 px-3 py-1 rounded ${
                    currentPage === i + 1
                      ? "bg-lime-600 text-white"
                      : "bg-gray-300"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={nextPage}
                disabled={currentPage === totalPages}
                className={`mx-1 px-3 py-1 rounded ${
                  currentPage === totalPages
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-lime-600 text-white"
                }`}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
