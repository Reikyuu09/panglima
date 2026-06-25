import { useState, useEffect } from 'react';
import { laporanAPI } from '../../utils/api';
import Table from '../../components/Table/Table';
import styles from './Laporan.module.css';

function Laporan() {
  const today = new Date().toISOString().split('T')[0];
  const firstOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    .toISOString().split('T')[0];

  const [riwayat, setRiwayat] = useState([]);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(firstOfMonth);
  const [endDate, setEndDate] = useState(today);
  const [message, setMessage] = useState(null);
  const [stats, setStats] = useState({ total: 0, pendapatan: 0, motor: 0, mobil: 0 });

  useEffect(() => {
    loadRiwayat();
  }, []);

  async function loadRiwayat() {
    setLoading(true);
    setMessage(null);
    try {
      const res = await laporanAPI.getRiwayat(startDate, endDate);
      const data = res.data.data || [];
      setRiwayat(data);

      const motor = data.filter((d) => d.jenis_kendaraan === 'motor').length;
      const mobil = data.filter((d) => d.jenis_kendaraan === 'mobil').length;
      const pendapatan = data.reduce((sum, d) => sum + (parseInt(d.jumlah_bayar) || 0), 0);
      setStats({ total: data.length, pendapatan, motor, mobil });
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  }

  function formatDate(d) {
    if (!d) return '-';
    return new Date(d).toLocaleString('id-ID');
  }

  function formatRupiah(v) {
    if (!v) return '-';
    return `Rp ${parseInt(v).toLocaleString('id-ID')}`;
  }

  const columns = [
    { key: 'id_parkir', label: 'ID Parkir', render: (v) => `#${v}` },
    { key: 'plat_nomor', label: 'Plat Nomor', render: (v) => <strong>{v}</strong> },
    {
      key: 'jenis_kendaraan',
      label: 'Jenis',
      render: (v) => <span style={{ textTransform: 'capitalize' }}>{v}</span>,
    },
    { key: 'waktu_masuk', label: 'Masuk', render: (v) => formatDate(v) },
    { key: 'waktu_keluar', label: 'Keluar', render: (v) => formatDate(v) },
    { key: 'durasi_jam', label: 'Durasi', render: (v) => v ? `${v} jam` : '-' },
    { key: 'total_biaya', label: 'Total Biaya', render: (v) => formatRupiah(v) },
    { key: 'jumlah_bayar', label: 'Dibayar', render: (v) => formatRupiah(v) },
    { key: 'metode_pembayaran', label: 'Metode', render: (v) => v || '-' },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Laporan Riwayat Parkir</h2>
          <p className={styles.subtitle}>Laporan aktivitas parkir berdasarkan rentang tanggal</p>
        </div>
      </div>

      {/* Filter */}
      <div className={styles.filter__card}>
        <h3 className={styles.filter__title}>🔍 Filter Tanggal</h3>
        <div className={styles.filter__row}>
          <div className={styles.form__group}>
            <label className={styles.label}>Tanggal Mulai</label>
            <input
              className={styles.input}
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className={styles.form__group}>
            <label className={styles.label}>Tanggal Akhir</label>
            <input
              className={styles.input}
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <div className={styles.filter__btn__wrap}>
            <button className={styles.btn__primary} onClick={loadRiwayat} disabled={loading}>
              🔍 Cari
            </button>
          </div>
        </div>
      </div>

      {message && (
        <div className={`${styles.alert} ${message.type === 'success' ? styles.alert__success : styles.alert__error}`}>
          {message.text}
          <button className={styles.alert__close} onClick={() => setMessage(null)}>✕</button>
        </div>
      )}

      {/* Summary Stats */}
      {!loading && riwayat.length > 0 && (
        <div className={styles.stats__row}>
          <div className={styles.stat__mini}>
            <span className={styles.stat__num}>{stats.total}</span>
            <span className={styles.stat__lbl}>Total Transaksi</span>
          </div>
          <div className={styles.stat__mini}>
            <span className={styles.stat__num}>{stats.motor}</span>
            <span className={styles.stat__lbl}>Motor</span>
          </div>
          <div className={styles.stat__mini}>
            <span className={styles.stat__num}>{stats.mobil}</span>
            <span className={styles.stat__lbl}>Mobil</span>
          </div>
          <div className={styles.stat__mini} style={{ '--c': '#f72585' }}>
            <span className={styles.stat__num} style={{ color: '#f72585' }}>
              Rp {stats.pendapatan.toLocaleString('id-ID')}
            </span>
            <span className={styles.stat__lbl}>Total Pendapatan</span>
          </div>
        </div>
      )}

      {message && (
        <div className={`${styles.alert} ${message.type === 'success' ? styles.alert__success : styles.alert__error}`}>
          {message.text}
          <button className={styles.alert__close} onClick={() => setMessage(null)}>✕</button>
        </div>
      )}

      {/* Summary Stats */}
      {!loading && riwayat.length > 0 && (
        <div className={styles.stats__row}>
          <div className={styles.stat__mini}>
            <span className={styles.stat__num}>{stats.total}</span>
            <span className={styles.stat__lbl}>Total Transaksi</span>
          </div>
          <div className={styles.stat__mini}>
            <span className={styles.stat__num}>{stats.motor}</span>
            <span className={styles.stat__lbl}>Motor</span>
          </div>
          <div className={styles.stat__mini}>
            <span className={styles.stat__num}>{stats.mobil}</span>
            <span className={styles.stat__lbl}>Mobil</span>
          </div>
          <div className={styles.stat__mini} style={{ '--c': '#f72585' }}>
            <span className={styles.stat__num} style={{ color: '#f72585' }}>
              Rp {stats.pendapatan.toLocaleString('id-ID')}
            </span>
            <span className={styles.stat__lbl}>Total Pendapatan</span>
          </div>
        </div>
      )}

    {}
      <div className={styles.card}>
        <div className={styles.card__header}>
          <h3 className={styles.card__title}>Riwayat Parkir ({riwayat.length})</h3>
        </div>
        <Table 
          columns={columns} 
          data={riwayat} 
          emptyText={loading ? "⏳ Belum ada laporan" : "Belum ada data laporan."} 
        />
      </div>
    </div>
  );
}

export default Laporan;
