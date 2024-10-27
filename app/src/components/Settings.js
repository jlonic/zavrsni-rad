import Upload from "./Upload";
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import Navbar from "./Navbar";

const Settings = () => {
    const [profilePicture, setProfilePicture] = useState('');
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

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

    const removeProfilePicture = async () => {
        try {
            const decodedToken = jwtDecode(token);
            const response = await fetch(`http://localhost:5000/users/removeProfilePicture/${decodedToken.user_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            const userData = await response.json();
            if (response.ok) {
                setProfilePicture(userData[0].profile_picture);
            } else {
                console.error('Failed to remove profile picture');
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        }
        fetchProfilePicture();
    }, [navigate, fetchProfilePicture]);

    return (
        <div className="bg-gray-700 min-h-screen">
            <Navbar />
            <div className="flex justify-center">
            <Upload />
                <button type="button" onClick={removeProfilePicture} className="bg-gray-600 text-gray-200 px-4 py-2 rounded-md cursor-pointer hover:bg-gray-600">
                    Remove profile picture
                </button>
                <button className="bg-gray-600 text-gray-200 px-4 py-2 rounded-md cursor-pointer hover:bg-gray-600">
                    <Link to="/change-password">Change Password</Link>
                </button><br /><br />
            </div>
        </div>
    );
};

export default Settings;
