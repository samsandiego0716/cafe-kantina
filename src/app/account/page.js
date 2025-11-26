"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import { subscribeToUserOrders } from "@/lib/data-service";

export const dynamic = 'force-dynamic';

export default function AccountPage() {
    const { user, logout, loading } = useAuth();
    const [orders, setOrders] = useState([]);
    const [ordersLoading, setOrdersLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
        }
    }, [user, loading, router]);

    useEffect(() => {
        if (user?.phone) {
            const unsubscribe = subscribeToUserOrders(user.phone, (liveOrders) => {
                setOrders(liveOrders);
                setOrdersLoading(false);
            });

            // Cleanup subscription on unmount
            return () => unsubscribe();
        }
    }, [user]);

    if (loading || !user) {
        return <div className={styles.container}><p>Loading...</p></div>;
    }

    return (
        <div className={styles.container}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 className={styles.title} style={{ marginBottom: 0 }}>My Account</h1>
                <button onClick={logout} className={styles.btn} style={{ width: 'auto', backgroundColor: '#666' }}>
                    Logout
                </button>
            </div>

            <div className={styles.orderCard} style={{ marginBottom: '2rem' }}>
                <h2>Profile</h2>
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Phone:</strong> {user.phone}</p>
                <p><strong>Address:</strong> {user.address}</p>
            </div>

            <h2 style={{ marginBottom: '1rem', color: 'var(--color-primary)' }}>Order History</h2>

            {ordersLoading ? (
                <p>Loading orders...</p>
            ) : orders.length === 0 ? (
                <p>No orders found.</p>
            ) : (
                orders.map((order) => (
                    <div key={order.id} className={styles.orderCard}>
                        <div className={styles.orderHeader}>
                            <span>Order #{order.id.slice(-6)}</span>
                            <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                            <span className={`${styles.status} ${styles['status' + order.status.replace(/\s+/g, '')]}`}>
                                {order.status}
                            </span>
                        </div>
                        <div>
                            {order.items.map((item, index) => (
                                <div key={index}>
                                    {item.quantity}x {item.name}
                                </div>
                            ))}
                        </div>
                        <div style={{ marginTop: '1rem', fontWeight: 'bold', textAlign: 'right' }}>
                            Total: ₱{order.total}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}
