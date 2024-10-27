import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Navbar from './Navbar';
import Loading from '../svg/loading.gif';
import { ReactComponent as LeftArrow } from '../svg/arrow-left.svg';
import { ReactComponent as RightArrow } from '../svg/arrow-right.svg';
import { ReactComponent as Star } from '../svg/star.svg';

const Artist = () => {
    const { artist_id } = useParams();
    const [artist, setArtist] = useState('');
    const [albums, setAlbums] = useState([]);
    const [message, setMessage] = useState('');
    const [artistReviews, setArtistReviews] = useState('');
    const [reportText, setReportText] = useState('');
    const [displayReportForm, setDisplayReportForm] = useState(false);
    const [reviewId, setReviewId] = useState(0);
    const [followStatus, setFollowStatus] = useState(false);
    const [review_text, setReviewText] = useState('');
    const [rating, setRating] = useState(0);
    const [artistRating, setArtistRating] = useState(0);
    const [deleteStatus, setDeleteStatus] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState('');
    const [userId, setUserId] = useState(0);
    const [numberOfFollowers, setNumberOfFollowers] = useState(0);
    const [showFullInfo, setShowFullInfo] = useState(false);

    const itemsPerPage = 4;
    const [currentPageAlbums, setCurrentPageAlbums] = useState(1);
    const totalPagesAlbums = Math.ceil(albums.length / itemsPerPage);
    const currentAlbums = albums.slice((currentPageAlbums - 1) * itemsPerPage, currentPageAlbums * itemsPerPage);

    const [currentPageReviews, setCurrentPageReviews] = useState(1);
    const totalPagesReviews = Math.ceil(artistReviews.length / itemsPerPage);
    const currentReviews = artistReviews.slice((currentPageReviews - 1) * itemsPerPage, currentPageReviews * itemsPerPage);

    const navigate = useNavigate();


    const fetchArtistReviews = useCallback(async () => {
        try {
            const response = await fetch(`http://localhost:5000/reviews/artist/${artist_id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();
            if (response.ok) {
                data.sort((a, b) => new Date(b.review_date) - new Date(a.review_date));
                setArtistReviews(data);
            } else {
                setMessage(data.message);
            }
        } catch (error) {
            console.error(error);
            setMessage('Failed to fetch artist reviews');
        }
    }, [artist_id]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
            const decodedToken = jwtDecode(token);
            setUserRole(decodedToken.user_role);
            setUserId(decodedToken.user_id);
        } else {
            navigate('/login');
        }
        const fetchArtistAndFollowStatus = async () => {
            try {
                const response = await fetch(`http://localhost:5000/artists/${artist_id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                const data = await response.json();

                if (response.ok) {
                    setArtist(data[0]);
                    setDeleteStatus(data[0].is_deleted);
                    const followStatusResponse = await fetch(`http://localhost:5000/follows/checkArtistFollowStatus/${data[0].artist_id}`, {
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
                        // setMessage(followStatusData.message);
                    }

                } else {
                    setDeleteStatus(true);
                    setMessage(data.message);
                }
            } catch (error) {
                console.error(error);
                setMessage('Failed to fetch artist');
            } finally {
                setLoading(false);
            }
        };

        const fetchAlbums = async () => {
            try {
                const response = await fetch(`http://localhost:5000/albums/artist/${artist_id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const data = await response.json();

                if (response.ok) {
                    data.sort((a, b) => b.release_date.localeCompare(a.release_date));
                    //sort from latest to oldest
                    setAlbums(data);
                } else {
                    setMessage(data.message);
                }
            } catch (error) {
                console.error(error);
                setMessage('Failed to fetch albums');
            }
        };

        const fetchArtistRating = async () => {
            try {
                const response = await fetch(`http://localhost:5000/artists/rating/${artist_id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const data = await response.json();
                if (response.ok) {
                    setArtistRating(data[0].artist_rating);
                } else {
                    setMessage(data.message);
                }
            } catch (error) {
                console.error(error);
                setMessage('Failed to fetch artist rating');
            }
        };

        const fetchNumberOfFollowers = async () => {
            try {
                const response = await fetch(`http://localhost:5000/follows/getNumberOfFollowers/${artist_id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const data = await response.json();
                if (response.ok) {
                    setNumberOfFollowers(data[0].count);
                } else {
                    setMessage(data.message);
                }
            } catch (error) {
                console.error(error);
                setMessage('Failed to fetch artist rating');
            }
        };

        fetchArtistAndFollowStatus();
        fetchAlbums();
        fetchArtistReviews();
        fetchArtistRating();
        fetchNumberOfFollowers();
    }, [artist_id, fetchArtistReviews, navigate]);

    const followArtist = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch('http://localhost:5000/follows/followArtist', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    artist_id,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setFollowStatus(true);
            } else {
                setMessage(data.message);
            }
        } catch (error) {
            setMessage('Failed to follow artist');
        }
    };

    const unfollowArtist = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch('http://localhost:5000/follows/unfollowArtist', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer: ${token}`
                },
                body: JSON.stringify({
                    artist_id,
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
            setMessage('Failed to unfollow artist');
        }
    };

    const deleteReview = async (review_id) => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch('http://localhost:5000/reviews/deleteReview', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer: ${token}`,
                },
                body: JSON.stringify({ review_id }),
            });
            const data = await response.json();
            if (response.ok) {
                setMessage(data.message);
            } else {
                setMessage(data.message);
            }
        } catch (error) {
            setMessage(error.message);
        } finally {
            fetchArtistReviews();
        }
    };

    const handleReport = async (reviewId) => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch('http://localhost:5000/reports/newReport', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer: ${token}`
                },
                body: JSON.stringify({
                    review_id: reviewId,
                    report_text: reportText,
                }),
            });

            if (response.ok) {
                //add a report successful message -> Report submitted!
                setReportText('');
                setDisplayReportForm(false);
            } else {
                //add a report failed message?-> Failed to send report, please try again
                setReportText('');
                setDisplayReportForm(false); //
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleReviewChange = (e) => {
        setReviewText(e.target.value);
    };

    const handleRatingChange = (e) => {
        const newRating = parseInt(e.target.value, 10);
        setRating(newRating);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');
        const reviewData = {
            review_text,
            rating,
            artist_id
        };

        try {
            const response = await fetch('http://localhost:5000/reviews/reviewArtist', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer: ${token}`
                },
                body: JSON.stringify(reviewData),
            });

            const data = await response.json();

            if (response.ok) {
                setReviewText('');
                setRating(0);
                fetchArtistReviews();
            } else {
                setMessage(data.message);
            }
        } catch (error) {
            console.error(error);
            setMessage('Failed to add review to database');
        };
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen bg-gray-700">
            <img src={Loading} alt="Loading..." style={{ width: '100px', height: '100px' }} />
        </div>;
    }
    const toggleShowFullInfo = () => setShowFullInfo(!showFullInfo);

    const handleNextPage = (setPage, totalPages) => {
        setPage((prevPage) => Math.min(prevPage + 1, totalPages));
    };

    const handlePreviousPage = (setPage) => {
        setPage((prevPage) => Math.max(prevPage - 1, 1));
    };

    return (
        <div className='bg-gray-700 min-h-screen'>
            <Navbar />
            <div className="bg-gray-700 text-gray-200 p-4">
                {message ? <p>{message}</p> : null}
                {artist && (
                    <div className="flex flex-col md:flex-row">
                        <div className="flex-shrink-0">
                            <img src={artist.artist_image} alt='' className="h-48 w-48" />
                        </div>
                        <div className="ml-4 flex-1">
                            <h2 className="text-6xl font-bold">{artist.artist_name}</h2>
                            <h5 className="pt-2 max-w-xl">
                                {showFullInfo ? artist.artist_info : `${artist.artist_info.slice(0, 300)}...`}
                                <button onClick={toggleShowFullInfo} className="ml-2 text-blue-500">
                                    {showFullInfo ? 'Show less' : 'See more'}
                                </button>
                            </h5>
                            <div className="flex items-center pt-4">
                                <h2 className="mr-4">{numberOfFollowers} followers</h2>
                                {isLoggedIn && (
                                    followStatus ? (
                                        <button onClick={unfollowArtist} className="bg-gray-400 text-white px-4 py-2 rounded">
                                            Unfollow
                                        </button>
                                    ) : (
                                        <button onClick={followArtist} className="bg-gray-900 text-white px-4 py-2 rounded">
                                            Follow
                                        </button>
                                    )
                                )}
                                <h2 className="ml-4">
                                    {artistRating !== null ? (
                                        <span>
                                            Rating: {Math.round(artistRating)} <Star className="w-4 h-4 inline-block" />
                                        </span>
                                    ) : 'No reviews yet'}
                                </h2>
                            </div>
                        </div>
                    </div>
                )}
                <div className="mt-8">
                    {albums.length > 0 ? (
                        <>
                            <div>
                                <button onClick={() => handlePreviousPage(setCurrentPageAlbums)} disabled={currentPageAlbums === 1} className={`${currentPageAlbums === 1 ? 'opacity-50' : 'opacity-100'}`}><LeftArrow className='w-8 h-8' /></button>
                                <button onClick={() => handleNextPage(setCurrentPageAlbums, totalPagesAlbums)} disabled={currentPageAlbums === totalPagesAlbums} className={`${currentPageAlbums === totalPagesAlbums ? 'opacity-50' : 'opacity-100'}`}><RightArrow className='w-8 h-8' /></button>
                            </div>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {currentAlbums.map((album) => (
                                    <li key={album.album_id} className="bg-gray-800 p-4 rounded">
                                        <h4 className="text-xl font-semibold">
                                            <a href={`http://localhost:3000/albums/${album.album_id}`} className="hover:underline">
                                                {album.album_title}
                                                <img src={album.cover_image} alt='' className="w-full h-48 object-cover mt-2 rounded" />
                                            </a>
                                        </h4>
                                    </li>
                                ))}
                            </ul>

                        </>
                    ) : (
                        <p>No albums found</p>
                    )}
                </div>
                <div className="mt-8 flex flex-col md:flex-row">
                    <div className="md:w-3/4">
                        {!deleteStatus && artistReviews && currentReviews.map((review) => (
                            <div key={review.review_id} className="bg-gray-800 p-4 rounded mb-4">
                                <p className="flex items-center">
                                    <a href={`http://localhost:3000/users/${review.username}`}>
                                        <img src={`http://localhost:5000${review.profile_picture}`} alt='avatar' className="w-6 h-6 rounded-full mr-2" />
                                        {review.username} - {new Date(review.review_date).toLocaleDateString('en-gb')}
                                    </a>
                                </p>
                                {review.rating !== null && (
                                    <p className="mt-2">
                                        Rating: {review.rating}
                                        <Star className="h-4 w-4 inline-block" />
                                    </p>
                                )}
                                <p className='p-4'> {review.review_text}</p>
                                <p className='pt-2'>
                                    <button onClick={() => { setDisplayReportForm(true); setReviewId(review.review_id); }} className="text-gray-300 ml-2">
                                        Report
                                    </button>
                                    {(userRole === 'administrator' || userRole === 'moderator' || userId === review.user_id) && (
                                        <button onClick={() => deleteReview(review.review_id)} className="text-red-500 ml-2">
                                            Delete
                                        </button>
                                    )}
                                </p>
                            </div>
                        ))}
                        <div>
                            <button onClick={() => handlePreviousPage(setCurrentPageReviews)} disabled={currentPageReviews === 1} className={`${currentPageReviews === 1 ? 'opacity-50' : 'opacity-100'}`}><LeftArrow className='w-8 h-8' /></button>
                            <button onClick={() => handleNextPage(setCurrentPageReviews, totalPagesReviews)} disabled={currentPageReviews === totalPagesReviews} className={`${currentPageReviews === totalPagesReviews ? 'opacity-50' : 'opacity-100'}`}><RightArrow className='w-8 h-8' /></button>
                        </div>
                    </div>
                    <div className="md:w-1/4 md:pl-4">
                        {displayReportForm && (
                            <div className="bg-gray-800 p-4 rounded mb-4">
                                <h2>Report Review</h2>
                                <textarea value={reportText} onChange={(e) => setReportText(e.target.value)}
                                    placeholder="Enter your report reason" className="w-full p-2 bg-gray-900 text-gray-200 rounded mt-2" />
                                <button onClick={() => handleReport(reviewId)} className="bg-gray-400 text-white px-4 py-2 rounded mt-2">
                                    Submit
                                </button>
                                <button onClick={() => setDisplayReportForm(false)} className="bg-gray-600 text-white px-4 py-2 rounded mt-2 ml-2">
                                    Cancel
                                </button>
                            </div>
                        )}
                        {!deleteStatus && isLoggedIn && (
                            <form onSubmit={handleSubmit} className="bg-gray-800 p-4 rounded">
                                <div>
                                    <label className="block text-sm font-medium">Review:</label>
                                    <textarea value={review_text} onChange={handleReviewChange} className="w-full p-2 bg-gray-900 text-gray-200 rounded mt-2" />
                                </div>
                                <div className="mt-4">
                                    <label className="block text-sm font-medium">Rating:</label>
                                    <select value={rating} onChange={handleRatingChange} className="w-full p-2 bg-gray-900 text-gray-200 rounded mt-2">
                                        <option value="">Select rating...</option>
                                        {[...Array(10)].map((_, index) => (
                                            <option key={index + 1} value={index + 1}>{index + 1}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mt-4">
                                    <button type="submit" className="bg-gray-400 text-white px-4 py-2 rounded">
                                        Submit
                                    </button>
                                    {message && <p className="text-red-500 mt-2">{message}</p>}
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};


export default Artist;