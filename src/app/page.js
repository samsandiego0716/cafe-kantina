import Link from 'next/link';
import { Coffee, Clock, MapPin } from 'lucide-react';
import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>Cafe Kantina</h1>
          <p>Experience the art of coffee in every sip.</p>
          <Link href="/drinks" className="btn btn-primary">
            Order Now
          </Link>
        </div>
      </section>

      <section className={`${styles.section} container`}>
        <h2 className={styles.sectionTitle}>Why Choose Us?</h2>
        <div className={styles.featuredGrid}>
          <div className={styles.featureCard}>
            <Coffee size={48} className={styles.featureIcon} />
            <h3>Premium Beans</h3>
            <p>Sourced from the finest growers around the world.</p>
          </div>
          <div className={styles.featureCard}>
            <Clock size={48} className={styles.featureIcon} />
            <h3>Fast Delivery</h3>
            <p>Hot coffee delivered to your doorstep in minutes.</p>
          </div>
          <div className={styles.featureCard}>
            <MapPin size={48} className={styles.featureIcon} />
            <h3>Local Favorite</h3>
            <p>Proudly serving our community with love.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
