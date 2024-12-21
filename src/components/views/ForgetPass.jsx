import React from "react";
import { useState } from "react";
import "../css/ForgetPass.css";
import { useNavigate } from "react-router-dom";

const ForgetPassword = () => {
  const navigate = useNavigate(); 
  const [Email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  //for get user email from input feild
  const getMail = (e) => {
    setEmail(e.target.value);
  };

  //handle forger password
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!Email) {
        setMessage("Email is required");
        return;
      }
      const responce = await fetch("http://localhost:2004/api/forgetPassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Email }),
      });
      if(!responce.ok){
        const responseMessage =await  responce.json();    
     setMessage(responseMessage.message)
     localStorage.setItem("ForgetPass",false)
     return;
      }
      localStorage.setItem("ForgetPass",true)
      
      navigate("/Reset_password")

   
   } catch(error) {
      console.log("Error aquired",error)
    
    }
  };

  return (
    <>
        <nav className="bg-gray-800 p-4 flex justify-between items-center">
        <div className="text-white text-lg font-bold">
       <img src="../src/assets/logo.png" alt="logo"  className="w-[60px] h-[60px] object-contain"/>
      </div>
      <div className="space-x-4">
      <button className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600" onClick={() =>{navigate('/')}}>
          Home
        </button>
        <button className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600" onClick={() =>{navigate('/AdminLogin')}}>
          Admin
        </button>
        <button className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={() =>{navigate('/Signin')}}>
          Signin
        </button>
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={() =>{navigate('/Signup')}}>
          Sign Up
        </button>
      </div>
    </nav>

    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <h1 className="text-3xl font-extrabold mb-6 text-center text-gray-800">Forgot Password</h1>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
  <input
    type="email"
    placeholder="Enter Email"
    onChange={getMail}
    className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
    required
  />
  <div className="flex justify-between">
    <button
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300"
      type="submit"
    >
      Send EMail
    </button>
    <button
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300"
      onClick={() => navigate("/Signin")}
    >
      Back
    </button>
  </div>
  {message && <p className="text-center text-gray-600">{message}</p>}
</form>

      </div>
    </div>
    </>
  );
};

export default ForgetPassword;
