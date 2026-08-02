# Eventora - World-Class Full-Stack Event Booking & Discovery Platform 🚀

[![Repository](https://img.shields.io/badge/GitHub-navsharma26%2Fventora--MERN-064e3b?style=for-the-badge&logo=github)](https://github.com/navsharma26/ventora-MERN)

Eventora is a production-grade MERN platform for browsing, booking, and hosting world-class tech conferences, concerts, and summits. Built with React, Tailwind CSS, Node.js, Express, and MongoDB.

---

## ✨ Features Highlight

- 📍 **Real-Time Interactive Maps**: Powered by OpenStreetMap & Leaflet JS with venue coordinates, marker pins, popups, and real-time user GPS tracking.
- 🎯 **"Near Me" Geolocation Filter**: Instant GPS detection calculating distance (km) to nearby events.
- 🤖 **AI Smart Place & Event Recommender**: Intelligent recommendation engine matching budget, category, and real-time location with AI rationale explanations.
- 🧭 **Local Tourist & Event Guide Network**: Connect with verified local guides for venue tours, VIP concierges, and city highlights.
- ⭐ **Review & Rating System**: 1-5 star ratings, attendee comments, and automatic average rating recalculation.
- 🎫 **Digital Ticket Pass & Scannable QR**: Instant viewable and printable pass complete with custom verification QR code for confirmed bookings.
- 🔐 **2FA OTP Authentication**: Cryptographically secure 6-digit OTP verification for user registration and ticket reservations.
- 👑 **Admin Operations Command Center**: Full CRUD event management (Create, Edit, Delete), booking queue processing (Confirm as Paid/Unpaid, Reject), and live revenue metrics.
- ⚡ **Atomic Seat Reservation**: Concurrency-safe seat reservation (`$inc` with `$gt: 0`) preventing overbooking under high traffic.

---

## 🛠️ Deployment Instructions

### 1. Backend Deployment (Render)
1. Log into [Render](https://render.com) and click **New > Web Service**.
2. Connect your GitHub repository: `https://github.com/navsharma26/ventora-MERN`.
3. Configure the Web Service:
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
4. Set Environment Variables in Render:
   ```env
   MONGO_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=supersecretjwtkey_eventora
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   PORT=5000
   NODE_ENV=production
   ```
5. Deploy Web Service and copy your live Render URL (e.g. `https://ventora-mern-backend.onrender.com`).

---

### 2. Frontend Deployment (Vercel)
1. Log into [Vercel](https://vercel.com) and click **Add New > Project**.
2. Import repository: `https://github.com/navsharma26/ventora-MERN`.
3. Configure Build Settings:
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (or `client`)
   - **Build Command**: `npm run build --prefix client`
   - **Output Directory**: `client/dist`
4. Set Environment Variables in Vercel:
   ```env
   VITE_API_URL=https://your-render-backend-url.onrender.com/api
   ```
5. Click **Deploy**.

---

## 💻 Local Development Setup

```bash
# Clone Repository
git clone https://github.com/navsharma26/ventora-MERN.git
cd ventora-MERN

# Install All Dependencies
npm install
npm run install:all

# Seed Database with Map Coordinates, Guides & Reviews
npm run seed --prefix server

# Run Frontend and Backend Concurrently
npm run dev
```

---

## 📁 Environment Variables Template

### Backend (`server/.env`):
```env
MONGO_URI=mongodb://localhost:27017/eventora
JWT_SECRET=supersecretjwtkey_eventora
EMAIL_USER=your_gmail_address@gmail.com
EMAIL_PASS=your_gmail_app_password
PORT=5000
```

### Frontend (`client/.env`):
```env
VITE_API_URL=http://localhost:5000/api
```
