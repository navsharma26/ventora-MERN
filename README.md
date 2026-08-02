# Eventora - World-Class Full-Stack Event Booking & Discovery Platform 🚀

[![Live Frontend Application](https://img.shields.io/badge/Vercel--Frontend-LIVE%20APP-10b981?style=for-the-badge&logo=vercel)](https://eventora-mern-nine.vercel.app)
[![Live Backend API Service](https://img.shields.io/badge/Render--Backend-LIVE%20API-059669?style=for-the-badge&logo=render)](https://eventora-backend-q3f8.onrender.com/api/health)
[![GitHub Repository](https://img.shields.io/badge/GitHub-navsharma26%2Fventora--MERN-064e3b?style=for-the-badge&logo=github)](https://github.com/navsharma26/ventora-MERN)

**Eventora** is a production-grade MERN (MongoDB, Express, React, Node.js) web application designed for discovering, reserving, and managing world-class tech conferences, music concerts, business summits, and cultural festivals.

---

## 🌐 Official Deployed Live Links

* 🌐 **Live Web Application**: **[https://eventora-mern-nine.vercel.app](https://eventora-mern-nine.vercel.app)**
* 🐙 **GitHub Repository**: **[https://github.com/navsharma26/ventora-MERN](https://github.com/navsharma26/ventora-MERN)**
* ⚡ **Live REST API Health Endpoint**: **[https://eventora-backend-q3f8.onrender.com/api/health](https://eventora-backend-q3f8.onrender.com/api/health)**

---

## ✨ Features Overview

### 💳 1. Real Scannable UPI Payment Gateway
- **Dynamic UPI QR Code Generator**: Generates real, high-resolution UPI QR Codes (`upi://pay?pa=...&pn=...&am=...&cu=INR`) for event tickets and guide bookings.
- **Scan with Any Smartphone App**: Compatible with **Google Pay, PhonePe, Paytm, BHIM, CRED, Amazon Pay**.
- **1-Tap Mobile UPI Launcher**: Mobile deep-link button that launches installed UPI apps directly.
- **UTR / Ref Transaction Tracking**: Users enter 12-digit UTR numbers to request verified ticket booking approval.
- **Printable UPI Payment Receipt**: Instant invoice generator with printable digital transaction passes.

### 🧭 2. Event Manager & Local Tourist Guide Network
- **Direct Call Button**: Click to initiate phone call (`tel:+919876543210`) with verified concierges.
- **Direct WhatsApp Chat**: 1-click WhatsApp launcher (`https://wa.me/...`) with pre-filled inquiry text.
- **Past Client Reviews & Star Ratings**: 1-5 star ratings, reviewer testimonials, and experience badges (`8+ Yrs Exp`, `52+ Events`).
- **Custom Fee Calculator**: Hourly rate calculator (`₹1,500/hr`) and invoice receipt generator.

### 📍 3. Real-Time Interactive Maps & Geolocation
- **OpenStreetMap & Leaflet Integration**: Live interactive map pins with popups for venue coordinates and attendee position.
- **"📍 Events Near Me" GPS Tracking**: Computes real-time Haversine distance (km) from the user's current GPS location.

### 🤖 4. AI Smart Event & Place Recommender
- **Intelligent Engine**: Ranks events by budget limits, category preferences, and user coordinates.
- **AI Rationale Statements**: Explains why an event is recommended for the user.

### 🎫 5. Digital Ticket Pass & Scannable QR Modal
- **Printable Ticket Pass**: Full printable view with event logistics, attendee details, and custom SVG verification QR code.

### 🔐 6. 2FA Security & Concurrency-Safe Booking
- **Cryptographic 2FA OTP Verification**: 6-digit OTP verification codes for user registration and ticket bookings.
- **Atomic Seat Reservation**: Prevents overbooking under high concurrency (`Event.findOneAndUpdate({ availableSeats: { $gt: 0 } }, { $inc: { availableSeats: -1 } })`).
- **Admin Command Center**: Full CRUD controls for creating, editing, and deleting events, approving bookings, and tracking revenue metrics.

---

## 🚀 REST API Endpoints

### Auth Routes (`/api/auth`)
- `POST /api/auth/register` - User registration & 2FA dispatch
- `POST /api/auth/login` - User login & JWT issue
- `POST /api/auth/verify-otp` - Verify 6-digit account OTP

### Event Routes (`/api/events`)
- `GET /api/events` - Fetch all events
- `GET /api/events/:id` - Fetch single event details
- `POST /api/events` - Create event (Admin)
- `PUT /api/events/:id` - Update event (Admin)
- `DELETE /api/events/:id` - Delete event (Admin)

### Booking Routes (`/api/bookings`)
- `POST /api/bookings/send-otp` - Dispatch booking OTP code
- `POST /api/bookings` - Submit ticket booking request with UTR ref
- `GET /api/bookings/my-bookings` - Fetch user ticket history
- `GET /api/bookings/admin/all` - Fetch all bookings (Admin)
- `PUT /api/bookings/:id/status` - Update booking approval status (Admin)

### Guide & AI Routes (`/api/guides`, `/api/ai`, `/api/reviews`)
- `GET /api/guides?city=...` - Fetch local guides & concierges
- `POST /api/ai/recommend` - AI event recommendation engine
- `POST /api/reviews` - Submit event attendee review
- `GET /api/reviews/event/:eventId` - Fetch event reviews feed

---

## 💻 Local Development Setup

```bash
# Clone Repository
git clone https://github.com/navsharma26/ventora-MERN.git
cd ventora-MERN

# Install All Dependencies
npm install
npm run install:all

# Seed MongoDB Atlas Database
npm run seed --prefix server

# Run Application (Frontend + Backend Concurrently)
npm run dev
```

---

## ⚙️ Environment Variables Setup

### Server (`server/.env`):
```env
MONGO_URI=mongodb+srv://navneet30405_db_user:1981@cluster0.1lbk3m1.mongodb.net/eventora?retryWrites=true&w=majority
JWT_SECRET=supersecretjwtkey_eventora
EMAIL_USER=your_gmail_address@gmail.com
EMAIL_PASS=your_gmail_app_password
PORT=5000
NODE_ENV=production
```

### Client (`client/.env`):
```env
VITE_API_URL=https://eventora-backend-q3f8.onrender.com/api
```
