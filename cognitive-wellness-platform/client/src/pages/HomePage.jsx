import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './HomePage.css';

const HomePage = () => {
  const { user } = useAuth();

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="hero-icon">🧠</span>
            Évaluez votre Bien-être Cognitif
          </h1>
          <p className="hero-subtitle">
            Découvrez comment votre sommeil, stress et nutrition affectent vos
            performances cognitives. Obtenez un plan d'action personnalisé en
            quelques minutes grâce à notre système expert.
          </p>
          <div className="hero-cta">
            {user ? (
              <Link to="/assessment" className="btn-primary btn-large">
                📝 Commencer l'évaluation
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn-primary btn-large">
                  🚀 Commencer gratuitement
                </Link>
                <Link to="/login" className="btn-secondary btn-large">
                  Se connecter
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2 className="section-title">Comment ça marche ?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📋</div>
            <h3>1. Auto-évaluation</h3>
            <p>
              Répondez à un questionnaire concis sur votre sommeil,
              niveau de stress et habitudes nutritionnelles.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚙️</div>
            <h3>2. Analyse Experte</h3>
            <p>
              Notre moteur d'inférence analyse vos réponses à travers
              des règles établies pour identifier les déséquilibres.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>3. Plan Personnalisé</h3>
            <p>
              Recevez instantanément un diagnostic détaillé et un plan
              d'action avec des recommandations concrètes et adaptées.
            </p>
          </div>
        </div>
      </section>

      {/* Domains Section */}
      <section className="domains">
        <h2 className="section-title">Trois Dimensions Évaluées</h2>
        <div className="domains-grid">
          <div className="domain-card domain-sleep">
            <span className="domain-icon">🌙</span>
            <h3>Sommeil</h3>
            <p>Qualité, durée, régularité, environnement de sommeil et habitudes pré-dodo.</p>
          </div>
          <div className="domain-card domain-stress">
            <span className="domain-icon">🧘</span>
            <h3>Stress</h3>
            <p>Niveau perçu, anxiété, relaxation, équilibre vie pro/perso et soutien social.</p>
          </div>
          <div className="domain-card domain-nutrition">
            <span className="domain-icon">🥗</span>
            <h3>Nutrition</h3>
            <p>Hydratation, caféine, fruits et légumes, aliments transformés et régularité des repas.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;