"use client";

import { useState, useEffect, useTransition } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useActionState } from "react";
import styles from "./page.module.css";
import { subscribeToUserOrders } from "@/lib/data-service";
import { updateProfile, changeUserPassword } from "../actions";

export const dynamic = 'force-dynamic';

const initialState = {
    message: "",
    success: false,
};

export default function AccountPage() {
    const { user, logout, loading, updateUserData } = useAuth();
    const [orders, setOrders] = useState([]);
    const [ordersLoading, setOrdersLoading] = useState(true);
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const [profileState, profileAction, profilePending] = useActionState(updateProfile, initialState);
    const [passwordState, passwordAction, passwordPending] = useActionState(changeUserPassword, initialState);

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
        }
    }, [user, loading, router]);

    useEffect(() => {
        if (user?.phone) {
            console.log('Subscribing to orders for phone:', user.phone);
            const unsubscribe = subscribeToUserOrders(user.phone, (liveOrders) => {
                console.log('Received orders:', liveOrders);
                setOrders(liveOrders);
                setOrdersLoading(false);
            });

            return () => unsubscribe();
        }
    }, [user]);

    useEffect(() => {
        if (profileState.success) {
            setIsEditingProfile(false);
            setImagePreview(null);
            if (profileState.userData) {
                updateUserData(profileState.userData);
            }
        }
    }, [profileState.success]);

    useEffect(() => {
        if (passwordState.success) {
            setIsChangingPassword(false);
        }
    }, [passwordState.success]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        // If there's an image preview, add it as base64 to formData
        if (imagePreview) {
            formData.set('imageBase64', imagePreview);
        } else {
            formData.set('imageBase64', '');
        }
        // Remove the file input since we're sending base64
        formData.delete('image');

        // Call the action inside a transition
        startTransition(() => {
            profileAction(formData);
        });
    };

    if (loading || !user) {
        return <div className={styles.container}><p>Loading...</p></div>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.headerRow}>
                <h1 className={styles.title}>My Account</h1>
                <button onClick={logout} className={styles.logoutBtn}>
                    Logout 🚪
                </button>
            </div>

            <div className={styles.profileSection}>
                <div className={styles.profileHeader}>
                    <div className={styles.profilePictureContainer}>
                        <div className={styles.profilePicture}>
                            {imagePreview || user.image ? (
                                <img src={imagePreview || user.image} alt="Profile" />
                            ) : (
                                <span className={styles.avatarPlaceholder}>
                                    {user.name?.charAt(0).toUpperCase() || 'U'}
                                </span>
                            )}
                        </div>
                        <h2 className={styles.userName}>{user.name}</h2>
                        <p className={styles.userEmail}>{user.email}</p>
                    </div>
                </div>

                {!isEditingProfile ? (
                    <div className={styles.profileDetails}>
                        <div className={styles.detailRow}>
                            <span className={styles.label}>Phone:</span>
                            <span className={styles.value}>{user.phone}</span>
                        </div>
                        <div className={styles.detailRow}>
                            <span className={styles.label}>Address:</span>
                            <span className={styles.value}>{user.address}</span>
                        </div>
                        <button onClick={() => setIsEditingProfile(true)} className={styles.editBtn}>
                            Edit Profile ✏️
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleProfileSubmit} className={styles.editForm}>
                        <input type="hidden" name="userId" value={user.id} />

                        <div className={styles.formGroup}>
                            <label>Profile Picture</label>
                            <input
                                type="file"
                                name="image"
                                accept="image/*"
                                onChange={handleImageChange}
                                className={styles.fileInput}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Name</label>
                            <input
                                type="text"
                                name="name"
                                defaultValue={user.name}
                                required
                                className={styles.input}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Phone</label>
                            <input
                                type="tel"
                                name="phone"
                                defaultValue={user.phone}
                                required
                                className={styles.input}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Address</label>
                            <textarea
                                name="address"
                                defaultValue={user.address}
                                required
                                className={styles.textarea}
                                rows="3"
                            />
                        </div>

                        {profileState.message && (
                            <div className={`${styles.message} ${profileState.success ? styles.success : styles.error}`}>
                                {profileState.message}
                            </div>
                        )}

                        <div className={styles.formActions}>
                            <button type="submit" disabled={profilePending || isPending} className={styles.saveBtn}>
                                {profilePending || isPending ? "Saving..." : "Save Changes"}
                            </button>
                            <button type="button" onClick={() => {
                                setIsEditingProfile(false);
                                setImagePreview(null);
                            }} className={styles.cancelBtn}>
                                Cancel
                            </button>
                        </div>
                    </form>
                )}
            </div>

            <div className={styles.passwordSection}>
                <h3>Security</h3>
                {!isChangingPassword ? (
                    <button onClick={() => setIsChangingPassword(true)} className={styles.changePasswordBtn}>
                        Change Password 🔒
                    </button>
                ) : (
                    <form action={passwordAction} className={styles.passwordForm}>
                        <input type="hidden" name="userId" value={user.id} />

                        <div className={styles.formGroup}>
                            <label>Current Password</label>
                            <input
                                type="password"
                                name="currentPassword"
                                required
                                className={styles.input}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>New Password</label>
                            <input
                                type="password"
                                name="newPassword"
                                required
                                className={styles.input}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Confirm New Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                required
                                className={styles.input}
                            />
                        </div>

                        {passwordState.message && (
                            <div className={`${styles.message} ${passwordState.success ? styles.success : styles.error}`}>
                                {passwordState.message}
                            </div>
                        )}

                        <div className={styles.formActions}>
                            <button type="submit" disabled={passwordPending} className={styles.saveBtn}>
                                {passwordPending ? "Changing..." : "Change Password"}
                            </button>
                            <button type="button" onClick={() => setIsChangingPassword(false)} className={styles.cancelBtn}>
                                Cancel
                            </button>
                        </div>
                    </form>
                )}
            </div>

            <div className={styles.ordersSection}>
                <h2 className={styles.sectionTitle}>Order History</h2>

                {ordersLoading ? (
                    <p>Loading orders...</p>
                ) : orders.length === 0 ? (
                    <p className={styles.emptyMessage}>No orders found.</p>
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
        </div>
    );
}
