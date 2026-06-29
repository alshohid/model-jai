"use client";

import { Star, Trophy } from "lucide-react";

interface PrizeInputProps {
    value: number;
    onChange: (val: number) => void;
}

export default function PrizeInput({ value, onChange }: PrizeInputProps) {
    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseInt(e.target.value, 10);
        onChange(isNaN(val) ? 0 : val);
    };

    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Input field */}
            <div className="lg:col-span-7 flex flex-col justify-between rounded-2xl border border-white/10 bg-white/2 p-5 md:p-6 space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-semibold tracking-wide text-white uppercase flex items-center gap-1.5">
                        <Trophy className="h-4 w-4 text-[#ffb31a]" />
                        Promotional Price (Points)
                    </label>
                    <p className="text-xs text-white/50">
                        Set the point cost for the promotional entry package. Users will see this price during checkout.
                    </p>
                </div>

                <div className="relative mt-2">
                    <input
                        type="number"
                        min="0"
                        value={value === 0 ? "" : value}
                        onChange={handleNumberChange}
                        placeholder="Enter promotional points (e.g. 1000)"
                        className="w-full h-12 rounded-xl border border-white/10 bg-[#161616] px-4 pl-11 text-base text-white outline-none transition placeholder:text-white/30 focus:border-[#ff49ff] focus:ring-1 focus:ring-[#ff49ff] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 font-bold text-sm">
                        pts
                    </span>
                </div>
            </div>

            {/* Live Preview Card */}
            <div className="lg:col-span-5 rounded-2xl border border-[#ff49ff]/30 bg-[#ff49ff]/5 p-5 flex flex-col justify-center items-center relative overflow-hidden">
                {/* Decorative glow */}
                <div className="absolute -right-16 -top-16 h-36 w-36 rounded-full bg-[#ff49ff]/20 blur-3xl pointer-events-none" />
                <div className="absolute -left-16 -bottom-16 h-36 w-36 rounded-full bg-[#fff200]/10 blur-3xl pointer-events-none" />

                <span className="absolute top-3 left-3 text-[10px] uppercase font-bold tracking-widest text-[#ff49ff]">
                    Live Preview
                </span>

                <div className="w-full max-w-[260px] cursor-pointer mt-4">
                    <div className="text-[11px] text-center font-black text-[#fff200] [text-shadow:0_1px_0_#000,0_0_8px_rgba(255,242,0,0.75)]">
                        -Promotional Price offer-
                    </div>
                    <div className="rounded-[12px] border-2 border-[#ff49ff] bg-black/80 px-4 py-3 text-left">
                        <div className="flex items-center gap-3">
                            <div className="flex flex-col items-center text-[#ffb31a]">
                                <Trophy className="h-10 w-10 fill-[#ffb31a] drop-shadow-[0_0_6px_rgba(255,179,26,0.7)]" />
                                <Star className="mt-0.5 h-3.5 w-3.5 fill-[#ffb31a]" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-[11px] font-bold leading-none text-white/60">Price:</p>
                                <div className="mt-1 flex items-end gap-1">
                                    <span className="text-3xl font-black leading-none text-[#fff200] [text-shadow:0_0_8px_rgba(255,242,0,0.65)]">
                                        {value || 0}
                                    </span>
                                    <span className="pb-0.5 text-[10px] font-black uppercase tracking-[0.08em] text-white">
                                        Points
                                    </span>
                                </div>
                                <p className="mt-0.5 text-[10px] font-medium text-white/86">
                                    any user is a winner
                                </p>
                            </div>
                            <Star className="ml-auto mt-auto h-3.5 w-3.5 fill-[#ffb31a] text-[#ffb31a]" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
