"use client";

import { useState, useEffect } from "react";
import AdminLogin from "./AdminLogin";

export default function AdminAuth({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check if admin is already logged in
        const adminAuth = localStorage.getItem("adminAuth");
        if (adminAuth === "true") {
            setIsAuthenticated(true);
        }
        setIsLoading(false);
    }, []);

    const handleLoginSuccess = () => {
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        localStorage.removeItem("adminAuth");
        setIsAuthenticated(false);
    };

    if (isLoading) {
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
        <div>
            <div style={{
                display: "flex",
                justifyContent: "flex-end",
                marginBottom: "1rem",
                padding: "0 1rem"
            }}>
                <button
                    onClick={handleLogout}
                    style={{
                        padding: "0.75rem 1.5rem",
                        background: "rgba(255, 68, 68, 0.2)",
                        border: "1px solid rgba(255, 68, 68, 0.4)",
                        borderRadius: "8px",
                        color: "#ffffff",
                        fontSize: "0.9rem",
                        fontWeight: 600,
                        cursor: "pointer",
                        transition: "all 0.3s ease"
                    }}
                    onMouseOver={(e) => {
                        e.target.style.background = "rgba(255, 68, 68, 0.3)";
                    }}
                    onMouseOut={(e) => {
                        e.target.style.background = "rgba(255, 68, 68, 0.2)";
                    }}
                >
                    🚪 Logout
                </button>
            </div>
            {children}
        </div>
    );
}
