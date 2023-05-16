import React, { useState, useRef } from 'react';

function EnterRoom({setRoom}) {

    const ChangeRoom = () => {
        setRoom(roomInputRef.current.value);
    }

    const roomInputRef = useRef(null);
  return (
    <>
        <div className='enter-room-container'>
            <label>Enter Chat Room Name</label>
            <input ref={roomInputRef}/>
            <button onClick={ChangeRoom}>Enter Chat Room</button>
        </div>
    </>
  );
}

export default EnterRoom;