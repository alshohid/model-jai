
"use client";

import type React from "react";
import { useCallback, useEffect, useState } from "react";
import AdminSidebar from "../_components/topComponent/adminSideBar/AdminSidebar";
import AdminTopBar from "../_components/topComponent/AdminTopBar";


export default function DashBoardLayout({ children }: { children?: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const toggleSidebar = useCallback(() => {
        setSidebarOpen((previous) => !previous);
    }, []);
    const closeSidebar = useCallback(() => {
        setSidebarOpen(false);
    }, []);

    useEffect(() => {
        const root = document.documentElement;
        const body = document.body;

        if (sidebarOpen) {
            root.style.overflow = "hidden";
            body.style.overflow = "hidden";
        } else {
            root.style.overflow = "";
            body.style.overflow = "";
        }

        return () => {
            root.style.overflow = "";
            body.style.overflow = "";
        };
    }, [sidebarOpen]);

    return (
        <div className="min-h-screen bg-black">
            <AdminSidebar
                sidebarOpen={sidebarOpen}
                closeSidebar={closeSidebar}
            />
            <div className="min-h-screen lg:ml-[300px] xl:ml-[350px]">
                <AdminTopBar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

                <main className="p-2 md:p-3 lg:p-4">
                    <div className="rounded-[18px] bg-[#161616]/80 border border-white/10 shadow-[0_18px_60px_rgba(0,0,0,0.55)]">
                        <div className="p-4 md:p-6">{children}</div>
                    </div>
                </main>
            </div>
        </div>
    );
}
