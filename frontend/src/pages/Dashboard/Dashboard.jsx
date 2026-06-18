import { useState, useEffect } from 'react';
import { parkirAPI, pembayaranAPI, kendaraanAPI } from '../../utils/api';
import { useAuth } from '../../utils/AuthContext';
import styles from './Dashboard.module.css';

function StatCard({ label, value, icon, color }) {
  return (
    <div className={styles.stat__card} style={{ '--card-color': color }}>
      <div className={styles.stat__icon}>{icon}</div>
      <div className={styles.stat__info}>
        <p className={styles.stat__label}>{label}</p>
        <h3 className={styles.stat__value}>{value}</h3>
      </div>
    </div>
  );
}

function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalParkir: 0,
    parkirAktif: 0,
    totalPembayaran: 0,
    totalKendaraan: 0,
  });
  const [recentParkir, setRecentParkir] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [parkirRes, pembayaranRes, kendaraanRes] = await Promise.allSettled([
          parkirAPI.getAll(),
          pembayaranAPI.getAll(),
          kendaraanAPI.getAll(),
        ]);

        const parkirData = parkirRes.status === 'fulfilled' ? parkirRes.value.data || [] : [];
        const pembayaranData = pembayaranRes.status === 'fulfilled' ? pembayaranRes.value.data || [] : [];
        const kendaraanData = kendaraanRes.status === 'fulfilled' ? kendaraanRes.value.data || [] : [];

        const aktif = parkirData.filter((p) => p.status === 'parkir').length;
        const totalBayar = pembayaranData.reduce(
          (sum, p) => sum + (parseInt(p.jumlah_bayar) || 0),
          0
        );

        setStats({
          totalParkir: parkirData.length,
          parkirAktif: aktif,
          totalPembayaran: totalBayar,
          totalKendaraan: kendaraanData.length,
        });

        setRecentParkir(parkirData.slice(0, 5));
      } catch (err) {
        console.error('Dashboard error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  function formatRupiah(amount) {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  }

  function formatDate(dateStr) {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleString('id-ID');
  }

  if (loading) return <div className={styles.loading}>Memuat data...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Dashboard</h2>
          <p className={styles.welcome}>Selamat datang, <strong>{user?.name}</strong> 👋</p>
        </div>
        <span className={styles.date}>
          {new Date().toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </span>
      </div>

      <div className={styles.stats__grid}>
        <StatCard label="Total Parkir" value={stats.totalParkir} icon="🅿️" color="#4361ee" />
        <StatCard label="Parkir Aktif" value={stats.parkirAktif} icon="🚗" color="#06d6a0" />
        <StatCard label="Total Pendapatan" value={formatRupiah(stats.totalPembayaran)} icon="💰" color="#f72585" />
        <StatCard label="Total Kendaraan" value={stats.totalKendaraan} icon="🚘" color="#118ab2" />
      </div>

      <div className={styles.section}>
        <h3 className={styles.section__title}>Aktivitas Parkir Terbaru</h3>
        <div className={styles.table__wrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID Parkir</th>
                <th>Plat Nomor</th>
                <th>Jenis</th>
                <th>Waktu Masuk</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentParkir.length === 0 ? (
                <tr>
                  <td colSpan={5} className={styles.empty}>Belum ada data parkir</td>
                </tr>
              ) : (
                recentParkir.map((p) => (
                  <tr key={p.id_parkir}>
                    <td>#{p.id_parkir}</td>
                    <td><strong>{p.plat_nomor}</strong></td>
                    <td style={{ textTransform: 'capitalize' }}>{p.jenis_kendaraan}</td>
                    <td>{formatDate(p.waktu_masuk)}</td>
                    <td>
                      <span className={`${styles.badge} ${p.status === 'parkir' ? styles.badge__aktif : styles.badge__selesai}`}>
                        {p.status === 'parkir' ? 'Aktif' : 'Selesai'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
