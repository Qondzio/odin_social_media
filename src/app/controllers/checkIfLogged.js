async function checkIfLogged(){
    const result= await fetch('/api/checkIfLogged');
    
    if(!result.ok){
        return false;
    }
    else{
        const data= await result.json();
        return {loggedIn: true, data};
    }
    
}

export default checkIfLogged;