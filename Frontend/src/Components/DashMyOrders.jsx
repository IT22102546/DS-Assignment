import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';

export default function DashMyOrders() {
    const { currentUser } = useSelector((state) => state.user);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedOrderId, setExpandedOrderId] = useState(null);
    const [expandedDeliveryId, setExpandedDeliveryId] = useState(null);

    useEffect(() => {
        if (!currentUser) return;

        const fetchOrders = async () => {
            try {
                const response = await fetch(`/api/order/getmyorder/${currentUser._id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch orders');
                }
                const data = await response.json();

                // Sorting latest orders first
                const sortedOrders = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setOrders(sortedOrders);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [currentUser]);

    const toggleOrderIdVisibility = (orderId) => {
        setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
    };

    const toggleDeliveryVisibility = (orderId) => {
        setExpandedDeliveryId(expandedDeliveryId === orderId ? null : orderId);
    };

    const getStatusIndex = (status) => {
        const statusOrder = ['paid', 'preparing', 'handover', 'delivered'];
        return statusOrder.indexOf(status);
    };

    const StatusIndicator = ({ status }) => {
        const statusIndex = getStatusIndex(status);
        
        return (
            <div className="flex justify-between items-center my-6 relative">
                {/* Progress line */}
                <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 z-0">
                    <motion.div 
                        className="h-full bg-green-500"
                        initial={{ width: 0 }}
                        animate={{ 
                            width: statusIndex === 0 ? '0%' : 
                                   statusIndex === 1 ? '33%' : 
                                   statusIndex === 2 ? '66%' : '100%'
                        }}
                        transition={{ duration: 0.5 }}
                    />
                </div>
                
                {/* Status steps */}
                {['paid', 'preparing', 'handover', 'delivered'].map((step, index) => {
                    const isCompleted = index <= statusIndex;
                    const isCurrent = index === statusIndex;
                    const isPreparing = step === 'preparing' && isCurrent;
                    const isHandover = step === 'handover' && isCurrent;
                    
                    return (
                        <div key={step} className="flex flex-col items-center z-10">
                            <motion.div
                                className={`w-12 h-12 rounded-full flex items-center justify-center text-white
                                    ${isCompleted ? 'bg-green-500' : 'bg-gray-300'}`}
                                animate={isCurrent ? {
                                    scale: [1, 1.1, 1],
                                    transition: { repeat: Infinity, duration: 1.5 }
                                } : {}}
                            >
                                {isCompleted ? (
                                    index < statusIndex ? (
                                        // Completed steps show checkmark
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    ) : isPreparing ? (
                                        // Cooking animation
                                        <motion.div
                                            animate={{
                                                rotate: [0, 15, -15, 0],
                                                y: [0, -3, 0],
                                            }}
                                            transition={{
                                                repeat: Infinity,
                                                duration: 1.5,
                                                ease: "easeInOut"
                                            }}
                                            className="relative"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                            </svg>
                                            {/* Steam animation */}
                                            <motion.div 
                                                className="absolute -top-4 -left-2 text-white"
                                                animate={{ opacity: [0, 0.8, 0], y: [0, -8] }}
                                                transition={{ repeat: Infinity, duration: 2, delay: 0.2 }}
                                            >
                                                ~
                                            </motion.div>
                                            <motion.div 
                                                className="absolute -top-4 right-0 text-white"
                                                animate={{ opacity: [0, 0.8, 0], y: [0, -8] }}
                                                transition={{ repeat: Infinity, duration: 2, delay: 0.4 }}
                                            >
                                                ~
                                            </motion.div>
                                        </motion.div>
                                    ) : isHandover ? (
                                        // Delivery riding animation
                                        <motion.div
                                            animate={{
                                                x: [0, 3, 0],
                                            }}
                                            transition={{
                                                repeat: Infinity,
                                                duration: 1,
                                                ease: "linear"
                                            }}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                                            </svg>
                                        </motion.div>
                                    ) : (
                                        // Delivered shows checkmark
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    )
                                ) : (
                                    <span className="text-gray-600">{index + 1}</span>
                                )}
                            </motion.div>
                            <span className={`text-xs mt-2 font-medium ${isCurrent ? 'text-green-600' : 'text-gray-500'}`}>
                                {step.charAt(0).toUpperCase() + step.slice(1)}
                                {isCurrent && (
                                    <motion.span
                                        animate={{ opacity: [0, 1, 0] }}
                                        transition={{ repeat: Infinity, duration: 1.5 }}
                                        className="block text-xs"
                                    >
                                        {isPreparing ? 'Cooking...' : 
                                         isHandover ? 'On the way...' : 
                                         'Processing...'}
                                    </motion.span>
                                )}
                            </span>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6 text-center text-pink-800">My Orders</h1>

            {loading && (
                <div className="flex justify-center items-center h-40">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        className="w-10 h-10 border-4 border-gray-300 border-t-green-500 rounded-full"
                    />
                </div>
            )}
            
            {error && <p className="text-red-500 text-center">{error}</p>}

            {!loading && !error && orders.length === 0 && (
                <div className="text-center py-10">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <p className="text-gray-500 mt-4">You have no orders yet.</p>
                </div>
            )}

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {orders.map((order) => (
                    <motion.div 
                        key={order._id} 
                        className="border p-4 sm:p-5 rounded-lg shadow-md bg-white hover:shadow-lg transition-shadow"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold">Order #{order.orderId.slice(-6)}</h3>
                            <button
                                className="text-[#FE8180] text-sm underline"
                                onClick={() => toggleOrderIdVisibility(order._id)}
                            >
                                {expandedOrderId === order._id ? "Hide Details" : "Show Details"}
                            </button>
                        </div>

                        {expandedOrderId === order._id && (
                            <p className="text-xs text-gray-700 break-all mt-1">Full ID: {order.orderId}</p>
                        )}

                        <p className="text-sm text-gray-600 mt-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {new Date(order.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </p>

                        {/* Status Tracker */}
                        <StatusIndicator status={order.status} />

                        <div className="mt-4 max-h-60 overflow-y-auto pr-2">
                            {order.productsId.map((product, index) => (
                                <div key={index} className="flex items-start space-x-3 border-b py-3 last:border-0">
                                    <img
                                        src={product.mainImage}
                                        alt={product.title}
                                        className="w-16 h-16 object-cover rounded-lg"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = "data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%2264%22%20height%3D%2264%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2064%2064%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_18a8b7a8a3d%20text%20%7B%20fill%3A%23AAAAAA%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A10pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_18a8b7a8a3d%22%3E%3Crect%20width%3D%2264%22%20height%3D%2264%22%20fill%3D%22%23EEEEEE%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2213.546875%22%20y%3D%2236.5%22%3E64x64%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E"
                                        }}
                                    />
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-900 line-clamp-2">{product.title}</p>
                                        <div className="flex justify-between text-sm text-gray-600 mt-1">
                                            <span>Qty: {product.quantity}</span>
                                            <span className="text-gray-500">{product.storename}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-4 pt-3 border-t">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-gray-700">Total:</span>
                                <span className="text-lg font-semibold text-gray-900">LKR {order.totalcost.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center mt-1">
                                <span className="text-xs text-gray-500">
                                    {order.CashOnDelivery ? (
                                        <span className="flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                            Cash on Delivery
                                        </span>
                                    ) : (
                                        <span className="flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                            </svg>
                                            Online Payment
                                        </span>
                                    )}
                                </span>
                                <button
                                    className="text-blue-600 text-sm underline"
                                    onClick={() => toggleDeliveryVisibility(order._id)}
                                >
                                    {expandedDeliveryId === order._id ? "Hide Delivery" : "Show Delivery"}
                                </button>
                            </div>
                        </div>

                        {expandedDeliveryId === order._id && (
                            <motion.div 
                                className="mt-3 text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-200"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                            >
                                <h4 className="font-medium text-sm mb-2 flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    Delivery Information
                                </h4>
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                    <div>
                                        <p className="text-gray-500">Customer Name</p>
                                        <p>{order.first_name} {order.last_name}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Contact Number</p>
                                        <p>{order.phone}</p>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-gray-500">Delivery Address</p>
                                        <p className="break-words">{order.address}, {order.city}, {order.zip}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Subtotal</p>
                                        <p>LKR {order.subtotal.toFixed(2)}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Delivery Fee</p>
                                        <p>LKR {order.deliveryfee.toFixed(2)}</p>
                                    </div>

                                    {/* Delivery Person Section */}
                                    {(order.status === 'handover' || order.status === 'delivered') && order.deliveryPerson && (
                                        <>
                                            <div className="col-span-2 mt-2 pt-2 border-t">
                                                <h5 className="font-medium flex items-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                                    </svg>
                                                    Delivery Rider
                                                </h5>
                                                <div className="grid grid-cols-2 gap-2 mt-1">
                                                    <div>
                                                        <p className="text-gray-500">Name</p>
                                                        <p>{order.deliveryPerson.username}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-500">Contact</p>
                                                        <p>{order.deliveryPerson.mobile || 'Not provided'}</p>
                                                    </div>
                                                    {order.deliveryPerson.mobile && (
                                                        <div className="col-span-2">
                                                            <a 
                                                                href={`tel:${order.deliveryPerson.mobile}`}
                                                                className="inline-flex items-center justify-center w-full px-2 py-1 bg-green-100 text-green-800 rounded text-xs hover:bg-green-200 transition-colors"
                                                            >
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                                </svg>
                                                                Call Rider
                                                            </a>
                                                        </div>
                                                    )}
                                                    {order.status === 'handover' && (
                                                        <div className="col-span-2 text-blue-600 text-xs flex items-center">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                            </svg>
                                                            Your order is on the way!
                                                        </div>
                                                    )}
                                                    {order.status === 'delivered' && (
                                                        <div className="col-span-2 text-green-600 text-xs flex items-center">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                            </svg>
                                                            Delivered successfully
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                ))}
            </div>
        </div>
    );
}