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
          <Link to="/tentang" className="nav-link">Tentang Kami</Link>
          <Link to="/harga" className="nav-link">Harga</Link>
          <Link to="/syarat" className="nav-link">Syarat & Ketentuan</Link>
        </nav>

        <div className="header-buttons">
          <Link to="/login" className="btn btn-secondary btn-sm">
            Sign In
          </Link>
          <Link to="/register" className="btn btn-primary btn-sm">
            Register
          </Link>
        </div>
      </div>
    </header>
  );
}