const db = require('../config/db');

const User = {
    findByEmail: (email, callback) => {
        db.query('SELECT * FROM users WHERE email = ?', [email], callback);
    },
    
    create: (name, email, aadhar, hashedPassword, callback) => {
        db.query(
            'INSERT INTO users (name, email, aadhar, password, verified) VALUES (?, ?, ?, ?, 0)',
            [name, email, aadhar, hashedPassword],
            callback
        );
    },

    verifyUser: (email, callback) => {
        db.query('UPDATE users SET verified = 1 WHERE email = ?', [email], callback);
    }
};

module.exports = User;
