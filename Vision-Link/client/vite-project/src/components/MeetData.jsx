import React, { useContext, useState, useEffect } from 'react';
import '../styles/MeetData.css';
import { SocketContext } from '../context/SocketContext';
import { Link } from 'react-router-dom';

const MeetData = () => {
  const [pastMeets, setPastMeets] = useState(false);
  const { socket, myMeets, setMyMeets } = useContext(SocketContext);

  const [editRoomName, setEditRoomName] = useState('');
  const [editMeetDate, setEditMeetDate] = useState('none');
  const [editMeetTime, setEditMeetTime] = useState('none');

  useEffect(() => {
    const setMyMeetsState = (newMeets) => {
      // Update state or context with new meets
      setMyMeets(newMeets);
    };

    socket.on('room-deleted', ({ roomId }) => {
      setMyMeetsState((prevMeets) => prevMeets.filter((meet) => meet._id !== roomId));
    });

    socket.on('meet-details-updated', ({ roomId }) => {
      setMyMeetsState((prevMeets) =>
        prevMeets.map((meet) =>
          meet._id === roomId
            ? {
                ...meet,
                roomName: editRoomName,
                meetDate: editMeetDate,
                meetTime: editMeetTime,
              }
            : meet
        )
      );
    });

    return () => {
      socket.off('room-deleted');
      socket.off('meet-details-updated');
    };
  }, [socket, editRoomName, editMeetDate, editMeetTime, setMyMeets]);

  const copyMeetIdToClipboard = (meetId) => {
    navigator.clipboard.writeText(meetId);
  };
  return (
    <div className="myMeets-body">
      <div className="myMeets-body-nav">
        <ul>
          <li
            style={
              pastMeets
                ? { borderBottom: 'none' }
                : { borderBottom: '2px solid rgb(245, 252, 254, 0.7)' }
            }
            onClick={() => setPastMeets(false)}
          >
            Upcoming meetings
          </li>
          <li
            style={
              !pastMeets
                ? { borderBottom: 'none' }
                : { borderBottom: '2px solid rgb(245, 252, 254, 0.7)' }
            }
            onClick={() => setPastMeets(true)}
          >
            Past meetings
          </li>
        </ul>
      </div>

      <div className="myMeets-body-content">
        {!pastMeets ? (
          <div className="upcoming-meet-content">
            {myMeets.length > 0 ? (
              myMeets.map((meet) => {
                if (
                  meet.meetDate !== 'none' &&
                  meet.meetTime !== 'none' &&
                  meet.meetType === 'scheduled'
                ) {
                  const currDate = new Date();
                  const date = new Date(meet.meetDate + 'T' + meet.meetTime);
                  const year = date.getFullYear();
                  const month = String(date.getMonth() + 1).padStart(2, '0');
                  const day = String(date.getDate()).padStart(2, '0');
                  const hours = String(date.getHours()).padStart(2, '0');
                  const minutes = String(date.getMinutes()).padStart(2, '0');

                  if (currDate < date) {
                    return (
                      <div className="upcoming-meet-card" key={meet._id}>
                        <div className="details-controls">
                          <div className="meet-card-details">
                            <p>
                              Meet: <span>{meet.roomName}</span>
                            </p>
                            <p>
                              Meet Id: <span>{meet._id}</span>
                              <button
                                className="copyBtn"
                                onClick={() => copyMeetIdToClipboard(meet._id)}
                              >
                                Copy Meet ID
                              </button>
                            </p>
                          </div>
                          <div className="meet-card-controls">
                            <Link to={`/meet/${meet._id}`}>
                              <button className="joinBtn">Join</button>
                            </Link>
                            <button
                              className="editBtn"
                              data-bs-toggle="modal"
                              data-bs-target={`#editModal-${meet._id}`}
                              onClick={() => {
                                setEditRoomName(meet.roomName);
                                setEditMeetDate(meet.meetDate);
                                setEditMeetTime(meet.meetTime);
                              }}
                            >
                              Edit
                            </button>
                            <button
                              className="deleteBtn"
                              onClick={() => {
                                socket.emit('delete-meet', { roomId: meet._id });
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                        <div className="meet-card-timings">
                          <h4>Timings:</h4>
                          <div className="meet-card-timings-details">
                            <p>
                              Date: <span>{day}/{month}/{year}</span>
                            </p>
                            <p>
                              Created Time:{' '}
                              <span>
                                {hours}:{minutes}
                              </span>
                            </p>
                          </div>
                        </div>
                        <div
                          className="modal fade"
                          id={`editModal-${meet._id}`}
                          tabIndex="-1"
                          aria-labelledby={`editModalLabel-${meet._id}`}
                          aria-hidden="true"
                        >
                          <div
                            className="modal-dialog modal-dialog-centered"
                            style={{ width: '30vw' }}
                          >
                            <div className="modal-content">
                              <div className="modal-header">
                                <h5
                                  className="modal-title"
                                  id={`editModalLabel-${meet._id}`}
                                >
                                  Edit Meet
                                </h5>
                                <button
                                  type="button"
                                  className="btn-close"
                                  data-bs-dismiss="modal"
                                  aria-label="Close"
                                ></button>
                              </div>
                              <div className="modal-body">
                                <div className="form-floating mb-3">
                                  <input
                                    type="text"
                                    className="form-control"
                                    id={`editFloatingInput-${meet._id}`}
                                    placeholder="Name your meet"
                                    value={editRoomName}
                                    onChange={(e) =>
                                      setEditRoomName(e.target.value)
                                    }
                                  />
                                  <label
                                    htmlFor={`editFloatingInput-${meet._id}`}
                                  >
                                    Meet name
                                  </label>
                                </div>
                                <p
                                  style={{
                                    margin: ' 10px 0px 0px 0px',
                                    color: 'rgb(2, 34, 58)',
                                  }}
                                >
                                  Meet Date:{' '}
                                </p>
                                <input
                                  type="date"
                                  className="form-control"
                                  value={editMeetDate}
                                  onChange={(e) =>
                                    setEditMeetDate(e.target.value)
                                  }
                                />
                                <p
                                  style={{
                                    margin: ' 10px 0px 0px 0px',
                                    color: 'rgb(2, 34, 58)',
                                  }}
                                >
                                  Meet Time:{' '}
                                </p>
                                <input
                                  type="time"
                                  className="form-control"
                                  value={editMeetTime}
                                  onChange={(e) =>
                                    setEditMeetTime(e.target.value)
                                  }
                                />
                              </div>
                              <div className="modal-footer">
                                <button
                                  type="button"
                                  className="btn btn-secondary"
                                  data-bs-dismiss="modal"
                                >
                                  Cancel
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-primary"
                                  onClick={() =>
                                    socket.emit('update-meet-details', {
                                      roomId: meet._id,
                                      roomName: editRoomName,
                                      newMeetDate: editMeetDate,
                                      newMeetTime: editMeetTime,
                                    })
                                  }
                                  data-bs-dismiss="modal"
                                >
                                  Update
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }
                }
                return null;
              })
            ) : (
              <p>No upcoming meets</p>
            )}
          </div>
        ) : (
          <div className="past-meet-content">
            {myMeets.length > 0 ? (
              myMeets.map((meet) => {
                if (
                  meet.meetDate === 'none' ||
                  meet.meetTime === 'none' ||
                  meet.meetType === 'instant'
                ) {
                  const date = new Date(meet.createdAt);
                  const year = date.getFullYear();
                  const month = String(date.getMonth() + 1).padStart(2, '0');
                  const day = String(date.getDate()).padStart(2, '0');
                  const hours = String(date.getHours()).padStart(2, '0');
                  const minutes = String(date.getMinutes()).padStart(2, '0');

                  return (
                    <div className="past-meet-card" key={meet._id}>
                      <div className="details-controls">
                        <div className="meet-card-details">
                          <p>
                            Meet: <span>{meet.roomName}</span>
                          </p>
                          <p>
                            Meet Id: <span>{meet._id}</span>
                            <button
                              className="copyBtn"
                              onClick={() =>
                                copyMeetIdToClipboard(meet._id)
                              }
                            >
                              Copy Meet ID
                            </button>
                          </p>
                        </div>
                        <div className="meet-card-timings">
                          <h4>Timings:</h4>
                          <div className="meet-card-timings-details">
                            <p>
                              Date: <span>{day}/{month}/{year}</span>
                            </p>
                            <p>
                              Created Time:{' '}
                              <span>
                                {hours}:{minutes}
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                } else if (
                  new Date() > new Date(meet.meetDate + 'T' + meet.meetTime)
                ) {
                  const date = new Date(meet.meetDate + 'T' + meet.meetTime);
                  const year = date.getFullYear();
                  const month = String(date.getMonth() + 1).padStart(2, '0');
                  const day = String(date.getDate()).padStart(2, '0');
                  const hours = String(date.getHours()).padStart(2, '0');
                  const minutes = String(date.getMinutes()).padStart(2, '0');

                  return (
                    <div className="past-meet-card" key={meet._id}>
                      <div className="details-controls">
                        <div className="meet-card-details">
                          <p>
                            Meet: <span>{meet.roomName}</span>
                          </p>
                          <p>
                            Meet Id: <span>{meet._id}</span>
                            <button
                              className="copyBtn"
                              onClick={() =>
                                copyMeetIdToClipboard(meet._id)
                              }
                            >
                              Copy Meet ID
                            </button>
                          </p>
                        </div>
                        <div className="meet-card-timings">
                          <h4>Timings:</h4>
                          <div className="meet-card-timings-details">
                            <p>
                              Date: <span>{day}/{month}/{year}</span>
                            </p>
                            <p>
                              Created Time:{' '}
                              <span>
                                {hours}:{minutes}
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              })
            ) : (
              <p>No past meets</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MeetData;
