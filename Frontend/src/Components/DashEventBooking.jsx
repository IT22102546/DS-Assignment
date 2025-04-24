import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const DashEventBooking = () => {
    const { currentUser, loading: userLoading } = useSelector(state => state.user); // Get current user from Redux
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBookings = async () => {
            if (!currentUser) return; // Wait until user data is available

            try {
                const response = await fetch(`/api/events/bookings/${currentUser._id}`); // Use Redux user ID
                
                if (!response.ok) {
                    throw new Error("Failed to fetch bookings.");
                }

                const data = await response.json();
                setBookings(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (!userLoading) {
            fetchBookings();
        }
    }, [currentUser, userLoading]); // Fetch when user data is available

    if (userLoading || loading) return <p>Loading bookings...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <div>
            <h1 className="text-pink-800">Event Bookings</h1>
            {bookings && bookings.length > 0 ? (
                <table border="1" cellPadding="8">
                    <thead>
                        <tr>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Event</th>
                            <th>Venue</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Amount</th>
                            <th>Payment Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.map((booking) => (
                            <tr key={booking._id}>
                                <td>{booking.first_name}</td>
                                <td>{booking.last_name}</td>
                                <td>{booking.email}</td>
                                <td>{booking.phone}</td>
                                <td>
                                    {booking.events.map((event, index) => (
                                        <div key={index}>{event.title}</div>
                                    ))}
                                </td>
                                <td>{booking.venue}</td>
                                <td>{booking.date}</td>
                                <td>{booking.time}</td>
                                <td>${booking.totalAmount}</td>
                                <td>{booking.paymentStatus}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p style={{ color: "gray", fontWeight: "bold" }}>No bookings found.</p>
            )}
        </div>
    );
};

export default DashEventBooking;
