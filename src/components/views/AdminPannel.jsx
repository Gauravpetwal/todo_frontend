import "../css/nav.css";
import "../css/AdminPannel.css";
import NavBar from "./nav";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import AddUser from "./AddUser";

const AdminPannel = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState([]);
  const [todos, setTodos] = useState([]);
  const [message, setMessage] = useState("");
  const [isEditing, setEditing] = useState(false);
  const [id, setid] = useState();
  const [newEmail, setNewEmail] = useState("");
  const [newUsername, setNewUsername] = useState("");
  let component;

  useEffect(() => {
    getAllUser();
  }, []);

  // function to fecth all data
  const getAllUser = async () => {
    try {
      const token = localStorage.getItem("Token");
      if (!token) {
        navigate("/Not Found")
        return;
      }
      const response = await fetch("http://localhost:2004/api/allUser", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errordata = await response.json();
        console.error("error", errordata);
        setMessage("failed to load user");
      }
      const allusers = await response.json();
      setUser(allusers.data);
    } catch (error) {
      console.error("An error occurred:", error);
      setMessage("invalid value");
    }
  };

  //Function to logout
  const handleLogout = () => {
    localStorage.removeItem("Token");
    localStorage.removeItem("Name");
    navigate("/AdminLogin");
  };

  //Function to delete user
  const deleteUser = async (id) => {
    try {
      const token = localStorage.getItem("Token");
      if (!token) {
        setMessage("Token is expired login");
      }
      const response = await fetch(
        `http://localhost:2004/api/deleteUser/${id}`,
        {
          method: "delete",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setUser(user.filter((user) => user.id !== id));
      }

      if (!response.ok) {
        setMessage("Erro while deleting the user");
      }
    } catch (error) {
      console.log(error);
    }
  };

  //Edit user
  const editUser = (id) => {
    setEditing(true);
    setid(id);
  };
  const closeEditPage = () => {
    setEditing(false);
    setNewUsername("");
    setNewEmail("");
  };
  const saveChanges = async () => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(newEmail)) {
      alert("Please enter a valid email address mini eight charact .");
      return;
    }
    const requestBody = {
      userName: newUsername,
      email: newEmail,
    };
    const token = localStorage.getItem("Token");
    try {
      const response = await fetch(`http://localhost:2004/api/upDate/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include your auth token here
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Something went wrong");
      }
      if (response.ok) {
        closeEditPage();
      }
      const updatedUser = await response.json();
      setUser((prevUsers) =>
        prevUsers.map((user) =>
          user.id === updatedUser.data.id ? updatedUser.data : user
        )
      );
      return updatedUser;
    } catch (error) {
      console.error("Error updating user:", error.message);
    }
  };

  return (
    <>
      <NavBar />
      {component}
      <div>
        <h1>All Users</h1>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>createdAt</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {user.map((user) => (
              <tr key={user.id}>
                <td>{user.userName}</td>
                <td>{user.email}</td>
                <td>{user.createdAt}</td>
                <td>
                  <button onClick={() => deleteUser(user.id)}>Delete</button>
                  <button onClick={() => editUser(user.id)}>Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isEditing && (
        <div className="popup">
          <div className="popup-content">
            <span className="close" onClick={closeEditPage}>
              &times;
            </span>
            <h2>Edit User credential</h2>
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              placeholder="New username"
              required
              className="input-field"
            />
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="New email"
              required
              className="input-field"
            />
            <button className="submit-button" onClick={saveChanges}>
              Save Changes
            </button>
          </div>
        </div>
      )}
    </>
  );
};
export default AdminPannel;
