import React, { useState } from "react";
import { login } from "../services/authService";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [token, setToken] = useState(localStorage.getItem("token") || ""); 
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login(formData);
      const jwtToken = response.data.token;
      // Store JWT token in localStorage or context for global state
      localStorage.setItem("token", response.data.token);
      setToken(jwtToken);
      // Redirect user to homepage or dashboard after successful login
      if (response.data.user.role == "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/home");
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-pink-500 to-violet-600">
      <form
        onSubmit={handleSubmit}
        className=" bg-white shadow-lg rounded-lg p-8 w-full max-w-md"
      >
        <h2 className="text-3xl font-bold font--serif mb-6 text-center text-color-red text-green-600">
          Login
        </h2>
        {errorMessage && (
          <p className="text-red-500 text-sm mb-4">{errorMessage}</p>
        )}
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full p-2  border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 font-bold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full p-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Login
        </button>
        <p className="mt-4 text-center">
          Don't have an account?{" "}
          <a
            href="/register"
            className="text-blue-600 hover:underline focus:outline-none"
          >
            Register
          </a>
        </p>
      </form>
    </div>
  );
};

export default Login;
