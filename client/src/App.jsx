import './App.css';
import axios from 'axios';
import { useState, useEffect } from 'react';

function App() {
  const [user, setUser] = useState([]);
  const [filterUser, setFilterUser] = useState([]);
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [userData, setUserData] = useState({
    name: "",
    age: "",
    city: "",
  });

  // Fetch all users from the server
  const getAllUsers = async () => {
    try {
      const res = await axios.get('http://localhost:8000/users');
      setUser(res.data);
      setFilterUser(res.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  // Handle search input
  const handleSearchEvent = (e) => {
    const searchText = e.target.value.toLowerCase();
    const filteredUsers = user.filter((user) =>
      user.name.toLowerCase().includes(searchText) ||
      user.city.toLowerCase().includes(searchText)
    );
    setFilterUser(filteredUsers);
  };

  // Handle delete user
  const handleDelete = async (id) => {
    const isConfirm = window.confirm("Are you sure you want to delete the details?");
    if (isConfirm) {
      try {
        await axios.delete(`http://localhost:8000/users/${id}`);
        const updatedUsers = user.filter((u) => u.id !== id);
        setUser(updatedUsers);
        setFilterUser(updatedUsers);
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  // Close modal
  const closeModel = () => {
    setIsModelOpen(false);
    getAllUsers();
  };

  // Open modal for adding record
  const handleAddRecord = () => {
    setUserData({
      name: "",
      age: "",
      city: "",
    });
    setIsModelOpen(true);
  };

  // Handle form input changes
  const handleData = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  // Submit new record
  const handleSubmit = async (e) => {
    e.preventDefault();
    if(userData.id){
      await axios.patch(`http://localhost:8000/users/${userData.id}`,userData)
      .then((res)=>{
        console.log(res);
      });

    }else{
      await axios.post("http://localhost:8000/users",userData)
      .then((res)=>{
        console.log(res);
      });

    }
    closeModel();
    setUserData({
      name: "",
      age: "",
      city: "",
    });
  };

  const UpdateRecord=(users)=>{
    setUserData(users);
    setIsModelOpen(true);
  }

  return (
    <>
      <div className='container'>
        <h3>CRUD APPLICATION</h3>
        <div className="input-search">
          <input type="search" placeholder='Search for name or city' onChange={handleSearchEvent} />
          <button className="btn green" onClick={handleAddRecord}>Add record</button>
        </div>

        <table className='table'>
          <thead>
            <tr>
              <th>SL no</th>
              <th>Name</th>
              <th>Age</th>
              <th>City</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>

          <tbody>
            {filterUser.length ? (
              filterUser.map((user, index) => (
                <tr key={user.id}>
                  <td>{index + 1}</td>
                  <td>{user.name}</td>
                  <td>{user.age}</td>
                  <td>{user.city}</td>
                  <td>
                    <button className="btn green" onClick={()=>UpdateRecord(user)}>Edit</button>
                  </td>
                  <td>
                    <button className="btn red" onClick={() => handleDelete(user.id)}>Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No records found</td>
              </tr>
            )}
          </tbody>
        </table>

        {isModelOpen && (
          <div className="model">
            <div className="model-content">
              <span className='close' onClick={closeModel}>&times;</span>
              <h2>User Record</h2>
              <div className="input-group">
                <label htmlFor="name">Full Name</label>
                <input type="text" value={userData.name} name="name" id="name" onChange={handleData} />
              </div>
              <div className="input-group">
                <label htmlFor="age">Age</label>
                <input type="number" value={userData.age} name="age" id="age" onChange={handleData} />
              </div>
              <div className="input-group">
                <label htmlFor="city">City</label>
                <input type="text" value={userData.city} name="city" id="city" onChange={handleData} />
              </div>
              <button className='btn green' onClick={handleSubmit}>ADD User</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
