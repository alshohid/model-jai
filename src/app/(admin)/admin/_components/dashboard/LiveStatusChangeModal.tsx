/* eslint-disable react-hooks/set-state-in-effect */

"use client";

import React, { useEffect, useState } from "react";
import AppDialog from "@/shared/components/modal/AppDialog";
import AppSelect from "../reusable/AppSelect";
import { Field } from "../match/matchFormShared";

type Props = {
    open: boolean;
    onClose: () => void;
    platform: string;
    mode: string;
    status: string;
    onSave: (
        status: "live" | "pause" | "stop",
        platform_name: string,
        mode: string,
    ) => void;
};

const platformOptions = [
    { label: "Twitch", value: "twitch" },
    { label: "TikTok", value: "tiktok" },
];

const modeOptions = [
    { label: "Portrait", value: "portrait" },
    { label: "Landscape", value: "landscape" },
];

const statusOptions = [
    { label: "Live", value: "live" },
    { label: "Pause", value: "pause" },
    { label: "Stop", value: "stop" },
];

const LiveStatusModal: React.FC<Props> = ({
    open,
    onClose,
    platform,
    mode,
    status,
    onSave,
}) => {
    const [selectedPlatform, setSelectedPlatform] = useState(platform);
    const [selectedMode, setSelectedMode] = useState(mode);
    const [selectedStatus, setSelectedStatus] = useState(status);

    useEffect(() => {
        setSelectedPlatform(platform);
        setSelectedMode(mode);
        setSelectedStatus(status);
    }, [platform, mode, status]);

    const handleSave = () => {
        onSave(
            selectedStatus as "live" | "pause" | "stop",
            selectedPlatform,
            selectedMode,
        );
        onClose();
    };

    return (
        <AppDialog
            open={open}
            onOpenChange={(nextOpen) => {
                if (!nextOpen) {
                    onClose();
                }
            }}
            title="Change Live Status"
        >
            <div className="space-y-5 py-2">
                <Field label="Platform">
                    <AppSelect
                        value={selectedPlatform}
                        onValueChange={setSelectedPlatform}
                        options={platformOptions}
                        placeholder="Select one"
                        withPlaceholderOption={false}
                    />
                </Field>

                <Field label="Mode">
                    <AppSelect
                        value={selectedMode}
                        onValueChange={setSelectedMode}
                        options={modeOptions}
                        placeholder="Select one"
                        withPlaceholderOption={false}
                    />
                </Field>

                <Field label="Status">
                    <AppSelect
                        value={selectedStatus}
                        onValueChange={setSelectedStatus}
                        options={statusOptions}
                        placeholder="Select one"
                        withPlaceholderOption={false}
                    />
                </Field>

                <div className="flex gap-3 pt-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="h-11 flex-1 rounded-lg bg-white/10 text-sm font-medium text-white transition hover:bg-white/15"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleSave}
                        className="h-11 flex-1 rounded-lg bg-[#FF2EC8] text-sm font-medium text-white transition hover:bg-[#ff48d0]"
                    >
                        Save
                    </button>
                </div>
            </div>
        </AppDialog>
    );
};

export default LiveStatusModal;
