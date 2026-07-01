/* eslint-disable react-hooks/purity */
"use client";

import { useEffect, useMemo, useState } from "react";

type Props = {
    game: string;
    className?: string;
    size?: number; // Tailwind text-[13px] => 13
};

export default function GameLogo({
    game,
    className = "",
    size = 13,
}: Props) {
    const [width, setWidth] = useState(80);
    const padding = size;

    const id = useMemo(
        () => `grad-${Math.random().toString(36).slice(2, 9)}`,
        []
    );

    useEffect(() => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) return;

        ctx.font = `900 ${size}px Arial Black`;

        const measured = ctx.measureText(game).width;

        setWidth(Math.ceil(measured + size * 0.10));
    }, [game, size]);

    return (
        <svg
            width={width}
            height={size + 20}
            viewBox={`0 0 ${width} ${size + 6}`}
            className={`inline-block align-[-0.15em] ${className}`}
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="15%" stopColor="#ffd8ff" />
                    <stop offset="45%" stopColor="#ff4dff" />
                    <stop offset="100%" stopColor="#7b19ff" />
                </linearGradient>
            </defs>

            <text
                x={width}
                y={size}

                dominantBaseline="middle"
                fontSize={size}
                fontWeight="900"
                fontFamily="Arial Black, Impact, sans-serif"
                fill={`url(#${id})`}
                stroke="#ffffff"
                strokeWidth={size * 0.5}
                paintOrder="stroke fill"
                style={{
                    filter: `drop-shadow(0 ${size * 0.08}px 0 #6b21a8)
                   drop-shadow(0 ${size * 0.15}px ${size * 0.18}px rgba(0,0,0,.35))`,
                }}
            >
                {game}
            </text>
        </svg>
    );
}