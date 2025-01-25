import React, { useState } from "react";
import { register } from "../services/authService";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user", // Default role
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData); // Send form data to the registration service
      alert("User registered successfully!");
      navigate("/login");
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 max-w-md mx-auto bg-white shadow-md rounded"
    >
      <h1 className="text-2xl font-bold mb-4">Register</h1>
      <input
        type="text"
        name="name"
        placeholder="Name"
        onChange={handleChange}
        className="w-full p-2 mb-4 border rounded"
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        onChange={handleChange}
        className="w-full p-2 mb-4 border rounded"
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        onChange={handleChange}
        className="w-full p-2 mb-4 border rounded"
        required
      />

      {/* Role Selection - Radio Buttons */}
      <div className="mb-4">
        <label className="block mb-2">Role</label>
        <label className="mr-4">
          <input
            type="radio"
            name="role"
            value="user"
            checked={formData.role === "user"}
            onChange={handleChange}
            className="mr-2"
          />
          User
        </label>
        <label>
          <input
            type="radio"
            name="role"
            value="admin"
            checked={formData.role === "admin"}
            onChange={handleChange}
            className="mr-2"
          />
          Admin
        </label>
      </div>

      <button
        type="submit"
        className="w-full p-2 bg-blue-600 text-white rounded"
      >
        Register
      </button>
    </form>
  );
};

export default Register;
