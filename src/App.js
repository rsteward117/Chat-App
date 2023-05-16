import React, { useState, useRef } from 'react';
import './App.css';
import SignIn from './componets/signIn';
import Cookies from 'universal-cookie';
import ChatRoom from './componets/chatRoom';
import EnterRoom from './componets/enterRoom';
import SignOut from './componets/signOut';
import Register from './componets/register';

const cookies = new Cookies();
//you left of at 56:28 of the video
function App() {
  //this UseState is checking if the user is signed in or not. by searching the "auth-token" that was created in the signIn componet.
  const [isSignIn, setIsSignIn] = useState(cookies.get("auth-token"));
  const [room, setRoom] = useState(null);
  const [newUser, setNewUser] = useState(false);

  if(newUser == true){
    return(
      <Register setNewUser={setNewUser}/>
    )
  }

  if(!isSignIn){
    return (
      <>
        <SignIn setIsSignIn={setIsSignIn} setNewUser={setNewUser} />
      </>
    )
  }
  if(newUser == true){
    return(
      <Register />
    )
  }
  return(
    <>
      {room ?  <ChatRoom room={room}/> : <EnterRoom setRoom={setRoom} />}

      <SignOut setRoom={setRoom} setIsSignIn={setIsSignIn}/>
    </>

  )

}
  


export default App;
