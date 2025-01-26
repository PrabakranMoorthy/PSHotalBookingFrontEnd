import React, { useState, useEffect } from "react";
import {
  getHotels,
  getRoomsByHotel,
  bookRoom,
  processPayment,
} from "../services/apiService"; // Import necessary functions
import { useNavigate } from "react-router-dom";

const RoomBookingForm = ({ hotel, closeModal }) => {
  const navigate = useNavigate();
  const [hotels, setHotels] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [bookingData, setBookingData] = useState({
    hotelId: hotel._id,
    roomId: "",
    startDate: "",
    endDate: "",
    totalPrice: 0,
    userId: "",
    adultCount: 1,
    childCount: 0,
  });
  const [isBookingSuccessful, setIsBookingSuccessful] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  useEffect(() => {
    // Fetch hotels once the component mounts
    const fetchHotels = async () => {
      try {
        const hotelsData = await getHotels();
        setHotels(hotelsData);
      } catch (error) {
        setErrorMessage("Error fetching hotels: " + error);
      }
    };
    fetchHotels();
  }, []);

  // Handle hotel change
  const handleHotelChange = async (event) => {
    const selectedHotelId = event.target.value;
    setBookingData((prevData) => ({ ...prevData, hotelId: selectedHotelId }));
    if (selectedHotelId && bookingData.startDate && bookingData.endDate) {
      fetchRooms(selectedHotelId, bookingData.startDate, bookingData.endDate);
    }
  };

  // Fetch rooms based on selected hotel and dates
  const fetchRooms = async (hotelId, startDate, endDate) => {
    try {
      const roomsData = await getRoomsByHotel(hotelId, startDate, endDate);
      setRooms(roomsData);
    } catch (error) {
      setErrorMessage("Error fetching rooms: " + error);
    }
  };

  // Handle date changes and fetch rooms based on selected dates
  const handleDateChange = (event) => {
    const { name, value } = event.target;
    setBookingData((prevData) => {
      const updatedData = { ...prevData, [name]: value };
      if (updatedData.hotelId && updatedData.startDate && updatedData.endDate) {
        fetchRooms(
          updatedData.hotelId,
          updatedData.startDate,
          updatedData.endDate
        );
      }
      return updatedData;
    });
  };

  // Handle booking form submission
  const handleBookingSubmit = async (event) => {
    event.preventDefault();
    try {
      // Proceed to payment
      setPaymentProcessing(true);

      // Send booking data to backend
      const bookingResponse = await bookRoom(bookingData);

      // Process payment (example with Stripe or Razorpay)
      const paymentData = {
        amount: bookingData.totalPrice, // Amount to charge
        userId: bookingData.user,
        bookingId: bookingResponse._id,
      };

      const paymentResponse = await processPayment(
        paymentData,
        setLoading,
        bookingResponse
      );

      if (paymentResponse.success) {
        setIsBookingSuccessful(true);
        alert("Booking successful!");
        // Redirect to confirmation page
        navigate(`/confirmation/${bookingResponse._id}`); // Redirect after successful booking
      } else {
        setErrorMessage("Payment failed!");
      }
    } catch (error) {
      setErrorMessage("Error booking room: " + error);
    } finally {
      setPaymentProcessing(false);
    }
  };

  return (
    <div className="booking-container p-8">
      <h1 className="text-3xl mb-4">Room Booking Form</h1>
      <form onSubmit={handleBookingSubmit} className="booking-form space-y-4">
        {/* Hotel Dropdown */}
        {!bookingData.hotelId && (
          <div className="form-group">
            <label htmlFor="hotel" className="block mb-2">
              Selected Hotel
            </label>
            <select
              id="hotel"
              value={bookingData.hotelId}
              onChange={handleHotelChange}
              className="input"
              required
            >
              <option value="">Select a Hotel</option>
              {hotels.map((hotel) => (
                <option key={hotel._id} value={hotel._id}>
                  {hotel.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Date Range Inputs */}
        <div className="form-group">
          <label htmlFor="startDate" className="block mb-2">
            Start Date
          </label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={bookingData.startDate}
            onChange={handleDateChange}
            className="input"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="endDate" className="block mb-2">
            End Date
          </label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={bookingData.endDate}
            onChange={handleDateChange}
            className="input"
            required
          />
        </div>

        {/* Room Dropdown */}
        <div className="form-group">
          <label htmlFor="room" className="block mb-2">
            Select Room available after dates are selected
          </label>
          <select
            id="room"
            value={bookingData.roomId}
            onChange={(e) =>
              setBookingData({ ...bookingData, roomId: e.target.value })
            }
            className="input"
            required
          >
            <option value="">Select a Room</option>
            {rooms.map((room) => (
              <option key={room._id} value={room._id}>
                {room.name} - Rs.{room.price}
              </option>
            ))}
          </select>
        </div>

        {/* Adult and Child Counts */}
        <div className="form-group">
          <label htmlFor="adultCount" className="block mb-2">
            Adults
          </label>
          <input
            type="number"
            id="adultCount"
            value={bookingData.adultCount}
            onChange={(e) =>
              setBookingData({ ...bookingData, adultCount: e.target.value })
            }
            className="input"
            min="1"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="childCount" className="block mb-2">
            Children
          </label>
          <input
            type="number"
            id="childCount"
            value={bookingData.childCount}
            onChange={(e) =>
              setBookingData({ ...bookingData, childCount: e.target.value })
            }
            className="input"
            min="0"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="btn btn-primary"
          disabled={paymentProcessing}
        >
          {paymentProcessing ? "Processing Payment..." : "Book Now"}
        </button>
      </form>

      {/* Error or Success Message */}
      {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
      {isBookingSuccessful && (
        <p className="text-green-500 mt-2">Booking was successful!</p>
      )}
    </div>
  );
};

export default RoomBookingForm;
