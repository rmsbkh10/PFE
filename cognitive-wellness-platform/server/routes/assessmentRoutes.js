const express = require("express");
const router = express.Router();
const {
  submitAssessment,
  getHistory,
  getById,
} = require("../controllers/assessmentController");
const protect = require("../middleware/authMiddleware");

router.post("/submit", protect, submitAssessment);
router.get("/history", protect, getHistory);
router.get("/:id", protect, getById);

module.exports = router;