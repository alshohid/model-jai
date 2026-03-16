/**
 * FlyingPeso Component
 * Animated coin that flies to a specific position
 * Following Single Responsibility Principle - handles only coin animation
 */

"use client";

import { useEffect } from "react";

interface FlyingPesoProps {
    id: string;
    xPercent: number;
    ty?: number;
    rot?: number;
    dur?: number;
    onDone: (id: string) => void;
}

export default function FlyingPeso({
    id,
    xPercent,
    ty = -400,
    rot = 0,
    dur = 900,
    onDone,
}: FlyingPesoProps) {
    useEffect(() => {
        const timer = setTimeout(() => onDone(id), dur);
        return () => clearTimeout(timer);
    }, [id, dur, onDone]);

    return (
        <div
            className="fixed bottom-1/2 pointer-events-none z-[9999]"
            style={{
                left: `${xPercent}%`,
                transform: "translateX(-50%)",
                animation: "pesoFly var(--dur) ease-out forwards",
                ["--ty" as string]: `${ty}px`,
                ["--rot" as string]: `${rot}deg`,
                ["--dur" as string]: `${dur}ms`,
            } as React.CSSProperties}
        >
            <div className="h-10 w-10 rounded-full bg-yellow-400/80 border-2 border-yellow-300 flex items-center justify-center shadow-lg">
                <span className="text-white text-lg font-black">₱</span>
            </div>

            <style jsx>{`
                @keyframes pesoFly {
                    0% {
                        opacity: 1;
                        transform: translateX(-50%) translateY(0) scale(1) rotate(0deg);
                    }
                    100% {
                        opacity: 0;
                        transform: translateX(-50%) translateY(var(--ty))
                            scale(0.5) rotate(var(--rot));
                    }
                }
            `}</style>
        </div>
    );
}
