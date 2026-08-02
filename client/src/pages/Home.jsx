import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/axios';
import AIRecommenderModal from '../components/AIRecommenderModal';
import { FaCalendarAlt, FaMapMarkerAlt, FaSearch, FaRegClock, FaTicketAlt, FaShieldAlt, FaFilter, FaArrowRight, FaRobot, FaLocationArrow, FaStar } from 'react-icons/fa';

const CATEGORIES = ['All', 'Technology', 'Music', 'Business', 'Art'];

// Helper distance calculation (Haversine)
function getDistanceKm(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) * 10) / 10;
}

const Home = () => {
    const [events, setEvents] = useState([]);
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [priceFilter, setPriceFilter] = useState('all');
    const [loading, setLoading] = useState(true);

    // AI & Geolocation state
    const [showAiModal, setShowAiModal] = useState(false);
    const [nearMeActive, setNearMeActive] = useState(false);
    const [userCoords, setUserCoords] = useState(null);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchEvents();
        }, 300);
        return () => clearTimeout(timeoutId);
    }, [search, selectedCategory]);

    const fetchEvents = async () => {
        setLoading(true);
        try {
            let url = `/events?search=${encodeURIComponent(search)}`;
            if (selectedCategory !== 'All') {
                url += `&category=${encodeURIComponent(selectedCategory)}`;
            }
            const { data } = await api.get(url);
            setEvents(data);
        } catch (error) {
            console.error('Error fetching events:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleNearMe = () => {
        if (nearMeActive) {
            setNearMeActive(false);
            return;
        }
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser.');
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
                setNearMeActive(true);
            },
            (err) => {
                alert('Location permission denied or unavailable');
            }
        );
    };

    // Client side price filtering for instant feel
    const filteredEvents = events.filter(event => {
        if (priceFilter === 'free') return event.ticketPrice === 0;
        if (priceFilter === 'paid') return event.ticketPrice > 0;
        return true;
    });

    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <div className="relative bg-jade-950 text-white rounded-3xl overflow-hidden mb-12 shadow-2xl shadow-jade-950/30 ring-1 ring-jade-800/50">
                <div className="absolute inset-0 opacity-30 bg-[url('https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=3000&auto=format&fit=crop')] bg-cover bg-center"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-jade-950 via-jade-950/85 to-jade-900/40"></div>
                
                <div className="relative p-8 sm:p-12 md:p-20 text-center flex flex-col items-center z-10">
                    <span className="bg-jade-500/20 text-jade-300 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-6 border border-jade-400/30 shadow-sm">
                        ⚡ Modern Full-Stack Event Booking
                    </span>
                    
                    <h1 className="text-4xl sm:text-5xl md:text-7xl font-black font-display mb-6 leading-tight tracking-tight drop-shadow-md">
                        Discover & Book <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-jade-200 via-jade-400 to-emerald-300">
                            Extraordinary Events
                        </span>
                    </h1>
                    
                    <p className="text-jade-100/90 text-base sm:text-lg md:text-xl mb-10 max-w-2xl mx-auto font-light leading-relaxed">
                        Explore tech retreats, music festivals, and high-impact business summits. Reserve your ticket with instant OTP verification.
                    </p>

                    {/* Search Bar */}
                    <div className="w-full max-w-2xl mx-auto relative flex items-center shadow-2xl group">
                        <FaSearch className="absolute left-6 text-jade-500 text-xl group-focus-within:text-jade-700 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search events by title or keywords..."
                            className="w-full pl-16 pr-6 py-5 rounded-full text-base sm:text-lg text-jade-950 bg-white/95 backdrop-blur-sm border-2 border-transparent focus:border-jade-500 focus:outline-none focus:ring-4 focus:ring-jade-400/30 transition-all placeholder-gray-400 font-medium"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Category Pills & Filters Bar */}
            <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-jade-100 mb-10 flex flex-col md:flex-row items-center justify-between gap-4">
                {/* Category Pills */}
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 w-full md:w-auto">
                    <span className="text-xs font-bold uppercase text-gray-400 mr-2 flex items-center gap-1">
                        <FaFilter className="text-jade-600" /> Category:
                    </span>
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                                selectedCategory === cat
                                    ? 'bg-jade-900 text-white shadow-md shadow-jade-900/20'
                                    : 'bg-jade-50/80 text-jade-800 hover:bg-jade-100 border border-jade-100'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Price & GPS Toggles */}
                <div className="flex flex-wrap items-center gap-2">
                    <button
                        onClick={handleToggleNearMe}
                        className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ${
                            nearMeActive
                                ? 'bg-blue-600 text-white border-blue-500 shadow-md'
                                : 'bg-jade-50 text-jade-900 border-jade-200 hover:bg-jade-100'
                        }`}
                    >
                        <FaLocationArrow className={nearMeActive ? 'animate-pulse' : ''} />
                        <span>{nearMeActive ? '📍 GPS Active (Near Me)' : '📍 Events Near Me'}</span>
                    </button>

                    <div className="flex items-center gap-2 bg-jade-50 p-1.5 rounded-xl border border-jade-100">
                        <button
                            onClick={() => setPriceFilter('all')}
                            className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                                priceFilter === 'all' ? 'bg-white text-jade-950 shadow-sm' : 'text-gray-500 hover:text-jade-900'
                            }`}
                        >
                            All Passes
                        </button>
                        <button
                            onClick={() => setPriceFilter('free')}
                            className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                                priceFilter === 'free' ? 'bg-jade-600 text-white shadow-sm' : 'text-gray-500 hover:text-jade-900'
                            }`}
                        >
                            Free Only
                        </button>
                        <button
                            onClick={() => setPriceFilter('paid')}
                            className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                                priceFilter === 'paid' ? 'bg-jade-900 text-white shadow-sm' : 'text-gray-500 hover:text-jade-900'
                            }`}
                        >
                            Paid Events
                        </button>
                    </div>
                </div>
            </div>

            {/* Header row */}
            <div className="flex items-center justify-between mb-8 px-2 border-b border-jade-200/80 pb-4">
                <h2 className="text-2xl sm:text-3xl font-black font-display text-jade-950">
                    Upcoming Events
                </h2>
                <div className="text-gray-500 text-sm font-semibold">
                    Showing {filteredEvents.length} events
                </div>
            </div>

            {/* Events Grid or Skeleton Loading */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3, 4, 5, 6].map(n => (
                        <div key={n} className="bg-white rounded-2xl h-96 animate-pulse p-4 border border-jade-100 flex flex-col justify-between">
                            <div className="bg-gray-200 h-44 rounded-xl mb-4"></div>
                            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                            <div className="h-10 bg-gray-200 rounded-xl"></div>
                        </div>
                    ))}
                </div>
            ) : filteredEvents.length === 0 ? (
                <div className="bg-white rounded-2xl p-16 text-center border border-jade-100 shadow-sm">
                    <FaTicketAlt className="text-5xl text-jade-200 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-800 mb-2">No Events Found</h3>
                    <p className="text-gray-500 text-sm max-w-md mx-auto">
                        No active events match your search query or selected category filter. Try clearing filters or searching for something else.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                    {filteredEvents.map(event => (
                        <div
                            key={event._id}
                            className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-jade-200/40 ring-1 ring-jade-100 hover:ring-jade-300 transition duration-300 flex flex-col group"
                        >
                            <div className="h-48 bg-gray-100 overflow-hidden relative">
                                {event.image ? (
                                    <img
                                        src={event.image}
                                        alt={event.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-jade-900 to-jade-950 text-jade-200 font-black text-2xl uppercase">
                                        {event.category || 'Event'}
                                    </div>
                                )}
                                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-black shadow-md border border-jade-100">
                                    {event.ticketPrice === 0 ? (
                                        <span className="text-jade-600 uppercase tracking-wider font-extrabold">FREE</span>
                                    ) : (
                                        <span className="text-jade-950 font-extrabold">₹{event.ticketPrice}</span>
                                    )}
                                </div>
                                <div className="absolute top-4 left-4 bg-jade-950/80 text-white backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest border border-jade-700/50">
                                    {event.category}
                                </div>
                            </div>

                            <div className="p-6 flex-grow flex flex-col">
                                <h3 className="text-xl font-bold text-jade-950 mb-3 group-hover:text-jade-600 transition line-clamp-1">
                                    {event.title}
                                </h3>

                                <div className="flex flex-col gap-2 mb-6 text-gray-500 text-xs font-medium">
                                    <div className="flex items-center gap-2">
                                        <FaCalendarAlt className="text-jade-600" />
                                        <span>{new Date(event.date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FaMapMarkerAlt className="text-jade-600" />
                                        <span className="line-clamp-1">{event.location}</span>
                                    </div>
                                </div>

                                <div className="mt-auto">
                                    {/* Seat progress bar */}
                                    <div className="w-full bg-jade-50 rounded-full h-2 mb-2 border border-jade-100 overflow-hidden">
                                        <div
                                            className="bg-gradient-to-r from-jade-500 to-emerald-600 h-2 rounded-full transition-all duration-500"
                                            style={{ width: `${Math.max(0, Math.min(100, (event.availableSeats / event.totalSeats) * 100))}%` }}
                                        ></div>
                                    </div>
                                    <div className="flex justify-between items-center text-[11px] font-bold text-gray-500 mb-4">
                                        <span>Capacity</span>
                                        <span className={event.availableSeats <= 5 ? 'text-red-500' : 'text-jade-800'}>
                                            {event.availableSeats} / {event.totalSeats} seats left
                                        </span>
                                    </div>

                                    <Link
                                        to={`/events/${event._id}`}
                                        className="w-full flex items-center justify-center gap-2 bg-jade-50 hover:bg-jade-900 text-jade-950 hover:text-white font-bold py-3 rounded-xl border border-jade-200/80 hover:border-jade-900 transition duration-200 text-sm shadow-sm"
                                    >
                                        <span>View Details</span>
                                        <FaArrowRight className="text-xs" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 px-2">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-jade-100 flex flex-col items-center text-center hover:-translate-y-1 hover:border-jade-300 transition duration-300">
                    <div className="w-14 h-14 bg-gradient-to-br from-jade-500 to-jade-800 text-white rounded-2xl flex items-center justify-center text-xl mb-5 shadow-lg shadow-jade-500/20">
                        <FaRegClock />
                    </div>
                    <h3 className="text-lg font-bold text-jade-950 mb-2">Instant Booking</h3>
                    <p className="text-gray-500 text-xs leading-relaxed">Fast checkouts powered by OTP verification directly to your registered email.</p>
                </div>
                
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-jade-100 flex flex-col items-center text-center hover:-translate-y-1 hover:border-jade-300 transition duration-300">
                    <div className="w-14 h-14 bg-gradient-to-br from-jade-500 to-jade-800 text-white rounded-2xl flex items-center justify-center text-xl mb-5 shadow-lg shadow-jade-500/20">
                        <FaTicketAlt />
                    </div>
                    <h3 className="text-lg font-bold text-jade-950 mb-2">Digital Pass & QR</h3>
                    <p className="text-gray-500 text-xs leading-relaxed">Access scannable digital pass QR codes and printable tickets directly from your dashboard.</p>
                </div>
                
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-jade-100 flex flex-col items-center text-center hover:-translate-y-1 hover:border-jade-300 transition duration-300">
                    <div className="w-14 h-14 bg-gradient-to-br from-jade-500 to-jade-800 text-white rounded-2xl flex items-center justify-center text-xl mb-5 shadow-lg shadow-jade-500/20">
                        <FaShieldAlt />
                    </div>
                    <h3 className="text-lg font-bold text-jade-950 mb-2">Secure Platform</h3>
                    <p className="text-gray-500 text-xs leading-relaxed">Role-based admin management, JWT authentication, and 2FA protection for all ticket requests.</p>
                </div>
            </div>

            {/* Floating AI Assistant Trigger Button */}
            <button
                onClick={() => setShowAiModal(true)}
                className="fixed bottom-6 left-6 z-40 bg-gradient-to-r from-jade-950 to-jade-900 text-white p-4 rounded-2xl shadow-2xl border border-jade-700/60 flex items-center gap-3 hover:scale-105 transition group"
            >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-jade-400 to-emerald-400 text-jade-950 flex items-center justify-center text-xl shadow-md">
                    <FaRobot />
                </div>
                <div className="text-left hidden sm:block pr-2">
                    <p className="text-xs font-black font-display tracking-tight text-white">AI Place Recommender</p>
                    <p className="text-[10px] text-jade-300">Find best events & spots near me</p>
                </div>
            </button>

            {/* AI Assistant Modal */}
            {showAiModal && (
                <AIRecommenderModal onClose={() => setShowAiModal(false)} />
            )}

            {/* Footer */}
            <footer className="mt-auto pt-12 pb-8 border-t border-jade-200/80 text-center">
                <div className="flex justify-center items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-jade-900 text-jade-400 flex items-center justify-center">
                        <FaTicketAlt className="text-base" />
                    </div>
                    <span className="text-lg font-black font-display text-jade-950">Eventora</span>
                </div>
                <p className="text-gray-500 text-xs mb-6 max-w-md mx-auto">
                    The premier platform for discovering, organizing, and securing tickets to top-rated experiences.
                </p>
                <div className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">
                    &copy; {new Date().getFullYear()} Eventora Platform. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

export default Home;
