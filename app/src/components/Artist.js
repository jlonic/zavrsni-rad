import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';

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
        const fetchArtistAndFollowStatus = async () => {
            const token = localStorage.getItem('token');
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
                        setMessage(followStatusData.message);
                    }

                } else {
                    setMessage(data.message);
                }
            } catch (error) {
                console.error(error);
                setMessage('Failed to fetch artist');
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
                    setAlbums(data);
                } else {
                    setMessage(data.message);
                }
            } catch (error) {
                console.error(error);
                setMessage('Failed to fetch albums');
            }
        };

        fetchArtistAndFollowStatus();
        fetchAlbums();
        fetchArtistReviews();
    }, [artist_id, fetchArtistReviews]);

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
                setMessage(data.message);
            } else {
                setMessage(`Error: ${data.message}`);
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
    return (
        <div>
            <h1>Artist Page</h1>
            {message ? <p>{message}</p> : null}
            {artist && (
                <div>
                    <h2>{artist.artist_name}</h2>
                    <h2><img src={artist.artist_image} alt='' style={{ width: '200px', height: '200px' }}></img></h2>
                    {followStatus ? (
                        <button onClick={unfollowArtist}>Unfollow</button>
                    ) : (
                        <button onClick={followArtist}>Follow</button>

                    )}
                    <h2>{artist.artist_id}</h2>
                    <h3>Albums</h3>
                    {albums.length > 0 ? (
                        <ul>
                            {albums.map((album) => (
                                <li key={album.album_id}>
                                    <h4>{album.album_title}</h4>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No albums found</p>
                    )}
                </div>
            )}
            <div>
                <h2>Reviews</h2>
                {artistReviews && artistReviews.map((review) => (
                    <div key={review.review_id}>
                        <p>Rating: {review.rating}|{review.review_text}|
                            <button onClick={() => {
                                setDisplayReportForm(true);
                                setReviewId(review.review_id)
                            }}>
                                Report
                            </button>
                        </p>
                    </div>
                ))}
            </div>
            {displayReportForm && (
                <div className="report">
                    <h2>Report Review</h2>
                    <textarea value={reportText} onChange={(e) => setReportText(e.target.value)}
                        placeholder="Enter your report reason" />
                    <button onClick={() => handleReport(reviewId)}>Submit</button>
                    <button onClick={() => setDisplayReportForm(false)}>Cancel</button>
                </div>
            )}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Review:</label>
                    <textarea value={review_text} onChange={handleReviewChange} />
                </div>
                <div>
                    <label>Rating:</label>
                    <input type="number" value={rating} onChange={handleRatingChange} />
                </div>
                <div>
                    <button type="submit">Submit</button>
                    {<p>{message}</p>}
                </div>
            </form>
        </div>
    );
};


export default Artist;