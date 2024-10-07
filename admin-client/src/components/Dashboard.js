import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import axios from "axios";
import { PiShoppingBagBold } from "react-icons/pi";
import { PiCalendarCheckLight } from "react-icons/pi";
import { HiOutlineShoppingCart } from "react-icons/hi2";
import { LuUsers } from "react-icons/lu";
import BarChart from "./BarChart";

const Dashboard = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [statusCounts, setStatusCounts] = useState({
    pending: 0,
    completed: 0,
    declined: 0,
  });
  const [percentageChanges, setPercentageChanges] = useState({
    pending: 0,
    completed: 0,
    declined: 0,
  });

  const barChartLabels = ["Completed", "Declined", "Pending", "Customers"];
  const barChartData = [
    statusCounts.completed,
    statusCounts.declined,
    statusCounts.pending,
    customers.length,
  ];

  const storedAdminId = localStorage.getItem("userId");
  const storedRole = localStorage.getItem("role");

  useEffect(() => {
    fetchOrders(storedRole, storedAdminId);
    fetchCustomers();
  }, [storedRole, storedAdminId]);

  const fetchOrders = async (role, adminId) => {
    try {
      const response = await axios.get("http://localhost:8090/api/order/", {
        headers: {
          "x-access-token": token,
        },
      });

      const fetchedOrders = response.data.orders;

      // Filter orders by adminId if the role is "shop admin"
      const filteredOrders =
        role === "shop admin"
          ? fetchedOrders.filter((order) =>
              order.items.some((item) => item.adminId === adminId)
            )
          : fetchedOrders;

      setOrders(filteredOrders);

      // Count the status
      const counts = filteredOrders.reduce(
        (acc, order) => {
          if (order.status === "pending") {
            acc.pending += 1;
          } else if (order.status === "completed") {
            acc.completed += 1;
          } else if (order.status === "declined") {
            acc.declined += 1;
          }
          return acc;
        },
        { pending: 0, completed: 0, declined: 0 }
      );

      setStatusCounts(counts);

      // Calculate the percentage change
      const previousWeekCounts = {
        pending: 10,
        completed: 8,
        declined: 5,
      };

      const percentageChanges = {
        pending:
          ((counts.pending - previousWeekCounts.pending) /
            previousWeekCounts.pending) *
          100,
        completed:
          ((counts.completed - previousWeekCounts.completed) /
            previousWeekCounts.completed) *
          100,
        declined:
          ((counts.declined - previousWeekCounts.declined) /
            previousWeekCounts.declined) *
          100,
      };

      setPercentageChanges(percentageChanges);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await axios(`http://localhost:8090/api/customer`, {
        headers: {
          "x-access-token": token,
        },
      });
      setCustomers(response.data);
    } catch (error) {
      console.log("Failed to fetch customer", error);
    }
  };

  return (
    <div className="h-screen flex">
      <Sidebar />
      <div className="sideB w-full h-full">
        <div>
          <h1 className="text-2xl text-slate-500 py-3 px-10 ">Dashboard</h1>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-[95%] m-auto">
            <div className="bg-white p-5 cursor-pointer shadow-lg rounded-md">
              <div className="flex justify-between items-center mb-3">
                <h1 className="text-slate-500">Pending</h1>
                <PiShoppingBagBold className="bg-blue-200 text-2xl p-1 rounded-full text-blue-400" />
              </div>
              <h2 className="text-2xl mb-3">{statusCounts.pending}</h2>
              <div className="flex">
                <p
                  className={`${
                    percentageChanges.pending >= 0
                      ? "bg-green-100 text-green-500"
                      : "bg-red-100 text-red-500"
                  } font-bold me-3 text-xs flex items-center p-1`}
                >
                  {percentageChanges.pending.toFixed(2)}%
                </p>
                <p>Since last week</p>
              </div>
            </div>

            <div className="bg-white p-5 cursor-pointer shadow-lg rounded-md">
              <div className="flex justify-between items-center mb-3 ">
                <h1 className="text-slate-500">Completed</h1>
                <PiCalendarCheckLight className="bg-blue-200 text-2xl p-1 rounded-full text-blue-400" />
              </div>
              <h2 className="text-2xl mb-3">{statusCounts.completed}</h2>
              <div className="flex">
                <p
                  className={`${
                    percentageChanges.completed >= 0
                      ? "bg-green-100 text-green-500"
                      : "bg-red-100 text-red-500"
                  } font-bold me-3 text-xs flex items-center p-1`}
                >
                  {percentageChanges.completed.toFixed(2)}%
                </p>
                <p>Since last week</p>
              </div>
            </div>

            <div className="bg-white p-5 cursor-pointer shadow-lg rounded-md">
              <div className="flex justify-between items-center mb-3">
                <h1 className="text-slate-500">Declined</h1>
                <HiOutlineShoppingCart className="bg-blue-200 text-2xl p-1 rounded-full text-blue-400" />
              </div>
              <h2 className="text-2xl mb-3">{statusCounts.declined}</h2>
              <div className="flex">
                <p
                  className={`${
                    percentageChanges.declined >= 0
                      ? "bg-green-100 text-green-500"
                      : "bg-red-100 text-red-500"
                  } font-bold me-3 text-xs flex items-center p-1`}
                >
                  {percentageChanges.declined.toFixed(2)}%
                </p>
                <p>Since last week</p>
              </div>
            </div>

            <div className="bg-white p-5 cursor-pointer shadow-lg rounded-md">
              <div className="flex justify-between items-center mb-3">
                <h1 className="text-slate-500">Customers</h1>
                <LuUsers className="bg-blue-200 text-2xl p-1 rounded-full text-blue-400" />
              </div>
              <h2 className="text-2xl mb-3">{customers.length}</h2>
              <div className="flex">
                <p className="bg-green-100 font-bold text-green-500 me-3 text-xs flex items-center p-1">
                  0.95%
                </p>
                <p>Since last week</p>
              </div>
            </div>
          </div>
        </div>

        <div
          className="bg-white p-5 cursor-pointer shadow-lg rounded-md w-[95%] m-auto mt-4"
          style={{ height: "450px" }}
        >
          <h2 className="text-2xl text-slate-500 mb-2">Sales Overview</h2>
          <div className="flex justify-center" style={{ height: "370px" }}>
            <BarChart data={barChartData} labels={barChartLabels} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
