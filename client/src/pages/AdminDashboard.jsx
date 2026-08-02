import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/axios';
import { useNavigate } from 'react-router-dom';
import Toast from '../components/Toast';
import { FaPlus, FaEdit, FaTrash, FaCheck, FaTimes, FaRupeeSign, FaUsers, FaClock, FaCalendarAlt, FaFilter, FaExclamationTriangle } from 'react-icons/fa';

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [events, setEvents] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [bookingFilter, setBookingFilter] = useState('all'); // 'all', 'pending', 'confirmed', 'cancelled'

    // Form Modal State
    const [showEventModal, setShowEventModal] = useState(false);
    const [editingEventId, setEditingEventId] = useState(null);
    const [formData, setFormData] = useState({
        title: '', description: '', date: '', location: '', category: '', totalSeats: '', ticketPrice: '', image: ''
    });

    // Confirmation modal state
    const [deleteEventId, setDeleteEventId] = useState(null);
    const [toast, setToast] = useState({ message: '', type: 'info' });

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/login');
            return;
        }
        fetchData();
    }, [user, navigate]);

    const fetchData = async () => {
        try {
            const [eventsRes, bookingsRes] = await Promise.all([
                api.get('/events'),
                api.get('/bookings/my')
            ]);
            setEvents(eventsRes.data);
            setBookings(bookingsRes.data);
        } catch (error) {
            setToast({ message: 'Error loading admin data', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleOpenCreateModal = () => {
        setEditingEventId(null);
        setFormData({ title: '', description: '', date: '', location: '', category: '', totalSeats: '', ticketPrice: '', image: '' });
        setShowEventModal(true);
    };

    const handleOpenEditModal = (event) => {
        setEditingEventId(event._id);
        const formattedDate = event.date ? new Date(event.date).toISOString().split('T')[0] : '';
        setFormData({
            title: event.title || '',
            description: event.description || '',
            date: formattedDate,
            location: event.location || '',
            category: event.category || '',
            totalSeats: event.totalSeats || '',
            ticketPrice: event.ticketPrice || 0,
            image: event.image || ''
        });
        setShowEventModal(true);
    };

    const handleSaveEvent = async (e) => {
        e.preventDefault();
        try {
            if (editingEventId) {
                await api.put(`/events/${editingEventId}`, formData);
                setToast({ message: 'Event updated successfully!', type: 'success' });
            } else {
                await api.post('/events', formData);
                setToast({ message: 'New event published successfully!', type: 'success' });
            }
            setShowEventModal(false);
            fetchData();
        } catch (error) {
            setToast({ message: error.response?.data?.message || 'Error saving event', type: 'error' });
        }
    };

    const handleConfirmDeleteEvent = async () => {
        if (!deleteEventId) return;
        try {
            await api.delete(`/events/${deleteEventId}`);
            setToast({ message: 'Event deleted successfully', type: 'info' });
            setDeleteEventId(null);
            fetchData();
        } catch (error) {
            setToast({ message: 'Error deleting event', type: 'error' });
        }
    };

    const handleConfirmBooking = async (id, paymentStatus) => {
        try {
            await api.put(`/bookings/${id}/confirm`, { paymentStatus });
            setToast({ message: 'Booking confirmed!', type: 'success' });
            fetchData();
        } catch (error) {
            setToast({ message: error.response?.data?.message || 'Error confirming booking', type: 'error' });
        }
    };

    const handleCancelBooking = async (id) => {
        try {
            await api.delete(`/bookings/${id}`);
            setToast({ message: 'Booking request rejected/cancelled', type: 'info' });
            fetchData();
        } catch (error) {
            setToast({ message: error.response?.data?.message || 'Error updating booking status', type: 'error' });
        }
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto py-20 text-center">
                <div className="w-14 h-14 border-4 border-jade-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-jade-950 font-bold text-lg">Loading Admin Operations...</p>
            </div>
        );
    }

    const totalRevenue = bookings.reduce((sum, b) => b.paymentStatus === 'paid' && b.status === 'confirmed' ? sum + b.amount : sum, 0);
    const paidClientsCount = new Set(bookings.filter(b => b.paymentStatus === 'paid' && b.status === 'confirmed').map(b => b.userId?._id)).size;
    const pendingCount = bookings.filter(b => b.status === 'pending').length;

    const filteredBookings = bookings.filter(b => {
        if (bookingFilter === 'all') return true;
        return b.status === bookingFilter;
    });

    return (
        <div className="max-w-7xl mx-auto pb-16">
            <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'info' })} />

            {/* Header Banner */}
            <div className="bg-gradient-to-r from-jade-950 via-jade-900 to-jade-950 text-white rounded-3xl p-6 sm:p-8 mb-8 shadow-xl border border-jade-800 flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                    <span className="bg-jade-500/20 text-jade-300 border border-jade-400/30 text-xs font-bold px-3.5 py-1 rounded-full uppercase tracking-wider mb-2 inline-block">
                        Organizer Operations Control
                    </span>
                    <h1 className="text-3xl sm:text-4xl font-black font-display tracking-tight text-white mb-2">
                        Admin Command Center
                    </h1>
                    <p className="text-jade-200/80 text-sm font-light">
                        Create events, edit details, and process user ticket confirmation requests.
                    </p>
                </div>
                <button
                    onClick={handleOpenCreateModal}
                    className="w-full md:w-auto bg-gradient-to-r from-jade-400 to-emerald-400 text-jade-950 font-bold py-3.5 px-6 rounded-2xl hover:from-jade-300 hover:to-emerald-300 transition shadow-lg shadow-jade-400/20 flex items-center justify-center gap-2 text-sm shrink-0"
                >
                    <FaPlus /> Create New Event
                </button>
            </div>

            {/* Admin Metrics Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-jade-100 flex items-center justify-between">
                    <div>
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Total Confirmed Revenue</p>
                        <h3 className="text-3xl font-black text-jade-950 font-display">₹{totalRevenue}</h3>
                    </div>
                    <div className="w-12 h-12 bg-jade-100 text-jade-700 rounded-2xl flex items-center justify-center text-xl font-bold">
                        <FaRupeeSign />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-jade-100 flex items-center justify-between">
                    <div>
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Confirmed Paid Attendees</p>
                        <h3 className="text-3xl font-black text-jade-700 font-display">{paidClientsCount}</h3>
                    </div>
                    <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center text-xl font-bold">
                        <FaUsers />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-jade-100 flex items-center justify-between">
                    <div>
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Pending Approval Queue</p>
                        <h3 className="text-3xl font-black text-amber-600 font-display">{pendingCount}</h3>
                    </div>
                    <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center text-xl font-bold">
                        <FaClock />
                    </div>
                </div>
            </div>

            {/* Split Content: Events & Booking Requests */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Events Section */}
                <div className="flex flex-col">
                    <div className="flex justify-between items-center mb-4 px-1">
                        <h2 className="text-xl font-black font-display text-jade-950 flex items-center gap-2">
                            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-jade-900 text-jade-300 text-xs">{events.length}</span>
                            Active Hosted Events
                        </h2>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-jade-100 overflow-hidden">
                        <ul className="divide-y divide-gray-100 max-h-[650px] overflow-y-auto">
                            {events.length === 0 ? (
                                <li className="p-8 text-gray-400 text-center text-sm">No events created yet.</li>
                            ) : (
                                events.map(event => (
                                    <li key={event._id} className="p-5 hover:bg-jade-50/50 transition flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                        <div className="flex-grow">
                                            <h4 className="font-bold text-jade-950 text-base leading-snug mb-1">{event.title}</h4>
                                            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 font-medium">
                                                <span className="flex items-center gap-1"><FaCalendarAlt className="text-jade-600" /> {new Date(event.date).toLocaleDateString()}</span>
                                                <span className="bg-jade-100 text-jade-800 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase">{event.category}</span>
                                                <span className="font-bold text-gray-700">{event.availableSeats}/{event.totalSeats} seats left</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                                            <button
                                                onClick={() => handleOpenEditModal(event)}
                                                className="flex-1 sm:flex-none p-2.5 text-jade-700 hover:bg-jade-100 border border-jade-200 rounded-xl font-bold text-xs transition flex items-center justify-center gap-1"
                                                title="Edit Event"
                                            >
                                                <FaEdit /> Edit
                                            </button>
                                            <button
                                                onClick={() => setDeleteEventId(event._id)}
                                                className="flex-1 sm:flex-none p-2.5 text-red-600 hover:bg-red-50 border border-red-200 rounded-xl font-bold text-xs transition flex items-center justify-center gap-1"
                                                title="Delete Event"
                                            >
                                                <FaTrash /> Delete
                                            </button>
                                        </div>
                                    </li>
                                ))
                            )}
                        </ul>
                    </div>
                </div>

                {/* Booking Requests Section */}
                <div className="flex flex-col">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 px-1">
                        <h2 className="text-xl font-black font-display text-jade-950 flex items-center gap-2">
                            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-amber-100 text-amber-700 text-xs font-extrabold">{filteredBookings.length}</span>
                            Booking Requests Queue
                        </h2>

                        {/* Filter Toggle */}
                        <div className="flex items-center gap-1 bg-jade-50 p-1 rounded-xl border border-jade-100 text-xs font-bold">
                            <FaFilter className="text-jade-600 ml-2 mr-1 text-xs" />
                            <button onClick={() => setBookingFilter('all')} className={`px-2.5 py-1 rounded-lg transition ${bookingFilter === 'all' ? 'bg-jade-900 text-white' : 'text-gray-500'}`}>All</button>
                            <button onClick={() => setBookingFilter('pending')} className={`px-2.5 py-1 rounded-lg transition ${bookingFilter === 'pending' ? 'bg-amber-600 text-white' : 'text-gray-500'}`}>Pending</button>
                            <button onClick={() => setBookingFilter('confirmed')} className={`px-2.5 py-1 rounded-lg transition ${bookingFilter === 'confirmed' ? 'bg-green-600 text-white' : 'text-gray-500'}`}>Confirmed</button>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-jade-100 overflow-hidden">
                        <ul className="divide-y divide-gray-100 max-h-[650px] overflow-y-auto">
                            {filteredBookings.length === 0 ? (
                                <li className="p-8 text-gray-400 text-center text-sm">No booking requests found for selected filter.</li>
                            ) : (
                                filteredBookings.map(booking => (
                                    <li key={booking._id} className="p-5 hover:bg-gray-50/80 transition">
                                        <div className="flex justify-between items-start mb-2 gap-2">
                                            <h4 className="font-bold text-jade-950 text-base leading-snug">{booking.eventId?.title || 'Deleted Event'}</h4>
                                            <span className={`px-2.5 py-0.5 text-[10px] font-black rounded-full uppercase tracking-wider shrink-0 ${
                                                booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                                booking.status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                                            }`}>
                                                {booking.status}
                                            </span>
                                        </div>

                                        <div className="bg-jade-50/50 rounded-xl p-3 mb-3 border border-jade-100/60 text-xs space-y-1">
                                            <p className="text-gray-700">
                                                <strong className="text-gray-500 uppercase text-[10px] mr-2">User:</strong>
                                                <span className="font-bold text-gray-800">{booking.userId?.name}</span> ({booking.userId?.email})
                                            </p>
                                            <p className="text-gray-700">
                                                <strong className="text-gray-500 uppercase text-[10px] mr-2">Price:</strong>
                                                <span className="font-bold text-jade-800">{booking.amount === 0 ? 'Free' : `₹${booking.amount}`}</span>
                                            </p>
                                        </div>

                                        {booking.status === 'pending' && (
                                            <div className="flex flex-wrap gap-2">
                                                <button
                                                    onClick={() => handleConfirmBooking(booking._id, 'paid')}
                                                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold text-xs py-2 px-3 rounded-xl transition shadow-sm flex items-center justify-center gap-1"
                                                >
                                                    <FaCheck /> Confirm (Paid)
                                                </button>
                                                <button
                                                    onClick={() => handleConfirmBooking(booking._id, 'not_paid')}
                                                    className="flex-1 bg-gray-800 hover:bg-gray-900 text-white font-bold text-xs py-2 px-3 rounded-xl transition flex items-center justify-center gap-1"
                                                >
                                                    <FaCheck /> Confirm (Unpaid)
                                                </button>
                                                <button
                                                    onClick={() => handleCancelBooking(booking._id)}
                                                    className="bg-red-50 text-red-600 hover:bg-red-600 hover:text-white border border-red-200 font-bold text-xs py-2 px-3 rounded-xl transition flex items-center justify-center gap-1"
                                                >
                                                    <FaTimes /> Reject
                                                </button>
                                            </div>
                                        )}
                                    </li>
                                ))
                            )}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Create / Edit Event Modal */}
            {showEventModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-jade-950/70 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-jade-100 max-h-[90vh] overflow-y-auto">
                        <h2 className="text-2xl font-black font-display text-jade-950 mb-6">
                            {editingEventId ? 'Edit Event Details' : 'Create New Event'}
                        </h2>

                        <form onSubmit={handleSaveEvent} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Event Title</label>
                                <input required type="text" placeholder="e.g. AI Innovation Summit" className="w-full border border-jade-200 px-4 py-2.5 rounded-xl text-sm focus:ring-2 focus:ring-jade-500 outline-none" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Category</label>
                                <input required type="text" placeholder="Technology, Music, etc." className="w-full border border-jade-200 px-4 py-2.5 rounded-xl text-sm focus:ring-2 focus:ring-jade-500 outline-none" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Date</label>
                                <input required type="date" className="w-full border border-jade-200 px-4 py-2.5 rounded-xl text-sm focus:ring-2 focus:ring-jade-500 outline-none" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Location</label>
                                <input required type="text" placeholder="Convention Center, CA" className="w-full border border-jade-200 px-4 py-2.5 rounded-xl text-sm focus:ring-2 focus:ring-jade-500 outline-none" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Total Capacity</label>
                                <input required type="number" placeholder="200" className="w-full border border-jade-200 px-4 py-2.5 rounded-xl text-sm focus:ring-2 focus:ring-jade-500 outline-none" value={formData.totalSeats} onChange={e => setFormData({ ...formData, totalSeats: e.target.value })} />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Ticket Price (₹)</label>
                                <input required type="number" placeholder="0 for Free" className="w-full border border-jade-200 px-4 py-2.5 rounded-xl text-sm focus:ring-2 focus:ring-jade-500 outline-none" value={formData.ticketPrice} onChange={e => setFormData({ ...formData, ticketPrice: e.target.value })} />
                            </div>

                            <div className="sm:col-span-2">
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Image URL</label>
                                <input type="text" placeholder="https://images.unsplash.com/..." className="w-full border border-jade-200 px-4 py-2.5 rounded-xl text-sm focus:ring-2 focus:ring-jade-500 outline-none" value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} />
                            </div>

                            <div className="sm:col-span-2">
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Event Description</label>
                                <textarea required placeholder="Detailed event highlights and agenda..." className="w-full border border-jade-200 px-4 py-2.5 rounded-xl text-sm h-28 focus:ring-2 focus:ring-jade-500 outline-none" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                            </div>

                            <div className="sm:col-span-2 flex justify-end gap-3 pt-3">
                                <button type="button" onClick={() => setShowEventModal(false)} className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-bold text-sm hover:bg-gray-100 transition">Cancel</button>
                                <button type="submit" className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-jade-600 to-jade-700 hover:from-jade-700 hover:to-jade-800 text-white font-bold text-sm shadow-md transition">
                                    {editingEventId ? 'Save Changes' : 'Publish Event'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Custom Confirm Delete Modal */}
            {deleteEventId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-jade-950/70 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-jade-100 text-center">
                        <div className="w-14 h-14 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
                            <FaExclamationTriangle />
                        </div>
                        <h3 className="text-xl font-extrabold text-jade-950 mb-2">Delete Event?</h3>
                        <p className="text-gray-500 text-sm mb-6">
                            Are you sure you want to permanently delete this event? This action will affect associated user bookings.
                        </p>
                        <div className="flex gap-3">
                            <button onClick={() => setDeleteEventId(null)} className="flex-1 py-3 border border-gray-200 rounded-xl font-bold text-gray-700 text-sm hover:bg-gray-100 transition">Cancel</button>
                            <button onClick={handleConfirmDeleteEvent} className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-sm shadow-md transition">Confirm Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
