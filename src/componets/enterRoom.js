import React, { useState, useRef, useEffect } from 'react';
import {setDoc, collection, serverTimestamp, onSnapshot, query, where, orderBy, doc} from 'firebase/firestore';
import {auth, dataBase} from '../firebase-config.js';
import { useAuthState } from "react-firebase-hooks/auth";
import '../styles/enterRoom.css';


function EnterRoom({setRoom}) {

  const roomInputRef = useRef(null);
  const [user] = useAuthState(auth);

  const chatRoomRef = collection(dataBase, "ChatRooms");

  const enterChatRoom = async (e) => {
    e.preventDefault();
  
    const chatRoomRef = doc(dataBase, "ChatRooms", roomInputRef.current.value);
    const {uid} = auth.currentUser;
    await setDoc(chatRoomRef,{
      chatRoom: roomInputRef.current.value,
      uid,
    });
    setRoom(roomInputRef.current.value);
  }


  return (
    <>
      <div className='enter-room-container'>
        <form className='enter-room-form' onSubmit={enterChatRoom}>
          <h1 className='enter-room-label'>Enter Chat Room Name</h1>
          <input className='enter-room-input' ref={roomInputRef}/>
          <button type='submit' className='enter-room-btn' >Enter Chat Room</button>
        </form>
      </div>
    </>
  );
}

export default EnterRoom;