import React from "react";
import HomePage from "./components/HomePage";
import Product from "./components/Product";
import ProductDetail from "./components/ProductDetail";
import Login from "./components/Login";
import CartDisplay from "./components/CartDisplay";
import OrderSuccess from "./components/OrderSuccess";
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/homepage' element={<HomePage/>}/>
        <Route path='/product' element={<Product/>}/>
        <Route path='/productdetail' element={<ProductDetail/>}/>
        <Route path='/' element={<Login/>} />
        <Route path='/cartdisplay' element={<CartDisplay/>} />
        <Route path='/success' element={<OrderSuccess/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
