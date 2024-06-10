import { useState } from 'react';

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
        <form onSubmit={handleSubmit}>
            <div>
                <label>Username or Email:</label>
                <input type="text" value={usernameOrEmail} onChange={handleUsernameOrEmailChange} />
            </div>
            <div>
                <label>Password:</label>
                <input type="password" value={password} onChange={handlePasswordChange} />
            </div>
            <div>
                <button type="submit">Login</button>
                {<p>{message}</p>}
            </div>
        </form>
    );
};

export default Login;