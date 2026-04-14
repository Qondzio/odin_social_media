import { useState, useEffect } from 'react';
import {UserContext} from './userContext.jsx';
import { useNavigate } from 'react-router';
import { userSocket } from './userSocket.jsx';

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loadingLogin, setLoadingLogin]=useState(true);
  const navigate=useNavigate();    
  
  useEffect(() => {
    (async function loadLogin(){
        const result=await fetch('/api/checkIfLogged');           
        if(!result.ok){
          navigate('/');
        }
        else{
          const data=await result.json();          
          setUser(data);
          setLoadingLogin(false);
        }
    })();
  }, []);

  const socket=userSocket(user?.id);

  return (
    <UserContext.Provider value={{ user, setUser, loadingLogin, socket }}>
      {children}
    </UserContext.Provider>
  );
}