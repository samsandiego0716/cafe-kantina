"use client";

import { useState, useActionState, useEffect, useRef } from "react";
import { createProduct } from "../actions";
import Alert from "@/components/Alert";
import styles from "./ProductForm.module.css";

const initialState = {
    message: "",
    success: false,
};

export default function ProductForm() {
    const [state, formAction, isPending] = useActionState(createProduct, initialState);
    const [imagePreview, setImagePreview] = useState(null);
    const [showAlert, setShowAlert] = useState(false);
    const formRef = useRef(null);

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

    useEffect(() => {
        if (state.success) {
            setShowAlert(true);
            formRef.current?.reset();
            setImagePreview(null);
        }
    }, [state.success]);

    return (
        <div className={styles.productFormContainer}>
            <h2>Add New Product</h2>
            <form ref={formRef} action={formAction} className={styles.form}>
                <input type="hidden" name="image" value={imagePreview || ""} />

                <div className={styles.formGroup}>
                    <label>Product Name</label>
                    <input type="text" name="name" required className={styles.input} />
                </div>

                <div className={styles.formGroup}>
                    <label>Description</label>
                    <textarea name="description" required className={styles.textarea} rows="3"></textarea>
                </div>

                <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                        <label>Small Price (₱)</label>
                        <input type="number" name="price" step="0.01" required className={styles.input} />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Large Price (₱)</label>
                        <input type="number" name="largePrice" step="0.01" required className={styles.input} placeholder="+10" />
                    </div>
                </div>

                <div className={styles.formGroup}>
                    <label>Category</label>
                    <select name="category" required className={styles.select}>
                        <option value="">Select category</option>
                        <option value="Coffee">Coffee</option>
                        <option value="Non-Coffee">Non-Coffee</option>
                        <option value="Milk Tea">Milk Tea</option>
                        <option value="Fruit Tea">Fruit Tea</option>
                        <option value="Popping Soda">Popping Soda</option>
                    </select>
                </div>

                <div className={styles.formGroup}>
                    <label>Product Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className={styles.fileInput}
                    />
                    {imagePreview && (
                        <div className={styles.imagePreview}>
                            <img src={imagePreview} alt="Preview" />
                        </div>
                    )}
                </div>

                <button type="submit" className={styles.submitBtn} disabled={isPending}>
                    {isPending ? "Adding Product..." : "Add Product"}
                </button>

                {state.message && !state.success && (
                    <p className={styles.error}>{state.message}</p>
                )}
            </form>

            {showAlert && state.success && (
                <Alert
                    message={state.message}
                    type="success"
                    onClose={() => setShowAlert(false)}
                />
            )}
        </div>
    );
}
