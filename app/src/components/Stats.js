import { useState, useEffect } from 'react';
import Loading from '../svg/loading.gif';

const Stats = () => {
    const [loading, setLoading] = useState(true);
    const [selectedType, setSelectedType] = useState('artists');

    const [top5AverageRating, setTop5AverageRating] = useState([]);
    const [top5MostReviewed, setTop5MostReviewed] = useState([]);
    const [latest5Reviewed, setLatest5Reviewed] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true); // Set loading state
                const response1 = await fetch(`http://localhost:5000/reviews/top5AverageRating${selectedType}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const data1 = await response1.json();
                if (response1.ok) {
                    setTop5AverageRating(data1);
                } else {
                    console.error(data1.message);
                }

                const response2 = await fetch(`http://localhost:5000/reviews/top5MostReviewed${selectedType}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const data2 = await response2.json();
                if (response2.ok) {
                    setTop5MostReviewed(data2);
                } else {
                    console.error(data2.message);
                }

                const response3 = await fetch(`http://localhost:5000/reviews/latest5Revieved${selectedType}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const data3 = await response3.json();
                if (response3.ok) {
                    data3.sort((a, b) => new Date(b.review_date) - new Date(a.review_date));
                    setLatest5Reviewed(data3);
                } else {
                    console.error(data3.message);
                }

                setLoading(false);
            } catch (error) {
                console.error(error.message);
            }
        };

        fetchData();
    }, [selectedType]);

    const handleTypeChange = (type) => {
        setSelectedType(type);
    };

    const renderTable = (data, type) => {
        if (data.length === 0) {
            return null;
        }
        return (
            <div className='bg-gray-700 ml-9'>
                <table className='text-white'>
                    <thead>
                        <tr>
                            {type === 'Best Rating' && <th className='text-white'>Best Rating</th>}
                            {type === 'Most Reviewed' && <th className='text-white'>Number of reviews</th>}
                            {type === 'Latest' && <th className='text-white'>Latest reviews</th>}
                        </tr>
                    </thead>
                    <tbody className='text-white'>
                        {data.map((item, index) => (
                            <tr key={index}>
                                <td className="py-2 ">
                                    <div className="flex items-center">
                                        <div className="mr-4">
                                            {selectedType === 'artists' && <a href={`/${selectedType}/${item.artist_id}`}><img src={item.artist_image} alt="Artist" className="w-16 h-16 rounded-full"></img></a>}
                                            {selectedType === 'albums' && <a href={`/${selectedType}/${item.album_id}`}><img src={item.cover_image} alt="Album" className="w-16 h-16"></img></a>}
                                            {selectedType === 'tracks' && <a href={`/${selectedType}/${item.track_id}`}><img src={item.cover_image} alt="Track" className="w-16 h-16"></img></a>}
                                        </div>
                                        <div className="flex flex-col">
                                            <a href={`/${selectedType}/${item.artist_id}`} className="mr-8">
                                                {selectedType === 'artists' && item.artist_name && item.artist_name.slice(0, 20)}
                                                {item.artist_name && item.artist_name.length > 20 && '...'}
                                            </a>
                                            <a href={`/${selectedType}/${item.album_id}`} className="mr-8">
                                                {selectedType === 'albums' && item.album_title && item.album_title.slice(0, 20)}
                                                {item.album_title && item.album_title.length > 20 && '...'}
                                            </a>
                                            <a href={`/${selectedType}/${item.track_id}`} className="mr-8">
                                                {selectedType === 'tracks' && item.track_title && item.track_title.slice(0, 20)}
                                                {item.track_title && item.track_title.length > 20 && '...'}
                                            </a>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-2">
                                    {selectedType === 'artists' && (
                                        <div>
                                            {type === 'Best Rating' && Math.round(item.average_rating)}
                                            {type === 'Most Reviewed' && item.number_of_reviews}
                                            {type === 'Latest' && item.review_text.slice(0, 15)}
                                            {item.review_text && item.review_text.length > 15 && '...'}
                                        </div>
                                    )}
                                    {selectedType === 'albums' && (
                                        <div>
                                            {type === 'Best Rating' && Math.round(item.average_rating)}
                                            {type === 'Most Reviewed' && item.number_of_reviews}
                                            {type === 'Latest' && item.review_text.slice(0, 15)}
                                            {item.review_text && item.review_text.length > 15 && '...'}
                                        </div>
                                    )}
                                    {selectedType === 'tracks' && (
                                        <div>
                                            {type === 'Best Rating' && Math.round(item.average_rating)}
                                            {type === 'Most Reviewed' && item.number_of_reviews}
                                            {type === 'Latest' && item.review_text.slice(0, 15)}
                                            {item.review_text && item.review_text.length > 15 && '...'}
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-700">
                <img src={Loading} alt="Loading..." style={{ width: '100px', height: '100px' }} />
            </div>
        );
    }

    return (
        <div className='bg-gray-700'>
            <div className="flex">
                <div className="w-1/3">
                    {renderTable(top5AverageRating, 'Best Rating')}
                </div>
                <div className="w-1/3">
                    {renderTable(top5MostReviewed, 'Most Reviewed')}
                </div>
                <div className="w-1/3">
                    {renderTable(latest5Reviewed, 'Latest')}
                </div>
            </div>
            <div className="mt-4 flex justify-center">
                <button className="mr-2 px-4 py-2 bg-gray-500 text-white rounded" onClick={() => handleTypeChange('artists')}>Artists</button>
                <button className="mr-2 px-4 py-2 bg-gray-500 text-white rounded" onClick={() => handleTypeChange('albums')}>Albums</button>
                <button className="mr-2 px-4 py-2 bg-gray-500 text-white rounded" onClick={() => handleTypeChange('tracks')}>Tracks</button>
            </div>
        </div>
    );
};

export default Stats;
