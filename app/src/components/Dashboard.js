import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Search from './Search';
import Logout from './Logout';
import Notifications from './Notifications';

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => { //redirect to login if not logged in
    if (!localStorage.getItem('token')) {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div>
      <h1>Dashboard</h1>
      <button>
        <Link to="/change-password">Change Password</Link>
      </button>
      <button>
        <Link to="/charts">Charts</Link>
      </button>

      <Logout />
      <Notifications />
      <Search />
    </div>
  );
};

export default Dashboard;