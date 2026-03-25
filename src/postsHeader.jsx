import { useState } from "react";

function postsHeader(){
    const [active, setActive]=useState('recent');
    
    return(
        <div className='posts-header'>
            <span id={active === 'recent' ? 'active' : ''} onClick={()=>setActive('recent')}>Recent</span>
            <span id={active === 'following' ? 'active' : ''} onClick={()=>setActive('following')}>Following</span>
            <span id={active === 'my' ? 'active' : ''} onClick={()=>setActive('my')}>My posts</span>
        </div>
    )
}
export default postsHeader;