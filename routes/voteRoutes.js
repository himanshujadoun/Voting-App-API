const express = require("express");
const { vote } = require("../controllers/voteController");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Vote
 *   description: Voting operations
 */

/**
 * @swagger
 * /api/vote:
 *   post:
 *     summary: Vote for a party
 *     description: Submit a vote for a selected party.
 *     tags: [Vote]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               partyId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Vote submitted successfully
 *       400:
 *         description: Invalid request data
 */
router.post("/", vote);

module.exports = router;
