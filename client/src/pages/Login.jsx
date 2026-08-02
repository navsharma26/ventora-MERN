import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import Toast from '../components/Toast';
import { FaTicketAlt, FaLock, FaEnvelope, FaKey } from 'react-icons/fa';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [showOTP, setShowOTP] = useState(false);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({ message: '', type: 'info' });

    const { login, verifyOTP } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (!showOTP) {
                const data = await login(email, password);
                if (data.role === 'admin') navigate('/admin');
                else navigate('/dashboard');
            } else {
                const data = await verifyOTP(email, otp);
                if (data.role === 'admin') navigate('/admin');
                else navigate('/dashboard');
            }
        } catch (err) {
            if (err.needsVerification) {
                setShowOTP(true);
                setToast({ message: 'Account unverified. A 6-digit OTP code has been dispatched.', type: 'warning' });
            } else {
                setToast({ message: err.message || err, type: 'error' });
            }
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
                    <h2 className="text-3xl font-black font-display text-jade-950 mb-2">Welcome Back</h2>
                    <p className="text-gray-500 text-sm">Sign in to manage your bookings and passes</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {!showOTP ? (
                        <>
                            <div>
                                <label className="block text-xs font-bold text-gray-600 uppercase mb-2">Email Address</label>
                                <div className="relative flex items-center">
                                    <FaEnvelope className="absolute left-4 text-jade-600" />
                                    <input
                                        type="email"
                                        required
                                        placeholder="you@example.com"
                                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-jade-200 focus:ring-2 focus:ring-jade-500 focus:border-jade-500 text-sm transition font-medium"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-600 uppercase mb-2">Password</label>
                                <div className="relative flex items-center">
                                    <FaLock className="absolute left-4 text-jade-600" />
                                    <input
                                        type="password"
                                        required
                                        placeholder="••••••••"
                                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-jade-200 focus:ring-2 focus:ring-jade-500 focus:border-jade-500 text-sm transition font-medium"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>
                        </>
                    ) : (
                        <div>
                            <label className="block text-xs font-bold text-gray-600 uppercase mb-2">Verification Code (OTP)</label>
                            <div className="relative flex items-center">
                                <FaKey className="absolute left-4 text-jade-600" />
                                <input
                                    type="text"
                                    required
                                    placeholder="6-digit OTP code"
                                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-jade-200 focus:ring-2 focus:ring-jade-500 font-mono tracking-widest text-center text-lg font-bold"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    maxLength="6"
                                />
                            </div>
                            <p className="text-[11px] text-gray-400 mt-2 text-center">Check your inbox or dev console for the code.</p>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-jade-600 to-jade-700 hover:from-jade-700 hover:to-jade-800 text-white font-bold py-3.5 rounded-xl transition shadow-lg shadow-jade-600/20 text-sm mt-2"
                    >
                        {loading ? 'Authenticating...' : (showOTP ? 'Verify OTP & Continue' : 'Sign In')}
                    </button>
                </form>

                <p className="text-center mt-8 text-xs text-gray-500">
                    Don't have an account? <Link to="/register" className="text-jade-700 font-bold hover:text-jade-950 hover:underline">Create Account</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
