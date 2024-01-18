import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import Footer from '../component/footer/footer';
import MyNavbar from '../component/Navbar';
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
   <div>
  
      <div className="row row-cols-1 row-cols-md-3">
        
        {usersData.map((user) => (
          <div key={user._id} style={{ padding: '5px', marginRight: '3px', width: '300px' }} className="col mb-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title"  style={{ justifyContent: 'space-betwen',marginRight:'10px',padding:'10px',alignItems:'center' }}>
                  <FontAwesomeIcon icon={faUser} className="mr-2" />
                  {user.username}
                </h5>
                <p style={{ padding: '5px' }} className="card-text">Email: {user.email}</p>
                {/* Oculta los campos Roles y Created At */}
                {/* <p className="card-text">Role ID: {user.roles ? user.roles.join(', ') : 'N/A'}</p> */}
                {/* <p className="card-text">Created At: {user.createdAt}</p> */}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      </div>
      

    );
  };

  return (
    <div style={{backgroundImage:'linear-gradient(to right top, #80285a, #742a62, #652d69, #54306e, #3f3371, #323d7a, #204781, #005086, #006290, #007393, #008391, #04928b)'}}>
      <MyNavbar></MyNavbar>
    <div className="container mt-6"  >
      <h1 style={{textAlign:'center',color:'white'}}>Administracion de Usuarios</h1>
      {renderUsers()}
    </div>
   <Footer></Footer>
    </div>
  );
};

export default UserInfo;
