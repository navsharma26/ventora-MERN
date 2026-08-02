const mongoose = require('mongoose');

const guideSchema = new mongoose.Schema({
    name: { type: String, required: true },
    title: { type: String, required: true },
    bio: { type: String, required: true },
    city: { type: String, required: true },
    languages: [{ type: String }],
    rating: { type: Number, default: 4.8 },
    hourlyRate: { type: Number, required: true },
    contactEmail: { type: String, required: true },
    phone: { type: String },
    image: { type: String },
    specialties: [{ type: String }],
    experienceYears: { type: Number, default: 5 }
}, { timestamps: true });

module.exports = mongoose.model('Guide', guideSchema);
