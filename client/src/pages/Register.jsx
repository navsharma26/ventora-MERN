import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import Toast from '../components/Toast';
import { FaTicketAlt, FaUser, FaEnvelope, FaLock, FaKey } from 'react-icons/fa';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [showOTP, setShowOTP] = useState(false);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({ message: '', type: 'info' });

    const { register, verifyOTP } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await register(name, email, password);
            navigate('/dashboard');
        } catch (err) {
            setToast({ message: typeof err === 'string' ? err : err.message || 'Registration failed', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto my-12 animate-fadeIn">
            <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'info' })} />

            <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-xl shadow-jade-200/40 border border-jade-100 ring-1 ring-jade-100">
                <div className="text-center mb-8">
                    <div className="w-14 h-14 bg-gradient-to-tr from-jade-500 to-emerald-400 text-jade-950 rounded-2xl flex items-center justify-center text-2xl font-black mx-auto mb-4 shadow-lg shadow-jade-400/20">
                        <FaTicketAlt />
                    </div>
                    <h2 className="text-3xl font-black font-display text-jade-950 mb-2">Create Account</h2>
                    <p className="text-gray-500 text-sm">Join Eventora to explore & reserve tickets</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {!showOTP ? (
                        <>
                            <div>
                                <label className="block text-xs font-bold text-gray-600 uppercase mb-1.5">Full Name</label>
                                <div className="relative flex items-center">
                                    <FaUser className="absolute left-4 text-jade-600 text-sm" />
                                    <input
                                        type="text"
                                        required
                                        placeholder="Jane Doe"
                                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-jade-200 focus:ring-2 focus:ring-jade-500 focus:border-jade-500 text-sm transition font-medium"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-600 uppercase mb-1.5">Email Address</label>
                                <div className="relative flex items-center">
                                    <FaEnvelope className="absolute left-4 text-jade-600 text-sm" />
                                    <input
                                        type="email"
                                        required
                                        placeholder="jane@example.com"
                                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-jade-200 focus:ring-2 focus:ring-jade-500 focus:border-jade-500 text-sm transition font-medium"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-600 uppercase mb-1.5">Password</label>
                                <div className="relative flex items-center">
                                    <FaLock className="absolute left-4 text-jade-600 text-sm" />
                                    <input
                                        type="password"
                                        required
                                        placeholder="Minimum 6 characters"
                                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-jade-200 focus:ring-2 focus:ring-jade-500 focus:border-jade-500 text-sm transition font-medium"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>
                        </>
                    ) : (
                        <div>
                            <div className="bg-jade-50 border border-jade-200 p-4 rounded-2xl mb-4 text-center">
                                <p className="text-xs font-bold text-jade-900 mb-1">OTP Sent!</p>
                                <p className="text-xs text-gray-500">Enter the code sent to {email}</p>
                            </div>

                            <label className="block text-xs font-bold text-gray-600 uppercase mb-2">Verification Code (OTP)</label>
                            <div className="relative flex items-center">
                                <FaKey className="absolute left-4 text-jade-600" />
                                <input
                                    type="text"
                                    required
                                    placeholder="6-digit code"
                                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-jade-200 focus:ring-2 focus:ring-jade-500 font-mono tracking-widest text-center text-lg font-bold"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    maxLength="6"
                                />
                            </div>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-jade-600 to-jade-700 hover:from-jade-700 hover:to-jade-800 text-white font-bold py-3.5 rounded-xl transition shadow-lg shadow-jade-600/20 text-sm mt-3"
                    >
                        {loading ? 'Processing...' : (showOTP ? 'Verify OTP & Complete Setup' : 'Create Account')}
                    </button>
                </form>

                {!showOTP && (
                    <p className="text-center mt-8 text-xs text-gray-500">
                        Already have an account? <Link to="/login" className="text-jade-700 font-bold hover:text-jade-950 hover:underline">Sign In</Link>
                    </p>
                )}
            </div>
        </div>
    );
};

export default Register;
