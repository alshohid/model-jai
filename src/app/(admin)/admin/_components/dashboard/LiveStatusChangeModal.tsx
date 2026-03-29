/* eslint-disable react-hooks/set-state-in-effect */

"use client";

import React, { useState, useEffect } from "react";
import AppDialog from "@/shared/components/modal/AppDialog";

type Props = {
    open: boolean;
    onClose: () => void;
    platform: string;
    mode: string;
    status: string;
    onSave: (status: "live" | "pause" | "stop", platform_name: string, mode: string) => void;
};

const LiveStatusModal: React.FC<Props> = ({ open, onClose, platform, mode, status, onSave }) => {
    const [selectedPlatform, setSelectedPlatform] = useState(platform);
    const [selectedMode, setSelectedMode] = useState(mode);
    const [selectedStatus, setSelectedStatus] = useState(status);

    useEffect(() => {
        setSelectedPlatform(platform);
        setSelectedMode(mode);
        setSelectedStatus(status);
    }, [platform, mode, status]);

    const handleSave = () => {
        onSave(selectedStatus as "live" | "pause" | "stop", selectedPlatform, selectedMode);
        onClose();
    };

    return (
        <AppDialog open={open} onOpenChange={onClose} title="Change Live Status">
            <div className="space-y-4 py-2">
                <div className="space-y-1.5">
                    <label htmlFor="platform" className="block text-sm font-medium text-white/80">
                        Platform
                    </label>
                    <select
                        id="platform"
                        value={selectedPlatform}
                        onChange={(e) => setSelectedPlatform(e.target.value)}
                        className="w-full rounded-md border border-white/15 bg-black/30 px-3 py-2 text-sm text-white outline-none transition focus:border-white/30"
                    >
                        <option value="twitch">Twitch</option>
                        <option value="tiktok">TikTok</option>
                    </select>
                </div>

                <div className="space-y-1.5">
                    <label htmlFor="mode" className="block text-sm font-medium text-white/80">
                        Mode
                    </label>
                    <select
                        id="mode"
                        value={selectedMode}
                        onChange={(e) => setSelectedMode(e.target.value)}
                        className="w-full rounded-md border border-white/15 bg-black/30 px-3 py-2 text-sm text-white outline-none transition focus:border-white/30"
                    >
                        <option value="portrait">Portrait</option>
                        <option value="landscape">Landscape</option>
                    </select>
                </div>

                <div className="space-y-1.5">
                    <label htmlFor="status" className="block text-sm font-medium text-white/80">
                        Status
                    </label>
                    <select
                        id="status"
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="w-full rounded-md border border-white/15 bg-black/30 px-3 py-2 text-sm text-white outline-none transition focus:border-white/30"
                    >
                        <option value="live">Live</option>
                        <option value="pause">Pause</option>
                        <option value="stop">Stop</option>
                    </select>
                </div>

                <div className="flex gap-3 pt-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-full rounded-md bg-white/15 px-4 py-2 text-white transition hover:bg-white/20"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleSave}
                        className="w-full rounded-md bg-green-600 px-4 py-2 text-white transition hover:bg-green-500"
                    >
                        Save
                    </button>
                </div>
            </div>
        </AppDialog>
    );
};

export default LiveStatusModal;


