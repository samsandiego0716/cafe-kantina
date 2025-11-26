import styles from "./page.module.css";

export const metadata = {
    title: "About Us - Cafe Kantina",
};

export default function AboutPage() {
    return (
        <div className="container">
            <section className={styles.aboutSection}>
                <div className={styles.aboutContent}>
                    <h1>Our Story</h1>
                    <p>
                        Cafe Kantina started with a simple dream: to serve the best coffee in town.
                        Founded in 2024, we have been dedicated to sourcing the finest beans
                        and roasting them to perfection.
                    </p>
                    <p>
                        We believe that coffee is more than just a drink; it's an experience.
                        Whether you're here for a quick pick-me-up or a long conversation with friends,
                        we strive to make every moment special.
                    </p>
                    <p>
                        Our baristas are passionate about their craft and are always ready to
                        recommend the perfect drink for your mood. Come visit us and taste the difference!
                    </p>
                </div>
            </section>
        </div>
    );
}
