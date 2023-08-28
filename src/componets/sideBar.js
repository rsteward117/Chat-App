import React, { useEffect, useState } from 'react';
import {auth, dataBase} from '../firebase-config.js';
import "../styles/sidebar.css"
// make a side bar close to discord's there are youtube videos on how to make 1, but you'll need to learn tailwind css
function Sidebar() {
    const [firebaseUserInfo, setFirebaseUserInfo] = useState(auth.currentUser);
    const firebaseUser = auth.currentUser;
  return (
    <div className='sidebar-container'>
        <header>
          {firebaseUserInfo === null ?(
                 <p>getting data</p>
                ):(
                  <p className=''>{firebaseUserInfo.displayName}</p> 
                )}
        </header>
    </div>
  );
}

export default Sidebar;