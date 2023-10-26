import React, { useState, useRef, useEffect } from 'react';
import {auth, dataBase} from '../firebase-config.js';
import { onAuthStateChanged, updateProfile } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL} from 'firebase/storage'
import PulseLoader from "react-spinners/PulseLoader";
import "../styles/customizeProfile.css"

function CustomizeProfile() {
  const [firebaseUserInfo, setFirebaseUserInfo] = useState(auth.currentUser);
  const [loaderColor, setLoaderColor] = useState("#6495ED");
  const [displayName, setDisplayName] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  
  const uploadImageToStorage = async (imageFile, userId) =>{
    const storage = getStorage();
    const storageRef = ref(storage, 'profilePics/' + userId);

    await uploadBytes(storageRef, imageFile);

    const url = await getDownloadURL(storageRef);

    return url;
  }

  const UpdateDisplayName = async () =>{
    await updateProfile(auth.currentUser, {
      displayName: displayName
    }).then(() =>{
      window.location.reload();
    }).catch((err) => {
      console.log(err)
    })
  }

  const updateProfilePic = async () => {
    try {
      const userId = auth.currentUser.uid;
      const photoURL = await uploadImageToStorage(profilePic, userId);

      await updateProfile(auth.currentUser, {
        photoURL
      });
    } catch(e){
      console.log(e);
    }
  }



  useEffect(() => onAuthStateChanged(auth, setFirebaseUserInfo), []);

  return (
    <>
      <div className='customize-profile-container'>
      <header className='customize-profile-header'>
        <img className='customize-profile-user-image' src={firebaseUserInfo?.photoURL || <PulseLoader color={loaderColor}/>} />
        <section className='customize-profile-user-info' >
          <h2 className='customize-profile-user-name'>{firebaseUserInfo?.displayName || <PulseLoader color={loaderColor}/>} </h2>
          <p className='customize-profile-user-email'>{firebaseUserInfo?.email || <PulseLoader color={loaderColor}/>} </p>
        </section>
      </header>
      <div className='customization-container'>
        <section className="customize-profile">
          <form onSubmit={UpdateDisplayName} className='customize-profile-text-container'>
            <input className='change-displayName' placeholder='Enter Your New Name?' value={displayName} onChange={(e) => setDisplayName(e.target.value)}/><span><button type='submit' className='change-displayName-btn'>Change Display Name</button></span>
          </form>
          <div className='image-Card'>
            <img className='change-img' src={firebaseUserInfo?.photoURL || <PulseLoader color={loaderColor}/>} />
            <label className='change-img-btn' onClick={updateProfilePic} for='input-file'>Upload image</label>
            <input type='file' name="myImage" onChange={(e) =>{ setProfilePic(e.target.files[0]) }} id='input-file' />
          </div>
        </section>
      </div>

      </div>

    </>
  );
}

export default CustomizeProfile;