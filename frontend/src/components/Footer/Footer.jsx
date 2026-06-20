import styles from './Footer.module.css';

function Footer() {
  return (
    <div className={styles.container}>
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.brand}>
            <span className={styles.logoIcon}>P</span>
            <span>ParkInk</span>
          </div>
          <p className={styles.footer__text}>Sistem Informasi Manajemen Parkir</p>
          <p className={styles.footer__copy}>© 2025 ParkInk. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Footer;