const Logout = () => {
    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    };

    return (
        <button onClick={handleLogout} className="block px-4 py-2 text-white hover:bg-gray-700">Logout</button>
    );
};

export default Logout;