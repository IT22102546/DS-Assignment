import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "aos/dist/aos.css";
import AOS from "aos";

// Toggle Button Component
const ToggleButton = ({ selectedOption, setSelectedOption }) => {
  return (
    <div className="relative flex items-center w-64 bg-pink-600 rounded-full p-1 cursor-pointer">
      {/* Moving Toggle */}
      <div
        className={`absolute bg-white w-1/2 h-full rounded-full shadow-md flex items-center justify-center transition-all duration-300 ${
          selectedOption === "customize" ? "left-0" : "left-1/2"
        }`}
      >
        <span className="text-pink-600 font-semibold text-sm">
          {selectedOption === "customize" ? "Customize" : "Match Image"}
        </span>
      </div>

      {/* Button Options */}
      <button
        onClick={() => setSelectedOption("customize")}
        className={`w-1/2 text-center py-2 font-semibold transition-all duration-300 ${
          selectedOption === "customize" ? "text-white" : "text-gray-300"
        }`}
      >
        Customize
      </button>
      <button
        onClick={() => setSelectedOption("match")}
        className={`w-1/2 text-center py-2 font-semibold transition-all duration-300 ${
          selectedOption === "match" ? "text-white" : "text-gray-300"
        }`}
      >
        Match Image
      </button>
    </div>
  );
};

export default function DesignCake() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedShop, setSelectedShop] = useState(null);
  const [selectedOption, setSelectedOption] = useState("customize"); // Default to "Customize"
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    if (!currentUser) {
      navigate("/sign-in");
      return;
    }

    AOS.init({ duration: 1000, once: true });

    const fetchAdmins = async () => {
      try {
        const res = await fetch("/api/user/getadmins", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

        const data = await res.json();
        setAdmins(data.admins);
      } catch (error) {
        setError("Failed to fetch admin accounts");
        console.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAdmins();
  }, [currentUser, navigate]);

  const handleSelectShop = (shop) => {
    setSelectedShop(shop);
  };

  const handleNavigate = () => {
    if (!selectedShop) return;

    if (selectedOption === "customize") {
      navigate("/designform", {
        state: { shopId: selectedShop._id, shopName: selectedShop.username },
      });
    } else {
      navigate("/designImageform", {
        state: { shopId: selectedShop._id, shopName: selectedShop.username },
      });
    }
  };

  if (!currentUser) return null;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <p className="text-lg text-gray-600 animate-pulse">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-b from-[rgba(254,129,128,0.3)] via-[rgba(255,255,255,0.3)] to-[rgba(254,143,142,0.3)] min-h-screen">

      <h1 className="text-4xl font-bold text-center mb-12 text-pink-800">Available Cake Shops</h1>

      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {admins.map((admin, index) => (
          <div
            key={admin._id}
            className="border rounded-lg p-6 flex flex-col items-center shadow-lg bg-white transform transition-transform hover:scale-105 hover:shadow-2xl cursor-pointer"
            data-aos="fade-up"
            data-aos-delay={index * 100}
            onClick={() => handleSelectShop(admin)}
          >
            <img
              src={admin.profilePicture || "https://via.placeholder.com/150"}
              alt={`${admin.username}'s profile`}
              className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-purple-300"
            />

            <h3 className="text-xl font-semibold text-pink-800">{admin.username}</h3>
            <p className="text-gray-500">{admin.adress || 'Address not provided'}</p>

          </div>
        ))}
      </div>

      {selectedShop && (
        <div className="mt-8 text-center">
          <p className="text-lg text-gray-700 mb-4">
            Choose how you'd like to design your cake:
          </p>

          {/* Toggle Button */}
          <div className="flex justify-center mb-6">
            <ToggleButton
              selectedOption={selectedOption}
              setSelectedOption={setSelectedOption}
            />
          </div>

          {/* Navigate Button */}
          <button
            onClick={handleNavigate}
            className="px-8 py-3 bg-pink-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-900 transition duration-300"
          >
            Continue
          </button>
        </div>
      )}
    </div>
  );
}
