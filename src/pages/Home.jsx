// src/pages/Home.jsx

import React, { useState, useEffect } from "react";
import { getHotels } from "../services/apiService"; // Import API call to get hotels
import RoomBookingForm from "../components/RoomBookingForm";
import { logout } from "../utils/auth";

// const Home = () => {
//   const [isBookingFormVisible, setIsBookingFormVisible] = useState(false);
//   const handleLogout = () => {
//     logout(); // Call the logout function
//   };
//   const handleBookButtonClick = () => {
//     setIsBookingFormVisible(true); // Show the booking form when clicked
//   };

//   return (
//     <div className="container mx-auto p-6">
//       <h1 className="text-4xl font-bold">Welcome to Our Hotel</h1>
//       <p className="mt-4">Discover the best rooms for your stay!</p>

//       {/* Book Button */}
//       {!isBookingFormVisible && (
//         <button
//           onClick={handleBookButtonClick}
//           className="bg-blue-500 text-white px-4 py-2 mt-6"
//         >
//           Book a Room
//         </button>
//       )}
//       <button
//         onClick={handleLogout}
//         className="bg-red-500 text-white px-4 py-2 mt-6 ml-4"
//       >
//         Logout
//       </button>

//       {/* Conditionally render the RoomBookingForm component */}
//       {isBookingFormVisible && <RoomBookingForm />}
//     </div>
//   );
// };

// export default Home;

const Home = () => {
  const [hotels, setHotels] = useState([]);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState(null); // Store selected hotel for booking
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState(""); // To filter hotels by city
  const [showModal, setShowModal] = useState(false); // To control the booking modal visibility

  const handleLogout = () => {
    logout(); // Call the logout function
  };
  useEffect(() => {
    // Fetch all hotels when the component mounts
    const fetchHotels = async () => {
      try {
        const hotelsData = await getHotels();
        setHotels(hotelsData);
        setFilteredHotels(hotelsData); // Initialize filteredHotels with all hotels
      } catch (error) {
        console.error("Error fetching hotels:", error);
      }
    };
    fetchHotels();
  }, []);

  // Handle search query change (search by hotel name or city)
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle city filter change
  const handleCityFilterChange = (e) => {
    setSelectedCity(e.target.value);
  };

  // Filter hotels based on search query and selected city
  useEffect(() => {
    let filtered = hotels;

    if (searchQuery) {
      filtered = filtered.filter(
        (hotel) =>
          hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          hotel.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCity) {
      filtered = filtered.filter(
        (hotel) => hotel.location.toLowerCase() === selectedCity.toLowerCase()
      );
    }

    setFilteredHotels(filtered);
  }, [searchQuery, selectedCity, hotels]);

  // Handle the "Book" button click (opens the booking modal)
  const handleBookClick = (hotel) => {
    setSelectedHotel(hotel);
    setShowModal(true);
  };

  // Close the booking modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedHotel(null); // Clear selected hotel
  };

  return (
    <div className="container mx-auto p-8">
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 mt-6 ml-4"
      >
        Logout
      </button>

      <h1 className="text-4xl font-bold mb-4">Available Hotels</h1>

      {/* Search Bar */}
      <div className="mb-4 flex items-center">
        <input
          type="text"
          placeholder="Search by Hotel Name or City"
          value={searchQuery}
          onChange={handleSearchChange}
          className="border p-2 w-full md:w-1/3 rounded-lg shadow-md"
        />
      </div>

      {/* City Filter */}
      <div className="mb-4 flex items-center">
        <label className="mr-2">Filter by City:</label>
        <select
          value={selectedCity}
          onChange={handleCityFilterChange}
          className="border p-2 rounded-lg shadow-md"
        >
          <option value="">Select City</option>
          {/* Dynamically populate the cities from the fetched hotels */}
          {[...new Set(hotels.map((hotel) => hotel.location))].map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>

      {/* Hotels List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredHotels.map((hotel) => (
          <div
            key={hotel._id}
            className="bg-white shadow-lg rounded-lg p-4 flex flex-col"
          >
            <h2 className="font-bold text-lg">{hotel.name}</h2>
            <p>{hotel.location}</p>
            <p>{hotel.description}</p>
            <img src={hotel.imageUrl} alt={hotel.name} />
            <button
              onClick={() => handleBookClick(hotel)}
              className="bg-blue-500 text-white py-2 px-4 rounded-lg mt-4 hover:bg-blue-600"
            >
              Book Now
            </button>
          </div>
        ))}
      </div>

      {/* Booking Modal */}
      {selectedHotel && showModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold">
                Book a Room at {selectedHotel.name}
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-600 hover:text-gray-800 text-xl"
              >
                &times;
              </button>
            </div>
            <RoomBookingForm
              hotel={selectedHotel}
              closeModal={handleCloseModal}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
