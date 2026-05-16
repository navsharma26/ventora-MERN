import React from 'react';
import { Link } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';

const PaymentSuccess = () => {
    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
            <div className="bg-white p-10 rounded-3xl shadow-2xl shadow-jade-200/40 max-w-md w-full text-center border-t-8 border-jade-500 transform transition-all hover:-translate-y-1 ring-1 ring-jade-100">
                <FaCheckCircle className="text-jade-500 text-7xl mx-auto mb-6 drop-shadow-sm" />
                <h1 className="text-4xl font-black text-jade-950 mb-4">Booking Confirmed!</h1>
                <p className="text-gray-500 mb-8 text-lg">Your ticket has been booked successfully. A confirmation email has been sent to your registered email address.</p>
                <div className="space-y-4">
                    <Link to="/dashboard" className="block w-full bg-gradient-to-r from-jade-600 to-jade-700 hover:from-jade-700 hover:to-jade-800 text-white font-bold py-4 px-6 rounded-xl transition shadow-lg shadow-jade-300/40 hover:shadow-xl">
                        View My Tickets
                    </Link>
                    <Link to="/" className="block w-full bg-jade-50 hover:bg-jade-100 text-jade-900 font-bold py-4 px-6 rounded-xl transition border border-jade-100">
                        Discover More Events
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccess;
