import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="home-container">
      <header className="home-header">
        <h1>🧠 Cognitive Wellness Platform</h1>
        <p>Évaluez votre bien-être cognitif et recevez un plan d'action personnalisé</p>
      </header>

      <section className="home-features">
        <div className="feature-card">
          <h3>📋 Auto-évaluation</h3>
          <p>Questionnaire rapide sur le Sommeil, le Stress et la Nutrition</p>
        </div>
        <div className="feature-card">
          <h3>⚙️ Diagnostic Intelligent</h3>
          <p>Système expert à base de règles d'inférence</p>
        </div>
        <div className="feature-card">
          <h3>📊 Plan Personnalisé</h3>
          <p>Recommandations adaptées à votre profil</p>
        </div>
      </section>

      <div className="home-actions">
        <Link to="/assessment" className="btn btn-primary">
          Commencer l'évaluation
        </Link>
        <Link to="/login" className="btn btn-secondary">
          Se connecter
        </Link>
        <Link to="/register" className="btn btn-outline">
          Créer un compte
        </Link>
      </div>
    </div>
  );
};

export default HomePage;