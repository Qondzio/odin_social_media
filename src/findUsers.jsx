import searchIcon from './assets/images/search-icon.svg'
import AvatarLogo from './assets/images/avatar-logo.svg'
import './assets/css/search.css'
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import GoBackIcon from './assets/images/go-back-icon.svg'

function FindUsers({setHideConversation, hideConversation, getMessages}){
    const [foundUsers, setFoundUsers]=useState(null);
    const navigate=useNavigate();
    const isMessagesPage=window.location.pathname.startsWith('/messages');    
    const ref=useRef();

    async function handleSubmit(e){        
        e.preventDefault();
        const user=e.target.value;
        
        if(user !== ''){
            const result=await fetch(`/api/find-user/${user}`);
            const data=await result.json();
            setFoundUsers(data);
        }
        else setFoundUsers(null);
    }
    
    return(
        <>
            {!isMessagesPage && (
                <div className="title">
                    <p>Find Users</p>
                </div>
            )}
            <div className="search">
                <img src={hideConversation ? GoBackIcon : searchIcon} alt="search-icon" id={hideConversation ? 'go-back-icon' : 'search-icon'} onClick={()=>{window.location.pathname.startsWith('/messages') ? (setHideConversation(false), setFoundUsers(null), ref.current.value='') : null}}/>
                <form onSubmit={(e) => e.preventDefault()}> 
                    <input ref={ref} type="text" id='searched-user' name='searched-user' placeholder='Enter a name or last name' onChange={handleSubmit} onClick={()=>window.location.pathname.startsWith('/messages') ? setHideConversation(true) : null}/>
                </form>
            </div>
            {Array.isArray(foundUsers) && foundUsers.map((item,index)=>(                    
                <div className='found-user' key={index} onClick={()=>isMessagesPage ?  (navigate(`/messages/${item.id}`), setFoundUsers(false) ,setHideConversation(false), ref.current.value='') : navigate(`/user/${item.id}`)}>
                    <img src={item.avatarUrl || AvatarLogo} alt="founded-user-avatar" />
                    <span>
                        <p id="founded-user-name">{item.name + " " + item.lastName}</p>
                        <p id="founder-user-followers">Followers: {item.followers.length}</p>
                    </span>
                </div>
            ))}
            {foundUsers?.message && (
                <span style={{textAlign: 'center'}}>
                    <p style={{fontSize: '1rem'}}>No user found</p>
                </span>
            )}
        </>
    )
}

export default FindUsers;