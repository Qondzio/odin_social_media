import './assets/css/footer.css'

const date=new Date().getFullYear();

function Footer(){
    return(
        <footer>
            <p>Koobie © {date}</p>
        </footer>
    )
}

export default Footer;