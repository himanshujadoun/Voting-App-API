const db = require('../config/db'); // Assuming MySQL connection is exported from here

exports.findByEmail = (email, callback) => {
    db.query('SELECT * FROM unverified_users WHERE email = ?', [email], callback);
};

exports.findByToken = (token, callback) => {
    db.query('SELECT * FROM unverified_users WHERE verification_token = ?', [token], callback);
};

exports.create = (name, email, aadhar, password, token, callback) => {
    db.query('INSERT INTO unverified_users (name, email, aadhar, password, verification_token) VALUES (?, ?, ?, ?, ?)',
        [name, email, aadhar, password, token], callback);
};

exports.deleteByEmail = (email, callback) => {
    db.query('DELETE FROM unverified_users WHERE email = ?', [email], callback);
};
