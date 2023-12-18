import React, { useContext, useState } from 'react';
import '../styles/profileCard.css';
import EditIcon from '@mui/icons-material/Edit';
import { SocketContext } from "../context/SocketContext";

// Import the default profile image
import defaultProfileImage from '../images/myImage.png';

const ProfileCard = () => {
  const { socket } = useContext(SocketContext);

  const storedUsername = localStorage.getItem('userName');
  const storedEmail = localStorage.getItem('userEmail');
  const userId = localStorage.getItem('userId');

  const [isUpdate, setIsUpdate] = useState(false);
  const [updatedUsername, setUpdatedUsername] = useState(storedUsername);

  const handleUpdate = async () => {
    try {
      // Emit an update request to the server
      await socket.emit("update-user-details", {
        userId,
        updatedUsername,
      });

      // Optionally, update local storage
      localStorage.setItem('userName', updatedUsername);

      setIsUpdate(false);
      console.log("User details updated:", updatedUsername);
    } catch (error) {
      console.error("Error updating user details:", error.message);
    }
  };

  return (
    <div className='profile-card-body'>
      <button id="update-details-btn" onClick={() => setIsUpdate(true)}>
        <EditIcon />
      </button>
      <div className="profile-data">
        <div className="profile-img">
          <img src={defaultProfileImage} alt="Profile" />
        </div>
        {!isUpdate ? (
          <div className="profile-info">
            <p>Username: <span>{storedUsername}</span></p>
            <p>Email Id: <span>{storedEmail}</span></p>
          </div>
        ) : (
          <div className="update-data">
            <input
              type="text"
              placeholder='Update your name'
              value={updatedUsername}
              onChange={(e) => setUpdatedUsername(e.target.value)}
            />
            <button id='update-btn' onClick={handleUpdate}>Update</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;
