const Assessment = require("../models/Assessment");
const ruleEngine = require("../engine/ruleEngine");

// POST /api/assessment/submit
exports.submitAssessment = async (req, res) => {
  try {
    const { answers } = req.body;

    // Validation des réponses
    const requiredFields = [
      "sleep_hours", "sleep_quality", "sleep_wake",
      "stress_level", "stress_anxiety", "stress_relaxation",
      "nutrition_fruits", "nutrition_water", "nutrition_caffeine",
    ];

    for (const field of requiredFields) {
      if (answers[field] === undefined || answers[field] < 1 || answers[field] > 5) {
        return res.status(400).json({
          message: `Réponse invalide pour ${field}`,
        });
      }
    }

    // 🔥 EXÉCUTER LE MOTEUR DE RÈGLES
    const result = await ruleEngine.execute(answers);

    // Sauvegarder en base de données
    const assessment = await Assessment.create({
      user: req.user._id,
      answers,
      scores: result.scores,
      diagnosis: result.diagnosis,
      recommendations: result.recommendations,
      triggeredRules: result.triggeredRules,
    });

    res.status(201).json({
      message: "Évaluation terminée",
      assessment: {
        id: assessment._id,
        scores: result.scores,
        diagnosis: result.diagnosis,
        recommendations: result.recommendations,
        triggeredRulesCount: result.triggeredRules.length,
        createdAt: assessment.createdAt,
      },
    });
  } catch (error) {
    console.error("Assessment error:", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// GET /api/assessment/history
exports.getHistory = async (req, res) => {
  try {
    const assessments = await Assessment.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .select("scores diagnosis createdAt");

    res.json({ assessments });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// GET /api/assessment/:id
exports.getById = async (req, res) => {
  try {
    const assessment = await Assessment.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!assessment) {
      return res.status(404).json({ message: "Évaluation non trouvée" });
    }

    res.json({ assessment });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};