import React, { useState } from "react";
import { Label, TextInput, Button, Spinner } from "flowbite-react";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate,Link } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";

export default function TeamSignUp() {
    const [formData, setFormData] = useState({});
    const [video, setVideo] = useState(null);
    const [videoPreview, setVideoPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [agreeTerms, setAgreeTerms] = useState(false);
    const navigate = useNavigate();

    // Handle text inputs
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
    };

    // Handle video upload
    const handleVideoChange = (e) => {
        const file = e.target.files[0];

        if (file && file.type.startsWith("video/")) {
            if (file.size > 50 * 1024 * 1024) { // Limit to 50MB
                toast.error("Video size should be less than 50MB.");
                return;
            }

            setVideo(file);
            setVideoPreview(URL.createObjectURL(file));
        } else {
            toast.error("Please upload a valid video file (MP4, MOV, AVI).");
            setVideo(null);
            setVideoPreview(null);
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.username || !formData.email || !formData.password || !formData.mobile || !formData.address || !video) {
            return toast.error("Please fill all fields and upload a video.");
        }

        try {
            setLoading(true);

            const formDataObj = new FormData();
            formDataObj.append("username", formData.username);
            formDataObj.append("email", formData.email);
            formDataObj.append("address", formData.address);
            formDataObj.append("mobile", formData.mobile);
            formDataObj.append("password", formData.password);
            formDataObj.append("video", video);

            const res = await fetch("/api/teamreq/teamrequest", {
                method: "POST",
                body: formDataObj, // No need for JSON headers with FormData
            });

            const data = await res.json();
            setLoading(false);

            if (!data.success) {
                toast.error(data.message);
                return;
            }

            toast.success("Request sent successfully! We will update you soon.");
            setTimeout(() => navigate("/"), 2000);
        } catch (error) {
            setLoading(false);
            toast.error(`Error: ${error.message}`);
        }
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
                    className="rounded-3xl shadow-2xl overflow-hidden"
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
                            <h2 className="text-3xl font-bold text-pink-800">Join Our Surprise Team</h2>
                            <p className="text-pink-600 mt-2">Create magical moments for our customers</p>
                        </motion.div>

                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 p-5">
                                {/* Row 1 */}
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 }}
                                >
                                    <Label value="Team Name" className="mb-1 block text-gray-700" />
                                    <TextInput
                                        type="text"
                                        id="username"
                                        placeholder="Your team name"
                                        onChange={handleChange}
                                        className="w-full"
                                    />
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <Label value="Team Email" className="mb-1 block text-gray-700" />
                                    <TextInput
                                        type="email"
                                        id="email"
                                        placeholder="team@example.com"
                                        onChange={handleChange}
                                        className="w-full"
                                    />
                                </motion.div>

                                {/* Row 2 */}
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    <Label value="Team Address" className="mb-1 block text-gray-700" />
                                    <TextInput
                                        type="text"
                                        id="address"
                                        placeholder="Your team address"
                                        onChange={handleChange}
                                        className="w-full"
                                    />
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    <Label value="Contact Number" className="mb-1 block text-gray-700" />
                                    <TextInput
                                        type="tel"
                                        id="mobile"
                                        placeholder="Mobile number"
                                        onChange={handleChange}
                                        className="w-full"
                                    />
                                </motion.div>

                                {/* Password Field (full width) */}
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.5 }}
                                    className="md:col-span-2"
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
                                            onClick={() => setShowPassword(!showPassword)}
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            {showPassword ? "🙈" : "👁️"}
                                        </motion.button>
                                    </div>
                                </motion.div>

                                {/* Video Upload (full width) */}
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.6 }}
                                    className="md:col-span-2"
                                >
                                    <Label value="Upload Team Introduction Video" className="mb-1 block text-gray-700" />
                                    <input
                                        type="file"
                                        accept="video/*"
                                        onChange={handleVideoChange}
                                        className="mt-1 block w-full text-sm text-gray-500
                                        file:mr-4 file:py-2 file:px-4
                                        file:rounded-md file:border-0
                                        file:text-sm file:font-semibold
                                        file:bg-[#FE8180] file:text-white
                                        hover:file:bg-[#e57373]"
                                    />
                                    {videoPreview && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="mt-4"
                                        >
                                            <video
                                                src={videoPreview}
                                                controls
                                                className="w-full h-48 rounded-md shadow-sm"
                                            />
                                        </motion.div>
                                    )}
                                </motion.div>

                                {/* Terms and Conditions (full width) */}
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.7 }}
                                    className="md:col-span-2 mt-4"
                                >
                                    <div className="border p-4 rounded-md bg-gray-50 max-h-48 overflow-auto text-sm">
                                        <p className="font-bold text-gray-800 mb-2">Terms and Conditions</p>
                                        <ul className="list-disc pl-5 space-y-1 text-gray-600">
                                            <li>Your team will provide services as per the agreed terms and conditions.</li>
                                            <li>You agree to maintain confidentiality of user data and ensure privacy protection.</li>
                                            <li>All activities and communication must be professional and ethical.</li>
                                            <li>The company reserves the right to terminate the partnership if these conditions are violated.</li>
                                            <li>By agreeing, you confirm all provided information is accurate and truthful.</li>
                                        </ul>
                                    </div>
                                    <div className="mt-3 flex items-center">
                                        <input
                                            type="checkbox"
                                            id="agreeTerms"
                                            checked={agreeTerms}
                                            onChange={() => setAgreeTerms(!agreeTerms)}
                                            className="mr-2 h-4 w-4 text-[#FE8180] focus:ring-[#FE8180] border-gray-300 rounded"
                                        />
                                        <label htmlFor="agreeTerms" className="text-sm text-gray-700">
                                            I agree to the Terms and Conditions
                                        </label>
                                    </div>
                                </motion.div>
                            </div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8 }}
                                className="md:col-span-2"
                            >
                                <Button
                                    disabled={!agreeTerms || loading}
                                    type="submit"
                                    className="max-w-md w-3/4 bg-[#FE8180] hover:bg-[#e57373] mx-auto flex items-center justify-center"
                                >
                                    {loading ? (
                                        <div className="flex items-center justify-center">
                                            <Spinner size="sm" className="mr-2" />
                                            Processing...
                                        </div>
                                    ) : (
                                        "Join Surprise Team"
                                    )}
                                </Button>
                            </motion.div>
                        </form>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.9 }}
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
