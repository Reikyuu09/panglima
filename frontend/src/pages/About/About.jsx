import './about.css'

export default function About() {
  return (
    <div className="about-page">

  <section id = "tentang-kami" className="about-content">
    <div className="container">

      <div className="about-section">
        <h2>Siapa Kami?</h2>

        <p>
          <strong>ParkInk</strong> merupakan Sistem Informasi Manajemen Parkir
          berbasis web yang dikembangkan untuk membantu pengelola parkir dalam
          mengelola kendaraan masuk, kendaraan keluar, transaksi pembayaran,
          serta penyusunan laporan secara otomatis.
        </p>

        <p>
          Dengan memanfaatkan teknologi modern, ParkInk menghadirkan proses
          operasional parkir yang lebih cepat, mengurangi kesalahan pencatatan,
          meningkatkan keamanan data, dan memberikan pengalaman yang lebih baik
          bagi petugas maupun pengelola parkir.
        </p>
      </div>

      <div className="about-section">
        <h2>Visi</h2>

        <p>
          Menjadi platform manajemen parkir yang modern, terpercaya, dan mudah
          digunakan untuk mendukung digitalisasi sistem parkir di Indonesia.
        </p>
      </div>

      <div className="about-section">
        <h2>Misi</h2>

        <ul className="mission-list">
          <li>
            Mengembangkan sistem parkir yang cepat, aman, dan mudah digunakan.
          </li>

          <li>
            Membantu pengelola parkir meningkatkan efisiensi operasional.
          </li>

          <li>
            Menyediakan transaksi pembayaran yang praktis dan transparan.
          </li>

          <li>
            Menyajikan laporan parkir secara real-time untuk mendukung
            pengambilan keputusan.
          </li>

          <li>
            Terus menghadirkan inovasi guna meningkatkan kualitas layanan parkir.
          </li>
        </ul>
      </div>

      <div className="about-section">
        <h2>Mengapa Memilih ParkInk?</h2>

        <ul className="mission-list">
          <li>Proses Check-In & Check-Out lebih cepat.</li>
          <li>Perhitungan tarif parkir otomatis.</li>
          <li>Riwayat pembayaran tersimpan dengan aman.</li>
          <li>Dashboard yang modern dan mudah dipahami.</li>
          <li>Data kendaraan tersimpan secara terpusat.</li>
          <li>Laporan parkir dapat dipantau kapan saja.</li>
        </ul>
      </div>

      <div className="stats-grid">

        <div className="stat-card">
          <div className="stat-number">24/7</div>
          <div className="stat-label">Sistem Siap Digunakan</div>
        </div>

        <div className="stat-card">
          <div className="stat-number">100%</div>
          <div className="stat-label">Transaksi Tercatat</div>
        </div>

        <div className="stat-card">
          <div className="stat-number">Real-Time</div>
          <div className="stat-label">Monitoring Data</div>
        </div>

        <div className="stat-card">
          <div className="stat-number">Secure</div>
          <div className="stat-label">Keamanan Data</div>
        </div>

      </div>

    </div>
  </section>
    </div>
  )
}