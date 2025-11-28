import Link from 'next/link';
import { Coffee, Clock, MapPin } from 'lucide-react';
import styles from './page.module.css';
import FuzzyText from '@/components/FuzzyText';
import CircularGallery from '@/components/CircularGallery';

export default function Home() {
  const galleryItems = [
    { image: '/images/gallery/gallery-1.jpg', text: 'Taipei' },
    { image: '/images/gallery/gallery-2.jpg', text: 'Beach Brew' },
    { image: '/images/gallery/gallery-3.jpg', text: 'Nature Cup' },
    { image: '/images/gallery/gallery-4.jpg', text: 'Waterfall' },
    { image: '/images/gallery/gallery-5.jpg', text: 'Apple Sour' },
    { image: '/images/gallery/gallery-6.jpg', text: 'Berry Milk' },
    { image: '/images/gallery/gallery-7.jpg', text: 'Spanish Latte' },
    { image: '/images/gallery/gallery-8.jpg', text: 'Mocha' },
  ];

  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <FuzzyText
            fontSize="clamp(3rem, 8vw, 6rem)"
            fontWeight={900}
            color="#ebebebff"
            enableHover={true}
          >
            Cafe Kantina
          </FuzzyText>
          <p>Experience the art of coffee in every sip.</p>
          <Link href="/drinks" className="btn btn-primary">
            Order Now
          </Link>
        </div>
      </section>

      <section className={styles.gallerySection} style={{ height: '600px', position: 'relative', overflow: 'hidden' }}>
        <CircularGallery items={galleryItems} bend={3} textColor="rgba(44, 24, 16, 0.9)" borderRadius={0.05} />
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
