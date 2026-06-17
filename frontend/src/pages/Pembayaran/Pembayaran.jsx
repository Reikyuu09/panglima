import { useState, useEffect } from 'react';
import { pembayaranAPI } from '../../utils/api';
import Table from '../../components/Table/Table';
import Modal from '../../components/Modal/Modal';
import styles from './Pembayaran.module.css';

function Pembayaran() {
  const [pembayarans, setPembayarans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    id_parkir: '',
    metode_pembayaran: 'tunai',
    jumlah_bayar: '',
  });
  const [message, setMessage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

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

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await pembayaranAPI.proses({
        id_parkir: parseInt(form.id_parkir),
        metode_pembayaran: form.metode_pembayaran,
        jumlah_bayar: parseInt(form.jumlah_bayar),
      });
      setMessage({
        type: 'success',
        text: `Pembayaran berhasil! Kembalian: Rp ${res.data.kembalian?.toLocaleString('id-ID')}`,
      });
      setShowModal(false);
      setForm({ id_parkir: '', metode_pembayaran: 'tunai', jumlah_bayar: '' });
      loadPembayaran();
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setSubmitting(false);
    }
  }

  function formatRupiah(v) {
    if (!v) return '-';
    return `Rp ${parseInt(v).toLocaleString('id-ID')}`;
  }

  function formatDate(d) {
    if (!d) return '-';
    return new Date(d).toLocaleString('id-ID');
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
          <p className={styles.subtitle}>Proses dan lihat riwayat pembayaran</p>
        </div>
        <button className={styles.btn__primary} onClick={() => setShowModal(true)}>
          💳 Proses Pembayaran
        </button>
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

      {showModal && (
        <Modal title="💳 Proses Pembayaran" onClose={() => setShowModal(false)}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.form__group}>
              <label className={styles.label}>ID Parkir</label>
              <input
                className={styles.input}
                type="number"
                value={form.id_parkir}
                onChange={(e) => setForm({ ...form, id_parkir: e.target.value })}
                placeholder="Masukkan ID Parkir"
                required
                autoFocus
              />
              <small className={styles.hint}>Gunakan ID Parkir dari halaman Parkir</small>
            </div>

            <div className={styles.form__group}>
              <label className={styles.label}>Metode Pembayaran</label>
              <select
                className={styles.input}
                value={form.metode_pembayaran}
                onChange={(e) => setForm({ ...form, metode_pembayaran: e.target.value })}
              >
                <option value="tunai">Tunai</option>
                <option value="qris">QRIS</option>
                <option value="e-wallet">E-Wallet</option>
              </select>
            </div>

            <div className={styles.form__group}>
              <label className={styles.label}>Jumlah Bayar (Rp)</label>
              <input
                className={styles.input}
                type="number"
                value={form.jumlah_bayar}
                onChange={(e) => setForm({ ...form, jumlah_bayar: e.target.value })}
                placeholder="Contoh: 10000"
                required
                min={0}
              />
            </div>

            <div className={styles.form__actions}>
              <button type="button" className={styles.btn__secondary} onClick={() => setShowModal(false)}>
                Batal
              </button>
              <button type="submit" className={styles.btn__primary} disabled={submitting}>
                {submitting ? 'Memproses...' : 'Bayar'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

export default Pembayaran;
