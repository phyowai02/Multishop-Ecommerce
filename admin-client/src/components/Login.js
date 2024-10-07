import React, { useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { GrFacebookOption, GrGooglePlus } from "react-icons/gr";
import { RiTwitterFill, RiGithubFill } from "react-icons/ri";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import { json, useNavigate } from "react-router-dom";

const Login = ({ setId, setUsername, setrole }) => {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [inputName, setInputName] = useState("");
  const [inputPassword, setInputPassword] = useState("");
  const [role, setRole] = useState("");
  const roleList = ["super admin", "shop admin"];

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
      return; // Prevent form submission
    }

    try {
      const endpoint = isSignUp
        ? `https://multishop-ecommerce-wbac.onrender.com/api/adminuser/create`
        : `https://multishop-ecommerce-wbac.onrender.com/api/adminuser/login`;

      const response = await axios.post(endpoint, {
        username: inputName,
        password: inputPassword,
        role: role,
      });

      const { token } = response.data;

      localStorage.setItem("x-access-token", JSON.stringify(token));

      const decodedToken = jwtDecode(token);
      const username = decodedToken?.name;
      const userRole = decodedToken?.role;
      const userId = decodedToken?.id;

      if (userRole !== role) {
        Toastify({
          text: "Role mismatch. Access denied.",
          backgroundColor: "#FF5800",
          className: "info",
        }).showToast();
        return;
      }

      if (username) {
        localStorage.setItem("userId", userId);
        localStorage.setItem("username", username);
        localStorage.setItem("role", userRole);

        Toastify({
          text: "Login successful",
          backgroundColor: "#A3E635",
          position: "right",
          className: "info",
        }).showToast();
        navigate("/dashboard");
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
          text: isSignUp ? "Account created successful" : "Login failed",
          backgroundColor: isSignUp ? "#A3E635" : "#FF5800",
          className: "info",
        }).showToast();
      }

      console.error("Error during authentication:", error);
    }
  };

  return (
    <div className="bg-slate-300 h-screen flex justify-center items-center">
      <div
        className={`w-[65%] h-[80vh] bg-white rounded-3xl shadow-lg flex transition-transform duration-700 ease-in-out transform ${
          isSignUp ? "flex-row-reverse animate-fadeIn" : "animate-fadeOut"
        }`}
      >
        <div className="w-[50%] rounded-3xl">
          <div className="pt-20 px-16">
            <h1 className="text-4xl font-bold text-center mb-6">
              {isSignUp ? "Sign Up" : "Sign In"}
            </h1>
            <div className="flex justify-center p-3">
              <div className="border-2 border-slate-100 rounded-lg p-3 me-4 cursor-pointer">
                <GrFacebookOption />
              </div>
              <div className="border-2 border-slate-100 rounded-lg p-3 me-4 cursor-pointer">
                <GrGooglePlus />
              </div>
              <div className="border-2 border-slate-100 rounded-lg p-3 me-4 cursor-pointer">
                <RiTwitterFill />
              </div>
              <div className="border-2 border-slate-100 rounded-lg p-3 me-4 cursor-pointer">
                <RiGithubFill />
              </div>
            </div>
            <p className="text-center text-slate-500 font-mono mb-1">
              {isSignUp
                ? "or create your account"
                : "or use your username and password"}
            </p>
            <form className="font-mono" onSubmit={handleFormSubmit}>
              <input
                type="text"
                placeholder="Username"
                className="p-2 w-full mb-6 outline-none bg-slate-50 rounded-sm"
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
                required
              />
              <div className="relative">
                <input
                  type={visible ? "text" : "password"}
                  placeholder="Password"
                  className="p-2 w-full mb-6 outline-none bg-slate-50 rounded-sm"
                  value={inputPassword}
                  onChange={(e) => setInputPassword(e.target.value)}
                  required
                />
                <FontAwesomeIcon
                  className="absolute right-2 top-3 cursor-pointer text-slate-300"
                  icon={visible ? faEyeSlash : faEye}
                  onClick={togglePasswordVisibility}
                />
              </div>
              <div>
                <select
                  className="py-2 px-1 w-full bg-slate-50 text-slate-500 outline-none"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option>Select Role</option>
                  {roleList.map((role) => {
                    return (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    );
                  })}
                </select>
              </div>
              <p className="text-center text-slate-500 font-mono mt-8 fdodo">
                Forgot your password?
              </p>
              <div className="text-center">
                <button
                  className="bg-lime-400 rounded-lg px-3 py-2 text-white font-mono mt-5"
                  type="submit"
                >
                  {isSignUp ? "SIGN UP" : "SIGN IN"}
                </button>
              </div>
            </form>
          </div>
        </div>
        <div
          className={`w-[50%] rounded-3xl ${
            isSignUp ? "rounded-tr-[30%]" : "rounded-tl-[30%]"
          } ${
            isSignUp ? "rounded-br-[30%]" : "rounded-bl-[30%]"
          } shadow-lg dodo`}
        >
          <div className="h-full pt-40 px-6 text-white">
            <div className="font-mono text-center">
              <h1 className="text-4xl font-bold mb-8">
                {isSignUp ? "Welcome Back!" : "Hello, There!"}
              </h1>
              <p className="mb-16">
                {isSignUp
                  ? "Sign in to keep connected with us."
                  : "Register with your personal details to use all features."}
              </p>
              {/* <button 
                                className='border-2 border-white p-2 rounded-lg text-lime-400' 
                                id={isSignUp ? 'login' : 'register'}
                                onClick={() => setIsSignUp(!isSignUp)}
                            >
                                {isSignUp ? 'SIGN IN' : 'SIGN UP'}
                            </button> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
