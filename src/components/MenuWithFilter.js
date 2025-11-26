"use client";

import { useState, useMemo } from "react";
import AddToCartButton from "./AddToCartButton";
import styles from "./MenuWithFilter.module.css";

export default function MenuWithFilter({ products }) {
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [sortOrder, setSortOrder] = useState("asc"); // "asc" or "desc"

    const categories = useMemo(() => {
        const uniqueCategories = new Set(products.map(p => p.category).filter(Boolean));
        return ["All", ...Array.from(uniqueCategories)];
    }, [products]);

    const filteredProducts = useMemo(() => {
        let result = products;
        if (selectedCategory !== "All") {
            result = products.filter(p => p.category === selectedCategory);
        }

        return [...result].sort((a, b) => {
            if (sortOrder === "asc") {
                return a.price - b.price;
            } else {
                return b.price - a.price;
            }
        });
    }, [products, selectedCategory, sortOrder]);

    return (
        <div>
            <div className={styles.controlsContainer}>
                <div className={styles.filterContainer}>
                    {categories.map(category => (
                        <button
                            key={category}
                            className={`${styles.filterButton} ${selectedCategory === category ? styles.active : ""}`}
                            onClick={() => setSelectedCategory(category)}
                        >
                            {category}
                        </button>
                    ))}
                </div>
                <div className={styles.sortContainer}>
                    <select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        className={styles.sortSelect}
                    >
                        <option value="asc">Price: Low to High</option>
                        <option value="desc">Price: High to Low</option>
                    </select>
                </div>
            </div>

            <div className={styles.grid}>
                {filteredProducts.map((product) => (
                    <div key={product.id} className={styles.productCard}>
                        <div className={styles.imageContainer}>
                            {product.image ? (
                                <img
                                    src={product.image}
                                    alt={product.name}
                                />
                            ) : (
                                <div style={{ width: '100%', height: '100%', backgroundColor: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa' }}>
                                    {product.name}
                                </div>
                            )}
                        </div>
                        <div className={styles.productInfo}>
                            <h3 className={styles.productName}>{product.name}</h3>
                            <p className={styles.productDesc}>{product.description}</p>
                            <div className={styles.productFooter}>
                                <span className={styles.price}>₱{product.price}</span>
                                <AddToCartButton product={product} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
