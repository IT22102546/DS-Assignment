import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { FaCalendarAlt, FaClock, FaMapMarkerAlt } from "react-icons/fa";
import BookingPayButton from "../Components/BookingPayButton";

export default function BookingSummary() {
  const { state } = useLocation();
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [venue, setVenue] = useState("");
  const teamId = state?.teamId;
  const [showPaymentButton, setShowPaymentButton] = useState(false); // State to show/hide payment button

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  const handleConfirmBooking = () => {
    if (!date || !time || !venue) {
      alert("Please fill in all fields.");
      return;
    }
    console.log("Booking Details:", { ...state, date, time, venue });

    // Show the payment button once the booking is confirmed
    setShowPaymentButton(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center  bg-gradient-to-b from-[rgba(254,129,128,0.3)] via-[rgba(255,255,255,0.3)] to-[rgba(254,143,142,0.3)] p-4">
      <div
        data-aos="fade-up"
        className="bg-white bg-opacity-30 backdrop-blur-md shadow-xl rounded-2xl p-8 w-full max-w-md text-center"
      >
        <h1 className="text-3xl font-bold text-pink-800 mb-4">Booking Summary</h1>

        {/* Event details */}
        <div className="mb-6">
          <p className="text-gray-800 text-lg font-medium">
            <span className="font-semibold">Team:</span> {state?.teamName}
          </p>
          
          <p className="text-gray-800 text-lg font-medium">
            <span className="font-semibold">Total Price:</span> LKR. {state?.totalPrice}
          </p>

          <div className="text-gray-700 text-lg font-medium">
            <span className="font-semibold">Selected Events:</span>
            <ul className="list-disc list-inside mt-2">
                {state?.selectedEvents?.map((event, index) => (
                <li key={event._id || index}>
                    <span className="font-semibold">{event.title}</span> - LKR. {event.price}
                </li>
                ))}
            </ul>
            </div>


          {/* Displaying additional event details if available */}
          {state?.eventDate && (
            <p className="text-gray-800 text-lg font-medium">
              <span className="font-semibold">Event Date:</span> {state?.eventDate}
            </p>
          )}
          {state?.eventLocation && (
            <p className="text-gray-800 text-lg font-medium">
              <span className="font-semibold">Event Location:</span> {state?.eventLocation}
            </p>
          )}
        </div>

        {/* Date, Time, Venue inputs */}
        <div className="mt-6 space-y-4">
          <div className="relative">
            <FaCalendarAlt className="absolute left-3 top-3 text-gray-500" />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#FE4A49]"
            />
          </div>

          <div className="relative">
            <FaClock className="absolute left-3 top-3 text-gray-500" />
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#FE4A49]"
            />
          </div>

          <div className="relative">
            <FaMapMarkerAlt className="absolute left-3 top-3 text-gray-500" />
            <input
              type="text"
              placeholder="Enter Venue"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              className="w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#FE4A49]"
            />
          </div>
        </div>

        {/* Confirm Booking Button */}
        <button
          onClick={handleConfirmBooking}
          className="bg-gradient-to-r bg-[#FE8180] hover:bg-[#e57373]  text-white w-full mt-6 py-3 rounded-lg shadow-md font-bold hover:opacity-90 transition duration-300"
        >
          Confirm Booking
        </button>

        {/* Show Payment Button */}
        {showPaymentButton && (
          <BookingPayButton
            bookingItems={state?.selectedEvents}
            totalAmount={state?.totalPrice}
            serviceFee={1000} 
            teamName={state?.teamName} // Pass the team name
            teamId = {state?.teamId}
            venue={venue} // Pass the venue
            date={date} // Pass the selected date
            time={time} // Pass the selected time
          />
        )}
      </div>
    </div>
  );
}
