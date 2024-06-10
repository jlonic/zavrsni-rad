import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import io from 'socket.io-client';
import '../Messages.css';

const Messages = () => {
    const { receiver_id } = useParams();
    const [messages, setMessages] = useState([]); //to display messages 
    const [message, setMessage] = useState(""); //for error messages
    const navigate = useNavigate();
    const [userId, setUserId] = useState(0);
    const [socket, setSocket] = useState(null);

    const getMessages = useCallback(async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://localhost:5000/messages/getMessagesWithUser/${receiver_id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (response.ok) {
                data.sort((a, b) => a.message_date - b.message_date);
                setMessages(data);
            }
            else {
                setMessage(data.message);
            }

        } catch (error) {
            console.error(error);
            setMessage("Error getting messages");
        }
    }, [receiver_id]);

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
        getMessages();
    }, [navigate, getMessages]);

    useEffect(() => {
        if (socket) {
            socket.on('newMessage', (data) => {
                setMessages((messages) => [...messages, data]);
                getMessages();
            });
        }
    }, [socket, receiver_id, getMessages]);

    useEffect(() => {
        return () => {
            if (socket) {
                socket.disconnect();
            }
        };
    }, [socket]);

    const sendMessage = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const message = e.target.message.value;
        if (message.length === 0) {
            return;
        }
        try {
            const response = await fetch(`http://localhost:5000/messages/sendMessage`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ receiver_id, message })
            });
            const data = await response.json();
            if (response.ok) {
                if (socket) {
                    socket.emit('sendMessage', (data));
                }
                e.target.message.value = '';
            } else {
                setMessage(data.message);
            }
        } catch (error) {
            console.error(error);
            setMessage("Error sending message");
        }
    };

    return (
        <div>
            <h1>Messages</h1>
            <div className="messages-container">
                {messages.length > 0 ? (
                    messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`message ${msg.sender_id === userId ? 'sent' : 'received'}`}>
                            <h3>
                                {msg.message}
                            </h3>
                        </div>
                    ))
                ) : (
                    <h3>No messages</h3>
                )}
                <div>
                    <form onSubmit={sendMessage}>
                        <input type="text" name="message" placeholder="Message" />
                        <button type="submit">Send</button>
                    </form>
                </div>
            </div>
            {message && <div className="error-message">{message}</div>}
        </div>
    )
};
export default Messages;