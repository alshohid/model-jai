"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Save, RotateCcw, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    useGetAdminPromotionalOffersQuery,
    useAddAdminPromotionalOffersMutation,
} from "@/redux/features/promotinalOffers/promotionalOffers";

import SettingsHeader from "./SettingsHeader";
import PrizeInput from "./PrizeInput";
import TermsListEditor from "./TermsListEditor";

interface PromotionalSettingsFormProps {
    initialPrize: number;
    initialTerms: string[];
    isSaving: boolean;
    onSave: (prize: number, terms: string[]) => Promise<void>;
}

function PromotionalSettingsForm({
    initialPrize,
    initialTerms,
    isSaving,
    onSave,
}: PromotionalSettingsFormProps) {
    const [prize, setPrize] = useState<number>(initialPrize);
    const [terms, setTerms] = useState<string[]>(initialTerms);

    const handleReset = () => {
        setPrize(initialPrize);
        setTerms(initialTerms);
        toast.info("Form reset to currently active settings");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSave(prize, terms);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <SettingsHeader isSaving={isSaving} />

            {/* Price configuration */}
            <PrizeInput value={prize} onChange={setPrize} />

            {/* Terms and conditions list editor */}
            <TermsListEditor terms={terms} onChange={setTerms} />

            {/* Action Bar */}
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end border-t border-white/10 pt-6">
                <Button
                    type="button"
                    onClick={handleReset}
                    disabled={isSaving}
                    className="bg-white/5 text-white hover:bg-white/10 border border-white/10 transition-all duration-200 cursor-pointer flex items-center gap-1.5"
                >
                    <RotateCcw className="h-4 w-4" />
                    <span>Reset Changes</span>
                </Button>

                <Button
                    type="submit"
                    disabled={isSaving}
                    className="bg-[#ff49ff] text-white hover:bg-[#ff6aff] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer flex items-center gap-1.5 px-6"
                >
                    <Save className="h-4 w-4" />
                    <span>{isSaving ? "Saving..." : "Save Settings"}</span>
                </Button>
            </div>
        </form>
    );
}

interface RTKError {
    data?: {
        message?: string;
    };
    message?: string;
}

export default function PromotionalSettingsContainer() {
    const { data, isLoading, error, refetch } = useGetAdminPromotionalOffersQuery();
    const [addAdminPromotionalOffers, { isLoading: isSaving }] = useAddAdminPromotionalOffersMutation();

    const getPromotionalData = () => {
        if (!data) return { prize: 0, list: [] };
        const raw = data as unknown as Record<string, unknown>;
        let prizeVal: unknown = raw.prize;
        let listVal: unknown = raw.list;

        if (raw.data && typeof raw.data === "object") {
            const inner = raw.data as Record<string, unknown>;
            if (typeof prizeVal !== "number" && typeof inner.prize === "number") {
                prizeVal = inner.prize;
            }
            if (!Array.isArray(listVal) && Array.isArray(inner.list)) {
                listVal = inner.list;
            }
        }

        return {
            prize: typeof prizeVal === "number" ? prizeVal : 0,
            list: Array.isArray(listVal) ? (listVal as string[]) : [],
        };
    };

    const handleSave = async (prize: number, terms: string[]) => {
        try {
            await addAdminPromotionalOffers({
                prize,
                list: terms,
            }).unwrap();
            toast.success("Promotional offer terms updated successfully!");
        } catch (err: unknown) {
            console.error("Error updating promotional settings:", err);
            const formattedError = err as RTKError;
            toast.error(
                formattedError?.data?.message ||
                formattedError?.message ||
                "Failed to update promotional settings"
            );
        }
    };

    if (isLoading) {
        return (
            <div className="space-y-6">
                {/* Header Skeleton */}
                <div className="flex flex-col gap-4 border-b border-white/10 pb-6 md:flex-row md:items-center md:justify-between animate-pulse">
                    <div className="space-y-2">
                        <div className="h-6 w-48 rounded bg-white/10" />
                        <div className="h-4 w-96 rounded bg-white/5" />
                    </div>
                    <div className="h-8 w-28 rounded-full bg-white/10" />
                </div>

                {/* Input Skeleton */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 animate-pulse">
                    <div className="lg:col-span-7 h-44 rounded-2xl bg-white/5" />
                    <div className="lg:col-span-5 h-44 rounded-2xl bg-white/5" />
                </div>

                {/* List Skeleton */}
                <div className="h-72 rounded-2xl bg-white/5 animate-pulse" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center space-y-4 border border-white/10 rounded-2xl bg-white/1">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
                    <AlertTriangle className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                    <h3 className="text-lg font-semibold text-white">Failed to Load Settings</h3>
                    <p className="text-sm text-white/50 max-w-md">
                        There was an error retrieving the promotional settings from the server. Please try again.
                    </p>
                </div>
                <Button
                    onClick={refetch}
                    className="bg-[#ff49ff] text-white hover:bg-[#ff6aff] cursor-pointer"
                >
                    Retry Loading
                </Button>
            </div>
        );
    }

    const { prize, list } = getPromotionalData();

    return (
        <PromotionalSettingsForm
            key={`${prize}-${list.join(",")}`}
            initialPrize={prize}
            initialTerms={list}
            isSaving={isSaving}
            onSave={handleSave}
        />
    );
}
