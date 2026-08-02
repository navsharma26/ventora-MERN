import React, { useState } from 'react';
import { FaUserCheck, FaTimes, FaStar, FaEnvelope, FaPhone, FaCheckCircle, FaGlobe, FaCertificate } from 'react-icons/fa';

const GuideConnectModal = ({ guide, onClose }) => {
    const [messageSent, setMessageSent] = useState(false);
    const [userMsg, setUserMsg] = useState('');

    if (!guide) return null;

    const handleSendMessage = (e) => {
        e.preventDefault();
        setMessageSent(true);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-jade-950/70 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-jade-100 flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="bg-gradient-to-r from-jade-950 via-jade-900 to-jade-950 text-white p-5 flex justify-between items-center border-b border-jade-800">
                    <div className="flex items-center gap-2">
                        <FaUserCheck className="text-jade-400 text-xl" />
                        <span className="font-bold text-lg font-display">Verified Tourist & Event Guide</span>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
                    >
                        <FaTimes />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto space-y-6">
                    {/* Guide Bio Header */}
                    <div className="flex items-center gap-5">
                        <img
                            src={guide.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'}
                            alt={guide.name}
                            className="w-20 h-20 rounded-2xl object-cover shadow-md border-2 border-jade-500 shrink-0"
                        />
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-xl font-extrabold text-jade-950 font-display">{guide.name}</h3>
                                <FaCheckCircle className="text-jade-600 text-sm" title="Verified License" />
                            </div>
                            <p className="text-xs font-bold text-jade-700 uppercase tracking-wider mb-2">{guide.title}</p>
                            <div className="flex items-center gap-3 text-xs">
                                <span className="flex items-center gap-1 text-amber-500 font-extrabold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                                    <FaStar /> {guide.rating || 4.9}
                                </span>
                                <span className="text-gray-500 font-semibold">{guide.experienceYears || 5}+ yrs exp</span>
                                <span className="text-jade-950 font-extrabold">₹{guide.hourlyRate}/hr</span>
                            </div>
                        </div>
                    </div>

                    {/* Bio & Details */}
                    <div className="bg-jade-50/60 p-4 rounded-2xl border border-jade-100 text-xs space-y-3">
                        <p className="text-gray-700 leading-relaxed font-medium">{guide.bio}</p>

                        <div className="flex items-center gap-2 pt-2 border-t border-jade-100">
                            <FaGlobe className="text-jade-600 shrink-0" />
                            <span className="font-bold text-gray-500">Languages:</span>
                            <span className="font-semibold text-gray-800">{guide.languages ? guide.languages.join(', ') : 'English'}</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <FaCertificate className="text-jade-600 shrink-0" />
                            <span className="font-bold text-gray-500">Specialties:</span>
                            <span className="font-semibold text-gray-800">{guide.specialties ? guide.specialties.join(' • ') : 'City Tours'}</span>
                        </div>
                    </div>

                    {/* Inquiry Form */}
                    {messageSent ? (
                        <div className="bg-jade-100 border border-jade-300 text-jade-900 p-4 rounded-2xl text-center text-sm font-bold animate-fadeIn">
                            <FaCheckCircle className="text-jade-600 text-3xl mx-auto mb-2" />
                            <p className="mb-1">Direct Message Sent to {guide.name}!</p>
                            <p className="text-xs font-normal text-jade-800">The guide will respond to your registered email shortly.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSendMessage} className="space-y-4">
                            <h4 className="text-xs font-extrabold uppercase text-jade-950 tracking-wider">Connect & Book Experience</h4>
                            <div>
                                <textarea
                                    required
                                    rows="3"
                                    placeholder={`Hi ${guide.name}, I am attending the event and would like custom guidance for my visit...`}
                                    className="w-full border border-jade-200 p-3 rounded-xl text-xs focus:ring-2 focus:ring-jade-500 outline-none"
                                    value={userMsg}
                                    onChange={(e) => setUserMsg(e.target.value)}
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-jade-600 to-jade-700 hover:from-jade-700 hover:to-jade-800 text-white font-bold py-3 rounded-xl text-xs shadow-md transition"
                            >
                                Send Direct Inquiry Request
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GuideConnectModal;
