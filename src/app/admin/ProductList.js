"use client";

import { useState, useActionState, useEffect } from "react";
import { deleteProduct, updateProduct } from "../actions";
import Alert from "@/components/Alert";
import styles from "./ProductList.module.css";

const initialState = {
    message: "",
    success: false,
};

export default function ProductList({ products }) {
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({});
    const [imagePreview, setImagePreview] = useState(null);
    const [showAlert, setShowAlert] = useState(false);
    const [state, formAction, isPending] = useActionState(updateProduct, initialState);

    const handleDelete = async (productId) => {
        if (confirm("Are you sure you want to delete this product?")) {
            const formData = new FormData();
            formData.append("productId", productId);
            await deleteProduct(formData);
        }
    };

    const handleEdit = (product) => {
        setEditingId(product.id);
        setEditData({
            name: product.name,
            description: product.description,
            price: product.price,
            largePrice: product.largePrice || product.price + 10,
            category: product.category,
            image: product.image,
        });
        setImagePreview(product.image);
    };

    const handleCancel = () => {
        setEditingId(null);
        setEditData({});
        setImagePreview(null);
    };

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
            setEditingId(null);
            setEditData({});
            setImagePreview(null);
        }
    }, [state.success]);

    return (
        <div className={styles.productListContainer}>
            <h2>Manage Products</h2>
            <div className={styles.productGrid}>
                {products.map((product) => (
                    <div key={product.id} className={styles.productCard}>
                        {editingId === product.id ? (
                            // Edit Mode
                            <form action={formAction} className={styles.editForm}>
                                <input type="hidden" name="productId" value={product.id} />
                                <input
                                    type="hidden"
                                    name="image"
                                    value={imagePreview || editData.image || ""}
                                />

                                <div className={styles.editImageSection}>
                                    <div className={styles.productImage}>
                                        {imagePreview ? (
                                            <img src={imagePreview} alt="Preview" />
                                        ) : (
                                            <div className={styles.noImage}>No Image</div>
                                        )}
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className={styles.fileInput}
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label>Product Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={editData.name}
                                        onChange={(e) =>
                                            setEditData({ ...editData, name: e.target.value })
                                        }
                                        required
                                        className={styles.input}
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label>Description</label>
                                    <textarea
                                        name="description"
                                        value={editData.description}
                                        onChange={(e) =>
                                            setEditData({ ...editData, description: e.target.value })
                                        }
                                        required
                                        className={styles.textarea}
                                        rows="3"
                                    ></textarea>
                                </div>

                                <div className={styles.formRow}>
                                    <div className={styles.formGroup}>
                                        <label>Small Price (₱)</label>
                                        <input
                                            type="number"
                                            name="price"
                                            value={editData.price}
                                            onChange={(e) =>
                                                setEditData({ ...editData, price: e.target.value })
                                            }
                                            step="0.01"
                                            required
                                            className={styles.input}
                                        />
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label>Large Price (₱)</label>
                                        <input
                                            type="number"
                                            name="largePrice"
                                            value={editData.largePrice}
                                            onChange={(e) =>
                                                setEditData({ ...editData, largePrice: e.target.value })
                                            }
                                            step="0.01"
                                            required
                                            className={styles.input}
                                        />
                                    </div>
                                </div>

                                <div className={styles.formGroup}>
                                    <label>Category</label>
                                    <select
                                        name="category"
                                        value={editData.category}
                                        onChange={(e) =>
                                            setEditData({ ...editData, category: e.target.value })
                                        }
                                        required
                                        className={styles.select}
                                    >
                                        <option value="">Select category</option>
                                        <option value="Coffee">Coffee</option>
                                        <option value="Non-Coffee">Non-Coffee</option>
                                        <option value="Milk Tea">Milk Tea</option>
                                        <option value="Fruit Tea">Fruit Tea</option>
                                        <option value="Popping Soda">Popping Soda</option>
                                    </select>
                                </div>

                                <div className={styles.buttonGroup}>
                                    <button
                                        type="submit"
                                        disabled={isPending}
                                        className={styles.saveBtn}
                                    >
                                        {isPending ? "Saving..." : "Save"}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleCancel}
                                        className={styles.cancelBtn}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        ) : (
                            // View Mode
                            <>
                                <div className={styles.productImage}>
                                    {product.image ? (
                                        <img src={product.image} alt={product.name} />
                                    ) : (
                                        <div className={styles.noImage}>No Image</div>
                                    )}
                                </div>
                                <div className={styles.productInfo}>
                                    <h3>{product.name}</h3>
                                    <p className={styles.description}>{product.description}</p>
                                    <div className={styles.productFooter}>
                                        <span className={styles.price}>₱{product.price}</span>
                                        <span className={styles.category}>{product.category}</span>
                                    </div>
                                    <div className={styles.buttonGroup}>
                                        <button
                                            onClick={() => handleEdit(product)}
                                            className={styles.editBtn}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(product.id)}
                                            className={styles.deleteBtn}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>

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
