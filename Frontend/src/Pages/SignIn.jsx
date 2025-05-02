import { useState } from "react";
import { motion } from "framer-motion";
import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import OAuthenticate from "../Components/OAuthenticate";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";

export default function SignIn() {
    const [isSignUp, setIsSignUp] = useState(false);
    const [formData, setFormData] = useState({});
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const apiUrl = import.meta.env.VITE_User_API_URL;
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isSignUp && (!formData.email || !formData.password)) {
            return setError("Please fill all fields");
        }
        try {
            setLoading(true);
            setError(false);
            const url = isSignUp ? `${apiUrl}/api/user/signup` : `${apiUrl}/api/user/signin`;
            const res = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            console.log("Auth Response Data:", data);

            setLoading(false);
            if (!data || !data._id) {
                setError(data.message || "Authentication failed");
                return;
            }

            if (isSignUp) {
                setIsSignUp(false);
                setFormData({});
                alert("Signup successful! Please sign in."); 
            } else {
                dispatch(signInSuccess(data));
                navigate('/');
            }
        } catch (error) {
            setLoading(false);
            setError(error.message);
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none bg-gradient-to-b from-[rgba(254,129,128,0.3)] via-[rgba(255,255,255,0.3)] to-[rgba(254,143,142,0.3)] text-gray-800 placeholder-gray-700">
            <motion.div
                className="absolute top-0 left-0 w-1/2 h-full rounded-r-full transition-all bg-gradient-to-b from-[rgba(254,129,128,0.3)] via-[rgba(255,255,255,0.3)] to-[rgba(254,143,142,0.3)]"
                animate={{ x: isSignUp ? "100%" : "0%" }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
            ></motion.div>
            
            <div className="relative w-full max-w-md px-4 py-2 rounded-3xl border border-gray-300 focus:outline-none bg-gradient-to-b from-[rgba(254,129,128,0.3)] via-[rgba(255,255,255,0.3)] to-[rgba(254,143,142,0.3)] text-gray-800 placeholder-gray-700 p-6 shadow-lg z-10">
                <p className="text-center text-2xl font-cinzel font-semibold pt-5">{isSignUp ? "Sign Up" : "Sign In"}</p>
                <form className="flex flex-col gap-4 mt-5 p-5 " onSubmit={handleSubmit}>
                    {isSignUp && (
                        <div>
                            <Label value="Your username" />
                            <TextInput type="text" placeholder="Username" id="username" onChange={handleChange} />
                        </div>
                    )}
                    <div>
                        <Label value="Your email" />
                        <TextInput type="email" placeholder="name@company.com" id="email" value={formData.email || ''} onChange={handleChange} />
                    </div>
                    {isSignUp && (
                        <div>
                            <Label value="Your Address" />
                            <TextInput type="text" placeholder="Address" id="adress" value={formData.adress || ''} onChange={handleChange} />
                        </div>
                    )}
                    {isSignUp && (
                        <div>
                            <Label value="Your mobile number" />
                            <TextInput type="text" placeholder="Mobile Number" id="mobile" value={formData.mobile || ''} onChange={handleChange} />
                        </div>
                    )}
                    <div>
                        <Label value="Your password" />
                        <div className="relative">
                            <TextInput
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                id="password"
                                value={formData.password || ''}
                                onChange={handleChange}
                            />
                            <button type="button" className="absolute top-2 right-3" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? "🙈" : "👁️"}
                            </button>
                        </div>
                    </div>
                    <Button className="max-w-md w-3/4 bg-[#FE8180] hover:bg-[#e57373] mx-auto flex items-center justify-center" disabled={loading} type="submit">
                        {loading ? <Spinner size="sm" /> : isSignUp ? "Sign Up" : "Sign In"}
                    </Button>
                    <OAuthenticate />
                </form>
                <div className="flex gap-2 text-sm mt-5">
                    <span>{isSignUp ? "Have an Account?" : "Don't have an account?"}</span>
                    <button className="text-[#FE8180]" onClick={() => { setIsSignUp(!isSignUp); setFormData({}); setError(false); }}>
                        {isSignUp ? "Sign In" : "Sign Up"}
                    </button>
                    
                </div>
                <div className="flex gap-2 text-sm mt-5 ">
                    <span>Forget Password?</span>
                    <Link to='/forgetPassword' className="text-[#FE8180]">Click Here</Link>
                </div>
                {error && <Alert className="mt-5" color="failure">{error}</Alert>}
            </div>
        </div>
    );
}
