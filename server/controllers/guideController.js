const Guide = require('../models/Guide');

exports.getGuides = async (req, res) => {
    try {
        const { city } = req.query;
        const query = {};
        if (city) {
            query.city = { $regex: city, $options: 'i' };
        }
        let guides = await Guide.find(query);
        // Fallback: if no guide found for specific city, return top recommended guides
        if (guides.length === 0) {
            guides = await Guide.find().limit(6);
        }
        res.json(guides);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching guides', error: error.message });
    }
};

exports.getGuideById = async (req, res) => {
    try {
        const guide = await Guide.findById(req.params.id);
        if (!guide) return res.status(404).json({ message: 'Guide not found' });
        res.json(guide);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching guide details', error: error.message });
    }
};
