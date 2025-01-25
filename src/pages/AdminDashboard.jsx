import React, { useState, useEffect } from "react";
import {
  getHotels,
  createHotel,
  updateHotel,
  createRoom,
  updateRoom,
  getAdminBookings,
} from "../services/adminService"; // Import API calls
import { logout } from "../utils/auth"; // Import logout function

const AdminDashboard = () => {
  const [hotels, setHotels] = useState([]); // List of hotels owned by admin
  const [bookings, setBookings] = useState([]); // Bookings for admin hotels
  const [newHotel, setNewHotel] = useState({
    name: "",
    location: "",
    description: "",
    imageUrl: "",
  });
  const [newRoom, setNewRoom] = useState({
    hotelId: "",
    name: "",
    description: "",
    price: "",
    amenities: "",
    roomType: "",
  });
  const handleLogout = () => {
    logout(); // Call the logout function
  };
  const [editingHotel, setEditingHotel] = useState(null); // Hotel being edited

  // Fetch data on load
  useEffect(() => {
    fetchHotelsAndBookings();
  }, []);

  const fetchHotelsAndBookings = async () => {
    try {
      const fetchedHotels = await getHotels();
      setHotels(fetchedHotels);

      const fetchedBookings = await getAdminBookings();
      setBookings(fetchedBookings);
    } catch (error) {
      console.error("Error fetching admin data:", error);
    }
  };

  // Add a new hotel
  const handleAddHotel = async (e) => {
    e.preventDefault();
    try {
      await createHotel(newHotel);
      setNewHotel({ name: "", location: "", description: "", imageUrl: "" });
      fetchHotelsAndBookings();
    } catch (error) {
      console.error("Error adding hotel:", error);
    }
  };

  // Add a new room
  const handleAddRoom = async (e) => {
    e.preventDefault();
    try {
      await createRoom(newRoom);
      setNewRoom({
        hotelId: "",
        name: "",
        description: "",
        price: "",
        amenities: "",
        roomType: "",
      });
      fetchHotelsAndBookings();
    } catch (error) {
      console.error("Error adding room:", error);
    }
  };

  // Update an existing hotel
  const handleUpdateHotel = async (e) => {
    e.preventDefault();
    try {
      await updateHotel(editingHotel);
      setEditingHotel(null); // Clear the editing state
      fetchHotelsAndBookings();
    } catch (error) {
      console.error("Error updating hotel:", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Add Hotel */}
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Add New Hotel</h2>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 mt-6"
        >
          Logout
        </button>
        <form
          onSubmit={handleAddHotel}
          className="bg-gray-100 p-4 rounded-md shadow-md space-y-4"
        >
          <input
            type="text"
            placeholder="Hotel Name"
            value={newHotel.name}
            onChange={(e) => setNewHotel({ ...newHotel, name: e.target.value })}
            className="w-full p-2 rounded-md border"
            required
          />
          <input
            type="text"
            placeholder="Location"
            value={newHotel.location}
            onChange={(e) =>
              setNewHotel({ ...newHotel, location: e.target.value })
            }
            className="w-full p-2 rounded-md border"
            required
          />
          <textarea
            placeholder="Description"
            value={newHotel.description}
            onChange={(e) =>
              setNewHotel({ ...newHotel, description: e.target.value })
            }
            className="w-full p-2 rounded-md border"
            required
          />
          <input
            type="text"
            placeholder="Image URL"
            value={newHotel.imageUrl}
            onChange={(e) =>
              setNewHotel({ ...newHotel, imageUrl: e.target.value })
            }
            className="w-full p-2 rounded-md border"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Add Hotel
          </button>
        </form>
      </section>

      {/* Add Room */}
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Add Room to a Hotel</h2>
        <form
          onSubmit={handleAddRoom}
          className="bg-gray-100 p-4 rounded-md shadow-md space-y-4"
        >
          <select
            value={newRoom.hotelId}
            onChange={(e) =>
              setNewRoom({ ...newRoom, hotelId: e.target.value })
            }
            className="w-full p-2 rounded-md border"
            required
          >
            <option value="">Select Hotel</option>
            {hotels.map((hotel) => (
              <option key={hotel._id} value={hotel._id}>
                {hotel.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Room Name"
            value={newRoom.name}
            onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
            className="w-full p-2 rounded-md border"
            required
          />
          <textarea
            placeholder="Description"
            value={newRoom.description}
            onChange={(e) =>
              setNewRoom({ ...newRoom, description: e.target.value })
            }
            className="w-full p-2 rounded-md border"
            required
          />
          <input
            type="number"
            placeholder="Price"
            value={newRoom.price}
            onChange={(e) =>
              setNewRoom({ ...newRoom, price: parseFloat(e.target.value) })
            }
            className="w-full p-2 rounded-md border"
            required
          />
          <input
            type="text"
            placeholder="Amenities (comma-separated)"
            value={newRoom.amenities}
            onChange={(e) =>
              setNewRoom({
                ...newRoom,
                amenities: e.target.value.split(",").map((item) => item.trim()),
              })
            }
            className="w-full p-2 rounded-md border"
            required
          />
          <input
            type="text"
            placeholder="Room Type (e.g., Deluxe, Suite)"
            value={newRoom.roomType}
            onChange={(e) =>
              setNewRoom({ ...newRoom, roomType: e.target.value })
            }
            className="w-full p-2 rounded-md border"
            required
          />
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded-md"
          >
            Add Room
          </button>
        </form>
      </section>

      {/* View Bookings */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Manage Bookings</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-200">
            <thead>
              <tr>
                <th className="border p-2">Hotel</th>
                <th className="border p-2">Room</th>
                <th className="border p-2">User</th>
                <th className="border p-2">Dates</th>
                <th className="border p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking._id}>
                  <td className="border p-2">{booking.hotel.name}</td>
                  <td className="border p-2">{booking.room.name}</td>
                  <td className="border p-2">{booking.user.email}</td>
                  <td className="border p-2">
                    {booking.startDate} to {booking.endDate}
                  </td>
                  <td className="border p-2">{booking.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
