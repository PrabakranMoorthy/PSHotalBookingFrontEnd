// src/pages/Home.jsx
import React, { useState } from "react";
import RoomBookingForm from "../components/RoomBookingForm";
import { logout } from "../utils/auth";

const Home = () => {
  const [isBookingFormVisible, setIsBookingFormVisible] = useState(false);
  const handleLogout = () => {
    logout(); // Call the logout function
  };
  const handleBookButtonClick = () => {
    setIsBookingFormVisible(true); // Show the booking form when clicked
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold">Welcome to Our Hotel</h1>
      <p className="mt-4">Discover the best rooms for your stay!</p>

      {/* Book Button */}
      {!isBookingFormVisible && (
        <button
          onClick={handleBookButtonClick}
          className="bg-blue-500 text-white px-4 py-2 mt-6"
        >
          Book a Room
        </button>
      )}
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 mt-6 ml-4"
      >
        Logout
      </button>

      {/* Conditionally render the RoomBookingForm component */}
      {isBookingFormVisible && <RoomBookingForm />}
    </div>
  );
};

export default Home;
