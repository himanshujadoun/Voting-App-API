const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const getPool = require("../config/db");
const emailService = require("../utils/emailService");

/**
 * SIGNUP
 */
exports.signup = async (req, res, next) => {
  try {
    const { fullName, email, aadhar, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const pool = getPool();

    // Check verified users
    const [existingUsers] = await pool.query(
      "SELECT id FROM users WHERE email = ? OR aadhar = ?",
      [email, aadhar]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Check unverified users
    const [unverified] = await pool.query(
      "SELECT id FROM unverified_users WHERE email = ? OR aadhar = ?",
      [email, aadhar]
    );

    if (unverified.length > 0) {
      return res.status(400).json({
        message: "User already registered. Please verify your email."
      });
    }

    const verificationToken = uuidv4();

    await pool.query(
      `INSERT INTO unverified_users 
       (name, email, aadhar, password, verification_token)
       VALUES (?, ?, ?, ?, ?)`,
      [fullName, email, aadhar, hashedPassword, verificationToken]
    );

    await emailService.sendVerificationEmail(email, verificationToken);

    res.status(200).json({
      message: "Signup successful! Please check your email to verify your account."
    });
  } catch (err) {
    next(err);
  }
};

/**
 * VERIFY EMAIL
 */
exports.verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.query;
    if (!token) {
      return res.status(400).json({ message: "Verification token is required." });
    }

    const pool = getPool();

    const [results] = await pool.query(
      "SELECT * FROM unverified_users WHERE verification_token = ?",
      [token]
    );

    if (results.length === 0) {
      return res.status(400).json({ message: "Invalid or expired token." });
    }

    const user = results[0];

    await pool.query(
      `INSERT INTO users (name, email, aadhar, password, verified)
       VALUES (?, ?, ?, ?, ?)`,
      [user.name, user.email, user.aadhar, user.password, true]
    );

    await pool.query(
      "DELETE FROM unverified_users WHERE id = ?",
      [user.id]
    );

    res.status(200).json({
      message: "Email verified successfully. You can now log in!"
    });
  } catch (err) {
    next(err);
  }
};

/**
 * LOGIN
 */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const pool = getPool();

    const [users] = await pool.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.status(200).json({
      message: "Login successful",
      userId: user.id
    });
  } catch (err) {
    next(err);
  }
};
