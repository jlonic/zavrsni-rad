import { Link } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import Search from './Search';
import Logout from './Logout';
import Notifications from './Notifications';
import { ReactComponent as Messages } from '../svg/messages.svg';

const Navbar = () => {
    const token = localStorage.getItem('token');
    const user = jwtDecode(token);
    const userRole = user.user_role;
    const [profilePicture, setProfilePicture] = useState('');
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    const fetchProfilePicture = useCallback(async () => {
        try {
            const decodedToken = jwtDecode(token);
            const response = await fetch(`http://localhost:5000/users/${decodedToken.username}`);
            const userData = await response.json();
            if (response.ok) {
                setProfilePicture(userData[0].profile_picture);
            } else {
                console.error('Failed to fetch profile picture');
            }
        } catch (error) {
            console.error(error);
        }

    }, [token]);

    useEffect(() => {
        fetchProfilePicture();
    }, [fetchProfilePicture]);

    const toggleProfileMenu = () => {
        setShowProfileMenu(!showProfileMenu);
    };

    return (
        <div className='pb-20'>
            <nav className="flex justify-between items-center fixed w-full top-0 z-50 bg-gray-800 text-white shadow-md px-4 py-2">
                <Search />
                <button className="ml-2 px-4 py-2 rounded glow hover:bg-gray-600">
                    <Link to="/dashboard" className="text-white hover:text-gray-300">Dashboard</Link>
                </button>
                <button className="ml-2 px-4 py-2 rounded glow hover:bg-gray-600">
                    <Link to="/charts" className="text-white hover:text-gray-300">Charts</Link>
                </button>
                {userRole === 'administrator' && (
                    <button className="ml-2 px-4 py-2 rounded glow hover:bg-gray-600">
                        <Link to="/admin" className="text-white hover:text-gray-300">Admin Panel</Link>
                    </button>
                )}
                {(userRole === 'administrator' || userRole === 'moderator') && (
                    <button className="ml-2 px-4 py-2 rounded glow hover:bg-gray-600">
                        <Link to="/moderator" className="text-white hover:text-gray-300">Moderation Panel</Link>
                    </button>
                )}
                <button className="ml-2 px-4 py-2 rounded glow hover:bg-gray-600">
                    <Link to="/messages" className="text-white hover:text-gray-300"><Messages className='w-8 h-8' /></Link>
                </button>
                <Notifications />
                <div className="relative">
                    <button onClick={toggleProfileMenu} className="flex items-center focus:outline-none">
                        <img src={`http://localhost:5000${profilePicture}`} alt='' className="w-12 h-12 rounded-full" />
                    </button>
                    {showProfileMenu && (
                        <div className="absolute right-0 mt-2 w-48 bg-gray-800 border-2 border-black rounded-lg shadow-lg py-1">
                            <Link to={`/users/${user.username}`} className="block px-4 py-2 text-white hover:bg-gray-700">User Profile</Link>
                            <Link to="/settings" className="block px-4 py-2 text-white hover:bg-gray-700">Settings</Link>
                            <Logout />
                        </div>
                    )}
                </div>
            </nav>
        </div>
    )
};

export default Navbar;