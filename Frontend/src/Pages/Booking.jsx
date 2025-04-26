import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Booking() {
  const [selectedShop, setSelectedShop] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [cakes, setCakes] = useState([]);

  const [formData, setFormData] = useState({
    cakeType: "",
    quantity: 1,
    message: "",
    contactName: "",
    contactNumber: "",
  });

  useEffect(() => {
    if (!currentUser) {
      navigate("/sign-in");
      return;
    }

    const fetchShops = async () => {
      try {
        const res = await fetch("/api/user/getadmins", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        setAdmins(data.admins);
      } catch (error) {
        setError("Failed to fetch shop data");
        console.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchShops();
  }, [currentUser, navigate]);

  const handleShopSelection = async (shop) => {
    setSelectedShop(shop);
  
    try {
      const res = await fetch(`/api/cakes/getCakesByShop/${shop._id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!res.ok) {
        throw new Error(`Error fetching cakes: ${res.status}`);
      }
  
      const data = await res.json();
      setCakes(data.cakes || []);
    } catch (error) {
      console.error(error.message);
      alert('Failed to load cakes for the selected shop');
    }
  };
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  

  const handleBooking = async () => {
    if (!selectedShop) {
      alert("Please select a bakery shop!");
      return;
    }
  
    if (!formData.cakeType || !formData.contactName || !formData.contactNumber) {
      alert("Please fill in all required fields!");
      return;
    }
  
    setLoading(true);
    try {
      const bookingData = {
        shopId: selectedShop._id,
        date: selectedDate.toISOString(),
        ...formData,
      };
  
      const response = await fetch("/api/bookings/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(bookingData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error: ${response.status}`);
      }
  
      // Navigate to the Booking Success page with shop name and booking date
      navigate("/bookingcakesuccess", {
        state: { 
          shopName: selectedShop.username, 
          bookingDate: selectedDate.toDateString() 
        },
      });
  
      // Reset form fields and state
      setFormData({
        cakeType: "",
        quantity: 1,
        message: "",
        contactName: "",
        contactNumber: "",
      });
      setSelectedShop(null);
      setCakes([]);
    } catch (error) {
      console.error("Error creating booking:", error);
      alert("Failed to confirm booking. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  
  
  if (!currentUser) {
    return null;
  }

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
      <h1 className="text-4xl font-bold text-center mb-12 text-pink-800">
        Reserve your cake in Advance
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Section */}
        <div>
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4">Available Bakery Shops:</h2>
            {admins.length === 0 ? (
              <p className="text-gray-500">Loading shops...</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {admins.map((shop) => (
                  <div
                    key={shop._id}
                    className={`p-2 border rounded-md cursor-pointer ${
                      selectedShop?._id === shop._id ? "bg-blue-100" : "bg-white"
                    } shadow hover:shadow-md transition-all`}
                    onClick={() => handleShopSelection(shop)}
                  >
                    <img
                      src={shop.profilePicture || "https://via.placeholder.com/100"}
                      alt={shop.username || "Shop"}
                      className="w-16 h-16 rounded-full object-cover mb-2 border-2 border-purple-300"
                    />
                    <h3 className="font-medium text-sm text-center text-gray-700">
                      {shop.username}
                    </h3>
                    <p className="text-gray-500 text-xs text-center">
                      {shop.adress || "Address not provided"}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mb-6 ">
            <h2 className="text-xl font-semibold mb-3">Select a Date:</h2>
            <Calendar onChange={handleDateChange} value={selectedDate} />
            <p className="mt-2 text-gray-600">
              Selected Date: {selectedDate.toDateString()}
            </p>
          </div>
        </div>

        {/* Right Section */}
        <div className=" p-6 rounded-lg shadow-md bg-gradient-to-b from-[rgba(254,129,128,0.3)] via-[rgba(255,255,255,0.3)] to-[rgba(254,143,142,0.3)]">
          <h2 className="text-2xl font-bold mb-6 text-pink-800">Booking Details</h2>
          <p className="text-gray-700 mb-4">
            <strong>Selected Shop:</strong>{" "}
            {selectedShop ? selectedShop.username : "No shop selected"}
          </p>
          <p className="text-gray-700 mb-6">
            <strong>Selected Date:</strong> {selectedDate.toDateString()}
          </p>
          <form className="space-y-4">
          <div>
              <label htmlFor="cakeType" className="block text-sm font-medium text-gray-700">
                Cake Type
              </label>
              <select
                id="cakeType"
                name="cakeType"
                value={formData.cakeType}
                onChange={handleFormChange}
                required
                className="mt-1 block w-full p-2 border rounded-md focus:ring-2 focus:ring-pink-300"
              >
                <option value="" disabled>
                  {cakes.length > 0 ? "Select a cake type" : "No cakes available"}
                </option>
                {cakes.map((cake) => (
                  <option key={cake._id} value={cake.title}>
                    {cake.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="quantity"
                className="block text-sm font-medium text-gray-700"
              >
                Quantity
              </label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleFormChange}
                min="1"
                required
                className="mt-1 block w-full p-2 border rounded-md focus:ring-2 focus:ring-pink-300"
              />
            </div>
            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700"
              >
                Special Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleFormChange}
                rows="3"
                className="mt-1 block w-full p-2 border rounded-md focus:ring-2 focus:ring-pink-300"
                placeholder="E.g., Happy Birthday!"
              ></textarea>
            </div>
            <div>
              <label
                htmlFor="contactName"
                className="block text-sm font-medium text-gray-700"
              >
                Contact Name
              </label>
              <input
                type="text"
                id="contactName"
                name="contactName"
                value={formData.contactName}
                onChange={handleFormChange}
                required
                className="mt-1 block w-full p-2 border rounded-md focus:ring-2 focus:ring-pink-300"
              />
            </div>
            <div>
              <label
                htmlFor="contactNumber"
                className="block text-sm font-medium text-gray-700"
              >
                Contact Number
              </label>
              <input
                type="tel"
                id="contactNumber"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleFormChange}
                required
                className="mt-1 block w-full p-2 border rounded-md focus:ring-2 focus:ring-pink-300"
              />
            </div>
            <button
              type="button"
              className="w-full max-w-md mx-auto block mt-100xl  bg-[#FE8180] hover:bg-[#e57373] text-white font-medium py-3 px-6 rounded-lg shadow-md"
              onClick={handleBooking}
            >
              Confirm Booking
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
