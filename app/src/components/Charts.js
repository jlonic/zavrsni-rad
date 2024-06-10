import { useState, useEffect } from 'react';

const Charts = () => {
    const [topArtists, setTopArtists] = useState([]);
    const [topAlbums, setTopAlbums] = useState([]);
    const [global200, setGlobal200] = useState([]);
    const [hot100, setHot100] = useState([]);
    const [currentChart, setCurrentChart] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        const fetchData = async (url, setData) => {
            try {
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const data = await response.json();

                if (response.ok) {
                    setData(data);
                } else {
                    setMessage(data.message);
                }
            } catch (error) {
                setMessage('Failed to fetch charts');
            } finally {
                setLoading(false);
            }
        };

        fetchData('http://localhost:5000/charts/top-100-artists', setTopArtists);
        fetchData('http://localhost:5000/charts/top-albums', setTopAlbums);
        fetchData('http://localhost:5000/charts/global-200', setGlobal200);
        fetchData('http://localhost:5000/charts/hot-100', setHot100);
    }, []);

    const renderChart = (chart) => {
        return (
            <ul>
                {chart.map((data, index) => (
                    <li key={index}>
                        <img src={data.image} alt={`${data.artist} thumbnail`} style={{ width: '50px', height: '50px' }} />
                        <div>
                            <h2>{data.artist}</h2>
                            <p>Title: {data.title}</p>
                            <p>Rank: {data.rank}</p>
                            <p>Peak Position: {data.peak_position}</p>
                            <p>Last Position: {data.last_position}</p>
                            <p>Weeks on Chart: {data.weeks_on_chart}</p>
                        </div>
                    </li>
                ))}
            </ul>
        );
    };

    return (
        <div>
            {message && <p>{message}</p>}
            <h1>Charts</h1>
            {loading ? (<p></p>) : (
                <>
                    <button onClick={() => setCurrentChart('topArtists')}>Top 100 Artists</button>
                    <button onClick={() => setCurrentChart('topAlbums')}>Top Albums</button>
                    <button onClick={() => setCurrentChart('global200')}>Global 200</button>
                    <button onClick={() => setCurrentChart('hot100')}>Hot 100</button>
                </>)}
            {loading ? (
                <p>Loading...</p>
            ) : (
                <>
                    {currentChart === 'topArtists' && renderChart(topArtists)}
                    {currentChart === 'topAlbums' && renderChart(topAlbums)}
                    {currentChart === 'global200' && renderChart(global200)}
                    {currentChart === 'hot100' && renderChart(hot100)}
                </>
            )}
        </div>
    );
};

export default Charts;
