import returnIcon from './assets/images/return-icon.png'
import errorIcon from './assets/images/error-icon.svg'
import loadingIcon from './assets/images/loading-icon.svg'
import './assets/css/forgot.css'
import { useNavigate } from 'react-router'
import { useState } from 'react';


function ForgotPassword(){

    const navigate=useNavigate();
    const [email,setEmail]=useState(null);
    const [error,setError]=useState(null);
    const [loading,setLoading]=useState(false);
    const [emailSent, setEmailSent]=useState(false);

    async function resetEmail(e){
        e.preventDefault();
        setLoading(true);
        const result=await fetch('/api/forgot-password',{
            method:"POST",
            headers: { "Content-Type": "application/json" },
            body:JSON.stringify({email})
        });
        if(!result.ok){
            const data=await result.json();
            setTimeout(()=>{
                setError(data.error)
                setLoading(false)
            }, 1000);
        }
        else{       
            setTimeout(()=>{
                setLoading(false);
                setEmailSent(true);
            }, 1000);
        }
    }

    return(
        <div className='main'>
            <div className="forgot-container">
                <img src={returnIcon} alt="return-icon" width={'16px'} height={'16px'} id='logo' onClick={()=>navigate('/')}/>
                {!emailSent && (
                    <>
                        <div className='header'>
                            <h3>Find your account</h3>
                            <p>In order to reset your password please enter your e-mail address.</p>
                        </div>
                        {error &&
                            <div className='email-error'>
                                <img src={errorIcon} alt="error-icon" />
                                <p>E-mail address not found. Please check if it is correct.</p>
                            </div>
                        }
                        <form onSubmit={resetEmail}>
                            <input type="text" name='email' placeholder='Please enter your email' onChange={(e)=>setEmail(e.target.value)}/>
                            <button id={loading ? 'reset-password-loading' : 'reset-password'} type='submit'>
                                {loading ? <img id='loading-icon' src={loadingIcon} alt="loading-icon" /> : 'Continue'}
                            </button>
                        </form>
                    </>
                )}
                {emailSent && (
                    <div className='header'>
                        <h3 id='h3-successfull'>E-mail with reset link has been sent to your account</h3>
                        <p id='p-successfull'>Please check your e-mail for further informations.</p>
                        <button type='button' id='back-button' name='back-button' onClick={()=>navigate('/')}>Go back</button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ForgotPassword;