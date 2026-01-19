"use client";

import AdminLogin from "./AdminLogin";
import AdminTabs from "./AdminTabs";
import ProductForm from "./ProductForm";
import ProductList from "./ProductList";
import UserList from "./UserList";

import { useState, useEffect, useTransition } from "react";
import { getStoreStatus, updateStoreStatus } from "@/lib/data-service";

export default function AdminContent({ products, sortedOrders, users, styles, updateOrder }) {
    const [isStoreOpen, setIsStoreOpen] = useState(true);
    const [statusLoading, setStatusLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [authLoading, setAuthLoading] = useState(true);
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        // Check auth
        const adminAuth = localStorage.getItem("adminAuth");
        if (adminAuth === "true") {
            setIsAuthenticated(true);
        }
        setAuthLoading(false);

        // Check store status
        getStoreStatus().then(status => {
            setIsStoreOpen(status.isOpen);
            setStatusLoading(false);
        });
    }, []);

    const handleLoginSuccess = () => {
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        localStorage.removeItem("adminAuth");
        setIsAuthenticated(false);
    };

    const handleToggleStore = async () => {
        const newState = !isStoreOpen;
        setIsStoreOpen(newState);
        try {
            await updateStoreStatus(newState);
        } catch (error) {
            console.error("Failed to update store status", error);
            setIsStoreOpen(!newState); // Revert on error
        }
    };

    const handleStatusSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        console.log('Form submitted with data:', {
            orderId: formData.get('orderId'),
            status: formData.get('status')
        });

        startTransition(async () => {
            try {
                const result = await updateOrder(formData);
                console.log('Update result:', result);
            } catch (error) {
                console.error('Error updating order:', error);
            }
        });
    };

    if (authLoading) {
        return (
            <div style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff"
            }}>
                Loading...
            </div>
        );
    }

    if (!isAuthenticated) {
        return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
    }

    return (
        <div className={styles.container}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <h1 className={styles.title} style={{ marginBottom: 0 }}>Admin Dashboard</h1>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <button
                        onClick={handleToggleStore}
                        disabled={statusLoading}
                        style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '20px',
                            border: 'none',
                            backgroundColor: isStoreOpen ? '#28a745' : '#dc3545',
                            color: 'white',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}
                    >
                        Store is {isStoreOpen ? 'OPEN' : 'CLOSED'}
                    </button>
                    <button
                        onClick={handleLogout}
                        style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '20px',
                            border: '1px solid rgba(255, 68, 68, 0.5)',
                            backgroundColor: 'rgba(255, 68, 68, 0.15)',
                            color: '#ff4444',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            transition: 'all 0.3s ease'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(255, 68, 68, 0.25)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(255, 68, 68, 0.15)';
                        }}
                    >
                        Logout 🚪
                    </button>
                </div>
            </div>

            <AdminTabs>
                {/* Tab 1: Add Product */}
                <div>
                    <ProductForm />
                </div>

                {/* Tab 2: Manage Products */}
                <div>
                    <ProductList products={products} />
                </div>

                {/* Tab 3: Order History */}
                <div>
                    <h2 style={{ marginBottom: '1.5rem', fontSize: '1.8rem', fontWeight: 700, color: 'var(--primary-color)' }}>Order History</h2>

                    {sortedOrders.length === 0 ? (
                        <p style={{ textAlign: 'center', color: 'rgba(255, 255, 255, 0.6)', fontSize: '1.1rem' }}>No orders yet.</p>
                    ) : (
                        <div className={styles.ordersGrid}>
                            {sortedOrders.map((order) => (
                                <div key={order.id} className={styles.orderCard}>
                                    <div className={styles.orderHeader}>
                                        <span className={styles.orderId}>#{order.id.slice(-6)}</span>
                                        <span className={styles.orderDate}>{new Date(order.createdAt).toLocaleString()}</span>
                                    </div>

                                    <div className={`${styles.statusBadge} ${styles['status' + order.status.replace(/\s+/g, '')]}`}>
                                        {order.status}
                                    </div>

                                    <div className={styles.customerInfo}>
                                        <p><strong>{order.customerName}</strong></p>
                                        <p>{order.phone}</p>
                                        <p>{order.address}</p>
                                        <p>Payment: {order.paymentMethod}</p>
                                        {order.note && (
                                            <p style={{ marginTop: '0.5rem', color: '#e67e22', fontStyle: 'italic' }}>
                                                Note: {order.note}
                                            </p>
                                        )}
                                    </div>

                                    <div className={styles.itemsList}>
                                        {order.items.map((item, index) => (
                                            <div key={index} className={styles.item}>
                                                <span>{item.quantity}x {item.name}</span>
                                                <span>₱{item.price * item.quantity}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className={styles.total}>
                                        Total: ₱{order.total}
                                    </div>

                                    <form onSubmit={handleStatusSubmit} className={styles.statusForm}>
                                        <input type="hidden" name="orderId" value={order.id} />
                                        <select name="status" defaultValue={order.status} className={styles.select}>
                                            <option value="Pending">Pending</option>
                                            <option value="Preparing">Preparing</option>
                                            <option value="On Delivery">On Delivery</option>
                                            <option value="Completed">Completed</option>
                                            <option value="Cancelled">Cancelled</option>
                                        </select>
                                        <button type="submit" className={styles.updateBtn} disabled={isPending}>
                                            {isPending ? 'Updating...' : 'Update'}
                                        </button>
                                    </form>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Tab 4: Users */}
                <div>
                    <UserList users={users} />
                </div>
            </AdminTabs>
        </div>
    );
}
