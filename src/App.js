import React, { useState, useRef } from 'react';
import './App.css';
import SignIn from './componets/signIn';
import Cookies from 'universal-cookie';
import ChatRoom from './componets/chatRoom';
import EnterRoom from './componets/enterRoom';

const cookies = new Cookies();
//you left of at 25:39 of the video
function App() {
  //this UseState is checking if the user is signed in or not. by searching the "auth-token" that was created in the signIn componet.
  const [isSignIn, setIsSignIn] = useState(cookies.get("auth-token"));
  const {room, setRoom} = useState(null);

  if(!isSignIn){
    return (
      <>
        <SignIn />
      </>
    )
  }
  return <div> {room ?  <ChatRoom /> : <EnterRoom setRoom={setRoom} />} </div>

}
  


export default App;
