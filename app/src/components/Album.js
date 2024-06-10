import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';

const Album = () => {
    const { album_id } = useParams();
    const [album, setAlbum] = useState('');
    const [tracks, setTracks] = useState([]);
    const [message, setMessage] = useState('');
    const [albumReviews, setAlbumReviews] = useState('');
    const [reportText, setReportText] = useState('');
    const [displayReportForm, setDisplayReportForm] = useState(false);
    const [reviewId, setReviewId] = useState(0);
    const [review_text, setReviewText] = useState('');
    const [rating, setRating] = useState(0);

    const fetchAlbumReviews = useCallback(async () => {
        try {
            const response = await fetch(`http://localhost:5000/reviews/album/${album_id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();
            if (response.ok) {
                setAlbumReviews(data);
            } else {
                setMessage(data.message);
            }
        } catch (error) {
            console.error(error);
            setMessage('Failed to fetch album reviews');
        }
    }, [album_id]);

    useEffect(() => {
        const fetchAlbum = async () => {
            try {
                const response = await fetch(`http://localhost:5000/albums/${album_id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                const data = await response.json();
                if (response.ok) {
                    setAlbum(data[0]);
                } else {
                    setMessage(data.message);
                }
            } catch (error) {
                console.error(error);
                setMessage('Failed to fetch album');
            }
        };

        const fetchTracks = async () => {
            try {
                const response = await fetch(`http://localhost:5000/tracks/album/${album_id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const data = await response.json();

                if (response.ok) {
                    setTracks(data);
                } else {
                    setMessage(data.message);
                }
            } catch (error) {
                console.error(error);
                setMessage('Failed to fetch tracks from album');
            }
        };

        fetchAlbum();
        fetchTracks();
        fetchAlbumReviews();
    }, [album_id, fetchAlbumReviews]);


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
            album_id
        };

        try {
            const response = await fetch('http://localhost:5000/reviews/reviewAlbum', {
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
                fetchAlbumReviews();
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
            <h1>Album Page</h1>
            {message ? <p>{message}</p> : null}
            {album && (
                <div>
                    <h2>{album.album_title}</h2>
                    <h2>{album.album_id}</h2>
                    <h2><img src={album.cover_image} alt='' style={{ width: '200px', height: '200px' }} ></img></h2>
                    <h3>Tracks in this album</h3>
                    {tracks.length > 0 ? (
                        <ul>
                            {tracks.map((track) => (
                                <li key={track.track_id}>
                                    <h4>{track.track_title}</h4>
                                    <h5>track duration{track.duration}</h5>
                                    <h5>track num{track.track_number}</h5>
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
                {albumReviews && albumReviews.map((review) => (
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

export default Album;