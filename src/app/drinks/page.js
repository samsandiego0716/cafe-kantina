import { getProducts } from "@/lib/data-service";
import AddToCartButton from "@/components/AddToCartButton";
import MenuWithFilter from "@/components/MenuWithFilter";
import styles from "./page.module.css";

export const metadata = {
    title: "Drinks Menu - Cafe Kantina",
};

export default async function DrinksPage() {
    const products = await getProducts();

    return (
        <div className="container" style={{ paddingTop: 'var(--spacing-lg)' }}>
            <header className={styles.header}>
                <h1>Our Menu</h1>

            </header>

            <MenuWithFilter products={products} />
        </div>
    );
}
