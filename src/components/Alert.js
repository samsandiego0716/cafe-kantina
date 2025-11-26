import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './Alert.module.css';

export default function Alert({ message, onClose, type = 'info' }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Auto-close after 3 seconds
        const timer = setTimeout(() => {
            onClose();
        }, 3000);

        return () => clearTimeout(timer);
    }, [onClose]);

    if (!mounted) return null;

    return createPortal(
        <div className={styles.overlay} onClick={onClose}>
            <div className={`${styles.alert} ${styles[type]}`} onClick={(e) => e.stopPropagation()}>
                <div className={styles.icon}>
                    {type === 'success' && '✓'}
                    {type === 'error' && '✕'}
                    {type === 'info' && 'ℹ'}
                </div>
                <div className={styles.content}>
                    <p className={styles.message}>{message}</p>
                </div>
                <button className={styles.closeBtn} onClick={onClose}>
                    ✕
                </button>
            </div>
        </div>,
        document.body
    );
}
