import WebsiteLogo from './assets/images/logo.png'
import AvatarLogo from './assets/images/avatar-logo.svg'
import './assets/css/header.css'
import { useNavigate } from 'react-router';

function Header(){
    const navigate=useNavigate();

    return(
        <header>
            <img src={WebsiteLogo} alt="website-logo" onClick={()=>navigate('/home')}/>
            <img src={AvatarLogo} alt="avatar-logo" />
        </header>
    )
}

export default Header;