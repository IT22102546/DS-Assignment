import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Card, Button } from 'flowbite-react';
import { FaCheckCircle, FaTimesCircle, FaClock } from 'react-icons/fa';

export default function DashMyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [shopNames, setShopNames] = useState({}); 
  const { currentUser } = useSelector((state) => state.user);

  // Function to fetch bookings made by the current user
  const fetchMyBookings = async () => {
    setLoading(true);
    setError(null); // Reset error state when starting the fetch
    try {
      const response = await fetch(`/api/bookings/getBookingsByUser/${currentUser._id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error fetching your bookings.');
      }

      const data = await response.json();
      setBookings(data.bookings);

      // Fetch shop names after fetching the bookings
      fetchShopNames(data.bookings);
    } catch (error) {
      console.error(error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  
// Function to fetch shop names using shopId from the bookings
const fetchShopNames = async (bookings) => {
    const shopIds = [...new Set(bookings.map((booking) => booking.shopId))]; // Unique shop IDs
    try {
      const shopDetailsPromises = shopIds.map((shopId) =>
        fetch(`/api/user/getshopsById/${shopId}`, { // Adjusted the endpoint here
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
      );
  
      const shopDetailsResponses = await Promise.all(shopDetailsPromises);
      const shopDetailsData = await Promise.all(
        shopDetailsResponses.map((response) => response.json())
      );
  
      const newShopNames = shopDetailsData.reduce((acc, shopDetail) => {
        acc[shopDetail._id] = shopDetail.shopName; // Correctly accessing shopName from the response
        return acc;
      }, {});
      setShopNames(newShopNames); // Save shop names in state
    } catch (error) {
      console.error('Error fetching shop names:', error.message);
      setError('Error fetching shop names');
    }
  };
  

  // Fetch bookings when the page loads or when currentUser changes
  useEffect(() => {
    if (currentUser) {
      fetchMyBookings();
    }
  }, [currentUser]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="p-6 min-h-screen">
      <h1 className="text-2xl text-pink-800 font-bold mb-6">Your Bookings</h1>
      {bookings.length === 0 ? (
        <p className="text-center text-gray-600">No bookings available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((booking) => (
            <Card key={booking._id} className="shadow-lg border rounded-lg p-4">
              <div className="flex flex-col items-center">
                {booking.isConfirm ? (
                  <FaCheckCircle className="text-green-500 text-4xl" />
                ) : booking.isReject ? (
                  <FaTimesCircle className="text-red-500 text-4xl" />
                ) : (
                  <FaClock className="text-yellow-500 text-4xl" />
                )}
                <h3 className="text-xl text-pink-700 font-semibold mt-4">{booking.cakeType}</h3>
                <p className="mt-2 text-gray-600">Quantity: {booking.quantity}</p>
                <p className="mt-2 text-gray-600">Date: {new Date(booking.date).toDateString()}</p>
                <p className="mt-2 text-gray-600">Shop: {shopNames[booking.shopId] || 'Loading...'}</p> {/* Display Shop Name */}

                {/* Show status message */}
                {booking.isConfirm && (
                  <p className="mt-4 text-green-600">Your booking is accepted. We will contact you soon!</p>
                )}
                {booking.isReject && (
                  <p className="mt-4 text-red-600">Booking rejected. Please book on a different date.</p>
                )}
                {!booking.isConfirm && !booking.isReject && (
                  <p className="mt-4 text-yellow-600">Your booking is pending.</p>
                )}

                {/* Additional Actions */}
                {booking.isConfirm && (
                  <Button color="green" className="mt-4" disabled>
                    Confirmed
                  </Button>
                )}
                {booking.isReject && (
                  <Button color="red" className="mt-4" disabled>
                    Rejected
                  </Button>
                )}
                {!booking.isConfirm && !booking.isReject && (
                  <Button  className="mt-4 bg-[#FE8180] hover:bg-[#e57373]">
                    Modify Booking
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
