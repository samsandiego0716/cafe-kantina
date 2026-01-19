"use client";

import { useState } from "react";
import styles from "./AdminTabs.module.css";

export default function AdminTabs({ children }) {
    const [activeTab, setActiveTab] = useState("add-product");

    const tabs = [
        { id: "add-product", label: "Add Product", icon: "➕" },
        { id: "manage-products", label: "Manage Products", icon: "📦" },
        { id: "orders", label: "Order History", icon: "📋" },
        { id: "users", label: "Users", icon: "👥" },
        { id: "support-chat", label: "Support Chat", icon: "💬" },
    ];

    return (
        <div className={styles.adminTabsContainer}>
            <div className={styles.tabNav}>
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`${styles.tabButton} ${activeTab === tab.id ? styles.active : ""
                            }`}
                    >
                        <span className={styles.tabIcon}>{tab.icon}</span>
                        <span className={styles.tabLabel}>{tab.label}</span>
                    </button>
                ))}
            </div>

            <div className={styles.tabContent}>
                {children.map((child, index) => {
                    const tabIds = ["add-product", "manage-products", "orders", "users", "support-chat"];
                    return (
                        <div
                            key={index}
                            className={`${styles.tabPane} ${activeTab === tabIds[index] ? styles.activePane : ""
                                }`}
                        >
                            {child}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
