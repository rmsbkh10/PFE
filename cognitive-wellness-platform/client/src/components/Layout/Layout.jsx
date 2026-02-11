import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import './Layout.css';

const Layout = () => {
  return (
    <div className="layout">
      <Navbar />
      <main className="main-content">
        <Outlet />
      </main>
      <footer className="footer">
        <p>© 2024 CogniWell — Plateforme de Self-Assessment Cognitif</p>
      </footer>
    </div>
  );
};

export default Layout;