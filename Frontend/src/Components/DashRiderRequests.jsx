import React, { useEffect, useState } from "react";
import { Table, Spinner, Alert, Button } from "flowbite-react";

export default function DashRiderRequests() {
    const [riderRequests, setRiderRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRiderRequests = async () => {
            try {
                const response = await fetch("/api/ridereq/getriderequest");
                const data = await response.json();

                if (!data.success) {
                    throw new Error(data.message);
                }

                setRiderRequests(data.data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchRiderRequests();
    }, []);

    const handleConfirm = async (requestId) => {
        try {
            const response = await fetch(`/api/ridereq/confirmrequest/${requestId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
            });

            const data = await response.json();
            if (!data.success) {
                throw new Error(data.message);
            }

            // Update the local state to reflect changes
            setRiderRequests((prevRequests) =>
                prevRequests.map((req) =>
                    req._id === requestId ? { ...req, isConfirm: true } : req
                )
            );
        } catch (error) {
            console.error("Error confirming request:", error.message);
            alert("Failed to confirm the request. Please try again.");
        }
    };

    const handleReject = async (requestId) => {
        try {
            const response = await fetch(`/api/ridereq/rejectrequest/${requestId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
            });

            const data = await response.json();
            if (!data.success) {
                throw new Error(data.message);
            }

            // Update the local state to reflect rejection
            setRiderRequests((prevRequests) =>
                prevRequests.map((req) =>
                    req._id === requestId ? { ...req, isReject: true, isConfirm: false } : req
                )
            );
        } catch (error) {
            console.error("Error rejecting request:", error.message);
            alert("Failed to reject the request. Please try again.");
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spinner size="lg" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Alert color="failure">{error}</Alert>
            </div>
        );
    }

    return (
        <div className="p-5">
            <h1 className="text-2xl font-bold text-pink-800 mb-5">Rider Requests</h1>
            <Table>
                <Table.Head>
                    <Table.HeadCell>Username</Table.HeadCell>
                    <Table.HeadCell>Email</Table.HeadCell>
                    <Table.HeadCell>Mobile</Table.HeadCell>
                    <Table.HeadCell>Address</Table.HeadCell>
                    <Table.HeadCell>Age</Table.HeadCell>
                    <Table.HeadCell>ID Number</Table.HeadCell>
                    <Table.HeadCell>Actions</Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y">
                    {riderRequests.map((request) => (
                        <Table.Row key={request._id}>
                            <Table.Cell>{request.username}</Table.Cell>
                            <Table.Cell>{request.email}</Table.Cell>
                            <Table.Cell>{request.mobile}</Table.Cell>
                            <Table.Cell>{request.address}</Table.Cell>
                            <Table.Cell>{request.age}</Table.Cell>
                            <Table.Cell>{request.idNumber}</Table.Cell>
                            <Table.Cell>
                                {/* Confirm button */}
                                {!request.isConfirm && !request.isReject && (
                                    <Button
                                        onClick={() => handleConfirm(request._id)}
                                        color="primary"
                                    >
                                        Confirm
                                    </Button>
                                )}
                                {/* Reject button */}
                                {!request.isConfirm && !request.isReject && (
                                    <Button
                                        onClick={() => handleReject(request._id)}
                                        color="failure"
                                    >
                                        Reject
                                    </Button>
                                )}
                                {/* If confirmed, show the confirmed status */}
                                {request.isConfirm && (
                                    <Button color="success" disabled>
                                        Confirmed
                                    </Button>
                                )}
                                {/* If rejected, show the rejected status */}
                                {request.isReject && (
                                    <Button color="failure" disabled>
                                        Rejected
                                    </Button>
                                )}
                            </Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
        </div>
    );
}
