import React, { useContext, useEffect, useState } from 'react';
import { Dropdown, Card } from 'react-bootstrap';
import { CgEnter } from 'react-icons/cg';
import { RiVideoAddFill } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import meetingImage from '../images/meeting.jpg'
import Groups2Icon from '@mui/icons-material/Groups2';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
 
import StopCircleIcon from '@mui/icons-material/StopCircle';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import BoltIcon from '@mui/icons-material/Bolt';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import GitHubIcon from '@mui/icons-material/GitHub'

import '../styles/Home.css';
import { AuthContext } from '../context/authContext';
import { SocketContext } from '../context/SocketContext';

const Home = () => {
  const [roomName, setRoomName] = useState('');
  const [newMeetDate, setNewMeetDate] = useState('none');
  const [newMeetTime, setNewMeetTime] = useState('none');
  const [joinRoomId, setJoinRoomId] = useState('');
  const [joinRoomError, setJoinRoomError] = useState('');

  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const { socket, setMyMeets, newMeetType, setNewMeetType } = useContext(SocketContext);

  const userId = localStorage.getItem('userId');
  const userName = localStorage.getItem('userName');

  const handleLogIn = () => {
    navigate('/login');
  };

  const handleLogOut = (e) => {
    e.preventDefault();
    logout();
  };

  const handleCreateRoom = () => {
    console.log('Creating room...');
    socket.emit('create-room', { userId, roomName, newMeetType, newMeetDate, newMeetTime });
  };

  const handleJoinRoom = async () => {
    await socket.emit('user-code-join', { roomId: joinRoomId });
    setRoomName('');
  };

  useEffect(() => {
    const handleRoomExists = ({ roomId }) => {
      console.log('Room exists. Redirecting to:', `/meet/${roomId}`);
      navigate(`/meet/${roomId}`);
    };

    const handleRoomNotExist = () => {
      console.log('Room does not exist.');
      setJoinRoomId('');
      setJoinRoomError("Room doesn't exist! please try again..");
    };

    socket.on('room-exists', handleRoomExists);
    socket.on('room-not-exist', handleRoomNotExist);

    // Clean up the event listeners
    return () => {
      socket.off('room-exists', handleRoomExists);
      socket.off('room-not-exist', handleRoomNotExist);
    };
  }, [socket, navigate]);

  return (
    <div className="homePage">
      <div className="homePage-hero">
        <div className="home-header">
          <div className="home-logo">
            <h2>Vision Link</h2>
          </div>

          {!userName || userName === 'null' ? (
            <div className="header-before-login">
              <button onClick={handleLogIn}>Login</button>
            </div>
          ) : (
            <div className="header-after-login">
              <Dropdown>
                <Dropdown.Toggle id="dropdown-basic">{userName}</Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item>
                    <div className="dropdown-options" onClick={() => navigate('/profile')}>
                      Profile
                    </div>
                  </Dropdown.Item>
                  <Dropdown.Item className="dropdown-options" onClick={handleLogOut}>
                    Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          )}
        </div>

        <div className="home-container container">
          {!userName || userName === 'null' ? (
            <div className="home-app-intro">
              <h2>
              <b>Unleash Limitless Connections:</b> Redefine Your Gatherings with Cutting-Edge <b>Virtual Conferencing!</b>

              </h2>
              <p>
    Transform your meetings using our state-of-the-art and future-forward video conferencing platform. Immerse yourself in seamless collaboration, pristine audio, and high-definition video, all at <b>absolutely no cost! </b>Redefine your virtual communication and break free from limitations starting today!
</p>
              <button onClick={handleLogIn}>Join Now..</button>
            </div>
          ) : (
            <>
              <div className="home-app-intro">
                <span className="welcome">Welcome!! {userName},</span>
                <h2>Unleash Limitless Connections: Redefine Your Gatherings with Cutting-Edge Virtual Conferencing!</h2>
              </div>
              <div className="home-meet-container">
                <div className="create-meet">
                  <input type="text" placeholder="Name your meet..." onChange={(e) => setRoomName(e.target.value)} />
                  <button data-bs-toggle="modal" data-bs-target="#staticBackdrop" onClick={handleCreateRoom}>
                    <RiVideoAddFill /> New meet
                  </button>
                </div>
                <p>or</p>
                <div className="join-meet">
                  <input type="text" placeholder="Enter code..." onChange={(e) => setJoinRoomId(e.target.value)} />
                  <button onClick={handleJoinRoom}>
                    {' '}
                    <CgEnter /> Join Meet
                  </button>
                </div>
                <span>{joinRoomError}</span>
              </div>

              {/* Modal */}
              <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered" style={{ width: '30vw' }}>
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title" id="staticBackdropLabel">
                        Create New Meet
                      </h5>
                      <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                      <div className="form-floating mb-3">
                        <input type="text" className="form-control" id="floatingInput" placeholder="Name your meet" value={roomName} onChange={(e) => setRoomName(e.target.value)} />
                        <label htmlFor="floatingInput">Meet name</label>
                      </div>

                      <select className="form-select" aria-label="Default select example" value={newMeetType} onChange={(e) => setNewMeetType(e.target.value)}>
                        <option disabled value="">
                          Choose meet type
                        </option>
                        <option value="instant">Instant meet</option>
                        <option value="scheduled">Schedule for later</option>
                      </select>

                      {newMeetType === 'scheduled' ? (
                        <>
                          <p style={{ margin: ' 10px 0px 0px 0px', color: 'rgb(2, 34, 58)' }}>Meet Date: </p>
                          <input type="date" className="form-control" onChange={(e) => setNewMeetDate(e.target.value)} />
                          <p style={{ margin: ' 10px 0px 0px 0px', color: 'rgb(2, 34, 58)' }}>Meet Time: </p>
                          <input type="time" className="form-control" onChange={(e) => setNewMeetTime(e.target.value)} />
                        </>
                      ) : (
                        ''
                      )}
                    </div>
                    <div className="modal-footer">
                      <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                        Cancel
                      </button>
                      <button type="button" className="btn btn-primary" onClick={handleCreateRoom} data-bs-dismiss="modal">
                        Create meet
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="about-app-container">
  <div className="box">
    <div className="box-inner">
      <div className="box-front">
        <h2>Connect Anytime, Anywhere!</h2>
        <p>
          Embrace seamless connectivity and affordability with our video conference app. Whether it's work or socializing, our platform ensures effortless virtual meetings, fostering collaboration and global connections. Bid farewell to distance and welcome the ease of staying connected!
        </p>
      </div>
      <div className="box-back">
        <h2>Your Gateway to Effortless Communication!</h2>
        <p>
          Experience the realm of effortless connectivity through our video conference app. Stay in touch with colleagues, friends, and family, regardless of their location. Say goodbye to costly travels and embrace affordable, hassle-free meetings that bring people together effortlessly.
        </p>
      </div>
    </div>
  </div>


        <div className="about-cards">
          <Card className="about-card-body">
            <Card.Body>
              <Card.Title className="about-card-title">
                <span> <Groups2Icon /> </span>
              </Card.Title>
              <Card.Text className="about-card-text">Easy Group Conference!! Bringing chaos to order, one virtual group hug at a time!</Card.Text>
            </Card.Body>
          </Card>
          <Card className="about-card-body">
            <Card.Body>
              <Card.Title className="about-card-title">
                <span> <CalendarMonthIcon /> </span>
              </Card.Title>
              <Card.Text className="about-card-text">Schedule Meets Any Time!! Time is no longer the boss, you are!!</Card.Text>
            </Card.Body>
          </Card>
          <Card className="about-card-body">
            <Card.Body>
              <Card.Title className="about-card-title">
                {' '}
                <span style={{ fontSize: '35px' }}>₪</span>

              </Card.Title>
              <Card.Text className="about-card-text">Free of Cost!! Saving you moolah and keeping your pockets jolly. High fives for freebies!</Card.Text>
            </Card.Body>
          </Card>
          <Card className="about-card-body">
            <Card.Body>
              <Card.Title className="about-card-title">
                <span> <StopCircleIcon /> </span>
              </Card.Title>
              <Card.Text className="about-card-text">Preserving valuable discussions and insights, enabling you to revisit and learn from every meeting.</Card.Text>
            </Card.Body>
          </Card>
          <Card className="about-card-body">
            <Card.Body>
              <Card.Title className="about-card-title">
                <span> <QuestionAnswerIcon /> </span>
              </Card.Title>
              <Card.Text className="about-card-text">In-Meet Chat Feature!! Facilitating seamless communication within meetings, fostering real-time collaboration and engagement!!</Card.Text>
            </Card.Body>
          </Card>
          <Card className="about-card-body">
            <Card.Body>
              <Card.Title className="about-card-title">
                <span> <BoltIcon /> </span>
              </Card.Title>
              <Card.Text className="about-card-text">Zooming through virtual space like a rocket-powered cheetah. Efficiently connecting dots, one meet at a time!</Card.Text>
            </Card.Body>
          </Card>
        </div>
      </div>

      <div className="footer">
        <h2>Contact us @: </h2>
        <div className="footer-social-media">
          <a href="https://your-google-link" target="_blank" rel="noopener noreferrer">
            <GoogleIcon />
          </a>
          <a href="https://www.facebook.com/aziz.a.touma" target="_blank" rel="noopener noreferrer">
            <FacebookIcon />
          </a>
          <a href="https://www.instagram.com/aziztouma/" target="_blank" rel="noopener noreferrer">
            <InstagramIcon />
          </a>
          <a href="https://github.com/azizt24" target="_blank" rel="noopener noreferrer">
            <GitHubIcon />
          </a>
        </div>
      </div>
    </div>
  );
};

 

export default Home;
