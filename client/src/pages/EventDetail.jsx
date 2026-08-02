import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/axios';
import { AuthContext } from '../context/AuthContext';
import Toast from '../components/Toast';
import InteractiveMap from '../components/InteractiveMap';
import GuideConnectModal from '../components/GuideConnectModal';
import { FaCalendarAlt, FaMapMarkerAlt, FaChair, FaMoneyBillWave, FaShieldAlt, FaArrowLeft, FaCheckCircle, FaStar, FaUserCheck, FaCommentAlt, FaPaperPlane, FaQrcode, FaCopy, FaMobileAlt } from 'react-icons/fa';

const EventDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [otp, setOtp] = useState('');
    const [utrNumber, setUtrNumber] = useState('');
    const [copiedUpi, setCopiedUpi] = useState(false);
    const [showOTP, setShowOTP] = useState(false);
    const [otpTimer, setOtpTimer] = useState(300);
    const [toast, setToast] = useState({ message: '', type: 'info' });
    const [isBooked, setIsBooked] = useState(false);

    // Reviews & Guides state
    const [reviews, setReviews] = useState([]);
    const [guides, setGuides] = useState([]);
    const [selectedGuide, setSelectedGuide] = useState(null);

    // Review form state
    const [newRating, setNewRating] = useState(5);
    const [newComment, setNewComment] = useState('');
    const [reviewSubmitting, setReviewSubmitting] = useState(false);

    // GPS Location state for map
    const [userLat, setUserLat] = useState(null);
    const [userLng, setUserLng] = useState(null);

    useEffect(() => {
        const fetchEventData = async () => {
            try {
                const { data } = await api.get(`/events/${id}`);
                setEvent(data);

                // Fetch reviews and local guides in parallel
                const [reviewsRes, guidesRes] = await Promise.all([
                    api.get(`/reviews/event/${id}`),
                    api.get(`/guides?city=${encodeURIComponent(data.location.split(',')[0])}`)
                ]);
                setReviews(reviewsRes.data);
                setGuides(guidesRes.data);
            } catch (err) {
                setToast({ message: 'Failed to load event details.', type: 'error' });
            } finally {
                setLoading(false);
            }
        };
        fetchEventData();

        // Get user location for map pin if allowed
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((pos) => {
                setUserLat(pos.coords.latitude);
                setUserLng(pos.coords.longitude);
            });
        }
    }, [id]);

    useEffect(() => {
        let interval;
        if (showOTP && otpTimer > 0) {
            interval = setInterval(() => {
                setOtpTimer(prev => prev - 1);
            }, 1000);
        } else if (otpTimer === 0) {
            setShowOTP(false);
            setToast({ message: 'OTP expired. Please request a new code.', type: 'warning' });
        }
        return () => clearInterval(interval);
    }, [showOTP, otpTimer]);

    const formatTimer = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const handleBooking = async () => {
        if (!user) {
            navigate('/login');
            return;
        }
        setBookingLoading(true);

        try {
            if (!showOTP) {
                const { data } = await api.post('/bookings/send-otp');
                setShowOTP(true);
                setOtpTimer(300);
                if (data?.otp) setOtp(data.otp);
                setToast({ message: data?.message || 'OTP verification code sent!', type: 'info' });
            } else {
                await api.post('/bookings', {
                    eventId: event._id,
                    otp,
                    utrNumber,
                    paymentMethod: event.ticketPrice > 0 ? 'UPI' : 'Free'
                });
                setIsBooked(true);
                setShowOTP(false);
                setToast({ message: 'Booking request & payment submitted! Pending admin approval.', type: 'success' });
            }
        } catch (err) {
            setToast({ message: err.response?.data?.message || 'Booking request failed', type: 'error' });
        } finally {
            setBookingLoading(false);
        }
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            navigate('/login');
            return;
        }
        setReviewSubmitting(true);
        try {
            const { data } = await api.post('/reviews', {
                eventId: event._id,
                rating: Number(newRating),
                comment: newComment
            });
            setToast({ message: 'Review published successfully!', type: 'success' });
            setNewComment('');
            
            // Refresh event ratings & reviews
            const reviewsRes = await api.get(`/reviews/event/${id}`);
            setReviews(reviewsRes.data);
            setEvent({
                ...event,
                averageRating: data.averageRating,
                totalReviews: data.totalReviews
            });
        } catch (err) {
            setToast({ message: err.response?.data?.message || 'Failed to submit review', type: 'error' });
        } finally {
            setReviewSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto py-20 text-center animate-fadeIn">
                <div className="w-16 h-16 border-4 border-jade-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-jade-950 font-bold text-lg">Loading event details...</p>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="max-w-xl mx-auto py-20 text-center bg-white rounded-3xl p-8 border border-jade-100 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Event Not Found</h2>
                <button
                    onClick={() => navigate('/')}
                    className="bg-jade-900 text-white font-bold px-6 py-3 rounded-xl hover:bg-jade-800 transition"
                >
                    Back to Events
                </button>
            </div>
        );
    }

    const isSoldOut = event.availableSeats <= 0;

    return (
        <div className="max-w-5xl mx-auto pb-16">
            <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'info' })} />

            {/* Back Button */}
            <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 text-jade-800 font-bold text-sm hover:text-jade-950 mb-6 transition group"
            >
                <FaArrowLeft className="group-hover:-translate-x-1 transition" /> Back to All Events
            </button>

            {/* Main Detail Container */}
            <div className="bg-white rounded-3xl shadow-xl ring-1 ring-jade-100/80 overflow-hidden mb-10">
                {/* Hero Header Banner */}
                <div className="relative h-80 sm:h-96 bg-jade-950 overflow-hidden">
                    {event.image ? (
                        <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-jade-900 via-jade-950 to-emerald-950 text-jade-200/50 font-black text-6xl uppercase tracking-widest">
                            {event.category}
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-jade-950 via-jade-950/40 to-transparent"></div>

                    <div className="absolute bottom-8 left-8 right-8 text-white z-10">
                        <div className="flex items-center gap-3 mb-3">
                            <span className="inline-block bg-jade-500/30 text-jade-200 border border-jade-400/30 backdrop-blur-md text-xs font-bold uppercase tracking-widest px-4 py-1 rounded-full">
                                {event.category}
                            </span>
                            <span className="bg-amber-500/30 text-amber-200 border border-amber-400/30 backdrop-blur-md text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                                <FaStar className="text-amber-400" /> {event.averageRating || 4.8}★ ({event.totalReviews || reviews.length} reviews)
                            </span>
                        </div>
                        <h1 className="text-3xl sm:text-5xl font-black font-display leading-tight drop-shadow-md">
                            {event.title}
                        </h1>
                    </div>
                </div>

                {/* Grid Body */}
                <div className="p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Event Logistics & Description */}
                    <div className="lg:col-span-2 space-y-8">
                        <div>
                            <h3 className="text-sm font-bold uppercase tracking-wider text-jade-700 mb-2">About This Event</h3>
                            <p className="text-gray-600 text-base leading-relaxed font-light">
                                {event.description}
                            </p>
                        </div>

                        {/* Interactive Real-Time Map */}
                        <div>
                            <h3 className="text-sm font-bold uppercase tracking-wider text-jade-700 mb-3">Real-Time Place Location Map</h3>
                            <InteractiveMap
                                lat={event.coordinates?.lat}
                                lng={event.coordinates?.lng}
                                title={event.title}
                                locationName={event.location}
                                userLat={userLat}
                                userLng={userLng}
                            />
                        </div>

                        {/* Local Tourist Guides Section */}
                        <div className="border-t border-jade-100 pt-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-bold uppercase tracking-wider text-jade-700 flex items-center gap-2">
                                    <FaUserCheck className="text-jade-600" /> Local Tourist & Event Guides
                                </h3>
                                <span className="text-xs text-gray-400 font-bold">{guides.length} Verified Guides</span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {guides.slice(0, 4).map((guide) => (
                                    <div
                                        key={guide._id}
                                        className="bg-jade-50/50 p-4 rounded-2xl border border-jade-100 flex items-center gap-4 hover:border-jade-300 transition"
                                    >
                                        <img
                                            src={guide.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'}
                                            alt={guide.name}
                                            className="w-14 h-14 rounded-xl object-cover border border-jade-200 shrink-0"
                                        />
                                        <div className="flex-grow">
                                            <h4 className="font-bold text-jade-950 text-sm leading-snug">{guide.name}</h4>
                                            <p className="text-[11px] text-gray-500 font-medium mb-2">{guide.title}</p>
                                            <button
                                                onClick={() => setSelectedGuide(guide)}
                                                className="text-[11px] font-bold bg-jade-900 hover:bg-jade-950 text-white px-3 py-1 rounded-lg transition shadow-sm"
                                            >
                                                Connect & Book
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Reviews & Ratings Section */}
                        <div className="border-t border-jade-100 pt-6 space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-bold uppercase tracking-wider text-jade-700 flex items-center gap-2">
                                    <FaCommentAlt className="text-jade-600" /> Attendee Reviews & Ratings
                                </h3>
                                <span className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                                    Average: {event.averageRating || 4.8} / 5★
                                </span>
                            </div>

                            {/* Write Review Form */}
                            <form onSubmit={handleReviewSubmit} className="bg-jade-50/60 p-5 rounded-2xl border border-jade-100 space-y-3">
                                <h4 className="text-xs font-extrabold text-jade-950 uppercase tracking-wider">Write a Review for this Event</h4>
                                <div className="flex items-center gap-3">
                                    <span className="text-xs font-bold text-gray-500">Your Rating:</span>
                                    <div className="flex items-center gap-1 text-amber-400 text-lg">
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setNewRating(star)}
                                                className={`transition ${star <= newRating ? 'opacity-100 scale-110' : 'opacity-30'}`}
                                            >
                                                <FaStar />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <textarea
                                    required
                                    rows="2"
                                    placeholder="Share your experience, vibe, and thoughts about this venue..."
                                    className="w-full border border-jade-200 p-3 rounded-xl text-xs focus:ring-2 focus:ring-jade-500 outline-none"
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                />

                                <button
                                    type="submit"
                                    disabled={reviewSubmitting}
                                    className="bg-gradient-to-r from-jade-600 to-jade-700 hover:from-jade-700 hover:to-jade-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-sm transition flex items-center gap-2"
                                >
                                    <FaPaperPlane /> {reviewSubmitting ? 'Posting Review...' : 'Submit Review'}
                                </button>
                            </form>

                            {/* Reviews Feed */}
                            <div className="space-y-4">
                                {reviews.length === 0 ? (
                                    <p className="text-xs text-gray-400 italic">No reviews posted yet. Be the first to share your thoughts!</p>
                                ) : (
                                    reviews.map((rev) => (
                                        <div key={rev._id} className="bg-white p-4 rounded-2xl border border-jade-100 shadow-sm space-y-2">
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-7 h-7 rounded-full bg-jade-700 text-white flex items-center justify-center font-bold text-xs uppercase">
                                                        {rev.userId?.name?.charAt(0) || 'U'}
                                                    </div>
                                                    <span className="font-bold text-xs text-jade-950">{rev.userId?.name || 'Verified User'}</span>
                                                </div>
                                                <div className="flex items-center text-amber-400 text-xs font-bold">
                                                    <FaStar className="mr-1" /> {rev.rating}/5
                                                </div>
                                            </div>
                                            <p className="text-xs text-gray-600 leading-relaxed font-light">{rev.comment}</p>
                                            <p className="text-[10px] text-gray-400">{new Date(rev.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Booking Ticket Panel */}
                    <div className="bg-jade-50/80 p-6 rounded-2xl border border-jade-100 flex flex-col justify-between shadow-sm h-fit sticky top-24">
                        <div>
                            <h3 className="text-xl font-bold font-display text-jade-950 mb-6">Reservation Pass</h3>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between items-center pb-3 border-b border-jade-200/60">
                                    <span className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                                        <FaMoneyBillWave className="text-jade-600" /> Price
                                    </span>
                                    <span className="font-extrabold text-xl text-jade-950">
                                        {event.ticketPrice === 0 ? <span className="text-jade-600">FREE</span> : `₹${event.ticketPrice}`}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center pb-3 border-b border-jade-200/60">
                                    <span className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                                        <FaChair className="text-jade-600" /> Available Seats
                                    </span>
                                    <span className={`font-bold text-sm ${event.availableSeats < 10 ? 'text-red-500 font-extrabold' : 'text-gray-800'}`}>
                                        {event.availableSeats} of {event.totalSeats}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center pb-3 border-b border-jade-200/60">
                                    <span className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                                        <FaCalendarAlt className="text-jade-600" /> Date
                                    </span>
                                    <span className="font-bold text-xs text-gray-800">
                                        {new Date(event.date).toLocaleDateString()}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center pb-3 border-b border-jade-200/60">
                                    <span className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                                        <FaMapMarkerAlt className="text-jade-600" /> Location
                                    </span>
                                    <span className="font-bold text-xs text-gray-800 line-clamp-1">
                                        {event.location}
                                    </span>
                                </div>
                            </div>

                            {/* OTP & UPI Payment Form Block */}
                            {showOTP && (
                                <div className="mb-6 bg-white p-4 sm:p-5 rounded-2xl border border-jade-200 shadow-md space-y-4 animate-fadeIn">
                                    {/* If Paid Event, show Real UPI QR Code & UTR input */}
                                    {event.ticketPrice > 0 && (
                                        <div className="bg-gradient-to-b from-jade-50 to-white p-4 rounded-xl border border-jade-200 text-center space-y-3">
                                            <div className="flex items-center justify-center gap-1.5 text-jade-950 font-bold text-xs">
                                                <FaQrcode className="text-jade-600 text-base" />
                                                <span className="uppercase tracking-wider">UPI Payment Gateway</span>
                                            </div>

                                            {/* Real Scannable UPI QR Image */}
                                            <div className="bg-white p-2.5 rounded-xl inline-block border-2 border-jade-400 shadow-sm">
                                                <img
                                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(`upi://pay?pa=eventora.tickets@okicici&pn=Eventora%20Tickets&am=${event.ticketPrice}&cu=INR`)}`}
                                                    alt="Scan UPI QR Code to Pay"
                                                    className="w-36 h-36 rounded-lg object-contain mx-auto"
                                                />
                                                <p className="text-[10px] font-extrabold text-jade-900 mt-1">
                                                    Scan to pay ₹{event.ticketPrice} via GPay / PhonePe
                                                </p>
                                            </div>

                                            {/* 1-Tap Mobile UPI App Launcher */}
                                            <a
                                                href={`upi://pay?pa=eventora.tickets@okicici&pn=Eventora%20Tickets&am=${event.ticketPrice}&cu=INR`}
                                                className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md transition"
                                            >
                                                <FaMobileAlt /> Pay ₹{event.ticketPrice} via UPI App
                                            </a>

                                            {/* Copy UPI ID */}
                                            <div className="flex items-center justify-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-jade-300 max-w-xs mx-auto">
                                                <span className="font-mono text-[11px] font-extrabold text-jade-950">eventora.tickets@okicici</span>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        navigator.clipboard.writeText('eventora.tickets@okicici');
                                                        setCopiedUpi(true);
                                                        setTimeout(() => setCopiedUpi(false), 2000);
                                                    }}
                                                    className="text-jade-700 hover:text-jade-950 font-bold text-[11px] flex items-center gap-1 bg-jade-50 px-2 py-0.5 rounded border border-jade-200"
                                                >
                                                    <FaCopy /> {copiedUpi ? 'Copied!' : 'Copy'}
                                                </button>
                                            </div>

                                            {/* UTR Input */}
                                            <div className="text-left pt-2 border-t border-jade-200">
                                                <label className="block text-[11px] font-extrabold text-jade-950 uppercase mb-1">Enter UPI Transaction / UTR Ref No.</label>
                                                <input
                                                    type="text"
                                                    required
                                                    placeholder="e.g. 329182910291"
                                                    className="w-full px-3 py-2 rounded-lg border border-jade-300 text-xs font-mono font-bold focus:ring-2 focus:ring-jade-500"
                                                    value={utrNumber}
                                                    onChange={(e) => setUtrNumber(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* 6-Digit OTP Code Section */}
                                    <div>
                                        <div className="flex justify-between items-center mb-1.5">
                                            <label className="text-xs font-extrabold text-jade-950 uppercase">6-Digit OTP Code</label>
                                            <span className="text-xs font-mono font-bold text-amber-600">{formatTimer(otpTimer)}</span>
                                        </div>
                                        <input
                                            type="text"
                                            required
                                            placeholder="123456"
                                            className="w-full px-4 py-3 rounded-lg border border-jade-300 focus:ring-2 focus:ring-jade-500 font-mono tracking-widest text-center text-xl font-extrabold"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                            maxLength="6"
                                        />
                                        <p className="text-[11px] text-gray-400 mt-1.5 text-center">Enter 6-digit code shown in toast/email.</p>
                                    </div>
                                </div>
                            )}

                            {isBooked && (
                                <div className="mb-6 bg-jade-100 text-jade-900 p-4 rounded-xl border border-jade-300 text-center font-bold text-sm flex flex-col items-center gap-2">
                                    <FaCheckCircle className="text-jade-600 text-2xl" />
                                    <span>Request Submitted!</span>
                                    <button
                                        onClick={() => navigate('/dashboard')}
                                        className="text-xs text-jade-800 underline hover:text-jade-950 font-bold mt-1"
                                    >
                                        Go to My Bookings Dashboard
                                    </button>
                                </div>
                            )}
                        </div>

                        {!isBooked && (
                            <button
                                onClick={handleBooking}
                                disabled={isSoldOut || bookingLoading || (showOTP && !otp)}
                                className={`w-full py-4 px-6 rounded-xl font-bold text-base transition shadow-lg ${
                                    isSoldOut
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-jade-600 to-jade-700 hover:from-jade-700 hover:to-jade-800 text-white shadow-jade-600/20 hover:-translate-y-0.5'
                                }`}
                            >
                                {bookingLoading
                                    ? 'Processing...'
                                    : showOTP
                                    ? 'Verify OTP & Confirm Request'
                                    : isSoldOut
                                    ? 'Sold Out'
                                    : 'Reserve Ticket Now'}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Guide Contact Modal */}
            {selectedGuide && (
                <GuideConnectModal
                    guide={selectedGuide}
                    onClose={() => setSelectedGuide(null)}
                />
            )}
        </div>
    );
};

export default EventDetail;
