import { useState, useEffect } from 'react';
import { kendaraanAPI } from '../../utils/api';
import { useAuth } from '../../utils/AuthContext';
import Table from '../../components/Table/Table';
import Modal from '../../components/Modal/Modal';
import styles from './Kendaraan.module.css';

function Kendaraan() {
  const { user } = useAuth();
  const isAdmin = user?.role?.toLowerCase() === 'admin';

  const [kendaraans, setKendaraans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [form, setForm] = useState({ plat_nomor: '', jenis_kendaraan: 'motor' });
  const [message, setMessage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadKendaraan();
  }, []);

  async function loadKendaraan() {
    setLoading(true);
    try {
      const res = await kendaraanAPI.getAll();
      setKendaraans(res.data || []);
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  }

  function openAdd() {
    setEditData(null);
    setForm({ plat_nomor: '', jenis_kendaraan: 'motor' });
    setShowModal(true);
  }

  function openEdit(row) {
    setEditData(row);
    setForm({ plat_nomor: row.plat_nomor, jenis_kendaraan: row.jenis_kendaraan });
    setShowModal(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editData) {
        await kendaraanAPI.update(editData.Id_kendaraan, form);
        setMessage({ type: 'success', text: 'Kendaraan berhasil diupdate' });
      } else {
        await kendaraanAPI.create(form);
        setMessage({ type: 'success', text: 'Kendaraan berhasil ditambahkan' });
      }
      setShowModal(false);
      loadKendaraan();
    } catch (err) {
      setMessage({ type: 'error', text: err.message || err.data?.message });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(row) {
    if (!confirm(`Hapus kendaraan ${row.plat_nomor}?`)) return;
    try {
      await kendaraanAPI.delete(row.Id_kendaraan);
      setMessage({ type: 'success', text: 'Kendaraan berhasil dihapus' });
      loadKendaraan();
    } catch (err) {
      setMessage({ type: 'error', text: err.message || err.data?.message });
    }
  }

  const columns = [
    { key: 'Id_kendaraan', label: 'ID', render: (v) => `#${v}` },
    { key: 'plat_nomor', label: 'Plat Nomor', render: (v) => <strong>{v}</strong> },
    {
      key: 'jenis_kendaraan',
      label: 'Jenis',
      render: (v) => <span style={{ textTransform: 'capitalize' }}>{v}</span>,
    },
    ...(isAdmin ? [{
      key: 'Id_kendaraan',
      label: 'Aksi',
      render: (v, row) => (
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          <button className={styles.btn__edit} onClick={() => openEdit(row)}>Edit</button>
          <button className={styles.btn__danger} onClick={() => handleDelete(row)}>Hapus</button>
        </div>
      ),
    }] : [])
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Data Kendaraan</h2>
          <p className={styles.subtitle}>
            {isAdmin 
              ? 'Kelola data kendaraan terdaftar (Admin)' 
              : 'Lihat data kendaraan terdaftar (Petugas)'}
          </p>
        </div>
        
        {isAdmin && (
          <button className={styles.btn__primary} onClick={openAdd}>
            ➕ Tambah Kendaraan
          </button>
        )}
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
            <h3 className={styles.card__title}>Daftar Kendaraan ({kendaraans.length})</h3>
            <button className={styles.btn__refresh} onClick={loadKendaraan}>🔄 Refresh</button>
          </div>
          <Table columns={columns} data={kendaraans} emptyText="Belum ada data kendaraan" />
        </div>
      )}

      {isAdmin && showModal && (
        <Modal
          title={editData ? '✏️ Edit Kendaraan' : '➕ Tambah Kendaraan'}
          onClose={() => setShowModal(false)}
        >
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.form__group}>
              <label className={styles.label}>Plat Nomor</label>
              <input
                className={styles.input}
                type="text"
                value={form.plat_nomor}
                onChange={(e) => setForm({ ...form, plat_nomor: e.target.value.toUpperCase() })}
                placeholder="Contoh: B 1234 ABC"
                required
                autoFocus
              />
            </div>
            <div className={styles.form__group}>
              <label className={styles.label}>Jenis Kendaraan</label>
              <select
                className={styles.input}
                value={form.jenis_kendaraan}
                onChange={(e) => setForm({ ...form, jenis_kendaraan: e.target.value })}
              >
                <option value="motor">Motor</option>
                <option value="mobil">Mobil</option>
                <option value="truk">Truk</option>
              </select>
            </div>
            <div className={styles.form__actions}>
              <button type="button" className={styles.btn__secondary} onClick={() => setShowModal(false)}>
                Batal
              </button>
              <button type="submit" className={styles.btn__primary} disabled={submitting}>
                {submitting ? 'Menyimpan...' : editData ? 'Update' : 'Tambah'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

export default Kendaraan;