import React from 'react';
import "./indax.css"
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/views/Home';
import Signin from './components/views/Login';
import Signup from './components/views/Signup';
import Todo from './components/views/Todo';
import ForgetPassword from './components/views/ForgetPass';
import ResetPass from './components/views/Reset';
import AdminLogin from './components/views/AdminLogin';
import AdminPannel from './components/views/AdminPannel';
import AddUser from './components/views/AddUser';
import Notfound from './components/views/NotFound';
//import Temp from './components/views/Temp';



function App() {


  return (
    <>
    

    {/* <Temp/> */}
     <Router>
      <Routes>
        
        <Route path="/" element={<Home />} />
        <Route path = '/Signin' element={<Signin/>} />
        <Route path = '/Signup' element={<Signup/>} />
        <Route path = '/Todo'   element={<Todo/>} />
        <Route path = '/ForgetPass'   element={<ForgetPassword/>} />
        <Route path = '/AdminLogin'   element={<AdminLogin/>} />
        <Route path = '/AdminPannel'   element={<AdminPannel/>} />
        <Route path = '/AddUser'   element={<AddUser/>} />
        <Route path = '/Reset_password'   element={<ResetPass/>} />
        <Route path='/Not found' element={<Notfound/>}/>

       
      </Routes>
    </Router>
 

    </>
  )
}

export default App
