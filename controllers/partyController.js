const getPool = require("../config/db");

exports.getParties = async (req, res, next) => {
  try {
    const pool = getPool();

    const [results] = await pool.query(`
      SELECT 
        id, 
        name, 
        candidate_name, 
        TO_BASE64(image) AS image 
      FROM election_party
    `);

    res.json(results);
  } catch (err) {
    next(err);
  }
};
