import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaTicketAlt } from 'react-icons/fa';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-gradient-to-r from-jade-950 via-jade-900 to-jade-950 shadow-lg shadow-jade-950/25">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center py-4 gap-4">
                    <Link to="/" className="text-white text-2xl font-bold flex items-center gap-2">
                        <FaTicketAlt className="text-jade-400" /> Eventora
                    </Link>
                    <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
                        <Link to="/" className="text-jade-100 hover:text-white transition cursor-pointer">Events</Link>
                        {user ? (
                            <>
                                <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} className="text-jade-100 hover:text-white transition">Dashboard</Link>
                                <button onClick={handleLogout} className="bg-jade-800 hover:bg-jade-950 text-white px-4 py-2 rounded-md transition border border-jade-600/40">Logout</button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-jade-100 hover:text-white transition">Login</Link>
                                <Link to="/register" className="bg-jade-400 text-jade-950 hover:bg-jade-300 px-4 py-2 rounded-md font-semibold transition shadow-sm">Sign Up</Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
