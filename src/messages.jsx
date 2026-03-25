import './assets/css/messages.css'
import AvatarLogo from './assets/images/avatar-logo.svg'

function Messages(){
    return(
        <>
            <div className="title">
                <p>Messages</p>
            </div>
            <div className="message">
                <img src={AvatarLogo} alt="avatar-logo" id='activity-user'/>
                <span>
                    <p id='message-user'>Józef Narrdowski</p>
                    <p id='message-text'>Hi what's up man? - 4 min</p>
                </span>
            </div>
        </>
)
}

export default Messages;