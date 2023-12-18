import React, { useContext, useState } from 'react';
import '../styles/profileCard.css';
import EditIcon from '@mui/icons-material/Edit';
import { SocketContext } from "../context/SocketContext";
import myImage from '../images/myImage.png'; // Adjust the path based on your project structure

const ProfileCard = () => {
  const { socket } = useContext(SocketContext);

  const username = localStorage.getItem('userName');
  const email = localStorage.getItem('userEmail');
  const userId = localStorage.getItem('userId');

  const [isUpdate, setIsUpdate] = useState(false);
  const [updateText, setUpdateText] = useState(username);
  const [profileImg, setProfileImg] = useState(myImage);

  const handleUpdate = async () => {
    try {
      await socket.emit("update-username", { updateText, userId });
      setIsUpdate(false);
      console.log("Username updated:", updateText);
      // Optionally, provide user feedback for a successful update
    } catch (error) {
      console.error("Error updating username:", error.message);
      // Optionally, provide user feedback for an error during update
    }
  };

  return (
    <div className='profile-card-body'>
      <button id="update-details-btn" onClick={() => setIsUpdate(true)}>
        <EditIcon />
      </button>
      <div className="profile-data">
        <div className="profile-img">
          <img src={profileImg} alt="Profile" />
        </div>
        {!isUpdate ? (
          <div className="profile-info">
            <p>Username: <span>{username}</span></p>
            <p>Email Id: <span>{email}</span></p>
          </div>
        ) : (
          <div className="update-data">
            <input type="text" placeholder='Update your name' value={updateText} onChange={(e) => setUpdateText(e.target.value)} />
            <button id='update-btn' onClick={handleUpdate}>Update</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;
