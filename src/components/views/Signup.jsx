// src/components/SignUp.js
import { useForm } from "react-hook-form"
import { useState } from 'react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Login'


const SignUp = () => {
  const { register, handleSubmit } = useForm()
  const onSubmit = (data) => console.log(data)
   const [otp, setOtp] = useState("");
    const [username, setUserName] = useState('');
    const [email, setUserEmail] = useState('');
    const [password, setUserPass] = useState('');
    const [message, setMessage] = useState('');
    const [nameError, setNameError] = useState("");
    const [passError, setPassError] = useState("");
    const [confirm, confirmMessage] = useState("");
    const [isSignup, setSignup] = useState(false);
    const [error, setError] = useState('')

    //navigatin user
    const navigate = useNavigate();
    const navigateUser = () =>{
        navigate("/Signin") 
    }

    //getting userName
    const userNameInput = (e)=>{
        setUserName(e.target.value)      
        
    }
       //getting userEmail
    const userEmailInput =(e) =>{
        setUserEmail(e.target.value)
    }
         //getting uerpassword
    const userPassword = (e) =>{
        setUserPass(e.target.value)
    }

    //getting otp from user
    const handleOtpChange = (e) =>{
      setOtp(e.target.value)
    }



 //api for send otp to user validation
 const validatingUser = async (e)=>{
  e.preventDefault()
  const whiteSpasec = username.includes(" ")
  try{
    if(whiteSpasec){ 
      setNameError("Spaces are not allowed")  
        setTimeout(() => {setMessage(" ")}, 2000);
        return;
    }
    if (/[^a-zA-Z]/.test(username)) {
      setNameError('Only characters are allowed.');
      setTimeout(() => {setNameError(" ")}, 2000);
      return;
    }

  if(username.length > 8){
    setNameError("Max length is 8")
    setTimeout(() => {setNameError(" ")}, 2000);
    return;
    }
    if(password.length < 8){
      setPassError("Min length is 6")
      setTimeout(() => {setPassError(" ")}, 2000);
      return;
    }

    const responce = await fetch("http://localhost:2004/api/validate",
     { method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({username,email,password})
    })
    const data = await responce.json()
    if(data.status === 400){
      setError(data.message)
      setTimeout(()=>{
      setError(" ")
      },3000)
       return;

    }
    setSignup(true)
  }catch(error){    
    setMessage(error)
  }
        
 }

 //after validation regestring user in database
 const RegisterUser = async() =>{
  try{
    if(!otp){
      confirmMessage("otp is required")
      return;
    }
    const responce = await fetch('http://localhost:2004/api/Signup',
      { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({email,username,otp,password})
      }
    )
    const responseData = await responce.json();
    console.log(responseData)
    if(responseData.status === 400){
      confirmMessage(responseData.message)
      return;
    }
    if(responseData.status === 201){
      confirmMessage(responseData.message);  
      setTimeout( () => {
      alert("Register successfully go to login page")                    
      navigateUser()
          
        }, 1000) 
      return;
    }
 }catch(error){
    confirmMessage(error);
    console.log(error)

  }

 }

 //for close the otp form
 const handleClose = () =>{
  confirmMessage(" ")
  setSignup(false)

 }



    


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
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={() =>{navigate('/Signin')}}>
          Sign in
        </button>
      </div>
    </nav>
     

    <div className={"flex items-center justify-center min-h-screen bg-gray-100 "}>
    <div className="bg-white shadow-[0_35px_80px_-15px_rgba(10,20,255,0.3)] rounded-lg p-8 max-w-sm w-full">
    <p>{message}</p>
    <p>{error}</p>
      <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
      <form onSubmit={validatingUser}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
            Name
          </label>
              <input
            type="text"
            id="name"
            onChange={userNameInput}
            placeholder="Your Name"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
          { <p>{nameError}</p>}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" >Email</label>
          
          <input
            type="email"
            id="email"
            onChange={userEmailInput}
            placeholder="Your Email"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Password
          </label>
          <input
            type="password"
            id="password"
            placeholder="Your Password"
            onChange={userPassword}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
          <p>{passError}</p>
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
           Next
          </button>
          <button
      onClick={() =>{navigate('/Signin')}}
      className="flex items-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300"
    >
      back
    </button>
          </div>
      </form>
    {/* </div> */}
    {isSignup && (
         
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                
              <div className="bg-white p-6 rounded-lg shadow-lg w-80 relative"> 
                 <p>{confirm}</p>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-bold">Enter OTP</h3>
                  <button  className="bg-black-500 hover:text-black-700" onClick={handleClose}>
                    &times;
                  </button>
                </div>
                <input
                  type="text"
                  value={otp}
                  onChange={handleOtpChange}
                  placeholder="Enter OTP"
                  className="w-full p-2 border border-gray-300 rounded mb-4"
                />
                <button
                  onClick={RegisterUser}
                  className="w-full bg-gray-300 text-black p-2 rounded hover:bg-gray-400 mb-2"
                >
                  Sign up
                </button>
            
              </div>
            </div>
          )}
      
        
        </div>
  </div>
  
  </>
 )
};

export default SignUp;
