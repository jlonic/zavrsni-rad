import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const ChangePassword = () => {
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        if (password !== password2) {
            return setMessage("Passwords don't match!");
        }

        try {
            const response = await fetch(`http://localhost:5000/users/updatePassword/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer: ${token}`
                },
                body: JSON.stringify({ password: password }),
            });
            const data = await response.json();

            if (response.ok) {
                setMessage('Password updated successfully! Redirecting to login...');
                setPassword('');

                setTimeout(() => {
                    localStorage.removeItem('token');
                    navigate('/login');
                }, 1000); //1 second
            } else {
                setMessage(data.message);
            }
        } catch (error) {
            console.error(error);
            setMessage('Failed to update password');
        }
    };

    useEffect(() => { //redirect to login if not logged in
        if (!localStorage.getItem('token')) {
            navigate('/login');
        }
    }, [navigate]);


    return (
        <div className="bg-gray-700 min-h-screen">
            <Navbar />
            <div className="text-gray-200 pt-4 px-4">
                <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                    <div className="mb-4">
                        <label htmlFor="password" className="block">New Password:</label>
                        <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-2 bg-gray-800 text-gray-200 rounded-md focus:outline-none focus:ring" />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password2" className="block">Confirm Password:</label>
                        <input type="password" id="password2" value={password2} onChange={(e) => setPassword2(e.target.value)} className="w-full px-3 py-2 bg-gray-800 text-gray-200 rounded-md focus:outline-none focus:ring" />
                    </div>
                    <button type="submit" className="bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800">Submit</button>
                </form>
                {message && <p className="mt-4">{message}</p>}
            </div>
        </div>

    );
};

export default ChangePassword;