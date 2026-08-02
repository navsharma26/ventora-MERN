const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, trim: true },
}, { timestamps: true });

// Prevent duplicate reviews from the same user for the same event
reviewSchema.index({ userId: 1, eventId: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
