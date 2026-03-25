import './assets/css/likes.css'
import AvatarLogo from './assets/images/avatar-logo.svg'
import commentActivity from './assets/images/comment-activity.svg'
import likeActivity from './assets/images/heart-activity.svg'
import birthdayIcon from './assets/images/birthday-icon.svg'

function Likes(){
    return(
        <>
            <div className="title">
                <p>Liked posts & Comments</p>
            </div>
            <div className="activity">
                <div className='activity-user'>
                    <img src={AvatarLogo} alt="avatar-logo" id='activity-user'/>
                    <img src={commentActivity} alt="comment-activity" id='activity-icon' style={{backgroundColor: '#43b855'}}/>
                </div>
                <span>
                    <p><strong>Józef Narrdowski</strong> commented your post.</p>
                    <p>3 hours</p>
                </span>
            </div>
            <div className="activity">
                <div className='activity-user'>
                    <img src={AvatarLogo} alt="avatar-logo" id='activity-user'/>
                    <img src={likeActivity} alt="comment-activity" id='activity-icon' style={{backgroundColor: '#fd0000'}}/>
                </div>
                <span>
                    <p><strong>Józef Narrdowski</strong> commented your post.</p>
                    <p>3 hours</p>
                </span>
            </div>
            <div className="activity">
                <div className='activity-user'>
                    <img src={AvatarLogo} alt="avatar-logo" id='activity-user'/>
                    <img src={birthdayIcon} alt="comment-activity" id='activity-icon' style={{backgroundColor: '#f3328c'}}/>
                </div>
                <span>
                    <p><strong>Józef Narrdowski</strong> commented your post.</p>
                    <p>3 hours</p>
                </span>
            </div>
        </>
    )
}

export default Likes;