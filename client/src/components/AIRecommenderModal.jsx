import React, { useState } from 'react';
import api from '../utils/axios';
import { Link } from 'react-router-dom';
import { FaRobot, FaTimes, FaLocationArrow, FaMagic, FaCalendarAlt, FaArrowRight, FaTicketAlt, FaStar } from 'react-icons/fa';

const AIRecommenderModal = ({ onClose }) => {
    const [loading, setLoading] = useState(false);
    const [userLat, setUserLat] = useState(null);
    const [userLng, setUserLng] = useState(null);
    const [category, setCategory] = useState('All');
    const [maxBudget, setMaxBudget] = useState('');
    const [aiInsight, setAiInsight] = useState('');
    const [recommendations, setRecommendations] = useState([]);
    const [gpsActive, setGpsActive] = useState(false);

    const handleDetectLocation = () => {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser');
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setUserLat(pos.coords.latitude);
                setUserLng(pos.coords.longitude);
                setGpsActive(true);
            },
            (err) => {
                alert('Location permission denied or unavailable');
            }
        );
    };

    const handleGetRecommendations = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        try {
            const { data } = await api.post('/ai/recommend', {
                lat: userLat,
                lng: userLng,
                category,
                maxBudget: maxBudget ? Number(maxBudget) : null
            });
            setAiInsight(data.aiInsight);
            setRecommendations(data.recommendations || []);
        } catch (error) {
            console.error('Error fetching AI recommendations:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-jade-950/75 backdrop-blur-md animate-fadeIn">
            <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-jade-100 flex flex-col max-h-[90vh]">
                {/* AI Header */}
                <div className="bg-gradient-to-r from-jade-950 via-jade-900 to-jade-950 text-white p-6 flex justify-between items-center border-b border-jade-800">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-jade-400 to-emerald-400 text-jade-950 flex items-center justify-center text-xl shadow-md">
                            <FaRobot />
                        </div>
                        <div>
                            <h3 className="font-extrabold text-lg font-display flex items-center gap-2">
                                Eventora AI Assistant <span className="text-[10px] bg-jade-500/30 text-jade-300 border border-jade-400/30 px-2 py-0.5 rounded-full uppercase">Smart AI</span>
                            </h3>
                            <p className="text-xs text-jade-200/80">Real-time location & preference-based place recommender</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
                    >
                        <FaTimes />
                    </button>
                </div>

                {/* Body Content */}
                <div className="p-6 overflow-y-auto space-y-6">
                    {/* Controls Form */}
                    <div className="bg-jade-50/60 p-5 rounded-2xl border border-jade-100/80 space-y-4">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <button
                                type="button"
                                onClick={handleDetectLocation}
                                className={`text-xs font-bold px-4 py-2.5 rounded-xl border transition flex items-center gap-2 ${
                                    gpsActive
                                        ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                                        : 'bg-white text-jade-900 border-jade-200 hover:bg-jade-100'
                                }`}
                            >
                                <FaLocationArrow className={gpsActive ? 'animate-pulse' : ''} />
                                <span>{gpsActive ? 'GPS Coordinates Synced' : 'Detect My Real-Time GPS Location'}</span>
                            </button>

                            <div className="flex items-center gap-2">
                                <label className="text-xs font-bold text-gray-500 uppercase">Max Budget (₹):</label>
                                <input
                                    type="number"
                                    placeholder="Any"
                                    className="w-24 border border-jade-200 px-3 py-1.5 rounded-xl text-xs focus:ring-2 focus:ring-jade-500 outline-none font-bold"
                                    value={maxBudget}
                                    onChange={(e) => setMaxBudget(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between gap-3 pt-2 border-t border-jade-100">
                            <div className="flex items-center gap-2">
                                <label className="text-xs font-bold text-gray-500 uppercase">Interest:</label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="border border-jade-200 px-3 py-1.5 rounded-xl text-xs font-bold text-jade-950 outline-none"
                                >
                                    <option value="All">All Categories</option>
                                    <option value="Technology">Technology</option>
                                    <option value="Music">Music</option>
                                    <option value="Business">Business</option>
                                    <option value="Art">Art</option>
                                </select>
                            </div>

                            <button
                                onClick={handleGetRecommendations}
                                disabled={loading}
                                className="bg-gradient-to-r from-jade-600 to-jade-700 hover:from-jade-700 hover:to-jade-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition flex items-center gap-2"
                            >
                                {loading ? 'Analyzing AI Scores...' : 'Generate AI Suggestions'}
                            </button>
                        </div>
                    </div>

                    {/* AI Response Cards */}
                    {aiInsight && (
                        <p className="text-xs font-bold text-jade-800 bg-jade-100/70 p-3 rounded-xl border border-jade-200 flex items-center gap-2">
                            <FaMagic className="text-jade-600 text-sm shrink-0" />
                            <span>{aiInsight}</span>
                        </p>
                    )}

                    {recommendations.length > 0 && (
                        <div className="space-y-4">
                            {recommendations.map((rec) => (
                                <div
                                    key={rec._id}
                                    className="bg-white rounded-2xl p-4 border border-jade-100 shadow-sm hover:shadow-md transition flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                                >
                                    <div className="flex-grow">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="bg-jade-900 text-jade-300 text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
                                                {rec.category}
                                            </span>
                                            {rec.distance && (
                                                <span className="text-[11px] font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                                                    📍 {rec.distance} km away
                                                </span>
                                            )}
                                            <span className="text-[11px] font-bold text-amber-500 flex items-center gap-1">
                                                <FaStar /> {rec.averageRating || 4.8}★
                                            </span>
                                        </div>
                                        
                                        <h4 className="font-extrabold text-jade-950 text-base mb-1">{rec.title}</h4>
                                        <p className="text-xs text-gray-500 mb-2">{rec.location}</p>
                                        
                                        <div className="bg-jade-50 p-2.5 rounded-xl text-xs text-jade-900 font-medium border border-jade-100 flex items-start gap-2">
                                            <FaRobot className="text-jade-600 text-sm mt-0.5 shrink-0" />
                                            <span><strong>AI Rationale:</strong> {rec.aiReasoning}</span>
                                        </div>
                                    </div>

                                    <div className="flex sm:flex-col justify-between sm:justify-center items-end gap-2 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 shrink-0">
                                        <span className="font-black text-jade-950 text-base">
                                            {rec.ticketPrice === 0 ? 'FREE' : `₹${rec.ticketPrice}`}
                                        </span>
                                        <Link
                                            to={`/events/${rec._id}`}
                                            onClick={onClose}
                                            className="bg-jade-900 hover:bg-jade-950 text-white font-bold text-xs px-4 py-2 rounded-xl transition flex items-center gap-1 shadow-sm"
                                        >
                                            <span>View</span>
                                            <FaArrowRight className="text-[10px]" />
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AIRecommenderModal;
