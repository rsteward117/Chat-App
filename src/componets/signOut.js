import { signOut } from "firebase/auth";
import {auth} from '../firebase-config.js';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

function SignOut({setIsSignIn, setRoom}) {

    const signUserOut = async () =>{
        await signOut(auth)
        cookies.remove("auth-token")
        setIsSignIn(false)
        setRoom(null)
    };

  return (
    <>
        <button className='sign-out-btn' onClick={signUserOut}>Sign Out</button>
    </>
  );
}





export default SignOut;