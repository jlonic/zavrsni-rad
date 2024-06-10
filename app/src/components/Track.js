import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';

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
                } else {
                    setMessage(data.message);
                }
            } catch (error) {
                console.error(error);
                setMessage('Failed to fetch track');
            }
        };

        fetchTrack();
        fetchTrackReviews();
    }, [track_id, fetchTrackReviews]);

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

    return (
        <div>
            <div>
                {message ? <p>{message}</p> : null}
                <h1>Track Page</h1>
                <h2>title: {track.track_title}</h2>
                <p>duration: {track.duration}</p>
                <p>track number: {track.track_number}</p>
            </div>
            <div>
                <h2>Reviews</h2>
                {trackReviews && trackReviews.map((review) => (
                    <div key={review.review_id}>
                        <p>Rating: {review.rating}|{review.review_text}|
                            <button onClick={() => {
                                setDisplayReportForm(true);
                                setReviewId(review.review_id)
                            }}>
                                Report
                            </button></p>
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

export default Track;