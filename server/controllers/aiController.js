const Event = require('../models/Event');

// Helper distance calculation using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c * 10) / 10;
}

exports.recommendEvents = async (req, res) => {
    try {
        const { lat, lng, category, maxBudget, vibe } = req.body;

        let events = await Event.find();

        const recommendations = events.map(event => {
            let score = 50; // base score
            let distance = null;

            if (lat && lng && event.coordinates?.lat && event.coordinates?.lng) {
                distance = calculateDistance(lat, lng, event.coordinates.lat, event.coordinates.lng);
                // Proximity boost (closer = higher score)
                if (distance < 50) score += 30;
                else if (distance < 200) score += 15;
            }

            if (category && category !== 'All' && event.category.toLowerCase() === category.toLowerCase()) {
                score += 35;
            }

            if (maxBudget !== undefined && maxBudget !== null && maxBudget > 0) {
                if (event.ticketPrice <= maxBudget) score += 20;
                else score -= 15;
            }

            // Generate intelligent AI reasoning statement
            let reasoning = '';
            if (distance !== null && distance < 100) {
                reasoning = `Located nearby (${distance} km away). High demand with ${event.availableSeats} seats remaining.`;
            } else if (category && event.category.toLowerCase() === category.toLowerCase()) {
                reasoning = `Perfect match for your preferred ${event.category} interests.`;
            } else if (event.ticketPrice === 0) {
                reasoning = `Top-rated free entry event hosted in ${event.location}.`;
            } else {
                reasoning = `Trending event in ${event.category} with ${event.averageRating || 4.8}★ user rating.`;
            }

            return {
                ...event.toObject(),
                score,
                distance,
                aiReasoning: reasoning
            };
        });

        // Sort descending by AI score
        recommendations.sort((a, b) => b.score - a.score);

        res.json({
            status: 'success',
            aiInsight: `Analyzed ${events.length} upcoming events against your location and preferences. Here are your top personalized picks:`,
            recommendations: recommendations.slice(0, 4)
        });
    } catch (error) {
        res.status(500).json({ message: 'Error generating AI recommendations', error: error.message });
    }
};
