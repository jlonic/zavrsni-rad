// import Search from "./Search";
import { Link } from 'react-router-dom';

const NavbarLoggedOut = () => {
    return (
        <div className="pb-20">
            <nav className="flex justify-between items-center fixed w-full top-0 z-50 bg-gray-800 text-white shadow-md px-4 py-2">
                {/* <Search /> */}
                <div className="flex items-center">
                    <button className="ml-4">
                        <Link to="/login" className="text-white hover:text-gray-300">Login</Link>
                    </button>
                    <button className="ml-4">
                        <Link to="/registration" className="text-white hover:text-gray-300">Register</Link>
                    </button>
                </div>
            </nav>
        </div>
    );
};

export default NavbarLoggedOut;