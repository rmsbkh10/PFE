const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const Assessment = require("../models/Assessment");

// GET /api/recommendations/:assessmentId
router.get("/:assessmentId", protect, async (req, res) => {
  try {
    const assessment = await Assessment.findOne({
      _id: req.params.assessmentId,
      user: req.user._id,
    });

    if (!assessment) {
      return res.status(404).json({ message: "Évaluation non trouvée" });
    }

    res.json({
      scores: assessment.scores,
      diagnosis: assessment.diagnosis,
      recommendations: assessment.recommendations,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;