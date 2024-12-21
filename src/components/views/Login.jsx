import React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form"


import { useNavigate } from "react-router-dom";
import "../css/Login.css";


const Signin = () => {
  const { register, handleSubmit, formState: { errors }} = useForm()
  const [message, setMessage] = useState("");
   const navigate = useNavigate();
   const [error, seterror] = useState('')

  const submitForm = async (Data) => {
    try {

     const email = Data.email
     const pass = Data.Password
    const response = await fetch("http://localhost:2004/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          pass,
        }),
      });
      const responseData = await response.json();    
      if(!response.ok){        
        console.log("limit")
          seterror(responseData.message)        
          return
      }
      if(response.ok){
         localStorage.setItem("Token",responseData.data)
        navigate("/Todo");
        return
      }

    } catch (error) {
      setMessage("invalid user name or password", error);
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
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={() =>{navigate('/Signup')}}>
          Sign Up
        </button>
      </div>
    </nav>




         
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-[0_35px_80px_-15px_rgba(10,20,255,0.3)] rounded-lg p-8 max-w-sm w-full">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>
        <form onSubmit={handleSubmit(submitForm)}>
            <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2"  >Email</label>
            <input type="email" id="email"  placeholder="Your Email" {...register("email",{required:true, maxLength:{value:40, message:"Email length should be less then is 40"}})}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
             {errors.email && <p>{errors.email.message}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" >Password</label>
            <input
              type="password"
              id="password"
              placeholder="Your Password"
              {...register("Password",{required:true, maxLength:{value: 30, message:"password length should be less than 30"}})}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
             {errors.Password && <span>{errors.Password.message}</span>}
          </div>
          <p>{error}</p>
          <div className="flex items-center justify-between">
            <button type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Sign In
            </button>
            <button
      onClick={() =>{navigate('/')}}
      className="flex items-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300"
    >
      back
    </button>
    <p className="mt-4 text-center text-gray-600">
  <span className="hover:text-blue-500 cursor-pointer transition duration-300">
    <a href="/ForgetPass"> Forget Password </a>
  </span>
</p>
          
          </div>
        </form>
      </div>
    </div>  
      </>
  );
};

export default Signin;
