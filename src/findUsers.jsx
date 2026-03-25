import searchIcon from './assets/images/search-icon.svg'
import './assets/css/search.css'

function FindUsers(){
    return(
        <>
            <div className="title">
                <p>Find users</p>
            </div>
            <div className="search">
                <img src={searchIcon} alt="search-icon" id='search-icon'/>
                <form action="">
                    <input type="text" id='searched-user' name='searched-user' placeholder='Enter a username'/>
                </form>
            </div>
        </>
    )
}

export default FindUsers;