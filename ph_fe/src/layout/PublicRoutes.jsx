import { Outlet } from "react-router-dom";
import Header from "../components/Header/Header";
import Footer from "../components/footer/footer";
import StickyButton from "../components/stickybutton";
import CustomerChat from "@/pages/Chat/CustomerChat";
import { useEffect } from "react";

const PublicLayout = () => {

    // Handle hash navigation when the page loads
    useEffect(() => {
        // Check if there's a hash in the URL
        if (window.location.hash) {
            const id = window.location.hash.substring(1);
            const element = document.getElementById(id);
            if (element) {
                // Wait a bit for the page to fully load before scrolling
                setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth' });
                }, 500);
            }
        }
    }, []);

    return (
        <>
            <Header />

            <main style={{ minHeight: "calc(100vh - 100px)" }}> {/* Giữ nội dung cách footer */}
                <Outlet />
            </main>
            <CustomerChat></CustomerChat>
            <StickyButton></StickyButton>
            <div id="contact-section">
                <Footer />
            </div>
        </>
    );
};

export default PublicLayout;
