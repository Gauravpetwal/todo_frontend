import NavBar from "./nav"
//import Swal from "sweetalert2";
import { useState } from 'react';
import React from 'react';
import '../css/Signup.css'; // Import the CSS file


const AddUser = () => {
    const [username, setUserName] = useState('');
    const [email, setUserEmail] = useState('');
    const [password, setUserPass] = useState('');
    const [message, setMessage] = useState('');
    const [space, setSpace] = useState();
    const [sigin, setSignin] = useState(false);

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
    const showadd = () => {
        Swal.fire("Added");
      };

    const token = localStorage.getItem("Token");
    const Values = {             
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            Authorization:`Bearer ${token}`},
        body: JSON.stringify({ 
            username,
            email,
            password
        })
    };
    
    const handleSubmit = async (e) => {    
        e.preventDefault();
        const whiteSpasec = username.includes(" ")
       if(!sigin){ 
        if (username && email && password) {
            try { 
                
                if(whiteSpasec){ 
                    setSpace("Spaces ate not allowed")  
                }
                else if(username.length > 8){
                    setSpace("Max length is 8")
                }

                if(!whiteSpasec && username.length <=8){
                    setSpace(" ")                   
                             
                // Fetch API call
                const response = await fetch("http://localhost:2004/api/adduser", Values);
                
                if(!response.ok) {
                    // Handle error response
                    const errorData = await response.json();
                    setMessage(errorData.message || 'An error occurred');
                }
            
            
                // Check if the response is ok
                if (response.ok) {
                    const data = await response.json();
                    setMessage("User Added");     
                    setTimeout(() => {
                        setMessage("")
                    }, 1000); 
                
                    
                }  
             } 

            } catch (error) {
                // Handle network errors
                setMessage('Network error: ' + error.message);
               
             
            }
        }
    };
} 


 return (
    <>
    <NavBar/>
    <div className="signup">
          <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Username" required  onChange={userNameInput}/>
        <p>{space}</p>
        <input type="email" placeholder="Email" required onChange={userEmailInput} />
        <input type="password" placeholder="Password" required  onChange={userPassword}/>
        <button type="submit" className="btn">Add user</button>
   
        <p>{message}</p> 
      </form>
 


    </div>
    </>


  );
};

export default AddUser;
