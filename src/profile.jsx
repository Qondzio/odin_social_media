import './assets/css/profile.css'
import AvatarLogo from './assets/images/avatar-logo.svg'
import CommentsIcon from './assets/images/post-comments-icon-white.svg'
import ChangeAvatarIcon from './assets/images/change-avatar-icon.svg'
import { useContext, useEffect, useRef, useState} from 'react'
import { useNavigate, useParams } from 'react-router';
import { UserContext } from './userContext.jsx'
import Posts from './posts.jsx'
import CreatePost from './createPost.jsx'

function Profile(){
    const fileRef=useRef();
    const followNumber=useRef();
    const params=useParams();
    const loggedUser=useContext(UserContext);
    const [user, setUser]=useState(null);
    const [isFollowing, setIsFollowing]=useState(false);
    const [posts, setPosts]=useState([]);
    const isOwnProfile=loggedUser.user.userId === user?.id;
    const navigate=useNavigate();


    useEffect(()=>{
        (async function findUserById(){
            const result=await fetch(`/api/find-user-data/${params.userId}`);            
            if(result.ok){
                const data= await result.json();
                setUser(data);
                if(loggedUser?.user?.userId){
                    setIsFollowing(data.followers.some(f => f.followerId === loggedUser.user.userId))
                }
            }
            else{
                setUser(false);
            }          
        })();
        (async function Posts(){
            const result=await getPosts();
        if(result.ok){
                const data= await result.json();
                setPosts(data);
            }
        })()
    },[params.userId]);

    async function getPosts(){
        return await fetch(`/api/get-posts-by-id/${params.userId}`);
            
    }

    async function followUser(){
        try {
            const result=await fetch(`/api/follow-user/${user.id}`,{
                method: 'POST'
            });
            if(result.ok){
                setIsFollowing(true);
                const count=parseInt(followNumber.current.textContent);
                followNumber.current.textContent=count+1;
            }
            
        } catch (error) {
            console.log(error);            
        }
    }

    async function unfollowUser(){
        try {
            const result=await fetch(`/api/unfollow-user/${user.id}`,{
                method: 'POST'
            });
            if(result.ok){
                setIsFollowing(false);
                const count=parseInt(followNumber.current.textContent);
                followNumber.current.textContent=count-1;
            }
        } catch (error) {
            console.log(error);            
        }
    }
    
    
    async function handleFileUpload(e){   
        const file=e.target.files[0];
        if(!file) return;

        const formData= new FormData();
        formData.append("file", file);

        try {
            await fetch('/api/upload-file',{
                method: "POST",
                body: formData
            });
            window.location.reload();
        }
        catch (error) {
            console.log('Error uploading file: ', error);
        }
    }

    return(
        <>
            {user && (
            <>
                <div className='title'>
                    <p>Profile</p>
                </div>
                <div className='profile-info'>
                    <span id={isOwnProfile ? 'profile-avatar-logged' : 'profile-avatar'} onClick={isOwnProfile ? ()=>fileRef.current.click() : null}>
                        <input ref={fileRef} type="file" id='file' onChange={handleFileUpload} style={{display: "none"}}/>
                        <img src={user?.avatarUrl || AvatarLogo} alt="profile-logo" id='avatar-icon-logged'/>
                        <img src={ChangeAvatarIcon} alt="change-profile-logo" id='change-avatar-icon'/>
                    </span>
                    <div className='profile-info-details'>
                        <span id='name'>
                            <p>{user.name}</p>
                            <p>{user.lastName}</p>
                        </span>
                        <p>🎂 {user.birthDate}</p>
                        <div className='popularity'>
                            <span>
                                <p id='number' ref={followNumber}>{user.followers.length}</p>
                                <p>Followers</p>
                            </span>
                            <span>
                                <p id='number'>{user.following.length}</p>
                                <p>Following</p>
                            </span>
                            <span>
                                <p id='number'>
                                    {posts.length}
                                </p>
                                <p>Posts</p>
                            </span>
                        </div>
                        {!isOwnProfile && (
                        <div className='actions'>
                            {isFollowing
                            ? 
                            <button type='button' id='unfollow' onClick={()=>unfollowUser()}>Followed</button> 
                            : 
                            <button type='button' id='follow' onClick={()=>followUser()}>Follow</button> 
                            }
                            <button type='button' id='comment' onClick={()=>navigate(`/messages/${user.id}`)}>
                                <img src={CommentsIcon} alt="comment-icon"/>
                            </button>
                        </div>
                        )}
                    </div>
                </div>
                <div className='profile-posts'>
                    <div className='profile-posts-title'>
                        <p>{isOwnProfile ? 'My Posts' : 'Posts'}</p>
                    </div>
                    {isOwnProfile && (
                        <div className='create-post-on-profile'>
                            <CreatePost getPosts={getPosts} setPosts={setPosts}/>
                        </div>
                    )}
                    <Posts user={user} loggedUser={loggedUser} posts={posts} getPosts={getPosts}/>
                </div>
            </>
            )}
            {user === false && (
                <div className='user-error'>
                    <p>This user does not exist.</p>
                </div>
            )}
        </>
    )
}

export default Profile;