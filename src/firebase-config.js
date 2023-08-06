// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth, GoogleAuthProvider, createUserWithEmailAndPassword, FacebookAuthProvider, TwitterAuthProvider, GithubAuthProvider} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCtiHPj2f0IB389CHZSkc0cAOCBkYf7RFw",
  authDomain: "my-chat-app-5b0ae.firebaseapp.com",
  projectId: "my-chat-app-5b0ae",
  storageBucket: "my-chat-app-5b0ae.appspot.com",
  messagingSenderId: "837847743265",
  appId: "1:837847743265:web:cc6c4987efbf7fe47b5c60",
  measurementId: "G-CXEMWS349E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();
export const twitterProvider = new TwitterAuthProvider();
export const githubProvider = new GithubAuthProvider();
export const dataBase = getFirestore(app)
