import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Slider from 'react-slider';
import {auth, dataBase, facebookProvider} from '../firebase-config.js';
import { onAuthStateChanged, updateProfile } from 'firebase/auth';
import { MdArrowBack } from 'react-icons/md';
import { CiSun } from "react-icons/ci";
import { CiCloudMoon } from "react-icons/ci";
import "../styles/customizeApp.css"

function CustomizeApp() {
  const [fontSize, setFontSize] = useState(0);
  const navigate = useNavigate();

  
  const backToSettings = () =>{
    navigate('/settings');
  }

  const setDarkMode = () =>{
    document.querySelector("body").setAttribute("data-theme", "dark");
    localStorage.setItem("selectedTheme", "dark")
  }
  const setLightMode = () =>{
    document.querySelector("body").setAttribute("data-theme", "light");
    localStorage.setItem("selectedTheme", "light")
  }

  const selectedTheme = localStorage.getItem("selectedTheme");

  if(selectedTheme === "dark"){
    setDarkMode();
  }
  else if(selectedTheme === "light"){
    setLightMode();
  }

  const toggleTheme = (e) =>{
    if(e.target.checked) setDarkMode();
      else setLightMode();
  }

  const handleSizeChange = (sizeValue){
    setFontSize(sizeValue);
  }
  return (
    <>
      <div className='customize-app-container'>
        <header className='customize-app-header'>
          <section className='customize-app-header-section1'>
            <MdArrowBack className='back-to-settings-btn' onClick={backToSettings}/>
          </section>
          <section className='customize-app-header-section2'>
            <h1 className='customize-app-header-name'>App Settings</h1>
          </section>
        </header>
        <div className='customize-app'>
          <section className='customize-section'>
            <input 
              className='dark-mode-input'
              type='checkbox'
              id='darkmode-toggle'
              onChange={toggleTheme}
              defaultChecked={selectedTheme === "selectedTheme"}
            />
            <label className='dark-mode-label' for='darkmode-toggle'>
              <CiCloudMoon className='dark-mode-img moon'/>
              <CiSun className='dark-mode-img sun' />
            </label>
          </section>
          <section className='customize-section'>
            <Slider 
            min={1}
            max={50}
            step={1}
            value={fontSize}
            onChange={handleSizeChange}
            />
          </section>
          <section className='customize-section'></section>
        </div>
      </div>

    </>
  );
}

export default CustomizeApp;