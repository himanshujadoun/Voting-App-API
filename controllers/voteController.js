const getPool = require("../config/db");

exports.vote = async (req, res, next) => {
  try {
    const { userId, partyId } = req.body;

    if (!userId || !partyId) {
      return res.status(400).json({
        message: "Missing user ID or party ID",
      });
    }

    const pool = getPool();

    // Check if user already voted
    const [existingVote] = await pool.query(
      "SELECT id FROM votes WHERE user_id = ?",
      [userId]
    );

    if (existingVote.length > 0) {
      return res.status(400).json({
        message: "You have already voted!",
      });
    }

    // Record vote
    await pool.query("INSERT INTO votes (user_id, party_id) VALUES (?, ?)", [
      userId,
      partyId,
    ]);

    res.json({ message: "Vote recorded successfully!" });
  } catch (err) {
    next(err);
  }
};
