import React, { useState, useRef } from 'react';
import './App.css';
import { elastic  as Menu } from 'react-burger-menu';
import SignIn from './componets/signIn';
import Cookies from 'universal-cookie';
import ChatRoom from './componets/chatRoom';
import EnterRoom from './componets/enterRoom';
import SignOut from './componets/signOut';
import Register from './componets/register';
import ResetPassword from './componets/resetPassword';
import Sidebar from './componets/sideBar';


const cookies = new Cookies();
//you left of at 56:28 of the video
function App() {
  //this UseState is checking if the user is signed in or not. by searching the "auth-token" that was created in the signIn componet.
  const [isSignIn, setIsSignIn] = useState(cookies.get("auth-token"));
  const [room, setRoom] = useState(null);
  const [newUser, setNewUser] = useState(false);
  const [passwordReset, setPasswordReset] = useState(false);


  if(newUser){
    return(
      <Register setNewUser={setNewUser} />
    )
  }

  if(passwordReset){
    return(
      <ResetPassword setPasswordReset={setPasswordReset} />
    )
  }


  if(!isSignIn){
    return (
      <>
        <SignIn setIsSignIn={setIsSignIn} setNewUser={setNewUser} setPasswordReset={setPasswordReset} />
      </>
    )
  }



  return(
    <>
      {room ?  <ChatRoom room={room}/> : <EnterRoom setRoom={setRoom} />}
      <Menu>
        <SignOut setRoom={setRoom} setIsSignIn={setIsSignIn} />
        <Sidebar />
      </Menu>
    </>

  )

}
  


export default App;
