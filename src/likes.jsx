import { useEffect, useState } from 'react'
import './assets/css/likes.css'
import AvatarLogo from './assets/images/avatar-logo.svg'
import commentActivity from './assets/images/comment-activity.svg'
import likeActivity from './assets/images/heart-activity.svg'
import formatTimeSmart from './app/controllers/timeFormatter.js'
import { useNavigate } from 'react-router'

function Likes(){
    const [notifications, setNotifications]=useState([]);
    const navigate=useNavigate();

    const notificationType={
        "COMMENT-COMMENT":{
            color: '#43b855',
            image: commentActivity,
            message: 'replied to your comment.'
        },
        "LIKE-COMMENT":{
            color: '#fd0000',
            image: likeActivity,
            message: 'liked your comment.'
        },
        "POST-COMMENT":{
            color: '#43b855',
            image: commentActivity,
            message: 'commented your post.'
        },
        "POST-LIKE":{
            color: '#fd0000',
            image: likeActivity,
            message: 'liked your post.'
        },
        "FOLLOW":{
            color: '#f3328c',
            image: likeActivity,
            message: 'is now following you.',
            action: (param)=>navigate(param)
        }
    }
    console.log(notifications);
    

    useEffect(()=>{
        getNotifications()
    }, []);

    async function getNotifications(){
        const res=await fetch('/api/getNotifications');
        if(res.ok){
            const data=await res.json();
            setNotifications(data);
        }
    }
    return(
        <>
            <div className="title">
                <p>Activity</p>
            </div>
            <div className='activity-box'>
            {notifications.map((notification, index)=>{

                const type=notificationType[notification.type];
                return (
                    <div className="activity" style={{maxWidth: '600px', gap: '1rem'}} key={index} onClick={()=>type.action(`/user/${notification.actorId}`)}>
                        <div className='activity-user'>
                            <img src={notification.actor?.avatarUrl || AvatarLogo} alt="avatar-logo" id='activity-user'/>
                            <span className='icon-background' style={{backgroundColor: `${type.color}`}}>
                                <img src={type.image} alt="comment-activity" id='activity-icon'/>
                            </span>
                        </div>
                        <div className='activity-info'>
                            <p>
                                <strong style={{textTransform: 'capitalize'}}>
                                    {notification.actor.name + ' ' + notification.actor.lastName + ' '}
                                </strong>
                            {type.message}
                            </p>
                            <p>{formatTimeSmart(notification.createdAt)}</p>
                        </div>
                    </div>
                )
            }                
            )}
            </div>
        </>
    )
}

export default Likes;