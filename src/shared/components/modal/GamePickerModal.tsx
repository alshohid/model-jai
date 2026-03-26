/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import AppDialog from "@/shared/components/modal/AppDialog";
import { useGetAllUnAuthUserGamesListQuery } from "@/redux/features/game/gameListManagement";


interface Game {
    id: number;
    name: string;
    image: string;
}

interface GamePickerModalProps {
    open: boolean;
    onClose: () => void;
    onSelect: (game: Game) => void;
    selectedId?: number | null;
}

export default function GamePickerModal({
    open,
    onClose,
    onSelect,
    selectedId,
}: GamePickerModalProps) {
    const { data, isLoading } = useGetAllUnAuthUserGamesListQuery(undefined);
    const [hoveredId, setHoveredId] = useState<number | null>(null);

    const games: Game[] = data?.data ?? [];

    return (
        <AppDialog open={open} onOpenChange={onClose} title="Choose Your Favorite Game">
            <div className="py-3">
                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="flex gap-1.5">
                            {[0, 1, 2].map((i) => (
                                <span
                                    key={i}
                                    className="block w-2 h-2 rounded-full bg-[#FF2EC8] animate-bounce"
                                    style={{ animationDelay: `${i * 0.15}s` }}
                                />
                            ))}
                        </div>
                    </div>
                ) : games.length === 0 ? (
                    <p className="text-center text-white/40 py-10 text-sm">No games available</p>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[60vh] overflow-y-auto pr-1 custom-scrollbar">
                        {games.map((game) => {
                            const isSelected = selectedId === game.id;
                            const isHovered = hoveredId === game.id;

                            return (
                                <button
                                    key={game.id}
                                    type="button"
                                    onClick={() => {
                                        onSelect(game);
                                        onClose();
                                    }}
                                    onMouseEnter={() => setHoveredId(game.id)}
                                    onMouseLeave={() => setHoveredId(null)}
                                    className={`
                                        relative group rounded-xl overflow-hidden cursor-pointer
                                        border-2 transition-all duration-200 text-left
                                        ${isSelected
                                            ? "border-[#FF2EC8] shadow-[0_0_16px_rgba(255,46,200,0.45)]"
                                            : "border-white/10 hover:border-[#FF2EC8]/50"
                                        }
                                    `}
                                >
                                    {/* Game Image */}
                                    <div className="relative w-full aspect-square overflow-hidden bg-white/5">
                                        <img
                                            src={game.image}
                                            alt={game.name}
                                            className={`
                                                w-full h-full object-contain transition-transform duration-300
                                                ${isHovered || isSelected ? "scale-110" : "scale-100"}
                                            `}
                                        />

                                        {/* Dark overlay */}
                                        <div className={`
                                            absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent
                                            transition-opacity duration-200
                                            ${isHovered || isSelected ? "opacity-80" : "opacity-60"}
                                        `} />

                                        {/* Selected checkmark badge */}
                                        {isSelected && (
                                            <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#FF2EC8] flex items-center justify-center shadow-lg z-10">
                                                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                                                    <path
                                                        d="M1 3.5L3.8 6.5L9 1"
                                                        stroke="white"
                                                        strokeWidth="1.8"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                            </div>
                                        )}
                                    </div>

                                    {/* Game Name */}
                                    <div className={`
                                        px-2.5 py-2 transition-colors duration-200
                                        ${isSelected ? "bg-[#FF2EC8]/10" : "bg-white/5"}
                                    `}>
                                        <p className={`
                                            text-xs font-semibold truncate leading-snug
                                            ${isSelected ? "text-[#FF2EC8]" : "text-white/80 group-hover:text-white"}
                                        `}>
                                            {game.name}
                                        </p>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                )}

                <p className="mt-4 text-center text-[11px] text-white/30">
                    Tap a game to select it as your favorite
                </p>
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 46, 200, 0.4);
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 46, 200, 0.7);
                }
            `}</style>
        </AppDialog>
    );
}