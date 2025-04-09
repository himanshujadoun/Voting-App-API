const Vote = require('../models/voteModel');

exports.vote = (req, res) => {
  const { userId, partyId } = req.body;

  if (!userId || !partyId) {
    return res.status(400).json({ message: 'Missing user ID or party ID' });
  }

  Vote.hasVoted(userId, (err, results) => {
    if (err) {
      console.error('Error checking vote status:', err);
      return res.status(500).json({ message: 'Error checking vote status' });
    }

    if (results.length > 0) {
      return res.status(400).json({ message: 'You have already voted!' });
    }

    Vote.recordVote(userId, partyId, (err) => {
      if (err) {
        console.error('Error recording vote:', err);
        return res.status(500).json({ message: 'Error recording vote' });
      }

      res.json({ message: 'Vote recorded successfully!' });
    });
  });
};
