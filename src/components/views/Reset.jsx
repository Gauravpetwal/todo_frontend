import "../css/Reset.css";
import { useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";

const ResetPass = () => {
  const [otp, setOtp] = useState("");
  const [newPass, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const [isForget, setForget] = useState("false")
  useEffect(()=>{
    const value = localStorage.getItem("forgetPass")
  
    if(value==='false'){
      navigate("/Not Found");
    }
  },[])

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!otp || !newPass) {
        setMessage("OTP or password required");
        return;
      }

      const response = await fetch("http://localhost:2004/api/resetpassword", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp, newPass }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setMessage(errorData.message || "Error occurred");
      }
      if (response.ok) {
        setMessage("Password reset successfully");
        setTimeout(() => {
          alert("Go to login page");
          localStorage.removeItem("ForgetPass")
          navigate("/Signin");
        }, 1000);
      }
    } catch (error) {
      setMessage("An error occurred: " + error.message);
      console.log("Error occurred", error);
    }
  };

  return (
    <>
      <nav className="bg-gray-800 p-4 flex justify-between items-center">
        <div className="text-white text-lg font-bold">
          <img
            src="../src/assets/logo.png"
            alt="logo"
            className="w-[60px] h-[60px] object-contain"
          />
        </div>
        <div className="space-x-4">
          <button
            className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600"
            onClick={() => {
              navigate("/");
            }}
          >
            Home
          </button>
          <button
            className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600"
            onClick={() => {
              navigate("/AdminLogin");
            }}
          >
            Admin
          </button>
          <button
            className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={() => {
              navigate("/Signin");
            }}
          >
            Signin
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={() => {
              navigate("/Signup");
            }}
          >
            Sign Up
          </button>
        </div>
      </nav>

      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
        <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
          <h1 className="text-3xl font-extrabold mb-6 text-center text-gray-800">
            Reset Your Password
          </h1>
          <form
            onSubmit={handleSubmit}
            id="reset-password-form"
            className="flex flex-col space-y-4"
          >
            <div className="form-group">
              <label
                htmlFor="otp"
                className="block text-gray-700 font-medium mb-2"
              >
                Enter OTP:
              </label>
              <input
                type="text"
                id="otp"
                name="otp"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="form-group">
              <label
                htmlFor="new-password"
                className="block text-gray-700 font-medium mb-2"
              >
                New Password:
              </label>
              <input
                type="password"
                id="new-password"
                name="new-password"
                placeholder="New Password"
                value={newPass}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 rounded-lg focus:outline-none focus:shadow-outline transition duration-300"
            >
              Reset Password
            </button>
            <button
              type="button" // Prevents form submission
              onClick={() => navigate("/ForgetPass")}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 rounded-lg focus:outline-none focus:shadow-outline transition duration-300"
            >
              Back
            </button>
            {message && (
              <p className="text-center text-gray-600 mt-4">{message}</p>
            )}
          </form>
        </div>
      </div>
    </>
  );
};

export default ResetPass;
