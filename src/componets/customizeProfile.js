import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import {auth, dataBase, facebookProvider} from '../firebase-config.js';
import { onAuthStateChanged, updateProfile } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL} from 'firebase/storage';
import PulseLoader from "react-spinners/PulseLoader";
import { MdArrowBack } from 'react-icons/md';
import "../styles/customizeProfile.css"
import CustomizeProfileImageCard from './customizeProfileImageCard.js';

function CustomizeProfile() {
  const [firebaseUserInfo, setFirebaseUserInfo] = useState(auth.currentUser);
  const [loaderColor, setLoaderColor] = useState("#6495ED");
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const [photoURL, setPhotoURL] = useState();
  const navigate = useNavigate();

  
  const backToSettings = () =>{
    navigate('/settings');
  }

  const uploadImageToStorage = async (imageFile, user, setLoading) =>{
    const storage = getStorage();
    const fileRef = ref(storage, user.uid + '/profilesPics')
    setLoading(true);
    await uploadBytes(fileRef, imageFile);
    const url = await getDownloadURL(fileRef);
    return url;
    setLoading(false);
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
      const userId = firebaseUserInfo.uid;
      const photoURL = await uploadImageToStorage(profilePic, userId, setLoading);
      await updateProfile(auth.currentUser, {
        photoURL
      });
    } catch(e) {
      console.log(e);
    }
  }

  useEffect(() => {
      onAuthStateChanged(auth, setFirebaseUserInfo)
    }, []);

  useEffect(() => {
    if(firebaseUserInfo?.photoURL){
      setPhotoURL(firebaseUserInfo.photoURL);
    }
  }, [firebaseUserInfo]);

  return (
    <>
      <div className='customize-profile-container'>
      <header className='customize-profile-header'>
        <section className='customize-profile-header-section1'>
          <MdArrowBack className='back-to-settings-btn' onClick={backToSettings} />
        </section>
        <section className='customize-profile-header-section2'>
          <h1 className='customize-profile-header-name'>Account Settings</h1>
        </section>
        <section className='customize-profile-header-section3'>
          <img className='customize-profile-user-image' src={firebaseUserInfo?.photoURL || <PulseLoader color={loaderColor}/>} />
          <p className='customize-profile-user-name'>{firebaseUserInfo?.displayName || <PulseLoader color={loaderColor}/>} </p>
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
            <label className='change-img-btn' disabled={loading} onClick={updateProfilePic} for='input-file'>Upload image</label>
            <input type='file' name="myImage" onChange={(e) =>{ console.log(e.target.files[0]); setProfilePic(e.target.files[0])}}  id='input-file' />
          </div>
        </section>
      </div>

      </div>

    </>
  );
}

export default CustomizeProfile;