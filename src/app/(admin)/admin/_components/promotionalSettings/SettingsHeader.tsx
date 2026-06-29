"use client";

import { Trophy, ShieldCheck } from "lucide-react";

interface SettingsHeaderProps {
    isSaving?: boolean;
}

export default function SettingsHeader({ isSaving = false }: SettingsHeaderProps) {
    return (
        <div className="flex flex-col gap-4 border-b border-white/10 pb-6 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
                <div className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-[#fff200] fill-[#fff200]/20" />
                    <h1 className="text-2xl font-bold tracking-tight text-white">
                        Promotional Settings
                    </h1>
                </div>
                <p className="text-sm text-white/60">
                    Configure the promotional price, reward points, and manage the list of terms & conditions.
                </p>
            </div>

            <div className="flex items-center gap-3">
                {isSaving ? (
                    <span className="flex items-center gap-1.5 rounded-full bg-yellow-500/10 px-3.5 py-1 text-xs font-semibold text-yellow-400 border border-yellow-500/20">
                        <span className="h-1.5 w-1.5 animate-ping rounded-full bg-yellow-400" />
                        Saving changes...
                    </span>
                ) : (
                    <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        Live on Platform
                    </span>
                )}
            </div>
        </div>
    );
}
