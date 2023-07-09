import React, { useEffect, useState } from 'react';
import {auth, dataBase} from '../firebase-config.js';
import {addDoc, collection, serverTimestamp, onSnapshot, query, where} from 'firebase/firestore'

function ChatRoom({room}) {
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([])

  //this reference wwhich collection in the firebase database where the user can send and store their data(messages) in. 
  const messagesRef = collection(dataBase, "messages");
  useEffect(() => {
    const queryMessages = query(messagesRef, where("room", "==", room))
    const unsuscribe = onSnapshot(queryMessages, (snapshot)=> {
      let messages = [];
      snapshot.forEach((doc) =>{
        messages.push({...doc.data(), id: doc.id});
      });
      setMessages(messages);
    });

    return () => unsuscribe();
  }, []);
  const handleSubmitForm = async (e) =>{
    e.preventDefault();
    if(message === "") return;

    //this fulfills the promise to add a document to the "messages" collection with the currently logged in users message and profile info. 
    await addDoc(messagesRef, {
      text: message,
      createdAt: serverTimestamp(),
      user: auth.currentUser.displayName,
      userPic: auth.currentUser.photoURL,
      room,
    });

    setMessage("")
  }
  return (
    <div className='chat-app-container'>
      <header className="header">
        <h1>Welcome to: {room}</h1>
      </header>
      <div className='messages-container'>
        {messages.map((message) =>(
          <div className='message-info' key={message.id}>
            <span className='user'>{message.user}</span>
            {message.text}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmitForm} className='chat-app-form'>
        <input className='chat-app-input' placeholder='Type your messages here' onChange={(e) => setMessage(e.target.value)} value={message}/>
        <button type="submit" className='chat-app-btn' >Send Message</button>
      </form>

    </div>
  );
}





export default ChatRoom;