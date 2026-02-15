const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Rule = require("../models/Rule");

dotenv.config();

const rules = [
  // ========== SOMMEIL CRITIQUE ==========
  {
    name: "sleep_critical",
    description: "Sommeil gravement insuffisant",
    category: "sleep",
    priority: 3,
    conditions: [{ field: "scores.sleep", operator: "<=", value: 40 }],
    logicOperator: "AND",
    actions: {
      diagnosis: {
        level: "critical",
        message:
          "Votre sommeil est gravement insuffisant. Cela affecte directement vos fonctions cognitives, votre mémoire et votre concentration.",
      },
      recommendations: [
        {
          text: "🌙 Fixez un horaire de coucher strict à la même heure chaque soir, même le week-end",
          priority: "high",
        },
        {
          text: "📵 Arrêtez tous les écrans (téléphone, TV, ordinateur) au minimum 1h avant le coucher",
          priority: "high",
        },
        {
          text: "🧘 Pratiquez la technique de respiration 4-7-8 : inspirez 4s, retenez 7s, expirez 8s",
          priority: "high",
        },
        {
          text: "☕ Supprimez toute caféine après 14h (café, thé, sodas, chocolat)",
          priority: "high",
        },
      ],
    },
  },

  // ========== SOMMEIL MODÉRÉ ==========
  {
    name: "sleep_warning",
    description: "Sommeil modérément perturbé",
    category: "sleep",
    priority: 2,
    conditions: [
      { field: "scores.sleep", operator: ">", value: 40 },
      { field: "scores.sleep", operator: "<=", value: 60 },
    ],
    logicOperator: "AND",
    actions: {
      diagnosis: {
        level: "warning",
        message:
          "Votre sommeil est modérément perturbé. Des ajustements simples peuvent grandement améliorer votre qualité de repos.",
      },
      recommendations: [
        {
          text: "🌙 Essayez de dormir 30 minutes de plus par nuit",
          priority: "medium",
        },
        {
          text: "🌡️ Maintenez votre chambre entre 18-20°C pour un sommeil optimal",
          priority: "medium",
        },
        {
          text: "📖 Remplacez l'écran du soir par la lecture d'un livre",
          priority: "medium",
        },
      ],
    },
  },

  // ========== SOMMEIL BON ==========
  {
    name: "sleep_good",
    description: "Bon sommeil",
    category: "sleep",
    priority: 1,
    conditions: [{ field: "scores.sleep", operator: ">", value: 60 }],
    logicOperator: "AND",
    actions: {
      diagnosis: {
        level: "good",
        message:
          "Votre sommeil est de bonne qualité. Continuez à maintenir vos bonnes habitudes !",
      },
      recommendations: [
        {
          text: "✅ Maintenez votre routine de sommeil actuelle",
          priority: "low",
        },
      ],
    },
  },

  // ========== STRESS CRITIQUE ==========
  {
    name: "stress_critical",
    description: "Niveau de stress très élevé",
    category: "stress",
    priority: 3,
    conditions: [{ field: "scores.stress", operator: "<=", value: 40 }],
    logicOperator: "AND",
    actions: {
      diagnosis: {
        level: "critical",
        message:
          "Votre niveau de stress est très élevé. Cela impacte sérieusement votre concentration, votre mémoire et votre bien-être général.",
      },
      recommendations: [
        {
          text: "🧘 Commencez la méditation guidée : 10 minutes par jour minimum (apps: Headspace, Petit Bambou)",
          priority: "high",
        },
        {
          text: "🏃 Faites 30 minutes d'exercice physique quotidien (marche rapide, vélo, natation)",
          priority: "high",
        },
        {
          text: "📝 Tenez un journal de gratitude : notez 3 choses positives chaque soir",
          priority: "high",
        },
        {
          text: "🌳 Passez au moins 20 minutes dans la nature chaque jour",
          priority: "medium",
        },
      ],
    },
  },

  // ========== STRESS MODÉRÉ ==========
  {
    name: "stress_warning",
    description: "Stress modéré",
    category: "stress",
    priority: 2,
    conditions: [
      { field: "scores.stress", operator: ">", value: 40 },
      { field: "scores.stress", operator: "<=", value: 60 },
    ],
    logicOperator: "AND",
    actions: {
      diagnosis: {
        level: "warning",
        message:
          "Votre stress est modéré. Quelques techniques simples pourraient vous aider à mieux le gérer.",
      },
      recommendations: [
        {
          text: "🧘 Pratiquez des exercices de respiration profonde 3 fois par jour",
          priority: "medium",
        },
        {
          text: "🎵 Écoutez de la musique relaxante pendant vos pauses",
          priority: "medium",
        },
        {
          text: "📅 Planifiez des pauses de 5 minutes toutes les 90 minutes de travail",
          priority: "medium",
        },
      ],
    },
  },

  // ========== STRESS BON ==========
  {
    name: "stress_good",
    description: "Bonne gestion du stress",
    category: "stress",
    priority: 1,
    conditions: [{ field: "scores.stress", operator: ">", value: 60 }],
    logicOperator: "AND",
    actions: {
      diagnosis: {
        level: "good",
        message:
          "Votre gestion du stress est efficace. Bravo, continuez vos bonnes pratiques !",
      },
      recommendations: [
        {
          text: "✅ Continuez vos techniques de gestion du stress actuelles",
          priority: "low",
        },
      ],
    },
  },

  // ========== NUTRITION CRITIQUE ==========
  {
    name: "nutrition_critical",
    description: "Alimentation insuffisante pour le cognitif",
    category: "nutrition",
    priority: 3,
    conditions: [{ field: "scores.nutrition", operator: "<=", value: 40 }],
    logicOperator: "AND",
    actions: {
      diagnosis: {
        level: "critical",
        message:
          "Votre alimentation ne soutient pas vos fonctions cognitives. Des changements nutritionnels sont essentiels.",
      },
      recommendations: [
        {
          text: "🥗 Ajoutez au moins 3 portions de légumes par jour (brocoli, épinards, carottes)",
          priority: "high",
        },
        {
          text: "💧 Buvez au minimum 6-8 verres d'eau par jour pour maintenir l'hydratation cérébrale",
          priority: "high",
        },
        {
          text: "🐟 Intégrez des oméga-3 dans votre alimentation : poisson gras, noix, graines de lin",
          priority: "high",
        },
        {
          text: "🫐 Consommez des antioxydants quotidiennement : baies, thé vert, curcuma",
          priority: "medium",
        },
        {
          text: "☕ Réduisez votre consommation de caféine à maximum 2 tasses par jour",
          priority: "high",
        },
      ],
    },
  },

  // ========== NUTRITION MODÉRÉ ==========
  {
    name: "nutrition_warning",
    description: "Nutrition à améliorer",
    category: "nutrition",
    priority: 2,
    conditions: [
      { field: "scores.nutrition", operator: ">", value: 40 },
      { field: "scores.nutrition", operator: "<=", value: 60 },
    ],
    logicOperator: "AND",
    actions: {
      diagnosis: {
        level: "warning",
        message:
          "Votre alimentation peut être améliorée pour un meilleur soutien de votre bien-être cognitif.",
      },
      recommendations: [
        {
          text: "🥗 Augmentez votre consommation de fruits et légumes d'une portion par jour",
          priority: "medium",
        },
        {
          text: "💧 Ajoutez un verre d'eau supplémentaire à votre routine quotidienne",
          priority: "medium",
        },
        {
          text: "🥜 Remplacez les snacks transformés par des noix et graines",
          priority: "medium",
        },
      ],
    },
  },

  // ========== NUTRITION BON ==========
  {
    name: "nutrition_good",
    description: "Bonne alimentation",
    category: "nutrition",
    priority: 1,
    conditions: [{ field: "scores.nutrition", operator: ">", value: 60 }],
    logicOperator: "AND",
    actions: {
      diagnosis: {
        level: "good",
        message:
          "Votre alimentation soutient bien votre santé cognitive. Excellent travail !",
      },
      recommendations: [
        {
          text: "✅ Maintenez vos bonnes habitudes alimentaires actuelles",
          priority: "low",
        },
      ],
    },
  },

  // ========== RÈGLES COMBINÉES ==========
  {
    name: "sleep_stress_combined",
    description: "Mauvais sommeil ET stress élevé",
    category: "combined",
    priority: 3,
    conditions: [
      { field: "scores.sleep", operator: "<=", value: 40 },
      { field: "scores.stress", operator: "<=", value: 40 },
    ],
    logicOperator: "AND",
    actions: {
      diagnosis: {
        level: "critical",
        message:
          "⚠️ ALERTE : Le manque de sommeil aggrave votre stress, et inversement. C'est un cercle vicieux qu'il faut briser en priorité.",
      },
      recommendations: [
        {
          text: "⚠️ PRIORITÉ ABSOLUE : Commencez par améliorer votre sommeil, cela réduira naturellement votre stress",
          priority: "high",
        },
        {
          text: "🛏️ Ce soir : couchez-vous 1h plus tôt et pratiquez 5 min de respiration profonde",
          priority: "high",
        },
      ],
    },
  },

  {
    name: "nutrition_stress_combined",
    description: "Mauvaise nutrition ET stress élevé",
    category: "combined",
    priority: 3,
    conditions: [
      { field: "scores.nutrition", operator: "<=", value: 40 },
      { field: "scores.stress", operator: "<=", value: 40 },
    ],
    logicOperator: "AND",
    actions: {
      diagnosis: {
        level: "critical",
        message:
          "⚠️ ALERTE : Une mauvaise alimentation intensifie votre stress. Le sucre et la caféine en excès aggravent l'anxiété.",
      },
      recommendations: [
        {
          text: "⚠️ PRIORITÉ : Réduisez immédiatement le sucre raffiné et la caféine excessive",
          priority: "high",
        },
        {
          text: "🍌 Mangez des aliments riches en magnésium (bananes, amandes, chocolat noir) pour calmer le système nerveux",
          priority: "high",
        },
      ],
    },
  },

  {
    name: "all_critical",
    description: "Tout est critique",
    category: "combined",
    priority: 3,
    conditions: [
      { field: "scores.sleep", operator: "<=", value: 40 },
      { field: "scores.stress", operator: "<=", value: 40 },
      { field: "scores.nutrition", operator: "<=", value: 40 },
    ],
    logicOperator: "AND",
    actions: {
      diagnosis: {
        level: "critical",
        message:
          "🚨 URGENT : Tous vos indicateurs sont au rouge. Votre bien-être cognitif est sérieusement compromis. Un plan d'action immédiat est nécessaire.",
      },
      recommendations: [
        {
          text: "🚨 Consultez un professionnel de santé pour un accompagnement personnalisé",
          priority: "high",
        },
        {
          text: "📋 Commencez par UN seul changement aujourd'hui : couchez-vous 1h plus tôt",
          priority: "high",
        },
      ],
    },
  },

  // ===== RÈGLE SUR CAFÉINE SPÉCIFIQUE =====
  {
    name: "high_caffeine_poor_sleep",
    description: "Caféine élevée ET mauvais sommeil",
    category: "combined",
    priority: 3,
    conditions: [
      { field: "answers.nutrition_caffeine", operator: "<=", value: 2 },
      { field: "scores.sleep", operator: "<=", value: 50 },
    ],
    logicOperator: "AND",
    actions: {
      diagnosis: {
        level: "critical",
        message:
          "Votre consommation élevée de caféine est probablement une cause directe de vos problèmes de sommeil.",
      },
      recommendations: [
        {
          text: "☕ Réduisez votre caféine à 1-2 tasses UNIQUEMENT le matin (avant 12h)",
          priority: "high",
        },
        {
          text: "🍵 Remplacez le café de l'après-midi par du thé vert décaféiné ou une tisane",
          priority: "high",
        },
      ],
    },
  },
];

const seedRules = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connecté");

    // Supprimer les anciennes règles
    await Rule.deleteMany({});
    console.log("🗑️ Anciennes règles supprimées");

    // Insérer les nouvelles règles
    const created = await Rule.insertMany(rules);
    console.log(`✅ ${created.length} règles insérées avec succès !`);

    // Afficher les règles
    created.forEach((rule) => {
      console.log(`   📌 ${rule.name} (${rule.category}) - priorité: ${rule.priority}`);
    });

    mongoose.connection.close();
    console.log("✅ Terminé !");
  } catch (error) {
    console.error("❌ Erreur:", error);
    process.exit(1);
  }
};

seedRules();