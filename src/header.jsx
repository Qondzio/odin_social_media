import WebsiteLogo from './assets/images/logo.png'
import AvatarLogo from './assets/images/avatar-logo.svg'
import './assets/css/header.css'
import { useNavigate } from 'react-router'
import { useContext } from 'react'
import { UserContext } from './userContext.jsx'

function Header(){
    const navigate=useNavigate();
    const {user}=useContext(UserContext);

    return(
        <header>
            <img src={WebsiteLogo} alt="website-logo" onClick={()=>navigate('/home')}/>
            <img src={user?.user.avatarUrl || AvatarLogo} alt="avatar-logo" id='header-user-avatar' onClick={()=>navigate(`/user/${user.userId}`)}/>
        </header>
    )
}

export default Header;