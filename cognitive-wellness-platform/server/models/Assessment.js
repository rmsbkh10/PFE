const mongoose = require("mongoose");

const assessmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Réponses brutes du questionnaire
    answers: {
      sleep_hours: { type: Number, required: true, min: 1, max: 5 },
      sleep_quality: { type: Number, required: true, min: 1, max: 5 },
      sleep_wake: { type: Number, required: true, min: 1, max: 5 },
      stress_level: { type: Number, required: true, min: 1, max: 5 },
      stress_anxiety: { type: Number, required: true, min: 1, max: 5 },
      stress_relaxation: { type: Number, required: true, min: 1, max: 5 },
      nutrition_fruits: { type: Number, required: true, min: 1, max: 5 },
      nutrition_water: { type: Number, required: true, min: 1, max: 5 },
      nutrition_caffeine: { type: Number, required: true, min: 1, max: 5 },
    },
    // Scores calculés (pourcentage)
    scores: {
      sleep: { type: Number, required: true },
      stress: { type: Number, required: true },
      nutrition: { type: Number, required: true },
      global: { type: Number, required: true },
    },
    // Diagnostic généré
    diagnosis: [
      {
        category: { type: String, enum: ["sleep", "stress", "nutrition"] },
        level: { type: String, enum: ["critical", "warning", "good"] },
        message: String,
      },
    ],
    // Recommandations générées
    recommendations: [
      {
        category: String,
        priority: { type: String, enum: ["high", "medium", "low"] },
        text: String,
      },
    ],
    // Règles déclenchées
    triggeredRules: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Rule",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Assessment", assessmentSchema);