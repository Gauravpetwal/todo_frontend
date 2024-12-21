import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SnackbarProvider, enqueueSnackbar } from "notistack";


//Main function
const Todo = () => {
  //frontEnd logic
  const navigate = useNavigate();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [view, setView] = useState("all");
  const [ToDo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [message, setMessage] = useState("");
  const [user, setUser] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [imgError, setImgError] = useState("");
  const [upload, setUpload] = useState(false);
  const [about, setAbout] = useState(false);

  //for image checks
  const handleImageChange = (event) => {
    const selectedFile = event.target.files[0];
    const allowedFileType = ["image/png", "image/jpeg", "image/gif"];
    const maxSize = 2 * 1024 * 1024;
    const maxHeight = 1000;
    const maxWidth = 1000;
    if (selectedFile) {
      if (!allowedFileType.includes(selectedFile.type)) {
        setImgError("File is not supported");
        return;
      }
      if (selectedFile.size > maxSize) {
        setImgError("File size of the image is big");
        return;
      }
      const img = new Image();
      img.onload = () => {
        if (img.width > maxWidth || img.height > maxHeight) {
          setImgError(
            `Image dimensions exceed the allowed ${maxWidth}px${maxHeight}px`
          );
          return;
        }
      };

      setImgError("");
      setSelectedImage(selectedFile);
    }
  };
  const handleInputChange = (e) => {
    setTodo(e.target.value);
  };

  useEffect(() => {
    showAllTodos();
    userDetail();
    getImage();
  }, []);

  //fectching all todos
  const showAllTodos = async () => {
    try {
      const token = localStorage.getItem("Token");
      const userName = localStorage.getItem("Name");
      if (!token) {
        navigate("/Not Found");
        return;
      }
      const response = await fetch(`http://localhost:2004/api/gettodos`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const responseData = await response.json();
      if (responseData.status === 400) {
        enqueueSnackbar(responseData.message, {
          autoHideDuration: 2000,
        });
        return;
      }

      if (responseData.status === 201) {
          if (responseData.data.length === 0) {
          enqueueSnackbar("You have no todos create first", {
            autoHideDuration: 2000,
          });
          return;
        } else {
          setTodos(responseData.data);
        }
      }
    } catch (error) {
      setMessage(error);
    }
  };

  //image uploader function
  const imageUploader = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    const Token = localStorage.getItem("Token");

    // Ensure selectedImage is defined and valid
    if (!selectedImage) {
      setMessage("No image selected");
      return;
    }

    formData.append("image", selectedImage);
    try {
      const response = await fetch("http://localhost:2004/api/uploadImage", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${Token}`,
        },
      });

      if (!response.ok) {
        setMessage("Failed to upload");
      } else {
        setMessage("Image uploaded successfully");
        console.log("Uploaded successfully");
      }
    } catch (error) {
      console.log("Error while uploading image", error);
      setMessage("Error while uploading image");
    }
  };

  //function to get image
  const getImage = async () => {
    try {
      const Token = localStorage.getItem("Token");
      if (!Token) {
        setMessage("Not authorized");
        return;
      }

      const response = await fetch("http://localhost:2004/api/userImage", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Token}`,
        },
      });

      if (!response.ok) {
        setMessage("Image not found");
        setTimeout(() => {
          setMessage(" ");
        }, 2000);

        return;
      }
      const data = await response.json();

      setImageUrl(data.imageUrl);
    } catch (error) {
      console.error("Server error:", error);
      setMessage("Server error");
    }
  };

  //funtiton that retruive the usr detail
  const userDetail = async () => {
    try {
      const Token = localStorage.getItem("Token");
      if (!Token) {
        setMessage("Login first");
        return;
      }
      const response = await fetch("http://localhost:2004/api/userDetail", {
        method: "get",
        headers: {
          "Content-typed": "Application/json",
          Authorization: `Bearer ${Token}`,
        },
      });
         const responseData = await response.json()
      if(responseData.status === 400){
        enqueueSnackbar(responseData.message, {
          autoHideDuration: 2000,
        });
        return;

      }
      if(responseData.status === 201){
        setUser(responseData.data);
      }

      // if (!resopnce.ok) {
      //   const errorData = await resopnce.json();
      //   enqueueSnackbar(errorData, {
      //     autoHideDuration: 2000,
      //   });
      //   return;
      // }
      // const userDetails = await resopnce.json();
      // setUser(userDetails);
    } catch (error) {
      enqueueSnackbar(error, {
        autoHideDuration: 2000,
      });
    }
  };

  //function that changes the view
  const completed = () => {
    setView("completed");
  };
  const all = () => {
    setView("all");
  };
  const onGoing = () => {
    setView("onGoing");
  };

  //filtering the todos
  const filerTodDo = () => {
    switch (view) {
      case "onGoing":
        return todos.filter((todo) => todo.status === "onGoing");

      case "completed":
        return todos.filter((todo) => todo.status === "completed");

      case "all":
        return todos;
    }
  };

  //add todo in databse
  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (ToDo.trim().length <= 0) {
      setMessage("Invlid value");
    }
    if (ToDo.trim().length >= 1) {
      try {
        const todotrim = ToDo.trim();
        if (!todotrim || !todos) {
          setMessage("invalid input value");
        }
        const token = localStorage.getItem("Token");
        const response = await fetch(`http://localhost:2004/api/todos/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ ToDo }),
        });

        const responseData = await response.json();
        console.log(responseData.data);
        if (responseData.status === 400) {
          setMessage(responseData.nessage);
        }
        if (responseData.status === 201) {
          setTodos([responseData.data, ...todos]);
          enqueueSnackbar("ToDo Added Successfully!", {
            autoHideDuration: 2000,
          });
        }
      } catch (error) {
        console.error("An error occurred:", error);
        setMessage("invalid value");
      }
    }
  };

  // delete a todo from database
  const handleDeleted = async (id) => {
    try {
      const token = localStorage.getItem("Token");
      if (!token) {
        enqueueSnackbar("Unauthorized!", { autoHideDuration: 4000 });
        return;
      }

      const response = await fetch(
        `http://localhost:2004/api/deleteToDo/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const responseData = await response.json();
      if (responseData.status === 400) {
        enqueueSnackbar("ToDo not Deleted!", { autoHideDuration: 2000 });
      }

      if (responseData.status === 201) {
        setTodos(todos.filter((todo) => todo.id !== id));
        enqueueSnackbar("ToDo Deleted Successfully!", {
          autoHideDuration: 2000,
        });
      }
    } catch (error) {
      enqueueSnackbar(error, { autoHideDuration: 4000 });
    }
  };

  //handle edit
  const handleEdit = async (oldval, id) => {
    try {
      const ToDoName = prompt("Edit value", `${oldval}`);
      const Trimval = ToDoName.trim().length;

      if (Trimval <= 0) {
        setMessage("Invalid value");
        return;
      }
      if (Trimval >= 1) {
        const token = localStorage.getItem("Token");
        const response = await fetch(
          `http://localhost:2004/api/updateToDo/${id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ ToDoName }),
          }
        );

        const responseData = await response.json();
        if (responseData.status === 400) {
          setMessage(responseData.message);
        }
        if (responseData.status === 201) {
          const updatedTodo = responseData.data;
          setTodos((prevTodos) =>
            prevTodos.map((todo) =>
              todo.id === id ? { ...todo, ...updatedTodo } : todo
            )
          );
          enqueueSnackbar("ToDo Edited Successfully!", {
            autoHideDuration: 2000,
          });
        }
      }
    } catch (error) {
      enqueueSnackbar(error, {
        autoHideDuration: 2000,
      });
    }
  };

  //logout user
  const handleLogout = () => {
    localStorage.removeItem("Token");
    localStorage.removeItem("Name");
    navigate("/Signin");
  };

  //seting todos as check or uncheck
  const handleCheck = async (id) => {
    try {
      const token = localStorage.getItem("Token");
      if (!token) {
        setMessage("Unauthorized");
        return;
      }
      const response = await fetch(
        `http://localhost:2004/api/updateStatus/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const responseData = await response.json();
      if (responseData.status === 0) {
        setMessage("Failed to update:");
        return;
      }

      if (responseData.status === 201) {
        setTodos((prevTodos) =>
          prevTodos.map((todo) =>
            todo.id === responseData.data.id ? responseData.data : todo
          )
        );
        enqueueSnackbar("Well done you havecompleted your task", {
          autoHideDuration: 2000,
        });
      }
    } catch (error) {
      enqueueSnackbar(error, {
        autoHideDuration: 2000,
      });
    }
  };
  //FrontEnd logic end here

  //View portion of frontend
  return (
    <>
      <SnackbarProvider />
  <div className="flex flex-col min-h-screen">
  <nav className="bg-gray-800 p-4 flex justify-between items-center">
    <div className="text-white text-lg font-bold cursor-pointer" onClick={() => setAbout(true)}>
      <img src="../src/assets/logo.png" alt="logo" className="w-[60px] h-[60px] object-contain" />
    </div>
    <div className="space-x-4 flex items-center">
      <button className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600" onClick={() => navigate("/")}>
        Home
      </button>
      <button className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600" onClick={() => navigate("/AdminLogin")}>
        Admin
      </button>
      <button className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600" onClick={() => navigate("/Signup")}>
        Sign Up
      </button>
      <div className="flex-shrink-0 cursor-pointer" onClick={() => setIsPopupOpen(true)}>
        <img src={imageUrl} alt="User Photo" className="w-16 h-16 rounded-full border-2 border-gray-300" />
      </div>
    </div>
  </nav>

  {/* User Popup */}
  {isPopupOpen && (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
        <p>{imgError}</p>
        <div className="flex-shrink-0 cursor-pointer flex flex-col items-center mb-4">
          <img
            src={imageUrl}
            alt="User Photo"
            className="w-16 h-16 rounded-full border-2 border-gray-300"
            onClick={() => {
              setUpload(true);
              setIsPopupOpen(false);
            }}
          />
          <form onSubmit={imageUploader} encType="multipart/form-data">
            <input type="file" accept="image/*" onChange={handleImageChange} required />
            <button type="submit" className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200">Upload Image</button>
          </form>
        </div>
        <h2 className="text-lg font-bold">Your Details</h2>
        <p>{`Name: ${user.userName}`}</p>
        <p>{`Email: ${user.email}`}</p>
        <p>{`Join: ${user.createdAt}`}</p>
        <button className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-400" onClick={handleLogout}>
          Logout
        </button>
        <button className="mt-2 ml-2 bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-200" onClick={() => setIsPopupOpen(false)}>
          Close
        </button>
      </div>
    </div>
  )}

  {/* Main Content */}
  <div className="relative flex-grow bg-gray-100">
    <div className="flex flex-col justify-center items-center min-h-screen p-6">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-6">
        <div className="input-container mb-5">
          <p className="text-gray-700">{message}</p>
          <div className="flex flex-col md:flex-row md:items-center">
            <input
              type="text"
              value={ToDo}
              onChange={handleInputChange}
              placeholder="Enter your todo"
              className="flex-grow p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3 md:mb-0 md:mr-3"
            />
            <button
              type="submit"
              className="bg-teal-500 text-white p-3 rounded-md hover:bg-teal-600 transition duration-200"
              onClick={handleAddTodo}
            >
              <img src="../src/assets/Add.svg" width={40} height={30} alt="Add Todo" />
            </button>
          </div>
        </div>

        {/* Todo List */}
        <div className="todo-list-container mb-5">
          <div className="flex justify-between">
            <button className={`cursor-pointer p-2 ${view === "all" ? "font-bold text-white border-b-2 border-teal-500 bg-green-500" : ""}`} onClick={() => all()}>
              All
            </button>
            <button className={`cursor-pointer p-2 ${view === "onGoing" ? "font-bold text-white border-b-2 border-teal-500 bg-green-500" : ""}`} onClick={() => onGoing()}>
              On Going
            </button>
            <button className={`cursor-pointer p-2 ${view === "completed" ? "font-bold text-white border-b-2 border-teal-500 bg-green-500" : ""}`} onClick={() => completed()}>
              Completed
            </button>
          </div>

          <ul className="todo-list space-y-2">
            {filerTodDo().map((item) => (
              <li key={item.id} className="flex items-center justify-between bg-gray-100 p-3 rounded-md shadow-sm">
                <span className="flex items-center">
                  {view === "onGoing" && (
                    <input type="checkbox" onChange={() => handleCheck(item.id)} className="mr-2" />
                  )}
                  {item.ToDoName}
                </span>
                <div className="todo-actions space-x-2">
                  <button className="bg-green-600 text-white p-2 rounded-md hover:bg-green-800" onClick={() => handleEdit(item.ToDoName, item.id)}>
                    <img src="../src/assets/Edit.svg" width={40} height={30} alt="Edit Todo" />
                  </button>
                  <button className="bg-orange-800 text-white p-2 rounded-md hover:bg-red-900" onClick={() => handleDeleted(item.id)}>
                    <img className="w-10 h-10 rounded-full" src="../src/assets/Delete.svg" alt="Delete Todo" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </div>

  {/* Image Upload Popup */}
  {upload && (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <form className="bg-white p-6 rounded-lg shadow-md max-w-sm mx-auto">
        <label className="block mb-4 cursor-pointer">
          <span className="block text-gray-700 mb-2">Upload Image</span>
          <input type="file" accept="image/*" className="hidden" />
          <div className="flex justify-center items-center border-2 border-dashed border-gray-300 rounded-lg h-40 hover:border-blue-500 transition duration-300">
            {selectedImage ? (
              <img src={selectedImage} alt="Preview" className="w-full h-full object-cover rounded-lg" />
            ) : (
              <span className="text-gray-400">Drag and drop or click to upload</span>
            )}
          </div>
        </label>
        <div className="flex justify-between">
          <button type="submit" className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300">Submit</button>
          <button onClick={() => { setUpload(false); setIsPopupOpen(true); }} className="mt-4 w-full bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-700 transition duration-300">Close</button>
        </div>
      </form>
    </div>
  )}

  {/* About Section */}
  {about && (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-11/12 max-w-md p-5 bg-white border border-gray-200 shadow-lg rounded-lg">
        <p className="mb-4 text-2xl font-bold tracking-tight text-gray-900">
          Welcome to Todo Web! Your ultimate task management companion. Simplify your life by organizing tasks effortlessly. Create, edit, and prioritize your to-dos with ease. Our intuitive interface helps you stay focused and productive. Collaborate with friends or colleagues to share tasks and boost teamwork. Enjoy customizable reminders to keep you on track. Access your tasks anytime, anywhere—perfect for busy lifestyles. Start conquering your to-do list today and reclaim your time! Join our community and experience the difference.
        </p>
        <button onClick={() => setAbout(false)} className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300">Close</button>
      </div>
    </div>
  )}

  {/* Footer */}
  <footer className="bg-gray-800 text-white p-4">
    <div className="footer-content text-center">
      <ul className="flex justify-center space-x-4">
        <li><a href="#" className="hover:underline">Facebook</a></li>
        <li><a href="#" className="hover:underline">Twitter</a></li>
        <li><a href="#" className="hover:underline">Instagram</a></li>
      </ul>
    </div>
    <p className="mt-2 text-sm">© 2024 Your Company. All rights reserved.</p>
  </footer>
</div>

    </>
  );
};


export default Todo;
