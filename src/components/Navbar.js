"use client";

import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, User, Coffee, LogIn } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import styles from './Navbar.module.css';

import { useState, useEffect } from 'react';
import { subscribeToPendingOrdersCount } from '@/lib/data-service';

export default function Navbar() {
  const { user } = useAuth();
  const [pendingCount, setPendingCount] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (user?.phone) {
      const unsubscribe = subscribeToPendingOrdersCount(user.phone, (count) => {
        setPendingCount(count);
      });

      // Cleanup subscription on unmount
      return () => unsubscribe();
    } else {
      setPendingCount(0);
    }
  }, [user]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <Image
            src="/images/logo.png"
            alt="Cafe Kantina"
            width={120}
            height={100}
            priority
          />
        </Link>

        <button className={styles.hamburger} onClick={toggleMobileMenu} aria-label="Toggle menu">
          <span className={styles.hamburgerLine}></span>
          <span className={styles.hamburgerLine}></span>
          <span className={styles.hamburgerLine}></span>
        </button>

        <ul className={`${styles.navLinks} ${isMobileMenuOpen ? styles.navLinksOpen : ''}`}>
          <li>
            <Link href="/" className={styles.navLink}>
              Home
            </Link>
          </li>
          <li>
            <Link href="/drinks" className={styles.navLink}>
              <Coffee size={18} />
              Drinks
            </Link>
          </li>
          <li>
            <Link href="/about" className={styles.navLink}>
              About
            </Link>
          </li>
          <li>
            <Link href="/checkout" className={styles.navLink}>
              <ShoppingCart size={18} />
              Cart
            </Link>
          </li>
          {user ? (
            <li>
              <Link href="/account" className={styles.navLink} style={{ position: 'relative' }}>
                <User size={18} />
                {user.name.split(' ')[0]}
                {pendingCount > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-5px',
                    right: '-10px',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    {pendingCount}
                  </span>
                )}
              </Link>
            </li>
          ) : (
            <li>
              <Link href="/login" className={styles.navLink}>
                <LogIn size={18} />
                Login
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}
