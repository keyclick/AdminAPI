import React, { useState, useEffect } from "react";

const Admin = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Fetch the list of users from the server
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:5000/users");
        const data = await response.json();
        setUsers(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    console.log("Hello Juli");
    fetchUsers();
  }, []);

  const handleToggleUser = (userId) => {
    // Handle enable/disable user action
    // Make a POST request to the server to toggle the user's status
    // Update the users state accordingly
  };

  return (
    <div>
      <h1>Admin Access</h1>
      <h4>User list</h4>
      <table>
        <thead>
          <tr>
            <th>Sr.No (Desc)</th>
            <th>Name</th>
            <th>Email</th>
            <th>Created Date</th>
            <th>Action</th>
            <br />
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user.id}>
              <td>{users.length - index}</td>
              <td>{user.name}</td>
              <td>{user.username}</td>
              <td>{user.date}</td>
              <td>
                <button onClick={() => handleToggleUser(user.id)}>
                  {user.isEnabled ? "Disable" : "Enable"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Admin;
