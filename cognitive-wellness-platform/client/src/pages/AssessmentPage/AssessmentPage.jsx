import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { assessmentAPI } from '../../services/api';
import './AssessmentPage.css';

const AssessmentPage = () => {
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [answers, setAnswers] = useState({
    sleep: {
      hoursPerNight: 7,
      sleepQuality: 3,
      timeToFallAsleep: 20,
      nightWakeups: 1,
      screenBeforeBed: 3,
      consistentSchedule: 3
    },
    stress: {
      perceivedStressLevel: 5,
      anxietyFrequency: 3,
      relaxationPractice: 2,
      workLifeBalance: 3,
      socialSupport: 3,
      overwhelmedFrequency: 3
    },
    nutrition: {
      mealsPerDay: 3,
      waterIntake: 5,
      caffeineIntake: 2,
      fruitVegServings: 3,
      processedFoodFrequency: 3,
      balancedDiet: 3
    }
  });

  const sections = [
    {
      key: 'sleep',
      title: '🌙 Sommeil',
      description: 'Évaluez la qualité et les habitudes de votre sommeil',
      color: '#6366f1',
      questions: [
        {
          key: 'hoursPerNight',
          label: 'Combien d\'heures dormez-vous par nuit en moyenne ?',
          type: 'range',
          min: 3, max: 12, step: 0.5,
          unit: 'heures',
          hint: 'L\'idéal se situe entre 7 et 9 heures'
        },
        {
          key: 'sleepQuality',
          label: 'Comment évaluez-vous la qualité globale de votre sommeil ?',
          type: 'scale',
          min: 1, max: 5,
          labels: ['Très mauvaise', 'Mauvaise', 'Moyenne', 'Bonne', 'Excellente']
        },
        {
          key: 'timeToFallAsleep',
          label: 'Combien de temps mettez-vous à vous endormir (en minutes) ?',
          type: 'range',
          min: 5, max: 120, step: 5,
          unit: 'minutes',
          hint: 'Moins de 20 minutes est considéré comme normal'
        },
        {
          key: 'nightWakeups',
          label: 'Combien de fois vous réveillez-vous pendant la nuit ?',
          type: 'range',
          min: 0, max: 8, step: 1,
          unit: 'fois',
          hint: '0-1 réveil est considéré comme normal'
        },
        {
          key: 'screenBeforeBed',
          label: 'Utilisez-vous des écrans dans l\'heure précédant le coucher ?',
          type: 'scale',
          min: 1, max: 5,
          labels: ['Jamais', 'Rarement', 'Parfois', 'Souvent', 'Toujours']
        },
        {
          key: 'consistentSchedule',
          label: 'Gardez-vous des horaires de sommeil réguliers ?',
          type: 'scale',
          min: 1, max: 5,
          labels: ['Jamais', 'Rarement', 'Parfois', 'Souvent', 'Toujours']
        }
      ]
    },
    {
      key: 'stress',
      title: '🧘 Stress',
      description: 'Évaluez votre niveau de stress et vos stratégies de gestion',
      color: '#f59e0b',
      questions: [
        {
          key: 'perceivedStressLevel',
          label: 'Sur une échelle de 1 à 10, quel est votre niveau de stress actuel ?',
          type: 'range',
          min: 1, max: 10, step: 1,
          unit: '/10',
          hint: '1 = Aucun stress, 10 = Stress extrême'
        },
        {
          key: 'anxietyFrequency',
          label: 'À quelle fréquence ressentez-vous de l\'anxiété ?',
          type: 'scale',
          min: 1, max: 5,
          labels: ['Jamais', 'Rarement', 'Parfois', 'Souvent', 'Constamment']
        },
        {
          key: 'relaxationPractice',
          label: 'Pratiquez-vous des techniques de relaxation (méditation, yoga, respiration...) ?',
          type: 'scale',
          min: 1, max: 5,
          labels: ['Jamais', 'Rarement', 'Occasionnellement', 'Régulièrement', 'Quotidiennement']
        },
        {
          key: 'workLifeBalance',
          label: 'Comment évaluez-vous votre équilibre travail-vie personnelle ?',
          type: 'scale',
          min: 1, max: 5,
          labels: ['Très mauvais', 'Mauvais', 'Moyen', 'Bon', 'Excellent']
        },
        {
          key: 'socialSupport',
          label: 'Sentez-vous que vous avez un bon soutien social (famille, amis) ?',
          type: 'scale',
          min: 1, max: 5,
          labels: ['Pas du tout', 'Peu', 'Moyennement', 'Bien', 'Très bien']
        },
        {
          key: 'overwhelmedFrequency',
          label: 'À quelle fréquence vous sentez-vous submergé(e) ?',
          type: 'scale',
          min: 1, max: 5,
          labels: ['Jamais', 'Rarement', 'Parfois', 'Souvent', 'Constamment']
        }
      ]
    },
    {
      key: 'nutrition',
      title: '🥗 Nutrition',
      description: 'Évaluez vos habitudes alimentaires et d\'hydratation',
      color: '#10b981',
      questions: [
        {
          key: 'mealsPerDay',
          label: 'Combien de repas prenez-vous par jour ?',
          type: 'range',
          min: 1, max: 6, step: 1,
          unit: 'repas',
          hint: '3 repas équilibrés par jour est recommandé'
        },
        {
          key: 'waterIntake',
          label: 'Combien de verres d\'eau buvez-vous par jour ?',
          type: 'range',
          min: 0, max: 15, step: 1,
          unit: 'verres',
          hint: '8 verres (2L) est l\'objectif recommandé'
        },
        {
          key: 'caffeineIntake',
          label: 'Combien de tasses de café/thé consommez-vous par jour ?',
          type: 'range',
          min: 0, max: 10, step: 1,
          unit: 'tasses',
          hint: '2-3 tasses maximum recommandé'
        },
        {
          key: 'fruitVegServings',
          label: 'Combien de portions de fruits et légumes mangez-vous par jour ?',
          type: 'range',
          min: 0, max: 10, step: 1,
          unit: 'portions',
          hint: '5 portions minimum recommandé'
        },
        {
          key: 'processedFoodFrequency',
          label: 'À quelle fréquence consommez-vous des aliments ultra-transformés ?',
          type: 'scale',
          min: 1, max: 5,
          labels: ['Jamais', 'Rarement', 'Parfois', 'Souvent', 'À chaque repas']
        },
        {
          key: 'balancedDiet',
          label: 'Considérez-vous votre alimentation comme équilibrée ?',
          type: 'scale',
          min: 1, max: 5,
          labels: ['Pas du tout', 'Peu', 'Moyennement', 'Plutôt oui', 'Tout à fait']
        }
      ]
    }
  ];

  const handleAnswerChange = (sectionKey, questionKey, value) => {
    setAnswers(prev => ({
      ...prev,
      [sectionKey]: {
        ...prev[sectionKey],
        [questionKey]: Number(value)
      }
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await assessmentAPI.submit(answers);
      navigate(`/results/${response.data.data.assessmentId}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors de la soumission');
      setLoading(false);
    }
  };

  const currentSectionData = sections[currentSection];
  const progress = ((currentSection + 1) / sections.length) * 100;

  return (
    <div className="assessment-page">
      {/* Barre de progression */}
      <div className="progress-container">
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progress}%`, backgroundColor: currentSectionData.color }}
          />
        </div>
        <div className="progress-steps">
          {sections.map((s, i) => (
            <div
              key={i}
              className={`progress-step ${i === currentSection ? 'active' : ''} ${i < currentSection ? 'completed' : ''}`}
              onClick={() => i <= currentSection && setCurrentSection(i)}
            >
              <span className="step-icon">{s.title.split(' ')[0]}</span>
              <span className="step-label">{s.title.split(' ').slice(1).join(' ')}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Section du questionnaire */}
      <div className="section-card" style={{ borderColor: `${currentSectionData.color}40` }}>
        <div className="section-header">
          <h2 className="section-title" style={{ color: currentSectionData.color }}>
            {currentSectionData.title}
          </h2>
          <p className="section-desc">{currentSectionData.description}</p>
        </div>

        <div className="questions">
          {currentSectionData.questions.map((q, index) => (
            <div key={q.key} className="question-item">
              <label className="question-label">
                <span className="question-number">{index + 1}.</span>
                {q.label}
              </label>

              {q.hint && <p className="question-hint">💡 {q.hint}</p>}

              {q.type === 'range' && (
                <div className="range-input">
                  <input
                    type="range"
                    min={q.min}
                    max={q.max}
                    step={q.step}
                    value={answers[currentSectionData.key][q.key]}
                    onChange={(e) =>
                      handleAnswerChange(currentSectionData.key, q.key, e.target.value)
                    }
                    style={{ accentColor: currentSectionData.color }}
                  />
                  <div className="range-value" style={{ color: currentSectionData.color }}>
                    {answers[currentSectionData.key][q.key]} {q.unit}
                  </div>
                  <div className="range-bounds">
                    <span>{q.min}</span>
                    <span>{q.max}</span>
                  </div>
                </div>
              )}

              {q.type === 'scale' && (
                <div className="scale-input">
                  {q.labels.map((label, i) => (
                    <button
                      key={i}
                      className={`scale-option ${
                        answers[currentSectionData.key][q.key] === i + 1 ? 'selected' : ''
                      }`}
                      onClick={() =>
                        handleAnswerChange(currentSectionData.key, q.key, i + 1)
                      }
                      style={{
                        '--accent': currentSectionData.color
                      }}
                    >
                      <span className="scale-number">{i + 1}</span>
                      <span className="scale-label">{label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {error && <div className="error-message">{error}</div>}

        {/* Navigation */}
        <div className="section-nav">
          {currentSection > 0 && (
            <button
              className="btn-secondary"
              onClick={() => setCurrentSection(prev => prev - 1)}
            >
              ← Section précédente
            </button>
          )}

          {currentSection < sections.length - 1 ? (
            <button
              className="btn-primary"
              onClick={() => setCurrentSection(prev => prev + 1)}
              style={{ marginLeft: 'auto' }}
            >
              Section suivante →
            </button>
          ) : (
            <button
              className="btn-submit"
              onClick={handleSubmit}
              disabled={loading}
              style={{ marginLeft: 'auto' }}
            >
              {loading ? '⏳ Analyse en cours...' : '🧠 Obtenir mon diagnostic'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssessmentPage;