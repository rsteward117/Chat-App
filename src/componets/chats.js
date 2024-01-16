import React, { useState, useRef, useEffect } from 'react';
import {collection, query, getDocs, where, onSnapshot, orderBy} from 'firebase/firestore';
import {auth, dataBase} from '../firebase-config.js';
import { onAuthStateChanged } from 'firebase/auth';
import '../styles/chats.css'



function Chats({setRoom}) {
  const [chatRoomData, setChatRoomData] = useState([]);

  const currentChatroom = useRef(null);
  
  //the function that suppose to get the current value of the clicked mapped element.
  const getChatroom = (e) =>{
    console.log(currentChatroom.current);
    //this is a proped useState i'm trying to set the name of the clicked chat room name to. 
    setRoom(currentChatroom.current);
  }

  //this useffect get the data from firebase, based on if the user has visted them.
  useEffect(() =>{
    onAuthStateChanged(auth, currentUser => {
      const chatRoomCollectionRef = collection(dataBase, 'ChatRooms');

      const unSubscribe = onSnapshot(chatRoomCollectionRef, (snapshot) => {
        const chatRooms = [];
        snapshot.forEach((doc) => {
          const messagesSubcollectionRef = collection(doc.ref, 'messages');
          const queryMessages = query(messagesSubcollectionRef, where("uid", "==", currentUser.uid));

          onSnapshot(queryMessages, (messagesSnapshot) => {
            messagesSnapshot.forEach((messagesDoc) =>{
              chatRooms.push({ chatRoom: messagesDoc.data().room, text: messagesDoc.data().text, timeStamp: messagesDoc.data().createdAt, id: messagesDoc.id });
            })
            setChatRoomData(chatRooms);
          })
        });
      })
      return () => unSubscribe();
    })
  }, []);

  return (
    <>
        <div className="chats-container">
          <header className='chats-header-container'> 
            <h1 className="chats-header">Your Previous Chat Rooms</h1>
            <h2 className='chats-subheader'>Hop right back in!</h2>
          </header>
          {/* the mapped data from firebase rendered on the page */}
          {chatRoomData.map((data) =>(
            <div className='users-chatRooms-container' key={data.id}>
              <div className='users-chatRooms-card'>
                {/* the mapped from the firebase array I'm trying to get the chatroom name from */}
                <button className='users-chatRoom-names-btn'><h2 className='users-chatRoom-names' ref={currentChatroom} onClick={getChatroom}>{data.chatRoom}</h2></button>
                <p className='users-chatRoom-latest-text'>{data.text}</p>
                {data.timeStamp === null ?(
                  <p>no time</p>
                ):(
                  <p className='message-timestamp'>-{data.timeStamp.toDate().toDateString()}</p>
                )}
              </div>
            </div>
          ))}
        </div>
    </>
  );
}

export default Chats;