
"use client";

import type React from "react";
import { useState } from "react";
import AdminSidebar from "../_components/topComponent/adminSideBar/AdminSidebar";
import AdminTopBar from "../_components/topComponent/AdminTopBar";


export default function DashBoardLayout({ children }: { children?: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-black">
            <AdminSidebar sidebarOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen((s) => !s)} />

            {/* content wrapper */}
            <div className="min-h-screen lg:ml-[300px] xl:ml-[350px]">
                <AdminTopBar sidebarOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen((s) => !s)} />

                <main className="p-4 md:p-6 lg:p-7">
                    <div className="rounded-[18px] bg-[#161616]/80 border border-white/10 shadow-[0_18px_60px_rgba(0,0,0,0.55)]">
                        <div className="p-4 md:p-6">{children}</div>
                    </div>
                </main>
            </div>
        </div>
    );
}
