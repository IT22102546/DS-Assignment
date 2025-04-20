import React from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

export default function DesignCakeSuccess() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center p-6 bg-gradient-to-b from-[rgba(233,86,86,0.3)] via-[rgba(231,204,204,0.3)] to-[rgba(190,61,59,0.3)] min-h-screen">
      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        .animate-bounce {
          animation: bounce 2s ease-in-out infinite;
        }
        .animate-delay-100 {
          animation-delay: 0.1s;
        }
        .animate-delay-200 {
          animation-delay: 0.2s;
        }
        .hover-scale {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .hover-scale:hover {
          transform: scale(1.05);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }
      `}</style>

      <div className="shadow-2xl rounded-lg p-8 max-w-md text-center bg-red-300 hover-scale animate-fade-in-up">
        {/* Success Illustration */}
        <img
          src="https://cdn.dribbble.com/users/199982/screenshots/5883065/success_gif.gif"
          alt="Success"
          className="w-40 mx-auto mb-4 animate-bounce animate-delay-100"
        />

        {/* Success Message */}
        <h2 className="text-2xl font-bold text-pink-800 mb-3 animate-fade-in-up animate-delay-100">
          🎉 Design Request Submitted!
        </h2>
        <p className="text-gray-700 mb-5 animate-fade-in-up animate-delay-200">
          The shop will contact you soon. Check your request status in your profile.
        </p>

        {/* Back to Profile Button */}
        <button
          onClick={() => navigate("/dashboard?tab=mydesignreq")}
          className="flex items-center justify-center bg-[#FE8180] hover:bg-[#e57373] text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 mx-auto animate-fade-in-up animate-delay-200"
        >
          <FaArrowLeft className="mr-2" /> Check the Status
        </button>
      </div>
    </div>
  );
}