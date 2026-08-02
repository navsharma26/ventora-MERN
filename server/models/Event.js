const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    category: { type: String, required: true },
    totalSeats: { type: Number, required: true },
    availableSeats: { type: Number, required: true },
    image: { type: String },
    ticketPrice: { type: Number, required: true, default: 0 },
    coordinates: {
        lat: { type: Number, default: 37.7749 },
        lng: { type: Number, default: -122.4194 }
    },
    averageRating: { type: Number, default: 4.5 },
    totalReviews: { type: Number, default: 0 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
