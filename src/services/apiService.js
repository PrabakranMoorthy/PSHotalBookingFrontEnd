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

export const processPayment = async (
  paymentData,
  setLoading,
  bookingResponse
) => {
  try {
    setLoading(true);

    // Make payment request to backend
    const paymentResponse = await axiosInstance.post("/payment", {
      amount: bookingResponse.totalPrice,
      bookingId: bookingResponse._id,
    });

    const paymentData = paymentResponse.data;

    // // Initialize Razorpay payment
    // const razorpayOptions = {
    //   key: paymentData.key_id, // Replace with actual Razorpay key
    //   amount: paymentData.amount, // Total price in paise
    //   currency: paymentData.currency,
    //   order_id: paymentData.id,
    //   handler: async function (response) {
    //     // Handle successful payment
    //     const paymentDetails = {
    //       razorpay_payment_id: response.razorpay_payment_id,
    //       razorpay_order_id: response.razorpay_order_id,
    //       razorpay_signature: response.razorpay_signature,
    //     };

    //     // Send payment details to backend for verification and final booking
    //     await axiosInstance.post("/payment/verify", paymentDetails);
    //   },
    //   prefill: {
    //     name: "examble",
    //     email: "example@ex.com",
    //   },
    // };

    // const razorpay = new window.Razorpay(razorpayOptions);
    // razorpay.open();
    return await axiosInstance.post("/verify", paymentData);
  } catch (error) {
    console.error("Error during payment process:", error);
  } finally {
    setLoading(false);
  }
};

export { axiosInstance };
