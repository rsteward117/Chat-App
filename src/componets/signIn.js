import {auth, provider} from '../firebase-config.js';
import {signInWithPopup} from 'firebase/auth';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

function SignIn() {

    const signInWithGoogle = async () => {
      try{
        const result = await signInWithPopup(auth, provider);
        //this sets a refresh token from firebase within cookie to the app so the user doesn't have to keep loging inwith google
        cookies.set("auth-token", result.user.refreshToken);
        }
      catch (err){
        console.error(err);
      }        

        
    }

  return (
    <>
        <button className='google-sign-in-btn' onClick={signInWithGoogle}>Sign In with Google</button>
    </>
  );
}





export default SignIn;