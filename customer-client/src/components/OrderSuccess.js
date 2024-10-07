import React from "react";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const OrderSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center items-center h-screen p-4">
      <div className="w-full max-w-md h-auto bg-white shadow-lg rounded-lg p-8 font-bold text-center">
        <h1 className="text-red-400 text-8xl md:text-9xl flex justify-center">
          <IoMdCheckmarkCircleOutline />
        </h1>
        <h2 className="text-3xl md:text-5xl mb-2">Order Confirmed</h2>
        <h2 className="text-2xl md:text-4xl">Successfully</h2>
        <div className="mt-8">
          <button
            className="mt-6 text-lg p-2 rounded-lg shadow-lg text-white bg-lime-600 hover:bg-lime-500 transition-colors"
            onClick={() => navigate("/product")}
          >
            Back to Products
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
