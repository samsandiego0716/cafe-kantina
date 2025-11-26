import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Providers from "@/components/Providers";
import "./globals.css";

export const metadata = {
  title: "Cafe Kantina",
  description: "Premium Coffee Ordering",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          <main style={{ minHeight: '80vh' }}>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
