import styles from './Footer.module.css';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.column}>
                    <h3>Cafe Kantina</h3>
                    <p>Brewing moments of happiness, one cup at a time.</p>
                </div>
                <div className={styles.column}>
                    <h3>Contact Us</h3>
                    <p>Norzagaray, Bulacan</p>
                    <p>Phone: 0961 214 2824</p>
                </div>
                <div className={styles.column}>
                    <h3>Hours</h3>
                    <p>Mon-Sun: 4pm - 11pm</p>
                </div>
            </div>
            <div className={styles.copyright}>
                &copy; {new Date().getFullYear()} Cafe Kantina. All rights reserved.
            </div>
        </footer>
    );
}
