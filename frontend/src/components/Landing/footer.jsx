export default function Footer() {
  return (
    <footer className="landing-footer">
      <div className="footer-container">
        
        {/* Bagian Grid Utama (Logo di kiri, Informasi di kanan) */}
        <div className="footer-grid parkink-custom-grid">
          
          {/* Kolom Kiri: Logo */}
          <div className="footer-column">
            <div className="footer-logo">
              <div className="footer-logo-icon">P</div>
              <span>ParkInk</span>
            </div>
          </div>

          {/* Kolom Kanan: Layanan Informasi */}
          <div className="footer-column footer-info-column">
            <h3>Layanan Informasi</h3>
            <ul>
              <li>Sentra Informasi & Pelayanan Publik ParkInk (SIPP ParkInk)</li>
              <li>Gedung Pusat Pelayanan Pengguna Terpadu (PPPT), Lt. Dasar</li>
              <li>Kampus STT Terpadu Nurul Fikri</li>
              <li className="footer-contact-gap">Telp. : 021 1500 002</li>
              <li>WhatsApp : 0815 1500 0002</li>
              <li>E-mail : sipp@parkink.id</li>
            </ul>
            
            {/* Social Media di bawah Informasi (Gaya UI) */}
            <div className="footer-social-ui">
              <a href="#" aria-label="Twitter">𝕏</a>
              <a href="#" aria-label="Facebook">Facebook</a>
              <a href="#" aria-label="Youtube">Youtube</a>
              <a href="#" aria-label="Instagram">Instagram</a>
              <a href="#" aria-label="LinkedIn">LinkedIn</a>
            </div>
          </div>

        </div>

        {/* Bagian Bawah (Copyright saja) */}
        <div className="footer-bottom">
          <p className="footer-copyright">
            © 2026 ParkInk. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
}