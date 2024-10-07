import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom'; 
import { DiYii } from "react-icons/di";
import { GiMushroomHouse } from "react-icons/gi";
import { ImDropbox } from "react-icons/im";
import { ImYelp } from "react-icons/im";
import { TbLogout2 } from "react-icons/tb";
import { IoSettingsOutline } from "react-icons/io5";
import { RiShoppingCart2Fill } from "react-icons/ri";
import { IoPulseOutline } from "react-icons/io5";
import { IoStorefront } from "react-icons/io5";
import Spinner from './Spinner';  

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userRole = localStorage.getItem("role");
  const [isMinimized, setIsMinimized] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const minimizedState = localStorage.getItem('sidebarMinimized') === 'true';
    setIsMinimized(minimizedState);
  }, []);

  const toggleSidebar = () => {
    const newState = !isMinimized;
    setIsMinimized(newState);
    localStorage.setItem('sidebarMinimized', newState); 
  };

  const logout = () => {
    localStorage.clear();
    navigate('/');
  };

  const navigateWithLoading = (path) => {
    setLoading(true);  // Start loading when navigating
    setTimeout(() => {
      navigate(path);
      setLoading(false);  // Stop loading after navigation
    }, 500);  // Simulate some loading time
  };

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <div>
      {loading && <Spinner />} 

      <div className={`${isMinimized ? "w-16" : "w-64"} p-2 rounded-xl h-screen transition-all duration-500 bg-white`}>
        <div className="flex justify-between">
          <div className="flex mb-10">
            <div className="text-lg bg-lime-600 p-3 rounded-lg text-white cursor-pointer" onClick={toggleSidebar}>
              <DiYii className={`${isMinimized ? 'rotate-180 ' : ''} transition-all duration-1000`} />
            </div>
            {!isMinimized && (
              <div className="ms-2">
                <div className="font-bold text-slate-500">Codingclub</div>
                <p className="text-[13px] font-bold text-slate-500">{localStorage.getItem("username")}</p>
              </div>
            )}
          </div>
        </div>

        <div
          className={`flex items-center font-bold p-3 rounded-lg mb-4 cursor-pointer ${isActive('/dashboard') ? 'bg-lime-600 text-white' : 'text-slate-500'}`}
          onClick={() => navigateWithLoading('/dashboard')}  
        >
          <div className="py-1 me-3 text-lg"><GiMushroomHouse /></div>
          {!isMinimized && <div>Dashboard</div>}
        </div>

        {userRole === 'super admin' && (
          <>
            <div
              className={`flex items-center font-bold p-3 rounded-lg mb-4 cursor-pointer ${(isActive('/orderdetail') || isActive('/orderdetail/:id'))  ? 'bg-lime-600 text-white' : 'text-slate-500'}`}
              onClick={() => navigateWithLoading('/orderdetail')}  
            >
              <div className="py-1 me-3 text-lg"><RiShoppingCart2Fill /></div>
              {!isMinimized && <div>Orders</div>}
            </div>

            <div
              className={`flex items-center font-bold p-3 rounded-lg mb-4 cursor-pointer ${isActive('/shop') ? 'bg-lime-600 text-white' : 'text-slate-500'}`}
              onClick={() => navigateWithLoading('/shop')} 
            >
              <div className="py-1 me-3 text-lg"><IoStorefront /></div>
              {!isMinimized && <div>Shop</div>}
            </div>

            <div
              className={`flex items-center font-bold p-3 rounded-lg mb-4 cursor-pointer ${isActive('/unit') ? 'bg-lime-600 text-white' : 'text-slate-500'}`}
              onClick={() => navigateWithLoading('/unit')}  
            >
              <div className="py-1 me-3 text-lg"><ImYelp /></div>
              {!isMinimized && <div>Units</div>}
            </div>

            <div
              className={`flex items-center font-bold p-3 rounded-lg mb-52 cursor-pointer ${isActive('/status') ? 'bg-lime-600 text-white' : 'text-slate-500'}`}
              onClick={() => navigateWithLoading('/status')} 
            >
              <div className="py-1 me-3 text-lg"><IoPulseOutline /></div>
              {!isMinimized && <div>Status</div>}
            </div>
          </>
        )}

        {userRole === 'shop admin' && (
          <>
            <div
              className={`flex items-center font-bold p-3 rounded-lg mb-4 cursor-pointer ${(isActive('/orderdetail') || isActive('/orderdetail/:id'))  ? 'bg-lime-600 text-white' : 'text-slate-500'}`}
              onClick={() => navigateWithLoading('/orderdetail')}  
            >
              <div className="py-1 me-3 text-lg"><RiShoppingCart2Fill /></div>
              {!isMinimized && <div>Orders</div>}
            </div>
            
            <div
              className={`flex items-center font-bold p-3 rounded-lg mb-4 cursor-pointer ${isActive('/product') ? 'bg-lime-600 text-white' : 'text-slate-500'}`}
              onClick={() => navigateWithLoading('/product')}  
            >
              <div className="py-1 me-3 text-lg"><ImDropbox /></div>
              {!isMinimized && <div>Products</div>}
            </div>

            <div
              className={`flex items-center font-bold p-3 rounded-lg mb-[39vh] cursor-pointer ${isActive('/status') ? 'bg-lime-600 text-white' : 'text-slate-500'}`}
              onClick={() => navigateWithLoading('/status')} 
            >
              <div className="py-1 me-3 text-lg"><IoPulseOutline /></div>
              {!isMinimized && <div>Status</div>}
            </div>
          </>
        )}

        <hr className="border-gray-400 mb-4" />

        <div className="flex font-bold p-2 rounded-lg mb-4 cursor-pointer text-slate-500 log-out" onClick={logout}>
          <div className="p-1 me-3 text-lg"><TbLogout2 /></div>
          {!isMinimized && <div>Logout</div>}
        </div>

        {/* <div className="flex font-bold p-2 rounded-lg mb-4 cursor-pointer text-slate-500">
          <div className={`${isMinimized ? 'rotate-180 ' : ''} transition-all duration-1000 p-1 me-3 text-lg`}><IoSettingsOutline /></div>
          {!isMinimized && <div>Settings</div>}
        </div> */}
      </div>
    </div>
  );
};

export default Sidebar;
