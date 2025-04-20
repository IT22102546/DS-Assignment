import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaCalendarCheck, FaClipboardList } from "react-icons/fa";

export default function BookingCakeSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const { shopName, bookingDate } = location.state || {}; // Get shop name & booking date from state

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-yellow-300 via-orange-300 to-red-400">
      <div className="bg-white shadow-2xl rounded-lg p-8 max-w-md text-center">
        {/* Success Illustration */}
        <img
          src="https://cdn.dribbble.com/users/199982/screenshots/5883065/success_gif.gif"
          alt="Success"
          className="w-40 mx-auto mb-4"
        />

        {/* Success Message */}
        <h2 className="text-2xl font-bold text-pink-800 mb-3">
          🎉 Booking Request Submitted!
        </h2>
        <p className="text-gray-700 mb-2">
          Your booking request has been submitted successfully to:
        </p>
        <p className="text-lg font-semibold text-gray-900">{shopName || "Cake Shop"}</p>
        <p className="text-gray-700 mb-5">
          Booking Date: <span className="font-medium">{bookingDate || "Not Available"}</span>
        </p>

        {/* Check Bookings Button */}
        <button
          onClick={() => navigate("/dashboard?tab=mybookings")}
          className="flex items-center justify-center bg-[#FE8180] hover:bg-[#e57373] text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 mx-auto"
        >
          <FaClipboardList className="mr-2" /> Check Bookings
        </button>
      </div>
    </div>
  );
}
