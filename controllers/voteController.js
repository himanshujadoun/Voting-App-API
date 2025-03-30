const db = require('../config/db');

exports.vote = (req, res) => {
    const { userId, partyId } = req.body;

    db.query('SELECT * FROM votes WHERE user_id = ?', [userId], (err, results) => {
        if (err) return res.status(500).json({ message: 'Error checking vote status' });

        if (results.length > 0) return res.status(400).json({ message: 'You have already voted!' });

        db.query('INSERT INTO votes (user_id, party_id) VALUES (?, ?)', [userId, partyId], (err) => {
            if (err) return res.status(500).json({ message: 'Error recording vote' });
            res.json({ message: 'Vote recorded successfully!' });
        });
    });
};
