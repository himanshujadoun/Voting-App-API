const express = require("express");
const { getParties } = require("../controllers/partyController");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Party
 *   description: Endpoints related to political parties
 */

/**
 * @swagger
 * /api/party/getParties:
 *   get:
 *     summary: Get all parties
 *     description: Retrieve a list of all parties available for voting.
 *     tags: [Party]
 *     responses:
 *       200:
 *         description: List of parties retrieved successfully
 *       500:
 *         description: Server error
 */
router.get("/getParties", getParties);

module.exports = router;
