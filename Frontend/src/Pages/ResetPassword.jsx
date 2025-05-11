import { Button, Label, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, useParams } from "react-router-dom";

export default function ResetPassword() {
  const { id, token } = useParams();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const apiUrl = import.meta.env.VITE_User_API_URL;

  const userValid = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/user/resetpassword/${id}/${token}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error(`Error: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();

      if (data.status === 201) {
        console.log("User is valid");
      } else {
        setError("Invalid user or token.");
        console.error("Invalid user or token.");
      }
    } catch (error) {
      console.error("An error occurred while checking user validity:", error);
      setError(
        "An error occurred while checking user validity. Please try again later."
      );
    }
  };

  useEffect(() => {
    userValid();
  }, []);

  const handleChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{5,}$/;

    if (!passwordRegex.test(password)) {
      setError(
        "Password must contain at least one uppercase letter, one number, one symbol, and be at least 5 characters long."
      );
      return;
    }

    try {
      const res = await fetch(`${apiUrl}/api/user/updateResetPassword/${id}/${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (data.status === 201) {
        setPassword("");
        setMessage("Password updated successfully.");
      } else {
        setError("Token expired. Please generate a new link.");
      }
    } catch (error) {
      console.error("An error occurred while updating password:", error);
      setError("An error occurred while updating password.");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      {/* Animated Background */}
      <motion.div
        className="absolute top-0 left-0 w-full md:w-1/2 h-full bg-gradient-to-br from-pink-100 via-white to-pink-200"
        initial={{ x: "100%", borderRadius: "0%" }}
        animate={{
          x: "0%",
          borderRadius: ["0%", "0%", "50% 0 0 50%"],
        }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      />

      <div className="w-full max-w-md mx-auto z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-white p-8 rounded-lg shadow-lg"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2 font-cinzel">
              Reset Password
            </h2>
            <p className="text-gray-600">Enter your new password below</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label
                htmlFor="password"
                value="New Password"
                className="block text-sm font-medium text-gray-700 mb-1"
              />
              <div className="relative">
                <TextInput
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={handleChange}
                  placeholder="Enter your new password"
                  className="w-full"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  )}
                </button>
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Password must contain at least one uppercase letter, one number, and one symbol.
              </p>
            </div>

            <div>
              <Button
                type="submit"
                className="w-full bg-[#FE8180] hover:bg-[#fe6e6d] focus:ring-4 focus:ring-pink-200"
              >
                Reset Password
              </Button>
            </div>

            {error && (
              <div className="p-4 text-sm text-red-700 bg-red-100 rounded-lg">
                {error}
              </div>
            )}

            {message && (
              <div className="p-4 text-sm text-green-700 bg-green-100 rounded-lg">
                {message}
              </div>
            )}
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/sign-in"
              className="text-sm font-medium text-[#FE8180] hover:text-[#fe6e6d]"
            >
              Back to SignIn
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}