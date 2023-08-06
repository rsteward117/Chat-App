import React, { useState, useRef } from 'react';
import '../styles/enterRoom.css'

function EnterRoom({setRoom}) {

    const ChangeRoom = () => {
        setRoom(roomInputRef.current.value);
    }

    const roomInputRef = useRef(null);
  return (
    <>
        <div className='enter-room-container'>
          <form className='enter-room-form' onSubmit={ChangeRoom}>
            <h1 className='enter-room-label'>Enter Chat Room Name</h1>
            <input className='enter-room-input' ref={roomInputRef}/>
            <button type='submit' className='enter-room-btn' >Enter Chat Room</button>
          </form>
        </div>
    </>
  );
}

export default EnterRoom;