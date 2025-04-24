import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Button } from 'flowbite-react';

export default function DashBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useSelector((state) => state.user);

  // Function to fetch bookings
  const fetchBookings = async () => {
    setLoading(true);
    setError(null); // Reset error state when starting the fetch
    try {
      const response = await fetch(`/api/bookings/getBookingsByShop/${currentUser._id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('No Available bookings.');
      }

      const data = await response.json();
      setBookings(data.bookings);
    } catch (error) {
      console.error(error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch bookings on mount and when currentUser changes
  useEffect(() => {
    if (currentUser) {
      fetchBookings();
    }
  }, [currentUser]);

  // Handle action click (confirm or reject)
  const handleActionClick = async (bookingId, action) => {
    try {
      const response = await fetch(`/api/bookings/updateBooking/${bookingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ action }),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        console.error('Error updating booking status:', errorResponse.message);
        throw new Error(errorResponse.message);
      }

      const data = await response.json();
      console.log('Booking updated:', data.booking);

      // Update the booking status in the state
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking._id === bookingId
            ? {
                ...booking,
                isConfirm: action === 'confirm',
                isReject: action === 'reject',
              }
            : booking
        )
      );
    } catch (error) {
      console.error('Failed to update booking status:', error.message);
      setError('Failed to update booking status.');
    }
  };

  // Ensure the buttons are disabled for confirmed or rejected bookings
  const isButtonDisabled = (booking) => booking.isConfirm || booking.isReject;

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="p-6 min-h-screen">
      <h1 className="text-2xl text-pink-800 font-bold mb-6">Booking Requests</h1>
      {bookings.length === 0 ? (
        <p className="text-center text-gray-600">No bookings available.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="px-4 py-2 text-left">Cake Type</th>
                <th className="px-4 py-2 text-left">Quantity</th>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Contact Name</th>
                <th className="px-4 py-2 text-left">Contact Number</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{booking.cakeType}</td>
                  <td className="px-4 py-2">{booking.quantity}</td>
                  <td className="px-4 py-2">{new Date(booking.date).toDateString()}</td>
                  <td className="px-4 py-2">{booking.contactName}</td>
                  <td className="px-4 py-2">{booking.contactNumber}</td>
                  <td className="px-4 py-2 flex space-x-2">
                    {/* Confirm button */}
                    {!booking.isConfirm && !booking.isReject && (
                      <Button
                        onClick={() => handleActionClick(booking._id, 'confirm')}
                        color="primary"
                      >
                        Confirm
                      </Button>
                    )}
                    {/* Reject button */}
                    {!booking.isConfirm && !booking.isReject && (
                      <Button
                        onClick={() => handleActionClick(booking._id, 'reject')}
                        color="failure"
                      >
                        Reject
                      </Button>
                    )}
                    {/* If confirmed, show the confirmed status */}
                    {booking.isConfirm && (
                      <Button color="success" disabled>
                        Confirmed
                      </Button>
                    )}
                    {/* If rejected, show the rejected status */}
                    {booking.isReject && (
                      <Button color="failure" disabled>
                        Rejected
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
