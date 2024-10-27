import { useState, useEffect } from 'react';
import Loading from '../svg/loading.gif';
import { ReactComponent as ArrowUp } from '../svg/green-arrow-up.svg';
import { ReactComponent as ArrowDown } from '../svg/red-arrow-down.svg';
import Navbar from './Navbar';

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

    const renderChart = (chart, type) => {
        return (
            <div className='w-3/4'>
                <div className="min-w-full divide-y divide-gray-200 ">
                    <div className="bg-gray-800">
                        <div className="grid grid-cols-5 gap-4 p-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            <div>Rank</div>
                            <div>{type === 'albums' ? 'Album' : (type === 'tracks' ? 'Track' : 'Artist')}</div>
                            <div>Last Week Position</div>
                            <div>Peak Position</div>
                            <div>Weeks on Chart</div>
                        </div>
                    </div>
                    <div className="bg-gray-700 divide-y divide-gray-200">
                        {chart.map((data, index) => (
                            <div key={index} className="grid grid-cols-5 gap-4 p-2">
                                <div className="text-sm font-medium text-white">{data.rank}</div>
                                <div className="flex items-center space-x-4">
                                    <img src={data.image} alt={`${type === 'albums' ? data.title : (type === 'tracks' ? data.track : data.artist)} thumbnail`} className="w-10 h-10 rounded-full" />
                                    <div className="flex items-center text-sm font-medium text-white">
                                        {type === 'albums' ? data.title : (type === 'tracks' || type === 'hot100' ? data.title : data.artist)}
                                        {data.last_position > 0 && (
                                            <>
                                                {data.last_position > data.rank && <ArrowUp className="ml-2 w-4 h-4" />}
                                                {data.last_position < data.rank && <ArrowDown className="ml-2 w-4 h-4" />}
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div className="text-sm text-white">{data.last_position === 0 ? 'New Entry' : data.last_position}</div>
                                <div className="text-sm text-white">{data.peak_position}</div>
                                <div className="text-sm text-white">{data.weeks_on_chart}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className='bg-gray-700 min-h-screen'>
            <Navbar />
            {message && <p>{message}</p>}
            {loading && (
                <div className="flex justify-center items-center h-screen bg-gray-700">
                    <img src={Loading} alt="Loading..." style={{ width: '100px', height: '100px' }} />
                </div>
            )}
            {!loading && (
                <>
                    <div className="mb-4 flex justify-center bg-gray-700">
                        <button onClick={() => setCurrentChart('topArtists')} className="mr-2 px-4 py-2 bg-gray-500 text-white rounded">Top 100 Artists</button>
                        <button onClick={() => setCurrentChart('topAlbums')} className="mr-2 px-4 py-2 bg-gray-500 text-white rounded">Top Albums</button>
                        <button onClick={() => setCurrentChart('global200')} className="mr-2 px-4 py-2 bg-gray-500 text-white rounded">Global 200</button>
                        <button onClick={() => setCurrentChart('hot100')} className="px-4 py-2 bg-gray-500 text-white rounded">Hot 100</button>
                    </div>
                    <div className='flex justify-center'>
                        {currentChart === 'topArtists' && renderChart(topArtists, 'artists')}
                        {currentChart === 'topAlbums' && renderChart(topAlbums, 'albums')}
                        {currentChart === 'global200' && renderChart(global200, 'tracks')}
                        {currentChart === 'hot100' && renderChart(hot100, 'hot100')}
                    </div>
                </>
            )}
        </div>
    );
};

export default Charts;
