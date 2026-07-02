import { useState, useEffect } from 'react';
import { parkirAPI, pembayaranAPI } from '../../utils/api'; 
import Table from '../../components/Table/Table';
import Modal from '../../components/Modal/Modal';
import styles from './Parkir.module.css';

function Parkir() {
  const [parkirs, setParkirs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [showKeluar, setShowKeluar] = useState(false);
  const [checkInForm, setCheckInForm] = useState({ plat_nomor: '', jenis_kendaraan: 'motor' });
  
  const [keluarForm, setKeluarForm] = useState({ 
    id_parkir: '', 
    metode_pembayaran: 'tunai',
    jumlah_bayar: ''
  });
  
  const [message, setMessage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadParkir();
  }, []);

  async function loadParkir() {
    setLoading(true);
    try {
      const res = await parkirAPI.getAll();
      setParkirs(res.data || []);
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  }

  async function handleCheckIn(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await parkirAPI.checkIn(checkInForm);
      setMessage({ type: 'success', text: `Check-in berhasil! ID Parkir: #${res.data.id_parkir}` });
      setShowCheckIn(false);
      setCheckInForm({ plat_nomor: '', jenis_kendaraan: 'motor' });
      loadParkir();
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleKeluar(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      // Panggil API pembayaran (yang sudah handle keluar + bayar)
      const res = await pembayaranAPI.proses({
        id_parkir: parseInt(keluarForm.id_parkir),
        metode_pembayaran: keluarForm.metode_pembayaran,
        jumlah_bayar: parseInt(keluarForm.jumlah_bayar)
      });
      
      setMessage({ 
        type: 'success', 
        text: `Pembayaran berhasil! Total: Rp ${res.data.total_biaya?.toLocaleString('id-ID')} | Kembalian: Rp ${res.data.kembalian?.toLocaleString('id-ID')}` 
      });
      
      setShowKeluar(false);
      setKeluarForm({ id_parkir: '', metode_pembayaran: 'tunai', jumlah_bayar: '' });
      loadParkir();
    } catch (err) {
      setMessage({ type: 'error', text: err.message || err.data?.message });
    } finally {
      setSubmitting(false);
    }
  }

  function formatDate(d) {
    if (!d) return '-';
    return new Date(d).toLocaleString('id-ID');
  }

  const columns = [
    { key: 'id_parkir', label: 'ID', render: (v) => `#${v}` },
    { key: 'plat_nomor', label: 'Plat Nomor', render: (v) => <strong>{v}</strong> },
    { key: 'jenis_kendaraan', label: 'Jenis', render: (v) => <span style={{ textTransform: 'capitalize' }}>{v}</span> },
    { key: 'waktu_masuk', label: 'Waktu Masuk', render: (v) => formatDate(v) },
    { key: 'waktu_keluar', label: 'Waktu Keluar', render: (v) => formatDate(v) },
    { key: 'durasi_jam', label: 'Durasi', render: (v) => v ? `${v} jam` : '-' },
    {
      key: 'total_biaya',
      label: 'Total Biaya',
      render: (v) => v ? `Rp ${parseInt(v).toLocaleString('id-ID')}` : '-',
    },
    {
      key: 'status',
      label: 'Status',
      render: (v) => (
        <span className={`${styles.badge} ${v === 'parkir' ? styles.badge__aktif : styles.badge__selesai}`}>
          {v === 'parkir' ? 'Aktif' : 'Selesai'}
        </span>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Manajemen Parkir</h2>
          <p className={styles.subtitle}>Kelola check-in, check-out, dan pembayaran kendaraan</p>
        </div>
        <div className={styles.header__actions}>
          <button className={styles.btn__primary} onClick={() => setShowCheckIn(true)}>
            Check-In
          </button>
          <button className={styles.btn__warning} onClick={() => setShowKeluar(true)}>
            Keluar & Bayar
          </button>
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
            <h3 className={styles.card__title}>Data Parkir ({parkirs.length})</h3>
            <button className={styles.btn__refresh} onClick={loadParkir}>🔄 Refresh</button>
          </div>
          <Table columns={columns} data={parkirs} emptyText="Belum ada data parkir" />
        </div>
      )}

      {showCheckIn && (
        <Modal title="🅿Check-In Kendaraan" onClose={() => setShowCheckIn(false)}>
          <form onSubmit={handleCheckIn} className={styles.form}>
            <div className={styles.form__group}>
              <label className={styles.label}>Plat Nomor</label>
              <input
                className={styles.input}
                type="text"
                value={checkInForm.plat_nomor}
                onChange={(e) => setCheckInForm({ ...checkInForm, plat_nomor: e.target.value.toUpperCase() })}
                placeholder="Contoh: B 1234 ABC"
                required
                autoFocus
              />
            </div>
            <div className={styles.form__group}>
              <label className={styles.label}>Jenis Kendaraan</label>
              <select
                className={styles.input}
                value={checkInForm.jenis_kendaraan}
                onChange={(e) => setCheckInForm({ ...checkInForm, jenis_kendaraan: e.target.value })}
              >
                <option value="motor">Motor</option>
                <option value="mobil">Mobil</option>
                <option value="truk">Truk</option>
              </select>
            </div>
            <div className={styles.form__actions}>
              <button type="button" className={styles.btn__secondary} onClick={() => setShowCheckIn(false)}>
                Batal
              </button>
              <button type="submit" className={styles.btn__primary} disabled={submitting}>
                {submitting ? 'Memproses...' : 'Check-In'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {showKeluar && (
        <Modal title="Kendaraan Keluar & Pembayaran" onClose={() => setShowKeluar(false)}>
          <form onSubmit={handleKeluar} className={styles.form}>
            <div className={styles.form__group}>
              <label className={styles.label}>ID Parkir</label>
              <input
                className={styles.input}
                type="number"
                value={keluarForm.id_parkir}
                onChange={(e) => setKeluarForm({ ...keluarForm, id_parkir: e.target.value })}
                placeholder="Masukkan ID Parkir"
                required
                autoFocus
              />
              <small className={styles.hint}>Lihat ID Parkir pada tabel di bawah</small>
            </div>

            <div className={styles.form__group}>
              <label className={styles.label}>Metode Pembayaran</label>
              <select
                className={styles.input}
                value={keluarForm.metode_pembayaran}
                onChange={(e) => setKeluarForm({ ...keluarForm, metode_pembayaran: e.target.value })}
                required
              >
                <option value="tunai">Tunai</option>
                <option value="e-wallet">E-Wallet</option>
              </select>
            </div>

            <div className={styles.form__group}>
              <label className={styles.label}>Jumlah Bayar (Rp)</label>
              <input
                className={styles.input}
                type="number"
                value={keluarForm.jumlah_bayar}
                onChange={(e) => setKeluarForm({ ...keluarForm, jumlah_bayar: e.target.value })}
                placeholder="Contoh: 10000"
                required
              />
              <small className={styles.hint}>Lihat total biaya pada tabel. Sistem akan hitung kembalian otomatis</small>
            </div>

            <div className={styles.form__actions}>
              <button type="button" className={styles.btn__secondary} onClick={() => setShowKeluar(false)}>
                Batal
              </button>
              <button type="submit" className={styles.btn__warning} disabled={submitting}>
                {submitting ? 'Memproses...' : 'Konfirmasi & Bayar'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

export default Parkir;