import { useState, useEffect } from 'react';
import { useAuth } from '../../utils/AuthContext';
import styles from './Petugas.module.css';

function Petugas() {
  const { user } = useAuth();
  const [petugasList, setPetugasList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    password: '',
    role: 'petugas',
    foto: null
  });
  const [previewFoto, setPreviewFoto] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    fetchPetugas();
  }, []);

  async function fetchPetugas() {
    try {
      setLoading(true);
      setError('');
      
      const token = localStorage.getItem('token');
      console.log('Token:', token); // Debug token
      
      if (!token) {
        setError('Token tidak ditemukan. Silakan login ulang.');
        setLoading(false);
        return;
      }

      const response = await fetch('http://localhost:3000/api/users', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Response status:', response.status); // Debug response

      // if (response.status === 401) {
      //   setError('Sesi expired. Silakan login ulang.');
      //   localStorage.removeItem('token');
      //   localStorage.removeItem('user');
      //   setTimeout(() => {
      //     window.location.href = '/login';
      //   }, 2000);
      //   return;
      // }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal mengambil data');
      }

      const result = await response.json();
      console.log('Data received:', result); // Debug data

      if (result.success && result.data) {
        // Filter hanya petugas (bukan admin)
        const petugasData = result.data.filter(p => p.role === 'petugas');
        console.log('Petugas data:', petugasData); // Debug filtered data
        setPetugasList(petugasData);
      } else {
        setError('Format data tidak valid');
      }
    } catch (err) {
      console.error('Error fetching petugas:', err);
      setError(err.message || 'Gagal memuat data petugas');
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, foto: file });
      setPreviewFoto(URL.createObjectURL(file));
    }
  }

  function openModal(mode = 'add', petugas = null) {
    setEditMode(mode === 'edit');
    if (mode === 'edit' && petugas) {
      setSelectedId(petugas.id_user);
      setFormData({
        username: petugas.username || '',
        name: petugas.name || '',
        password: '',
        role: 'petugas',
        foto: null
      });
      setPreviewFoto(petugas.foto ? `http://localhost:3000/uploads/${petugas.foto}` : null);
    } else {
      setFormData({
        username: '',
        name: '',
        password: '',
        role: 'petugas',
        foto: null
      });
      setPreviewFoto(null);
    }
    setShowModal(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const formDataToSend = new FormData();
      formDataToSend.append('username', formData.username);
      formDataToSend.append('name', formData.name);
      formDataToSend.append('role', formData.role);
      
      if (formData.password) {
        formDataToSend.append('password', formData.password);
      }
      
      if (formData.foto) {
        formDataToSend.append('foto', formData.foto);
      }

      const url = editMode 
        ? `http://localhost:3000/api/users/${selectedId}`
        : 'http://localhost:3000/api/users';
      
      const method = editMode ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      if (res.ok) {
        await fetchPetugas();
        setShowModal(false);
        setFormData({
          username: '',
          name: '',
          password: '',
          role: 'petugas',
          foto: null
        });
        setPreviewFoto(null);
      } else {
        const error = await res.json();
        alert(error.message || 'Operasi gagal');
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Yakin ingin menghapus petugas ini?')) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:3000/api/users/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        await fetchPetugas();
      } else {
        alert('Gagal menghapus petugas');
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Terjadi kesalahan');
    }
  }

  function closeModal() {
    setShowModal(false);
    setEditMode(false);
    setFormData({
      username: '',
      name: '',
      password: '',
      role: 'petugas',
      foto: null
    });
    setPreviewFoto(null);
  }

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.pageHeader}>
        <h1>Kelola Petugas</h1>
        <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={() => openModal('add')}>
          + Tambah Petugas
        </button>
      </div>

      {loading ? (
        <div className={styles.loading}>Memuat data...</div>
      ) : error ? (
        <div className={styles.error}>{error}</div>
      ) : (
        <div className={styles.petugasGrid}>
          {petugasList.length === 0 ? (
            <div className={styles.emptyState}>
              <p>Belum ada data petugas</p>
            </div>
          ) : (
            petugasList.map((petugas) => (
              <div key={petugas.id_user} className={styles.petugasCard}>
                <div className={styles.petugasFoto}>
                  {petugas.foto ? (
                    <img 
                      src={`http://localhost:3000/uploads/${petugas.foto}`} 
                      alt={petugas.name}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/150';
                      }}
                    />
                  ) : (
                    <div className={styles.fotoPlaceholder}>
                      <span>👤</span>
                    </div>
                  )}
                </div>
                <div className={styles.petugasInfo}>
                  <h3>{petugas.name}</h3>
                  <p className={styles.username}>@{petugas.username}</p>
                  <p className={styles.role}>Petugas</p>
                </div>
                <div className={styles.petugasActions}>
                  <button 
                    className={`${styles.btnSm} ${styles.btnEdit}`}
                    onClick={() => openModal('edit', petugas)}
                  >
                  Edit
                  </button>
                  <button 
                    className={`${styles.btnSm} ${styles.btnDelete}`}
                    onClick={() => handleDelete(petugas.id_user)}
                  >
                  Hapus
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {showModal && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>{editMode ? 'Edit Petugas' : 'Tambah Petugas Baru'}</h2>
              <button className={styles.modalClose} onClick={closeModal}>×</button>
            </div>
            
            <form className={styles.modalForm} onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label>Foto Profil</label>
                <div className={styles.fotoUpload}>
                  {previewFoto ? (
                    <img src={previewFoto} alt="Preview" className={styles.fotoPreview} />
                  ) : (
                    <div className={styles.fotoPlaceholderUpload}>
                      <span>👤</span>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className={styles.fileInput}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Nama Lengkap</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Masukkan nama lengkap"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  placeholder="Masukkan username"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Password {editMode && '(kosongkan jika tidak diubah)'}</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required={!editMode}
                  placeholder={editMode ? 'Kosongkan jika tidak diubah' : 'Masukkan password'}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="petugas">Petugas</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className={styles.modalActions}>
                <button type="button" className={`${styles.btn} ${styles.btnSecondary}`} onClick={closeModal}>
                  Batal
                </button>
                <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`} disabled={loading}>
                  {loading ? 'Menyimpan...' : (editMode ? 'Update' : 'Simpan')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Petugas;