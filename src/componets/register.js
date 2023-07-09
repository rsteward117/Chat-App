import React, {useState, useEffect} from 'react';
import {auth} from '../firebase-config.js';
import {createUserWithEmailAndPassword} from 'firebase/auth';
import "../styles/register.css"

function Register({setNewUser}) {
    // the useStates to keep track of the form input values.
    const InitialFormValues = {email:"", password:"", confirmPassword:""}
    //useStates
    const [formValues, setFormValues] = useState(InitialFormValues);
    const [formErrors, setFormErrors] = useState({});
    const [firebaseError, setFirebaseError] = useState();
    const [isSubmitted, setIsSubmitted] = useState(false);

    const displaySignInComponet = () => {
        setNewUser(false)
      }

    const handleOnChangeFormInput = (e) => {
        //this deconstruct the targeted input field by it's name and value
        const {name, value} = e.target;
        setFormValues({...formValues, [name]: value})
    }

    //this function handles the form submit, which runs a validation function.
    const submitRegisterForm = (e) => {
        e.preventDefault();
        setFormErrors(validateRegisterForm(formValues))
        setIsSubmitted(true)
        
    }

    //validation function
    const validateRegisterForm = (values) => {
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

        if(values.confirmPassword == ""){
            errors.confirmPassword = "Please Re-enter Your Password!"
        }else if(values.confirmPassword != values.password){
            errors.confirmPassword = "Passwords must match!"
        }

        //this set the errors to the 'setFormErrors' useState.
        return errors;
    }

    const createFirebaseUser = async () => {
        try{
            const result = await createUserWithEmailAndPassword(auth, formValues.email, formValues.confirmPassword);
            console.log(result.user);
            setNewUser(false)
          }
        catch (err){
            //these if statements are checking the error codes that firebase returns, and creating a error message based on the firebase error code.
            if(err.code === "auth/email-already-in-use"){
                setFirebaseError("The email you entered is already registered!")
            }else{
                setFirebaseError(err.message)
        }   }    
      }

    //this useEffect checks everytime the 'formErrors' changes, and if there is 0 values in the array and the 'isSubmitted' useState is true run the firebase Auth service.
    useEffect(() =>{
        if(Object.keys(formErrors).length === 0 && isSubmitted){
            createFirebaseUser();
        }
    },[formErrors]);


  return (
    <>
        <div className="register-container">
            <header className='register-form-header'>
                <h1>Create An Account!</h1>
            </header>
            <form className="register-form" onSubmit={submitRegisterForm}>
                <span className='form-error'>{formErrors.email}</span>
                <input className="form-input" name="email" placeholder="Enter You Email Here" value={formValues.email} onChange={handleOnChangeFormInput}/>
                <span className='form-error'>{formErrors.password}</span>
                <input className="form-input" type="password" name="password" placeholder="Enter A Password Here" value={formValues.password} onChange={handleOnChangeFormInput}/>
                <span className='form-error'>{formErrors.confirmPassword}</span>
                <input className="form-input" type="password" name="confirmPassword" placeholder="Confirm Your Password Here" value={formValues.confirmPassword} onChange={handleOnChangeFormInput}/>
                <span className='form-error'>{firebaseError}</span>              
                <button type="submit" className="register-btn">Register</button>
            </form>
            <p className="existing-user-text">Have an account? <span><a className="existing-user-btn" onClick={displaySignInComponet}>Sign In!</a></span></p>
        </div>

    </>
  );
}





export default Register;