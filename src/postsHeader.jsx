function postsHeader({active, setActive}){
    return(
        <div className='posts-header'>
            <span id={active === 'recent' ? 'active' : ''} onClick={()=>setActive('recent')}>Recent</span>
            <span id={active === 'following' ? 'active' : ''} onClick={()=>setActive('following')}>Following</span>
            <span id={active === 'my' ? 'active' : ''} onClick={()=>setActive('my')}>My Posts</span>
        </div>
    )
}
export default postsHeader;