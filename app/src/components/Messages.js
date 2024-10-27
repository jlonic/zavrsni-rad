import { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import io from 'socket.io-client';
import Navbar from './Navbar';

const Messages = () => {
    const { receiver_id } = useParams();
    const [messages, setMessages] = useState([]); //to display messages 
    const [message, setMessage] = useState(""); //for error messages
    const navigate = useNavigate();
    const [userId, setUserId] = useState(0);
    const [socket, setSocket] = useState(null);
    const [username, setUsername] = useState("");
    const [profilePicture, setProfilePicture] = useState("");
    const messagesEndRef = useRef(null);


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
                const getuser = await fetch(`http://localhost:5000/users/get/${receiver_id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    }
                });
                const userdata = await getuser.json();

                setUsername(userdata[0].username);
                setProfilePicture(userdata[0].profile_picture);
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

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [scrollToBottom]);

    useEffect(() => {
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
        <div className='bg-gray-700 min-h-screen'>
            <Navbar />
            <div className='text-gray-200 p-4'>
                <h1>
                    <img src={`http://localhost:5000${profilePicture}`} alt='' className="w-12 h-12 rounded-full"></img>{username}
                </h1>
                <div className="flex flex-col pt-6">
                    {messages.length > 0 ? (
                        messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`message ${msg.sender_id === userId ? 'self-end' : 'self-start'} bg-gray-800 p-4 rounded mb-4`}>
                                <h3 className="text-white">
                                    {msg.message}
                                </h3>
                            </div>
                        ))
                    ) : (
                        <h3>No messages</h3>
                    )}
                    <div ref={messagesEndRef} />
                    <div>
                        <form onSubmit={sendMessage} className="mt-4 ">
                            <input type="text" name="message" placeholder="Message" className="w-full p-2 bg-gray-900 text-gray-200 rounded mt-2" />
                            <button type="submit" className="bg-gray-400 text-white px-4 py-2 rounded mt-2 ml-2">Send</button>
                        </form>
                    </div>
                </div>
                {message && <div className="error-message mt-4">{message}</div>}
            </div>
        </div>
    )
};
export default Messages;