import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">🧠</span>
          <span className="brand-text">CogniWell</span>
        </Link>

        <div className="navbar-links">
          {user ? (
            <>
              <Link to="/assessment" className="nav-link">
                📝 Nouveau Test
              </Link>
              <Link to="/dashboard" className="nav-link">
                📊 Tableau de bord
              </Link>
              <div className="nav-user">
                <span className="user-greeting">Bonjour, {user.name}</span>
                <button onClick={handleLogout} className="btn-logout">
                  Déconnexion
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Connexion</Link>
              <Link to="/register" className="btn-register">S'inscrire</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;