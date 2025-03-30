const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const User = require('../models/userModel');
const emailService = require('../utils/emailService');

exports.signup = async (req, res) => {
    const { fullName, email, aadhar, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    User.findByEmail(email, (err, results) => {
        if (err) return res.status(500).json({ message: 'Error checking user', error: err });
        if (results.length > 0) return res.status(400).json({ message: 'User already exists' });

        const verificationToken = uuidv4();
        User.create(fullName, email, aadhar, hashedPassword, (err) => {
            if (err) return res.status(500).json({ message: 'Error saving user', error: err });

            emailService.sendVerificationEmail(email, verificationToken);
            res.status(200).json({ message: 'Signup successful! Please verify your email.' });
        });
    });
};

exports.login = (req, res) => {
    const { email, password } = req.body;

    User.findByEmail(email, (err, results) => {
        if (err || results.length === 0) return res.status(401).json({ message: 'Invalid email or password' });

        const user = results[0];
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err || !isMatch) return res.status(401).json({ message: 'Invalid email or password' });

            res.status(200).json({ message: 'Login successful!', userId: user.id });
        });
    });
};
