import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import Navbar from './Navbar';
import { ReactComponent as LeftArrow } from '../svg/arrow-left.svg';
import { ReactComponent as RightArrow } from '../svg/arrow-right.svg';
import Loading from '../svg/loading.gif';


const User = () => {
    const { username } = useParams();
    const [user, setUser] = useState('');
    const [message, setMessage] = useState('');
    const [followStatus, setFollowStatus] = useState(false);
    const [loggedInUser, setLoggedInUser] = useState('');
    const [userRole, setUserRole] = useState('');
    const [favoriteAlbums, setFavoriteAlbums] = useState([]);
    const [favoriteTracks, setFavoriteTracks] = useState([]);
    const [recentlyReviewed, setRecentlyReviewed] = useState([]);
    const [currentPageAlbums, setCurrentPageAlbums] = useState(1);
    const [currentPageTracks, setCurrentPageTracks] = useState(1);
    const [currentPageReviews, setCurrentPageReviews] = useState(1);
    const itemsPerPage = 4;

    const totalPagesAlbums = Math.ceil(favoriteAlbums.length / itemsPerPage);
    const totalPagesTracks = Math.ceil(favoriteTracks.length / itemsPerPage);
    const totalPagesReviews = Math.ceil(recentlyReviewed.length / itemsPerPage);
    const currentAlbums = favoriteAlbums.slice((currentPageAlbums - 1) * itemsPerPage, currentPageAlbums * itemsPerPage);
    const currentTracks = favoriteTracks.slice((currentPageTracks - 1) * itemsPerPage, currentPageTracks * itemsPerPage);
    const currentReviews = recentlyReviewed.slice((currentPageReviews - 1) * itemsPerPage, currentPageReviews * itemsPerPage);

    const navigate = useNavigate();

    useEffect(() => {
        if (!localStorage.getItem('token')) {
            navigate('/login');
        } else {
            const token = localStorage.getItem('token');
            const decodedToken = jwtDecode(token);
            setUserRole(decodedToken.user_role);
            setLoggedInUser(decodedToken.username);
        }

        const fetchUserAndFollowStatus = async () => {
            const token = localStorage.getItem('token');

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

        const fetchUserFavorites = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await fetch(`http://localhost:5000/favorites/user-favorite-albums/${username}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                const data = await response.json();
                if (response.ok) {
                    setFavoriteAlbums(data);
                } else {
                    setMessage(data.message);
                }
            } catch (error) {
                setMessage('Failed to fetch user favorites');
            }

            try {
                const response = await fetch(`http://localhost:5000/favorites/user-favorite-tracks/${username}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                const data = await response.json();
                if (response.ok) {
                    setFavoriteTracks(data);
                } else {
                    setMessage(data.message);
                }
            } catch (error) {
                setMessage('Failed to fetch user favorites');
            }
        };

        const recentlyReviewed = async () => {
            const token = localStorage.getItem('token');
            try {
                const response1 = await fetch(`http://localhost:5000/reviews/artist-reviews/${username}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                const data1 = await response1.json();
                if (!response1.ok) {
                    setMessage(data1.message);
                }

                const response2 = await fetch(`http://localhost:5000/reviews/album-reviews/${username}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                const data2 = await response2.json();
                if (!response2.ok) {
                    setMessage(data2.message);
                }

                const response3 = await fetch(`http://localhost:5000/reviews/track-reviews/${username}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                const data3 = await response3.json();
                if (response3.ok) {
                    setMessage(data3.message);
                }
                const combinedData = [...data1, ...data2, ...data3].sort(
                    (a, b) => new Date(b.review_date) - new Date(a.review_date)
                );
                setRecentlyReviewed(combinedData);
            } catch (error) {
                setMessage('Failed to fetch users recently reviewed');
            }
        };

        recentlyReviewed();
        fetchUserFavorites();
        fetchUserAndFollowStatus();
    }, [navigate, username]);

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

    const handleNextPage = (setPage, totalPages) => {
        setPage((prevPage) => Math.min(prevPage + 1, totalPages));
    };

    const handlePreviousPage = (setPage) => {
        setPage((prevPage) => Math.max(prevPage - 1, 1));
    };

    return (
        <div className='bg-gray-700 min-h-screen'>
            <Navbar />
            <div className='text-gray-200 p-4'>
                {message && <p>{message}</p>}
                {user ? (
                    <>
                        <div className="flex justify-between items-center">
                            <div className="flex items-center">
                                <img src={`http://localhost:5000${user.profile_picture}`} alt='' className='h-48 w-48 rounded-full' />
                                <br />
                                <div className="text-6xl font-bold pl-4 pr-4">
                                    {user.username}
                                </div>
                                {user.username !== loggedInUser && (
                                    <>
                                        <div className='flex'>
                                            {followStatus ? (
                                                <button onClick={unfollowUser} className="bg-gray-400 text-white px-4 py-2 rounded ml-2">
                                                    Unfollow
                                                </button>
                                            ) : (
                                                <button onClick={followUser} className="bg-gray-900 text-white px-4 py-2 rounded ml-2">
                                                    Follow
                                                </button>
                                            )}
                                            <button className="bg-gray-900 text-white px-4 py-2 rounded ml-2">
                                                <a href={`http://localhost:3000/messages/${user.user_id}`}>Message</a>
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                        {favoriteAlbums.length === 0 && favoriteTracks.length === 0 && recentlyReviewed.length === 0 ? (
                            <p>This user has no favorites or reviews</p>
                        ) : (
                            <>
                                {favoriteAlbums.length > 0 && (
                                    <div className='pt-4'>
                                        {favoriteAlbums.length > 0 && (
                                            <>
                                                <div className='pl-4'>
                                                    <p className='text-3xl bold'>Favorite Albums</p>
                                                    <button onClick={() => handlePreviousPage(setCurrentPageAlbums)} disabled={currentPageAlbums === 1} className={`${currentPageAlbums === 1 ? 'opacity-50' : 'opacity-100'}`}><LeftArrow className='w-8 h-8' /></button>
                                                    <button onClick={() => handleNextPage(setCurrentPageAlbums, totalPagesAlbums)} disabled={currentPageAlbums === totalPagesAlbums} className={`${currentPageAlbums === totalPagesAlbums ? 'opacity-50' : 'opacity-100'}`}><RightArrow className='w-8 h-8' /></button>
                                                </div>
                                                <div className="container overflow-x-auto scroll-snap-x-mandatory p-4">
                                                    <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                                        {currentAlbums.map((album) => (
                                                            <li key={album.album_id} className="bg-gray-800 p-4 rounded">
                                                                <a href={`http://localhost:3000/albums/${album.album_id}`} className="w-full h-48 object-cover mt-2 rounded">
                                                                    <img src={album.cover_image} alt='' className='w-full h-48 object-cover mt-2 rounded' />
                                                                    <span>{album.album_title}</span>
                                                                </a>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                )}

                                {favoriteTracks.length > 0 && (
                                    <div className='pt-4'>
                                        <div className='pl-4'>
                                            <p className='text-3xl bold'>Favorite Tracks</p>
                                            <button onClick={() => handlePreviousPage(setCurrentPageTracks)} disabled={currentPageTracks === 1} className={`${currentPageTracks === 1 ? 'opacity-50' : 'opacity-100'}`}><LeftArrow className='w-8 h-8' /></button>
                                            <button onClick={() => handleNextPage(setCurrentPageTracks, totalPagesTracks)} disabled={currentPageTracks === totalPagesTracks} className={`${currentPageTracks === totalPagesTracks ? 'opacity-50' : 'opacity-100'}`}><RightArrow className='w-8 h-8' /></button>
                                        </div>
                                        <div className='container overflow-x-auto scroll-snap-x-mandatory p-4'>
                                            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                                {currentTracks.map((track) => (
                                                    <li key={track.track_id} class="bg-gray-800 p-4 rounded">
                                                        <a href={`http://localhost:3000/tracks/${track.track_id}`} class="w-full h-48 object-cover mt-2 rounded">
                                                            <img src={track.cover_image} alt='' className='w-full h-48 object-cover mt-2 rounded' />
                                                            {track.track_title}
                                                        </a>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                )}

                                {recentlyReviewed.length > 0 && (
                                    <>
                                        <div className='pl-4'>
                                            <p className='text-3xl bold'>Recently Reviewed</p>
                                            <button onClick={() => handlePreviousPage(setCurrentPageReviews)} disabled={currentPageReviews === 1} className={`${currentPageReviews === 1 ? 'opacity-50' : 'opacity-100'}`}><LeftArrow className='w-8 h-8' /></button>
                                            <button onClick={() => handleNextPage(setCurrentPageReviews, totalPagesReviews)} disabled={currentPageReviews === totalPagesReviews} className={`${currentPageReviews === totalPagesReviews ? 'opacity-50' : 'opacity-100'}`}><RightArrow className='w-8 h-8' /></button>
                                        </div>
                                        <div className="container overflow-x-auto scroll-snap-x-mandatory p-4">
                                            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                                {currentReviews.map((review, index) => (
                                                    <li key={index} className="bg-gray-800 p-4 rounded">
                                                        {review.artist_id && (
                                                            <>
                                                                <a href={`http://localhost:3000/artists/${review.artist_id}`} className="w-full h-48 object-cover mt-2 rounded">
                                                                    <img src={review.artist_image} alt={review.artist_name} className='w-full h-48 object-cover mt-2 rounded' />
                                                                    <p>{review.artist_name}</p>
                                                                </a>
                                                            </>
                                                        )}
                                                        {review.album_id && (
                                                            <>
                                                                <a href={`http://localhost:3000/albums/${review.album_id}`} className="w-full h-48 object-cover mt-2 rounded">
                                                                    <img src={review.cover_image} alt={review.album_title} className='w-full h-48 object-cover mt-2 rounded' />
                                                                    <p>{review.album_title}</p>
                                                                </a>
                                                            </>
                                                        )}
                                                        {review.track_id && (
                                                            <>
                                                                <a href={`http://localhost:3000/tracks/${review.track_id}`} className="w-full h-48 object-cover mt-2 rounded">
                                                                    <img src={review.cover_image} alt={review.track_title} className='w-full h-48 object-cover mt-2 rounded' />
                                                                    <p>{review.track_title}</p>
                                                                </a>
                                                            </>
                                                        )}
                                                        <p>Review: {review.review_text}</p>
                                                        <p>{new Date(review.review_date).toLocaleDateString()}</p>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </>
                                )}
                            </>
                        )}
                    </>
                ) : (
                    <div className="flex justify-center items-center h-screen bg-gray-700">
                        <img src={Loading} alt="Loading..." style={{ width: '100px', height: '100px' }} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default User;