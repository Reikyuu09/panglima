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
  
  // State untuk alur 2 tahap
  const [keluarStep, setKeluarStep] = useState(1);
  const [cariPlat, setCariPlat] = useState('');
  const [cariLoading, setCariLoading] = useState(false);
  const [dataKendaraan, setDataKendaraan] = useState(null);
  
  const [checkInForm, setCheckInForm] = useState({ 
    plat_nomor: '', 
    jenis_kendaraan: 'motor' 
  });
  const [keluarForm, setKeluarForm] = useState({ 
    metode_pembayaran: 'tunai',
    jumlah_bayar: ''
  });
  
  const [message, setMessage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadParkir();
  }, []);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (showCheckIn || showKeluar) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [showCheckIn, showKeluar]);

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
      setMessage({ 
        type: 'success', 
        text: `Check-in berhasil! ID Parkir: #${res.data.id_parkir}` 
      });
      setShowCheckIn(false);
      setCheckInForm({ plat_nomor: '', jenis_kendaraan: 'motor' });
      loadParkir();
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setSubmitting(false);
    }
  }

  // TAHAP 1: Cari kendaraan by plat nomor
  async function handleCariKendaraan(e) {
    e.preventDefault();
    setCariLoading(true);
    try {
      const res = await parkirAPI.cari(cariPlat);
      setDataKendaraan(res.data);
      setKeluarStep(2);
    } catch (err) {
      setMessage({ type: 'error', text: err.message || err.data?.message });
    } finally {
      setCariLoading(false);
    }
  }

  // TAHAP 2: Konfirmasi pembayaran
  async function handleKeluar(e) {
    e.preventDefault();
    if (!dataKendaraan) return;
    
    setSubmitting(true);
    try {
      const res = await pembayaranAPI.proses({
        id_parkir: dataKendaraan.id_parkir,
        metode_pembayaran: keluarForm.metode_pembayaran,
        jumlah_bayar: parseInt(keluarForm.jumlah_bayar)
      });
      
      setMessage({ 
        type: 'success', 
        text: `Pembayaran berhasil! Total: Rp ${res.data.total_biaya?.toLocaleString('id-ID')} | Kembalian: Rp ${res.data.kembalian?.toLocaleString('id-ID')}` 
      });
      
      closeKeluarModal();
      loadParkir();
    } catch (err) {
      setMessage({ type: 'error', text: err.message || err.data?.message });
    } finally {
      setSubmitting(false);
    }
  }

  function closeKeluarModal() {
    setShowKeluar(false);
    setKeluarStep(1);
    setCariPlat('');
    setDataKendaraan(null);
    setKeluarForm({ metode_pembayaran: 'tunai', jumlah_bayar: '' });
  }

  function formatDate(d) {
    if (!d) return '-';
    return new Date(d).toLocaleString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  function formatRupiah(angka) {
    if (!angka && angka !== 0) return '-';
    return `Rp ${parseInt(angka).toLocaleString('id-ID')}`;
  }

  const columns = [
    { 
      key: 'id_parkir', 
      label: 'ID', 
      render: (v) => <span className={styles.tableId}>#{v}</span>
    },
    { 
      key: 'plat_nomor', 
      label: 'Plat Nomor', 
      render: (v) => <strong className={styles.platNomor}>{v}</strong> 
    },
    { 
      key: 'jenis_kendaraan', 
      label: 'Jenis', 
      render: (v) => (
        <span className={styles.waktuText}>
          {v}
        </span>
      )
    },
    { 
      key: 'waktu_masuk', 
      label: 'Waktu Masuk', 
      render: (v) => (
        <span className={styles.waktuText}>
          {formatDate(v)}
        </span>
      )
    },
    { 
      key: 'waktu_keluar', 
      label: 'Waktu Keluar', 
      render: (v) => (
        <span className={styles.waktuText}>
          {formatDate(v)}
        </span>
      )
    },
    { 
      key: 'durasi_jam', 
      label: 'Durasi', 
      render: (v) => v ? (
        <span className={styles.waktuText}>
          {v} jam
        </span>
      ) : '-'
    },
    {
      key: 'total_biaya',
      label: 'Total Biaya',
      render: (v) => v ? (
        <span className={styles.totalBiaya}>
          {formatRupiah(v)}
        </span>
      ) : '-'
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
      {/* HEADER */}
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

      {/* ALERT MESSAGE */}
      {message && (
        <div className={`${styles.alert} ${message.type === 'success' ? styles.alert__success : styles.alert__error}`}>
          <span>{message.text}</span>
          <button className={styles.alert__close} onClick={() => setMessage(null)}>✕</button>
        </div>
      )}

      {/* TABLE CARD */}
      {loading ? (
        <div className={styles.loading}>
          <div>Memuat data...</div>
        </div>
      ) : (
        <div className={styles.card}>
          <div className={styles.card__header}>
            <h3 className={styles.card__title}>Data Parkir ({parkirs.length})</h3>
            <button className={styles.btn__refresh} onClick={loadParkir}>
              Refresh
            </button>
          </div>
          <Table columns={columns} data={parkirs} emptyText="Belum ada data parkir" />
        </div>
      )}

      {/* MODAL CHECK-IN */}
      {showCheckIn && (
        <Modal title="Check-In Kendaraan" onClose={() => setShowCheckIn(false)}>
          <div className={styles.modalBody}>
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
          </div>
        </Modal>
      )}

      {/* MODAL KELUAR & BAYAR - 2 TAHAP */}
      {showKeluar && (
        <Modal 
          title={keluarStep === 1 ? "Cari Kendaraan" : "Pembayaran & Struk"} 
          onClose={closeKeluarModal}
        >
          {/* SCROLLABLE CONTENT WRAPPER */}
          <div className={styles.modalBody}>
            {/* TAHAP 1: Cari Kendaraan */}
            {keluarStep === 1 && (
              <form onSubmit={handleCariKendaraan} className={styles.form}>
                <div className={styles.form__group}>
                  <label className={styles.label}>Plat Nomor Kendaraan</label>
                  <input
                    className={styles.input}
                    type="text"
                    value={cariPlat}
                    onChange={(e) => setCariPlat(e.target.value.toUpperCase())}
                    placeholder="Contoh: B 1234 ABC"
                    required
                    autoFocus
                  />
                  <small className={styles.hint}>
                    Masukkan plat nomor kendaraan yang akan keluar
                  </small>
                </div>
                <div className={styles.form__actions}>
                  <button type="button" className={styles.btn__secondary} onClick={closeKeluarModal}>
                    Batal
                  </button>
                  <button type="submit" className={styles.btn__warning} disabled={cariLoading}>
                    {cariLoading ? 'Mencari...' : 'Cari Kendaraan'}
                  </button>
                </div>
              </form>
         )}

            {/* TAHAP 2: Struk & Pembayaran */}
            {keluarStep === 2 && dataKendaraan && (
              <div className={styles.keluarWrapper}>
                {/* STRUK */}
                <div className={styles.struk}>
                  <div className={styles.struk__header}>
                    <h3>STRUK PARKIR</h3>
                    <p className={styles.struk__id}>ID Parkir: #{dataKendaraan.id_parkir}</p>
                  </div>
                  <div className={styles.struk__body}>
                    <div className={styles.struk__row}>
                      <span className={styles.struk__label}>Plat Nomor</span>
                      <span className={styles.struk__value}>{dataKendaraan.plat_nomor}</span>
                    </div>
                    <div className={styles.struk__row}>
                      <span className={styles.struk__label}>Jenis Kendaraan</span>
                      <span className={styles.struk__value} style={{ textTransform: 'capitalize' }}>
                        {dataKendaraan.jenis_kendaraan || dataKendaraan.jenis}
                      </span>
                    </div>
                    <div className={styles.struk__row}>
                      <span className={styles.struk__label}>Waktu Masuk</span>
                      <span className={styles.struk__value}>{formatDate(dataKendaraan.waktu_masuk)}</span>
                    </div>
                    <div className={styles.struk__divider}></div>
                    <div className={styles.struk__row}>
                      <span className={styles.struk__label}>Durasi Parkir</span>
                      <span className={styles.struk__value}>{dataKendaraan.durasi}</span>
                    </div>
                    <div className={`${styles.struk__row} ${styles.struk__total}`}>
                      <span className={styles.struk__label}>Total Biaya</span>
                      <span className={styles.struk__value}>{formatRupiah(dataKendaraan.total_biaya)}</span>
                    </div>
                  </div>
                </div>

                {/* FORM PEMBAYARAN */}
                <form onSubmit={handleKeluar} className={styles.form}>
                  <div className={styles.form__group}>
                    <label className={styles.label}>Metode Pembayaran</label>
                    <select
                      className={styles.input}
                      value={keluarForm.metode_pembayaran}
                      onChange={(e) => setKeluarForm({ ...keluarForm, metode_pembayaran: e.target.value })}
                      required
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
                      value={keluarForm.jumlah_bayar}
                      onChange={(e) => setKeluarForm({ ...keluarForm, jumlah_bayar: e.target.value })}
                      placeholder="Contoh: 10000"
                      required
                      min={dataKendaraan.total_biaya}
                    />
                    <small className={styles.hint}>
                      Minimum: {formatRupiah(dataKendaraan.total_biaya)}
                    </small>
                  </div>

                  <div className={styles.form__actions}>
                    <button 
                      type="button" 
                      className={styles.btn__secondary} 
                      onClick={() => {
                        setKeluarStep(1);
                        setDataKendaraan(null);
                      }}
                    >
                      Kembali
                    </button>
                    <button type="submit" className={styles.btn__warning} disabled={submitting}>
                      {submitting ? 'Memproses...' : 'Konfirmasi & Bayar'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}

export default Parkir;