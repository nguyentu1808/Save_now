import React from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = ({ handleLogout }) => {
  const navigate = useNavigate();

  const logout = () => {
    handleLogout();
    navigate('/login');
  };

  return (
    <div>
      <h2>Profile Page</h2>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default Profile;
