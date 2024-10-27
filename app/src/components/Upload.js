import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


const Upload = () => {
    // eslint-disable-next-line
    const [file, setFile] = useState(null);
    // eslint-disable-next-line
    const [filePath, setFilePath] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => { //redirect to login if not logged in
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        }
    }, [navigate]);

    const handleUpload = async (file) => {
        const token = localStorage.getItem('token');
        if (!file) {
            setMessage('No file selected.');
            return;
        }

        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await fetch('http://localhost:5000/upload', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            if (response.ok) {
                setFilePath(data.filePath);
                const updateUser = await fetch('http://localhost:5000/users/uploadProfilePicture', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    }, body: JSON.stringify({ profile_picture: data.filePath }),
                })
                const updatedUser = await updateUser.json();

                if (updatedUser) {
                    setMessage('Upload successful.');
                } else {
                    setMessage('Error updating user profile picture.');
                }
            } else {
                setMessage('Upload failed.');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleSetFile = async (e) => {
        const selectedFile = e.target.files[0];

        if (!selectedFile) {
            setMessage('No file selected.');
            return;
        }

        setFile(selectedFile);
        await handleUpload(selectedFile);
    };

    return (
        <div>
            <div className="mt-4 flex">
                {message && <p className='text-gray-200'>{message}</p>}
                <label htmlFor="upload-input" className="bg-gray-600 text-gray-200 px-4 py-4  rounded-md cursor-pointer hover:bg-gray-600">
                    Change Profile Picture
                </label>
                <input id="upload-input" type="file" onChange={handleSetFile} className="hidden" />
            </div>
        </div>
    );
};

export default Upload;
