import React, { useContext, useEffect, useState } from 'react';
import '../styles/MeetPage.css';
import { useParams } from 'react-router-dom';
import { SocketContext } from '../context/SocketContext';
import { config } from '../AgoraSetup';
import VideoPlayer from '../components/VideoPlayer';
import Controls from '../components/Controls';
import Participants from '../components/Participants';
import Chat from '../components/Chat';

const MeetRoom = () => {
  const { id } = useParams();
  const [roomName, setRoomName] = useState('');
  const { socket, setInCall, client, users, setUsers, ready, tracks, setStart, setParticipants, start } = useContext(SocketContext);
  const userId = localStorage.getItem("userId");

  const copyMeetIdToClipboard = () => {
    navigator.clipboard.writeText(id);
    alert('Meet ID copied to clipboard!');
  };

  const handleUserJoin = () => {
    setInCall(true);
  };

  const handleUserRequestedToJoin = () => {
    if (window.confirm("Do you really want to leave?")) {
      alert("holaa");
    }
  };

  useEffect(() => {
    socket.emit('request-to-join-room', { userId, roomId: id });
    socket.emit('join-room', { userId, roomId: id });
    socket.on("user-joined", handleUserJoin);
    socket.emit('get-participants', { roomId: id });
    socket.on("participants-list", ({ usernames, roomName }) => {
      setParticipants(usernames);
      setRoomName(roomName);
    });

    socket.on("user-requested-to-join", handleUserRequestedToJoin);
  }, [socket]);

  useEffect(() => {
    const initAgora = async (name) => {
      try {
        const numericUserId = parseInt(userId, 10) % 10000;

        console.log('Joining Agora channel:', { appId: config.appId, name, token: config.token, numericUserId });
        await client.join(config.appId, name, config.token, numericUserId);

        if (tracks) {
          console.log('Publishing tracks:', tracks);
          await client.publish([tracks[0], tracks[1]]);
        }

        console.log('Setting start to true');
        setStart(true);
      } catch (error) {
        console.error('Error joining Agora channel:', error);
      }
    };

    if (ready && tracks) {
      initAgora(id);
    }
  }, [id, client, ready, tracks]);

  return (
    <div className='meetPage'>
      <div className="meetPage-header">
        <h3>Meet: <span>{roomName}</span></h3>
        <p>Meet ID: <button id='meet-id-copy' onClick={copyMeetIdToClipboard}>Copy Meet ID</button></p>
      </div>
      <Participants />
      <Chat roomId={id} userId={userId} />
      <div className="meetPage-videoPlayer-container">
        {start && tracks ? <VideoPlayer tracks={tracks} users={users} /> : ''}
      </div>
      <div className="meetPage-controls-part">
        {ready && tracks && <Controls tracks={tracks} />}
      </div>
    </div>
  );
};

export default MeetRoom;
