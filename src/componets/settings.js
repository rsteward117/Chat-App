import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link, Route, Routes } from "react-router-dom";
import { MdOutlineAccountCircle } from "react-icons/md";
import { BiCustomize } from "react-icons/bi";
import {collection, query, getDocs, where, onSnapshot, orderBy} from 'firebase/firestore';
import {auth, dataBase} from '../firebase-config.js';
import { onAuthStateChanged } from 'firebase/auth';
import '../styles/settings.css';



function Settings() {
  const navigate = useNavigate();

  const goToCustomizeProfile = () =>{
    navigate('/CustomizeProfile');
  }

  const goToCustomizeApp = () =>{
    navigate('/CustomizeApp');
  }

  return (
    <>
      <div className="settings-main-container">
        <header className='settings-header-container'>
          <h1 className='settings-header'>
            settings
          </h1>
        </header>
        <div className='setting-container'>
          <section className='settings-section'>
            <h2>Account Settings</h2>
            <button className='settings-btn' onClick={goToCustomizeProfile}><MdOutlineAccountCircle className='settings-btn-img'/>Account</button>
          </section>
          <section className='settings-section'>
            <h2>App settings</h2>
            <button className='settings-btn' onClick={goToCustomizeApp}><BiCustomize className='settings-btn-img'/>App Appearance</button>
          </section>

        </div>
      </div>
    </>
  );
}

export default Settings;