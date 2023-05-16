import {auth, provider} from '../firebase-config.js';
import {signInWithPopup, } from 'firebase/auth';
import Cookies from 'universal-cookie';

const cookies = new Cookies();
//figure out a way for the user to login using their email/password through firebase.
function SignIn({setIsSignIn, setNewUser}) {

    const displayRegisterComponet = () => {
      setNewUser(true)
    }

    const signInWithEmailPassword = async (e) => {
      e.preventDefault();

      
    }

    const signInWithGoogle = async () => {
      try{
        const result = await signInWithPopup(auth, provider);
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
          <form className='email-password-form' onSubmit={signInWithEmailPassword}>
            <input className='email-input' placeholder='Enter Your Email Address'/>
            <input className='password-input' placeholder='Enter Your Password'/>
            <button type='submit' className='email-password-form-btn'>Sign In</button>
          </form>
          <p>New User? <span><button className="new-user-btn" onClick={displayRegisterComponet}>Register!</button></span></p>
          <button className='google-sign-in-btn' onClick={signInWithGoogle}>Sign In with Google</button>

        </div>
    </>
  );
}





export default SignIn;