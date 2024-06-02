import { useState } from 'react';

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
            setMessage('Registration successful!'); //TODO: redirect to login page?
            //clears the form after submitting
            setUsername('');
            setEmail('');
            setPassword('');
        } else {
            setMessage(`Registration failed: ${data.message}`);
        }
    } catch (error) {
        console.error('Error:', error);
        setMessage('Registration failed'); //TODO: error za username in use, email in use, passwords don't match/too short
    }
}


return (
    <form onSubmit={handleSubmit}>
        <div>
            <label>Username:</label>
            <input type="text" value={username} onChange={handleUsernameChange} />
        </div>
        <div>
            <label>Email:</label>
            <input type="email" value={email} onChange={handleEmailChange} />
        </div>
        <div>
            <label>Password:</label>
            <input type="password" value={password} onChange={handlePasswordChange} />
        </div>
        <div>
            <button type="submit">Register</button>
            {<p>{message}</p>}
        </div> 
    </form>

    );
};

export default Registration;