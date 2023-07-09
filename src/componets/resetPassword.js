import React, { useState, useEffect} from 'react';
import {auth} from '../firebase-config.js';
import { sendPasswordResetEmail } from 'firebase/auth';
import "../styles/resetPassword.css"


function ResetPassword({setPasswordReset}) {

  const emailFormValues = {email:""};
  const [formValues, setFormValues] = useState(emailFormValues);
  const [emailError, setEmailError] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [firebaseError, setFirebaseError] = useState();

  const handleOnChangeFormInput = (e) => {
    //this deconstruct the targeted input field by it's name and value
    const {name, value} = e.target;
    setFormValues({...formValues, [name]: value})
  }

//add validation to the email form
  const submitResetForm = (e) =>{
    e.preventDefault();
    setEmailError(validateResetForm(formValues))
    setIsSubmitted(true);
  }

  const validateResetForm = (values) => {
    const errors = {};
    const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

    if(values.email == ""){
      errors.email = "Your Email Is Required!"
    }else if(!regex.test(values.email)){
      errors.email = "This is not a vaild email address!"
    }
    return errors;
  }

  useEffect(() =>{
    if(Object.keys(emailError).length === 0 && isSubmitted){
      resetPasswordWithEmail();
    }
  },[emailError]);

  const resetPasswordWithEmail = async () => {
    try{
      const result = await sendPasswordResetEmail(auth, formValues.email);
      setEmailSent(true);
    }catch (err){
      if(err.code === "auth/user-not-found"){
        setFirebaseError("The email you entered isn't in our system!")
      }
    }
  }

  return (
    <>
      <div className='reset-password-container'>
        <header className='password-reset-form-header'>
          <h1>Reset Your Password</h1>
        </header>
        <form className='reset-password-form' onSubmit={submitResetForm}>
          <span className='form-error'>{emailError.email}</span>
          <input className='form-input' name="email" placeholder='Enter Your Email Address To Reset Password' value={formValues.email} onChange={handleOnChangeFormInput}/>
          <span className='form-error'>{firebaseError}</span>
          <button type='submit' className='reset-password-submit-btn'>Submit Email</button>
          <span className='email-sent'>{emailSent && <p>Check your Email a link to reset your password was sent!</p>}</span>
        </form>

      </div>
    </>
  );
}

export default ResetPassword;