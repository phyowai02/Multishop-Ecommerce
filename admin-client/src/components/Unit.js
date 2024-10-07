import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import Model from "./Model";
import Spinner from "./Spinner";
import { RiDeleteBin7Fill } from "react-icons/ri";
import { AiFillEdit } from "react-icons/ai";

const Unit = ({token}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [datalist, setDataList] = useState([]);
  const [newUnit, setNewUnit] = useState("");
  const [newUnit1, setNewUnit1] = useState("");
  const [unitShort, setUnitShort] = useState("");
  const [unitShort1, setUnitShort1] = useState("");
  const [update, setUpdate] = useState(false);
  const [updateId, setUpdateId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [unitsPerPage] = useState(6);

  useEffect(() => {
    getUnit();
  }, []);

  const openModal = (type) => {
    setModalType(type);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setNewUnit1("");
    setUpdate(false);
  };

  const getUnit = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("http://localhost:8090/api/unit", {
        headers: {
          "x-access-token": token,
        },
      });
      if (response.data.units && Array.isArray(response.data.units)) {
        setDataList(response.data.units);
      } else {
        setError("Unexpected response format");
      }
    } catch (error) {
      setError("Failed to fetch data");
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const addUnit = async () => {
    if (!newUnit.trim()) {
      alert("Please enter a unit");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await axios.post(
        "http://localhost:8090/api/unit",
        { name: newUnit, short: unitShort },
        {
          headers: {
            "x-access-token": token,
          },
        }
      );
      setNewUnit("");
      setUnitShort("");
      getUnit();
    } catch (error) {
      setError("Failed to add unit");
      console.error("Add error:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateUnit = async () => {
    if (!newUnit1.trim() || !unitShort1.trim()) {
      alert("Please fill in both unit name and short form");
      return;
    }
  
    setLoading(true);
    try {
      await axios.put(
        `http://localhost:8090/api/unit/${updateId}`,
        { name: newUnit1, short: unitShort1 },
        {
          headers: {
            "x-access-token": token,
          },
        }
      );
      setNewUnit1("");
      setUnitShort1("");
      setUpdate(false);
      closeModal();
      getUnit();
    } catch (error) {
      setError("Failed to update unit");
      console.error("Update error:", error);
    } finally {
      setLoading(false);
    }
  };  

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this unit?")) {
      setLoading(true);
      setError(null);
      try {
        await axios.delete(`http://localhost:8090/api/unit/${id}`, {
          headers: {
            "x-access-token": token,
          },
        });
        getUnit();
      } catch (error) {
        setError("Failed to delete unit");
        console.error("Delete error:".error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleUpdateClick = (item, id) => {
    setNewUnit1(item);
    setUpdate(true);
    setUpdateId(id);
    openModal("update");
  };

  const saveData = async (e) => {
    e.preventDefault();
    if (update) await updateUnit();
    else await addUnit();
  };

  // Get current units for pagination
  const indexOfLastUnit = currentPage * unitsPerPage;
  const indexOfFirstUnit = indexOfLastUnit - unitsPerPage;
  const currentUnits = datalist.slice(indexOfFirstUnit, indexOfLastUnit);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="h-screen flex">
      {loading && <Spinner />}
      <div>
        <Sidebar />
      </div>
      <div className="sideB w-full h-full">
        <div className="h-[30vh]">
          <div className="p-10">
            <h1 className="text-slate-600 font-bold mb-3">Add New Unit</h1>
            <input
              type="text"
              value={newUnit}
              onChange={(e) => setNewUnit(e.target.value)}
              className="bg-slate-100 border-2 border-slate-300 rounded-lg p-2 outline-slate-300 font-mono me-4"
              placeholder="enter long form"
            />
            <input
              type="text"
              value={unitShort}
              onChange={(e) => setUnitShort(e.target.value)}
              className="bg-slate-100 border-2 border-slate-300 rounded-lg p-2 outline-slate-300 font-mono me-4"
              placeholder="enter short form"
            />
            <button
              type="button"
              onClick={saveData}
              className="bg-lime-600 p-2 text-white rounded-md"
              disabled={loading}
            >
              Submit
            </button>
          </div>
        </div>
        <div className="h-[68vh] px-3">
          <div className="flex bg-slate-400 p-3 text-center text-white font-semibold rounded-lg">
            <h1 className="w-[20%]">No</h1>
            <h2 className="w-[30%]">Units</h2>
            <h3 className="w-[30%]">Shorts</h3>
          </div>
          <div className="h-[77.8%] overflow-y-auto">
            {loading ? (
              <Spinner />
            ) : error ? (
              <div>{error}</div>
            ) : currentUnits.length > 0 ? (
              currentUnits.map((item, index) => (
                <div key={item._id}>
                  <div className="flex text-center items-center bg-white p-5 my-2 rounded-lg">
                    <h1 className="w-[20%]">{indexOfFirstUnit + index + 1}</h1>
                    <h2 className="w-[30%]">{item.name}</h2>
                    <h3 className="w-[30%]">{item.short}</h3>
                    <div className="flex justify-end w-[20%]">
                      <AiFillEdit
                        className="text-blue-500 cursor-pointer"
                        onClick={() => handleUpdateClick(item.name, item._id)}
                      />
                      <RiDeleteBin7Fill
                        className="ms-5 text-red-500 cursor-pointer"
                        onClick={() => handleDelete(item._id)}
                      />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="py-2 px-5 border text-center">
                  No units available
                </td>
              </tr>
            )}
          </div>
          {/* Pagination controls */}
          {/* <div className="mt-3 me-7 flex justify-end">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 mx-1 bg-gray-300 rounded-md"
            >
              Previous
            </button>
            <span className="px-4 py-2 mx-1">{currentPage}</span>
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={indexOfLastUnit >= datalist.length}
              className="px-4 py-2 mx-1 bg-gray-300 rounded-md"
            >
              Next
            </button>
          </div> */}
          <Model
            isOpen={isOpen}
            closeModal={closeModal}
            title={modalType === "update" ? "Update Unit" : ""}
          >
            {modalType === "update" ? (
              <form onSubmit={saveData}>
                <input
                  type="text"
                  placeholder="Update Unit"
                  className="bg-slate-100 border-2 border-slate-300 rounded-lg p-2 mx-3 outline-none mb-5"
                  value={newUnit1}
                  onChange={(e) => setNewUnit1(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Update Unit Short"
                  className="bg-slate-100 border-2 border-slate-300 rounded-lg p-2 mx-3 outline-none mb-5"
                  value={unitShort1}
                  onChange={(e) => setUnitShort1(e.target.value)}
                />
                <button
                  type="submit"
                  className="bg-lime-500 p-3 text-white rounded-md"
                >
                  Update
                </button>
              </form>
            ) : (
              <div></div>
            )}
          </Model>
        </div>
      </div>
    </div>
  );
};

export default Unit;
