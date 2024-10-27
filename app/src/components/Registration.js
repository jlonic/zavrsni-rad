import { useState } from 'react';
import NavbarLoggedOut from './NavbarLoggedOut';

const Registration = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');


    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const user = {
            username,
            email,
            password
        };

        try {
            const response = await fetch('http://localhost:5000/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage('Registration successful!');
                setUsername('');
                setEmail('');
                setPassword('');
            } else {
                setMessage(data.message);
            }
        } catch (error) {
            console.error(error);
            setMessage('Registration failed');
        }
    }


    return (
        <div className="bg-gray-700 min-h-screen">
            <NavbarLoggedOut />
            <div className="flex justify-center items-center h-full">
                <form onSubmit={handleSubmit} className="max-w-md bg-gray-800 shadow-md rounded-lg px-8 py-6 text-white">
                    <div className="mb-4">
                        <label htmlFor="username" className="block">Username:</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={handleUsernameChange}
                            className="w-full px-3 py-2 bg-gray-700 text-gray-200 rounded-md focus:outline-none focus:ring ring-gray-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="email" className="block">Email:</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={handleEmailChange}
                            className="w-full px-3 py-2 bg-gray-700 text-gray-200 rounded-md focus:outline-none focus:ring ring-gray-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block">Password:</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={handlePasswordChange}
                            className="w-full px-3 py-2 bg-gray-700 text-gray-200 rounded-md focus:outline-none focus:ring ring-gray-500"
                        />
                    </div>
                    <div className="mb-4">
                        <button type="submit" className="w-full bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-400">Register</button>
                        {message && <p className="mt-2 text-red-500">{message}</p>}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Registration;