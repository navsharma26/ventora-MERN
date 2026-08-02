const express = require('express');
const router = express.Router();
const { recommendEvents } = require('../controllers/aiController');

router.post('/recommend', recommendEvents);

module.exports = router;
