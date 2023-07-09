import React, {useState, useEffect} from 'react';
import {auth, googleProvider, facebookProvider} from '../firebase-config.js';
import {signInWithPopup, signInWithEmailAndPassword} from 'firebase/auth';
import Cookies from 'universal-cookie';
import '../styles/signIn.css'

const cookies = new Cookies();
//figure out a way for the user to login using their email/password through firebase.
function SignIn({setIsSignIn, setNewUser, setPasswordReset}) {

  const signInFormValues = {email:"", password:""};
  const [formValues, setFormValues] = useState(signInFormValues);
  const [loginFormErrors, setLoginFormErrors] = useState({});
  const [firebaseError, setFirebaseError] = useState();
  const [isSubmitted, setIsSubmitted] = useState(false);


  const displayRegisterComponet = () => {
    setNewUser(true)
  }

  const displayResetPasswordComponet = () => {
    setPasswordReset(true)
  }

  const handleOnChangeFormInput = (e) => {
    //this deconstruct the targeted input field by it's name and value
    const {name, value} = e.target;
    setFormValues({...formValues, [name]: value})
  }

  const submitLoginForm = (e) => {
      e.preventDefault();
      setLoginFormErrors(validateLoginForm(formValues))
      setIsSubmitted(true)
  }

  const validateLoginForm = (values) => {
    const errors = {};
    const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

    if(values.email == ""){
      errors.email = "Your Email Is Required!"
    }else if(!regex.test(values.email)){
      errors.email = "This is not a vaild email address!"
    }

    if(values.password == ""){
      errors.password = "A Password Is Required!"
    }else if(values.password.length <= 4){
      errors.password = "Password has to be greater than 4 characters!"
    }else if(values.password.length >= 26){
      errors.password = "Password cannot go over 25 characters!"
    }

    return errors;
  }

  useEffect(() =>{
    if(Object.keys(loginFormErrors).length === 0 && isSubmitted){
      signInWithEmailPassword();
    }
  },[loginFormErrors]);


  //left off at 4:48 on the facebook auth video
  
  //email/password firebase login.
  const signInWithEmailPassword = async () => {
    try{
      const result = await signInWithEmailAndPassword(auth, formValues.email, formValues.password)
      cookies.set("auth-token", result.user.refreshToken);
      console.log(result);
      setIsSignIn(true);
    }catch (err){
      //these if statements are checking the error codes that firebase returns, and creating a error message based on the firebase error code.
      if(err.code === "auth/wrong-password"){
        setFirebaseError("The password you entered is incorrect!")
      }
      
      if(err.code === "auth/user-not-found"){
        setFirebaseError("The email you entered isn't registered!")
      }

      if(err.code === "auth/too-many-requests"){
        setFirebaseError("Too many failed attempts! this account is temporally locked. You can reset your password to regain access, or try again later.")
      }
    }
  }

    //google firebase login
  const signInWithGoogle = async () => {
    try{
      const result = await signInWithPopup(auth, googleProvider);
      //this sets a refresh token from firebase within cookie to the app so the user doesn't have to keep loging inwith google
      console.log(result);
      cookies.set("auth-token", result.user.refreshToken);
      setIsSignIn(true);
      }
    catch (err){
      console.error(err);
    }           
  }
  //facebook firebase login
  const signInWithFacebook = async () => {
    try{
      const result = await signInWithPopup(auth, facebookProvider);
      //this sets a refresh token from firebase within cookie to the app so the user doesn't have to keep loging inwith google
      cookies.set("auth-token", result.user.refreshToken);
      setIsSignIn(true);
      }
    catch (err){
      console.error(err);
    }           
  }

  return (
    <>
        <div className='sign-in-container'>
          <header className='sign-in-header'>
            <h1>Welcome Back </h1>
            <h2>They're waiting for you inside!</h2>
          </header>
          <div className="sign-in-methods-container">
            <section className='email-sign-in-container'>
              <header className='sign-in-method-header'>
                <h2>Sign in with a registered account!</h2>
              </header>
              <form className='sign-in-form' onSubmit={submitLoginForm}>
                <span className='error'>{loginFormErrors.email}</span>
                <input className='form-input' name="email" placeholder='Enter Your Email Address' value={formValues.email} onChange={handleOnChangeFormInput}/>
                <span className='error'>{loginFormErrors.password}</span>
                <input className='form-input' name="password" type='password' placeholder='Enter Your Password' value={formValues.password} onChange={handleOnChangeFormInput}/>
                <span className='error'>{firebaseError}</span>
                <a className="reset-password-btn" onClick={displayResetPasswordComponet}>Forgot Your Password?</a>
                <button type='submit' className='sign-in-form-btn'>Sign In</button>
              </form>
              <p className="new-user-text">New User? <span><a className="new-user-btn" onClick={displayRegisterComponet}>Register!</a></span></p>
            </section>
            <section className='sign-in-separator-container'>
                <span>OR</span>
            </section>
            <section className='social-media-sign-in-container'>
              <header className='sign-in-method-header'>
                <h2>Sign in with your social media accounts!</h2>
              </header>
              <div className='btn-container'>
                <button className='social-sign-in-btn' onClick={signInWithGoogle}><img className='social-logo' src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg" /> Sign In with your Google Account </button>
                <button className='social-sign-in-btn' onClick={signInWithFacebook}><img className='social-logo' src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/facebook/facebook-original.svg" /> Sign In with your facebook Account </button>
              </div>
            </section>
          </div>
        </div>
    </>
  );
}





export default SignIn;