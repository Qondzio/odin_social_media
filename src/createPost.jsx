import { useRef, useState } from 'react';
import './assets/css/createPost.css'
import attachmentIcon from './assets/images/attachment-icon.svg'
import removeIcon from './assets/images/x-icon.svg'
import { useLocation } from 'react-router';
import loadingIcon from './assets/images/loading-icon.svg'
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function createPost(props){
    const [text, setText]=useState('');
    const [imageFile,setImageFile]=useState(null);
    const [imagePreview, setImagePreview]=useState(null);
    const location=useLocation();
    const [loading,setLoading]=useState(false);
    const fileRef=useRef();

    const notify = () => {
    toast.success('Post created!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        theme: "colored",
        transition: Bounce,
        style:{
            background:'green'
        }
    });
    };

    const notifyError = () =>{
    toast.error('Error while creating post', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
        style:{
            background:'red'
        }
        });
    }

    function handleFilePreview(e){   
        const file=e.target.files[0];
        if(!file) return;
        setImageFile(file);

        const previewUrl=URL.createObjectURL(file);
        setImagePreview(previewUrl);
    }

    async function uploadPost(e){
        e.preventDefault();
        setLoading(true);
        const formData=new FormData();
        formData.append('file', imageFile);
        formData.append('text', text);
        const result= await fetch('/api/create-post',{
            method: "POST",
            body: formData
        });
        setTimeout(()=>{setLoading(false)}, 1000);
        if(result.ok){
            setTimeout(async ()=>{
                notify();
                setText('');
                setImagePreview(null);
                if(location.pathname.startsWith('/user')){
                    const res=await props.getPosts();
                    const data=await res.json()
                    props.setPosts(data);
                }
            }, 1000);
        }
        else{
            setTimeout(()=>notifyError(), 1000);
        }
    }

    return(
        <>
            {!location.pathname.startsWith('/user') && (
                <div className="title">
                    <p>Create Post</p>
                </div>
            )}
            <form onSubmit={uploadPost} id="post-form" style={location.pathname.startsWith('/user') ? {borderTopLeftRadius:'10px' , borderTopRightRadius: '10px'} : undefined}>
                <textarea value={text} required name="post-text" id="post-text" placeholder='Show the world what you got to say...' onChange={(e)=>setText(e.target.value.slice(0, 2000))}></textarea>
            </form>
            <div className='image-preview'>
                {imagePreview && (
                    <>
                        <img src={imagePreview} alt="img-uploadedFile" id='image-preview'/>
                        <img src={removeIcon} alt="remove-img" id='remove-icon' onClick={()=>{setImagePreview(null); setImageFile(null)}}/>
                    </>
                )}
            </div>
            <div className='create-post-buttons'>
                <input ref={fileRef} type="file" id='file' onChange={handleFilePreview} style={{display: "none"}} />
                <img src={attachmentIcon} alt="attachment-icon" onClick={()=>fileRef.current.click()}/>
                <span>
                    <p id='text-limit'>{text.length}/2000</p>
                    <button type='submit' form='post-form' id='send-loading'>
                        {loading ? <img id='loading-icon' src={loadingIcon} alt="loading-icon" /> : 'Send'}
                    </button>
                </span>
            </div>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                pauseOnFocusLoss={false}
                draggable={false}
                pauseOnHover={false}
                theme="colored"
                transition={Bounce}
            />
        </>
    )
}

export default createPost;