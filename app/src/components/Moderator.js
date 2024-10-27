import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Navbar from './Navbar';
import Loading from '../svg/loading.gif';

const Moderator = () => {
    const navigate = useNavigate();
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [reportsAndReviews, setReportsAndReviews] = useState([]);
    const [displayAllReports, setDisplayAllReports] = useState(false);

    useEffect(() => { //redirect to login if not logged in
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        } else {
            const decodedToken = jwtDecode(token);
            if (decodedToken.user_role !== 'administrator' && decodedToken.user_role !== 'moderator') {
                navigate('/dashboard');
            }
        }
        setLoading(false);
    }, [navigate]);

    const getAllReports = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch('http://localhost:5000/reports/getReportsAndReviews', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer: ${token}`,
                }
            });
            const data = await response.json();
            if (response.ok) {
                data.sort((a, b) => a.review_id - b.review_id);
                setReportsAndReviews(data);
            } else {
                setMessage(data.message);
            }
        } catch (error) {
            setMessage(error.message);
        }
    };

    const deleteReport = async (report_id) => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch('http://localhost:5000/reports/deleteReport', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer: ${token}`,
                },
                body: JSON.stringify({ report_id }),
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
            getAllReports();
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
            getAllReports();
        }
    };

    const handleGetAllReports = (e) => {
        e.preventDefault();
        if (!displayAllReports) {
            getAllReports();
        }
        setDisplayAllReports(!displayAllReports);
    }

    if (loading) {
        return <div className="flex justify-center items-center h-screen bg-gray-700">
            <img src={Loading} alt="Loading..." style={{ width: '100px', height: '100px' }} />
        </div>;
    }

    return (
        <div className="bg-gray-700 min-h-screen">
            <Navbar />
            {message && <p className="text-white">{message}</p>}
            <div className="text-gray-200 mt-4 px-4">
                <button onClick={handleGetAllReports} className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-600">
                    {displayAllReports ? 'Hide Reports' : 'Get Reports'}
                </button>
            </div>
            {displayAllReports && (
                <div className="mt-4 px-4">
                    {reportsAndReviews.map((report, index) => (
                        <div key={index} className="bg-gray-800 p-4 rounded-md mb-4">
                            {/* <p className="text-white">Review ID: {report.review_id}</p> */}
                            <p className="text-white">Review Text: {report.review_text}</p>
                            {/* <p className="text-white">Report ID: {report.report_id}</p> */}
                            <p className="text-white">Report Reason: {report.report_text}</p>
                            <div className="mt-2">
                                <button type="button" onClick={() => deleteReview(report.review_id)} className="bg-red-500 text-white px-4 py-2 rounded-md mr-2 hover:bg-red-600">
                                    Delete Review
                                </button>
                                <button type="button" onClick={() => deleteReport(report.report_id)} className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">
                                    Delete Report
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>

    );
};

export default Moderator;