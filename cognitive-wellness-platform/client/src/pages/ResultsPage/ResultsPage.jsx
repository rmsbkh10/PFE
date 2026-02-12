import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './ResultsPage.css';

// ===== MOTEUR DE RÈGLES (Rule Engine) =====
const applyRules = (scores) => {
  const recommendations = [];
  const diagnosis = [];

  // --- Règles SOMMEIL ---
  if (scores.sleep <= 40) {
    diagnosis.push({
      category: 'sleep',
      level: 'critical',
      message: 'Votre sommeil est gravement insuffisant. Cela affecte directement vos fonctions cognitives.',
    });
    recommendations.push(
      '🌙 Fixez un horaire de coucher strict (même le week-end)',
      '📵 Arrêtez les écrans 1h avant le coucher',
      '🧘 Pratiquez la respiration 4-7-8 avant de dormir',
      '☕ Supprimez toute caféine après 14h',
    );
  } else if (scores.sleep <= 60) {
    diagnosis.push({
      category: 'sleep',
      level: 'warning',
      message: 'Votre sommeil est modérément perturbé. Des ajustements sont nécessaires.',
    });
    recommendations.push(
      '🌙 Essayez de dormir 30 minutes de plus par nuit',
      '🌡️ Maintenez votre chambre entre 18-20°C',
      '📖 Lisez un livre plutôt que regarder un écran le soir',
    );
  } else {
    diagnosis.push({
      category: 'sleep',
      level: 'good',
      message: 'Votre sommeil est de bonne qualité. Continuez ainsi !',
    });
  }

  // --- Règles STRESS ---
  if (scores.stress <= 40) {
    diagnosis.push({
      category: 'stress',
      level: 'critical',
      message: 'Votre niveau de stress est très élevé. Cela impacte votre concentration et votre mémoire.',
    });
    recommendations.push(
      '🧘 Commencez la méditation (10 min/jour minimum)',
      '🏃 Faites 30 minutes d\'exercice physique quotidien',
      '📝 Tenez un journal de gratitude chaque soir',
      '🌳 Passez au moins 20 min dans la nature chaque jour',
    );
  } else if (scores.stress <= 60) {
    diagnosis.push({
      category: 'stress',
      level: 'warning',
      message: 'Votre stress est modéré. Quelques techniques pourraient vous aider.',
    });
    recommendations.push(
      '🧘 Essayez des exercices de respiration profonde',
      '🎵 Écoutez de la musique relaxante pendant les pauses',
      '📅 Planifiez des pauses régulières dans votre journée',
    );
  } else {
    diagnosis.push({
      category: 'stress',
      level: 'good',
      message: 'Votre gestion du stress est efficace. Bravo !',
    });
  }

  // --- Règles NUTRITION ---
  if (scores.nutrition <= 40) {
    diagnosis.push({
      category: 'nutrition',
      level: 'critical',
      message: 'Votre alimentation ne soutient pas vos fonctions cognitives.',
    });
    recommendations.push(
      '🥗 Ajoutez au moins 3 portions de légumes par jour',
      '💧 Buvez au minimum 6 verres d\'eau par jour',
      '🐟 Intégrez des oméga-3 (poisson, noix, graines de lin)',
      '🫐 Consommez des antioxydants (baies, thé vert)',
      '☕ Réduisez la caféine à maximum 2 tasses/jour',
    );
  } else if (scores.nutrition <= 60) {
    diagnosis.push({
      category: 'nutrition',
      level: 'warning',
      message: 'Votre alimentation peut être améliorée pour un meilleur bien-être cognitif.',
    });
    recommendations.push(
      '🥗 Augmentez votre consommation de fruits et légumes',
      '💧 Essayez de boire un verre d\'eau supplémentaire par jour',
      '🥜 Ajoutez des noix et graines à vos collations',
    );
  } else {
    diagnosis.push({
      category: 'nutrition',
      level: 'good',
      message: 'Votre alimentation soutient bien votre santé cognitive. Continuez !',
    });
  }

  // --- Règles COMBINÉES ---
  if (scores.sleep <= 40 && scores.stress <= 40) {
    recommendations.push(
      '⚠️ PRIORITÉ : Le manque de sommeil aggrave votre stress. Commencez par améliorer votre sommeil.',
    );
  }

  if (scores.nutrition <= 40 && scores.stress <= 40) {
    recommendations.push(
      '⚠️ PRIORITÉ : Une mauvaise alimentation intensifie le stress. Réduisez le sucre et la caféine.',
    );
  }

  // Score global
  const globalScore = Math.round((scores.sleep + scores.stress + scores.nutrition) / 3);

  return { diagnosis, recommendations, globalScore };
};

const getScoreColor = (score) => {
  if (score <= 40) return '#e74c3c';
  if (score <= 60) return '#f39c12';
  return '#2ecc71';
};

const getScoreLabel = (score) => {
  if (score <= 40) return 'Critique';
  if (score <= 60) return 'Modéré';
  return 'Bon';
};

const ResultsPage = () => {
  const [results, setResults] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('assessmentResult');
    if (stored) {
      const parsed = JSON.parse(stored);
      const analysis = applyRules(parsed.scores);
      setResults({ ...parsed, ...analysis });
    }
  }, []);

  if (!results) {
    return (
      <div className="results-container">
        <div className="results-card">
          <h2>Aucun résultat</h2>
          <p>Veuillez d'abord compléter l'évaluation.</p>
          <Link to="/assessment" className="btn btn-primary">
            Faire l'évaluation
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="results-container">
      <div className="results-card">
        <h2>📊 Vos Résultats</h2>

        {/* Score Global */}
        <div className="global-score" style={{ borderColor: getScoreColor(results.globalScore) }}>
          <span className="score-number" style={{ color: getScoreColor(results.globalScore) }}>
            {results.globalScore}%
          </span>
          <span className="score-label">Score Global: {getScoreLabel(results.globalScore)}</span>
        </div>

        {/* Scores par catégorie */}
        <div className="scores-grid">
          {[
            { key: 'sleep', label: '🌙 Sommeil', score: results.scores.sleep },
            { key: 'stress', label: '😰 Stress', score: results.scores.stress },
            { key: 'nutrition', label: '🥗 Nutrition', score: results.scores.nutrition },
          ].map(item => (
            <div key={item.key} className="score-item">
              <h4>{item.label}</h4>
              <div className="score-bar-bg">
                <div
                  className="score-bar-fill"
                  style={{
                    width: `${item.score}%`,
                    background: getScoreColor(item.score),
                  }}
                ></div>
              </div>
              <span style={{ color: getScoreColor(item.score), fontWeight: 'bold' }}>
                {item.score}% — {getScoreLabel(item.score)}
              </span>
            </div>
          ))}
        </div>

        {/* Diagnostic */}
        <div className="section">
          <h3>🔍 Diagnostic</h3>
          {results.diagnosis.map((d, i) => (
            <div key={i} className={`diagnosis-item diagnosis-${d.level}`}>
              <p>{d.message}</p>
            </div>
          ))}
        </div>

        {/* Recommandations */}
        <div className="section">
          <h3>📋 Plan d'Action Personnalisé</h3>
          <ul className="recommendations-list">
            {results.recommendations.map((rec, i) => (
              <li key={i}>{rec}</li>
            ))}
          </ul>
        </div>

        {/* Actions */}
        <div className="results-actions">
          <Link to="/assessment" className="btn btn-primary">
            🔄 Refaire l'évaluation
          </Link>
          <Link to="/" className="btn btn-outline">
            ← Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;