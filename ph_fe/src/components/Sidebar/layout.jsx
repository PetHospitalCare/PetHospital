import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

const Layout = ({ children }) => {
    return (
        <SidebarProvider>
            <AppSidebar />
            <main className="text-left">
                <SidebarTrigger />

                
            </main>
            <div className="ml-8">
                    {children}
                </div>
        </SidebarProvider>
    );
};

export default Layout;
