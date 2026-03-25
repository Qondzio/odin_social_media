import { useNavigate } from 'react-router';
import checkIfLogged from './app/controllers/checkIfLogged.js';
import AvatarLogo from './assets/images/avatar-logo.svg';
import CreateLogo from './assets/images/create-logo.svg';
import HeartLogo from './assets/images/heart-logo.svg';
import MessagesLogo from './assets/images/messages-logo.svg';
import LogoutLogo from './assets/images/logout-logo.svg';
import UsersLogo from './assets/images/users-logo.svg';
import { useEffect, useState} from 'react';
import './assets/css/home.css';

function Home(props){
    const navigate=useNavigate();
    const [loadingLogin, setLoadingLogin]=useState(true);

    useEffect(()=>{
        (async function loadLogin(){
            const result=await checkIfLogged();
            if(!result){
                navigate('/')
            }
            else{
                setLoadingLogin(false);
            }
        })();
    },[])

    async function logout(){
        const result=await fetch('/api/log-out');
        if(result.ok){
            navigate('/')
        }
        else{
            console.log('Server error');
        }
    }
    
    return(
        <>
            {!loadingLogin && (
                <div className='home'>
                    <div className='sidebar'>
                        <span onClick={()=>navigate('/user/s')}>
                            <img src={AvatarLogo} alt="avatar-logo" />
                            <p>Username</p>
                        </span>
                        <span onClick={()=>navigate('/create')}>
                            <img src={CreateLogo} alt="create-logo" />
                            <p>Create</p>
                        </span>
                        <span onClick={()=>navigate('/likes')}>
                            <img src={HeartLogo} alt="heart-logo" />
                            <p>Likes posts</p>
                        </span>
                        <span onClick={()=>navigate('/messages')}>
                            <img src={MessagesLogo} alt="messages-logo" />
                            <p>Messages</p>
                        </span>
                        <span onClick={()=>navigate('/find-users')}>
                            <img src={UsersLogo} alt="users-logo" />
                            <p>Users</p>
                        </span>
                        <span onClick={()=>logout()}>
                            <img src={LogoutLogo} alt="logout-logo" />
                            <p>Logout</p>
                        </span>
                    </div>
                    <div className='home-main'>
                        {props.content}
                    </div>
                    <div className='contacts'>
                        <div className='contact'>
                            <img src={AvatarLogo} alt="author-logo" />
                            <p>Adam Kowalski</p>
                        </div>
                        <div className='contact'>
                            <img src={AvatarLogo} alt="author-logo" />
                            <p>Adam Kowalski</p>
                        </div>
                        <div className='contact'>
                            <img src={AvatarLogo} alt="author-logo" />
                            <p>Adam Kowalski</p>
                        </div>
                        <div className='contact'>
                            <img src={AvatarLogo} alt="author-logo" />
                            <p>Adam Kowalski</p>
                        </div>
                        <div className='contact'>
                            <img src={AvatarLogo} alt="author-logo" />
                            <p>Adam Kowalski</p>
                        </div>
                        <div className='contact'>
                            <img src={AvatarLogo} alt="author-logo" />
                            <p>Adam Kowalski</p>
                        </div>
                        <div className='contact'>
                            <img src={AvatarLogo} alt="author-logo" />
                            <p>Adam Kowalski</p>
                        </div>
                        <div className='contact'>
                            <img src={AvatarLogo} alt="author-logo" />
                            <p>Adam Kowalski</p>
                        </div>
                        <div className='contact'>
                            <img src={AvatarLogo} alt="author-logo" />
                            <p>Adam Kowalski</p>
                        </div>
                        <div className='contact'>
                            <img src={AvatarLogo} alt="author-logo" />
                            <p>Adam Kowalski</p>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default Home;