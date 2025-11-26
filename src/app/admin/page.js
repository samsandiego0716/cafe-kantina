"use client";

import { useState, useEffect } from "react";
import { subscribeToOrders, getProducts, getUsers } from "@/lib/data-service";
import { updateOrder } from "../actions";
import AdminContent from "./AdminContent";
import styles from "./page.module.css";

export default function AdminPage() {
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        // Fetch products and users once (they don't need real-time updates)
        getProducts().then(setProducts);
        getUsers().then(setUsers);

        // Subscribe to orders for real-time updates
        const unsubscribe = subscribeToOrders((liveOrders) => {
            const sorted = [...liveOrders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setOrders(sorted);
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);

    return (
        <AdminContent
            products={products}
            sortedOrders={orders}
            users={users}
            styles={styles}
            updateOrder={updateOrder}
        />
    );
}
