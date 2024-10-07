import React, { useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [visible, setVisible] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [inputName, setInputName] = useState("");
  const [inputPassword, setInputPassword] = useState("");
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setVisible(!visible);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!inputName || !inputPassword) {
      Toastify({
        text: "Please fill out all fields",
        backgroundColor: "#ff0000",
        className: "info",
      }).showToast();
      return;
    }

    try {
      const endpoint = isSignUp
        ? `http://192.168.1.11:8090/api/customer/create`
        : `http://192.168.1.11:8090/api/customer/login`;

      const response = await axios.post(endpoint, {
        username: inputName,
        password: inputPassword,
      });

      const { token } = response.data;
      localStorage.setItem("x-access-token", token);

      const decodedToken = jwtDecode(token);
      const userId = decodedToken?.id;
      const username = decodedToken?.name;

      if (username) {
        localStorage.setItem("userId", userId);
        localStorage.setItem("username", username);

        Toastify({
          text: "Login successful",
          backgroundColor: "#A3E635",
          position: "right",
          className: "info",
        }).showToast();
        navigate("/homepage");
      } else {
        console.error("Token is missing from the response");
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        Toastify({
          text: "User already exists",
          backgroundColor: "#FF5800",
          className: "info",
        }).showToast();
      } else {
        Toastify({
          text: isSignUp ? "Account created successfully" : "Login failed",
          backgroundColor: isSignUp ? "#A3E635" : "#FF5800",
          className: "info",
        }).showToast();
      }

      console.error("Error during authentication:", error);
    }
  };

  return (
    <div className="h-screen flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h1 className="text-center text-2xl font-bold mb-6">
          {isSignUp ? "Create Account" : "Login"}
        </h1>
        <form onSubmit={handleFormSubmit}>
          <input
            type="text"
            placeholder="Username"
            className="p-3 w-full mb-4 outline-none bg-gray-200 rounded-lg"
            value={inputName}
            onChange={(e) => setInputName(e.target.value)}
            required
          />
          <div className="relative mb-4">
            <input
              type={visible ? "text" : "password"}
              placeholder="Password"
              className="p-3 w-full outline-none bg-gray-200 rounded-lg"
              value={inputPassword}
              onChange={(e) => setInputPassword(e.target.value)}
              required
            />
            <FontAwesomeIcon
              className="absolute right-3 top-4 cursor-pointer text-gray-500"
              icon={visible ? faEyeSlash : faEye}
              onClick={togglePasswordVisibility}
            />
          </div>
          <div className="flex justify-end mb-4">
            <p className="text-blue-600 text-sm cursor-pointer hover:underline">
              Forgot password?
            </p>
          </div>
          <button
            type="submit"
            className="text-white w-full bg-blue-600 p-3 rounded-lg font-bold hover:bg-blue-700 transition-colors"
          >
            {isSignUp ? "Sign Up" : "Sign In"}
          </button>
          <div className="flex justify-center items-center flex-col mt-6">
            <div className="mb-2 text-gray-600">Or</div>
            <p
              className="text-blue-600 cursor-pointer hover:underline"
              onClick={() => setIsSignUp(!isSignUp)}
            >
              {isSignUp ? "Login" : "Sign Up"}
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
