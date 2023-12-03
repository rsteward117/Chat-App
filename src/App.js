import React, { useState, useRef } from 'react';
import { Link, Route, Routes } from "react-router-dom";
import './App.css';
import SignIn from './componets/signIn';
import Cookies from 'universal-cookie';
import ChatRoom from './componets/chatRoom';
import EnterRoom from './componets/enterRoom';
import Register from './componets/register';
import ResetPassword from './componets/resetPassword';
import Sidebar, { SideBarItem } from './componets/sideBar';
import CustomizeProfile from './componets/customizeProfile';
import Chats from './componets/chats';
import { MdDashboardCustomize } from 'react-icons/md';
import { MdOutlineChat } from 'react-icons/md';
import { FaHome } from 'react-icons/fa';
import { MdSettings } from 'react-icons/md';



const cookies = new Cookies();
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


// work on adding react routes for the sidebar links
  return(
    <>
      <Sidebar setRoom={setRoom} setIsSignIn={setIsSignIn}>
          <Link to="/">
            <SideBarItem icon={<FaHome  size={20}/>} text="Home"/>
          </Link>
          <Link to="/CustomizeProfile">
            <SideBarItem icon={<MdDashboardCustomize  size={20}/>} text="Customize Profile"/>
          </Link>
          <Link to="/chats">
            <SideBarItem icon={<MdOutlineChat  size={20}/>} text="Chats"/>
          </Link>

          <SideBarItem icon={<MdSettings  size={20}/>} text="Settings"/>
      </Sidebar>
      <Routes>
        <Route path='/' element={room ?  <ChatRoom room={room} setRoom={setRoom}/> : <EnterRoom setRoom={setRoom} />} />
        <Route path='/CustomizeProfile' element={<CustomizeProfile />} />
        <Route path='/Chats' element={<Chats />}/>
      </Routes>

    </>

  )

}
  


export default App;
