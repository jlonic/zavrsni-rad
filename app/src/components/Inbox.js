import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import { jwtDecode } from "jwt-decode";
import Navbar from './Navbar';

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
                data.sort((a, b) => new Date(b.message_date) - new Date(a.message_date));
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
        <div className='bg-gray-700 min-h-screen'>
            <Navbar />
            <div className='text-gray-200 p-4'>
                <h1>Messages</h1>
                <div>
                    {conversations.length > 0 && userId !== null ? (
                        conversations.map((conversation) => (
                            <div key={conversation.message_id} className="bg-gray-800 p-4 rounded mb-4">
                                <h3>
                                    {userId === conversation.sender_id ? (
                                        <a href={`http://localhost:3000/messages/${conversation.receiver_id}`} className="text-gray-300 hover:underline">
                                            {conversation.receiver_username}
                                        </a>
                                    ) : (
                                        <a href={`http://localhost:3000/messages/${conversation.sender_id}`} className="text-gray-300 hover:underline">
                                            {conversation.sender_username}
                                        </a>
                                    )}
                                </h3>
                                <ul>
                                    <li>
                                        <p>{conversation.message} - {new Date(conversation.message_date).toLocaleDateString('en-gb')}</p>
                                    </li>
                                </ul>
                            </div>
                        ))
                    ) : (
                        <p>{message}</p>
                    )}
                </div>
            </div>
        </div>

    );
};

export default Inbox;
