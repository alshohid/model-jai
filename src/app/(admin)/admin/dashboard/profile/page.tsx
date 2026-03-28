"use client";


import { useGetMeDataQuery } from "@/redux/features/auth/authapi";
import AdminSettingsPanel from "../../_components/dashboard/AdminSettingsPanel";
import ChangePasswordPanel from "../../_components/dashboard/ChangePasswordPanel";

export default function AdminSettingsPage() {
    const { data: meData } = useGetMeDataQuery();
    const user = meData?.data?.user;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white">Account Settings</h1>
                <p className="text-sm text-white/40 mt-1">
                    Manage your admin profile and security preferences
                </p>
            </div>

            <div className="border-t border-white/8" />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                <AdminSettingsPanel
                    initialData={{
                        name: user?.name,
                        email: user?.email,
                        image: user?.image,
                        phone: user?.phone_number,
                        nationality: user?.nationality,
                    }}
                />
                <ChangePasswordPanel />
            </div>
        </div>
    );
}