const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendBookingEmail = async (userEmail, userName, eventTitle) => {
    try {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.log(`[DEV MODE] Booking Confirmation Email for ${userEmail}: Event "${eventTitle}" confirmed for ${userName}.`);
            return;
        }
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: userEmail,
            subject: `Booking Confirmed: ${eventTitle}`,
            html: `
        <h2>Hi ${userName}!</h2>
        <p>Your booking for the event <strong>${eventTitle}</strong> is successfully confirmed.</p>
        <p>Thank you for choosing Eventora.</p>
      `
        };
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully to', userEmail);
    } catch (error) {
        console.error('Error sending email (falling back to console):', error.message);
        console.log(`[DEV FALLBACK] Booking Confirmation Email for ${userEmail}: Event "${eventTitle}" confirmed for ${userName}.`);
    }
};

const sendOTPEmail = async (userEmail, otp, type) => {
    const title = type === 'account_verification' ? 'Verify your Eventora Account' : 'Eventora Booking Verification';
    const msg = type === 'account_verification'
        ? 'Please use the following OTP to verify your new Eventora account.'
        : 'Please use the following OTP to verify and confirm your event booking.';

    console.log(`\n==================================================`);
    console.log(`🔑 [EVENTORA OTP CODE] -> ${otp}`);
    console.log(`📧 Target Email: ${userEmail} (${type})`);
    console.log(`==================================================\n`);

    try {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.log(`[DEV MODE] SMTP not configured. OTP [${otp}] logged to console above.`);
            return;
        }

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: userEmail,
            subject: title,
            html: `
                <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
                    <h2 style="color: #111;">${title}</h2>
                    <p style="color: #555; font-size: 16px;">${msg}</p>
                    <div style="margin: 20px auto; padding: 15px; font-size: 24px; font-weight: bold; background: #f4f4f4; width: max-content; letter-spacing: 5px;">
                        ${otp}
                    </div>
                    <p style="color: #999; font-size: 12px;">This code expires in 5 minutes. If you didn't request this, please ignore this email.</p>
                </div>
            `
        };
        await transporter.sendMail(mailOptions);
        console.log(`OTP sent to ${userEmail} for ${type}`);
    } catch (error) {
        console.error('Error sending OTP email via SMTP:', error.message);
        console.log(`[DEV FALLBACK] OTP for ${userEmail} is: ${otp}`);
    }
};

module.exports = { sendBookingEmail, sendOTPEmail };
