import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form"

const AdminLogin = () => {
    const navigate = useNavigate(); 
    const { register, handleSubmit} = useForm()
  const [message, setMessage] = useState("");

  const submitForm = async (Data) => {
    try { 
    
      const AdminEmail = Data.email
      const AdminPass = Data.Password

      if (!AdminEmail || !AdminPass) {
        setMessage("Email and password required");
        return
      }
      const response = await fetch("http://localhost:2004/api/Admin/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          AdminEmail,
          AdminPass,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error:", errorData);
        setMessage(errorData.message);
        throw new Error(errorData.message || "Login failed");
      }
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("Token", data.data);
        navigate('/AdminPannel')

      }
    } catch (error) {
      setMessage(error.message);
      console.error("An error occurred:", error);
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
        <button className="bg-gray-700  text-white px-4 py-2 rounded hover:bg-blue-600" onClick={() =>{navigate('/Signin')}}>
          Sign in
        </button>
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={() =>{navigate('/Signup')}}>
          Sign Up
        </button>
      </div>
    </nav>


    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-[0_35px_80px_-15px_rgba(10,20,255,0.3)] rounded-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-extrabold mb-6 text-gray-800 text-left">Only for Admin</h1>
        <p className="color-red-500">{message}</p>
        <form onSubmit={handleSubmit(submitForm)} className="flex flex-col space-y-4">
          <input
            type="email"
            placeholder="Admin Email"
            {...register("email",{required:true})}                                   
          //  onChange={getAdminEmail}
            className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Admin Password"
            {...register("Password",{required:true, maxLength: 30})}
           // onChange={getAdminPass}
           
            className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
                    <div className="flex items-center justify-between">
            <button type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Sign In
            </button>
            <button
      onClick={() =>{navigate('/Signin')}}
      className="flex items-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300"
    >
      back
    </button>
        
          </div>
        </form>
      </div>
    </div>
    </>
  );
};
export default AdminLogin;
