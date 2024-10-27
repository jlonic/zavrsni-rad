import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';
import Stats from './Stats';
import Navbar from './Navbar';
import Loading from '../svg/loading.gif';
import { ReactComponent as LeftArrow } from '../svg/arrow-left.svg';
import { ReactComponent as RightArrow } from '../svg/arrow-right.svg';

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');
  const [recents, setRecents] = useState([]);
  const [message, setMessage] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(recents.length / itemsPerPage);
  const current = recents.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getFollows = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:5000/follows/getFollows`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const userData = await response.json();
      if (response.ok) {
        recentlyReviewed(userData);
      } else {
        console.error('Failed to remove profile picture');
      }
    } catch (error) {
      console.error(error);
    }
  }, [token]);

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
    } 
    
    getFollows();
  }, [navigate, getFollows]);

  const recentlyReviewed = async (follows) => {
    const token = localStorage.getItem('token');
    let allReviews = [];
    try {
      for (let i = 0; i < follows.length; i++) {
        const response1 = await fetch(`http://localhost:5000/reviews/artist-reviews/${follows[i].username}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        const data1 = await response1.json();
        if (!response1.ok) {
          setMessage(data1.message);
        }

        const response2 = await fetch(`http://localhost:5000/reviews/album-reviews/${follows[i].username}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        const data2 = await response2.json();
        if (!response2.ok) {
          setMessage(data2.message);
        }

        const response3 = await fetch(`http://localhost:5000/reviews/track-reviews/${follows[i].username}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        const data3 = await response3.json();
        if (response3.ok) {
          setMessage(data3.message);
        }
        const combinedData = [...data1, ...data2, ...data3];
        allReviews = [...allReviews, ...combinedData];
      }
      allReviews.sort((a, b) => new Date(b.review_date) - new Date(a.review_date));
      setRecents(allReviews)

    } catch (error) {
      setMessage('Failed to fetch users recently reviewed');
    } finally {
      setLoading(false);
    }
  };

  const handleNextPage = (setPage, totalPages) => {
    setPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const handlePreviousPage = (setPage) => {
    setPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-700">
        <img src={Loading} alt="Loading..." style={{ width: '100px', height: '100px' }} />
      </div>
    );
  }

  return (
    <div className='bg-gray-700 min-h-screen'>
      <Navbar />
      <p>{message}</p>
      <Stats />
      <br /><br />
      {recents.length > 0 && (
        <div>
          <h2 className='text-white text-2xl	mb-6 ml-10'>Recent reviews by people you follow</h2>
          <div className='pl-6'>
            <button onClick={() => handlePreviousPage(setCurrentPage)} disabled={currentPage === 1} className={`${currentPage === 1 ? 'opacity-50' : 'opacity-100'}`}><LeftArrow className='w-8 h-8' /></button>
            <button onClick={() => handleNextPage(setCurrentPage, totalPages)} disabled={currentPage === totalPages} className={`${currentPage === totalPages ? 'opacity-50' : 'opacity-100'}`}><RightArrow className='w-8 h-8' /></button>
          </div>
          <ul className="flex overflow-x-auto scroll-snap-x-mandatory text-white">
            {current.map((recent, index) => (
              <li key={index} className="scroll-snap-align-start px-8">
                {recent.artist_id && (
                  <div>
                    <p className=''>
                      <a href={`http://localhost:3000/artists/${recent.artist_id}`}>
                        <img src={recent.artist_image} alt={recent.artist_name} style={{ width: '64px', height: '64px' }} />
                        {recent.artist_name.slice(0, 20)}
                        {recent.artist_name.length > 20 && '...'}
                      </a>
                    </p>
                  </div>
                )}
                {recent.album_id && (
                  <div>
                    <p>
                      <a href={`http://localhost:3000/albums/${recent.album_id}`}>
                        <img src={recent.cover_image} alt={recent.album_title} style={{ width: '64px', height: '64px' }} />
                        {recent.album_title.slice(0, 15)}
                        {recent.album_title.length > 15 && '...'}
                      </a>
                    </p>
                  </div>
                )}
                {recent.track_id && (
                  <div>
                    <p>
                      <a href={`http://localhost:3000/tracks/${recent.track_id}`}>
                        <img src={recent.cover_image} alt={recent.track_title} style={{ width: '64px', height: '64px' }} />
                        {recent.track_title.slice(0, 15)}
                        {recent.track_title.length > 15 && '...'}
                      </a>
                    </p>
                  </div>
                )}
                <p>{new Date(recent.review_date).toLocaleDateString("en-gb")}</p>
                <p>
                  {recent.review_text.slice(0, 15)}
                  {recent.review_text.length > 15 && '...'}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}

    </div>
  );
};

export default Dashboard;