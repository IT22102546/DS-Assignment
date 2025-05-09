import { Button } from 'flowbite-react';
import { AiFillGoogleCircle } from 'react-icons/ai';
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';

export default function OAuthenticate() {
    
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const apiUrl = import.meta.env.VITE_User_API_URL;
    const handleGoogleClick = async () =>{
        
       
        try {
            const provider = new GoogleAuthProvider()
           const auth = getAuth(app);
            const result = await signInWithPopup(auth , provider);

            const res = await fetch(`${apiUrl}/api/user/google`, {
                method : 'POST',
                headers : {
                    'Content-Type':'application/json',
                },
                body :JSON.stringify({
                    name: result.user.displayName,
                    email: result.user.email,
                    photo: result.user.photoURL

                })
            });
            
            const data = await res.json()
            if (res.ok){
                dispatch(signInSuccess(data))
                navigate('/')
            }
        } catch (error) {
            console.log(error);
        }
    } 
  return (
    <Button type='button' className='bg-slate-400 text-black max-w-md w-3/4 mx-auto flex flex-wrap items-center justify-center'outline onClick={handleGoogleClick}>
        <AiFillGoogleCircle className='w-6 h-6 mr-2'/>
        Continue with Google
    </Button>
  )
}