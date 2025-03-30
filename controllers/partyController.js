const db = require('../config/db');

exports.getParties = (req, res) => {
    db.query('SELECT id, name, candidate_name, TO_BASE64(image) AS image FROM election_party', (err, results) => {
        if (err) return res.status(500).json({ message: 'Error fetching parties' });
        res.json(results);
    });
};
