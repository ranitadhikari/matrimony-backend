const express = require("express");
const router = express.Router();

const {
  sendInterest,
  getReceivedInterests,
  getSentInterests,
  respondInterest,
  getContactIfMatched
} = require("../controllers/interestController");

const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, sendInterest);
router.get("/received", protect, getReceivedInterests);
router.get("/sent", protect, getSentInterests);
router.put("/:id", protect, respondInterest);
router.get("/contact/:userId", protect, getContactIfMatched);

module.exports = router;