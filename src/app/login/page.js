"use client";

import { useActionState, useEffect } from "react";
import { login } from "../actions";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import styles from "../auth.module.css";

export const dynamic = 'force-dynamic';

const initialState = {
    message: "",
    success: false,
    user: null,
};

export default function LoginPage() {
    const [state, formAction, isPending] = useActionState(login, initialState);
    const { login: authLogin } = useAuth();

    useEffect(() => {
        if (state.success && state.user) {
            authLogin(state.user);
        }
    }, [state.success, state.user, authLogin]);

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Welcome Back</h1>
            <form action={formAction} className={styles.form}>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Email</label>
                    <input type="email" name="email" required className={styles.input} />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Password</label>
                    <input type="password" name="password" required className={styles.input} />
                </div>

                <button type="submit" className={styles.submitBtn} disabled={isPending}>
                    {isPending ? "Logging in..." : "Login"}
                </button>

                {state.message && <p className={styles.error}>{state.message}</p>}

                <Link href="/register" className={styles.link}>
                    Don't have an account? Register here.
                </Link>
            </form>
        </div>
    );
}
