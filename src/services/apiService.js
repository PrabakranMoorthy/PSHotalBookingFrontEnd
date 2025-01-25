import axios from "axios";
import host from "./api";

// Set up axios instance with the base URL
const axiosInstance = axios.create({
  baseURL: host + "/api/user",
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

// API call to fetch all hotels
export const getHotels = async () => {
  try {
    const response = await axiosInstance.get("/hotels");
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// API call to fetch rooms based on selected hotel and availability
export const getRoomsByHotel = async (hotelId, startDate, endDate) => {
  try {
    const response = await axiosInstance.get(
      `/rooms/${hotelId}?startDate=${startDate}&endDate=${endDate}`
    );
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// API call to book a room
export const bookRoom = async (bookingData) => {
  try {
    const response = await axiosInstance.post("/bookings", bookingData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// API call for Stripe or Razorpay payment
export const processPayment = async (paymentData) => {
  try {
    const response = await axiosInstance.post("/payments", paymentData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export { axiosInstance };
