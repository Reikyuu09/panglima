import { useState, useEffect } from 'react';
import { pembayaranAPI } from '../../utils/api';
import Table from '../../components/Table/Table';
import styles from './Pembayaran.module.css';

function Pembayaran() {
  const [pembayarans, setPembayarans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    loadPembayaran();
  }, []);

  async function loadPembayaran() {
    setLoading(true);
    try {
      const res = await pembayaranAPI.getAll();
      setPembayarans(res.data || []);
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  }

  function formatRupiah(v) {
    if (!v) return '-';
    return `Rp ${parseInt(v).toLocaleString('id-ID')}`;
  }

  function formatDate(d) {
    if (!d) return '-';
    const date = new Date(d);
    return date.toLocaleString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  }

  const columns = [
    { key: 'id_pembayaran', label: 'ID', render: (v) => `#${v}` },
    { key: 'id_parkir', label: 'ID Parkir', render: (v) => `#${v}` },
    { key: 'plat_nomor', label: 'Plat Nomor', render: (v) => <strong>{v || '-'}</strong> },
    { key: 'jumlah_bayar', label: 'Jumlah Bayar', render: (v) => formatRupiah(v) },
    { key: 'kembalian', label: 'Kembalian', render: (v) => formatRupiah(v) },
    {
      key: 'metode_pembayaran',
      label: 'Metode',
      render: (v) => <span style={{ textTransform: 'capitalize' }}>{v}</span>,
    },
    {
      key: 'status_pembayaran',
      label: 'Status',
      render: (v) => (
        <span className={`${styles.badge} ${styles.badge__lunas}`}>
          {v || 'Lunas'}
        </span>
      ),
    },
    { key: 'waktu_bayar', label: 'Waktu Bayar', render: (v) => formatDate(v) },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Pembayaran Parkir</h2>
          <p className={styles.subtitle}>Riwayat pembayaran parkir</p>
        </div>
      </div>

      {message && (
        <div className={`${styles.alert} ${message.type === 'success' ? styles.alert__success : styles.alert__error}`}>
          {message.text}
          <button className={styles.alert__close} onClick={() => setMessage(null)}>✕</button>
        </div>
      )}

      {loading ? (
        <div className={styles.loading}>Memuat data...</div>
      ) : (
        <div className={styles.card}>
          <div className={styles.card__header}>
            <h3 className={styles.card__title}>Riwayat Pembayaran ({pembayarans.length})</h3>
            <button className={styles.btn__refresh} onClick={loadPembayaran}>🔄 Refresh</button>
          </div>
          <Table columns={columns} data={pembayarans} emptyText="Belum ada data pembayaran" />
        </div>
      )}
    </div>
  );
}

export default Pembayaran;