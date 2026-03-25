import PostPhoto from './assets/images/post-photo.jpg';
import ReactionIcon from './assets/images/post-reactions-icon.svg'
import CommentsIcon from './assets/images/post-comments-icon.svg'
import AvatarLogo from './assets/images/avatar-logo.svg';

function posts(){    
    return(
        <div className='posts-container'>
            <div className='post'>
                <div className='post-author'>
                    <img src={AvatarLogo} alt="author-logo" />
                    <span className='author-info'>
                        <h5>Tajemnicze miejsca na ziemi</h5>
                        <p>2 min</p>
                    </span>
                </div>
                <div className='post-text'>
                    <p>Braszów - serce rumuńskich Karpat
                        Braszów to jedno z najpiękniejszych miast w Rumunii - połączenie historii, gór i niesamowitego klimatu.
                        Urokliwe stare miasto z kolorowymi
                        Spacerując jego uliczkami można poczuć klimat dawnych czasów, a jednocześnie mieć góry dosłownie na wyciągnięcie ręki.
                        To miejsce, które potrafi zaskoczyć - spokojne, klimatyczne i pełne historii.
                        Kto był albo planuje?😍
                    </p>
                </div>
                <div className='post-photo'>
                    <img src={PostPhoto} alt="post-photo" />
                </div>
                <div className='post-reactions'>
                    <span>
                        <img src={ReactionIcon} alt="post-reaction-icon" />
                        <p>0</p>
                    </span>
                    <span>
                        <img src={CommentsIcon} alt="post-comments-icon" />
                        <p>0</p>
                    </span>
                </div>
            </div>
            <div className='post'>
                <div className='post-author'>
                    <img src={AvatarLogo} alt="author-logo" />
                    <span className='author-info'>
                        <h5>Tajemnicze miejsca na ziemi</h5>
                        <p>2 min</p>
                    </span>
                </div>
                <div className='post-text'>
                    <p>Braszów - serce rumuńskich Karpat
                    Braszów to jedno z najpiękniejszych miast w Rumunii - połączenie historii, gór i niesamowitego klimatu.
                    Urokliwe stare miasto z kolorowymi
                    Spacerując jego uliczkami można poczuć klimat dawnych czasów, a jednocześnie mieć góry dosłownie na wyciągnięcie ręki.
                    To miejsce, które potrafi zaskoczyć - spokojne, klimatyczne i pełne historii.
                    Kto był albo planuje?😍
                    </p>
                </div>
                <div className='post-reactions'>
                    <span>
                        <img src={ReactionIcon} alt="post-reaction-icon" />
                        <p>0</p>
                    </span>
                    <span>
                        <img src={CommentsIcon} alt="post-comments-icon" />
                        <p>0</p>
                    </span>
                </div>
            </div>
        </div>
    )
}

export default posts