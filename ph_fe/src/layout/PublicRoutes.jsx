import { Outlet } from "react-router-dom";
import Header from "../components/Header/Header";
import Footer from "../components/footer/footer";
import StickyButton from "../components/stickybutton";

const PublicLayout = () => {
    return (
        <>
            <Header />
            <main style={{ minHeight: "calc(100vh - 100px)" }}> {/* Giữ nội dung cách footer */}
                <Outlet />
            </main>
            <StickyButton></StickyButton>
            <Footer />
        </>
    );
};

export default PublicLayout;
