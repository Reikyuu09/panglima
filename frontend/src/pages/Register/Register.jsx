import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../../utils/api';
import styles from './Register.module.css';

function Register() {
  const [form, setForm] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    name: '',
    role: 'petugas'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (form.password !== form.confirmPassword) {
      setError('Password dan konfirmasi password tidak cocok');
      return;
    }

    if (form.password.length < 6) {
      setError('Password minimal 6 karakter');
      return;
    }

    setLoading(true);

    try {
      await authAPI.register({
        username: form.username,
        password: form.password,
        name: form.name,
        role: form.role
      });

      setSuccess('Registrasi berhasil! Mengarahkan ke login...');
      
      setTimeout(() => {
        navigate('/login');
      }, 1500);

    } catch (err) {
      setError(err.message || 'Registrasi gagal');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          {/* ✅ Logo sekarang bisa diklik untuk ke landing page */}
          <Link to="/" className={styles.brand}>
            🅿️ ParkInk
          </Link>
          <p className={styles.subtitle}>Sistem Informasi Manajemen Parkir</p>
        </div>
        
        <div className={styles.content}>
          <h2 className={styles.title}>Registrasi User</h2>

          {error && <div className={`${styles.alert} ${styles.alertError}`}>{error}</div>}
          {success && <div className={`${styles.alert} ${styles.alertSuccess}`}>{success}</div>}

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Nama Lengkap</label>
              <input
                className={styles.input}
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Masukkan nama lengkap"
                required
                autoFocus
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Username</label>
              <input
                className={styles.input}
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="Masukkan username"
                required
              />
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Password</label>
                <input
                  className={styles.input}
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Minimal 6 karakter"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Konfirmasi Password</label>
                <input
                  className={styles.input}
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Ulangi password"
                  required
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Role</label>
              <select
                className={styles.input}
                name="role"
                value={form.role}
                onChange={handleChange}
              >
                <option value="petugas">Petugas</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <button className={styles.button} type="submit" disabled={loading}>
              {loading ? 'Mendaftar...' : 'Daftar'}
            </button>
          </form>

          <div className={styles.footer}>
            Sudah punya akun? <Link to="/login" className={styles.link}>Login di sini</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;