import Header from '../../components/Landing/header'
import Footer from '../../components/Landing/footer'
import './pricing.css'

export default function Pricing() {
  return (
    <div className="pricing-page">
      <Header />
      <main className="pricing-main">
        <section className="pricing-hero">
          <div className="container">
            <h1>Paket Harga</h1>
            <p className="subtitle">
              Pilih paket yang sesuai dengan kebutuhan bisnis Anda
            </p>
          </div>
        </section>

        <section className="pricing-plans">
          <div className="container">
            <div className="plans-grid">
              {/* Paket Basic */}
              <div className="plan-card">
                <div className="plan-header">
                  <h3>Basic</h3>
                  <div className="plan-price">
                    <span className="currency">Rp</span>
                    <span className="amount">199.000</span>
                    <span className="period">/bulan</span>
                  </div>
                  <p className="plan-desc">Cocok untuk parkir skala kecil</p>
                </div>
                <ul className="plan-features">
                  <li>✓ Hingga 50 kendaraan/hari</li>
                  <li>✓ 1 pengguna</li>
                  <li>✓ Laporan dasar</li>
                  <li>✓ Pembayaran tunai</li>
                  <li>✓ Support email</li>
                  <li className="disabled">✗ Pembayaran digital</li>
                  <li className="disabled">✗ API access</li>
                </ul>
                <button className="btn btn-secondary">Pilih Paket</button>
              </div>

              {/* Paket Professional */}
              <div className="plan-card featured">
                <div className="plan-badge">Paling Populer</div>
                <div className="plan-header">
                  <h3>Professional</h3>
                  <div className="plan-price">
                    <span className="currency">Rp</span>
                    <span className="amount">499.000</span>
                    <span className="period">/bulan</span>
                  </div>
                  <p className="plan-desc">Untuk bisnis parkir menengah</p>
                </div>
                <ul className="plan-features">
                  <li>✓ Hingga 200 kendaraan/hari</li>
                  <li>✓ 5 pengguna</li>
                  <li>✓ Laporan lengkap</li>
                  <li>✓ Pembayaran tunai & digital</li>
                  <li>✓ Priority support</li>
                  <li>✓ Multi lokasi</li>
                  <li className="disabled">✗ API access</li>
                </ul>
                <button className="btn btn-primary">Pilih Paket</button>
              </div>

              {/* Paket Enterprise */}
              <div className="plan-card">
                <div className="plan-header">
                  <h3>Enterprise</h3>
                  <div className="plan-price">
                    <span className="currency">Rp</span>
                    <span className="amount">999.000</span>
                    <span className="period">/bulan</span>
                  </div>
                  <p className="plan-desc">Solusi lengkap untuk skala besar</p>
                </div>
                <ul className="plan-features">
                  <li>✓ Unlimited kendaraan</li>
                  <li>✓ Unlimited pengguna</li>
                  <li>✓ Laporan & analytics</li>
                  <li>✓ Semua metode pembayaran</li>
                  <li>✓ 24/7 dedicated support</li>
                  <li>✓ Multi lokasi</li>
                  <li>✓ API access</li>
                </ul>
                <button className="btn btn-secondary">Hubungi Kami</button>
              </div>
            </div>
          </div>
        </section>

        <section className="pricing-faq">
          <div className="container">
            <h2>Pertanyaan Umum</h2>
            <div className="faq-list">
              <div className="faq-item">
                <h4>Apakah ada masa percobaan gratis?</h4>
                <p>Ya, kami menyediakan free trial 14 hari untuk semua paket tanpa perlu kartu kredit.</p>
              </div>
              <div className="faq-item">
                <h4>Bisakah upgrade atau downgrade paket?</h4>
                <p>Tentu, Anda bisa mengubah paket kapan saja. Perubahan akan berlaku pada periode billing berikutnya.</p>
              </div>
              <div className="faq-item">
                <h4>Metode pembayaran apa saja yang tersedia?</h4>
                <p>Kami menerima transfer bank, kartu kredit/debit, QRIS, dan e-wallet (GoPay, OVO, DANA, dll).</p>
              </div>
              <div className="faq-item">
                <h4>Apakah ada biaya setup?</h4>
                <p>Tidak ada biaya setup untuk semua paket. Anda hanya membayar biaya langganan bulanan.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}