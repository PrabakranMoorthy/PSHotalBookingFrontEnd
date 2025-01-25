import axios from "axios";
import host from "./api";

const API_BASE_URL = host + "/api/admin"; // Update this with your backend API base URL

// Fetch all hotels added by the admin
export const getHotels = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/hotels`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`, // Use token for authorization
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching hotels:", error.response.data);
    throw error;
  }
};

// Create a new hotel
export const createHotel = async (hotelData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/hotel`, hotelData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating hotel:", error.response.data);
    throw error;
  }
};

// Update an existing hotel
export const updateHotel = async (hotelData) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/hotels/${hotelData._id}`,
      hotelData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating hotel:", error.response.data);
    throw error;
  }
};

// Create a new room
export const createRoom = async (roomData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/room`, roomData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating room:", error.response.data);
    throw error;
  }
};

// Fetch all bookings for admin's hotels
export const getAdminBookings = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/bookings`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching bookings:", error.response.data);
    throw error;
  }
};

// Update an existing room
export const updateRoom = async (roomData) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/rooms/${roomData._id}`,
      roomData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating room:", error.response.data);
    throw error;
  }
};
