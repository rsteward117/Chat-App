import React, { useEffect, useState } from 'react';
import {auth, dataBase} from '../firebase-config.js';
import { useAuthState } from "react-firebase-hooks/auth";
import {addDoc, collection, serverTimestamp, onSnapshot, query, where, orderBy} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL} from 'firebase/storage';
import "../styles/chatRoom.css";
import { LuSend } from 'react-icons/lu';
import { BsFillImageFill } from 'react-icons/bs';

//This is working mostly as inteneded, but there's an issue with how firebase displays the images. like the text and image database collections don't display correctly according to the times they were created. For right now I will come nack to fix this issuse later, so I can focus on other parts of the app I need to work on.

function ChatRoom({room, setRoom}) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [image, setImage] = useState(null);
  const [sendImage, setSendImage] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user] = useAuthState(auth);

  function exitChatRoom(){
    setRoom(null);
  }

  //this reference which collection in the firebase database where the user can send and store their data(messages) in. 
  const chatRoomMessagesRef = collection(dataBase, `ChatRooms/${room}/messages`);


  // firebase collection reference for your images.
  const imagesRef = collection(dataBase, "images");

  const uploadImageToStorage = async (imageFile, user, setLoading) =>{
    const storage = getStorage();
    const fileRef = ref(storage,   '/userImage' + user.uid);
    setLoading(true);
    await uploadBytes(fileRef, imageFile);
    const url = await getDownloadURL(fileRef);
    return url;
    setLoading(false);
  }

  const handleSubmitForm = async (e) =>{
    e.preventDefault();
    if(message === "") return;

    //this deconstucts the firebase auth.currentUser array
    const {uid, displayName, photoURL} = auth.currentUser;
    //this fulfills the promise to add a document to the "messages" collection with the currently logged in users message and profile info. 
    await addDoc(chatRoomMessagesRef, {
      text: message,
      createdAt: serverTimestamp(),
      user: displayName,
      userPic: photoURL,
      room,
      uid,
    });
    setMessage("")
  }


  const handleImageSubmit = async () =>{
    const userId = auth.currentUser.uid;
    const userImage = await uploadImageToStorage(image, userId, setLoading);

    //this deconstucts the firebase auth.currentUser array
    const {uid, displayName, photoURL} = auth.currentUser;
    //this fulfills the promise to add a document to the "messages" collection with the currently logged in users message and profile info. 
    await addDoc(imagesRef, {
      image: userImage,
      createdAt: serverTimestamp(),
      user: displayName,
      userPic: photoURL,
      room,
      uid,
    });
    setImage(null);
  }


  //this useEffect keeps track of which room the user is in
  useEffect(() => {
    const queryMessages = query(chatRoomMessagesRef, where("room", "==", room), orderBy("createdAt"));
    const unsuscribe = onSnapshot(queryMessages, (snapshot)=> {
      let messages = [];
      snapshot.forEach((doc) =>{
        messages.push({...doc.data(), id: doc.id});
      });
      setMessages(messages);
    });

    return () => unsuscribe();
  }, []);

  useEffect(() => {
    const queryImages = query(imagesRef, where("room", "==", room), orderBy("createdAt"));
    const unsuscribe = onSnapshot(queryImages, (snapshot)=>{
      let images = [];
      snapshot.forEach((doc) =>{
        images.push({...doc.data(), id: doc.id});
      });
      setSendImage(images);
    });

    return () => unsuscribe();
  }, []);

  return (
    <div className='chat-room-container'>
      <header className="header">
        <h1>{room}</h1>
        <button onClick={exitChatRoom} className="chatroom-header-btn">Exit {room}'s ChatRoom?</button>
      </header>
      <div className='messages-container'>
        {messages.map((message) =>(
          // is the "message-bubble" div it is checking to see if the message uid are the same, so it can use css to place it on the right side of there screen, and other users messages would be displayed on the left.
          <div className={`message-container ${message.uid === user.uid ? "current-user" : ""}`}>
            <div className='message-info' key={message.id}>
              <img className='user-Profile-pic' src={message.userPic} alt='user Profile Picture' />
              <div className='message-text-container'>
                <section className='message-header'>
                <h2 className='user-name'>{message.user}</h2>
                {/* I had to create a conditional render, because serverTimestamp would return null every time a new message was submitted, so I added a if statement to create a placeholder render until serverTimestamp is finshed being created */}
                {message.createdAt === null ?(
                  <p>no time</p>
                ):(
                  <p className='message-timestamp'>-{message.createdAt.toDate().toDateString()}</p>
                )}
                </section>
                <p className='user-message'>{message.text}</p>
              </div>
            </div>
          </div>
        ))}

        {sendImage.map((image) => (
          <div className={`message-container ${image.uid === user.uid ? "current-user" : ""}`}>
            <div className='message-info' key={image.id}>
              <img className='user-Profile-pic' src={image.userPic} alt='user Profile Picture' />
              <div className='message-text-container'>
                <section className='message-header'>
                <h2 className='user-name'>{image.user}</h2>
                {/* I had to create a conditional render, because serverTimestamp would return null every time a new message was submitted, so I added a if statement to create a placeholder render until serverTimestamp is finshed being created */}
                {image.createdAt === null ?(
                  <p>no time</p>
                ):(
                  <p className='message-timestamp'>-{image.createdAt.toDate().toDateString()}</p>
                )}
                </section>
                <img className='user-image' src={image.image} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmitForm} className='chat-room-form'>
        <label className='chat-room-image-btn' disabled={loading} onClick={handleImageSubmit} for='input-file'><BsFillImageFill className='chat-room-image-btn' /></label>
        <input type="file" className='chat-room-image-input' onChange={(e) =>{ console.log(e.target.files[0]); setImage(e.target.files[0])}} id='input-file'/>
        <input className='chat-room-input' placeholder='Type your message here' onChange={(e) => setMessage(e.target.value)} value={message}/>
        <button type="submit" className='chat-room-btn' > <LuSend /> </button>
      </form>

    </div>
  );
}





export default ChatRoom;