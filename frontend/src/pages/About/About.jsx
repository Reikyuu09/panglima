import Header from '../../components/Landing/header'
import Footer from '../../components/Landing/footer'
import './about.css'

export default function About() {
  return (
    <div className="about-page">
      <Header />
      <main className="about-main">
        <section className="about-hero">
          <div className="container">
            <h1>Tentang Kami</h1>
            <p className="subtitle">
              Solusi parkir modern untuk Indonesia yang lebih efisien
            </p>
          </div>
        </section>

        <section className="about-content">
          <div className="container">
            <div className="about-section">
              <h2>Visi Kami</h2>
              <p>
                Menjadi platform manajemen parkir terdepan di Indonesia yang 
                mengedepankan teknologi modern, kemudahan penggunaan, dan 
                efisiensi operasional untuk membantu pengelola parkir meningkatkan 
                kualitas layanan mereka.
              </p>
            </div>

            <div className="about-section">
              <h2>Misi Kami</h2>
              <ul className="mission-list">
                <li>
                  <strong>Teknologi Modern:</strong> Menyediakan sistem parkir 
                  berbasis teknologi terkini yang handal dan aman
                </li>
                <li>
                  <strong>Kemudahan Penggunaan:</strong> Interface yang intuitif 
                  dan mudah digunakan oleh siapa saja
                </li>
                <li>
                  <strong>Efisiensi:</strong> Membantu mengurangi waktu tunggu 
                  dan meningkatkan produktivitas
                </li>
                <li>
                  <strong>Dukungan 24/7:</strong> Tim support yang siap membantu 
                  kapan saja Anda butuhkan
                </li>
              </ul>
            </div>

            <div className="about-section">
              <h2>Tentang ParkInk</h2>
              <p>
                ParkInk adalah sistem informasi manajemen parkir yang dirancang 
                khusus untuk memenuhi kebutuhan pengelola parkir modern. Dengan 
                fitur-fitur lengkap seperti check-in/check-out otomatis, 
                pembayaran digital, dan laporan real-time, kami membantu Anda 
                mengelola area parkir dengan lebih efisien.
              </p>
              <p>
                Didukung oleh tim profesional yang berpengalaman di bidang 
                teknologi dan manajemen parkir, ParkInk berkomitmen untuk terus 
                berinovasi dan memberikan solusi terbaik bagi mitra kami.
              </p>
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-number">1000+</div>
                <div className="stat-label">Pengguna Aktif</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">500+</div>
                <div className="stat-label">Lokasi Parkir</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">99%</div>
                <div className="stat-label">Kepuasan Pelanggan</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">24/7</div>
                <div className="stat-label">Dukungan Teknis</div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}