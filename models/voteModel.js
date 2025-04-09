const db = require('../config/db');

const Vote = {
  // Check if a user has already voted
  hasVoted: (userId, callback) => {
    db.query('SELECT * FROM votes WHERE user_id = ?', [userId], (err, results) => {
      callback(err, results);
    });
  },

  // Record a new vote
  recordVote: (userId, partyId, callback) => {
    db.query(
      'INSERT INTO votes (user_id, party_id) VALUES (?, ?)',
      [userId, partyId],
      (err, results) => {
        callback(err, results);
      }
    );
  }
};

module.exports = Vote;
