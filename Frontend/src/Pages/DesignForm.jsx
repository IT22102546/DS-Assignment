import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { FiTrash2 } from "react-icons/fi";
import { FaPlus, FaBirthdayCake } from "react-icons/fa";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function DesignForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const { shopId, shopName } = location.state;
  const { currentUser } = useSelector((state) => state.user);
  const [addons, setAddons] = useState([]);
  const [cakeType, setCakeType] = useState("");
  const [cakeShape, setCakeShape] = useState("");
  const [cakeSize, setCakeSize] = useState("");
  const [veganOption, setVeganOption] = useState("");
  const [loading, setLoading] = useState(false); // Add loading state

  const userId = currentUser._id;

  const availableAddons = [
    "Nuts",
    "Sprinkles",
    "Fruit",
    "Candles",
    "Chocolate Chips",
  ];

  // Add addon to the list
  const handleAddAddon = (event) => {
    const selectedAddon = event.target.value;
    if (selectedAddon && !addons.includes(selectedAddon)) {
      setAddons((prevAddons) => [...prevAddons, selectedAddon]);
    }
    event.target.value = ""; // Reset dropdown selection
  };

  // Remove addon from the list
  const handleRemoveAddon = (addonToRemove) => {
    setAddons((prevAddons) =>
      prevAddons.filter((addon) => addon !== addonToRemove)
    );
  };


  // Normal Design Form
const handleSubmit = async (event) => {
  event.preventDefault();
  setLoading(true);

  try {
    const formData = new FormData();
    
    
    formData.append('shopId', shopId);
    formData.append('shopName', shopName);
    formData.append('userId', currentUser._id);
    formData.append('cakeType', cakeType);
    formData.append('cakeShape', cakeShape);
    formData.append('cakeSize', cakeSize);
    formData.append('veganOption', veganOption);
    formData.append('addons', JSON.stringify(addons));

    const response = await fetch('/api/designs/save', {
      method: 'POST',
      body: formData 
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to submit design');
    }


    toast.success('Design submitted successfully!');
    navigate('/designCakeSuccess');
  } catch (error) {
    console.error('Submission error:', error);
    toast.error(error.message || 'Failed to submit design');
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="p-6 bg-gradient-to-b from-[rgba(254,129,128,0.3)] via-[rgba(255,255,255,0.3)] to-[rgba(254,143,142,0.3)] min-h-screen">
      <form
        onSubmit={handleSubmit}
        className=" p-8 rounded-xl shadow-2xl w-full max-w-3xl mx-auto block px-4 py-2 border border-gray-300 focus:outline-none bg-gradient-to-b from-[rgba(254,129,128,0.3)] via-[rgba(255,255,255,0.3)] to-[rgba(254,143,142,0.3)] text-gray-800 placeholder-gray-700"
      >
        <h2 className="text-3xl font-bold text-center mb-6 text-pink-800 flex items-center justify-center">
          <FaBirthdayCake className="mr-2 text-pink-700" /> Design Your Cake
        </h2>

        {/* Shop Name */}
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            Shop Name (Designer Name):
          </label>
          <input
            type="text"
            value={shopName}
            readOnly
            className="w-full px-4 py-3 border rounded-lg bg-gray-100 text-gray-500 font-medium cursor-not-allowed"
          />
        </div>

        {/* Cake Type */}
        <div className="mb-6">
          <label
            htmlFor="cakeType"
            className="block text-gray-700 font-semibold mb-2"
          >
            Cake Type:
          </label>
          <select
            name="cakeType"
            id="cakeType"
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
            onChange={(e) => setCakeType(e.target.value)}
            required
          >
            <option value="">Select Cake Type</option>
            <option value="butter">Butter</option>
            <option value="chocolate">Chocolate</option>
          </select>
        </div>

        {/* Addons */}
        <div className="mb-6">
          <label
            htmlFor="addonSelect"
            className="block text-gray-700 font-semibold mb-2"
          >
            Addons:
          </label>
          <div className="flex items-center space-x-2">
            <select
              id="addonSelect"
              className="flex-grow px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
              onChange={handleAddAddon}
            >
              <option value="">Select an addon</option>
              {availableAddons.map((addon) => (
                <option key={addon} value={addon}>
                  {addon}
                </option>
              ))}
            </select>
            <button
              type="button"
              className="px-4 py-3 bg-[#FE8180] hover:bg-[#e57373] text-white rounded-lg transition"
              onClick={handleAddAddon}
            >
              <FaPlus />
            </button>
          </div>

          {/* Selected Addons */}
          {addons.length > 0 && (
            <div className="mt-4">
              <p className="text-gray-700 font-medium mb-2">Selected Addons:</p>
              <ul className="space-y-2">
                {addons.map((addon) => (
                  <li
                    key={addon}
                    className="flex items-center justify-between bg-gray-100 px-4 py-2 rounded-lg shadow-md"
                  >
                    <span className="text-gray-700">{addon}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveAddon(addon)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FiTrash2 />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Cake Size */}
        <div className="mb-6">
          <label
            htmlFor="cakeSize"
            className="block text-gray-700 font-semibold mb-2"
          >
            Cake Size:
          </label>
          <select
            name="cakeSize"
            id="cakeSize"
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
            onChange={(e) => setCakeSize(e.target.value)}
            required
          >
            <option value="">Select Cake Size</option>
            <option value="1kg">1 kg</option>
            <option value="1.5kg">1.5 kg</option>
            <option value="2kg">2 kg</option>
            <option value="3kg">3 kg</option>
          </select>
        </div>

        {/* Cake Shape */}
        <div className="mb-6">
          <label
            htmlFor="cakeShape"
            className="block text-gray-700 font-semibold mb-2"
          >
            Cake Shape:
          </label>
          <select
            name="cakeShape"
            id="cakeShape"
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
            onChange={(e) => setCakeShape(e.target.value)}
            required
          >
            <option value="">Select Cake Shape</option>
            <option value="normal">Normal</option>
            <option value="round">Round</option>
            <option value="square">Square</option>
            <option value="animal">Animal</option>
            <option value="object">Object</option>
          </select>
        </div>

        {/* Vegan or Non-Vegan */}
        <div className="mb-6">
          <label
            htmlFor="veganOption"
            className="block text-gray-700 font-semibold mb-2"
          >
            Vegan or Non-Vegan:
          </label>
          <select
            name="veganOption"
            id="veganOption"
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
            onChange={(e) => setVeganOption(e.target.value)}
            required
          >
            <option value="">Select Option</option>
            <option value="vegan">Vegan</option>
            <option value="non-vegan">Non-Vegan</option>
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className={`w-full max-w-md mb-2 flex-1 px-6 py-3 text-white rounded-lg bg-[#FE8180] hover:bg-[#e57373] font-medium shadow-md focus:outline-none transition mx-auto block ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>

      <ToastContainer />
    </div>
  );
}
