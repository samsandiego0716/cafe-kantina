"use client";

import styles from "./UserList.module.css";

export default function UserList({ users }) {
    return (
        <div className={styles.userListContainer}>
            <h2>Registered Users</h2>
            <p className={styles.subtitle}>Monitor and view all customer accounts</p>

            {users.length === 0 ? (
                <div className={styles.emptyState}>
                    <span className={styles.emptyIcon}>👥</span>
                    <p>No registered users yet</p>
                </div>
            ) : (
                <div className={styles.userGrid}>
                    {users.map((user, index) => (
                        <div key={user.email || index} className={styles.userCard}>
                            <div className={styles.userAvatar}>
                                <span>{user.name ? user.name.charAt(0).toUpperCase() : "U"}</span>
                            </div>
                            <div className={styles.userInfo}>
                                <h3>{user.name}</h3>
                                <p className={styles.email}>
                                    <span className={styles.icon}>📧</span>
                                    {user.email}
                                </p>
                                {user.phone && (
                                    <p className={styles.phone}>
                                        <span className={styles.icon}>📱</span>
                                        {user.phone}
                                    </p>
                                )}
                                {user.address && (
                                    <p className={styles.address}>
                                        <span className={styles.icon}>📍</span>
                                        {user.address}
                                    </p>
                                )}
                            </div>
                            <div className={styles.userStats}>
                                <div className={styles.stat}>
                                    <span className={styles.statLabel}>Account Type</span>
                                    <span className={styles.statValue}>
                                        {user.isAdmin ? "Admin" : "Customer"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className={styles.totalCount}>
                <strong>Total Users:</strong> {users.length}
            </div>
        </div>
    );
}
