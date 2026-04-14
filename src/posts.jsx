import ReactionIcon from './assets/images/post-reactions-icon.svg'
import ReactionIconRed from './assets/images/heart-activity-red.svg'
import CommentsIcon from './assets/images/post-comments-icon.svg'
import AvatarLogo from './assets/images/avatar-logo.svg';
import SendMessageIcon from './assets/images/send-message-icon.svg'
import { useEffect, useState } from 'react';
import './assets/css/post.css';
import { useNavigate } from 'react-router';
import formatTimeSmart from './app/controllers/timeFormatter.js';


function posts(props){    
    const [imagePreview, setImagePreview]=useState(null);
    const [reactionsPreview, setReactionsPreview]=useState(null);
    const [postPreview, setPostPreview]= useState(null);
    const [posts, setPosts]=useState(null);
    const [commentText, setCommentText]=useState('');
    const [activeReplyCommentId, setActiveReplyCommentId] = useState(null);
    const [replyCommentText, setReplyCommentText]=useState('');
    const [replies, setReplies]=useState(null);    
    const navigate=useNavigate();

    useEffect(()=>{ 
        setPosts(props.posts || null) 
    },[props.posts], [commentText])

    function setImgPreview(image){
        setImagePreview(image);
    }

    function closeImgPreview(){
        setImagePreview(null);
    }

    function closePost(){
        setPostPreview(null);
    }


    async function toggleLike(postId) {
    setPosts(prev =>
        prev.map(post => {
            if (post.id === postId) {
                const liked = isLiked(post);
                const updatedLikes = liked
                    ? post.likes.filter(l => l.userId !== props.loggedUser.user.userId)
                    : [...post.likes, { userId: props.loggedUser.user.userId }];
                const updatedPost = { ...post, likes: updatedLikes };

                return updatedPost;
            }
            return post;
        })
    );

    if (postPreview?.id === postId) {
        const res = await getSinglePost(postId);
        const data = await res.json();
        setPostPreview(data.message);
    }
}

    function isLiked(post){
        if(!post) return false
        return (post.likes || []).some(like => like.userId === props.loggedUser.user.userId);
    }

    function isCommentLiked(comment){
        if(!comment) return false
        return (comment.commentLikes || []).some(c=>c.userId === props.loggedUser.user.userId);
    }

    async function likePost(postId){
        await fetch(`/api/like-post/${postId}`,{method: "POST"});   
    }

    async function unlikePost(postId){
        await fetch(`/api/unlike-post/${postId}`,{method: "POST"});   
    }

    async function likeComment(commentId, postId){
        const result=await fetch(`/api/like-comment/${commentId}`,{method: "POST"});
        if(result.ok){
            const res=await getSinglePost(postId);
            const data=await res.json();
            setPostPreview(data.message);
        }
        
    }

    async function unlikeComment(commentId, postId){
        const result=await fetch(`/api/unlike-comment/${commentId}`,{method: "POST"});
        if(result.ok){
            const res=await getSinglePost(postId);
            const data=await res.json();
            setPostPreview(data.message);
        }
    }

    async function getPostsReactions(postId){
        const result=await fetch(`/api/get-posts-reactions/${postId}`);
        const data=await result.json();
        console.log(data);
        
        setReactionsPreview(data.message);
    }

    async function getSinglePost(postId){
        return await fetch(`/api/get-single-post/${postId}`);
    }

    async function commentPost(e,postId, parentId=null){
        e.preventDefault();
        setCommentText('');
        setReplyCommentText('');
        const result=await fetch(`/api/comment-post/${postId}`,{
            method: "POST", 
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                content: parentId ? replyCommentText: commentText,
                parentId
            })
        }); 
        if(result.ok){
            let data;
            if(props.active === 'recent'){
                data= await props.getRecentPosts();
            }
            else if(props.active === 'following'){
                data=  await props.getFollowingPosts();
            }
            else if(props.active === 'my'){
                data=  await props.getMyPosts();
            }
            else{
                const result=await props.getPosts();
                data=await result.json();
            }
            setPosts(data);
            setPostPreview(data.find(post => post.id === postId));
        }
    }

    return(
        <>    
            <div className='posts-container'>
                {posts?.length === 0 && (
                    <p style={{textAlign: 'center', fontSize: '1rem', textTransform: 'capitalize'}}>no posts</p>
                )}
                {posts?.map((post,index)=>{
                    const liked=isLiked(post);
                    return (
                        <div className='post' key={index}>
                            <div className='post-author'>
                                <img src={post.user.avatarUrl||AvatarLogo} alt="author-logo" onClick={()=>navigate(`/user/${post.user.id}`)}/>
                                <span className='author-info' onClick={()=>navigate(`/user/${post.user.id}`)}>
                                    <h5 style={{textTransform: "capitalize", cursor: 'pointer'}}>{post.user.name + ' ' + post.user.lastName}</h5>
                                    <p>{formatTimeSmart(post.createdAt)}</p>
                                </span>
                            </div>
                            <div className='post-text'>
                                <p style={{ whiteSpace: "pre-line" }}>{post.content.replace(/[\r\n]{3,}/g, "\n\n").trim()}</p>
                            </div>
                            {post.imageUrl && (
                                <div className='post-photo' style={{cursor: "pointer"}} onClick={()=>setImgPreview(post.imageUrl)}>
                                    <img src={post.imageUrl} alt="post-photo" />
                                </div>
                            )}
                            <div className='post-reactions'>
                                <div style={{display: 'flex', gap: '2rem'}}>
                                    <span onClick={()=>{
                                        liked ? unlikePost(post.id) : likePost(post.id);
                                        toggleLike(post.id)
                                    }}>
                                        <img src={isLiked(post) ? ReactionIconRed : ReactionIcon} alt="post-reaction-icon"/>
                                        <p>{post.likes.length}</p>
                                    </span>
                                    <span onClick={async ()=>{
                                        const res= await getSinglePost(post.id)
                                        const data=await res.json()
                                        setPostPreview(data.message);
                                        setReplies(null)
                                    }}>
                                        <img src={CommentsIcon} alt="post-comments-icon" />
                                        <p >{post.comments.length}</p>
                                    </span>
                                </div>
                                <div >
                                    <p onClick={()=>getPostsReactions(post.id)} className='see-reactions'>See reactions</p>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
            {imagePreview && (
                <div className="image-large" onClick={closeImgPreview}>
                    <img src={imagePreview} alt="image-large" id='image-large-img'/>
                </div>
            )}
            {postPreview && (
                <div className="post-preview" onClick={closePost}>
                    <div className='post' style={{width: '600px'}} onClick={(e) => e.stopPropagation()}>
                        <div className='post-author'>
                            <img src={postPreview.user?.avatarUrl || AvatarLogo} alt="author-logo" />
                            <span className='author-info'>
                                <h5 style={{textTransform: "capitalize"}}>{postPreview.user?.name + ' ' + postPreview.user?.lastName}</h5>
                                <p>{formatTimeSmart(postPreview.createdAt)}</p>
                            </span>
                        </div>
                        <div className='post-text'>
                            <p style={{ whiteSpace: "pre-line" }}>{postPreview.content.replace(/[\r\n]{3,}/g, "\n\n").trim()}</p>
                        </div>
                        {
                        postPreview.imageUrl && (
                            <div className='post-photo' style={{cursor: "pointer"}} onClick={(e) => {
                                e.stopPropagation();
                                setImgPreview(postPreview.imageUrl);
                            }}>
                                <img src={postPreview.imageUrl} alt="post-img-preview" />
                            </div>
                        )}
                        <div className='post-reactions'>
                            <div style={{display: 'flex', gap: '2rem'}}>
                                <span onClick={()=>{
                                    isLiked(postPreview) ? unlikePost(postPreview.id) : likePost(postPreview.id);
                                    toggleLike(postPreview.id)
                                }}>
                                    <img src={isLiked(postPreview) ? ReactionIconRed : ReactionIcon} alt="post-reaction-icon"/>
                                    <p>{postPreview.likes.length}</p>
                                </span>
                                <span>
                                    <img src={CommentsIcon} alt="post-comments-icon" />
                                    <p>{postPreview.comments.length}</p>
                                </span>
                            </div>
                            <div >
                                <p onClick={()=>getPostsReactions(postPreview.id)} className='see-reactions'>See reactions</p>
                            </div>
                        </div>
                        <div className='post-comments'>
                            {postPreview.comments.map((comment,index)=>{
                                return (comment.parentId === null && (
                                    <div className='comment' key={index}>
                                    <img src={comment.user?.avatarUrl || AvatarLogo} alt="author-logo" />
                                    <div className='comment-info'>
                                        <span style={{display: 'flex', justifyContent: 'space-between'}}>
                                            <div className='comment-info-author'>
                                                <h5 style={{textTransform: "capitalize"}}>{comment.user?.name + ' ' + comment.user?.lastName}</h5>
                                                <p>{formatTimeSmart(comment.createdAt)}</p>
                                                <p style={{fontSize: '0.9rem', marginTop: '10px'}}>{comment.content}</p>
                                            </div>
                                            <div id='comment-likes'>
                                                <p>{comment.commentLikes?.length}</p>
                                                <img src={isCommentLiked(comment) ? ReactionIconRed : ReactionIcon} alt="comment-likes" id='comment-likes-icon' onClick={()=>isCommentLiked(comment)? unlikeComment(comment.id, postPreview.id) : likeComment(comment.id, postPreview.id)}/>
                                            </div>
                                        </span>
                                        <div className='replies' style={{paddingTop: '10px'}}>
                                            <p style={{fontSize: '0.7rem', cursor: 'pointer'}} onClick={()=>!activeReplyCommentId || activeReplyCommentId !== comment.id ? setActiveReplyCommentId(comment.id) : setActiveReplyCommentId(null)}>
                                                Reply
                                            </p>
                                            {postPreview.comments.some(c => c.parentId === comment.id) && (
                                                <>
                                                    <span style={{borderLeft: '1px solid #e2e5e9', fontSize: '0.7rem'}}></span>
                                                    <p style={{fontSize: '0.7rem', cursor: 'pointer'}} onClick={()=>replies === comment.id ? setReplies(null) : setReplies(comment.id)}>
                                                        {replies === comment.id ? 'Hide replies' : "Show replies"}
                                                    </p>
                                                </>
                                            )}
                                        </div>
                                        {replies === comment?.id && 
                                            postPreview.comments.map((c,indexx)=>c.parentId === replies && (
                                                <div className='comment-of-comment' key={indexx}>
                                                    <img src={c.user?.avatarUrl || AvatarLogo} alt="author-logo" />
                                                    <span>
                                                        <div id='commenter-info'>
                                                            <h5 style={{textTransform: 'capitalize', margin: 0}}>{c.user.name + ' ' + c.user.lastName}</h5>
                                                            <p style={{fontSize: '0.7rem'}}>{formatTimeSmart(c.createdAt)}</p>
                                                            <p id='commenter-info-comment' >{c.content}</p>
                                                        </div>
                                                        <div id='comment-likes'>
                                                            <p>{c.commentLikes?.length}</p>
                                                            <img src={isCommentLiked(c) ? ReactionIconRed : ReactionIcon} alt="comment-likes" id='comment-likes-icon' onClick={()=>isCommentLiked(c)? unlikeComment(c.id, postPreview.id) : likeComment(c.id, postPreview.id)}/>
                                                        </div>
                                                    </span>
                                                </div>
                                            ))
                                        }
                                        {activeReplyCommentId === comment.id && (
                                            <div className='comment-post'style={{width: '100%'}} >
                                                <img src={props.loggedUser.user.user.avatarUrl || AvatarLogo} alt="comment-post-user-logo" />
                                                <form id='reply-comment' onSubmit={(e) => commentPost(e, postPreview.id, comment.id)} >
                                                    <textarea value={replyCommentText} type="text" id='comment' name='comment' required placeholder='Reply to a comment...' onChange={(e)=>setReplyCommentText(e.target.value)}/>
                                                    <span>
                                                        <button type='submit' form='reply-comment'>
                                                            <img src={SendMessageIcon} alt="send-message" id='send-message' />
                                                        </button>
                                                    </span>
                                                </form>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                ))
                            })}
                            {postPreview.comments.length === 0 && (
                                <p style={{textAlign: 'center', fontSize: '0.9rem'}}>No comments yet</p>
                            )}
                        </div>
                    </div>
                    <div className='comment-post' onClick={(e) => e.stopPropagation()}>
                        <img src={props.loggedUser.user.user.avatarUrl || AvatarLogo} alt="comment-post-user-logo" />
                        <form id='send-comment' onSubmit={(e) => commentPost(e, postPreview.id)}>
                            <textarea value={commentText} type="text" id='comment' name='comment' required placeholder='Write a comment...' onChange={(e)=>setCommentText(e.target.value)}/>
                            <span>
                                <button type='submit' form='send-comment'>
                                    <img src={SendMessageIcon} alt="send-message" id='send-message' />
                                </button>
                            </span>
                        </form>
                    </div>
                </div>
                )
            }
            {reactionsPreview && (
                <div className='reactions-review' onClick={()=>setReactionsPreview(null)}>
                    <div id='post-reactions-title'>
                        <p>Post Reactions</p>
                    </div>
                    <div className='reactions'>
                        {reactionsPreview.map((reaction,index)=>
                            <div className='reaction' key={index}>
                                <div className='post-author'>
                                    <img src={reaction.user.avatarUrl||AvatarLogo} alt="author-logo" id='reactions-author-logo' />
                                    <span className='author-info'>
                                        <h5 style={{textTransform: "capitalize"}}>{reaction.user.name + ' ' + reaction.user.lastName}</h5>
                                    </span>
                                </div>
                                <img src={ReactionIconRed} alt="reaction-icon" id='reaction_icon'/>
                            </div>
                        )}
                    </div>
                    {reactionsPreview.length === 0 && (
                        <p className='no-reaction'>No reactions yet</p>
                    )}
                </div>
            )}
        </>
    )
    
}

export default posts