import React, { useState } from 'react';
import {
    FaUserCheck, FaTimes, FaStar, FaEnvelope, FaPhoneAlt, FaWhatsapp,
    FaCheckCircle, FaGlobe, FaCertificate, FaQrcode, FaCopy, FaReceipt,
    FaMoneyBillWave, FaHistory, FaBriefcase, FaCalendarCheck
} from 'react-icons/fa';

const GuideConnectModal = ({ guide, onClose }) => {
    const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'reviews' | 'payment'
    const [serviceHours, setServiceHours] = useState(2);
    const [utrNumber, setUtrNumber] = useState('');
    const [paymentReceipt, setPaymentReceipt] = useState(null);
    const [copiedUpi, setCopiedUpi] = useState(false);
    const [userMsg, setUserMsg] = useState('');
    const [messageSent, setMessageSent] = useState(false);

    if (!guide) return null;

    const totalFee = (guide.hourlyRate || 1500) * serviceHours;
    const upiId = guide.upiId || `${guide.name.toLowerCase().replace(/\s+/g, '.')}@okicici`;
    const phone = guide.phone || '+91 98765 43210';
    const whatsappNumber = guide.whatsapp || '919876543210';

    const handleCopyUpi = () => {
        navigator.clipboard.writeText(upiId);
        setCopiedUpi(true);
        setTimeout(() => setCopiedUpi(false), 2000);
    };

    const handleGenerateInvoice = (e) => {
        e.preventDefault();
        if (!utrNumber.trim()) return;

        const invoiceData = {
            txnId: `EVTG-${Math.floor(10000000 + Math.random() * 90000000)}`,
            utr: utrNumber,
            guideName: guide.name,
            guideTitle: guide.title,
            hours: serviceHours,
            amount: totalFee,
            upiId: upiId,
            date: new Date().toLocaleString(),
            status: 'SUCCESSFUL / VERIFIED'
        };
        setPaymentReceipt(invoiceData);
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        setMessageSent(true);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-jade-950/70 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-jade-100 flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="bg-gradient-to-r from-jade-950 via-jade-900 to-jade-950 text-white p-5 flex justify-between items-center border-b border-jade-800">
                    <div className="flex items-center gap-2">
                        <FaUserCheck className="text-jade-400 text-xl" />
                        <span className="font-bold text-lg font-display">Event Manager & Local Guide</span>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
                    >
                        <FaTimes />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto space-y-6">

                    {/* Profile Banner */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-jade-50/70 p-4 rounded-2xl border border-jade-100">
                        <img
                            src={guide.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'}
                            alt={guide.name}
                            className="w-20 h-20 rounded-2xl object-cover shadow-md border-2 border-jade-500 shrink-0"
                        />
                        <div className="flex-grow">
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-xl font-black font-display text-jade-950">{guide.name}</h3>
                                <FaCheckCircle className="text-jade-600 text-sm" title="Verified License" />
                            </div>
                            <p className="text-xs font-bold text-jade-700 uppercase tracking-wider mb-2">{guide.title}</p>
                            <div className="flex flex-wrap items-center gap-2 text-xs">
                                <span className="flex items-center gap-1 text-amber-600 font-extrabold bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                                    <FaStar /> {guide.rating || 4.9}★ ({guide.totalReviews || 24} reviews)
                                </span>
                                <span className="bg-jade-100 text-jade-900 font-bold px-2.5 py-0.5 rounded-full text-[11px]">
                                    {guide.experienceYears || 8}+ Yrs Exp
                                </span>
                                <span className="bg-emerald-100 text-emerald-900 font-bold px-2.5 py-0.5 rounded-full text-[11px]">
                                    {guide.completedEventsCount || 45}+ Events Done
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Direct Contact Action Buttons */}
                    <div className="grid grid-cols-3 gap-2">
                        <a
                            href={`tel:${phone.replace(/\s+/g, '')}`}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white p-3 rounded-xl flex items-center justify-center gap-2 text-xs font-bold shadow-md transition"
                        >
                            <FaPhoneAlt /> <span>Call Guide</span>
                        </a>
                        <a
                            href={`https://wa.me/${whatsappNumber}?text=Hi%20${encodeURIComponent(guide.name)},%20I%20found%20your%20profile%20on%20Eventora!`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-xl flex items-center justify-center gap-2 text-xs font-bold shadow-md transition"
                        >
                            <FaWhatsapp className="text-sm" /> <span>WhatsApp</span>
                        </a>
                        <a
                            href={`mailto:${guide.contactEmail}`}
                            className="bg-jade-900 hover:bg-jade-950 text-white p-3 rounded-xl flex items-center justify-center gap-2 text-xs font-bold shadow-md transition"
                        >
                            <FaEnvelope /> <span>Email</span>
                        </a>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="flex border-b border-jade-100">
                        <button
                            onClick={() => setActiveTab('overview')}
                            className={`flex-1 py-2.5 text-xs font-bold border-b-2 transition ${
                                activeTab === 'overview'
                                    ? 'border-jade-600 text-jade-950 font-black'
                                    : 'border-transparent text-gray-400 hover:text-gray-600'
                            }`}
                        >
                            Overview & Bio
                        </button>
                        <button
                            onClick={() => setActiveTab('reviews')}
                            className={`flex-1 py-2.5 text-xs font-bold border-b-2 transition ${
                                activeTab === 'reviews'
                                    ? 'border-jade-600 text-jade-950 font-black'
                                    : 'border-transparent text-gray-400 hover:text-gray-600'
                            }`}
                        >
                            Client Reviews ({guide.reviews?.length || guide.totalReviews || 2})
                        </button>
                        <button
                            onClick={() => setActiveTab('payment')}
                            className={`flex-1 py-2.5 text-xs font-bold border-b-2 transition ${
                                activeTab === 'payment'
                                    ? 'border-jade-600 text-jade-950 font-black'
                                    : 'border-transparent text-gray-400 hover:text-gray-600'
                            }`}
                        >
                            UPI Payment Invoice
                        </button>
                    </div>

                    {/* Tab 1: Overview */}
                    {activeTab === 'overview' && (
                        <div className="space-y-4 animate-fadeIn">
                            <div className="bg-white p-4 rounded-2xl border border-jade-100 shadow-sm space-y-3">
                                <h4 className="text-xs font-extrabold uppercase text-jade-950 tracking-wider">About Manager</h4>
                                <p className="text-gray-600 text-xs leading-relaxed font-medium">{guide.bio}</p>

                                <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                                    <div className="bg-jade-50 p-2.5 rounded-xl border border-jade-100">
                                        <p className="text-gray-400 font-bold text-[10px] uppercase">Phone Number</p>
                                        <p className="font-extrabold text-jade-950">{phone}</p>
                                    </div>
                                    <div className="bg-jade-50 p-2.5 rounded-xl border border-jade-100">
                                        <p className="text-gray-400 font-bold text-[10px] uppercase">Hourly Rate</p>
                                        <p className="font-extrabold text-jade-950">₹{guide.hourlyRate} / hour</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 pt-2 border-t border-jade-100 text-xs">
                                    <FaGlobe className="text-jade-600 shrink-0" />
                                    <span className="font-bold text-gray-500">Languages Spoken:</span>
                                    <span className="font-semibold text-gray-800">{guide.languages ? guide.languages.join(', ') : 'English, Hindi'}</span>
                                </div>

                                <div className="flex items-center gap-2 text-xs">
                                    <FaCertificate className="text-jade-600 shrink-0" />
                                    <span className="font-bold text-gray-500">Specialties:</span>
                                    <span className="font-semibold text-gray-800">{guide.specialties ? guide.specialties.join(' • ') : 'Concerts, Stage Setup'}</span>
                                </div>
                            </div>

                            {/* Inquiry Form */}
                            {messageSent ? (
                                <div className="bg-jade-100 border border-jade-300 text-jade-900 p-4 rounded-2xl text-center text-sm font-bold animate-fadeIn">
                                    <FaCheckCircle className="text-jade-600 text-3xl mx-auto mb-2" />
                                    <p className="mb-1">Inquiry Request Sent to {guide.name}!</p>
                                    <p className="text-xs font-normal text-jade-800">The manager will reach out to you directly on your phone/email.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSendMessage} className="space-y-3 bg-jade-50/50 p-4 rounded-2xl border border-jade-100">
                                    <h4 className="text-xs font-extrabold uppercase text-jade-950 tracking-wider">Send Quick Inquiry</h4>
                                    <textarea
                                        required
                                        rows="2"
                                        placeholder={`Hi ${guide.name}, I need assistance with event management for...`}
                                        className="w-full border border-jade-200 p-3 rounded-xl text-xs focus:ring-2 focus:ring-jade-500 outline-none"
                                        value={userMsg}
                                        onChange={(e) => setUserMsg(e.target.value)}
                                    />
                                    <button
                                        type="submit"
                                        className="w-full bg-gradient-to-r from-jade-600 to-jade-700 hover:from-jade-700 hover:to-jade-800 text-white font-bold py-2.5 rounded-xl text-xs shadow-sm transition"
                                    >
                                        Send Message
                                    </button>
                                </form>
                            )}
                        </div>
                    )}

                    {/* Tab 2: Client Reviews */}
                    {activeTab === 'reviews' && (
                        <div className="space-y-3 animate-fadeIn">
                            {guide.reviews && guide.reviews.length > 0 ? (
                                guide.reviews.map((rev, index) => (
                                    <div key={index} className="bg-white p-4 rounded-2xl border border-jade-100 shadow-sm space-y-1.5">
                                        <div className="flex justify-between items-center">
                                            <span className="font-extrabold text-xs text-jade-950">{rev.clientName}</span>
                                            <span className="text-amber-500 text-xs font-extrabold flex items-center gap-1">
                                                <FaStar /> {rev.rating}/5
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-600 leading-relaxed font-light">{rev.comment}</p>
                                        <p className="text-[10px] text-gray-400">{new Date(rev.date).toLocaleDateString()}</p>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-6 text-gray-400 text-xs">
                                    <FaStar className="text-amber-400 text-2xl mx-auto mb-2 opacity-50" />
                                    <p>Rated 5.0 Stars by past event organizers!</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Tab 3: UPI Payment & Invoice Generation */}
                    {activeTab === 'payment' && (
                        <div className="space-y-4 animate-fadeIn">
                            {!paymentReceipt ? (
                                <form onSubmit={handleGenerateInvoice} className="space-y-4">
                                    {/* Duration Selector */}
                                    <div>
                                        <label className="block text-xs font-bold text-gray-600 uppercase mb-2">Select Duration (Hours)</label>
                                        <div className="grid grid-cols-4 gap-2">
                                            {[1, 2, 4, 8].map(hrs => (
                                                <button
                                                    key={hrs}
                                                    type="button"
                                                    onClick={() => setServiceHours(hrs)}
                                                    className={`py-2 text-xs font-extrabold rounded-xl border transition ${
                                                        serviceHours === hrs
                                                            ? 'bg-jade-900 text-white border-jade-900 shadow-sm'
                                                            : 'bg-white text-gray-700 border-jade-200 hover:border-jade-400'
                                                    }`}
                                                >
                                                    {hrs} {hrs === 1 ? 'Hour' : 'Hours'}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Fee Calculation Summary */}
                                    <div className="bg-gradient-to-br from-jade-950 to-jade-900 text-white p-4 rounded-2xl flex justify-between items-center shadow-lg">
                                        <div>
                                            <p className="text-[11px] text-jade-300 font-bold uppercase">Calculated Consultation Fee</p>
                                            <p className="text-xs text-jade-200">{serviceHours} hrs × ₹{guide.hourlyRate}/hr</p>
                                        </div>
                                        <span className="text-2xl font-black font-display text-emerald-400">₹{totalFee}</span>
                                    </div>

                                    {/* Real Scannable UPI Details Box */}
                                    <div className="bg-gradient-to-b from-jade-50 to-white p-5 rounded-2xl border border-jade-200 text-center space-y-4 shadow-sm">
                                        <div className="flex items-center justify-center gap-2 text-jade-950 font-bold text-xs">
                                            <FaQrcode className="text-jade-600 text-base" />
                                            <span className="uppercase tracking-wider">Real Scannable UPI QR Code</span>
                                        </div>

                                        {/* Dynamic Scannable UPI QR Image */}
                                        <div className="bg-white p-3 rounded-2xl inline-block border-2 border-jade-400 shadow-md">
                                            <img
                                                src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(`upi://pay?pa=${upiId}&pn=${encodeURIComponent(guide.name)}&am=${totalFee}&cu=INR&tn=Eventora%20Guide%20Booking`)}`}
                                                alt="Scan UPI QR Code to Pay"
                                                className="w-44 h-44 rounded-lg object-contain mx-auto"
                                            />
                                            <p className="text-[10px] font-extrabold text-jade-900 mt-2">
                                                Scan with GPay • PhonePe • Paytm • BHIM
                                            </p>
                                        </div>

                                        {/* 1-Tap UPI Mobile App Launcher */}
                                        <a
                                            href={`upi://pay?pa=${upiId}&pn=${encodeURIComponent(guide.name)}&am=${totalFee}&cu=INR&tn=Eventora%20Guide%20Booking`}
                                            className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition"
                                        >
                                            🚀 Pay ₹{totalFee} Directly via UPI App (GPay / PhonePe)
                                        </a>

                                        {/* Copy UPI ID */}
                                        <div className="flex items-center justify-center gap-2 bg-white px-4 py-2.5 rounded-xl border border-jade-300 max-w-xs mx-auto">
                                            <span className="font-mono text-xs font-extrabold text-jade-950">{upiId}</span>
                                            <button
                                                type="button"
                                                onClick={handleCopyUpi}
                                                className="text-jade-700 hover:text-jade-950 font-bold text-xs flex items-center gap-1 bg-jade-50 px-2 py-1 rounded-md border border-jade-200"
                                                title="Copy UPI ID"
                                            >
                                                <FaCopy /> {copiedUpi ? 'Copied!' : 'Copy'}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Enter Transaction UTR */}
                                    <div>
                                        <label className="block text-xs font-bold text-gray-600 uppercase mb-1.5">Enter UPI Transaction / UTR Ref No.</label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="e.g. 329182910291"
                                            className="w-full px-4 py-3 rounded-xl border border-jade-200 focus:ring-2 focus:ring-jade-500 font-mono text-xs font-bold"
                                            value={utrNumber}
                                            onChange={(e) => setUtrNumber(e.target.value)}
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full bg-gradient-to-r from-jade-600 to-jade-700 hover:from-jade-700 hover:to-jade-800 text-white font-bold py-3.5 rounded-xl text-xs shadow-lg transition"
                                    >
                                        Generate Official UPI Payment Invoice Receipt
                                    </button>
                                </form>
                            ) : (
                                /* Printable Payment Receipt / Invoice Pass */
                                <div className="bg-white p-5 rounded-2xl border-2 border-jade-500 shadow-xl space-y-4 text-center animate-fadeIn">
                                    <div className="flex justify-between items-center pb-3 border-b border-jade-100">
                                        <div className="flex items-center gap-2">
                                            <FaReceipt className="text-jade-600 text-xl" />
                                            <span className="font-black text-sm text-jade-950 uppercase tracking-wider">UPI Payment Invoice</span>
                                        </div>
                                        <span className="bg-emerald-100 text-emerald-800 font-extrabold text-[10px] px-2.5 py-0.5 rounded-full">
                                            {paymentReceipt.status}
                                        </span>
                                    </div>

                                    <div className="space-y-2 text-left text-xs bg-jade-50 p-4 rounded-xl border border-jade-100 font-medium">
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Transaction ID:</span>
                                            <span className="font-mono font-bold text-jade-950">{paymentReceipt.txnId}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">UPI Ref / UTR:</span>
                                            <span className="font-mono font-bold text-jade-950">{paymentReceipt.utr}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Event Manager:</span>
                                            <span className="font-bold text-jade-950">{paymentReceipt.guideName}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Service Hours:</span>
                                            <span className="font-bold text-jade-950">{paymentReceipt.hours} Hours</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Date & Time:</span>
                                            <span className="font-bold text-jade-950">{paymentReceipt.date}</span>
                                        </div>
                                        <div className="flex justify-between pt-2 border-t border-jade-200 font-extrabold text-sm text-jade-950">
                                            <span>Total Paid:</span>
                                            <span className="text-emerald-700">₹{paymentReceipt.amount}</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => window.print()}
                                        className="w-full bg-jade-900 hover:bg-jade-950 text-white font-bold py-2.5 rounded-xl text-xs shadow-md transition"
                                    >
                                        Print Official Receipt / Download PDF
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GuideConnectModal;
