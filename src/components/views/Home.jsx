import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate(); // Hook to access the navigation
return (
    <>
    <nav className="bg-gray-800 p-4 flex justify-between items-center">
    <div className="text-white text-lg font-bold">
       <img src="../src/assets/logo.png" alt="logo"  className="w-[60px] h-[60px] object-contain"/>
      </div>
      <div className="space-x-4">
      <button className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600 atctive-red-500" onClick={() =>{navigate('/AdminLogin')}}>
          Admin
        </button>
        <button className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600" onClick={() =>{navigate('/Signin')}}>
          Signin
        </button>
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={() =>{navigate('/Signup')}}>
          Sign Up
        </button>
      </div>
    </nav>



    <div className="flex items-center justify-center min-h-screen bg-gray-100  ">
  <div className="bg-white shadow-2xl rounded-lg p-8 max-w-sm w-full shadow-[0_35px_80px_-15px_rgba(10,20,255,0.3)]">
    <h2 className="text-3xl font-extrabold mb-6 text-center text-gray-800">Welcome back</h2>
    <div className="flex flex-col space-y-4">
      <button className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline transition duration-300 text-lg" onClick={() =>{navigate('/Signin')}}>
        Sign In
      </button>
      <button className="bg-gray-400 hover:bg-gray-500 text-gray-800 font-bold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline transition duration-300 text-lg" onClick={() =>{navigate('/Signup')}}>
        Sign Up
      </button>
    </div>
  </div>
</div>
  </>
  
  );
};

export default Home;
