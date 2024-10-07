import React, { useEffect, useState } from "react";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import { jwtDecode } from "jwt-decode";
import Unit from "./components/Unit";
import Product from "./components/Product";
import OrderDetail from "./components/OrderDetail";
import OrderDetailPage from "./components/OrderDetailPage";
import Status from "./components/Status";
import Shop from "./components/Shop";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  const [userId, setUserId] = useState("");
  const [role, setRole] = useState("");
  const [username, setUsername] = useState("");

  let token = "";
  if (localStorage.getItem("x-access-token")) {
    token = JSON.parse(localStorage.getItem("x-access-token"));
  }

  useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode(token);
      setUserId(decodedToken?.id);
      setRole(decodedToken?.role);
      setUsername(decodedToken?.name);
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Login
              setId={setUserId}
              setRole={setRole}
              setUsername={setUsername}
            />
          }
        />
        <Route
          path="/dashboard"
          element={
            <Dashboard
              userId={userId}
              role={role}
              username={username}
              token={token}
            />
          }
        />
        <Route
          path="/unit"
          element={
            <Unit
              userId={userId}
              role={role}
              username={username}
              token={token}
            />
          }
        />
        <Route
          path="/product"
          element={
            <Product
              userId={userId}
              role={role}
              username={username}
              token={token}
            />
          }
        />
        <Route
          path="/orderdetail"
          element={
            <OrderDetail
              userId={userId}
              role={role}
              username={username}
              token={token}
            />
          }
        />
        <Route
          path="/orderdetail/:id"
          element={
            <OrderDetailPage
              userId={userId}
              role={role}
              username={username}
              token={token}
            />
          }
        />
        <Route
          path="/status"
          element={
            <Status
              userId={userId}
              role={role}
              username={username}
              token={token}
            />
          }
        />
        <Route
          path="/shop"
          element={
            <Shop
              userId={userId}
              role={role}
              username={username}
              token={token}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
