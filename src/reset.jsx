import { useEffect, useState } from 'react';
import './assets/css/reset.css'
import errorIcon from './assets/images/error-icon.svg'
import loadingIcon from './assets/images/loading-icon.svg'
import { useNavigate, useParams } from 'react-router';

function resetPassword(){

    const [errors,setErrors]=useState(null);
    const [loading,setLoading]=useState(false);
    const [password, setPassword]=useState(null);
    const [confirmPassword, setConfirmPassword]=useState(null);
    const [passwordChanged, setPasswordChanged]=useState(false);
    const {token}=useParams();
    const [validToken, setValidToken]=useState(false);
    const navigate=useNavigate();

    useEffect(()=>{
        (async function checkToken(){
            const result=await fetch(`/api/reset-token/${token}`);
            if(result.ok){
                setValidToken(true);
            }
        })();
    }, [token])
    

    async function handleResetPassword(e){
        e.preventDefault();
        setLoading(true);
        const result=await fetch(`/api/reset-password/${token}`,{
            method:"POST",
            headers: { "Content-Type": "application/json" },
            body:JSON.stringify({password, confirmPassword})
        });
        setTimeout(()=>{setLoading(false)}, 1000);
        if(!result.ok){
            const data=await result.json();
            setTimeout(()=>{setErrors(data.errors)}, 1000);          
        }
        else{
            setTimeout(()=>{setErrors(null), setPasswordChanged(true)}, 1000); 
        }
    }

    if(!validToken){
        return(
            <div className='main'>
                <div className="forgot-container">
                    <div className='header'>
                        <h3>This reset password link is invalid or has expired</h3>
                        <p>In order to generate a new link, please click on the button below.</p>
                    </div>
                    <button type='button' id='sign-up' onClick={()=>navigate('/forgot-password')}>Reset password</button>
                </div>
            </div>
        )
    }

    return !passwordChanged ? (
        <div className='main'>
            <div className="forgot-container">
                <div className='header'>
                    <h3>Koobie password reset</h3>
                    <p>Please enter a new password for your account below.</p>
                    {errors && 
                        <div className='errors'>
                            {errors.map((err, index)=>(
                                <span key={index}>
                                    <img src={errorIcon} alt="error-icon" />
                                    <p >{err.msg}</p>
                                </span>
                            ))}
                        </div> 
                    }
                </div>
                <form className="reset-password">
                    <input type="password" name='new-password' placeholder='Please enter your new password' onChange={(e)=>setPassword(e.target.value)}/>
                    <input type="password" name='confirm-password' placeholder='Confirm new password' onChange={(e)=>setConfirmPassword(e.target.value)}/>
                    <button id={loading ? 'reset-password-loading' : 'reset-password'} type='submit' onClick={handleResetPassword}>
                        {loading ? <img id='loading-icon' src={loadingIcon} alt="loading-icon" /> : 'Reset password'}
                    </button>
                </form>
            </div>
        </div>
    ): (
        <div className='main'>
            <div className="forgot-container">
                <div className='header'>
                    <h3>Your password has been changed.</h3>
                    <p>You can close this website and login to your account using new password.</p>
                </div>
            </div>
        </div>
    )
}

export default resetPassword;