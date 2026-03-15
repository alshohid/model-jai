/* eslint-disable react-hooks/set-state-in-effect */

"use client";

import React, { useState, useEffect } from "react";

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

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
            <div className="bg-gray-800 p-6 rounded-lg w-[400px]">
                <h3 className="text-xl font-semibold text-center mb-4">Change Live Status</h3>

                {/* Platform Selection */}
                <div className="mb-4">
                    <label htmlFor="platform" className="block text-sm text-gray-200">Platform</label>
                    <select
                        id="platform"
                        value={selectedPlatform}
                        onChange={(e) => setSelectedPlatform(e.target.value)}
                        className="w-full p-2 mt-1 bg-black/30 border border-gray-300 rounded-md"
                    >
                        <option value="twitch">Twitch</option>
                        <option value="tiktok">TikTok</option>
                    </select>
                </div>

                {/* Mode Selection */}
                <div className="mb-4">
                    <label htmlFor="mode" className="block text-sm text-gray-200">Mode</label>
                    <select
                        id="mode"
                        value={selectedMode}
                        onChange={(e) => setSelectedMode(e.target.value)}
                        className="w-full p-2 mt-1 border bg-black/30 border-gray-300 rounded-md"
                    >
                        <option value="portrait">Portrait</option>
                        <option value="landscape">Landscape</option>
                    </select>
                </div>

                {/* Status Selection */}
                <div className="mb-4">
                    <label htmlFor="status" className="block text-sm text-gray-200">Status</label>
                    <select
                        id="status"
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="w-full p-2 mt-1 bg-black/30 border border-gray-300 rounded-md"
                    >
                        <option value="live">Live</option>
                        <option value="pause">Pause</option>
                        <option value="stop">Stop</option>
                    </select>
                </div>

                <div className="flex justify-between gap-2">

                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-400 text-white rounded-md w-full"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-green-600 text-white rounded-md w-full"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LiveStatusModal;



