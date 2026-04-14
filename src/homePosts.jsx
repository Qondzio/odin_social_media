import { useEffect, useState } from 'react';
import Posts from './posts.jsx'
import PostsHeader from './postsHeader.jsx'
import { UserContext } from './userContext.jsx'
import { useContext} from 'react'

function HomePosts(){
    const [active, setActive]=useState('recent');
    const [posts, setPosts]=useState(null);
    const loggedUser=useContext(UserContext);
    
    useEffect(()=>{
        (async function fetchPosts(){
            if(active === 'recent'){
                const result=await getRecentPosts();
                setPosts(result);
            }
            else if(active === 'following'){
                const result= await getFollowingPosts();
                setPosts(result);
            }
            else{
                const result= await getMyPosts();
                setPosts(result);
            }
        })();
        
    }, [active])

    async function getRecentPosts(){
        const result=await fetch('/api/get-all-posts');
        const data=await result.json();   
        return data.message;
    }

    async function getFollowingPosts(){
        const result=await fetch(`/api/get-following-posts`);
        const data=await result.json();
        return data.message;
    }

    async function getMyPosts(){
        const result=await fetch(`/api/get-posts-by-id/${loggedUser.user.userId}`);
        const data=await result.json();
        return data;
    }

    return(
        <>
            <PostsHeader active={active} setActive={setActive} />
            <Posts posts={posts} loggedUser={loggedUser} active={active} getRecentPosts={getRecentPosts} getFollowingPosts={getFollowingPosts} getMyPosts={getMyPosts} />
        </>
    )
}

export default HomePosts;