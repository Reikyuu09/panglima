import { Link } from 'react-router-dom';

export default function HeroHome() {
  return (
    <section className="hero-section">
      <div className="hero-container">
        <div className="hero-content">
          <h1 className="hero-title">
            Sistem Informasi Parkir Modern
          </h1>
          <p className="hero-subtitle">
            Kelola parkir dengan mudah, cepat, dan efisien. Fitur lengkap untuk admin dan petugas parkir.
          </p>
          <div className="hero-buttons">
            <Link to="/register" className="btn btn-primary">
              Mulai Sekarang <span>→</span>
            </Link>
            <Link to="/login" className="btn btn-secondary">
              Login
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}