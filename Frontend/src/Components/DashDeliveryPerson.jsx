import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

const DashDeliveryPerson = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiUrl = import.meta.env.VITE_ORDER_API_URL;

  useEffect(() => {
    if (!currentUser) return;

    const fetchOrders = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/order/getorders`);
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }
        const data = await response.json();
        
        const sortedOrders = data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setOrders(sortedOrders);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [currentUser]);

  // const handleAccept = (orderId) => {
  //   console.log(`Accepted order: ${orderId}`);
  //  fetch(`${apiUrl}/api/order/get-order/${orderId}`)
  // };

  const handleAccept = (orderId) => {
    console.log(`Accepted order: ${orderId}`);
    
    fetch(`${apiUrl}/api/order/update-order-status/${orderId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: "handover", 
        deliveryPerson: currentUser._id, 
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update order status");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Order status updated successfully:", data);
        
      })
      .catch((error) => {
        console.error("Error updating order status:", error);
      });
  };
  

  if (loading) return <div>Loading orders...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-center text-pink-700">
        Assigned Orders
      </h2>

      {orders.length === 0 ? (
        <div className="text-center text-gray-500">No orders available.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 text-sm">
            <thead>
              <tr className="bg-pink-100">
                
                <th className="py-2 px-4 border-b">Customer</th>
                <th className="py-2 px-4 border-b">Phone</th>
                <th className="py-2 px-4 border-b">Address</th>
                <th className="py-2 px-4 border-b">City</th>
                <th className="py-2 px-4 border-b">Zip</th>
                <th className="py-2 px-4 border-b">Subtotal</th>
                <th className="py-2 px-4 border-b">Delivery Fee</th>
                <th className="py-2 px-4 border-b">Total Cost</th>
                <th className="py-2 px-4 border-b">Payment</th>
                <th className="py-2 px-4 border-b">Status</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="text-center hover:bg-gray-50">
                  
                  <td className="py-2 px-4 border-b">{order.first_name} {order.last_name}</td>
                  <td className="py-2 px-4 border-b">{order.phone}</td>
                  <td className="py-2 px-4 border-b">{order.address}</td>
                  <td className="py-2 px-4 border-b">{order.city}</td>
                  <td className="py-2 px-4 border-b">{order.zip}</td>
                  <td className="py-2 px-4 border-b">Rs. {order.subtotal?.toFixed(2)}</td>
                  <td className="py-2 px-4 border-b">Rs. {order.deliveryfee?.toFixed(2)}</td>
                  <td className="py-2 px-4 border-b font-semibold">Rs. {order.totalcost?.toFixed(2)}</td>
                  <td className="py-2 px-4 border-b">
                    {order.CashOnDelivery ? "Cash" : order.OnlinePayment ? "Online" : "N/A"}
                  </td>
                  <td className="py-2 px-4 border-b capitalize">{order.status}</td>
                  <td className="py-2 px-4 border-b space-x-2">
                    <button
                      onClick={() => handleAccept(order._id)}
                      className="bg-green-500 hover:bg-green-600 text-white py-1 px-2 rounded"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleView(order._id)}
                      className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DashDeliveryPerson;
