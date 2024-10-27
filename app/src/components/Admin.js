import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Navbar from './Navbar';
import Loading from '../svg/loading.gif';

const Admin = () => {
    const navigate = useNavigate();
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);
    //artists
    const [artist_name, setArtist_name] = useState('');
    const [artist_image, setArtist_image] = useState('');
    const [artist_info, setArtist_info] = useState('');
    const [isArtistSoftDeleted, setIsArtistSoftDeleted] = useState(false);
    const [artistId, setArtistId] = useState(0);
    const [displayEditArtistForm, setDisplayEditArtistForm] = useState(false);
    const [allArtists, setAllArtists] = useState([]);
    const [getArtist, setGetArtist] = useState([]);
    const [displayAllArtists, setDisplayAllArtists] = useState(false);
    //albums
    const [isAlbumSoftDeleted, setIsAlbumSoftDeleted] = useState(false);
    const [displayEditAlbumForm, setDisplayEditAlbumForm] = useState(false);
    const [album_id, setAlbum_id] = useState(0);
    const [album_title, setAlbum_title] = useState('');
    const [release_date, setRelease_date] = useState('');
    const [cover_image, setCover_image] = useState('');
    const [record_type, setRecord_type] = useState('');
    const [album_info, setAlbum_info] = useState('');
    const [allAlbums, setAllAlbums] = useState([]);
    const [album, setAlbum] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [displayAllAlbums, setDisplayAllAlbums] = useState(false);
    const [allArtistAlbums, setAllArtistAlbums] = useState([]);
    //tracks
    const [track_id, setTrack_id] = useState(0);
    const [track_title, setTrack_title] = useState('');
    const [duration, setDuration] = useState('');
    const [track_number, setTrack_number] = useState('');
    const [isTrackSoftDeleted, setIsTrackSoftDeleted] = useState(false);
    const [displayEditTrackForm, setDisplayEditTrackForm] = useState(false);
    const [allTracksFromAlbum, setAllTracksFromAlbum] = useState([]);
    const [allTracksFromArtist, setAllTracksFromArtist] = useState([]);
    const [allTracks, setAllTracks] = useState([]);
    //users
    const [allUsers, setAllUsers] = useState([]);
    const [displayAllUsers, setDisplayAllUsers] = useState(false);
    const [userId, setUserId] = useState(0);
    const [username, setUsername] = useState('');
    const [editUsername, setEditUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [profile_picture, setProfile_picture] = useState('');
    const [user_role, setUser_role] = useState('');
    const [displayEditUserForm, setDisplayEditUserForm] = useState(false);
    const [displayEditUserPasswordForm, setDisplayEditUserPasswordForm] = useState(false);

    const [display, setDisplay] = useState({
        addArtist: false,
        addArtistManually: false,
        editArtist: false,
        getArtist: false,
        addAlbum: false,
        editAlbum: false,
        getAlbumById: false,
        artistAlbums: false,
        addTrack: false,
        getTrack: false,
        editTrack: false,
        allTracksFromAlbum: false,
        allTracksFromArtist: false,
        user: false,
        getUserPassword: false
    });


    const addArtist = async (artist_name) => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://localhost:5000/admin/add-artist/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer: ${token}`
                },
                body: JSON.stringify({ artist_name })
            });
            const data = await response.json();
            if (response.ok) {
                setMessage(data.message);
            }
            console.log(data);
        } catch (error) {
            console.log(error);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const artist_name = e.target.artist_name.value;
        addArtist(artist_name);
    };

    const addArtistManually = async (e) => {
        e.preventDefault();

        if (artist_name === '' || artist_name === ' ') {
            setMessage('artist_name cannot be empty');
            return;
        }

        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://localhost:5000/artists/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer: ${token}`,
                },
                body: JSON.stringify({ artist_name, artist_image, artist_info })
            });
            const data = await response.json();
            if (response.ok) {
                setArtist_name('');
                setArtist_image('');
                setArtist_info('');
                setMessage('Artist added successfully');
            } else {
                setMessage(data.message);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const getArtistById = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://localhost:5000/artists/${artistId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            if (response.ok) {
                setIsArtistSoftDeleted(false);
                setDisplayEditArtistForm(true);
                setArtist_name(data[0].artist_name);
                setArtist_image(data[0].artist_image);
                setArtist_info(data[0].artist_info);
            } else {
                const softDeletedArtist = await fetch(`http://localhost:5000/artists/soft-deleted/${artistId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer: ${token}`,
                    },
                });
                const softDeletedArtistData = await softDeletedArtist.json();
                if (softDeletedArtist.ok) {
                    setDisplayEditArtistForm(true);
                    setArtist_name(softDeletedArtistData[0].artist_name);
                    setArtist_image(softDeletedArtistData[0].artist_image);
                    setArtist_info(softDeletedArtistData[0].artist_info);
                    setIsArtistSoftDeleted(true);
                } else {
                    setDisplayEditArtistForm(false);
                    setMessage(data.message);
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    const getArtistByName = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://localhost:5000/artists/name/${artist_name}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer: ${token}`,
                },
            });
            const data = await response.json();
            if (response.ok) {
                setGetArtist(data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const updateArtist = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://localhost:5000/artists/update/${artistId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer: ${token}`,
                }, body: JSON.stringify({ artist_name, artist_image, artist_info })
            });
            const data = await response.json();
            if (response.ok) {
                setMessage('Artist updated successfully');
            } else {
                setMessage(data.message);
            }
        } catch (error) {
            console.log(error);
        }

    };

    const softDeleteArtist = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://localhost:5000/artists/soft-delete/${artistId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer: ${token}`,
                },
            });
            const data = await response.json();
            if (response.ok) {
                setIsArtistSoftDeleted(true);
                setMessage('Artist soft deleted successfully');
            } else {
                setMessage(data.message);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const restoreArtist = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://localhost:5000/artists/restore/${artistId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer: ${token}`,
                },
            });
            const data = await response.json();
            if (response.ok) {
                setMessage('Artist restored successfully');
                setIsArtistSoftDeleted(false);
            } else {
                setMessage(data.message);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const getAllArtists = async () => {
        const token = localStorage.getItem('token');

        try {
            const response = await fetch(`http://localhost:5000/artists/all`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer: ${token}`,
                },
            });
            const data = await response.json();
            if (response.ok) {
                data.sort((a, b) => a.artist_id - b.artist_id);
                setAllArtists(data);
            } else {
                setMessage(data.message);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const deleteArtist = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://localhost:5000/artists/delete-all-data/${artistId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer: ${token}`,
                },
            });
            const data = await response.json();
            if (response.ok) {
                setMessage('Artist deleted successfully');
            } else {
                setMessage(data.message);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const addAlbum = async (e) => {
        e.preventDefault();

        if (album_title === '' || album_title === ' ') {
            setMessage('album_title cannot be empty');
            return;
        }

        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://localhost:5000/albums/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer: ${token}`,
                },
                body: JSON.stringify({ album_title, artist_id: artistId, release_date, cover_image, record_type, album_info })
            });
            const data = await response.json();
            if (response.ok) {
                setAlbum_title('');
                setArtistId(0);
                setRelease_date('');
                setCover_image('');
                setRecord_type('');
                setAlbum_info('');
                setMessage('Album added successfully');
            } else {
                setMessage(data.message);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const getAlbumByTitle = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://localhost:5000/albums/title/${album_title}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer: ${token}`,
                },
            });
            const data = await response.json();
            if (response.ok) {
                setAlbum(data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const getAlbumById = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://localhost:5000/albums/${album_id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer: ${token}`,
                },
            });
            const data = await response.json();
            if (response.ok) {
                setDisplayEditAlbumForm(true);
                setAlbum_id(data[0].album_id);
                setAlbum_title(data[0].album_title);
                setArtistId(data[0].artist_id);
                setRelease_date(data[0].release_date);
                setCover_image(data[0].cover_image);
                setRecord_type(data[0].record_type);
                setAlbum_info(data[0].album_info);
                setAllAlbums(data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const updateAlbum = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://localhost:5000/albums/update/${album_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer: ${token}`,
                }, body: JSON.stringify({ album_title, artist_id: artistId, release_date, cover_image, record_type, album_info })
            });
            const data = await response.json();
            if (response.ok) {
                setMessage('Album updated successfully');
            } else {
                setMessage(data.message);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const softDeleteAlbum = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://localhost:5000/albums/soft-delete/${album_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer: ${token}`,
                },
            });
            const data = await response.json();
            if (response.ok) {
                setIsAlbumSoftDeleted(true);
                setMessage('Album soft deleted successfully');
            } else {
                setMessage(data.message);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const restoreAlbum = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://localhost:5000/albums/restore/${album_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer: ${token}`,
                },
            });
            const data = await response.json();
            if (response.ok) {
                setMessage('Album restored successfully');
                setIsAlbumSoftDeleted(false);
            } else {
                setMessage(data.message);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const deleteAlbum = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://localhost:5000/albums/delete-all-data/${album_id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer: ${token}`,
                },
            });
            const data = await response.json();
            if (response.ok) {
                setMessage('Album data deleted successfully');
            } else {
                setMessage(data.message);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const getAllAlbums = useCallback(async (page = 0) => {
        const limit = 5;
        const offset = page * limit;
        setIsLoading(true);

        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://localhost:5000/albums/getAll/${limit}/${offset}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer: ${token}`,
                },
            });
            const data = await response.json();
            if (response.ok) {
                if (data.length > 0) {
                    setAllAlbums(prevAlbums => [...prevAlbums, ...data]);
                    setCurrentPage(page);
                } else {
                    setHasMore(false);
                }
            } else {
                setMessage(data.message);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const getAllAlbumsByArtist = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://localhost:5000/albums/artist-name/${artist_name}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer: ${token}`,
                },
            });
            const data = await response.json();
            if (response.ok) {
                data.sort((a, b) => b.release_date.localeCompare(a.release_date));
                setAllArtistAlbums(data);
            } else {
                setMessage(data.message);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const addTrack = async (e) => {
        e.preventDefault();

        if (track_title === '' || track_title === ' ') {
            setMessage('track_title cannot be empty');
            return;
        }

        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://localhost:5000/tracks/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer: ${token}`,
                },
                body: JSON.stringify({ album_id, track_title, duration, track_number })
            });
            const data = await response.json();
            if (response.ok) {
                setAlbum_id(0);
                setTrack_title('');
                setDuration('');
                setTrack_number('');
                setMessage('Track added successfully');
            } else {
                setMessage(data.message);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const getTrackById = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://localhost:5000/tracks/${track_id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            if (response.ok) {
                setIsTrackSoftDeleted(false);
                setDisplayEditTrackForm(true);
                setAlbum_id(data[0].album_id)
                setTrack_id(data[0].track_id);
                setTrack_title(data[0].track_title);
                setDuration(data[0].duration);
                setTrack_number(data[0].track_number);
                setArtist_name(data[0].artist_name);
                setCover_image(data[0].cover_image);
                setAlbum_title(data[0].album_title);
            } else {
                const softDeletedTrack = await fetch(`http://localhost:5000/tracks/soft-deleted/${track_id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer: ${token}`,
                    },
                });
                const softDeletedTrackData = await softDeletedTrack.json();
                if (softDeletedTrack.ok) {
                    setDisplayEditTrackForm(true);
                    setAlbum_id(softDeletedTrackData[0].album_id);
                    setTrack_id(softDeletedTrackData[0].track_id);
                    setTrack_title(softDeletedTrackData[0].track_title);
                    setDuration(softDeletedTrackData[0].duration);
                    setTrack_number(softDeletedTrackData[0].track_number);
                    setArtist_name(softDeletedTrackData[0].artist_name);
                    setCover_image(softDeletedTrackData[0].cover_image);
                    setAlbum_title(softDeletedTrackData[0].album_title);
                    setIsTrackSoftDeleted(true);
                } else {
                    setDisplayEditTrackForm(false);
                    setMessage(data.message);
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    const getTrackByTrackTitle = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://localhost:5000/tracks/title/${track_title}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer: ${token}`,
                },
            });
            const data = await response.json();
            if (response.ok) {
                setAllTracks(data);
            } else {
                setMessage(data.message);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const updateTrack = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://localhost:5000/tracks/update/${track_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer: ${token}`,
                }, body: JSON.stringify({ album_id, track_title, duration, track_number })
            });
            const data = await response.json();
            if (response.ok) {
                setMessage('Track updated successfully');
            } else {
                setMessage(data.message);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const softDeleteTrack = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://localhost:5000/tracks/soft-delete/${track_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer: ${token}`,
                },
            });
            const data = await response.json();
            if (response.ok) {
                setIsTrackSoftDeleted(true);
                setMessage('Track soft deleted successfully');
            } else {
                setMessage(data.message);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const restoreTrack = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://localhost:5000/tracks/restore/${track_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer: ${token}`,
                },
            });
            const data = await response.json();
            if (response.ok) {
                setMessage('Track restored successfully');
                setIsTrackSoftDeleted(false);
            } else {
                setMessage(data.message);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const deleteTrack = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://localhost:5000/tracks/delete/${track_id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer: ${token}`,
                },
            });
            const data = await response.json();
            if (response.ok) {
                setMessage('Track data deleted successfully');
            } else {
                setMessage(data.message);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const getAllTracksByAlbum = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://localhost:5000/tracks/album-name/${album_title}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer: ${token}`,
                },
            });
            const data = await response.json();
            if (response.ok) {
                data.sort((a, b) => a.track_number - b.track_number);
                setAllTracksFromAlbum(data);
            } else {
                setMessage(data.message);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const getAllTracksByArtist = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://localhost:5000/tracks/artist-name/${artist_name}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer: ${token}`,
                },
            });
            const data = await response.json();
            if (response.ok) {
                data.sort((a, b) => a.album_id - b.album_id);
                setAllTracksFromArtist(data);
            } else {
                setMessage(data.message);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const getAllUsers = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://localhost:5000/users/all`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer: ${token}`,
                },
            });
            const data = await response.json();
            if (response.ok) {
                setAllUsers(data);
                data.sort((a, b) => a.user_id - b.user_id);
            } else {
                setMessage(data.message);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const getUserByUsername = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://localhost:5000/users/${username}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer: ${token}`,
                },
            });
            const data = await response.json();
            if (response.ok) {
                setDisplayEditUserForm(true);
                setDisplayEditUserPasswordForm(true);
                setUserId(data[0].user_id);
                setEditUsername(data[0].username);
                setPassword(data[0].password);
                setEmail(data[0].email);
                setProfile_picture(data[0].profile_picture);
                setUser_role(data[0].user_type);
            } else {
                setMessage(data.message);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const updateUser = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://localhost:5000/users/update/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer: ${token}`,
                }, body: JSON.stringify({ username, email, user_type: user_role })
            });
            const data = await response.json();
            if (response.ok) {
                setMessage('User updated successfully');
            } else {
                setMessage(data.message);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const deleteUser = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://localhost:5000/users/delete/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer: ${token}`,
                },
            });
            const data = await response.json();
            if (response.ok) {
                setMessage('User deleted successfully');
            } else {
                setMessage(data.message);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const changeUserPassword = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://localhost:5000/users/updatePassword/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer: ${token}`,
                }, body: JSON.stringify({ password })
            });
            const data = await response.json();
            if (response.ok) {
                setMessage('User password changed successfully');
            } else {
                setMessage(data.message);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const removeProfilePicture = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://localhost:5000/users/removeProfilePicture/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer: ${token}`,
                },
            });
            const data = await response.json();
            if (response.ok) {
                setMessage('Profile picture removed successfully');
            } else {
                setMessage(data.message);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleLoadMore = useCallback(() => {
        if (hasMore && !isLoading) {
            getAllAlbums(currentPage + 1);
        }
    }, [currentPage, getAllAlbums, hasMore, isLoading]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        } else {
            const decodedToken = jwtDecode(token);
            if (decodedToken.user_role !== 'administrator') {
                navigate('/dashboard');
            }
        }
        setLoading(false);
        getAllAlbums();
    }, [navigate, getAllAlbums]);

    useEffect(() => {
        const handleScroll = () => {
            if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 100 && !isLoading) {
                handleLoadMore();
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [currentPage, isLoading, hasMore, handleLoadMore]);

    const handleNameChange = (e) => {
        setArtist_name(e.target.value);
    };
    const handleInfoChange = (e) => {
        setArtist_info(e.target.value);
    };
    const handleGetAllArtists = (e) => {
        e.preventDefault();
        if (!displayAllArtists) {
            getAllArtists();
        }
        setDisplayAllArtists(!displayAllArtists);
    };
    const handleGetAllAlbums = (e) => {
        e.preventDefault();
        if (!displayAllAlbums) {
            getAllAlbums();
        }
        setDisplayAllAlbums(!displayAllAlbums);
    };
    const handleGetAllUsers = (e) => {
        e.preventDefault();
        if (!displayAllUsers) {
            getAllUsers();
        }
        setDisplayAllUsers(!displayAllUsers);
    };
    const handleGetAlbums = (artist_name) => {
        setAllArtistAlbums([]);
        setDisplayAllArtists(false);
        setArtist_name(artist_name);
        handleToggle('artistAlbums');
    };
    const handleToggle = (key) => {
        setDisplayAllArtists(false);
        setDisplayAllAlbums(false);
        setDisplayAllUsers(false);
        setAllAlbums([]);
        setDisplay(prevState => {
            const newState = { ...prevState };
            Object.keys(newState).forEach(k => {
                newState[k] = false;
            });
            newState[key] = !prevState[key];
            return newState;
        });
    };
    const handleEditAlbum = (album_id) => {
        setDisplayEditAlbumForm(false);
        setAlbum_id(album_id);
        handleToggle('editAlbum')
    };
    const handleEditArtist = (artist_id) => {
        setDisplayEditArtistForm(false);
        setArtistId(artist_id);
        handleToggle('editArtist')
    };
    const handleGetTracks = (album_title) => {
        setAllTracksFromAlbum([]);
        setAlbum_title(album_title);
        handleToggle('allTracksFromAlbum');
    };
    const handleEditTrack = (track_id) => {
        setDisplayEditTrackForm(false);
        setTrack_id(track_id);
        handleToggle('editTrack')
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

    return (
        <div className='bg-gray-700 min-h-screen'>
            <Navbar />
            <div className='text-gray-200'>
                <p>{message}</p>
                <div className="bg-gray-700 text-white p-4">
                    <div className="flex flex-wrap gap-4 mb-4">
                        <button onClick={() => handleToggle('addArtist')} className="bg-gray-800 hover:bg-gray-500 px-3 py-2 rounded-md focus:outline-none">
                            Add Artist using API
                        </button>
                        <button onClick={() => handleToggle('addArtistManually')} className="bg-gray-800 hover:bg-gray-500 px-3 py-2 rounded-md focus:outline-none">
                            Add Artist Manually
                        </button>
                        <button onClick={() => handleToggle('getArtist')} className="bg-gray-800 hover:bg-gray-500 px-3 py-2 rounded-md focus:outline-none">
                            Get Artist
                        </button>
                        <button onClick={() => handleToggle('editArtist')} className="bg-gray-800 hover:bg-gray-500 px-3 py-2 rounded-md focus:outline-none">
                            Edit Artist
                        </button>
                        <button onClick={handleGetAllArtists} className="bg-gray-800 hover:bg-gray-500 px-3 py-2 rounded-md focus:outline-none">
                            {displayAllArtists ? 'Hide All Artists' : 'Get All Artists'}
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-4 mb-4">
                        <button onClick={() => handleToggle('addAlbum')} className="bg-gray-800 hover:bg-gray-500 px-3 py-2 rounded-md focus:outline-none">
                            Add Album
                        </button>
                        <button onClick={() => handleToggle('getAlbumById')} className="bg-gray-800 hover:bg-gray-500 px-3 py-2 rounded-md focus:outline-none">
                            Get Album
                        </button>
                        <button onClick={() => handleToggle('editAlbum')} className="bg-gray-800 hover:bg-gray-500 px-3 py-2 rounded-md focus:outline-none">
                            Edit Album
                        </button>
                        <button onClick={() => handleToggle('artistAlbums')} className="bg-gray-800 hover:bg-gray-500 px-3 py-2 rounded-md focus:outline-none">
                            Get Albums by Artist Name
                        </button>
                        <button onClick={handleGetAllAlbums} className="bg-gray-800 hover:bg-gray-500 px-3 py-2 rounded-md focus:outline-none">
                            {displayAllAlbums ? 'Hide All Albums' : 'Get All Albums'}
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-4 mb-4">
                        <button onClick={() => handleToggle('addTrack')} className="bg-gray-800 hover:bg-gray-500 px-3 py-2 rounded-md focus:outline-none">
                            Add Track
                        </button>
                        <button onClick={() => handleToggle('getTrack')} className="bg-gray-800 hover:bg-gray-500 px-3 py-2 rounded-md focus:outline-none">
                            Get Track
                        </button>
                        <button onClick={() => handleToggle('editTrack')} className="bg-gray-800 hover:bg-gray-500 px-3 py-2 rounded-md focus:outline-none">
                            Edit Track
                        </button>
                        <button onClick={() => handleToggle('allTracksFromAlbum')} className="bg-gray-800 hover:bg-gray-500 px-3 py-2 rounded-md focus:outline-none">
                            Get All Tracks From Album
                        </button>
                        <button onClick={() => handleToggle('allTracksFromArtist')} className="bg-gray-800 hover:bg-gray-500 px-3 py-2 rounded-md focus:outline-none">
                            Get All Tracks From Artist
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-4 mb-4">
                        <button onClick={() => handleToggle('user')} className="bg-gray-800 hover:bg-gray-500 px-3 py-2 rounded-md focus:outline-none">
                            Get User
                        </button>
                        <button onClick={() => handleToggle('getUserPassword')} className="bg-gray-800 hover:bg-gray-500 px-3 py-2 rounded-md focus:outline-none">
                            Change User Password
                        </button>
                        <button onClick={handleGetAllUsers} className="bg-gray-800 hover:bg-gray-500 px-3 py-2 rounded-md focus:outline-none">
                            {displayAllUsers ? 'Hide All Users' : 'Get All Users'}
                        </button>
                    </div>
                </div>
                <div className='p-4'>
                    {display.addArtist && (
                        <div className="bg-gray-800 p-4 rounded-md mb-4">
                            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                                <div>
                                    <label htmlFor="artist_name" className="block text-gray-300">Artist Name:</label>
                                    <input type="text" id="artist_name" placeholder="Artist Name" className="w-full px-3 py-2 bg-gray-700 text-gray-200 rounded-md focus:outline-none focus:ring focus:border-blue-500" />
                                </div>
                                <button type="submit" className="bg-gray-900 hover:bg-gray-500 px-4 py-2 rounded-md focus:outline-none">Add Artist</button>
                            </form>
                            <p>{message}</p>
                        </div>
                    )}
                    {display.addArtistManually && (
                        <div className="bg-gray-800 p-4 rounded-md mb-4">
                            <form onSubmit={addArtistManually} className="flex flex-col gap-4">
                                <div>
                                    <label htmlFor="artist_name" className="block text-gray-300">Artist Name:</label>
                                    <input
                                        type="text"
                                        id="artist_name"
                                        placeholder="Artist Name (required)"
                                        value={artist_name}
                                        onChange={(e) => setArtist_name(e.target.value)}
                                        className="w-full px-3 py-2 bg-gray-700 text-gray-200 rounded-md focus:outline-none focus:ring focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="artist_image" className="block text-gray-300">Artist Image:</label>
                                    <input
                                        type="text"
                                        id="artist_image"
                                        placeholder="Artist Image URL (optional)"
                                        value={artist_image}
                                        onChange={(e) => setArtist_image(e.target.value)}
                                        className="w-full px-3 py-2 bg-gray-700 text-gray-200 rounded-md focus:outline-none focus:ring focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="artist_info" className="block text-gray-300">Artist Info:</label>
                                    <input
                                        type="text"
                                        id="artist_info"
                                        placeholder="Artist Info (optional)"
                                        value={artist_info}
                                        onChange={(e) => setArtist_info(e.target.value)}
                                        className="w-full px-3 py-2 bg-gray-700 text-gray-200 rounded-md focus:outline-none focus:ring focus:border-blue-500"
                                    />
                                </div>
                                <button type="submit" className="bg-gray-900 hover:bg-gray-500 px-4 py-2 rounded-md focus:outline-none">Add Artist</button>
                            </form>
                        </div>
                    )}
                    {display.getArtist && (
                        <div className="bg-gray-800 p-4 rounded-md mb-4">
                            <form onSubmit={getArtistByName} className="flex flex-col gap-4">
                                <div>
                                    <label htmlFor="artist_name" className="block text-gray-300">Artist Name:</label>
                                    <input
                                        type="text"
                                        id="artist_name"
                                        placeholder="Artist Name"
                                        value={artist_name}
                                        onChange={(e) => setArtist_name(e.target.value)}
                                        className="w-full px-3 py-2 bg-gray-700 text-gray-200 rounded-md focus:outline-none focus:ring focus:border-blue-500"
                                    />
                                </div>
                                <button type="submit" className="bg-gray-900 hover:bg-gray-500 px-4 py-2 rounded-md focus:outline-none">Get Artist</button>
                            </form>
                            <div className="mt-4">
                                {getArtist.map((artist) => (
                                    <div key={artist.artist_id} className="mb-4 p-4 bg-gray-700 rounded-md">
                                        <h3 className="text-xl text-white mb-2">{artist.artist_name}</h3>
                                        <p className="text-gray-300 mb-2">Artist ID: {artist.artist_id}</p>
                                        <p className="text-gray-300 mb-2">Artist Info: {artist.artist_info}</p>
                                        <img src={artist.artist_image} alt="" className="w-48 h-48 object-cover mb-2" />
                                        <button onClick={() => handleEditArtist(artist.artist_id)} className="bg-gray-900 hover:bg-gray-500 px-4 py-2 rounded-md focus:outline-none">Edit Artist</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {display.editArtist && (
                        <div className="bg-gray-800 p-4 rounded-md mb-4">
                            <form onSubmit={getArtistById} className="flex flex-col gap-4">
                                <div>
                                    <label htmlFor="artistId" className="block text-gray-300">Artist ID:</label>
                                    <input
                                        type="number"
                                        id="artistId"
                                        placeholder="Artist ID"
                                        value={artistId}
                                        onChange={(e) => setArtistId(e.target.value)}
                                        className="w-full px-3 py-2 bg-gray-700 text-gray-200 rounded-md focus:outline-none focus:ring focus:border-blue-500"
                                    />
                                </div>
                                <button type="submit" className="bg-gray-900 hover:bg-gray-500 px-4 py-2 rounded-md focus:outline-none">Get Artist</button>
                            </form>
                            {displayEditArtistForm && (
                                <div className="mt-4">
                                    <form onSubmit={updateArtist} className="flex flex-col gap-4 bg-gray-700 p-4 rounded-md">
                                        <div>
                                            <label htmlFor="artist_name" className="block text-gray-300">Artist Name:</label>
                                            <input
                                                type="text"
                                                id="artist_name"
                                                value={artist_name}
                                                onChange={handleNameChange}
                                                className="w-full px-3 py-2 bg-gray-600 text-gray-200 rounded-md focus:outline-none focus:ring focus:border-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-300">Artist Image:</label>
                                            <img src={artist_image} alt="" className="w-48 h-48 object-cover mb-2" />
                                        </div>
                                        <div>
                                            <label htmlFor="artist_info" className="block text-gray-300">Artist Info:</label>
                                            <textarea
                                                id="artist_info"
                                                value={artist_info}
                                                onChange={handleInfoChange}
                                                rows="4"
                                                className="w-full px-3 py-2 bg-gray-600 text-gray-200 rounded-md focus:outline-none focus:ring focus:border-blue-500"
                                            />
                                        </div>
                                        <button type="submit" className="bg-gray-900 hover:bg-gray-500 px-4 py-2 rounded-md focus:outline-none">Update Artist</button>
                                    </form>
                                    <div className="mt-4 flex flex-col gap-2">
                                        {isArtistSoftDeleted ? (
                                            <button type="button" onClick={restoreArtist} className="bg-gray-500 hover:bg-gray-400 px-4 py-2 rounded-md focus:outline-none">Restore All Artist Data</button>
                                        ) : (
                                            <button type="button" onClick={softDeleteArtist} className="bg-gray-900 hover:bg-gray-700 px-4 py-2 rounded-md focus:outline-none">Soft Delete All Artist Data</button>
                                        )}
                                        <button type="button" onClick={deleteArtist} className="bg-red-700 hover:bg-red-900 px-4 py-2 rounded-md focus:outline-none">Delete All Artist Data From Database</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    {displayAllArtists && (
                        <div className="bg-gray-800 p-4 rounded-md mb-4">
                            <ul className="space-y-4">
                                {allArtists.map((artist) => (
                                    <li key={artist.artist_id} className="bg-gray-700 p-4 rounded-md">
                                        <div>
                                            <p className="text-gray-300">Artist ID: {artist.artist_id}</p>
                                            {artist.is_deleted && <p className="text-red-500">This artist is soft deleted</p>}
                                            <p className="text-white text-xl">{artist.artist_name}</p>
                                            <img src={artist.artist_image} alt="" className="w-48 h-48 object-cover mb-2 rounded-md" />
                                            <p className="text-gray-300">{artist.artist_info}</p>
                                            <div className="flex space-x-4 mt-2">
                                                <button onClick={() => handleEditArtist(artist.artist_id)} className="bg-gray-900 hover:bg-gray-500 px-4 py-2 rounded-md focus:outline-none">Edit Artist</button>
                                                <button onClick={() => handleGetAlbums(artist.artist_name)} className="bg-gray-900 hover:bg-gray-500 px-4 py-2 rounded-md focus:outline-none">Get Albums</button>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {display.addAlbum && (
                        <div className="bg-gray-800 p-4 rounded-md mb-4">
                            <form onSubmit={addAlbum} className="space-y-4">
                                <div>
                                    <label htmlFor="album_title" className="block text-gray-300 mb-1">Album Title</label>
                                    <input type="text" id="album_title" placeholder='Album Title (required)'
                                        value={album_title}
                                        onChange={(e) => setAlbum_title(e.target.value)}
                                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="artist_id" className="block text-gray-300 mb-1">Artist ID</label>
                                    <input type="text" id="artist_id" placeholder='Artist ID (required)'
                                        value={artistId}
                                        onChange={(e) => setArtistId(e.target.value)}
                                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="release_date" className="block text-gray-300 mb-1">Release Date</label>
                                    <input type="text" id="release_date" placeholder='Release Date (dd-mm-yyyy)'
                                        value={release_date}
                                        onChange={(e) => setRelease_date(e.target.value)}
                                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="cover_image" className="block text-gray-300 mb-1">Cover Image</label>
                                    <input type="text" id="cover_image" placeholder='Cover Image'
                                        value={cover_image}
                                        onChange={(e) => setCover_image(e.target.value)}
                                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="record_type" className="block text-gray-300 mb-1">Record Type</label>
                                    <input type="text" id="record_type" placeholder='Record Type'
                                        value={record_type}
                                        onChange={(e) => setRecord_type(e.target.value)}
                                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="album_info" className="block text-gray-300 mb-1">Album Info</label>
                                    <input type="text" id="album_info" placeholder='Album Info'
                                        value={album_info}
                                        onChange={(e) => setAlbum_info(e.target.value)}
                                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring focus:border-blue-500"
                                    />
                                </div>
                                <button type="submit" className="bg-gray-900 hover:bg-gray-500 px-4 py-2 rounded-md text-white focus:outline-none">
                                    Add Album
                                </button>
                            </form>
                        </div>
                    )}
                    {display.getAlbumById && (
                        <div className="bg-gray-800 p-4 rounded-md mb-4">
                            <form onSubmit={getAlbumByTitle} className="space-y-4">
                                <div>
                                    <label htmlFor="album_title" className="block text-gray-300 mb-1">Album Title</label>
                                    <input type="text" id="album_title" placeholder='Album Title'
                                        value={album_title} onChange={(e) => setAlbum_title(e.target.value)}
                                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring focus:border-blue-500"
                                    />
                                </div>
                                <button type="submit" className="bg-gray-900 hover:bg-gray-500 px-4 py-2 rounded-md text-white focus:outline-none">
                                    Get Album
                                </button>
                            </form>
                            <div className="mt-4 space-y-4">
                                {album.map((alb) => (
                                    <div key={alb.album_id} className="bg-gray-700 p-4 rounded-md">
                                        <h3 className="text-xl text-white">{alb.album_title}</h3>
                                        <p className="text-gray-300">Artist ID: {alb.artist_id}</p>
                                        <p className="text-gray-300">Album ID: {alb.album_id}</p>
                                        <p className="text-gray-300">Release Date: {alb.release_date}</p>
                                        <p className="text-gray-300">Record Type: {alb.record_type}</p>
                                        <p className="text-gray-300">Album Info: {alb.album_info}</p>
                                        <img src={alb.cover_image} alt='' className="w-48 h-48 mt-2 rounded-md" />
                                        <button onClick={() => handleEditAlbum(alb.album_id)}
                                            className="mt-2 bg-gray-900 hover:bg-gray-500 px-4 py-2 rounded-md text-white focus:outline-none">
                                            Edit Album
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {display.editAlbum && (
                        <div className="bg-gray-800 p-4 rounded-md mb-4">
                            <form onSubmit={getAlbumById} className="space-y-4">
                                <div>
                                    <label htmlFor="album_id" className="block text-gray-300 mb-1">Album ID</label>
                                    <input type="number" id="album_id" placeholder='Album ID'
                                        value={album_id} onChange={(e) => setAlbum_id(e.target.value)}
                                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring focus:border-blue-500"
                                    />
                                </div>
                                <button type="submit" className="bg-gray-900 hover:bg-gray-500 px-4 py-2 rounded-md text-white focus:outline-none">
                                    Get Album
                                </button>
                            </form>
                            {displayEditAlbumForm && (
                                <div className="mt-4 space-y-4">
                                    <form onSubmit={updateAlbum} className="space-y-4">
                                        <div>
                                            <label htmlFor="album_title" className="block text-gray-300 mb-1">Album Title</label>
                                            <input type="text" id="album_title" value={album_title}
                                                onChange={(e) => setAlbum_title(e.target.value)}
                                                className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring focus:border-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="cover_image" className="block text-gray-300 mb-1">Cover Image</label>
                                            <img src={cover_image} alt='' className="w-48 h-48 rounded-md" />
                                        </div>
                                        <div>
                                            <label htmlFor="album_info" className="block text-gray-300 mb-1">Album Info</label>
                                            <textarea id="album_info" value={album_info} onChange={(e) => setAlbum_info(e.target.value)}
                                                rows="15" cols="75"
                                                className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring focus:border-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="release_date" className="block text-gray-300 mb-1">Release Date</label>
                                            <input type="text" id="release_date" value={release_date}
                                                onChange={(e) => setRelease_date(e.target.value)}
                                                className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring focus:border-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="record_type" className="block text-gray-300 mb-1">Record Type</label>
                                            <input type="text" id="record_type" value={record_type}
                                                onChange={(e) => setRecord_type(e.target.value)}
                                                className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring focus:border-blue-500"
                                            />
                                        </div>
                                        <button type="submit" className="bg-gray-900 hover:bg-gray-500 px-4 py-2 rounded-md text-white focus:outline-none">
                                            Update Album
                                        </button>
                                    </form>
                                    <div className="mt-4 space-y-4">
                                        {isAlbumSoftDeleted ? (
                                            <button type="button" onClick={restoreAlbum}
                                                className="bg-gray-500 hover:bg-gray-400 px-4 py-2 rounded-md text-white focus:outline-none">
                                                Restore All Album Data
                                            </button>
                                        ) : (
                                            <button type="button" onClick={softDeleteAlbum}
                                                className="bg-gray-900 hover:bg-gray-700 px-4 py-2 rounded-md text-white focus:outline-none">
                                                Soft Delete All Album Data
                                            </button>
                                        )}
                                        <button type="button" onClick={deleteAlbum}
                                            className="bg-red-700 hover:bg-red-800 px-4 py-2 rounded-md text-white focus:outline-none">
                                            Delete All Album Data From Database
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    {displayAllAlbums && (
                        <div className="bg-gray-800 p-4 rounded-md mb-4">
                            {allAlbums.length > 0 ? (
                                <ul className="space-y-4">
                                    {allAlbums.map((album) => (
                                        <li key={album.album_id} className="bg-gray-700 p-4 rounded-md">
                                            <div>
                                                <p className="text-gray-300">Album ID: {album.album_id}</p>
                                                {album.is_deleted && <p className="text-red-500">This album is soft deleted</p>}
                                                <p className="text-xl text-white">{album.album_title}</p>
                                                <img src={album.cover_image} alt='' className="w-48 h-48 mt-2 rounded-md" />
                                                <p className="text-gray-300">Record Type: {album.record_type}</p>
                                                <p className="text-gray-300">Release Date: {album.release_date}</p>
                                                <p className="text-gray-300">{album.album_info}</p>
                                                <p className="text-gray-300 mt-2">
                                                    <button onClick={() => handleEditAlbum(album.album_id)}
                                                        className="bg-gray-900 hover:bg-gray-500 px-4 py-2 rounded-md text-white focus:outline-none">
                                                        Edit Album
                                                    </button>
                                                </p>
                                                <p className="text-gray-300 mt-2">
                                                    <button onClick={() => handleGetTracks(album.album_title)}
                                                        className="bg-gray-900 hover:bg-gray-500 px-4 py-2 rounded-md text-white focus:outline-none">
                                                        Get Album Tracks
                                                    </button>
                                                </p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-300">No albums found</p>
                            )}
                            {isLoading && <p className="text-gray-300">Loading...</p>}
                        </div>
                    )}
                    {display.artistAlbums && (
                        <div className="bg-gray-800 p-4 rounded-md mb-4">
                            <form onSubmit={getAllAlbumsByArtist} className="space-y-4">
                                <div>
                                    <label htmlFor="artist_name" className="block text-gray-300 mb-1">Artist Name</label>
                                    <input type="text" id="artist_name" placeholder='Artist Name'
                                        value={artist_name} onChange={(e) => setArtist_name(e.target.value)}
                                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring focus:border-blue-500"
                                    />
                                </div>
                                <button type="submit" className="bg-gray-900 hover:bg-gray-500 px-4 py-2 rounded-md text-white focus:outline-none">
                                    Get Albums
                                </button>
                            </form>
                            <ul className="mt-4 space-y-4">
                                {allArtistAlbums.map((album) => (
                                    <li key={album.album_id} className="bg-gray-700 p-4 rounded-md">
                                        <div>
                                            <p className="text-gray-300">Album ID: {album.album_id}</p>
                                            <p className="text-gray-300">Artist ID: {album.artist_id}</p>
                                            {album.is_deleted && <p className="text-red-500">This album is soft deleted</p>}
                                            <p className="text-xl text-white">Album title: {album.album_title}</p>
                                            <img src={album.cover_image} alt='' className="w-48 h-48 mt-2 rounded-md" />
                                            <p className="text-gray-300">Record type: {album.record_type}</p>
                                            <p className="text-gray-300">Release Date: {album.release_date}</p>
                                            <p className="text-gray-300">{album.album_info}</p>
                                            <p className="text-gray-300 mt-2">
                                                <button onClick={() => handleEditAlbum(album.album_id)}
                                                    className="bg-gray-900 hover:bg-gray-500 px-4 py-2 rounded-md text-white focus:outline-none">
                                                    Edit Album
                                                </button>
                                            </p>
                                            <p className="text-gray-300 mt-2">
                                                <button onClick={() => handleGetTracks(album.album_title)}
                                                    className="bg-gray-900 hover:bg-gray-500 px-4 py-2 rounded-md text-white focus:outline-none">
                                                    Get Album Tracks
                                                </button>
                                            </p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {display.addTrack && (
                        <div className="bg-gray-800 p-4 rounded-md mb-4">
                            <form onSubmit={addTrack} className="space-y-4">
                                <div>
                                    <label htmlFor="track_title" className="block text-gray-300 mb-1">Track Title</label>
                                    <input type="text" id="track_title" placeholder='track_title not null'
                                        value={track_title}
                                        onChange={(e) => setTrack_title(e.target.value)}
                                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="album_id" className="block text-gray-300 mb-1">Album ID</label>
                                    <input type="text" id="album_id" placeholder='album_id not null'
                                        value={album_id}
                                        onChange={(e) => setAlbum_id(e.target.value)}
                                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="duration" className="block text-gray-300 mb-1">Duration</label>
                                    <input type="text" id="duration" placeholder='duration not null'
                                        value={duration}
                                        onChange={(e) => setDuration(e.target.value)}
                                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="track_number" className="block text-gray-300 mb-1">Track Number</label>
                                    <input type="text" id="track_number" placeholder='track_number not null'
                                        value={track_number}
                                        onChange={(e) => setTrack_number(e.target.value)}
                                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring focus:border-blue-500"
                                    />
                                </div>
                                <button type="submit" className="bg-gray-900 hover:bg-gray-500 px-4 py-2 rounded-md text-white focus:outline-none">
                                    Add Track
                                </button>
                            </form>
                        </div>
                    )}
                    {display.getTrack && (
                        <div className="bg-gray-800 p-4 rounded-md mb-4">
                            <form onSubmit={getTrackByTrackTitle} className="space-y-4">
                                <div>
                                    <label htmlFor="track_title" className="block text-gray-300 mb-1">Track Title</label>
                                    <input type="text" id="track_title" placeholder='Track Title'
                                        value={track_title} onChange={(e) => setTrack_title(e.target.value)}
                                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring focus:border-blue-500"
                                    />
                                </div>
                                <button type="submit" className="bg-gray-900 hover:bg-gray-500 px-4 py-2 rounded-md text-white focus:outline-none">
                                    Get Track
                                </button>
                            </form>
                            <div className="mt-4 space-y-4">
                                {allTracks.map((track) => (
                                    <div key={track.track_id} className="bg-gray-700 p-4 rounded-md">
                                        <h3 className="text-xl text-white">{track.track_title}</h3>
                                        <img src={track.cover_image} alt='' className="w-48 h-48 mt-2 rounded-md" />
                                        <p className="text-gray-300">Artist: {track.artist_name}</p>
                                        <p className="text-gray-300">Track ID: {track.track_id}</p>
                                        <p className="text-gray-300">Album ID: {track.album_id}</p>
                                        <p className="text-gray-300">Duration: {formatDuration(track.duration)}</p>
                                        <p className="text-gray-300">Track number: {track.track_number}</p>
                                        <p className="text-gray-300">Album: {track.album_title}</p>
                                        <button onClick={() => handleEditTrack(track.track_id)}
                                            className="bg-gray-900 hover:bg-gray-500 px-4 py-2 rounded-md text-white focus:outline-none mt-2">
                                            Edit Track
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {display.editTrack && (
                        <div className="bg-gray-800 p-4 rounded-md mb-4">
                            <form onSubmit={getTrackById} className="space-y-4">
                                <div>
                                    <label htmlFor="track_id" className="block text-gray-300 mb-1">Track ID</label>
                                    <input type="number" id="track_id" placeholder='Track ID'
                                        value={track_id} onChange={(e) => setTrack_id(e.target.value)}
                                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring focus:border-blue-500"
                                    />
                                </div>
                                <button type="submit" className="bg-gray-900 hover:bg-gray-500 px-4 py-2 rounded-md text-white focus:outline-none">
                                    Get Track
                                </button>
                            </form>
                            {displayEditTrackForm && (
                                <div className="mt-4 space-y-4">
                                    <form onSubmit={updateTrack} className="space-y-4">
                                        <div>
                                            <label htmlFor="track_title" className="block text-gray-300 mb-1">Track Title</label>
                                            <input type="text" id="track_title" value={track_title} onChange={(e) => setTrack_title(e.target.value)}
                                                className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring focus:border-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="duration" className="block text-gray-300 mb-1">Duration</label>
                                            <input type="text" id="duration" value={duration} onChange={(e) => setDuration(e.target.value)}
                                                className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring focus:border-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="track_number" className="block text-gray-300 mb-1">Track Number</label>
                                            <input type="text" id="track_number" value={track_number} onChange={(e) => setTrack_number(e.target.value)}
                                                className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring focus:border-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="album_id" className="block text-gray-300 mb-1">Album ID</label>
                                            <input type="text" id="album_id" value={album_id} onChange={(e) => setAlbum_id(e.target.value)}
                                                className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring focus:border-blue-500"
                                            />
                                        </div>
                                        {isTrackSoftDeleted ? (
                                            <p className="text-red-500">This track is soft deleted</p>
                                        ) : (
                                            <p></p>
                                        )}
                                        <div>
                                            <p className="text-gray-300">Artist: {artist_name}</p>
                                            <p className="text-gray-300">Album: {album_title}</p>
                                            <img src={cover_image} alt='' className="w-48 h-48 mt-2 rounded-md" />
                                        </div>
                                        <button type="submit" className="bg-gray-900 hover:bg-gray-500 px-4 py-2 rounded-md text-white focus:outline-none">
                                            Update Track
                                        </button>
                                    </form>
                                    <div className="mt-4">
                                        {isTrackSoftDeleted ? (
                                            <button type="button" onClick={restoreTrack} className="bg-gray-500 hover:bg-gray-400 px-4 py-2 rounded-md text-white focus:outline-none">
                                                Restore All Track Data
                                            </button>
                                        ) : (
                                            <button type="button" onClick={softDeleteTrack} className="bg-gray-900 hover:bg-gray-700 px-4 py-2 rounded-md text-white focus:outline-none">
                                                Soft Delete All Track Data
                                            </button>
                                        )}
                                        <button type="button" onClick={deleteTrack} className="bg-red-700 hover:bg-red-800 px-4 py-2 rounded-md text-white focus:outline-none ml-2">
                                            Delete All Track Data From Database
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    {display.allTracksFromAlbum && (
                        <div className="bg-gray-800 p-4 rounded-md mb-4">
                            <form onSubmit={getAllTracksByAlbum} className="space-y-4">
                                <div>
                                    <label htmlFor="album_title" className="block text-gray-300 mb-1">Album Title</label>
                                    <input type="text" id="album_id" placeholder='Album Title'
                                        value={album_title} onChange={(e) => setAlbum_title(e.target.value)}
                                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring focus:border-blue-500"
                                    />
                                </div>
                                <button type="submit" className="bg-gray-900 hover:bg-gray-500 px-4 py-2 rounded-md text-white focus:outline-none">
                                    Get Tracks
                                </button>
                            </form>
                            {allTracksFromAlbum.length > 0 && (
                                <div className="mt-4 bg-gray-700 p-4 rounded-md">
                                    <div className="mb-4">
                                        <p className="text-gray-300">Artist name: {allTracksFromAlbum[0].artist_name}</p>
                                        <img src={allTracksFromAlbum[0].artist_image} alt='' className="w-12 h-12 mt-2 rounded-md" />
                                        <p className="text-gray-300">Album title: {allTracksFromAlbum[0].album_title}</p>
                                        <img src={allTracksFromAlbum[0].cover_image} alt='' className="w-12 h-12 mt-2 rounded-md" />
                                    </div>
                                    <ul className="space-y-4">
                                        {allTracksFromAlbum.map((track) => (
                                            <li key={track.track_id} className="bg-gray-800 p-4 rounded-md">
                                                <div>
                                                    <p className="text-gray-300">Track ID: {track.track_id}</p>
                                                    {track.is_deleted && <p className="text-red-500">This track is soft deleted</p>}
                                                    <p className="text-gray-300">Track title: {track.track_title}</p>
                                                    <p className="text-gray-300">Duration: {formatDuration(track.duration)}</p>
                                                    <p className="text-gray-300">Track number: {track.track_number}</p>
                                                    <button onClick={() => handleEditTrack(track.track_id)}
                                                        className="bg-gray-900 hover:bg-gray-500 px-4 py-2 rounded-md text-white focus:outline-none mt-2">
                                                        Edit Track
                                                    </button>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}
                    {display.allTracksFromArtist && (
                        <div className="bg-gray-800 p-4 rounded-md mb-4">
                            <form onSubmit={getAllTracksByArtist} className="space-y-4">
                                <div>
                                    <label htmlFor="artist_name" className="block text-gray-300 mb-1">Artist Name</label>
                                    <input type="text" id="artist_name" placeholder='Artist Name'
                                        value={artist_name} onChange={(e) => setArtist_name(e.target.value)}
                                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring focus:border-blue-500"
                                    />
                                </div>
                                <button type="submit" className="bg-gray-900 hover:bg-gray-500 px-4 py-2 rounded-md text-white focus:outline-none">
                                    Get Tracks
                                </button>
                            </form>
                            <div className="mt-4 space-y-4">
                                {allTracksFromArtist[0] && (
                                    <div className="bg-gray-700 p-4 rounded-md mb-4">
                                        <p className="text-gray-300">Artist name: {allTracksFromArtist[0].artist_name}</p>
                                        <img src={allTracksFromArtist[0].artist_image} alt='' className="w-12 h-12 rounded-md mt-2" />
                                    </div>
                                )}
                                <ul className="space-y-4">
                                    {allTracksFromArtist.map((track) => (
                                        <li key={track.track_id} className="bg-gray-700 p-4 rounded-md">
                                            <div>
                                                <p className="text-gray-300">Track ID: {track.track_id}</p>
                                                <p className="text-gray-300">Album ID: {track.album_id}</p>
                                                {track.is_deleted && <p className="text-red-500">This track is soft deleted</p>}
                                                <p className="text-xl text-white">Track title: {track.track_title}</p>
                                                <p className="text-gray-300">Duration: {formatDuration(track.duration)}</p>
                                                <p className="text-gray-300">Track number: {track.track_number}</p>
                                                <button onClick={() => handleEditTrack(track.track_id)}
                                                    className="bg-gray-900 hover:bg-gray-500 px-4 py-2 rounded-md text-white focus:outline-none mt-2">
                                                    Edit Track
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}
                    {displayAllUsers && (
                        <div className="bg-gray-800 p-4 rounded-md mb-4">
                            <ul className="space-y-4">
                                {allUsers.map((user) => (
                                    <li key={user.user_id} className="bg-gray-700 p-4 rounded-md">
                                        <div>
                                            <p className="text-gray-300">User ID: {user.user_id}</p>
                                            <p className="text-xl text-white">Username: {user.username}</p>
                                            <img src={`http://localhost:5000${user.profile_picture}`} alt='' className="w-12 h-12 rounded-md mt-2" />
                                            <p className="text-gray-300">Email: {user.email}</p>
                                            <p className="text-gray-300">Role: {user.user_type}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {display.user && (
                        <div className="bg-gray-800 p-4 rounded-md mb-4">
                            <form onSubmit={getUserByUsername} className="space-y-4">
                                <div>
                                    <label htmlFor="username" className="block text-gray-300 mb-1">Username</label>
                                    <input type="text" id="username" placeholder='Username'
                                        value={username} onChange={(e) => setUsername(e.target.value)}
                                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring focus:border-blue-500"
                                    />
                                </div>
                                <button type="submit" className="bg-gray-900 hover:bg-gray-500 px-4 py-2 rounded-md text-white focus:outline-none">
                                    Get User
                                </button>
                            </form>
                            {displayEditUserForm && (
                                <div className="mt-4 space-y-4">
                                    <form onSubmit={updateUser} className="space-y-4">
                                        <div className="bg-gray-700 p-4 rounded-md">
                                            <p className="text-gray-300">User ID: {userId}</p>
                                        </div>
                                        <div className="bg-gray-700 p-4 rounded-md flex items-center justify-between">
                                            <img src={`http://localhost:5000${profile_picture}`} alt='' className="w-12 h-12 rounded-md" />
                                            <p className="text-gray-300">
                                                <button type="button" onClick={removeProfilePicture} className="text-red-500 focus:outline-none">
                                                    Remove profile picture
                                                </button>
                                            </p>
                                        </div>
                                        <div className="bg-gray-700 p-4 rounded-md">
                                            <input type="text" value={editUsername} onChange={(e) => setEditUsername(e.target.value)}
                                                className="w-full px-3 py-2 bg-gray-600 text-white rounded-md focus:outline-none focus:ring focus:border-blue-500"
                                                placeholder="Username"
                                            />
                                        </div>
                                        <div className="bg-gray-700 p-4 rounded-md">
                                            <input type="text" value={email} onChange={(e) => setEmail(e.target.value)}
                                                className="w-full px-3 py-2 bg-gray-600 text-white rounded-md focus:outline-none focus:ring focus:border-blue-500"
                                                placeholder="Email"
                                            />
                                        </div>
                                        <div className="bg-gray-700 p-4 rounded-md">
                                            <input type="text" value={user_role} onChange={(e) => setUser_role(e.target.value)}
                                                className="w-full px-3 py-2 bg-gray-600 text-white rounded-md focus:outline-none focus:ring focus:border-blue-500"
                                                placeholder="User role (normal/moderator/administrator)"
                                            />
                                        </div>
                                        <button type="submit" className="bg-gray-900 hover:bg-gray-500 px-4 py-2 rounded-md text-white focus:outline-none">
                                            Update User
                                        </button>
                                    </form>
                                    <div className="bg-gray-700 p-4 rounded-md">
                                        <button type="button" onClick={deleteUser} className="bg-red-700 hover:bg-red-800 px-4 py-2 rounded-md text-white focus:outline-none">
                                            Delete User
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    {display.getUserPassword && (
                        <div className="bg-gray-800 p-4 rounded-md mb-4">
                            <form onSubmit={getUserByUsername} className="space-y-4">
                                <div>
                                    <label htmlFor="username" className="block text-gray-300 mb-1">Username</label>
                                    <input type="text" id="username" placeholder='Username'
                                        value={username} onChange={(e) => setUsername(e.target.value)}
                                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring focus:border-blue-500"
                                    />
                                </div>
                                <button type="submit" className="bg-gray-900 hover:bg-gray-500 px-4 py-2 rounded-md text-white focus:outline-none">
                                    Get User
                                </button>
                            </form>
                            {displayEditUserPasswordForm && (
                                <div className="mt-4 space-y-4">
                                    <div className="bg-gray-700 p-4 rounded-md">
                                        <p className="text-gray-300">User ID: {userId}</p>
                                        <img src={`http://localhost:5000${profile_picture}`} alt='' className="w-12 h-12 rounded-md" />
                                        <p className="text-gray-300">Username: {username}</p>
                                        <p className="text-gray-300">Email: {email}</p>
                                    </div>
                                    <form onSubmit={changeUserPassword} className="space-y-4">
                                        <div className="bg-gray-700 p-4 rounded-md">
                                            <input type="text" value={password} onChange={(e) => setPassword(e.target.value)}
                                                className="w-full px-3 py-2 bg-gray-600 text-white rounded-md focus:outline-none focus:ring focus:border-blue-500"
                                                placeholder="New Password"
                                            />
                                        </div>
                                        <button type="submit" className="bg-gray-900 hover:bg-gray-500 px-4 py-2 rounded-md text-white focus:outline-none">
                                            Change Password
                                        </button>
                                    </form>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
};

export default Admin;