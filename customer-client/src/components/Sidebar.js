import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCartShopping } from "react-icons/fa6";
import { CartContext } from './CartContext';
import Spinner from './Spinner';

const Sidebar = () => {
  const navigate = useNavigate();
  const {totalItemCount} = useContext(CartContext);
  const [loading, setLoading] = useState(false);
  const [isOpened, setIsOpened] = useState(false);

  const logout = () => {
    localStorage.clear();
    navigate('/');
  };

  const navigateWithLoading = (path) => {
    setLoading(true);
    setTimeout(() => {
      navigate(path);
      setLoading(false);
    }, 500);
  }

  const toggleMenu = () => {
    setIsOpened(!isOpened);
  };

  return (
    <div>
      {loading && <Spinner/>}
      <nav className='flex justify-between items-center px-5 py-3'>
        <div className="container block md:hidden w-16 z-50">
          <div className="menuContainer ms-2" onClick={toggleMenu}>
            <div className={`lineOne ${isOpened ? "rotateLineOne" : ""}`}></div>
            <div className={`lineTwo ${isOpened ? "hideLineTwo" : ""}`}></div>
            <div className={`lineThree ${isOpened ? "rotateLineThree" : ""}`}></div>
          </div>
        </div>
        <div className='flex items-center mr-5 font-bold text-lg w-72'>
          <div className={`hidden md:block`}>
            <div className='grid grid-cols-2'>
              <h1 className='cursor-pointer rounded-lg p-2 nav' onClick={() => navigate('/homepage')}>Home</h1>
              <h2 className='cursor-pointer rounded-lg p-2 nav' onClick={() => navigate('/product')}>Products</h2>
            </div>
          </div>
        </div>
        <div className='flex text-xl'>
          <div className='relative cursor-pointer rounded-lg p-4 nav' onClick={() => navigate('/cartdisplay')}>
            <FaCartShopping/>
            {totalItemCount > 0 && (
              <span className='absolute top-1 right-1 bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs'>
                {totalItemCount}
              </span>
            )}
          </div>
          <h4 className='hidden md:block cursor-pointer rounded-lg p-2 nav' onClick={logout}>Logout</h4>
        </div>
      </nav>

      <div className={`flex justify-center items-center font-bold text-lg text-white w-full h-full absolute top-0 left-0 bg-black bg-opacity-95 z-40 ${isOpened ? "block" : "hidden"}` }>
        <div className={`flex flex-col gap-10`}>
          <h1 className='cursor-pointer text-2xl mr-8' onClick={() => {navigate('/homepage'); setIsOpened(false)}}>Home</h1>
          <h2 className='cursor-pointer text-2xl' onClick={() => {navigate('/product'); setIsOpened(false)}}>Products</h2>
          <h3 className='cursor-pointer text-2xl' onClick={() => {logout(); setIsOpened(false)}}>Logout</h3>
        </div>
      </div>
    </div>
  )
}

export default Sidebar;