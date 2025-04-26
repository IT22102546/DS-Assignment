import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  FaUser,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaCity,
  FaTruck,
} from "react-icons/fa";
import { MdOutlinePayments } from "react-icons/md";

export default function DeliveryDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const { userId, cartItems, subtotal, deliveryfee, totalcost } =
    location.state || {};

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address: "",
    city: "", // Fixed: Changed from state to city
    zip: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const orderData = {
      userId,
      productsId: cartItems.map((item) => ({
        title: item.title,
        quantity: item.cartTotalQuantity,
        mainImage: item.mainImage,
        storename: item.storename,
      })),
      ...formData,
      subtotal,
      deliveryfee,
      totalcost,
    };

    try {
      const response = await fetch("/api/order/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        alert("Order placed successfully!");
        navigate("/order-pay-success");
      } else {
        alert("Failed to place order.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-b from-[rgba(254,129,128,0.3)] via-[rgba(255,255,255,0.3)] to-[rgba(254,143,142,0.3)]">
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.6s ease-out forwards;
        }
        .animate-delay-100 {
          animation-delay: 0.1s;
        }
        .animate-delay-200 {
          animation-delay: 0.2s;
        }
        .hover-scale {
          transition: transform 0.3s ease;
        }
        .hover-scale:hover {
          transform: scale(1.02);
        }
      `}</style>

      <div className="w-full max-w-3xl mx-auto">
        <div className=" rounded-xl shadow-lg overflow-hidden hover-scale transition-all duration-300">
          {/* Header */}
          <div className="bg-gradient-to-b from-[rgba(254,129,128,0.3)] via-[rgba(255,255,255,0.3)] to-[rgba(254,143,142,0.3)] p-6 text-center animate-fade-in">
            <h2 className="text-3xl font-bold text-pink-800 flex items-center justify-center gap-2">
              <FaTruck className="text-pink-600" /> Delivery Details
            </h2>
          </div>

          {/* Content */}
          <div className="p-6 md:p-8 space-y-6">
            {/* Order Summary */}
            <div className="bg-gray-50 p-4 rounded-xl animate-fade-in animate-delay-100">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <MdOutlinePayments className="text-green-600" /> Order Summary
              </h3>
              <div className="flex justify-between text-gray-700 mt-2">
                <span>Subtotal:</span>{" "}
                <span className="font-semibold">
                  LKR {subtotal?.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Delivery Fee:</span>{" "}
                <span className="font-semibold">
                  LKR {deliveryfee?.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-lg font-semibold text-green-600">
                <span>Total Cost:</span>{" "}
                <span>LKR {totalcost?.toFixed(2)}</span>
              </div>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="space-y-4 animate-fade-in animate-delay-200"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <FaUser className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    name="first_name"
                    placeholder="First Name"
                    required
                    onChange={handleChange}
                    className="w-full p-3 pl-10 border rounded-lg focus:ring-2 focus:ring-pink-200 focus:border-pink-500 transition-all"
                  />
                </div>
                <div className="relative">
                  <FaUser className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    name="last_name"
                    placeholder="Last Name"
                    required
                    onChange={handleChange}
                    className="w-full p-3 pl-10 border rounded-lg focus:ring-2 focus:ring-pink-200 focus:border-pink-500 transition-all"
                  />
                </div>
              </div>

              <div className="relative">
                <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  required
                  onChange={handleChange}
                  className="w-full p-3 pl-10 border rounded-lg focus:ring-2 focus:ring-pink-200 focus:border-pink-500 transition-all"
                />
              </div>

              <div className="relative">
                <FaPhone className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  name="phone"
                  placeholder="Phone"
                  required
                  onChange={handleChange}
                  className="w-full p-3 pl-10 border rounded-lg focus:ring-2 focus:ring-pink-200 focus:border-pink-500 transition-all"
                />
              </div>

              <div className="relative">
                <FaMapMarkerAlt className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  name="address"
                  placeholder="Address"
                  required
                  onChange={handleChange}
                  className="w-full p-3 pl-10 border rounded-lg focus:ring-2 focus:ring-pink-200 focus:border-pink-500 transition-all"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <FaCity className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    required
                    onChange={handleChange}
                    className="w-full p-3 pl-10 border rounded-lg focus:ring-2 focus:ring-pink-200 focus:border-pink-500 transition-all"
                  />
                </div>
                <div className="relative">
                  <FaMapMarkerAlt className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    name="zip"
                    placeholder="ZIP Code"
                    required
                    onChange={handleChange}
                    className="w-full p-3 pl-10 border rounded-lg focus:ring-2 focus:ring-pink-200 focus:border-pink-500 transition-all"
                  />
                </div>
              </div>

              <button className="w-full max-w-md mx-auto mt-10 bg-[#FE8180] hover:bg-[#e57373] text-white font-medium py-3 px-6 rounded-lg shadow-md flex items-center justify-center gap-2">
                <FaTruck className="text-white" />
                <span>Place Order</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
