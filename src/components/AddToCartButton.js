"use client";

import { useState, useEffect } from "react";
import { getStoreStatus } from "@/lib/data-service";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Alert from "@/components/Alert";
import styles from "../app/drinks/page.module.css";

export default function AddToCartButton({ product }) {
    const { addToCart } = useCart();
    const { user } = useAuth();
    const router = useRouter();
    const [showAlert, setShowAlert] = useState(false);
    const [alertConfig, setAlertConfig] = useState({ message: '', type: 'info' });
    const [isStoreOpen, setIsStoreOpen] = useState(true);

    useEffect(() => {
        getStoreStatus().then(status => {
            setIsStoreOpen(status.isOpen);
        });
    }, []);

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isStoreOpen) {
            setAlertConfig({
                message: "Store is currently closed. Please check back later.",
                type: "error"
            });
            setShowAlert(true);
            return;
        }

        if (!user) {
            setAlertConfig({
                message: "Add to cart failed. Please log in to add items to your cart.",
                type: "error"
            });
            setShowAlert(true);
            setTimeout(() => {
                router.push("/login");
            }, 1500);
            return;
        }

        addToCart(product);
        setAlertConfig({
            message: "Added to cart!",
            type: "success"
        });
        setShowAlert(true);
    };

    return (
        <>
            <button
                type="button"
                className={styles.addToCartBtn}
                onClick={handleAddToCart}
            >
                Add to Cart
            </button>
            {showAlert && (
                <Alert
                    message={alertConfig.message}
                    type={alertConfig.type}
                    onClose={() => setShowAlert(false)}
                />
            )}
        </>
    );
}
