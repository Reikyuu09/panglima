import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  const today = new Date().toISOString().split('T')[0];
  const firstOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];

  const [riwayat, setRiwayat] = useState([]);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(firstOfMonth);
  const [endDate, setEndDate] = useState(today);
  const [stats, setStats] = useState({ total: 0, pendapatan: 0, motor: 0, mobil: 0 });

  useEffect(() => {
    loadRiwayat();
  }, []);

  function loadRiwayat() {
    setLoading(true);
    // Pakai data dummy (simulasi) biar nggak crash karena lu belum ada file api.js
    const dummyData = [
      { id_parkir: '101', plat_nomor: 'B 1234 ABC', jenis_kendaraan: 'mobil', waktu_masuk: '2026-06-11T08:00:00', waktu_keluar: '2026-06-11T10:00:00', durasi_jam: 2, total_biaya: 10000, jumlah_bayar: 10000, metode_pembayaran: 'Tunai' },
      { id_parkir: '102', plat_nomor: 'D 4321 XYZ', jenis_kendaraan: 'motor', waktu_masuk: '2026-06-11T09:00:00', waktu_keluar: '2026-06-11T12:00:00', durasi_jam: 3, total_biaya: 6000, jumlah_bayar: 6000, metode_pembayaran: 'QRIS' }
    ];
    
    setTimeout(() => {
      setRiwayat(dummyData);
      const motor = dummyData.filter((d) => d.jenis_kendaraan === 'motor').length;
      const mobil = dummyData.filter((d) => d.jenis_kendaraan === 'mobil').length;
      const pendapatan = dummyData.reduce((sum, d) => sum + (parseInt(d.jumlah_bayar) || 0), 0);
      setStats({ total: dummyData.length, pendapatan, motor, mobil });
      setLoading(false);
    }, 1000);
  }

  function formatDate(d) {
    if (!d) return '-';
    return new Date(d).toLocaleString('id-ID');
  }

  function formatRupiah(v) {
    if (!v) return '-';
    return `Rp ${parseInt(v).toLocaleString('id-ID')}`;
  }

  return (
    <>
      <section id="center">
        <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="" />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </div>
        <div>
          <h1>Get started</h1>
          <p>
            Edit <code>src/App.jsx</code> and save to test <code>HMR</code>
          </p>
        </div>
        <button
          type="button"
          className="counter"
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
        </button>
      </section>
      <div className="ticks"></div>

      <section id="next-steps">
        <div id="docs">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#documentation-icon"></use>
          </svg>
          <h2>Documentation</h2>
          <p>Your questions, answered</p>
          <ul>
            <li>
              <a href="https://vite.dev/" target="_blank">
                <img className="logo" src={viteLogo} alt="" />
                Explore Vite
              </a>
            </li>
            <li>
              <a href="https://react.dev/" target="_blank">
                <img className="button-icon" src={reactLogo} alt="" />
                Learn more
              </a>
            </li>
          </ul>
        </div>
        <div id="social">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#social-icon"></use>
          </svg>
          <h2>Connect with us</h2>
          <p>Join the Vite community</p>
          <ul>
            <li>
              <a href="https://github.com/vitejs/vite" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#github-icon"></use>
                </svg>
                GitHub
              </a>
            </li>
            <li>
              <a href="https://chat.vite.dev/" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#discord-icon"></use>
                </svg>
                Discord
              </a>
            </li>
            <li>
              <a href="https://x.com/vite_js" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#x-icon"></use>
                </svg>
                X.com
              </a>
            </li>
            <li>
              <a href="https://bsky.app/profile/vite.dev" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#bluesky-icon"></use>
                </svg>
                Bluesky
              </a>
            </li>
          </ul>
        </div>
      </section>
      <div className="ticks"></div>
      <section id="spacer"></section>

      <div style={{ padding: '30px', fontFamily: 'sans-serif', backgroundColor: '#f9fafb', color: '#333', textAlign: 'left' }}>
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 5px 0' }}>Laporan Riwayat Parkir</h2>
          <p style={{ color: '#6b7280', margin: 0 }}>Laporan aktivitas parkir berdasarkan rentang tanggal</p>
        </div>

        {/* Kotak Filter */}
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '16px', margin: '0 0 15px 0' }}>🔍 Filter Tanggal</h3>
          <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-end' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: '#6b7280', fontWeight: 'bold', marginBottom: '5px' }}>Tanggal Mulai</label>
              <input style={{ padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }} type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: '#6b7280', fontWeight: 'bold', marginBottom: '5px' }}>Tanggal Akhir</label>
              <input style={{ padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }} type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
            <button style={{ padding: '9px 20px', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }} onClick={loadRiwayat}>
              {loading ? 'Memuat...' : '📊 Tampilkan'}
            </button>
          </div>
        </div>

        {/* Kotak Statistik */}
        {!loading && riwayat.length > 0 && (
          <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
            <div style={{ flex: 1, backgroundColor: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
              <span style={{ display: 'block', fontSize: '24px', fontWeight: 'bold' }}>{stats.total}</span>
              <span style={{ fontSize: '14px', color: '#6b7280' }}>Total Transaksi</span>
            </div>
            <div style={{ flex: 1, backgroundColor: '#fff', padding: '20px', borderRadius: '8px', borderLeft: '4px solid #f72585' }}>
              <span style={{ display: 'block', fontSize: '24px', fontWeight: 'bold', color: '#f72585' }}>Rp {stats.pendapatan.toLocaleString('id-ID')}</span>
              <span style={{ fontSize: '14px', color: '#6b7280' }}>Total Pendapatan</span>
            </div>
          </div>
        )}

        {/* Tabel Data */}
        <div style={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
          <div style={{ padding: '15px 20px', borderBottom: '1px solid #e5e7eb', backgroundColor: '#f9fafb' }}>
            <h3 style={{ margin: 0, fontSize: '16px' }}>Data Riwayat Parkir</h3>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                <th style={{ padding: '12px 20px', fontSize: '12px', color: '#6b7280', textTransform: 'uppercase' }}>Plat Nomor</th>
                <th style={{ padding: '12px 20px', fontSize: '12px', color: '#6b7280', textTransform: 'uppercase' }}>Masuk</th>
                <th style={{ padding: '12px 20px', fontSize: '12px', color: '#6b7280', textTransform: 'uppercase' }}>Keluar</th>
                <th style={{ padding: '12px 20px', fontSize: '12px', color: '#6b7280', textTransform: 'uppercase' }}>Dibayar</th>
              </tr>
            </thead>
            <tbody>
              {riwayat.map((item) => (
                <tr key={item.id_parkir} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '15px 20px' }}><strong>{item.plat_nomor}</strong></td>
                  <td style={{ padding: '15px 20px', fontSize: '14px' }}>{formatDate(item.waktu_masuk)}</td>
                  <td style={{ padding: '15px 20px', fontSize: '14px' }}>{formatDate(item.waktu_keluar)}</td>
                  <td style={{ padding: '15px 20px', fontWeight: 'bold' }}>{formatRupiah(item.jumlah_bayar)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

export default App
