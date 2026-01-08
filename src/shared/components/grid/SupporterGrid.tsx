"use client";

import * as React from "react";
import { cn } from "@/shared/lib/utils/cn";
import Image from "next/image";

export type GridCellStatus = "available" | "taken";

export type GridCell = {
    id: string;
    status: GridCellStatus;
    points: number;
};

type Props = {
    rows: number;
    cols: number;
    cells: GridCell[]; // rows*cols length
    matchStatus: "Upcoming" | "Live" | "Past";
    locked?: boolean; // match lock / countdown done
    pendingCellId?: string | null; // click করার পর pending দেখাতে
    onCellClick?: (cell: GridCell) => void;
    className?: string;
};

export default function SupporterGrid({
    rows,
    cols,
    cells,
    matchStatus,
    locked = false,
    pendingCellId = null,
    onCellClick,
    className,
}: Props) {
    const gridDisabled = locked || matchStatus === "Past";

    return (
        <section
            className={cn(
                "w-full",
                "rounded-md overflow-hidden",
                // "bg-[#D2D2D51A] border border-white/10",
                // "shadow-[0_0_0_1px_rgba(255,255,255,0.06),inset_0_0_0_2px_rgba(0,0,0,0.55)]",
                className
            )}
        >
            <div
                className="bg-[#D2D2D51A]  grid border border-white/15"
                style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
            >
                {cells.slice(0, rows * cols).map((cell) => {
                    const isTaken = cell.status === "taken";
                    const isPending = pendingCellId === cell.id;

                    const isDisabled = gridDisabled || isTaken || isPending || !onCellClick;

                    return (
                        <button
                            key={cell.id}
                            type="button"
                            disabled={isDisabled}
                            onClick={() => onCellClick?.(cell)}
                            className={cn(
                                "relative aspect-square",
                                "flex flex-col items-center justify-center gap-1",
                                "border-r border-b border-white/20",
                                "bg-black/10",
                                !gridDisabled && !isTaken && !isPending && "hover:bg-white/10",
                                isDisabled ? "cursor-not-allowed" : "cursor-pointer",
                                isPending && "animate-pulse"
                            )}
                            aria-label={`cell ${cell.id} ${cell.status} ${cell.points}`}
                        >
                            {/* X / O */}
                            <span
                                className={cn(
                                    "leading-none font-extrabold",
                                    "text-[40px] sm:text-[46px] md:text-[52px]",
                                    "drop-shadow-[0_6px_8px_rgba(0,0,0,0.65)]",
                                    isTaken
                                        ? "text-[#FF5A5A]"
                                        : "text-[#2CF06B]"
                                )}
                                style={{
                                    textShadow: isTaken
                                        ? "0px 2px 0px rgba(0,0,0,0.55)"
                                        : "0px 2px 0px rgba(0,0,0,0.55)",
                                }}
                            >
                                {isTaken ?
                                    <Image src={'/images/home/taken_slot.png'}
                                        alt="availbale"
                                        width={300}
                                        height={300}
                                        className=" w-[15px]  md:w-[40px] h-[15px] md:h-[40px]"
                                    />
                                    :
                                    <Image src={'/images/home/available_slot.png'}
                                        alt="availbale"
                                        width={300}
                                        height={300}
                                        className=" w-[15px]  md:w-[40px] h-[15px] md:h-[40px]"
                                    />
                                }
                            </span>

                            {/* points */}
                            <span className="text-[#FFFFFF] text-xs md:text-[18px] tabular-nums">
                                {cell.points}
                            </span>

                            {/* Disabled overlay for Past/Locked */}
                            {gridDisabled && (
                                <span className="absolute inset-0 bg-black/20" />
                            )}
                        </button>
                    );
                })}
            </div>
        </section>
    );
}
