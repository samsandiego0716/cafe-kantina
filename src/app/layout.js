import Providers from "@/components/Providers";
import Shell from "@/components/Shell";
import "./globals.css";

export const metadata = {
  title: "Cafe Kantina",
  description: "Premium Coffee Ordering",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Providers>
          <Shell>{children}</Shell>
        </Providers>
      </body>
    </html>
  );
}
