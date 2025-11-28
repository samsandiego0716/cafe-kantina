import { useState } from "react";
import styles from "./UserList.module.css";

export default function UserList({ users }) {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredUsers = users.filter(user =>
        (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.phone && user.phone.includes(searchTerm))
    );

    return (
        <div className={styles.userListContainer}>
            <div className={styles.header}>
                <div>
                    <h2>Registered Users</h2>
                    <p className={styles.subtitle}>Monitor and view all customer accounts</p>
                </div>
                <div className={styles.searchContainer}>
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={styles.searchInput}
                    />
                </div>
            </div>

            {filteredUsers.length === 0 ? (
                <div className={styles.emptyState}>
                    <span className={styles.emptyIcon}>👥</span>
                    <p>No users found matching "{searchTerm}"</p>
                </div>
            ) : (
                <div className={styles.userGrid}>
                    {filteredUsers.map((user, index) => (
                        <div key={user.email || index} className={styles.userCard}>
                            <div className={styles.userAvatar}>
                                {user.image ? (
                                    <img src={user.image} alt={user.name} />
                                ) : (
                                    <span>{user.name ? user.name.charAt(0).toUpperCase() : "U"}</span>
                                )}
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
