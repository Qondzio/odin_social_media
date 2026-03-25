import ErrorImage from './assets/images/error-image.svg'

function errorPage(){
    return(
    <div className='main'>
        <span>
            <img id='error-image' src={ErrorImage} alt="error-image" width={'250px'}/>
            <h3>This webpage does not exist.</h3>
        </span>
    </div>
)
}

export default errorPage;