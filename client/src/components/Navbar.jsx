import React, { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaTicketAlt, FaBars, FaTimes, FaUserShield, FaUserCheck, FaSignOutAlt } from 'react-icons/fa';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        logout();
        setIsOpen(false);
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="bg-gradient-to-r from-jade-950 via-jade-900 to-jade-950 sticky top-0 z-40 shadow-xl shadow-jade-950/20 border-b border-jade-800/60">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Brand Logo */}
                    <Link to="/" className="text-white text-2xl font-black font-display flex items-center gap-2.5 tracking-tight group">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-jade-500 to-emerald-400 flex items-center justify-center text-jade-950 shadow-md shadow-jade-500/30 group-hover:scale-105 transition">
                            <FaTicketAlt className="text-xl" />
                        </div>
                        <span>Event<span className="text-jade-400">ora</span></span>
                    </Link>

                    {/* Desktop Navigation Links */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link
                            to="/"
                            className={`text-sm font-bold transition-all ${isActive('/') ? 'text-jade-400 border-b-2 border-jade-400 pb-1' : 'text-jade-100/90 hover:text-white'}`}
                        >
                            Explore Events
                        </Link>

                        {user ? (
                            <div className="flex items-center gap-4">
                                <Link
                                    to={user.role === 'admin' ? '/admin' : '/dashboard'}
                                    className={`flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-xl transition border ${
                                        isActive('/admin') || isActive('/dashboard')
                                            ? 'bg-jade-500/20 text-jade-300 border-jade-500/50'
                                            : 'bg-jade-900/60 text-jade-100 hover:bg-jade-800 border-jade-700/50'
                                    }`}
                                >
                                    {user.role === 'admin' ? <FaUserShield className="text-emerald-400" /> : <FaUserCheck className="text-jade-400" />}
                                    <span>{user.role === 'admin' ? 'Admin Panel' : 'My Bookings'}</span>
                                </Link>

                                {/* User Avatar Badge */}
                                <div className="flex items-center gap-2 pl-2 border-l border-jade-800/80">
                                    <div className="w-9 h-9 rounded-full bg-jade-700 text-white flex items-center justify-center font-bold text-sm shadow-inner uppercase">
                                        {user.name.charAt(0)}
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        title="Log Out"
                                        className="p-2 text-jade-300 hover:text-white hover:bg-jade-800/60 rounded-xl transition"
                                    >
                                        <FaSignOutAlt className="text-lg" />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link
                                    to="/login"
                                    className="text-sm font-bold text-jade-100 hover:text-white transition px-3 py-2"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-gradient-to-r from-jade-400 to-emerald-400 text-jade-950 font-bold text-sm px-5 py-2.5 rounded-xl hover:from-jade-300 hover:to-emerald-300 transition shadow-md shadow-jade-400/20"
                                >
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Hamburger Button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2.5 rounded-xl text-jade-200 hover:text-white bg-jade-900/80 border border-jade-700/50 transition"
                        >
                            {isOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Drawer */}
            {isOpen && (
                <div className="md:hidden bg-jade-950/95 border-b border-jade-800 px-4 pt-3 pb-6 space-y-3 animate-fadeIn">
                    <Link
                        to="/"
                        onClick={() => setIsOpen(false)}
                        className="block px-4 py-3 rounded-xl font-bold text-jade-100 hover:bg-jade-900 transition"
                    >
                        Explore Events
                    </Link>

                    {user ? (
                        <>
                            <Link
                                to={user.role === 'admin' ? '/admin' : '/dashboard'}
                                onClick={() => setIsOpen(false)}
                                className="block px-4 py-3 rounded-xl font-bold text-jade-100 hover:bg-jade-900 transition"
                            >
                                {user.role === 'admin' ? 'Admin Dashboard' : 'My Dashboard'}
                            </Link>
                            <div className="pt-2 border-t border-jade-800 flex items-center justify-between px-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-jade-700 text-white flex items-center justify-center font-bold text-xs uppercase">
                                        {user.name.charAt(0)}
                                    </div>
                                    <span className="text-sm font-bold text-jade-100">{user.name}</span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="text-xs font-bold text-red-400 hover:text-red-300 bg-red-950/50 px-3 py-2 rounded-lg border border-red-800/40"
                                >
                                    Log Out
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="pt-2 border-t border-jade-800 space-y-2">
                            <Link
                                to="/login"
                                onClick={() => setIsOpen(false)}
                                className="block w-full text-center py-3 font-bold text-jade-100 bg-jade-900 rounded-xl"
                            >
                                Sign In
                            </Link>
                            <Link
                                to="/register"
                                onClick={() => setIsOpen(false)}
                                className="block w-full text-center py-3 font-bold text-jade-950 bg-jade-400 rounded-xl"
                            >
                                Create Account
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
