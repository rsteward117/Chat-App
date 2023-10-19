import React, { Children, createContext, useContext, useEffect, useState } from 'react';
import {auth, dataBase} from '../firebase-config.js';
import { MdArrowBack } from 'react-icons/md';
import { MdArrowForward } from 'react-icons/md';
import PulseLoader from "react-spinners/PulseLoader";
import "../styles/sidebar.css"
import { onAuthStateChanged } from 'firebase/auth';
import { signOut } from "firebase/auth";
import Cookies from 'universal-cookie';

const cookies = new Cookies();

 const SidebarContext = createContext();

function Sidebar({setIsSignIn, setRoom, children}) {
    const [firebaseUserInfo, setFirebaseUserInfo] = useState(auth.currentUser);
    const [loaderColor, setLoaderColor] = useState("#6495ED");
    const [expanded, setExpanded] = useState(true)
    
    //this use effect keeps track of, if the current firebase user is still authorized
    useEffect(() => onAuthStateChanged(auth, setFirebaseUserInfo), []);

    const signUserOut = async () =>{
      await signOut(auth)
      cookies.remove("auth-token")
      setIsSignIn(false)
      setRoom(null)
    };

  return (
    <aside className={` h-screen transition-all  ${expanded ? "w-2/12" : "w-20"}`}>
      <nav className="h-full flex flex-col bg-gray-600 border-r shadow-sm">
        <div className="p-1.5 flex justify-between items-center">
          <img src="http://img.logoipsum.com/243.svg" className={`overflow-hidden transition-all ${expanded ? "w-32" : "w-0"}`} alt='chat app logo'/>
          <button onClick={() => setExpanded(current => !current)} className={`overflow-hidden transition-all bg-gray-100 hover:bg-gray-300 ${expanded ? "p-2 rounded-lg " : "p-2.5 mr-5 rounded-lg" }`}>
            {expanded ?  <MdArrowBack />: <MdArrowForward />}
          </button>
        </div>
        <SidebarContext.Provider value={{ expanded }}>
          <ul className="flex-1 px-3"> {children} </ul>
        </SidebarContext.Provider>
        <div className="border-t flex p-3">
          <img className={`rounded-full transition-all ${expanded ? "w-15 h-10" : "w-20 h-15"}`} src={firebaseUserInfo?.photoURL || <PulseLoader color={loaderColor} />} />
          <div className={`flex justify-between items-center 
            overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}
          `}>
            <div className='leading-4'>
              <h2 className="font-bold text-white">{ firebaseUserInfo?.displayName || <PulseLoader color={loaderColor} />}</h2>
              <span className="text-xs font-semibold text-white">{firebaseUserInfo?.email || <PulseLoader color={loaderColor} />}</span>
            </div>
          </div>
        </div>
        <button className="mt-1.3 font-semibold text-xs p-2 rounded-md bg-gray-100 hover:bg-gray-300" onClick={signUserOut}>SIGN OUT</button>
      </nav>
    </aside>
  );
}


//you left off at 4:11 on the video

 export function SideBarItem({icon, text, active, alert}){
    const { expanded } = useContext(SidebarContext)

    return(
      <li className={`relative flex items-center py-2 px-3 my-1 
      font-medium rounded-md cursor-pointer
      transition-colors group
      ${
        active
         ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800"
         : "hover:bg-cyan-500 text-gray-600"
      }`}>
        <div className="text-white">{icon}</div>
        <span className={`overflow-hidden transition-all text-white ${expanded ? "w-52 ml-3" : "w-0"}`}>{text}</span>
        {alert && (<div className={`absolute right-2 w-2 h-2 rounded bg-cyan-800 ${expanded ? "" : "top-2"}`} />)}

        {!expanded && <div className={`
          absolute left-full rounded-md px-2 py-1 ml-6
          bg-cyan-500 text-white text-sm
          invisible opacity-20 -translate-x-3 transition-all
          group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
        `}>{text}</div>}
      </li>
    )
  }

export default Sidebar;