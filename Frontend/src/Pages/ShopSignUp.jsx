import React, { useState } from "react";
import { Label, TextInput, Button, Spinner } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";

export default function ShopSignUp() {
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
            !formData.address 
         
        ) {
            return toast.error("Please fill all fields");
        }

        try {
            setLoading(true);

            const res = await fetch("http://localhost:4003/api/inventory/shoprequest", {
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
            }, 2000); // Redirect after 2 seconds
        } catch (error) {
            setLoading(false);
            toast.error(`Error: ${error.message}`);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="flex items-center justify-center bg-gradient-to-b p-6 from-[rgba(254,129,128,0.3)] via-[rgba(255,255,255,0.3)] to-[rgba(254,143,142,0.3)] min-h-screen">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-2xl" 
            >
                <motion.div
                    className=" rounded-3xl shadow-2xl overflow-hidden"
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
                            <h2 className="text-3xl font-bold text-pink-800">Register Your Shop</h2>
                            <p className="text-pink-600 mt-2">Join our network of bakery partners</p>
                        </motion.div>

                        <form className="space-y-5 pl-5 pr-5" onSubmit={handleSubmit}>
                            {[
                                { id: "username", label: "Shop Name", type: "text", placeholder: "Your shop name" },
                                { id: "email", label: "Shop Email", type: "email", placeholder: "shop@example.com" },
                                { id: "address", label: "Shop Address", type: "text", placeholder: "Full shop address" },
                                { id: "mobile", label: "Contact Number", type: "tel", placeholder: "Mobile number" },
                            ].map((field, index) => (
                                <motion.div
                                    key={field.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 * index }}
                                >
                                    <Label value={field.label} className="mb-1 block text-gray-700" />
                                    <TextInput
                                        type={field.type}
                                        id={field.id}
                                        placeholder={field.placeholder}
                                        onChange={handleChange}
                                        className="w-full"
                                    />
                                </motion.div>
                            ))}

                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                            >
                                <Label value="Password" className="mb-1 block text-gray-700" />
                                <div className="relative">
                                    <TextInput
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        placeholder="Create a password"
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
                                transition={{ delay: 0.6 }}
                                className="pt-4"
                            >
                                <Button
                                    disabled={loading}
                                    type="submit"
                                    className="max-w-md w-3/4 bg-[#FE8180] hover:bg-[#e57373] mx-auto flex items-center justify-center"
                                >
                                    {loading ? (
                                        <div className="flex items-center justify-center">
                                            <Spinner size="sm" className="mr-2" />
                                            Processing...
                                        </div>
                                    ) : (
                                        "Register Shop"
                                    )}
                                </Button>
                            </motion.div>
                        </form>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                            className="text-center mt-6 text-sm text-gray-600"
                        >
                            Already have an account?{" "}
                            <Link to="/sign-in" className="text-[#FE8180] hover:underline font-medium">
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
