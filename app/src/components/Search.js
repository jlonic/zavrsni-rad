import { useState } from 'react';

const Search = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [message, setMessage] = useState('');
    const [category, setCategory] = useState('all');

    const handleChange = async (e) => {
        const query = e.target.value;
        setQuery(query);

        if (query.length > 1) {
            try {
                const response = await fetch(`http://localhost:5000/search/${category}/${query}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                const data = await response.json();
                if (response.ok) {
                    setResults(data);
                    setShowDropdown(true);
                } else {
                    setMessage(data.message);
                }

            } catch (error) {
                console.error(error);
            }
        } else {
            setResults([]);
            setShowDropdown(false);
        }
    };

    return (
        <div className="relative">
            <div className="flex items-center border-gray-300 py-2">
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="bg-gray-500 px-4 py-1 rounded shadow leading-tight focus:outline-none focus:shadow-outline mr-2"
                >
                    <option value="all">All</option>
                    <option value="artists">Artists</option>
                    <option value="albums">Albums</option>
                    <option value="tracks">Tracks</option>
                    <option value="users">Users</option>
                </select>
                <input
                    type="text"
                    value={query}
                    onChange={handleChange}
                    placeholder="Search"
                    className="block w-full bg-gray-500 text-gray-200 px-4 py-2 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>
            {showDropdown && results.length > 0 && (
                <div className="absolute mt-1 w-full bg-gray-300 text-gray-800 rounded shadow-lg overflow-hidden z-50">
                    {(category === 'all' || category === 'artists') && (
                        <>
                            <h2 className="px-4 py-2 bg-gray-500 text-gray-800 font-bold">Artists</h2>
                            {results.slice(0, 10).map((result, index) => (
                                result.artist_name && (
                                    <div key={index} className='px-4 py-2 border-b border-gray-200'>
                                        <a href={`http://localhost:3000/artists/${result.artist_id}`} className='flex items-center space-x-2'>
                                            <img src={result.artist_image} alt='' className="w-10 h-10 mr-2 rounded-full" />
                                            <span className='font-bold'>{result.artist_name}</span>
                                        </a>
                                    </div>
                                )
                            ))}
                        </>
                    )}

                    {(category === 'all' || category === 'albums') && (
                        <>
                            <h2 className="px-4 py-2 bg-gray-500 text-gray-800 font-bold">Albums</h2>
                            {results.slice(0, 10).map((result, index) => (
                                result.album_title && (
                                    <div key={index} className='px-4 py-2 border-b border-gray-200'>
                                        <a href={`http://localhost:3000/albums/${result.album_id}`} className='flex items-center space-x-2'>
                                            <img src={result.cover_image} alt='' className="w-10 h-10 rounded-full" />
                                            <span className='font-bold'>{result.album_title}</span>
                                        </a>
                                        <p className='text-sm text-gray-500'>
                                            Released: {new Date(result.release_date).toLocaleDateString('en-GB')}
                                        </p>
                                    </div>
                                )
                            ))}
                        </>
                    )}

                    {(category === 'all' || category === 'tracks') && (
                        <>
                            <h2 className="px-4 py-2 bg-gray-500 text-gray-800 font-bold">Tracks</h2>
                            {results.slice(0, 10).map((result, index) => (
                                result.track_title && (
                                    <div key={index} className='px-4 py-2 border-b border-gray-200 '>
                                        <a href={`http://localhost:3000/tracks/${result.track_id}`} className='flex items-center space-x-2'>
                                            <img src={result.cover_image} alt='' className="w-10 h-10 mr-2 rounded-full" />
                                            <span className='font-bold'>{result.track_title}</span>
                                        </a>
                                    </div>
                                )
                            ))}
                        </>
                    )}

                    {(category === 'all' || category === 'users') && (
                        <>
                            <h2 className="px-4 py-2 bg-gray-500 text-gray-800 font-bold">User Profiles</h2>
                            {results.slice(0, 10).map((result, index) => (
                                result.username && (
                                    <div key={index} className='px-4 py-2 border-b border-gray-200'>
                                        <a href={`http://localhost:3000/users/${result.username}`} className='flex items-center space-x-2'>
                                            <img src={`http://localhost:5000${result.profile_picture}`} alt='' className="w-10 h-10 mr-2 rounded-full" />
                                            <span className='font-bold'>{result.username}</span>
                                        </a>
                                    </div>
                                )
                            ))}
                        </>
                    )}
                </div>
            )}
            {message ? <p>{message}</p> : null}
        </div>
    );
};

export default Search;