import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as Notification } from '../svg/notification.svg';
import { ReactComponent as NewNotification } from '../svg/notification-new.svg';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [numberOfNotifications, setNumberOfNotifications] = useState(0);
    const [showNotifications, setShowNotifications] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
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

    const toggleNotification = async (notification_id, currentStatus) => {
        const token = localStorage.getItem('token');
        let action = currentStatus ? 'markAsUnread' : 'markAsRead';
        try {
            const response = await fetch(`http://localhost:5000/notifications/${action}`, {
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

    const toggleNotifications = () => {
        setShowNotifications(!showNotifications);
    };

    return (
        <div className='pr-12'>
            <button className={`${numberOfNotifications > 0
                ? 'bg-red-500 hover:bg-red-600 rounded-full'
                : ' hover:bg-gray-600'
                } text-white px-4 py-2 rounded glow-${numberOfNotifications > 0 ? 'new' : 'default'}`}
                onClick={toggleNotifications}>
                {numberOfNotifications > 0 ? (
                    <NewNotification className="h-8 w-8" />
                ) : (
                    <Notification className="h-8 w-8" />
                )}
            </button>
            {showNotifications && (
                <ul className="absolute mt-2 bg-gray-800 rounded shadow-lg overflow-hidden z-50 border-2 border-black">
                    {notifications.map((notification) => (
                        <li key={notification.notification_id} className="px-4 py-2">
                            <p>{notification.notification_text}</p>
                            <p>Date: {new Date(notification.notification_date).toLocaleString()}</p>
                            <button className="mr-2 text-sm px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded" onClick={() => deleteNotification(notification.notification_id)}>Delete</button>
                            <button className="mr-2 text-sm px-2 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded"
                                onClick={() => toggleNotification(notification.notification_id, notification.notification_read)}>
                                {notification.notification_read ? 'Mark as unread' : 'Mark as read'}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );


};
export default Notifications;