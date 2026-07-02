import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { laporanAPI } from '../../utils/api';
import { useAuth } from '../../utils/AuthContext';
import Table from '../../components/Table/Table';
import styles from './Laporan.module.css';

function Laporan() {
  const { user } = useAuth();
  const isAdmin = user?.role?.toLowerCase() === 'admin';

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  // Fix timezone issue
  const getDateStr = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const today = new Date();
  const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const [riwayat, setRiwayat] = useState([]);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(getDateStr(firstOfMonth));
  const [endDate, setEndDate] = useState(getDateStr(today));
  const [message, setMessage] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    pendapatan: 0,
    motor: 0,
    mobil: 0,
    truk: 0,
  });

  // useEffect(() => {
  //   loadRiwayat();
  // }, []);

  async function loadRiwayat() {
    setLoading(true);
    setMessage(null);

    try {
      const res = await laporanAPI.getRiwayat(startDate, endDate);
      const data = res.data || [];
      console.log('jenis_kendaraan values:', data.map(d => d.jenis_kendaraan));

      setRiwayat(data);

      if (data.length === 0) {
        setMessage({
          type: 'info',
          text: 'Tidak ada data parkir dalam rentang tanggal ini. Coba ubah filter tanggal.',
        });
      } else {
        setMessage({
          type: 'success',
          text: `Berhasil memuat ${data.length} data parkir.`,
        });
        // Auto hide success message
        setTimeout(() => setMessage(null), 3000);
      }

      const motor = data.filter((d) => d.jenis_kendaraan === 'motor').length;
      const mobil = data.filter((d) => d.jenis_kendaraan === 'mobil').length;
      const truk = data.filter((d) => d.jenis_kendaraan?.toLowerCase() === 'truk').length;
      const pendapatan = data.reduce(
        (sum, d) => sum + (parseInt(d.total_biaya) || 0),
        0
      );

      setStats({ total: data.length, pendapatan, motor, mobil, truk});
    } catch (err) {
      console.error('Load riwayat error:', err);
      setRiwayat([]);

      if (err.response?.status === 401) {
        setMessage({
          type: 'error',
          text: 'Sesi habis. Silakan login ulang.',
        });
      } else if (err.response?.status === 403) {
        setMessage({
          type: 'error',
          text: 'Anda tidak memiliki akses untuk melihat laporan.',
        });
      } else {
        setMessage({
          type: 'error',
          text: `Gagal memuat data: ${err.response?.data?.message || err.message || 'Unknown error'}`,
        });
      }
    } finally {
      setLoading(false);
    }
  }

  function formatDate(d) {
    if (!d) return '-';
    return new Date(d).toLocaleString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  function formatRupiah(v) {
    if (!v) return 'Rp 0';
    return `Rp ${parseInt(v).toLocaleString('id-ID')}`;
  }

  const columns = [
    {
      key: 'id_parkir',
      label: 'ID',
      render: (v) => <span style={{ color: '#4169e1' }}>#{v}</span>,
    },
    {
      key: 'plat_nomor',
      label: 'Plat Nomor',
      render: (v) => <strong>{v || '-'}</strong>,
    },
    {
      key: 'jenis_kendaraan',
      label: 'Jenis',
      render: (v) => {
        const isMotor = v === 'motor';
        return (
          <span
            style={{
              background: isMotor ? 'rgba(59, 130, 246, 0.2)' : 'rgba(249, 115, 22, 0.2)',
              color: isMotor ? '#3b82f6' : '#f97316',
              padding: '2px 10px',
              borderRadius: '20px',
              fontSize: '0.8rem',
              textTransform: 'capitalize',
            }}
          >
            {v || '-'}
          </span>
        );
      },
    },
    { key: 'waktu_masuk', label: 'Masuk', render: (v) => formatDate(v) },
    { key: 'waktu_keluar', label: 'Keluar', render: (v) => formatDate(v) },
    {
      key: 'durasi_jam',
      label: 'Durasi',
      render: (v) => (v ? `${v} jam` : '-'),
    },
    {
      key: 'total_biaya',
      label: 'Total Biaya',
      render: (v) => <span style={{ color: '#f72585' }}>{formatRupiah(v)}</span>,
    },
    { key: 'jumlah_bayar', label: 'Dibayar', render: (v) => formatRupiah(v) },
    {
      key: 'metode_pembayaran',
      label: 'Metode',
      render: (v) => (
        <span style={{ textTransform: 'capitalize' }}>{v || '-'}</span>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Laporan Riwayat Parkir</h2>
          <p className={styles.subtitle}>
            Laporan aktivitas parkir berdasarkan rentang tanggal
          </p>
        </div>
      </div>

      {/* Filter Card */}
      <div className={styles.filter__card}>
        <h3 className={styles.filter__title}>Filter Tanggal</h3>
        <div className={styles.filter__row}>
          <div className={styles.form__group}>
            <label className={styles.label}>Tanggal Mulai</label>
            <input
              className={styles.input}
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className={styles.form__group}>
            <label className={styles.label}>Tanggal Akhir</label>
            <input
              className={styles.input}
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className={styles.filter__btn__wrap}>
            <button
              className={styles.btn__primary}
              onClick={loadRiwayat}
              disabled={loading}
            >
              {loading ? (
                <span className={styles.btn__loading}>
                  <span className={styles.spinner}></span>
                  Memuat...
                </span>
              ) : (
                'Tampilkan'
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Alert Message */}
      {message && (
        <div
          className={`${styles.alert} ${
            styles[`alert__${message.type}`]
          }`}
        >
          <span>{message.text}</span>
          <button
            className={styles.alert__close}
            onClick={() => setMessage(null)}
          >
            ✕
          </button>
        </div>
      )}

      {/* Stats */}
      {!loading && riwayat.length > 0 && (
        <div className={styles.stats__row}>
          <div className={styles.stat__mini}>
            <span className={styles.stat__icon}></span>
            <span className={styles.stat__num}>{stats.total}</span>
            <span className={styles.stat__lbl}>Total Transaksi</span>
          </div>
          <div className={styles.stat__mini}>
            <span className={styles.stat__icon}></span>
            <span className={styles.stat__num}>{stats.motor}</span>
            <span className={styles.stat__lbl}>Motor</span>
          </div>
          <div className={styles.stat__mini}>
            <span className={styles.stat__icon}></span>
            <span className={styles.stat__num}>{stats.mobil}</span>
            <span className={styles.stat__lbl}>Mobil</span>
          </div>
          <div className={styles.stat__mini}>
            <span className={styles.stat__icon}></span>
            <span className={styles.stat__num}>{stats.truk}</span>
            <span className={styles.stat__lbl}>Truk</span>
          </div>
          <div className={styles.stat__mini}>
            <span className={styles.stat__icon}></span>
            <span className={styles.stat__num} style={{ color: '#10b981' }}>
              {formatRupiah(stats.pendapatan)}
            </span>
            <span className={styles.stat__lbl}>Total Pendapatan</span>
          </div>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className={styles.loading}>
          <div className={styles.loading__spinner}></div>
          <p>Memuat data laporan...</p>
        </div>
      ) : (
        <div className={styles.card}>
          <div className={styles.card__header}>
            <h3 className={styles.card__title}>
              Riwayat Parkir ({riwayat.length} data)
            </h3>
            {riwayat.length > 0 && (
              <span className={styles.card__badge}>
                {startDate} s/d {endDate}
              </span>
            )}
          </div>
          <Table
            columns={columns}
            data={riwayat}
            emptyText="Silakan pilih tanggal di atas, lalu klik 'Tampilkan' untuk memuat data"
          />
        </div>
      )}
    </div>
  );
}

export default Laporan;