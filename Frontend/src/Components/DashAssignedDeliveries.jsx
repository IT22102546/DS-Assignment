


import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
const DashAssignedDeliveries = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [deliveries, setDeliveries] = useState([]);
  const [loadingDeliveries, setLoadingDeliveries] = useState(true);
  const [error, setError] = useState(null);
  const apiUrl = import.meta.env.VITE_DELIVERY_API_URL;

  useEffect(() => {
    if (!currentUser) return;

 

    fetchDeliveries();
  }, [currentUser]);


  const fetchDeliveries = async () => {
    try {
      const response = await fetch(
        `${apiUrl}/api/delivery/assigned/${currentUser._id}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch assigned deliveries");
      }
      const data = await response.json();
      console.log(data)
      setDeliveries(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingDeliveries(false);
    }
  };

  const handleStartDelivery = async (deliveryId) => {
    try {
      const response = await fetch(
        `${apiUrl}/api/delivery/update-status/${deliveryId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "in-transit" }),
        }
      );

      if (!response.ok) throw new Error("Failed to start delivery");

      const updatedDelivery = await response.json();
       toast.success("Delivery Started Successfully!");
      fetchDeliveries()
      // Update state
      setDeliveries((prev) =>
        prev.map((d) => (d._id === deliveryId ? updatedDelivery : d))
      );
    } catch (err) {
      console.error("Error starting delivery:", err);
    }
  };

  if (loadingDeliveries) return <div>Loading deliveries...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-center text-purple-700">
        Assigned Deliveries
      </h2>

      {deliveries.length === 0 ? (
        <div className="text-center text-gray-500">No assigned deliveries.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 text-sm">
            <thead>
              <tr className="bg-purple-100">
                <th className="py-2 px-4 border-b">Order ID</th>
                <th className="py-2 px-4 border-b">Restaurant Location</th>
                <th className="py-2 px-4 border-b">Customer Name</th>
                <th className="py-2 px-4 border-b">Customer Email</th>
                <th className="py-2 px-4 border-b">Customer Mobile</th>
                <th className="py-2 px-4 border-b">Customer Location</th>
                <th className="py-2 px-4 border-b">Order Cost</th>

                <th className="py-2 px-4 border-b">Delivery Fee (Rs.)</th>

                <th className="py-2 px-4 border-b">Status</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {deliveries.map((delivery) => (
                <tr key={delivery._id} className="text-center hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{delivery.orderId}</td>
                  <td className="py-2 px-4 border-b">{delivery.restaurantLocation}</td>
                  <td className="py-2 px-4 border-b">{delivery.customerName}</td>
                  <td className="py-2 px-4 border-b">{delivery.customerEmail}</td>
                  <td className="py-2 px-4 border-b">{delivery.CustomerMobile}</td>
                  <td className="py-2 px-4 border-b">{delivery.customerLocation}</td>
                  <td className="py-2 px-4 border-b">Rs. {delivery.orderAmount?.toFixed(2)}</td>
                  <td className="py-2 px-4 border-b">Rs. {delivery.delveryFee?.toFixed(2)}</td>

                  <td className="py-2 px-4 border-b capitalize">{delivery.status}</td>
                  <td className="py-2 px-4 border-b">
                    <button
                      onClick={() => handleStartDelivery(delivery._id)}
                      disabled={delivery.status !== "assigned"}
                      className={`py-1 px-3 rounded text-white ${
                        delivery.status === "assigned"
                          ? "bg-yellow-500 hover:bg-yellow-600"
                          : "bg-gray-400 cursor-not-allowed"
                      }`}
                    >
                      Start Delivery
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </div>
  );
};

export default DashAssignedDeliveries;
