import { Button, Label, TextInput, Spinner, Alert } from "flowbite-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function ForgetPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const apiUrl = import.meta.env.VITE_User_API_URL;

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const sendLink = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (email === "") {
      setError("Email is required!");
      return;
    }
    if (!email.includes("@")) {
      setError("Please include @ in your email!");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/api/user/forgetpassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (data.status === 201) {
        setEmail("");
        setMessage("Password reset link sent successfully!");
      } else {
        setError("Invalid User");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none bg-gradient-to-b from-[rgba(144,238,144,0.3)] via-[rgba(255,255,255,0.3)] to-[rgba(152,251,152,0.3)] text-gray-800 placeholder-gray-700">
      {/* Animated Background */}
      <motion.div
        className="absolute top-0 left-0 w-1/2 h-full rounded-r-full transition-all bg-gradient-to-b from-[rgba(144,238,144,0.3)] via-[rgba(255,255,255,0.3)] to-[rgba(152,251,152,0.3)]"
        animate={{
          x: ["0%", "100%"],
          borderRadius: ["0%", "50% 0 0 50%"],
        }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      />

      {/* Form Container */}
      <div className="relative w-full max-w-lg px-4 py-100xl border border-gray-300 focus:outline-none bg-gradient-to-b from-[rgba(144,238,144,0.3)] via-[rgba(255,255,255,0.3)] to-[rgba(152,251,152,0.3)] text-gray-800 placeholder-gray-700 p-8 rounded-3xl shadow-lg z-10">
        <p className="text-center text-2xl font-cinzel font-semibold">
          Reset Password
        </p>
        <form onSubmit={sendLink} className="flex flex-col gap-4 mt-5 p-5">
          <div>
            <Label value="Enter Your Email" />
            <TextInput
              type="email"
              placeholder="name@company.com"
              id="email"
              onChange={handleChange}
              value={email}
            />
          </div>
          <Button
            className="max-w-md w-1/2 bg-[#4CAF50] hover:bg-[#45a049] mx-auto flex items-center justify-center"
            type="submit"
            disabled={loading}
          >
            {loading ? <Spinner size="sm" /> : "Send Reset Link"}
          </Button>
        </form>

        {message && (
          <Alert color="success" className="mt-4 pl-5">
            {message}
          </Alert>
        )}
        {error && (
          <Alert color="failure" className="mt-4 pl-5">
            {error}
          </Alert>
        )}

        <div className="flex gap-2 text-sm mt-5 pl-5">
          <span>Remembered your password?</span>
          <Link to="/sign-in" className="text-[#4CAF50] hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}