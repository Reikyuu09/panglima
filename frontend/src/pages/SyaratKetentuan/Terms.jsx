import Header from '../../components/Landing/header'
import Footer from '../../components/Landing/footer'
import './terms.css'

export default function Terms() {
  return (
    <div className="terms-page">
      <Header />
      <main className="terms-main">
        <section className="terms-hero">
          <div className="container">
            <h1>Syarat & Ketentuan</h1>
            <p className="subtitle">
              Ketentuan penggunaan layanan ParkInk
            </p>
            <p className="updated">Terakhir diperbarui: 21 Juni 2026</p>
          </div>
        </section>

        <section className="terms-content">
          <div className="container">
            <div className="terms-section">
              <h2>1. Penerimaan Syarat</h2>
              <p>
                Dengan menggunakan layanan ParkInk, Anda setuju untuk terikat 
                dengan syarat dan ketentuan yang tercantum di bawah ini. Jika 
                Anda tidak setuju, harap tidak menggunakan layanan kami.
              </p>
            </div>

            <div className="terms-section">
              <h2>2. Deskripsi Layanan</h2>
              <p>
                ParkInk menyediakan sistem manajemen parkir berbasis web yang 
                memungkinkan pengelola parkir untuk:
              </p>
              <ul>
                <li>Mengelola check-in dan check-out kendaraan</li>
                <li>Memproses pembayaran berbagai metode</li>
                <li>Membuat laporan dan analytics</li>
                <li>Monitoring aktivitas parkir secara real-time</li>
              </ul>
            </div>

            <div className="terms-section">
              <h2>3. Akun Pengguna</h2>
              <p>
                Anda bertanggung jawab untuk menjaga kerahasiaan akun Anda dan 
                semua aktivitas yang terjadi di bawah akun Anda. Segera beri 
                tahu kami jika ada penggunaan yang tidak sah.
              </p>
            </div>

            <div className="terms-section">
              <h2>4. Biaya dan Pembayaran</h2>
              <p>
                Biaya langganan akan ditagih sesuai paket yang Anda pilih. 
                Pembayaran harus dilakukan di muka untuk setiap periode 
                langganan. Kami menerima berbagai metode pembayaran yang 
                tersedia di platform.
              </p>
            </div>

            <div className="terms-section">
              <h2>5. Pembatalan dan Pengembalian Dana</h2>
              <p>
                Anda dapat membatalkan langganan kapan saja. Tidak ada 
                pengembalian dana untuk periode yang sudah berjalan. Akses 
                ke layanan akan tetap tersedia hingga akhir periode 
                langganan yang sudah dibayar.
              </p>
            </div>

            <div className="terms-section">
              <h2>6. Privasi dan Keamanan Data</h2>
              <p>
                Kami berkomitmen untuk melindungi privasi dan keamanan data 
                Anda. Informasi lebih lanjut dapat dilihat di halaman 
                Kebijakan Privasi kami.
              </p>
            </div>

            <div className="terms-section">
              <h2>7. Batasan Tanggung Jawab</h2>
              <p>
                ParkInk tidak bertanggung jawab atas kerugian tidak langsung, 
                insidental, atau konsekuensial yang timbul dari penggunaan 
                atau ketidakmampuan menggunakan layanan kami.
              </p>
            </div>

            <div className="terms-section">
              <h2>8. Perubahan Syarat dan Ketentuan</h2>
              <p>
                Kami berhak mengubah syarat dan ketentuan ini kapan saja. 
                Perubahan akan diberitahukan melalui email atau notifikasi 
                di platform. Penggunaan lanjutan berarti penerimaan terhadap 
                perubahan tersebut.
              </p>
            </div>

            <div className="terms-section">
              <h2>9. Kontak</h2>
              <p>
                Untuk pertanyaan mengenai syarat dan ketentuan ini, silakan 
                hubungi kami di:
              </p>
              <div className="contact-info">
                <p><strong>Email:</strong> support@parkink.com</p>
                <p><strong>Telepon:</strong> (021) 1234-5678</p>
                <p><strong>Alamat:</strong> Jl. Teknologi No. 123, Jakarta</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}