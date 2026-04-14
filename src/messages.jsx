import './assets/css/messages.css'
import FindUsers from './findUsers.jsx'
import AvatarLogo from './assets/images/avatar-logo.svg'
import { useContext, useEffect, useState } from 'react'
import SendIconWhite from './assets/images/send-message-icon-white.svg'
import { useNavigate, useParams } from 'react-router'
import { UserContext } from './userContext.jsx';
import formatTimeSmart from './app/controllers/timeFormatter.js';

function Messages(){
    const [hideConversation, setHideConversation]=useState(false);
    const [messagePreview, setMessagePreview]=useState(false);
    const [messageContent, setMessageContent]=useState('');
    const [userConversations, setUserConversations]=useState([]);
    const { socket, user } = useContext(UserContext);
    const params=useParams();
    const navigate=useNavigate();

    useEffect(()=>{
        getUserConversations();
        if(params.messageId){
            getMessages(params.messageId);
            
        }
        if(!params.messageId){
            setMessagePreview(false)
        }
        if(messagePreview){
            conversationRead(messagePreview.conversationId)
        }
    }, [params.messageId, socket]);

    useEffect(() => {
    if (messagePreview?.conversationId) {
        conversationRead(messagePreview.conversationId);
    }
}, [messagePreview]);

    useEffect(()=>{
        if(!socket) return

        const handleUpdate= (message) =>{
            
            setMessagePreview(prev => {
                if (!prev) return prev;

                if (!prev.conversationId) {
                    return {
                        ...prev,
                        conversationId: message.conversationId,
                        messages: [message]
                    };
                }
                
                if (message.conversationId !== prev.conversationId) {
                    return prev;
                }
                
                const firstId = prev.messages.length > 0 ? prev.messages[0].id : 0;

                const newMessage = {
                    id: firstId,
                    content: message.content,
                    createdAt: message.createdAt,
                    senderId: message.senderId
                };

                
                return {
                    ...prev,
                    messages: [newMessage, ...prev.messages]
                };
            });
            getUserConversations();
        };

        socket.on("newMessage", handleUpdate);

        return () => {
            socket.off("newMessage", handleUpdate);
        };
    }, [socket]);

    async function getMessages(userId){        
        const result=await fetch(`/api/get-messages/${userId}`);
        const data=await result.json();
        setMessagePreview(data);
    }

    async function sendMessage(){
        const formattedMessage=messageContent.replace(/\n{3,}/g, "\n\n").trim();
        setMessageContent('');
        if(formattedMessage === '') return;  
        setMessagePreview(prev => {
            const firstId=prev.messages.length > 0 ? prev.messages[0].id : 0;
            const newMessage={
                id: firstId+1,
                content: formattedMessage,
                createdAt: new Date().toISOString(),
                senderId: user.userId
            }
            return ({...prev, messages: [newMessage, ...prev.messages]})
        });

        const result = await fetch('/api/createMessage', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                content: formattedMessage,
                messageId: params.messageId
            })
        });  

        if(result.ok){
            getUserConversations();
            setMessagePreview(prev => {
            if (!prev?.conversationId) {
                getMessages(params.messageId);
            }
            return prev;
        });
        }
    }

    async function getUserConversations(){
        const result=await fetch(`/api/userConversations/${params.messageId}`);
        if(result.ok){
            const data=await result.json();
            setUserConversations(data);        
        }
    }

    async function conversationRead(conversationId){
        const result= await fetch(`/api/conversationRead/${conversationId}`);
        if(result.ok){
            getUserConversations()
        }
    }

    function truncate(text, maxLength = 18) {
        if (!text) return '';
        return text.length > maxLength 
            ? text.slice(0, maxLength) + '...' 
            : text;
    }

    return(
        <>
            <div className="title" >
                <p style={{textTransform: 'capitalize'}}>Messages</p>
            </div>
            <div className="messages-main" >
                <div className='messages-sidebar'>
                    <div className='messages-find-user'>
                        <FindUsers setHideConversation={setHideConversation} hideConversation={hideConversation} getMessages={getMessages} />
                    </div>
                    {!hideConversation && (
                        <div className='conversations'>
                            <p style={{paddingLeft: '1rem', paddingTop: '2.5rem', fontSize: '1rem', fontWeight: 500}}>Last Messages</p>
                            {userConversations?.map((conversation, index)=>{
                                const otherUser = conversation.participants.find(p => p.userId !== user.userId)?.user;
                                
                                return(
                                <div className={otherUser.id === parseInt(params.messageId) ? 'activity-active' : 'activity'} key={index} onClick={()=>navigate(`/messages/${otherUser.id}`)}>
                                    <div className='activity-user'>
                                        <img src={otherUser?.avatarUrl || AvatarLogo} alt="avatar-logo" id='activity-user'/>
                                    </div>
                                    <span style={{width: '100%', marginLeft: '0.8rem'}}>
                                        <p id={ 
                                        conversation.lastMessage.senderId !== user.userId && 
                                        !conversation.lastMessage.isRead  ? 'lastUserNotSeen': 'lastUser' }>{otherUser.name + ' ' + otherUser.lastName}
                                        </p>
                                        <span style={{display: 'flex', flexDirection: 'row'}}>
                                            <p id={ 
                                            conversation.lastMessage.senderId !== user.userId && 
                                            !conversation.lastMessage.isRead ? 'lastMessageNotSeen': 'lastMessage'}>
                                            {(conversation.lastMessage.senderId === user.userId ? truncate('You: '+conversation.lastMessage.content): truncate(conversation.lastMessage.content))}
                                            </p>
                                            <p id='sentAgo'>{' • ' + formatTimeSmart(conversation.lastMessage.createdAt)}</p>
                                        </span>
                                    </span>
                                    { 
                                    conversation.lastMessage.senderId !== user.userId && 
                                    !conversation.lastMessage.isRead &&(
                                    <span style={{color: '#505af3'}}>●</span>
                                    )}
                                </div>
                            )
                            }
                            )}
                            {!userConversations.length &&(
                                <p style={{textAlign: 'center', marginTop: '2rem', fontSize: '1rem'}}>No last conversations</p>
                            )}
                        </div>
                    )}
                </div>
                <div className='message'>
                    {!messagePreview && (
                        <div className='select-a-message'>
                            <p>Select a message to display</p>
                        </div>
                    )}
                    {messagePreview && (
                        <>
                            <div className='message-user-details'>
                                <img style={{cursor: 'pointer'}} src={messagePreview.user?.avatarUrl || AvatarLogo} alt="avatar-logo" id='message-user-logo' onClick={()=>navigate(`/user/${messagePreview.user.id}`)}/>
                                <p onClick={()=>navigate(`/user/${messagePreview.user.id}`)} style={{textTransform: 'capitalize', cursor: 'pointer'}}>{messagePreview.user?.name + ' ' + messagePreview.user?.lastName}</p>
                            </div>
                            <div className='message-content'>
                                {messagePreview.messages?.map((message, index)=>
                                    <span id={message.senderId === parseInt(params.messageId) ? 'message-notmy' : 'message-my'} key={index}>
                                        <p>{message.content}</p>
                                    </span>
                                )}
                                {messagePreview.messages?.length === 0 && (
                                    <p style={{margin: 'auto', fontSize: '1rem'}}>No meesages to display</p>
                                )}
                            </div>
                            <div className='message-answer'>
                                <form onSubmit={(e)=>(e.preventDefault(), sendMessage())}>
                                    <textarea required onChange={(e)=>setMessageContent(e.target.value )} value={messageContent} placeholder='Send a message...' name="message-content" id="message-content" onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                        if (e.shiftKey) {
                                            return;
                                        } else {
                                            e.preventDefault();
                                            sendMessage();
                                        }
                                        }
                                    }}/>
                                    {messageContent && (
                                        <span>
                                            <button type='submit'>
                                                <img src={SendIconWhite} alt="send-message-icon" />
                                            </button>
                                        </span>
                                    )}
                                </form>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
)
}

export default Messages;