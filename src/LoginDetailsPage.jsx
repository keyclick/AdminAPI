import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const LoginDetailsPage = () => {
  const { username } = useParams();
  const [userDetails, setUserDetails] = useState({});

  useEffect(() => {
    const fetchUserData = async () => {
      const response = await fetch(
        `http://localhost:5000/user-details/${username}`,
        { method: "GET" }
      );
      const data = await response.json();
      setUserDetails(data[0]); //LIsting out the elements in the object VERY IMPORTANTE
    };
    fetchUserData();
  }, [username]);

  if (!userDetails) {
    return <div>{userDetails}</div>;
  }

  return (
    <div>
      {/* <div>{JSON.stringify(userDetails)}</div> */}
      <h1>Login Details Page</h1>
      <div>
        <strong>Name:</strong> {userDetails.name}
      </div>
      <div>
        <strong>Username:</strong> {userDetails.username}
      </div>
      <div>
        <strong>Language:</strong> {userDetails.language}
      </div>
      <div>
        <strong>Mobile:</strong> {userDetails.Mobile}
      </div>
    </div>
  );
};

export default LoginDetailsPage;
