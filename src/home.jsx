import { useLocation, useNavigate } from 'react-router';
import AvatarLogo from './assets/images/avatar-logo.svg';
import CreateLogo from './assets/images/create-logo.svg';
import HeartLogo from './assets/images/heart-logo.svg';
import MessagesLogo from './assets/images/messages-logo.svg';
import LogoutLogo from './assets/images/logout-logo.svg';
import UsersLogo from './assets/images/users-logo.svg';
import HomeIcon from './assets/images/home-icon.svg'
import { useContext} from 'react';
import { UserContext } from './userContext.jsx';;
import './assets/css/home.css';


function Home(props){
    const navigate=useNavigate();
    const {user, loadingLogin}=useContext(UserContext);
    const location=useLocation();
    

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
                        <span className={location.pathname === `/user/${user.userId}` ? 'sidebar-active': ''} onClick={()=>navigate(`/user/${user.userId}`)} style={{marginBottom: '1rem', paddingLeft: '1rem', marginLeft: '-0.5rem'}}>
                            <img style={{marginLeft: '-4px'}} src={user?.user.avatarUrl || AvatarLogo} alt="avatar-logo" id='sidebar-avatar-logo'/>
                            <p style={{marginLeft: '-4px', textTransform: 'capitalize'}}>{user.user.name + ' ' + user.user.lastName}</p>
                        </span>
                        <span className={location.pathname.startsWith('/home') ? 'sidebar-active': ''} onClick={()=>navigate('/home')}>
                            <img src={HomeIcon} alt="home-logo" />
                            <p>Home</p>
                        </span>
                        <span className={location.pathname === `/create` ? 'sidebar-active': ''} onClick={()=>navigate('/create')}>
                            <img src={CreateLogo} alt="create-logo" />
                            <p>Create</p>
                        </span>
                        <span className={location.pathname === `/likes` ? 'sidebar-active': ''} onClick={()=>navigate('/likes')}>
                            <img src={HeartLogo} alt="heart-logo" />
                            <p>Activity</p>
                        </span>
                        <span className={location.pathname.startsWith('/messages') ? 'sidebar-active': ''} onClick={()=>navigate('/messages')}>
                            <img src={MessagesLogo} alt="messages-logo" />
                            <p>Messages</p>
                        </span>
                        <span className={location.pathname === `/find-users` ? 'sidebar-active': ''} onClick={()=>navigate('/find-users')}>
                            <img src={UsersLogo} alt="users-logo" />
                            <p>Users</p>
                        </span>
                        <span onClick={()=>logout()}>
                            <img src={LogoutLogo} alt="logout-logo" />
                            <p>Logout</p>
                        </span>
                    </div>
                    <div className='home-main' style={location.pathname.startsWith('/messages') ? {width: '100%'} : {}}>
                        {props.content}
                    </div>
                    <div className='contacts'>
                        <p style={{padding: '0.5rem', fontSize: '1rem', fontWeight: '500'}}>My Friends</p>
                        {user && user.user.following.map((user,index)=>{
                            return(
                                <div className='contact' key={index} onClick={()=>navigate(`/user/${user.id}`)}>
                                    <img src={user.avatarUrl || AvatarLogo} alt="user-logo" />
                                    <p style={{textTransform: "capitalize"}}>
                                        {user.name + " " + user.lastName}
                                    </p>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}
        </>
    )
}

export default Home;