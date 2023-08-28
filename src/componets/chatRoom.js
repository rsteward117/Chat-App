import React, { useEffect, useState } from 'react';
import {auth, dataBase} from '../firebase-config.js';
import { useAuthState } from "react-firebase-hooks/auth";
import {addDoc, collection, serverTimestamp, onSnapshot, query, where, orderBy} from 'firebase/firestore';
import "../styles/chatRoom.css"


function ChatRoom({room}) {
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([])
  const [user] = useAuthState(auth);

  //this reference which collection in the firebase database where the user can send and store their data(messages) in. 
  const messagesRef = collection(dataBase, "messages");

  const handleSubmitForm = async (e) =>{
    e.preventDefault();
    if(message === "") return;
    
    //this deconstucts the firebase auth.currentUser array
    const {uid, displayName, photoURL} = auth.currentUser;
    //this fulfills the promise to add a document to the "messages" collection with the currently logged in users message and profile info. 
    await addDoc(messagesRef, {
      text: message,
      createdAt: serverTimestamp(),
      user: displayName,
      userPic: photoURL,
      room,
      uid,
    });
    setMessage("")
  }


  //this useEffect keeps track of which room the user is in
  useEffect(() => {
    const queryMessages = query(messagesRef, where("room", "==", room), orderBy("createdAt"));
    const unsuscribe = onSnapshot(queryMessages, (snapshot)=> {
      let messages = [];
      snapshot.forEach((doc) =>{
        messages.push({...doc.data(), id: doc.id});
      });
      setMessages(messages);
    });

    return () => unsuscribe();
  }, []);

  return (
    <div className='chat-room-container'>
      <header className="header">
        <h1>{room}</h1>
      </header>
      <div className='messages-container'>
        {messages.map((message) =>(
          // is the "message-bubble" div it is checking to see if the message uid are the same, so it can use css to place it on the right side of there screen, and other users messages would be displayed on the left.
          <div className={`message-container ${message.uid === user.uid ? "current-user" : ""}`}>
            <div className='message-info' key={message.id}>
              <img className='user-image' src={message.userPic} alt='user image' />
              <div className='message-text-container'>
                <h2 className='user-name'>{message.user}</h2>
                <p className='user-message'>{message.text}</p>
                {/* I had to create a conditional render, because serverTimestamp would return null every time a new message was submitted, so I added a if statement to create a placeholder render until serverTimestamp is finshed being created */}
                {message.createdAt === null ?(
                  <p>no time</p>
                ):(
                  <p className='message-timestamp'>-{message.createdAt.toDate().toDateString()}</p> 
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmitForm} className='chat-room-form'>
        <input className='chat-room-input' placeholder='Type your messages here' onChange={(e) => setMessage(e.target.value)} value={message}/>
        <button type="submit" className='chat-room-btn' >Send Message</button>
      </form>

    </div>
  );
}





export default ChatRoom;