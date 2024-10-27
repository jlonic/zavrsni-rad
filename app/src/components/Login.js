import { useState } from 'react';
import NavbarLoggedOut from './NavbarLoggedOut';
const Login = () => {
    const [usernameOrEmail, setUsernameOrEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleUsernameOrEmailChange = (e) => {
        setUsernameOrEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const user = {
            usernameOrEmail,
            password
        };

        try {
            const response = await fetch('http://localhost:5000/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                window.location.href = '/dashboard'; //redirect after login (change to /dashboard)
            } else {
                setMessage(data.message);
            }
        } catch (error) {
            console.error(error);
            setMessage('Login failed');
        };
    };

    return (
        <div className="bg-gray-700 min-h-screen">
            <NavbarLoggedOut />
            <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-8 bg-gray-800 p-6 rounded-lg shadow-lg">
                <div className="mb-4">
                    <label htmlFor="usernameOrEmail" className="block text-gray-200">Username or Email:</label>
                    <input
                        type="text"
                        id="usernameOrEmail"
                        value={usernameOrEmail}
                        onChange={handleUsernameOrEmailChange}
                        className="w-full px-3 py-2 bg-gray-700 text-gray-200 rounded-md focus:outline-none focus:ring ring-gray-500"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="password" className="block text-gray-200">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={handlePasswordChange}
                        className="w-full px-3 py-2 bg-gray-700 text-gray-200 rounded-md focus:outline-none focus:ring ring-gray-500"
                    />
                </div>
                <div className="mb-4">
                    <button type="submit" className="w-full bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-500">Login</button>
                    {message && <p className="mt-2 text-red-500">{message}</p>}
                </div>
            </form>
        </div>

    );
};

export default Login;