const Review = require('../models/Review');
const Event = require('../models/Event');

exports.addReview = async (req, res) => {
    try {
        const { eventId, rating, comment } = req.body;
        const userId = req.user.id;

        const event = await Event.findById(eventId);
        if (!event) return res.status(404).json({ message: 'Event not found' });

        // Check if user already reviewed
        const existing = await Review.findOne({ userId, eventId });
        if (existing) {
            existing.rating = rating;
            existing.comment = comment;
            await existing.save();
        } else {
            await Review.create({ userId, eventId, rating, comment });
        }

        // Recalculate average rating for event
        const allReviews = await Review.find({ eventId });
        const avg = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

        event.averageRating = Number(avg.toFixed(1));
        event.totalReviews = allReviews.length;
        await event.save();

        res.status(201).json({
            message: 'Review saved successfully!',
            averageRating: event.averageRating,
            totalReviews: event.totalReviews
        });
    } catch (error) {
        res.status(500).json({ message: 'Error submitting review', error: error.message });
    }
};

exports.getEventReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ eventId: req.params.eventId })
            .populate('userId', 'name email')
            .sort({ createdAt: -1 });
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching reviews', error: error.message });
    }
};
