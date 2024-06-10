import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [numberOfNotifications, setNumberOfNotifications] = useState(0);
    const navigate = useNavigate();

    useEffect(() => { //redirect to login if not logged in
        if (!localStorage.getItem('token')) {
            navigate('/login');
        }
        getNotifications();
    }, [navigate]);

    const getNotifications = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://localhost:5000/notifications/`, {
                headers: {
                    'GET': 'application/json',
                    'Authorization': `Bearer: ${token}`
                }
            });

            const data = await response.json();
            data.sort((a, b) => new Date(b.notification_date) - new Date(a.notification_date));
            setNotifications(data);
            const unreadCount = data.filter(notification => !notification.notification_read).length;
            setNumberOfNotifications(unreadCount);

        } catch (error) {
            console.error(error);
        }
    };

    const markAsRead = async (notification_id) => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://localhost:5000/notifications/markAsRead`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer: ${token}`
                },
                body: JSON.stringify({ notification_id })
            });

            if (response.ok) {
                getNotifications();
            }
        } catch (error) {
            console.error(error);
        }
    };

    const deleteNotification = async (notification_id) => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://localhost:5000/notifications/deleteNotification`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer: ${token}`
                },
                body: JSON.stringify({ notification_id })
            });

            const data = await response.json();
            if (response.ok) {
                getNotifications();
            }
            if (data.notification_id) {
                setNotifications(notifications.filter(notification => notification.notification_id !== notification_id));
            }
        } catch (error) {
            console.error(error);
        }
    };

    const markAsUnread = async (notification_id) => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://localhost:5000/notifications/markAsUnread`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer: ${token}`
                },
                body: JSON.stringify({ notification_id })
            });

            if (response.ok) {
                getNotifications();
            }

        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <ul>
                {numberOfNotifications} unread notifications
                {notifications.map((notification) => (
                    <li key={notification.notification_id}>
                        <p>{notification.notification_text}</p>
                        <p>Date: {new Date(notification.notification_date).toLocaleString()}</p>
                        <p>Read: {notification.notification_read ? 'Yes' : 'No'}</p>
                        <button onClick={() => markAsRead(notification.notification_id)}>Mark as read</button>
                        <button onClick={() => deleteNotification(notification.notification_id)}>Delete</button>
                        <button onClick={() => markAsUnread(notification.notification_id)}>Mark as unread</button>
                    </li>
                ))}
            </ul>
        </div>
    );

};
export default Notifications;