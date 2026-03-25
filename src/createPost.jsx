import { useState } from 'react';
import './assets/css/createPost.css'
import attachmentIcon from './assets/images/attachment-icon.svg'

function createPost(){
    const [text, setText]=useState('');
    
    return(
        <>
            <div className="title">
                <p>Create post</p>
            </div>
            <form action="/api/create-post" method="POST" id="post-form">
                <textarea name="post-text" id="post-text" placeholder='Show the world what you got to say...' onChange={(e)=>setText(e.target.value)}></textarea>
            </form>
            <div className='create-post-buttons'>
                <img src={attachmentIcon} alt="attachment-icon" />
                <span>
                    <p id='text-limit'>{text.length}/2000</p>
                    <button type='submit' form='post-form' id='send'>Send</button>
                </span>
            </div>
        </>
    )
}

export default createPost;