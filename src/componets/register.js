import React, {useState} from 'react';

function Register({setNewUser}) {
    // the useStates to keep track of the form input values.
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState(false);


    const displaySignInComponet = () => {
        setNewUser(false)
      }


const validateRegisterForm = (e) => {
    e.preventDefault();
    if(email == ''){
        setErrors(true);
    }
    if(password == ''){
        setErrors(true);
    }
    if(confirmPassword == ''){
        setErrors(true);
    }

}


  return (
    <>
        <div className="register-container">
            <form className="register-form" onSubmit={validateRegisterForm}>
                <input className="email-input" placeholder="Enter You Email Here" onChange={(e) => setEmail(e.target.value)}/>
                {errors && 
                    <span> Email can't be empty! </span>
                }
                <input className="password-input" placeholder="Enter A Password Here" onChange={(e) => setPassword(e.target.value)}/>
                {errors && 
                    <span> password can't be empty! </span>
                }
                <input className="Confirm-password-input" placeholder="Confirm Your Password Here" onChange={(e) => setConfirmPassword(e.target.value)}/>
                {errors && 
                    <span> password confirmation can't be empty! </span>
                }
                <button type="submit" className="register-btn">Register</button>
            </form>
            <p>Have an account? <span><button className="existing-user-btn" onClick={displaySignInComponet}>Sign In!</button></span></p>
        </div>

    </>
  );
}





export default Register;