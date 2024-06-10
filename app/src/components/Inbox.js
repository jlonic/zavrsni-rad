import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import { jwtDecode } from "jwt-decode";

const Inbox = () => {
    const [conversations, setConversations] = useState([]);
    const [message, setMessage] = useState(""); //for error messages
    const [userId, setUserId] = useState(0);
    const [socket, setSocket] = useState(null);

    const navigate = useNavigate();

    const getAllConversations = useCallback(async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch('http://localhost:5000/messages/getConversations', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (response.ok) {
                setConversations(data);
            }
            else {
                setMessage(data.message);
            }

        } catch (error) {
            console.error(error);
            setMessage("Error getting conversations");
        }
    }, []);

    useEffect(() => { // redirect to login if not logged in 
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        } else {
            const decodedToken = jwtDecode(token);
            setUserId(decodedToken.user_id);
        }

        const newSocket = io('http://localhost:5000');
        setSocket(newSocket);
        getAllConversations();
    }, [navigate, getAllConversations]);

    useEffect(() => {
        if (socket) {
            socket.on('newMessage', () => {
                getAllConversations();
            });
        }
    }, [socket, getAllConversations]);

    useEffect(() => {
        return () => {
            if (socket) {
                socket.disconnect();
            }
        };
    }, [socket]);

    return (
        <div>
            <h1>Messages</h1>
            <div>
                {conversations.length > 0 && userId !== null ? (
                    conversations.map((conversation) => (
                        <div key={conversation.message_id}>
                            <h3>
                                {userId === conversation.sender_id ? (
                                    <a href={`http://localhost:3000/messages/${conversation.receiver_id}`}>
                                        {conversation.receiver_username}
                                    </a>
                                ) : (
                                    <a href={`http://localhost:3000/messages/${conversation.sender_id}`}>
                                        {conversation.sender_username}
                                    </a>
                                )}
                            </h3>
                            <ul>
                                <li>
                                    <p>{conversation.message} - {conversation.message_date}</p>
                                </li>
                            </ul>
                        </div>
                    ))
                ) : (
                    <p>{message}</p>
                )}
            </div>
        </div>
    );
};

export default Inbox;
