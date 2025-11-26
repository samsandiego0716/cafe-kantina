"use client";

import { useActionState, useEffect } from "react";
import { register } from "../actions";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import styles from "../auth.module.css";

export const dynamic = 'force-dynamic';

const initialState = {
    message: "",
    success: false,
    user: null,
};

export default function RegisterPage() {
    const [state, formAction, isPending] = useActionState(register, initialState);
    const { login } = useAuth();

    useEffect(() => {
        if (state.success && state.user) {
            login(state.user);
        }
    }, [state.success, state.user, login]);

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Create Account</h1>
            <form action={formAction} className={styles.form}>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Full Name</label>
                    <input type="text" name="name" required className={styles.input} />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Email</label>
                    <input type="email" name="email" required className={styles.input} />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Password</label>
                    <input type="password" name="password" required className={styles.input} />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Phone Number</label>
                    <input type="tel" name="phone" required className={styles.input} />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Address</label>
                    <textarea name="address" required className={styles.input} rows="3"></textarea>
                </div>

                <button type="submit" className={styles.submitBtn} disabled={isPending}>
                    {isPending ? "Creating Account..." : "Register"}
                </button>

                {state.message && <p className={styles.error}>{state.message}</p>}

                <Link href="/login" className={styles.link}>
                    Already have an account? Login here.
                </Link>
            </form>
        </div>
    );
}
