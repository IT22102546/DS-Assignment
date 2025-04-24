import { Button, Label, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

export default function ResetPassword() {
  const { id, token } = useParams();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const userValid = async () => {
    try {
      const res = await fetch(`/api/user/resetpassword/${id}/${token}`, {
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
      const res = await fetch(`/api/user/updateResetPassword/${id}/${token}`, {
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
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none bg-gradient-to-b from-[rgba(254,129,128,0.3)] via-[rgba(255,255,255,0.3)] to-[rgba(254,143,142,0.3)] text-gray-800 placeholder-gray-700">
      {/* Animated Background */}
      <motion.div
        className="absolute top-0 left-0 w-1/2 h-full rounded-r-full transition-all bg-gradient-to-b from-[rgba(254,129,128,0.3)] via-[rgba(255,255,255,0.3)] to-[rgba(254,143,142,0.3)]"
        animate={{
          x: [ "100%","0%"],
          borderRadius: ["0%", "50% 0 0 50%"],
        }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      />

      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-20">
        <div className="flex-1 mt-48"></div>
        
        <div className="flex-1 mt-24">
          <p className="text-center text-2xl font-cinzel font-semibold">
            Enter New Password
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-5">
            <div>
              <Label value="Enter New password" />
              <div className="relative">
                <TextInput
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  id="password"
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute top-2 right-3 focus:outline-none"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-gray-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.818 8.818a4 4 0 0 1 0 6.364M5.636 8.818a4 4 0 0 1 0 6.364M11.998 5.996v.01"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 18.1V12a3.999 3.999 0 0 1 3.999-4 3.999 3.999 0 0 1 3.999 4v6.1c0 2.21-1.791 4-3.999 4a3.999 3.999 0 0 1-3.999-4z"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-gray-500"
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
                        d="M11 15a7 7 0 01-7-7M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            <Button className="bg-[#FE8180]" type="submit">
              Submit
            </Button>
          </form>
          {error && <p className="text-red-600 mt-3">{error}</p>}
          {message && <p className="text-green-600 mt-3">{message}</p>}
        </div>
      </div>
    </div>
  );
}
