import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

const UserInfo = () => {
  const [usersData, setUsersData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/user/');
        const data = await response.json();
        setUsersData(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchData();
  }, []);

  const renderUsers = () => {
    if (!usersData) {
      return <div>Loading...</div>;
    }

    return (
      <div className="row row-cols-1 row-cols-md-3">
        {usersData.map((user) => (
          <div key={user._id} style={{padding:'5px',marginRight:'3px'}} className="col mb-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title" style={{justifyContent:'space-betwen'}}>
                  <FontAwesomeIcon icon={faUser} className="mr-2" />
                  {user.username}
                </h5>
                <p style={{padding:'5px'}} className="card-text">Email: {user.email}</p>
                <p className="card-text">Role ID: {user.roles ? user.roles.join(', ') : 'N/A'}</p>
                <p className="card-text">Created At: {user.createdAt}</p>
                {/* Add other fields as needed */}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="container mt-4">
      <h1>User Information</h1>
      {renderUsers()}
    </div>
  );
};

export default UserInfo;
