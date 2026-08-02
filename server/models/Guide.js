const mongoose = require('mongoose');

const guideReviewSchema = new mongoose.Schema({
    clientName: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    date: { type: Date, default: Date.now }
});

const guideSchema = new mongoose.Schema({
    name: { type: String, required: true },
    title: { type: String, required: true },
    bio: { type: String, required: true },
    city: { type: String, required: true },
    languages: [{ type: String }],
    rating: { type: Number, default: 4.9 },
    totalReviews: { type: Number, default: 12 },
    hourlyRate: { type: Number, required: true },
    contactEmail: { type: String, required: true },
    phone: { type: String, required: true },
    whatsapp: { type: String, required: true },
    upiId: { type: String, required: true },
    image: { type: String },
    specialties: [{ type: String }],
    experienceYears: { type: Number, default: 5 },
    completedEventsCount: { type: Number, default: 35 },
    reviews: [guideReviewSchema]
}, { timestamps: true });

module.exports = mongoose.model('Guide', guideSchema);
