import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("x-access-token");
  const [shopList, setShopList] = useState([]);

  useEffect(() => {
    getShop();
  }, []);

  const getShop = async () => {
    try {
      const response = await axios(
        `https://multishop-ecommerce-wbac.onrender.com/api/adminuser`,
        {
          headers: {
            "x-access-token": token,
          },
        }
      );
      setShopList(response.data);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const handleShopClick = (shopId) => {
    navigate(`/product?shopId=${shopId}`);
  };

  return (
    <div className="bg-slate-200">
      <div>
        <Sidebar />
      </div>
      <div className="cus-bg h-[28vh] md:h-[70vh]"></div>
      <div className="flex flex-wrap justify-center">
        {shopList.length > 0 ? (
          shopList
            .filter((shop) => shop.role === "shop admin")
            .map((shop) => (
              <div
                key={shop._id}
                className="w-44 md:w-56 m-2 md:m-5 cursor-pointer transition-transform transform hover:scale-95"
                onClick={() => handleShopClick(shop._id)}
              >
                <img
                  src={shop.shopLogo}
                  alt={`${shop.shopName} logo`}
                  className=" border-slate-600"
                />
                <h1 className="text-center bg-slate-600 p-1 text-white hover:font-medium">
                  {shop.shopName}
                </h1>
              </div>
            ))
        ) : (
          <p>No Shop Available</p>
        )}
      </div>
    </div>
  );
};

export default HomePage;
