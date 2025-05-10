import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const DashDeliveryPerson = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [formData, setFormData] = useState({
    orderId: "",
    restaurantLocation: "",
    customerLocation: "",
    deliveryFee: 0,
  });

  const apiUrl = import.meta.env.VITE_ORDER_API_URL;
  const deliveryApi = import.meta.env.VITE_DELIVERY_API_URL;
  const emailApi = import.meta.env.VITE_EMAIL_API_URL;

  useEffect(() => {
    if (!currentUser) return;

    const fetchOrders = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/order/getorders`);
        if (!response.ok) throw new Error("Failed to fetch orders");

        const data = await response.json();
        console.log("orders", data);
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

  const handleAcceptClick = (order) => {
    setSelectedOrder(order);
    setFormData({
      orderId: order._id,
      restaurantLocation: order.restaurantLocation || "",
      customerName: `${order.first_name} ${order.last_name}`,
      customerEmail: order.email,
      CustomerMobile: order.phone,
      customerLocation: order.address || "",
      deliveryFee: order.deliveryfee || 0,
      orderAmount: order.subtotal,
      email: order.email,
    });
    setShowModal(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "deliveryFee" ? parseFloat(value) : value,
    }));
  };
  const handleSaveDelivery = () => {
    fetch(`${deliveryApi}/api/delivery/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId: formData.orderId,
        deliveryPerson: currentUser._id,
        customerName: `${selectedOrder.first_name} ${selectedOrder.last_name}`,
        customerEmail: formData.customerEmail,
        CustomerMobile: formData.CustomerMobile,
        customerLocation: formData.customerLocation,
        restaurantLocation: formData.restaurantLocation,
        delveryFee: formData.deliveryFee,
        orderAmount: formData.orderAmount,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to create delivery");
        return res.json();
      })
      .then((deliveryData) => {
        console.log("Delivery created successfully:", deliveryData);

        // Send email
        return fetch(`${emailApi}/email/send-email`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: formData.customerEmail,
            text: `Dear ${formData.customerName}, your order (REF: ${formData.orderId}) is now on the way.
  
  Delivered by: ${currentUser.username}
  Contact: ${currentUser.mobile}
  Email: ${currentUser.email}
  
  Thank you for choosing our service!`,
          }),
        })
          .then((res) => {
            if (!res.ok) throw new Error("Failed to send email");
            return res.json();
          })
          .then((emailData) => {
            console.log("Email sent:", emailData.message);

            // ✅ Call update-status API
            return fetch(
              `${apiUrl}/api/order/update-status/${formData.orderId}`,
              {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  status: "handover",
                  deliveryPerson: currentUser._id,
                }),
              }
            );
          });
      })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to update order status");
        return res.json();
      })
      .then((updatedOrderData) => {
        console.log("Order status updated:", updatedOrderData);
        toast("Delivery created and status updated successfully");
        setShowModal(false);
        closeModal();
      })
      .catch((err) => {
        console.error("Error:", err);
        toast.error(err.message || "Something went wrong");
      });
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };

  const handleView = (orderId) => {
    alert(`View details for order ${orderId}`);
  };

  if (loading) return <div>Loading orders...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-6 relative">
      <h2 className="text-2xl font-bold mb-6 text-center text-green-700">
        Assigned Orders
      </h2>

      {orders.length === 0 ? (
        <div className="text-center text-gray-500">No orders available.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 text-sm">
            <thead>
              <tr className="bg-green-100">
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
                  <td className="py-2 px-4 border-b">
                    {order.first_name} {order.last_name}
                  </td>
                  <td className="py-2 px-4 border-b">{order.phone}</td>
                  <td className="py-2 px-4 border-b">{order.address}</td>
                  <td className="py-2 px-4 border-b">{order.city}</td>
                  <td className="py-2 px-4 border-b">{order.zip}</td>
                  <td className="py-2 px-4 border-b">
                    Rs. {order.subtotal?.toFixed(2)}
                  </td>
                  <td className="py-2 px-4 border-b">
                    Rs. {order.deliveryfee?.toFixed(2)}
                  </td>
                  <td className="py-2 px-4 border-b font-semibold">
                    Rs. {order.totalcost?.toFixed(2)}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {order.CashOnDelivery
                      ? "Cash"
                      : order.OnlinePayment
                      ? "Online"
                      : "N/A"}
                  </td>
                  <td className="py-2 px-4 border-b capitalize">
                    {order.status}
                  </td>
                  <td className="py-2 px-4 border-b space-x-2">
                    <button
                      onClick={() => handleAcceptClick(order)}
                      disabled={order.status !== "paid"}
                      className={`py-1 px-2 rounded text-white ${
                        order.status === "paid"
                          ? "bg-green-500 hover:bg-green-600"
                          : "bg-gray-400 cursor-not-allowed"
                      }`}
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-md w-[90%] md:w-[500px] relative p-6">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-xl font-bold"
            >
              &times;
            </button>
            <h3 className="text-lg font-semibold mb-4 text-center text-pink-700">
              Create Delivery
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium">Order ID</label>
                <input
                  type="text"
                  name="orderId"
                  value={formData.orderId}
                  disabled
                  className="w-full border p-2 rounded bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Restaurant Location
                </label>
                <input
                  type="text"
                  name="restaurantLocation"
                  value={formData.restaurantLocation}
                  onChange={handleFormChange}
                  className="w-full border p-2 rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">
                  Customer Name
                </label>
                <input
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleFormChange}
                  className="w-full border p-2 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Customer Email
                </label>
                <input
                  type="text"
                  name="customerEmail"
                  value={formData.customerEmail}
                  onChange={handleFormChange}
                  className="w-full border p-2 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Customer Mobile
                </label>
                <input
                  type="text"
                  name="CustomerMobile"
                  value={formData.CustomerMobile}
                  onChange={handleFormChange}
                  className="w-full border p-2 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Customer Location
                </label>
                <input
                  type="text"
                  name="customerLocation"
                  value={formData.customerLocation}
                  onChange={handleFormChange}
                  className="w-full border p-2 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Order Price (Rs.)
                </label>
                <input
                  type="number"
                  name="deliveryFee"
                  value={formData.orderAmount}
                  onChange={handleFormChange}
                  className="w-full border p-2 rounded"
                  disabled
                />
              </div>

              <div>
                <label className="block text-sm font-medium">
                  Delivery Fee (Rs.)
                </label>
                <input
                  type="number"
                  name="deliveryFee"
                  value={formData.deliveryFee}
                  onChange={handleFormChange}
                  className="w-full border p-2 rounded"
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleSaveDelivery}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
      />
    </div>
  );
};

export default DashDeliveryPerson;
