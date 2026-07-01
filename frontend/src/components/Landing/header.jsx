import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="landing-header">
      <div className="header-container">
        <Link to="/" className="header-logo">
          <div className="logo-icon">P</div>
          <span className="logo-text">ParkInk</span>
        </Link>
        
        <nav className="header-nav">
          <a href="#tentang-kami" className="nav-link">
            Tentang Kami
          </a>
          <a href="#fitur" className="nav-link">
            Fitur
          </a>
          <a href="#harga" className="nav-link">
            Tarif
          </a>
          <a href="#faq" className="nav-link">
            FAQ
          </a>
        </nav>

        <div className="header-buttons">
          <Link to="/login" className="btn btn-secondary btn-sm">
            Login
          </Link>
          <Link to="/register" className="btn btn-primary btn-sm">
            Register
          </Link>
        </div>
      </div>
    </header>
  );
}