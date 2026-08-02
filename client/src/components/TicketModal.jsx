import React from 'react';
import { FaTicketAlt, FaCalendarAlt, FaMapMarkerAlt, FaUser, FaTimes, FaPrint, FaQrcode, FaCheckCircle } from 'react-icons/fa';

const TicketModal = ({ booking, onClose }) => {
    if (!booking || !booking.eventId) return null;

    const event = booking.eventId;
    const ticketId = booking._id.toUpperCase();
    const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-jade-950/70 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-jade-100 flex flex-col max-h-[90vh]">
                {/* Header controls */}
                <div className="bg-gradient-to-r from-jade-950 via-jade-900 to-jade-950 text-white p-5 flex justify-between items-center border-b border-jade-800">
                    <div className="flex items-center gap-2">
                        <FaTicketAlt className="text-jade-400 text-xl" />
                        <span className="font-bold text-lg font-display tracking-wide">Eventora Digital Ticket Pass</span>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
                    >
                        <FaTimes />
                    </button>
                </div>

                {/* Printable Ticket Area */}
                <div id="printable-ticket" className="p-6 overflow-y-auto space-y-6">
                    {/* Event Banner Card */}
                    <div className="relative rounded-2xl overflow-hidden bg-jade-950 text-white p-6 shadow-lg">
                        {event.image ? (
                            <div
                                className="absolute inset-0 opacity-25 bg-cover bg-center"
                                style={{ backgroundImage: `url(${event.image})` }}
                            ></div>
                        ) : null}
                        <div className="relative z-10">
                            <span className="inline-block bg-jade-500/30 text-jade-200 border border-jade-400/30 text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3">
                                {event.category}
                            </span>
                            <h2 className="text-2xl font-black font-display text-white mb-2 leading-tight">
                                {event.title}
                            </h2>
                            <div className="flex items-center gap-2 text-jade-200 text-sm">
                                <FaCheckCircle className="text-jade-400" />
                                <span className="font-semibold uppercase tracking-wider text-xs">Confirmed Ticket</span>
                            </div>
                        </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-4 bg-jade-50/60 p-4 rounded-2xl border border-jade-100/80">
                        <div className="flex items-start gap-3">
                            <FaCalendarAlt className="text-jade-600 text-lg mt-0.5" />
                            <div>
                                <p className="text-[11px] font-bold uppercase text-gray-400">Date</p>
                                <p className="text-xs font-bold text-gray-800">{formattedDate}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <FaMapMarkerAlt className="text-jade-600 text-lg mt-0.5" />
                            <div>
                                <p className="text-[11px] font-bold uppercase text-gray-400">Location</p>
                                <p className="text-xs font-bold text-gray-800 line-clamp-1">{event.location}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <FaUser className="text-jade-600 text-lg mt-0.5" />
                            <div>
                                <p className="text-[11px] font-bold uppercase text-gray-400">Attendee</p>
                                <p className="text-xs font-bold text-gray-800">{booking.userId?.name || 'Ticket Holder'}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <FaTicketAlt className="text-jade-600 text-lg mt-0.5" />
                            <div>
                                <p className="text-[11px] font-bold uppercase text-gray-400">Pass Price</p>
                                <p className="text-xs font-bold text-jade-700">{booking.amount === 0 ? 'Free Entry' : `₹${booking.amount}`}</p>
                            </div>
                        </div>
                    </div>

                    {/* QR Code Section */}
                    <div className="border-2 border-dashed border-jade-200 rounded-2xl p-6 text-center bg-white flex flex-col items-center justify-center">
                        <p className="text-xs font-bold uppercase text-gray-400 tracking-wider mb-3 flex items-center gap-1">
                            <FaQrcode className="text-jade-600" /> Ticket Verification QR Code
                        </p>
                        
                        {/* Custom SVG QR Visual */}
                        <div className="w-36 h-36 bg-white p-2 border-4 border-jade-950 rounded-xl flex items-center justify-center shadow-inner mb-3">
                            <svg viewBox="0 0 100 100" className="w-full h-full">
                                {/* Corners */}
                                <rect x="5" y="5" width="25" height="25" fill="#022c22" />
                                <rect x="9" y="9" width="17" height="17" fill="#ffffff" />
                                <rect x="13" y="13" width="9" height="9" fill="#022c22" />

                                <rect x="70" y="5" width="25" height="25" fill="#022c22" />
                                <rect x="74" y="9" width="17" height="17" fill="#ffffff" />
                                <rect x="78" y="13" width="9" height="9" fill="#022c22" />

                                <rect x="5" y="70" width="25" height="25" fill="#022c22" />
                                <rect x="9" y="74" width="17" height="17" fill="#ffffff" />
                                <rect x="13" y="78" width="9" height="9" fill="#022c22" />

                                {/* Data pattern elements */}
                                <rect x="35" y="10" width="8" height="8" fill="#059669" />
                                <rect x="48" y="10" width="8" height="8" fill="#022c22" />
                                <rect x="10" y="40" width="8" height="8" fill="#022c22" />
                                <rect x="25" y="40" width="8" height="8" fill="#059669" />
                                <rect x="40" y="35" width="15" height="15" fill="#022c22" />
                                <rect x="65" y="40" width="10" height="10" fill="#059669" />
                                <rect x="80" y="45" width="10" height="10" fill="#022c22" />

                                <rect x="38" y="60" width="8" height="8" fill="#022c22" />
                                <rect x="50" y="55" width="12" height="12" fill="#059669" />
                                <rect x="70" y="70" width="8" height="8" fill="#022c22" />
                                <rect x="82" y="75" width="8" height="8" fill="#059669" />
                                <rect x="45" y="80" width="15" height="10" fill="#022c22" />
                            </svg>
                        </div>

                        <p className="font-mono text-xs font-bold text-gray-500 tracking-widest">
                            TICKET ID: {ticketId.substring(0, 14)}...
                        </p>
                    </div>
                </div>

                {/* Footer Action */}
                <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-bold text-sm hover:bg-gray-100 transition"
                    >
                        Close
                    </button>
                    <button
                        onClick={handlePrint}
                        className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-jade-600 to-jade-700 hover:from-jade-700 hover:to-jade-800 text-white font-bold text-sm shadow-md flex items-center gap-2 transition"
                    >
                        <FaPrint /> Print Ticket
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TicketModal;
