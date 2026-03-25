import './assets/css/profile.css'
import AvatarLogo from './assets/images/avatar-logo.svg'
import CommentsIcon from './assets/images/post-comments-icon-white.svg'

function profile(props){
    return(
        <>
            <div className='title'>
                <p>Profile</p>
            </div>
            <div className='profile-info'>
                <img src={AvatarLogo} alt="profile-logo" />
                <div className='profile-info-details'>
                    <span id='name'>
                        <p>Adam</p>
                        <p>Mickiewicz</p>
                    </span>
                    <p>🎂 2025-10-23</p>
                    <div className='popularity'>
                        <span>
                            <p id='number'>3</p>
                            <p>Followers</p>
                        </span>
                        <span>
                            <p id='number'>83</p>
                            <p>Following</p>
                        </span>
                        <span>
                            <p id='number'>155</p>
                            <p>Posts</p>
                        </span>
                    </div>
                    <div className='actions'>
                        <button type='button' id='follow'>Follow</button>
                        <button type='button' id='comment'>
                            <img src={CommentsIcon} alt="comment-icon" />
                        </button>
                    </div>
                </div>
            </div>
            <div className='profile-posts'>
                <div className='profile-posts-title'>
                    <p>Posts</p>
                </div>
                {props.content}
            </div>
        </>
    )
}

export default profile;

