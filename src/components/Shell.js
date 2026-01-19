"use client";

import { usePathname } from 'next/navigation';
import Navbar from "./Navbar";
import Footer from "./Footer";
import ChatButton from "./ChatButton";

export default function Shell({ children }) {
    const pathname = usePathname();
    const isAdmin = pathname?.startsWith('/admin');

    if (isAdmin) {
        return <main>{children}</main>;
    }

    return (
        <>
            <Navbar />
            <main className="main-content">{children}</main>
            <Footer />
            <ChatButton />
        </>
    );
}
