"use client";

import { useState } from "react";
import styles from "./AdminLogin.module.css";

export default function AdminLogin({ onLoginSuccess }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Single admin account credentials
    const ADMIN_USERNAME = "admin";
    const ADMIN_PASSWORD = "admin123";

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        // Simulate a small delay for better UX
        setTimeout(() => {
            if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
                // Store admin session
                localStorage.setItem("adminAuth", "true");
                onLoginSuccess();
            } else {
                setError("Invalid username or password");
                setPassword("");
            }
            setIsLoading(false);
        }, 500);
    };

    return (
        <div className={styles.loginContainer}>
            <div className={styles.loginCard}>
                <div className={styles.logoSection}>
                    <div className={styles.logo}>☕</div>
                    <h1>Cafe Kantina</h1>
                    <h2>Admin Portal</h2>
                    <p>Welcome back! Please sign in to continue</p>
                </div>

                <form onSubmit={handleSubmit} className={styles.loginForm}>
                    <div className={styles.formGroup}>
                        <label htmlFor="username">
                            <span className={styles.icon}>👤</span>
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your username"
                            required
                            className={styles.input}
                            autoComplete="username"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="password">
                            <span className={styles.icon}>🔒</span>
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required
                            className={styles.input}
                            autoComplete="current-password"
                        />
                    </div>

                    {error && (
                        <div className={styles.error}>
                            <span>⚠️</span> {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className={styles.loginBtn}
                        disabled={isLoading}
                    >
                        {isLoading ? "Brewing access..." : "Sign In"}
                    </button>
                </form>
            </div>

            <div className={styles.footer}>
                <p>© 2024 Cafe Kantina. All rights reserved.</p>
            </div>
        </div>
    );
}
