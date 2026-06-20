import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../utils/AuthContext';
import styles from './Sidebar.module.css';

const Sidebar = ({ isOpen, onToggle }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/parkir', label: 'Parkir' },
    { path: '/kendaraan', label: 'Kendaraan' },
    { path: '/pembayaran', label: 'Pembayaran' },
    { path: '/laporan', label: 'Laporan' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const capitalizeRole = (role) => {
    if (!role) return '';
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  return (
    <>
      {isOpen && <div className={styles.overlay} onClick={onToggle} />}
      <aside className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>P</span>
          <h2>ParkInk</h2>
          <button className={styles.closeBtn} onClick={onToggle}>✕</button>
        </div>
        <nav className={styles.nav}>
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`${styles.navItem} ${
                location.pathname === item.path ? styles.active : ''
              }`}
              onClick={() => {
                if (window.innerWidth <= 768) {
                  onToggle();
                }
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className={styles.userSection}>
          <div className={styles.userInfo}>
            <span className={styles.userName}>👤 {user?.name || user?.username || 'User'}</span>
            <span className={styles.role}>{capitalizeRole(user?.role)}</span>
          </div>
          <button className={styles.logoutBtn} onClick={handleLogout}>Logout</button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;