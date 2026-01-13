const express = require('express');
const router = express.Router();
const { castMonthlyVote, giveFeedback, voteReplacement, getMenu } = require('../controllers/studentController');
const auth = require('../middleware/authMiddleware');

router.post('/vote-monthly', auth, castMonthlyVote);
router.post('/feedback', auth, giveFeedback);
router.post('/vote-replacement', auth, voteReplacement);
router.get('/menu', auth, getMenu);

module.exports = router;
