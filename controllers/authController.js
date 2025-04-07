const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const db = require("../config/db"); // Make sure this connects to your MySQL
const emailService = require("../utils/emailService");

exports.signup = async (req, res) => {
    const { fullName, email, aadhar, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    db.query("SELECT * FROM users WHERE email = ? OR aadhar = ?", [email, aadhar], (err, results) => {
        if (err) return res.status(500).json({ message: "Database error", error: err });
        if (results.length > 0) return res.status(400).json({ message: "User already exists" });

        db.query("SELECT * FROM unverified_users WHERE email = ? OR aadhar = ?", [email, aadhar], (err2, existingUnverified) => {
            if (err2) return res.status(500).json({ message: "Error checking unverified users", error: err2 });
            if (existingUnverified.length > 0) return res.status(400).json({ message: "User already registered, please verify your email." });

            const verificationToken = uuidv4();

            db.query(
                "INSERT INTO unverified_users (name, email, aadhar, password, verification_token) VALUES (?, ?, ?, ?, ?)",
                [fullName, email, aadhar, hashedPassword, verificationToken],
                (err3) => {
                    if (err3) return res.status(500).json({ message: "Error inserting user", error: err3 });

                    emailService.sendVerificationEmail(email, verificationToken);
                    return res.status(200).json({ message: "Signup successful! Please check your email to verify your account." });
                }
            );
        });
    });
};

exports.verifyEmail = (req, res) => {
    const { token } = req.query;

    if (!token) return res.status(400).json({ message: "Verification token is required." });

    db.query("SELECT * FROM unverified_users WHERE verification_token = ?", [token], (err, results) => {
        if (err) return res.status(500).json({ message: "Database error", error: err });
        if (results.length === 0) return res.status(400).json({ message: "Invalid or expired verification token." });

        const user = results[0];

        db.query(
            "INSERT INTO users (name, email, aadhar, password, verified) VALUES (?, ?, ?, ?, ?)",
            [user.name, user.email, user.aadhar, user.password, true],
            (err2) => {
                if (err2) return res.status(500).json({ message: "Error moving user to verified", error: err2 });

                db.query("DELETE FROM unverified_users WHERE id = ?", [user.id], (err3) => {
                    if (err3) return res.status(500).json({ message: "Error cleaning up", error: err3 });

                    return res.status(200).json({ message: "Email verified successfully. You can now log in!" });
                });
            }
        );
    });
};

exports.login = (req, res) => {
    const { email, password } = req.body;

    db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
        if (err || results.length === 0) return res.status(401).json({ message: "Invalid email or password" });

        const user = results[0];
        bcrypt.compare(password, user.password, (err2, isMatch) => {
            if (err2 || !isMatch) return res.status(401).json({ message: "Invalid email or password" });

            return res.status(200).json({ message: "Login successful", userId: user.id });
        });
    });
};
