import './assets/css/signup.css'
import returnIcon from './assets/images/return-icon.png'
import errorIcon from './assets/images/error-icon.svg'
import loadingIcon from './assets/images/loading-icon.svg'
import logo from './assets/images/logo.png'
import { useNavigate } from 'react-router'
import { useState } from 'react';

function SignUp(){

    const navigate=useNavigate();
    const [name,setName]=useState(null);
    const [lastName,setLastName]=useState(null);
    const [date,setDate]=useState(null);
    const [email, setEmail]=useState(null);
    const [password, setPassword]=useState(null);
    const [confirmPassword, setConfirmPassword]=useState(null);
    const [errors,setErrors]=useState(null);
    const [loading,setLoading]=useState(false);

    async function signUpUser(e){
        e.preventDefault();
        setLoading(true);
        const result=await fetch('/api/signup',{
            method:"POST",
            headers: { "Content-Type": "application/json" },
            body:JSON.stringify({name, lastName, date, email, password, confirmPassword})
        });
        setTimeout(()=>{setLoading(false)}, 1000);
        if(!result.ok){
            const data=await result.json();
            setTimeout(()=>{setErrors(data.errors)}, 1000)            
        }
        else{
            sessionStorage.setItem('message', 'Account created. Please login.');
            setTimeout(()=>{navigate('/')}, 1000);
        }
    }

    return(
        <div className='main'>
            <div className='signup-container'>
                <img src={returnIcon} alt="return-icon" width={'16px'} height={'16px'} id='logo' onClick={()=>navigate('/')}/>
                <div className='header'>
                    <h3>Try to use Koobie</h3>
                    <p>Create an account to connect with friends, family, and communities of people who share your interests.</p>
                    {errors && 
                    <div className='errors'>
                        {errors.map((err, index)=>(
                            <span key={index}>
                                <img src={errorIcon} alt="error-icon" />
                                <p >{err.msg}</p>
                            </span>
                        ))}
                    </div> }
                </div>
                <form onSubmit={signUpUser}>
                    <div>
                        <p>Name and last name</p>
                        <span className='names'>
                            <input type="text" name='name' placeholder='Name' onChange={(e)=>setName(e.target.value)}/>
                            <input type="text" name='last-name' placeholder='Last name' onChange={(e)=>setLastName(e.target.value)}/>
                        </span>
                    </div>
                    <div>
                        <p>Date of birth</p>
                        <input type="date" name='date' onChange={(e)=>setDate(e.target.value)}/>
                    </div>
                    <div>
                        <p>Email</p>
                        <input type="email" name='email' placeholder='Email' onChange={(e)=>setEmail(e.target.value)}/>
                    </div>
                    <div>
                        <p>Password</p>
                        <input type="password" name='password' placeholder='Password' onChange={(e)=>setPassword(e.target.value)}/>
                    </div>
                    <div>
                        <p>Confirm password</p>
                        <input type="password" name='confirm-password' placeholder='Confirm password' onChange={(e)=>setConfirmPassword(e.target.value)}/>
                    </div>
                    <span className='buttons'>
                        <button type='submit' id={loading ? 'loginButtonLoading' : 'sign-up'} onClick={signUpUser}>
                            {loading ? <img id='loading-icon' src={loadingIcon} alt="loading-icon" /> : 'Sign up'}
                        </button>
                        <button type='button' id='sign-in' onClick={()=>navigate('/')}>I already have an account</button>
                    </span>
                </form>
                <img id='logo-container' src={logo} alt="logo" width={'32px'} height={'32px'}/>
            </div>
        </div>
    )
}

export default SignUp;