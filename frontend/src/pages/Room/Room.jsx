import React, { useState, useEffect } from "react";
import { useWebRTC } from "../../hooks/useWebRTC";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import styles from "./Room.module.css";
import { getRoom, deleteRoom } from "../../http";
import WaveAnimation from "../../components/shared/WaveAnimation/WaveAnimation";

const Room = () => {
  const { id: roomId } = useParams();
  const user = useSelector((state) => state.auth.user);
  const { clients, provideRef, handleMute } = useWebRTC(roomId, user);
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [isMute, setMute] = useState(true);
  const [isWave, setWave] = useState(false);


  const handleEndRoomClick = async () => {
    try {
      await deleteRoom(roomId);
      navigate("/rooms"); 
    } catch (error) {
      console.error("Error ending the room:", error);
    }
  };

  const handleManualLeave = () => {
    navigate("/rooms");
  };

  useEffect(() => {
    handleMute(isMute, user._id);
  }, [isMute]);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const { data } = await getRoom(roomId);
        setRoom((prev) => data);
      } catch (error) {
        navigate("/rooms"); 
      }
    };
    fetchRoom();
  }, [roomId]);

  const handleMuteClick = (clientId) => {
    if (clientId !== user._id) return;
    setMute((isMute) => !isMute);
  };

  const wave = () => {
    setWave(true);
    setTimeout(() => {
      setWave(false);
    }, 1000);
  };

  return (
    <div>
      <div className="container">
      {isWave && (
        <WaveAnimation />
      )}
        <button onClick={handleManualLeave} className={styles.goBack}>
          <img src="/images/Left_arrow.png" alt="arrow-left" />
          <span>All voice rooms</span>
        </button>
      </div>
      <div className={styles.clientsWrap}>
        <div className={styles.header}>
          <h2 className={styles.topic}>{room?.topic}</h2>
          <div className={styles.actions}>
            <button className={styles.actionBtn} onClick={wave}>
              <img src="/images/Left_hand.png" alt="palm-icon" />
            </button>
            <button onClick={handleManualLeave} className={styles.actionBtn}>
              <img src="/images/peace_sign.png" alt="win-icon" />
              <span>Leave quietly</span>
            </button>
            {user._id === room?.ownerId && (
              <button onClick={handleEndRoomClick} className={`${styles.actionBtn} ${styles.End}`}>The end</button>
            )}
          </div>
        </div>
        <div className={styles.clientsList}>
          {clients.map((client) => {
            return (
              <div key={client._id} className={styles.client}>
                <div className={styles.userHead}>
                  <audio
                    ref={(instance) => provideRef(instance, client.id)}
                    autoPlay
                  ></audio>
                  <img
                    className={styles.userAvatar}
                    src={client.avatar}
                    alt="avatar"
                  />
                  <button
                    onClick={() => handleMuteClick(client._id)}
                    className={styles.micBtn}
                  >
                    {client.muted ? (
                      <img src="/images/mic-mute.png" alt="mic-mute-icon" />
                    ) : (
                      <img src="/images/mic.png" alt="mic-mute-icon" />
                    )}
                  </button>
                </div>
                <h4>{client.name}</h4>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Room;
