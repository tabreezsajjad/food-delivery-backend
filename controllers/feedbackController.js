const Feedback = require('../models/feedbackModel');
const User = require('../models/userModel');

// Submit Feedback and Link it to the User
const submitFeedback = async (req, res) => {
  const { uid } = req.params;
  const { feedback } = req.body;

  console.log('Received feedback:', feedback);

  if (!feedback || !feedback.orderId || !feedback.restaurantId) {
    console.error('Missing required fields:', feedback);
    return res.status(400).json({ error: 'Missing required fields: orderId or restaurantId' });
  }

  try {
    const user = await User.findOne({ uid });
    if (!user) {
      console.error(`User not found for UID: ${uid}`);
      return res.status(404).json({ error: 'User not found' });
    }

    feedback.dishes.forEach((dish, index) => {
      if (!dish.name || typeof dish.name !== 'string') {
        throw new Error(`Invalid dish name at index ${index}`);
      }
      if (typeof dish.rating !== 'number') {
        throw new Error(`Invalid dish rating at index ${index}`);
      }
    });

    // Save feedback in the User collection
    user.feedbacks.push(feedback);
    await user.save();

    // Save feedback as a standalone document in the Feedback collection
    const newFeedback = new Feedback(feedback);
    await newFeedback.save();

    console.log('Feedback saved successfully in both collections:', feedback);
    res.status(201).json({ message: 'Feedback submitted successfully' });
  } catch (error) {
    console.error('Error submitting feedback:', error.message, error.stack);
    res.status(500).json({ error: 'Failed to submit feedback.', details: error.message });
  }
};

// Fetch All Feedbacks
const getAllFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find(); // Fetch all feedbacks
    res.status(200).json(feedbacks);
  } catch (error) {
    console.error('Error fetching feedbacks:', error);
    res.status(500).json({ error: 'Failed to fetch feedbacks' });
  }
};

// Fetch Feedbacks by User
const getUserFeedbacks = async (req, res) => {
  const { uid } = req.params;

  try {
    const feedbacks = await Feedback.find({ userId: uid }); // Filter feedback by user ID
    res.status(200).json(feedbacks);
  } catch (error) {
    console.error('Error fetching feedbacks for user:', error);
    res.status(500).json({ error: 'Failed to fetch feedbacks' });
  }
};

module.exports = {
  submitFeedback,
  getAllFeedbacks,
  getUserFeedbacks,
};
