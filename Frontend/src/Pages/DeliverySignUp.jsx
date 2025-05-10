import React, { useState } from "react";
import { Label, TextInput, Button, Spinner } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";

export default function DeliverySignUp() {
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (
            !formData.username ||
            !formData.email ||
            !formData.password ||
            !formData.mobile ||
            !formData.address ||
            !formData.age ||
            !formData.idNumber
        ) {
            return toast.error("Please fill all fields");
        }

        try {
            setLoading(true);

            const res = await fetch("/api/ridereq/riderequest", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            setLoading(false);

            if (data.success === false) {
                toast.error(data.message);
                return;
            }

            toast.success("Request sent successfully! We will update you soon.");
            setTimeout(() => {
                navigate("/");
            }, 2000);
        } catch (error) {
            setLoading(false);
            toast.error(`Error: ${error.message}`);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="flex items-center justify-center bg-white p-6 min-h-screen">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-2xl"  
            >
                <motion.div
                    className="rounded-3xl shadow-2xl overflow-hidden bg-white"
                    whileHover={{ scale: 1.005 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="p-8">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-center mb-8"
                        >
                            <h2 className="text-3xl font-bold text-green-800">Join Our Delivery Team</h2>
                            <p className="text-green-600 mt-2">Fill in your details to get started</p>
                        </motion.div>

                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 }}
                                >
                                    <Label value="Username" className="mb-1 block text-gray-700" />
                                    <TextInput
                                        type="text"
                                        id="username"
                                        placeholder="Your username"
                                        onChange={handleChange}
                                        className="w-full"
                                    />
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <Label value="Email" className="mb-1 block text-gray-700" />
                                    <TextInput
                                        type="email"
                                        id="email"
                                        placeholder="name@company.com"
                                        onChange={handleChange}
                                        className="w-full"
                                    />
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    <Label value="Address" className="mb-1 block text-gray-700" />
                                    <TextInput
                                        type="text"
                                        id="address"
                                        placeholder="Your address"
                                        onChange={handleChange}
                                        className="w-full"
                                    />
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    <Label value="Mobile Number" className="mb-1 block text-gray-700" />
                                    <TextInput
                                        type="tel"
                                        id="mobile"
                                        placeholder="Mobile number"
                                        onChange={handleChange}
                                        className="w-full"
                                    />
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.5 }}
                                >
                                    <Label value="Age" className="mb-1 block text-gray-700" />
                                    <TextInput
                                        type="number"
                                        id="age"
                                        placeholder="Your age"
                                        onChange={handleChange}
                                        className="w-full"
                                    />
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.6 }}
                                >
                                    <Label value="ID Number" className="mb-1 block text-gray-700" />
                                    <TextInput
                                        type="text"
                                        id="idNumber"
                                        placeholder="Your ID number"
                                        onChange={handleChange}
                                        className="w-full"
                                    />
                                </motion.div>
                            </div>

                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.7 }}
                                className="mb-6"
                            >
                                <Label value="Password" className="mb-1 block text-gray-700" />
                                <div className="relative">
                                    <TextInput
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        placeholder="Your password"
                                        onChange={handleChange}
                                        className="w-full"
                                    />
                                    <motion.button
                                        type="button"
                                        className="absolute top-2 right-3 text-gray-500 hover:text-gray-700"
                                        onClick={togglePasswordVisibility}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        {showPassword ? "🙈" : "👁️"}
                                    </motion.button>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8 }}
                            >
                                <Button
                                    disabled={loading}
                                    type="submit"
                                    className="max-w-md w-3/4 bg-[#4CAF50] hover:bg-[#45a049] mx-auto flex items-center justify-center"
                                >
                                    {loading ? (
                                        <div className="flex items-center justify-center">
                                            <Spinner size="sm" className="mr-2" />
                                            Processing...
                                        </div>
                                    ) : (
                                        "Sign Up Now"
                                    )}
                                </Button>
                            </motion.div>
                        </form>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1 }}
                            className="text-center mt-6 text-sm text-gray-600"
                        >
                            Already have an account?{" "}
                            <Link to="/sign-in" className="text-[#4CAF50] hover:underline font-medium">
                                Sign in
                            </Link>
                        </motion.div>
                    </div>
                </motion.div>
            </motion.div>
            <ToastContainer 
                position="top-center"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </div>
    );
}