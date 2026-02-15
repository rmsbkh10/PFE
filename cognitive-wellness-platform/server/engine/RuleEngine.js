const Rule = require("../models/Rule");

class RuleEngine {
  // Charger toutes les règles actives depuis MongoDB
  async loadRules() {
    const rules = await Rule.find({ isActive: true }).sort({ priority: -1 });
    return rules;
  }

  // Évaluer UNE condition
  evaluateCondition(condition, data) {
    // Accéder au champ (ex: "scores.sleep" → data.scores.sleep)
    const fieldParts = condition.field.split(".");
    let fieldValue = data;
    for (const part of fieldParts) {
      if (fieldValue === undefined) return false;
      fieldValue = fieldValue[part];
    }

    if (fieldValue === undefined) return false;

    // Appliquer l'opérateur
    switch (condition.operator) {
      case "<=":
        return fieldValue <= condition.value;
      case ">=":
        return fieldValue >= condition.value;
      case "<":
        return fieldValue < condition.value;
      case ">":
        return fieldValue > condition.value;
      case "==":
        return fieldValue === condition.value;
      case "!=":
        return fieldValue !== condition.value;
      default:
        return false;
    }
  }

  // Évaluer TOUTES les conditions d'une règle
  evaluateRule(rule, data) {
    const results = rule.conditions.map((condition) =>
      this.evaluateCondition(condition, data)
    );

    if (rule.logicOperator === "OR") {
      return results.some((r) => r === true);
    }
    // AND par défaut
    return results.every((r) => r === true);
  }

  // Calculer les scores à partir des réponses
  calculateScores(answers) {
    const categories = {
      sleep: ["sleep_hours", "sleep_quality", "sleep_wake"],
      stress: ["stress_level", "stress_anxiety", "stress_relaxation"],
      nutrition: ["nutrition_fruits", "nutrition_water", "nutrition_caffeine"],
    };

    const scores = {};

    for (const [category, fields] of Object.entries(categories)) {
      let total = 0;
      let count = 0;
      for (const field of fields) {
        if (answers[field] !== undefined) {
          total += answers[field];
          count++;
        }
      }
      scores[category] =
        count > 0 ? Math.round((total / (count * 5)) * 100) : 0;
    }

    scores.global = Math.round(
      (scores.sleep + scores.stress + scores.nutrition) / 3
    );

    return scores;
  }

  // 🔥 EXÉCUTER LE MOTEUR DE RÈGLES
  async execute(answers) {
    // 1. Calculer les scores
    const scores = this.calculateScores(answers);

    // 2. Charger les règles
    const rules = await this.loadRules();

    // 3. Données pour l'évaluation
    const data = { scores, answers };

    // 4. Évaluer chaque règle
    const diagnosis = [];
    const recommendations = [];
    const triggeredRules = [];

    for (const rule of rules) {
      if (this.evaluateRule(rule, data)) {
        // La règle est déclenchée !
        triggeredRules.push(rule._id);

        // Ajouter le diagnostic
        if (rule.actions.diagnosis && rule.actions.diagnosis.message) {
          diagnosis.push({
            category: rule.category,
            level: rule.actions.diagnosis.level,
            message: rule.actions.diagnosis.message,
          });
        }

        // Ajouter les recommandations
        if (rule.actions.recommendations) {
          for (const rec of rule.actions.recommendations) {
            recommendations.push({
              category: rule.category,
              priority: rec.priority || "medium",
              text: rec.text,
            });
          }
        }
      }
    }

    // 5. Trier les recommandations par priorité
    const priorityOrder = { high: 1, medium: 2, low: 3 };
    recommendations.sort(
      (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
    );

    return {
      scores,
      diagnosis,
      recommendations,
      triggeredRules,
    };
  }
}

module.exports = new RuleEngine();