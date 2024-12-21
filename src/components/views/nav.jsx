import '../css/nav.css'
import { useNavigate } from "react-router-dom";
import about from './AddUser';

const NavBar = () =>{
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem("Token");
        navigate("/AdminLogin");
      };
    return(
    
      <header className="flex items-center justify-between bg-black p-4 text-white">
      <div className="text-xl font-bold">Admin</div>
      <nav>
        <ul className="flex space-x-6">
          <li className="nav-item">
            <a href="./AdminPannel" className="hover:text-gray-400 transition duration-300">
              Home
            </a>
          </li>
          <li className="nav-item">
            <a href="./AddUser" className="hover:text-gray-400 transition duration-300">
              Add User
            </a>
          </li>
        </ul>
      </nav>
      <button 
        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300"
        onClick={() => handleLogout()}
      >
        Logout
      </button>
    </header>

    )
}

export default NavBar;