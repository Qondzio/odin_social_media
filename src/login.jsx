import loginImage from './assets/images/login_image.png'
import websiteLogo from './assets/images/logo.png'
import errorIcon from './assets/images/error-icon.svg'
import loadingIcon from './assets/images/loading-icon.svg'
import checkIcon from './assets/images/check-icon.svg'
import checkIfLogged from './app/controllers/checkIfLogged.js';
import './assets/css/login.css'
import { useEffect, useState } from 'react'
import Footer from './footer.jsx'
import { useNavigate } from 'react-router'


function Login(){
    const navigate=useNavigate();
    const [loadingLogin, setLoadingLogin]=useState(true);
    const [error, setError]=useState(null);
    const [message, setMessage]=useState(null);
    const [loading,setLoading]=useState(false);
    const [email, setEmail]=useState(null);
    const [password, setPassword]=useState(null);

    useEffect(()=>{
        (async function loadLogin(){
            const result=await checkIfLogged();
            if(result){
                navigate('/home')
            }
            else{
                setLoadingLogin(false);
            }
        })();
        const message=sessionStorage.getItem('message');
        if(message){
            setMessage(message);
            sessionStorage.removeItem('message');
        }
    },[]);

    async function checkLogin(e){
        e.preventDefault();
        setLoading(true);
        const result=await fetch('/api/login',{
            method:"POST",
            headers: { "Content-Type": "application/json" },
            body:JSON.stringify({username:email, password:password})
        });
        
        setTimeout(()=>{setLoading(false)}, 1000);
        if(!result.ok){            
            const data=await result.json();
            const message=data?.message.message;
            setTimeout(()=>{setError(message)},1000)
        }
        else{
            setTimeout(()=>{navigate('/home')},1000)
        }
    }
    
    return(
        <>
            {!loadingLogin && (
                <>
                <main>
                    <div className='login_left'>
                        <div className='login_left_text'>
                            <img src={websiteLogo} alt="website_logo" />
                            <h1>Search exactly what are you <span>looking for</span>.</h1>
                        </div>
                        <div className='login_left_image'>
                            <img src={loginImage} alt="login_image"/>
                        </div>
                    </div>
                    <div className='login_right'>
                        <form onSubmit={checkLogin}>
                            <p>Log into Koobie</p>
                            {error && 
                            <div className='error-div'>
                                <img src={errorIcon} alt="error-icon" />
                                <p className='p-error'>{error}</p>
                            </div>}
                            {message && 
                            <div className='message-div'>
                                <img src={checkIcon} alt="check-icon" />
                                <p className='p-message'>{message}</p>
                            </div>}
                            <span>
                                <input type="email" name='email' id='email' placeholder='Email' onChange={(e)=>setEmail(e.target.value)} />
                                <input type="password" name='password' id='password' placeholder='Password' onChange={(e)=>setPassword(e.target.value)}/>
                            </span>
                            <span>
                                <button id={loading ? 'loginButtonLoading' : 'loginButton'} type='submit' onClick={checkLogin}>
                                    {loading ? <img id='loading-icon' src={loadingIcon} alt="loading-icon" /> : 'Log in'}
                                </button>
                                <button type='button' id='forgotpswButton' onClick={()=>navigate('/forgot-password')}>Forgot password?</button>
                            </span>
                            <button type='button' className='button_signup' onClick={()=>navigate('/sign-up')}>Create new account</button>
                        </form>
                        <img id='website-logo' src={websiteLogo} alt="website_logo" />
                    </div>
                </main>
                <Footer/>
                </>
            )}
        </>
    )
}

export default Login;