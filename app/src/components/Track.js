import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { ReactComponent as EmptyHeart } from '../svg/empty-heart.svg';
import { ReactComponent as FullHeart } from '../svg/full-heart.svg';
import { ReactComponent as Star } from '../svg/star.svg';
import { ReactComponent as LeftArrow } from '../svg/arrow-left.svg';
import { ReactComponent as RightArrow } from '../svg/arrow-right.svg';
import Navbar from './Navbar';
import Loading from '../svg/loading.gif';

const Track = () => {
    const { track_id } = useParams();
    const [track, setTrack] = useState('');
    const [message, setMessage] = useState('');
    const [trackReviews, setTrackReviews] = useState('');
    const [reportText, setReportText] = useState('');
    const [displayReportForm, setDisplayReportForm] = useState(false);
    const [reviewId, setReviewId] = useState(0);
    const [review_text, setReviewText] = useState('');
    const [rating, setRating] = useState(0);
    const [currentRating, setCurrentRating] = useState(0);
    const [deleteStatus, setDeleteStatus] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [favoriteStatus, setFavoriteStatus] = useState(false);
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState('');
    const [userId, setUserId] = useState(0);
    const navigate = useNavigate();

    const itemsPerPage = 4;
    const [currentPageReviews, setCurrentPageReviews] = useState(1);
    const totalPagesReviews = Math.ceil(trackReviews.length / itemsPerPage);
    const currentReviews = trackReviews.slice((currentPageReviews - 1) * itemsPerPage, currentPageReviews * itemsPerPage);

    const fetchTrackReviews = useCallback(async () => {
        try {
            const response = await fetch(`http://localhost:5000/reviews/track/${track_id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();
            if (response.ok) {
                data.sort((a, b) => new Date(b.review_date) - new Date(a.review_date));
                setTrackReviews(data);
            } else {
                setMessage(data.message);
            }
        } catch (error) {
            console.error(error);
            setMessage('Failed to fetch track reviews');
        }
    }, [track_id]);

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
        const fetchTrack = async () => {
            try {
                const response = await fetch(`http://localhost:5000/tracks/${track_id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                const data = await response.json();
                if (response.ok) {
                    setTrack(data[0]);
                    setDeleteStatus(data[0].is_deleted);
                    const favoriteStatusResponse = await fetch(`http://localhost:5000/favorites/check-track-status/${track_id}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer: ${token}`
                        },
                    });

                    const favoriteStatusData = await favoriteStatusResponse.json();

                    if (favoriteStatusResponse.ok) {
                        if (Object.keys(favoriteStatusData).length > 0) {
                            setFavoriteStatus(true);
                        }
                    }
                } else {
                    setFavoriteStatus(false);
                    setDeleteStatus(true);
                    setMessage(data.message);
                }
            } catch (error) {
                console.error(error);
                setMessage('Failed to fetch track');
            } finally {
                setLoading(false);
            }
        };

        const fetchTrackRating = async () => {
            try {
                const response = await fetch(`http://localhost:5000/tracks/rating/${track_id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                const data = await response.json();
                if (response.ok) {
                    setCurrentRating(data[0].track_rating);
                } else {
                    setMessage(data.message);
                }
            } catch (error) {
                console.error(error);
                setMessage('Failed to fetch track rating');
            }
        };

        fetchTrack();
        fetchTrackReviews();
        fetchTrackRating();
    }, [track_id, fetchTrackReviews, navigate]);

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
            fetchTrackReviews();
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
            track_id
        };

        try {
            const response = await fetch('http://localhost:5000/reviews/reviewTrack', {
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
                setRating('');
                fetchTrackReviews();
            } else {
                setMessage(data.message);
            }
        } catch (error) {
            console.error(error);
            setMessage('Failed to add review to database');
        };
    };

    const addToFavorites = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://localhost:5000/favorites/add-favorite-track/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer: ${token}`
                },
                body: JSON.stringify({
                    track_id
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setFavoriteStatus(true);
            } else {
                setMessage(data.message);
            }
        } catch (error) {
            console.error(error);
            setMessage('Failed to add album to favorites');
        }
    };

    const removeFromFavorites = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://localhost:5000/favorites/remove-favorite-track/`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer: ${token}`
                },
                body: JSON.stringify({
                    track_id
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setFavoriteStatus(false);
            } else {
                setMessage(data.message);
            }
        } catch (error) {
            console.error(error);
            setMessage('Failed to remove album from favorites');
        }
    };

    const formatDuration = (duration) => {
        const minutes = Math.floor(duration / 60);
        const remainingSeconds = duration % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;

    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen bg-gray-700">
            <img src={Loading} alt="Loading..." style={{ width: '100px', height: '100px' }} />
        </div>;
    }

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
                {message ? <p>{message}</p> : null}
                {track && (
                    <div className="flex flex-col md:flex-row">
                        <div className="flex-shrink-0">
                            <img src={track.cover_image} alt='' className="h-48 w-48" />
                        </div>
                        <div className="ml-4 flex-1">
                            <h2 className="text-4xl font-bold">{track.track_title} by {track.artist_name}</h2>
                            <h2>
                                {currentRating !== null ? (
                                    <span>
                                        Rating: {Math.round(currentRating)} <Star className="w-4 h-4 inline-block" />
                                    </span>
                                ) : 'No reviews yet'}
                            </h2>
                            {isLoggedIn && (
                                favoriteStatus ? (
                                    <button onClick={removeFromFavorites} >
                                        <FullHeart className='w-8 h-8' />
                                    </button>
                                ) : (
                                    <button onClick={addToFavorites}>
                                        <EmptyHeart className='w-8 h-8' />
                                    </button>
                                )
                            )}
                            <div className="mt-4">
                                <p>Duration: {formatDuration(track.duration)}</p>
                                <p>Track number {track.track_number} from album {track.album_title}</p>
                            </div>
                        </div>
                    </div>
                )}
                {!deleteStatus && (
                    <div className="flex flex-col md:flex-row mt-8">
                        <div className="md:w-3/4">
                            {trackReviews && currentReviews.map((review) => (
                                <div key={review.review_id} className="bg-gray-800 p-4 rounded mb-4">
                                    <p className="flex items-center">
                                        <a href={`http://localhost:3000/users/${review.username}`}>
                                            <img src={`http://localhost:5000${review.profile_picture}`} alt='avatar' className="w-6 h-6 rounded-full mr-2" />
                                            {review.username}
                                        </a>
                                    </p>
                                    {review.rating !== null && (
                                        <p className="mt-2">
                                            Rating: {review.rating}
                                            <Star className="h-4 w-4 inline-block" />
                                        </p>
                                    )}
                                    <p className='p-4'>{review.review_text}</p>
                                    <p className='pt-2'>
                                        {isLoggedIn && (
                                            <button onClick={() => { setDisplayReportForm(true); setReviewId(review.review_id); }} className="text-gray-300 ml-2">
                                                Report
                                            </button>
                                        )}
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
                )}
            </div>
        </div>

    );
};

export default Track;