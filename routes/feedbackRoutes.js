const express = require('express');
const {
  submitFeedback,
  getAllFeedbacks,
  getUserFeedbacks,
} = require('../controllers/feedbackController');

const router = express.Router();

router.post('/:uid/feedback', submitFeedback); // Submit feedback
router.get('/feedbacks', getAllFeedbacks); // Fetch all feedbacks
router.get('/:uid/feedbacks', getUserFeedbacks); // Fetch feedbacks by user

module.exports = router;
