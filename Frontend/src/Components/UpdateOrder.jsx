// components/UpdateOrder.jsx
import { useEffect, useState } from 'react';
import { Button, Label, Select, TextInput, Alert } from 'flowbite-react';
import { HiOutlineArrowLeft, HiOutlineExclamation } from 'react-icons/hi';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function UpdateOrder() {
    const { currentUser } = useSelector((state) => state.user);
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [status, setStatus] = useState('');
    const [deliveryPersons, setDeliveryPersons] = useState([]);
    const [selectedDeliveryPerson, setSelectedDeliveryPerson] = useState('');
    const { orderId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrderAndDeliveryPersons = async () => {
            try {
                setLoading(true);
                
                // Fetch order details
                const orderRes = await fetch(`/api/order/getorder/${orderId}`);
                const orderData = await orderRes.json();
                
                if (orderRes.ok) {
                    setOrder(orderData);
                    setStatus(orderData.status);
                    
                    // If status is handover and has delivery person, set it
                    if (orderData.status === 'handover' && orderData.deliveryPerson) {
                        setSelectedDeliveryPerson(orderData.deliveryPerson._id || orderData.deliveryPerson);
                    }
                } else {
                    setError(orderData.message);
                }
                
                // Fetch available delivery persons (riders)
                const deliveryRes = await fetch('/api/user/getriders');
                const deliveryData = await deliveryRes.json();
                
                if (deliveryRes.ok) {
                    // Extract the admins array from the response
                    const ridersArray = deliveryData.admins || [];
                    setDeliveryPersons(ridersArray);
                    
                    // If order already has a delivery person, ensure they're in the list
                    if (orderData.deliveryPerson && !ridersArray.some(r => r._id === orderData.deliveryPerson._id)) {
                        setDeliveryPersons([...ridersArray, orderData.deliveryPerson]);
                    }
                } else {
                    setDeliveryPersons([]);
                    console.error('Failed to fetch riders:', deliveryData);
                }
                
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setDeliveryPersons([]);
                setLoading(false);
            }
        };
        
        fetchOrderAndDeliveryPersons();
    }, [orderId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            
            const updateData = { status };
            
            // If status is handover, include delivery person
            if (status === 'handover') {
                if (!selectedDeliveryPerson) {
                    throw new Error('Please select a delivery person');
                }
                updateData.deliveryPerson = selectedDeliveryPerson;
            }
            
            const res = await fetch(`/api/order/update-status/${orderId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateData),
            });
            
            const data = await res.json();
            if (res.ok) {
                navigate('/dashboard?tab=orders');
            } else {
                setError(data.message);
            }
            setLoading(false);
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    if (loading) return <div className="text-center py-10">Loading...</div>;
    if (error) return (
        <div className="text-center py-10">
            <Alert color="failure" icon={HiOutlineExclamation}>
                {error}
            </Alert>
        </div>
    );

    return (
        <div className="p-3 max-w-3xl mx-auto min-h-screen">
            <Button
                onClick={() => navigate('/dashboard?tab=orders')}
                gradientDuoTone="purpleToBlue"
                outline
                className="mb-4"
            >
                <HiOutlineArrowLeft className="mr-2 h-5 w-5" />
                Back to Orders
            </Button>

            <h1 className="text-center text-3xl my-7 font-semibold">Update Order Status</h1>

            {order && (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <Label value="Order ID" />
                        <TextInput
                            type="text"
                            value={order.orderId}
                            readOnly
                        />
                    </div>

                    <div>
                        <Label value="Customer Name" />
                        <TextInput
                            type="text"
                            value={`${order.first_name} ${order.last_name}`}
                            readOnly
                        />
                    </div>

                    <div>
                        <Label value="Current Status" />
                        <Select
                            value={status}
                            onChange={(e) => {
                                setStatus(e.target.value);
                                if (e.target.value !== 'handover') {
                                    setSelectedDeliveryPerson('');
                                }
                            }}
                        >
                            <option value="paid">Paid</option>
                            <option value="preparing">Preparing</option>
                            <option value="handover">Handover to Delivery</option>
                            <option value="delivered">Delivered</option>
                        </Select>
                    </div>

                    {status === 'handover' && (
                        <div>
                            <Label value="Assign Delivery Rider" />
                            <Select
                                value={selectedDeliveryPerson}
                                onChange={(e) => setSelectedDeliveryPerson(e.target.value)}
                                required
                            >
                                <option value="">Select Delivery Rider</option>
                                {deliveryPersons.map((rider) => (
                                    <option key={rider._id} value={rider._id}>
                                        {rider.username} - {rider.mobile || 'No phone'}
                                    </option>
                                ))}
                            </Select>
                            {deliveryPersons.length === 0 && (
                                <Alert color="warning" className="mt-2">
                                    No available delivery riders found.
                                </Alert>
                            )}
                        </div>
                    )}

                    <div className="mt-4">
                        <Button
                            type="submit"
                            gradientDuoTone="purpleToPink"
                            disabled={loading || (status === 'handover' && !selectedDeliveryPerson && deliveryPersons.length > 0)}
                        >
                            {loading ? 'Updating...' : 'Update Status'}
                        </Button>
                    </div>
                </form>
            )}
        </div>
    );
}