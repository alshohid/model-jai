/* eslint-disable react-hooks/set-state-in-effect */

"use client";

import { useState, useEffect } from "react";
import { useChangeMatchStatusMutation, useGetStartLiveMatchDataQuery } from "@/redux/features/dashboard/dashboardManagement";
import { toast } from "sonner";
import LiveStatusModal from "./LiveStatusChangeModal";


export default function LiveController() {
    const { data: liveMatchData, isLoading: isLiveLoading } = useGetStartLiveMatchDataQuery();
    const [changeMatchStatus, { isLoading }] = useChangeMatchStatusMutation();
    const [modalOpen, setModalOpen] = useState(false);
    const [currentLiveStatus, setCurrentLiveStatus] = useState<string>("loading");
    const [platformName, setPlatformName] = useState<string>("twitch");
    const [mode, setMode] = useState<string>("portrait");
    const [status, setStatus] = useState<string>("live");

    // Set initial live status, platform, and mode on mount
    useEffect(() => {
        if (liveMatchData && liveMatchData.data?.live_status) {
            const liveStatus = liveMatchData.data?.live_status[0];
            setCurrentLiveStatus(liveStatus?.platform_live_status);
            setPlatformName(liveStatus?.platform_name);
            setMode(liveStatus?.mode);
            setStatus(liveStatus?.platform_live_status);
        }
    }, [liveMatchData]);

    // Handle live status change
    const handleChangeStatus = async (status: "live" | "pause" | "stop", platform_name: string, mode: string) => {
        try {
            await changeMatchStatus({
                platform_name,
                status,
                mode,
            }).unwrap();
            toast.success("Live status changed successfully");
        } catch (error) {
            console.error("Failed to change live status", error);
            toast.error("Failed to change live status");
        }
    };

    // Open Modal to Change Status
    const handleOpenModal = () => {
        setModalOpen(true);
    };

    // Close Modal
    const handleCloseModal = () => {
        setModalOpen(false);
    };

    return (
        <div>
            <div className="text-white mb-4">
                <p><strong>Current Status:</strong> {currentLiveStatus}</p>
                <p><strong>Platform:</strong> {platformName}</p>
                <p><strong>Mode:</strong> {mode}</p>
            </div>

            {/* Button to open Modal */}
            <button
                onClick={handleOpenModal}
                className="px-4 py-2 bg-purple-600 text-white rounded-md"
                disabled={isLoading}
            >
                Change Live Status
            </button>

            {/* Modal */}
            <LiveStatusModal
                open={modalOpen}
                onClose={handleCloseModal}
                platform={platformName}
                mode={mode}
                status={status}
                onSave={handleChangeStatus}
            />
        </div>
    );
}

