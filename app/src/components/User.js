import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";

const User = () => {
    const { username } = useParams();
    const [user, setUser] = useState('');
    const [message, setMessage] = useState('');
    const [followStatus, setFollowStatus] = useState(false);
    const [loggedInUser, setLoggedInUser] = useState('');

    useEffect(() => {
        const fetchUserAndFollowStatus = async () => {
            const token = localStorage.getItem('token');
            const decodedToken = jwtDecode(token);
            setLoggedInUser(decodedToken.username);

            try {
                const userResponse = await fetch(`http://localhost:5000/users/${username}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                const userData = await userResponse.json();
                if (userResponse.ok) {
                    setUser(userData[0]);

                    const followStatusResponse = await fetch(`http://localhost:5000/follows/checkFollowStatus/${userData[0].user_id}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`
                        },
                    });

                    const followStatusData = await followStatusResponse.json();

                    if (followStatusResponse.ok) {
                        if (Object.keys(followStatusData).length === 0) { //if json is empty, user is not following
                            setFollowStatus(false);
                        } else {
                            setFollowStatus(true);
                        }
                    } else {
                        setFollowStatus(false);
                        setMessage(followStatusData.message);
                    }
                } else {
                    setMessage(userData.message);
                }
            } catch (error) {
                console.error(error);
                setMessage('Failed to fetch user data');
            }
        };

        fetchUserAndFollowStatus();
    }, [username]);

    const followUser = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch('http://localhost:5000/follows/followUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    followed_id: user.user_id,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setFollowStatus(true);
                setMessage(data.message);
            } else {
                setMessage(data.message);
            }
        } catch (error) {
            setMessage('Failed to follow user');
        }
    };

    const unfollowUser = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch('http://localhost:5000/follows/unfollowUser', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    followed_id: user.user_id,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setFollowStatus(false);
                setMessage(data.message);
            } else {
                setMessage(data.message);
            }
        } catch (error) {
            setMessage('Failed to unfollow user');
        }
    };

    return (
        <div>
            <div>
                {message && <p>{message}</p>}
                {user ? (
                    <>
                        <h1>User Page</h1>
                        <h2>
                            {user.user_id}
                            {user.username}
                            {user.username !== loggedInUser && (
                                <>
                                    {followStatus ? (
                                        <button onClick={unfollowUser}>Unfollow</button>
                                    ) : (
                                        <button onClick={followUser}>Follow</button>
                                    )}
                                    <a href={`http://localhost:3000/messages/${user.user_id}`}>Message</a>
                                </>
                            )}
                            <img src={user.profile_picture} alt='' style={{ width: '50px', height: '50px' }} />
                        </h2>
                        <p>Email: {user.email}</p>
                    </>
                ) : (
                    <p>Loading...</p>
                )}
            </div>
        </div>
    );
};

export default User;