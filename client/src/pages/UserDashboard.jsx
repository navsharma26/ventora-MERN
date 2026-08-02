import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/axios';
import { Link, useNavigate } from 'react-router-dom';
import TicketModal from '../components/TicketModal';
import Toast from '../components/Toast';
import { FaTicketAlt, FaTimesCircle, FaQrcode, FaCheckCircle, FaExclamationTriangle, FaCalendarAlt, FaMoneyBillWave } from 'react-icons/fa';

const UserDashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBookingForTicket, setSelectedBookingForTicket] = useState(null);
    const [cancellingBookingId, setCancellingBookingId] = useState(null);
    const [toast, setToast] = useState({ message: '', type: 'info' });

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchBookings();
    }, [user, navigate]);

    const fetchBookings = async () => {
        try {
            const { data } = await api.get('/bookings/my');
            setBookings(data);
        } catch (error) {
            setToast({ message: 'Error loading bookings.', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmCancel = async () => {
        if (!cancellingBookingId) return;
        try {
            await api.delete(`/bookings/${cancellingBookingId}`);
            setToast({ message: 'Booking cancelled successfully.', type: 'info' });
            setCancellingBookingId(null);
            fetchBookings();
        } catch (error) {
            setToast({ message: error.response?.data?.message || 'Error cancelling booking', type: 'error' });
        }
    };

    if (loading) {
        return (
            <div className="max-w-6xl mx-auto py-20 text-center">
                <div className="w-14 h-14 border-4 border-jade-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-jade-950 font-bold text-lg">Loading your dashboard...</p>
            </div>
        );
    }

    const confirmedCount = bookings.filter(b => b.status === 'confirmed').length;
    const pendingCount = bookings.filter(b => b.status === 'pending').length;

    return (
        <div className="max-w-6xl mx-auto pb-16">
            <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'info' })} />

            {/* Profile Header Banner */}
            <div className="bg-gradient-to-r from-jade-950 via-jade-900 to-jade-950 text-white rounded-3xl p-6 sm:p-8 mb-8 shadow-xl border border-jade-800 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 transform translate-x-8 -translate-y-8 w-64 h-64 bg-jade-500/10 rounded-full blur-3xl pointer-events-none"></div>

                <div className="w-20 h-20 bg-gradient-to-tr from-jade-500 to-emerald-400 text-jade-950 rounded-2xl flex items-center justify-center text-3xl font-black font-display uppercase tracking-widest shrink-0 shadow-lg shadow-jade-500/20">
                    {user?.name.charAt(0)}
                </div>

                <div className="flex-grow z-10">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
                        <h1 className="text-2xl sm:text-4xl font-black font-display tracking-tight text-white">
                            Welcome back, {user?.name}!
                        </h1>
                        <span className="bg-jade-500/20 text-jade-300 border border-jade-400/30 text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider self-center sm:self-auto">
                            Verified Member
                        </span>
                    </div>

                    <p className="text-jade-200/80 text-sm font-light mb-4">
                        Manage your ticket reservations, download digital passes, and track request statuses.
                    </p>

                    <div className="flex flex-wrap gap-4 text-xs font-bold">
                        <div className="bg-jade-900/80 px-4 py-2 rounded-xl border border-jade-700/50 flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-green-400"></span>
                            <span>{confirmedCount} Confirmed Passes</span>
                        </div>
                        <div className="bg-jade-900/80 px-4 py-2 rounded-xl border border-jade-700/50 flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                            <span>{pendingCount} Pending Requests</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bookings Header */}
            <div className="flex items-center justify-between mb-6 px-1">
                <h2 className="text-2xl font-black font-display text-jade-950 flex items-center gap-3">
                    <FaTicketAlt className="text-jade-600" /> My Ticket Reservations
                </h2>
                <span className="text-sm font-bold text-gray-500">{bookings.length} Total</span>
            </div>

            {/* Bookings List */}
            {bookings.length === 0 ? (
                <div className="bg-white rounded-3xl p-16 text-center border border-jade-100 shadow-sm">
                    <div className="w-20 h-20 bg-jade-50 rounded-full flex items-center justify-center mx-auto mb-4 ring-4 ring-jade-100/50">
                        <FaTicketAlt className="text-jade-400 text-3xl" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">No Ticket Reservations Yet</h3>
                    <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">
                        You haven't requested any tickets yet. Explore upcoming tech conferences, concerts, and workshops!
                    </p>
                    <Link
                        to="/"
                        className="inline-block bg-gradient-to-r from-jade-600 to-jade-700 hover:from-jade-700 hover:to-jade-800 text-white font-bold py-3.5 px-8 rounded-xl transition shadow-lg shadow-jade-600/20"
                    >
                        Explore Events
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {bookings.map((booking) => (
                        <div
                            key={booking._id}
                            className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition border border-jade-100 flex flex-col justify-between"
                        >
                            <div className="p-6">
                                {booking.eventId ? (
                                    <>
                                        <div className="flex justify-between items-start mb-4 gap-3">
                                            <h3 className="text-lg font-bold text-gray-900 leading-snug line-clamp-2">
                                                {booking.eventId.title}
                                            </h3>
                                            <span
                                                className={`px-3 py-1 text-[10px] font-black rounded-full uppercase tracking-wider shrink-0 ${
                                                    booking.status === 'confirmed'
                                                        ? 'bg-green-100 text-green-800 border border-green-200'
                                                        : booking.status === 'cancelled'
                                                        ? 'bg-red-100 text-red-800 border border-red-200'
                                                        : 'bg-amber-100 text-amber-800 border border-amber-200'
                                                }`}
                                            >
                                                {booking.status}
                                            </span>
                                        </div>

                                        <div className="space-y-2 text-xs text-gray-600 mb-4 bg-jade-50/50 p-3 rounded-xl border border-jade-100/60">
                                            <div className="flex items-center gap-2">
                                                <FaCalendarAlt className="text-jade-600" />
                                                <span>{new Date(booking.eventId.date).toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex items-center justify-between pt-1 border-t border-jade-100/80">
                                                <span className="flex items-center gap-1 font-semibold text-gray-500">
                                                    <FaMoneyBillWave className="text-jade-600" /> Amount:
                                                </span>
                                                <span className="font-extrabold text-jade-950">
                                                    {booking.amount === 0 ? 'Free' : `₹${booking.amount}`}
                                                </span>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <p className="text-red-500 text-sm italic py-4">Event details unavailable (deleted)</p>
                                )}
                            </div>

                            {/* Card Footer Actions */}
                            <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between gap-2">
                                {booking.eventId && booking.status === 'confirmed' && (
                                    <button
                                        onClick={() => setSelectedBookingForTicket(booking)}
                                        className="flex-1 bg-gradient-to-r from-jade-600 to-jade-700 hover:from-jade-700 hover:to-jade-800 text-white font-bold text-xs py-2.5 px-3 rounded-xl shadow-sm flex items-center justify-center gap-1.5 transition"
                                    >
                                        <FaQrcode /> View Digital Pass
                                    </button>
                                )}

                                {booking.eventId && booking.status === 'pending' && (
                                    <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-3 py-2 rounded-xl border border-amber-200 flex-1 text-center">
                                        Pending Admin Review
                                    </span>
                                )}

                                {booking.eventId && booking.status !== 'cancelled' && (
                                    <button
                                        onClick={() => setCancellingBookingId(booking._id)}
                                        className="text-red-600 hover:bg-red-50 border border-red-200 font-bold text-xs p-2.5 rounded-xl transition flex items-center justify-center gap-1"
                                        title="Cancel Booking"
                                    >
                                        <FaTimesCircle className="text-sm" />
                                    </button>
                                )}

                                {booking.status === 'cancelled' && (
                                    <div className="w-full text-center text-xs font-bold text-gray-400 py-1">
                                        Cancelled
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Digital Ticket Modal */}
            {selectedBookingForTicket && (
                <TicketModal
                    booking={selectedBookingForTicket}
                    onClose={() => setSelectedBookingForTicket(null)}
                />
            )}

            {/* Custom Cancel Confirmation Dialog */}
            {cancellingBookingId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-jade-950/70 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-jade-100 text-center">
                        <div className="w-14 h-14 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
                            <FaExclamationTriangle />
                        </div>
                        <h3 className="text-xl font-extrabold text-jade-950 mb-2">Cancel Ticket Request?</h3>
                        <p className="text-gray-500 text-sm mb-6">
                            Are you sure you want to cancel this booking request? This action cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setCancellingBookingId(null)}
                                className="flex-1 py-3 border border-gray-200 rounded-xl font-bold text-gray-700 text-sm hover:bg-gray-100 transition"
                            >
                                Keep Ticket
                            </button>
                            <button
                                onClick={handleConfirmCancel}
                                className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-sm shadow-md transition"
                            >
                                Confirm Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserDashboard;
