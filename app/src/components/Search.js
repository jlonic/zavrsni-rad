import { useState } from 'react';

const Search = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [message, setMessage] = useState('');

    const handleChange = async (e) => {
        const query = e.target.value;
        setQuery(query);

        if (query.length > 1) {
            try {
                const response = await fetch(`http://localhost:5000/search/${query}`, {
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
        <div className="search-bar">
            <input type="text" value={query} onChange={handleChange} placeholder="Search" />
            {showDropdown && results.length > 0 && (
                <div>
                    <h2>Artists</h2>
                    {results.map((result, index) => (
                        result.artist_name && (
                            <div key={index} className='searchResults'>
                                <a href={`http://localhost:3000/artists/${result.artist_id}`}>
                                    <p>{result.artist_name}</p>
                                    <img src={result.artist_image} alt='' style={{ width: '50px', height: '50px' }} />
                                </a>
                            </div>
                        )
                    ))}
                    <h2>Albums</h2>
                    {results.map((result, index) => (
                        result.album_title && (
                            <div key={index} className='searchResults'>
                                <a href={`http://localhost:3000/albums/${result.album_id}`}>
                                    <p>{result.album_title}</p>
                                    <p>{result.release_date}</p>
                                    <img src={result.cover_image} alt='' style={{ width: '50px', height: '50px' }} />
                                </a>
                            </div>
                        )
                    ))}
                    <h2>Tracks</h2>
                    {results.map((result, index) => (
                        result.track_title && (
                            <div key={index} className='searchResults'>
                                <a href={`http://localhost:3000/tracks/${result.track_id}`}>
                                    <p>{result.track_title}</p>
                                    <p>{result.duration}</p>
                                    <img src={result.cover_image} alt='' style={{ width: '50px', height: '50px' }} />
                                </a>
                            </div>
                        )
                    ))}
                    <h2>User Profiles</h2>
                    {results.map((result, index) => (
                        result.username && (
                            <div key={index} className='searchResults'>
                                <a href={`http://localhost:3000/users/${result.username}`}>
                                    <p>{result.username}</p>
                                    <img src={result.profile_picture} alt='' style={{ width: '50px', height: '50px' }} />
                                </a>
                            </div>
                        )
                    ))}
                </div>
            )}
            {message ? <p>{message}</p> : null}
        </div>
    );
};

export default Search;