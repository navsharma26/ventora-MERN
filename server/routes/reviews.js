const express = require('express');
const router = express.Router();
const { addReview, getEventReviews } = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');

router.post('/', protect, addReview);
router.get('/event/:eventId', getEventReviews);

module.exports = router;
