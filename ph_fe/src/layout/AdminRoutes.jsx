import { Outlet } from "react-router-dom";
import Page from "../app/dashboard/page"; // Import Page component

export default function Layout() {
    return (
        <Page>
            <Outlet /> {/* Nơi render các trang con */}
        </Page>
    );
}
