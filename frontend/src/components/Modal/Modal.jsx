import styles from './Modal.module.css';

function Modal({ title, children, onClose }) {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modal__header}>
          <h3 className={styles.modal__title}>{title}</h3>
          <button className={styles.modal__close} onClick={onClose}>✕</button>
        </div>
        <div className={styles.modal__body}>{children}</div>
      </div>
    </div>
  );
}

export default Modal;
