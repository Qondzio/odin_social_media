import { useEffect, useState } from 'react';
import io from 'socket.io-client';

export function userSocket(userId) {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!userId) return;

    const newSocket = io("http://localhost:3000",{
      auth:{
        userId
      }
    });
    
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [userId]);

  return socket;
}