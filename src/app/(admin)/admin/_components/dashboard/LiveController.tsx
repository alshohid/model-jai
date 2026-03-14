"use client";

import { useChangeMatchStatusMutation } from "@/redux/features/dashboard/dashboardManagement";
import { toast } from "sonner";

export default function LiveController() {
    const [changeMatchStatus, { isLoading }] = useChangeMatchStatusMutation();

    const handleChangeStatus = async (
        status: "live" | "pause" | "stop",
        platform_name: string,
        mode: string
    ) => {
        try {
            await changeMatchStatus({
                platform_name,
                status,
                mode,
            }).unwrap();
            toast.success("Live status changed successfully");
        } catch (error) {
            console.error("Failed to change live status", error);
            toast.error("Failed to change live status")
        }
    };

    return (
        <div className="flex gap-3">
            <button
                onClick={() => handleChangeStatus("live", "twitch", "landscape")}
                className="px-4 py-2 bg-green-600 text-white rounded-md"
                disabled={isLoading}
            >
                Start Live
            </button>

            <button
                onClick={() => handleChangeStatus("pause", "twitch", "landscape")}
                className="px-4 py-2 bg-yellow-600 text-white rounded-md"
                disabled={isLoading}
            >
                Pause
            </button>

            <button
                onClick={() => handleChangeStatus("stop", "twitch", "landscape")}
                className="px-4 py-2 bg-red-600 text-white rounded-md"
                disabled={isLoading}
            >
                Stop
            </button>
        </div>
    );
}