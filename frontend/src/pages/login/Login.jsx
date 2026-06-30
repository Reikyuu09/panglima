import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../../utils/api';
import { useAuth } from '../../utils/AuthContext';
import styles from './Login.module.css';

function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await authAPI.login(form);
      login(res.data.user, res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login gagal');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.card__header}>
          {/* ✅ Logo sekarang bisa diklik untuk ke landing page */}
          <Link to="/" className={styles.brand}>
            🅿️ ParkInk
          </Link>
          <p className={styles.subtitle}>Sistem Informasi Manajemen Parkir</p>
        </div>
        <form className={styles.form} onSubmit={handleSubmit}>
          <h2 className={styles.form__title}>Masuk</h2>

          {error && <div className={styles.alert}>{error}</div>}

          <div className={styles.form__group}>
            <label className={styles.label}>Username</label>
            <input
              className={styles.input}
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Masukkan username"
              required
              autoFocus
            />
          </div>

          <div className={styles.form__group}>
            <label className={styles.label}>Password</label>
            <input
              className={styles.input}
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Masukkan password"
              required
            />
          </div>

          <button className={styles.btn} type="submit" disabled={loading}>
            {loading ? 'Memproses...' : 'Login'}
          </button>
        </form>

        <div className={styles.footer}>
          Belum punya akun? <Link to="/register" className={styles.link}>Daftar di sini</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;