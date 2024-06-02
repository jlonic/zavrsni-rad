import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function ChangePassword() {
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate(); 

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

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
            setMessage('Password updated successfully!');
            setPassword('');
        } else {
            setMessage(`Failed to update password: ${data.message}`);
        }
        } catch (error) {
        console.error('Error:', error);
        setMessage('Failed to update password');
        }
    };

    useEffect(() => { //redirect to login if not logged in
        if (!localStorage.getItem('token')) {
            navigate('/login');
        }
    }, [navigate]); 


    return (
        <div>
            <h1>Change Password</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="password">New Password:</label>
                <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type="submit">Submit</button>
            </form>
            {<p>{message}</p>}
        </div>
    );
};

export default ChangePassword;