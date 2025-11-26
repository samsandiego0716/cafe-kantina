"use client";

import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { createOrder } from "../actions";
import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import Link from "next/link";

const initialState = {
    message: "",
    success: false,
};

export default function CheckoutPage() {
    const { cart, cartTotal, updateQuantity, updateSize, removeFromCart, clearCart } = useCart();
    const { user, loading } = useAuth();
    const [state, formAction, isPending] = useActionState(createOrder, initialState);
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
        }
    }, [loading, user, router]);

    useEffect(() => {
        if (state.success) {
            clearCart();
        }
    }, [state.success, clearCart]);

    if (loading) {
        return (
            <div className={styles.container}>
                <p>Loading...</p>
            </div>
        );
    }

    if (!user) {
        return (
            <div className={styles.container} style={{ textAlign: "center" }}>
                <h1 className={styles.title}>Please Log In</h1>
                <p>You need to be logged in to place an order.</p>
                <Link href="/login" className="btn btn-primary" style={{ marginTop: "2rem" }}>
                    Go to Login
                </Link>
            </div>
        );
    }

    if (state.success) {
        return (
            <div className={styles.container} style={{ textAlign: "center" }}>
                <h1 className={styles.title}>Order Placed!</h1>
                <p>Thank you for your order. We are preparing it now.</p>
                <Link href="/drinks" className="btn btn-primary" style={{ marginTop: "2rem" }}>
                    Order More
                </Link>
            </div>
        );
    }

    if (cart.length === 0) {
        return (
            <div className={styles.container} style={{ textAlign: "center" }}>
                <h1 className={styles.title}>Your Cart is Empty</h1>
                <Link href="/drinks" className="btn btn-primary">
                    Browse Menu
                </Link>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Checkout</h1>
            <div className={styles.grid}>
                <div className={styles.cartSection}>
                    <h2>Your Order</h2>
                    {cart.map((item) => {
                        const itemPrice = item.size === "Large" ? (item.largePrice || item.price + 10) : item.price;
                        return (
                            <div key={`${item.id}-${item.size}`} className={styles.cartItem}>
                                <div className={styles.cartItemInfo}>
                                    <h4>{item.name}</h4>
                                    <p>₱{itemPrice} x {item.quantity}</p>
                                    <select
                                        value={item.size || "Small"}
                                        onChange={(e) => updateSize(item.id, item.size, e.target.value)}
                                        className={styles.sizeSelect}
                                    >
                                        <option value="Small">Small</option>
                                        <option value="Large">Large (+₱10)</option>
                                    </select>
                                </div>
                                <div className={styles.cartItemControls}>
                                    <button
                                        className={styles.quantityBtn}
                                        onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                                    >
                                        -
                                    </button>
                                    <span>{item.quantity}</span>
                                    <button
                                        className={styles.quantityBtn}
                                        onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                                    >
                                        +
                                    </button>
                                    <button
                                        className={styles.quantityBtn}
                                        style={{ color: 'red', background: 'none' }}
                                        onClick={() => removeFromCart(item.id, item.size)}
                                    >
                                        x
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                    <div className={styles.total}>
                        Total: ₱{cartTotal}
                    </div>
                </div>

                <div className={styles.formSection}>
                    <h2>Delivery Details</h2>
                    <form action={formAction}>
                        <input type="hidden" name="items" value={JSON.stringify(cart)} />
                        <input type="hidden" name="total" value={cartTotal} />

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Name</label>
                            <input
                                type="text"
                                name="customerName"
                                required
                                className={styles.input}
                                defaultValue={user?.name || ""}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Address</label>
                            <textarea
                                name="address"
                                required
                                className={styles.input}
                                rows="3"
                                defaultValue={user?.address || ""}
                            ></textarea>
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Phone Number</label>
                            <input
                                type="tel"
                                name="phone"
                                required
                                className={styles.input}
                                defaultValue={user?.phone || ""}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <select name="paymentMethod" className={styles.select}>
                                <option value="COD">Cash on Delivery</option>
                                <option value="GCash">GCash</option>
                            </select>
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Note (Optional)</label>
                            <textarea
                                name="note"
                                className={styles.input}
                                rows="2"
                                placeholder="e.g. Less sugar, less ice"
                            ></textarea>
                        </div>

                        <button type="submit" className={styles.submitBtn} disabled={isPending}>
                            {isPending ? "Placing Order..." : "Place Order"}
                        </button>
                        {state.message && <p style={{ color: 'red', marginTop: '1rem' }}>{state.message}</p>}
                    </form>
                </div>
            </div>
        </div>
    );
}
