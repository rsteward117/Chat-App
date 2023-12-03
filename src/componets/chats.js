import React, { useState, useRef } from 'react';
import {doc, getDoc} from 'firebase/firestore';
import {auth, dataBase} from '../firebase-config.js';
import '../styles/chats.css'



function Chats() {
  const [firebaseDoc, setFirebaseDoc] = useState();
//find a way to access the "messages" collection to get access to the room document.
  const getDocument = async () => {
  const docRef = doc(dataBase, "messages", "k21jzBORYMzD6YcTUG6c");
  const docSnap = await getDoc(docRef);
  setFirebaseDoc(docSnap.data())

  console.log(docSnap.data());
}

  return (
    <>
        <div className="chats-container">
            <button onClick={getDocument}>get firebase collection documents</button>
            <div>
              
            </div>
        </div>
    </>
  );
}

export default Chats;