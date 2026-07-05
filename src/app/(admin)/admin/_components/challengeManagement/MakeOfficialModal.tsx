/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useRef } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Upload, X, Link2, FileText, Percent, CheckSquare } from "lucide-react";
import { toast } from "sonner";
import { useMakeChallengeOfficialMutation } from "@/redux/features/challenge/challengeManagement";

interface MakeOfficialModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    challengeId: number;
}

export default function MakeOfficialModal({
    open,
    onOpenChange,
    challengeId,
}: MakeOfficialModalProps) {
    const [makeChallengeOfficial, { isLoading }] = useMakeChallengeOfficialMutation();

    const [playerOneLogo, setPlayerOneLogo] = useState<File | null>(null);
    const [playerTwoLogo, setPlayerTwoLogo] = useState<File | null>(null);
    const [playerOnePreview, setPlayerOnePreview] = useState<string | null>(null);
    const [playerTwoPreview, setPlayerTwoPreview] = useState<string | null>(null);
    const [winnerPercentage, setWinnerPercentage] = useState(false);
    const [loserPercentage, setLoserPercentage] = useState(false);
    const [tiktokLink, setTiktokLink] = useState("");
    const [twitchLink, setTwitchLink] = useState("");
    const [rules, setRules] = useState("");
    const [isFree, setIsFree] = useState(false);
    const [isRanked, setIsRanked] = useState(false);
    const [isFeatured, setIsFeatured] = useState(false);

    const playerOneInputRef = useRef<HTMLInputElement>(null);
    const playerTwoInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (
        file: File | null,
        setFile: (f: File | null) => void,
        setPreview: (p: string | null) => void
    ) => {
        if (!file) {
            setFile(null);
            setPreview(null);
            return;
        }
        setFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async () => {
        try {
            const response = await makeChallengeOfficial({
                id: challengeId,
                player_one_logo: playerOneLogo || undefined,
                player_two_logo: playerTwoLogo || undefined,
                winner_percentage: winnerPercentage,
                loser_percentage: loserPercentage,
                tiktok_link: tiktokLink || undefined,
                twitch_link: twitchLink || undefined,
                rules: rules || undefined,
                is_free: isFree,
                is_ranked: isRanked,
                is_featured: isFeatured,
            }).unwrap();

            toast.success(response?.message ?? "Challenge marked as official successfully!");
            onOpenChange(false);
            resetForm();
        } catch (error: unknown) {
            const err = error as { data?: { message?: string }; message?: string };
            toast.error(
                err?.data?.message ?? err?.message ?? "Failed to make challenge official"
            );
        }
    };

    const resetForm = () => {
        setPlayerOneLogo(null);
        setPlayerTwoLogo(null);
        setPlayerOnePreview(null);
        setPlayerTwoPreview(null);
        setWinnerPercentage(false);
        setLoserPercentage(false);
        setTiktokLink("");
        setTwitchLink("");
        setRules("");
        setIsFree(false);
        setIsRanked(false);
        setIsFeatured(false);
    };

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            resetForm();
        }
        onOpenChange(open);
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="!bg-[#1C1F26] !text-white border-gray-700 max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-white text-xl font-bold flex items-center gap-2">
                        <FileText className="size-5 text-emerald-400" />
                        Make Challenge Official
                    </DialogTitle>
                    <DialogDescription className="text-gray-400">
                        Fill in the details to mark this challenge as official
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Player Logos */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Player One Logo */}
                        <div className="space-y-2">
                            <label className="text-sm text-gray-300 font-medium flex items-center gap-2">
                                <Upload className="size-4" />
                                Player One Logo
                            </label>
                            <div
                                onClick={() => playerOneInputRef.current?.click()}
                                className="border-2 border-dashed border-gray-600 rounded-lg p-4 cursor-pointer hover:border-emerald-500/50 transition-all text-center"
                            >
                                {playerOnePreview ? (
                                    <div className="relative inline-block">
                                        <img
                                            src={playerOnePreview}
                                            alt="Player One Logo"
                                            className="h-20 w-20 object-contain rounded-lg"
                                        />
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleFileSelect(null, setPlayerOneLogo, setPlayerOnePreview);
                                                if (playerOneInputRef.current) playerOneInputRef.current.value = "";
                                            }}
                                            className="absolute -top-2 -right-2 bg-red-500 rounded-full p-0.5"
                                        >
                                            <X className="size-3" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-2 text-gray-400">
                                        <Upload className="size-8" />
                                        <span className="text-xs">Click to upload logo</span>
                                    </div>
                                )}
                                <input
                                    ref={playerOneInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) =>
                                        handleFileSelect(
                                            e.target.files?.[0] ?? null,
                                            setPlayerOneLogo,
                                            setPlayerOnePreview
                                        )
                                    }
                                />
                            </div>
                        </div>

                        {/* Player Two Logo */}
                        <div className="space-y-2">
                            <label className="text-sm text-gray-300 font-medium flex items-center gap-2">
                                <Upload className="size-4" />
                                Player Two Logo
                            </label>
                            <div
                                onClick={() => playerTwoInputRef.current?.click()}
                                className="border-2 border-dashed border-gray-600 rounded-lg p-4 cursor-pointer hover:border-emerald-500/50 transition-all text-center"
                            >
                                {playerTwoPreview ? (
                                    <div className="relative inline-block">
                                        <img
                                            src={playerTwoPreview}
                                            alt="Player Two Logo"
                                            className="h-20 w-20 object-contain rounded-lg"
                                        />
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleFileSelect(null, setPlayerTwoLogo, setPlayerTwoPreview);
                                                if (playerTwoInputRef.current) playerTwoInputRef.current.value = "";
                                            }}
                                            className="absolute -top-2 -right-2 bg-red-500 rounded-full p-0.5"
                                        >
                                            <X className="size-3" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-2 text-gray-400">
                                        <Upload className="size-8" />
                                        <span className="text-xs">Click to upload logo</span>
                                    </div>
                                )}
                                <input
                                    ref={playerTwoInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) =>
                                        handleFileSelect(
                                            e.target.files?.[0] ?? null,
                                            setPlayerTwoLogo,
                                            setPlayerTwoPreview
                                        )
                                    }
                                />
                            </div>
                        </div>
                    </div>

                    {/* Winner / Loser Percentage Checkboxes */}
                    <div className="space-y-2">
                        <label className="text-sm text-gray-300 font-medium flex items-center gap-2">
                            <Percent className="size-4" />
                            Percentage Options
                        </label>
                        <div className="flex flex-wrap gap-6">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={winnerPercentage}
                                    onChange={(e) => setWinnerPercentage(e.target.checked)}
                                    className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-emerald-500 focus:ring-emerald-500"
                                />
                                <span className="text-sm text-gray-300">Winner Percentage</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={loserPercentage}
                                    onChange={(e) => setLoserPercentage(e.target.checked)}
                                    className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-emerald-500 focus:ring-emerald-500"
                                />
                                <span className="text-sm text-gray-300">Loser Percentage</span>
                            </label>
                        </div>
                    </div>

                    {/* TikTok Link */}
                    <div className="space-y-2">
                        <label className="text-sm text-gray-300 font-medium flex items-center gap-2">
                            <Link2 className="size-4" />
                            TikTok Link
                        </label>
                        <input
                            type="url"
                            value={tiktokLink}
                            onChange={(e) => setTiktokLink(e.target.value)}
                            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            placeholder="https://tiktok.com/..."
                        />
                    </div>

                    {/* Twitch Link */}
                    <div className="space-y-2">
                        <label className="text-sm text-gray-300 font-medium flex items-center gap-2">
                            <Link2 className="size-4" />
                            Twitch Link
                        </label>
                        <input
                            type="url"
                            value={twitchLink}
                            onChange={(e) => setTwitchLink(e.target.value)}
                            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            placeholder="https://twitch.tv/..."
                        />
                    </div>

                    {/* Rules */}
                    <div className="space-y-2">
                        <label className="text-sm text-gray-300 font-medium flex items-center gap-2">
                            <FileText className="size-4" />
                            Rules
                        </label>
                        <textarea
                            value={rules}
                            onChange={(e) => setRules(e.target.value)}
                            rows={4}
                            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                            placeholder="Enter match rules..."
                        />
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-700">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => handleOpenChange(false)}
                        disabled={isLoading}
                        className="text-gray-400 hover:text-white hover:bg-white/10"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white"
                    >
                        {isLoading ? (
                            <span className="flex items-center gap-2">
                                <Loader2 className="size-4 animate-spin" />
                                Submitting...
                            </span>
                        ) : (
                            "Make Official"
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}