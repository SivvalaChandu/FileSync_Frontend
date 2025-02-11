import React, { useState, useContext } from "react";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import logo from "../utils/logo.png";
import axiosInstance from "../utils/axiosInstance";
import { AuthContext } from "../context/AuthContext";
import { validateEmail, validatePassword } from "../utils/Validater";
import useDarkSide from "../hooks/useDarkSide";

const SignPage = () => {
  useDarkSide();
  const [signUp, setSignUp] = useState(true);
  const [showPassword, setshowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);

  const validateDetails = async (e) => {
    e.preventDefault();

    setError("");
    setEmailError("");
    setPasswordError("");

    if (!validateEmail(email)) {
      setEmailError(
        "Please enter a valid email address (gmail, yahoo, outlook or hotmail)"
      );
      return;
    }

    if (!validatePassword(password)) {
      setPasswordError(
        "Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, and a number."
      );
      return;
    }

    const url = signUp ? "/auth/register" : "/auth/login";
    await handleSignUp(url);
  };

  const handleSignUp = async (url) => {
    try {
      const response = await axiosInstance.post(url, {
        email,
        password,
      });

      const token =
        response.headers["authorization"] || response.headers["Authorization"];

      if (token) {
        await login(token); // Use login to handle token and navigation
      } else {
        setError("Authentication failed: No token received");
      }
    } catch (error) {
      console.error("Auth error:", error);

      if (error.response) {
        const backendError = error.response.data.message || error.response.data;

        switch (backendError) {
          case "Username already exists":
            setError("This email is already registered. Please login instead.");
            break;
          case "User does not exist":
            setError("No account found with this email. Please sign up first.");
            break;
          case "Invalid credentials":
            setError("Incorrect email or password. Please try again.");
            break;
          default:
            setError(
              backendError || "Authentication failed. Please try again."
            );
        }
      } else if (error.request) {
        setError(
          "Unable to connect to the server. Please check your internet connection."
        );
      } else {
        setError("An unexpected error occurred. Please try again later.");
      }
    }
  };

  return (
    <form
      onSubmit={validateDetails}
      className="flex flex-col items-center justify-center h-screen dark:bg-primary"
    >
      <div className=" w-80 md:w-96">
        <div className="flex justify-center items-center mb-6 md:mb-16">
          <img className="size-20 md:size-28" src={logo} alt="Logo" />
        </div>
        <div className="text-2xl md:text-4xl font-extrabold text-center pb-8 dark:text-white">
          {signUp ? "Create your account" : "Welcome back"}
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-transparent border border-red-200 text-red-600 rounded-lg p-4 mb-6">
            {error}
          </div>
        )}

        <div className="relative">
          <input
            type="email"
            id="Mail address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="block px-3.5 pb-2 pt-4 w-full text-lg text-gray-900 bg-transparent rounded-lg border-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-500 peer"
            placeholder=" "
          />
          <label
            htmlFor="Mail address"
            className="absolute cursor-text text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-primary px-2 peer-focus:px-2 peer-focus:text-blue-500 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-105 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-90 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
          >
            Mail address
          </label>
        </div>
        {emailError && (
          <p className="text-red-500 text-sm mt-1 pl-1">{emailError}</p>
        )}

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            id="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="block px-3.5 mt-3 pb-2 pt-4 w-full text-lg text-gray-900 bg-transparent rounded-lg border-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-500 peer"
            placeholder=" "
          />
          <label
            htmlFor="Password"
            className="absolute cursor-text text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-primary px-2 peer-focus:px-2 peer-focus:text-blue-500 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-105 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-90 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
          >
            Password
          </label>
          <div
            onClick={() => setshowPassword(!showPassword)}
            className="absolute text-lg inset-y-0 right-0 flex items-center px-4 text-gray-500 dark:text-gray-400"
          >
            {showPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
          </div>
        </div>
        {passwordError && (
          <p className="text-red-500 text-sm mt-1 pl-1">{passwordError}</p>
        )}
        <button
          type="submit"
          className="py-2.5 w-full mt-8 text-xl text-white font-bold rounded-lg bg-blue-500 hover:bg-blue-600 transition-colors"
        >
          Continue
        </button>
        <div className="pt-4 flex justify-center dark:text-white gap-2">
          <p>
            {signUp ? "Already have an account?" : "Don't have an account?"}
          </p>
          <p
            onClick={() => {
              setSignUp(!signUp);
              setError("");
              setEmailError("");
              setPasswordError("");
            }}
            className="text-blue-600 cursor-pointer hover:text-blue-700"
          >
            {signUp ? "Login" : "Sign Up"}
          </p>
        </div>
      </div>
    </form>
  );
};

export default SignPage;
