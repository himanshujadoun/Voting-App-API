const db = require('../config/db');

exports.findByEmail = (email, callback) => {
    db.query('SELECT * FROM users WHERE email = ?', [email], callback);
};

exports.create = (name, email, aadhar, password, callback) => {
    db.query('INSERT INTO users (name, email, aadhar, password, verified) VALUES (?, ?, ?, ?, TRUE)',
        [name, email, aadhar, password], callback);
};
