import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Spinner from "./Spinner";
import axios from "axios";
import { RiDeleteBin7Fill } from "react-icons/ri";
import { AiFillEdit } from "react-icons/ai";

const Status = ({ token }) => {
  const [statusList, setStatusList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [previousStatus, setPreviousStatus] = useState("");
  const [update, setUpdate] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  //
  const protectedStatuses = ["pending", "canceled", "declined", "completed"];

  useEffect(() => {
    getStatus();
  }, []);

  const getStatus = async () => {
    setLoading(true);
    try {
      const response = await axios(
        `https://multishop-ecommerce-wbac.onrender.com/api/status`,
        {
          headers: {
            "x-access-token": token,
          },
        }
      );
      // console.log(response.data);
      setStatusList(response.data.allStatus || response.data);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const addStatus = async () => {
    if (!newStatus.trim()) {
      alert("Please enter a status");
      return;
    }
    setLoading(true);
    try {
      await axios.post(
        `https://multishop-ecommerce-wbac.onrender.com/api/status`,
        { status: newStatus },
        { headers: { "x-access-token": token } }
      );
      // console.log("Server response:", response.data);
      setNewStatus("");
      getStatus();
    } catch (error) {
      console.error("Failed to add status:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async () => {
    if (!newStatus.trim()) {
      alert("Please enter a status");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.put(
        `https://multishop-ecommerce-wbac.onrender.com/api/status/${selectedId}`,
        { status: newStatus },
        { headers: { "x-access-token": token } }
      );
      setNewStatus("");
      setUpdate(false);
      setSelectedId(null);
      getStatus();
    } catch (error) {
      console.error(
        "Failed to update status:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this status?")) {
      setLoading(true);
      try {
        await axios.delete(
          `https://multishop-ecommerce-wbac.onrender.com/api/status/${id}`,
          {
            headers: {
              "x-access-token": token,
            },
          }
        );
        getStatus();
      } catch (error) {
        console.error("Delete error:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEdit = (status, id) => {
    setPreviousStatus(newStatus); // Store the current status before editing
    setNewStatus(status);
    setUpdate(true);
    setSelectedId(id);
  };

  const handleCancel = () => {
    setNewStatus(previousStatus);
    setUpdate(false);
    setSelectedId(null);
  };

  const saveData = async (e) => {
    e.preventDefault();
    if (!update) {
      await addStatus();
    } else {
      await updateStatus();
    }
  };

  return (
    <div className="h-screen flex">
      {loading && <Spinner />}
      <div>
        <Sidebar />
      </div>
      <div className="sideB w-full h-full">
        <div className="h-[30vh]">
          <div className="p-10">
            <h1 className="text-slate-600 font-bold mb-3">
              {update ? "Update Status" : "Add Status"}
            </h1>
            <input
              type="text"
              className="bg-slate-100 border-2 border-slate-300 rounded-lg p-2 outline-slate-300 font-mono me-4"
              placeholder="enter status"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
            />
            <button
              type="button"
              className="bg-lime-600 p-2 text-white rounded-md"
              onClick={saveData}
              disabled={loading}
            >
              Submit
            </button>
            {update && (
              <button
                type="button"
                className="bg-red-600 p-2 text-white rounded-md ms-4"
                onClick={handleCancel}
              >
                Cancel
              </button>
            )}
          </div>
        </div>
        <div className="h-[65vh] mx-10">
          <div className="flex bg-slate-400 p-3 text-center text-white font-semibold rounded-lg">
            <h1 className="w-[25%]">No</h1>
            <h2 className="w-[50%]">Status</h2>
          </div>
          <div className="h-[80%] overflow-y-auto">
            {loading ? (
              <Spinner />
            ) : statusList.length > 0 ? (
              statusList.map((item, index) => (
                <div key={item._id}>
                  <div className="flex text-center items-center bg-white p-5 my-2 rounded-lg">
                    <h1 className="w-[25%]">{index + 1}</h1>
                    <h2 className="w-[50%]">{item.status}</h2>
                    {!protectedStatuses.includes(item.status) && (
                      <div className="flex ms-52">
                        <AiFillEdit
                          className="text-blue-500 cursor-pointer"
                          onClick={() => handleEdit(item.status, item._id)}
                        />
                        <RiDeleteBin7Fill
                          className="ms-5 text-red-500 cursor-pointer"
                          onClick={() => handleDelete(item._id)}
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center">No status available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Status;
