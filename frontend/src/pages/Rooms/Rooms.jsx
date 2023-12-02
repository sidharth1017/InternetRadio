import React, { useState, useEffect } from 'react';
import styles from './Rooms.module.css';
import RoomCard from '../../components/RoomCard/RoomCard';
import AddRoomModal from '../../components/AddRoomModal/AddRoomModal';
import { getAllRooms } from '../../http';

const Rooms = () => {
  const [showModal, setshowModal] = useState(false);
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const fetchRooms = async () => {
      const {data} = await getAllRooms();
      setRooms(data);
    };
    fetchRooms();
  }, [])
  

  function openModal() {
    setshowModal(true);
  }

  return (
    <>
      <div className='container'>

        <div className={styles.roomsHeader}>
          <div className={styles.left}>
            <span className={styles.heading}>All voice rooms</span>
            <div className={styles.searchBox}>
              <img src="/images/search_icon.png" alt="search" />
              <input type="text" className={styles.searchInput} />
            </div>
          </div>
          <div className={styles.right}>
            <button onClick={openModal} className={styles.startRoomBtn}>
              <img src="/images/start_room.png" alt="add-room" />
              <span>Start a room</span>
            </button>
          </div>
        </div>

        <div className={styles.roomList}> 
          {            
            rooms.map(room => (
              <RoomCard key={room.id} room={room} /> 
            ))
          }
        </div>

      </div>
      {showModal &&  <AddRoomModal onClose={() => setshowModal(false)}/>}
    </>
  )
}

export default Rooms