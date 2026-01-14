"use client";

import { TriplePanelState } from "@/types/watchLive/watchLiveTypes";
import { useEffect, useMemo, useState } from "react";


type Options = {
    matchId: string;
    socket?: any; // optional
};

export function useMatchRealtimeState({ matchId, socket }: Options) {
    const initial = useMemo<TriplePanelState>(() => ({
        left: {
            id: "left",
            name: "Jack",
            points: 1000,
            badge: "taken",
            imageSrc: "/images/home/panel_left.png",
        },
        middle: {
            label: "Model",
            imageSrc: "/images/home/middle.png",
        },
        right: {
            id: "right",
            name: "Steve",
            points: 1000,
            badge: "available",
            imageSrc: "/images/home/panel_right.png",
        },
    }), []);

    const [state, setState] = useState<TriplePanelState>(initial);

    /* ---------------- SOCKET MODE ---------------- */
    useEffect(() => {
        if (!socket || !matchId) return;

        socket.emit?.("match_join", { matchId });

        const onSupportUpdate = (payload: any) => {
            setState((prev) => {
                if (payload?.side === "left") {
                    return { ...prev, left: { ...prev.left, points: payload.points } };
                }
                if (payload?.side === "right") {
                    return { ...prev, right: { ...prev.right, points: payload.points } };
                }
                return prev;
            });
        };

        socket.on?.("support_update", onSupportUpdate);

        return () => {
            socket.off?.("support_update", onSupportUpdate);
            socket.emit?.("match_leave", { matchId });
        };
    }, [socket, matchId]);

    /* ---------------- DUMMY SUPPORT ---------------- */
    const support = (side: "left" | "right", amount = 1) => {
        // backend থাকলে backend handle করবে
        if (socket) {
            socket.emit("support", { matchId, side, points: amount });
            return;
        }

        // ❗ frontend dummy fallback
        setState((prev) => {
            if (side === "left") {
                return {
                    ...prev,
                    left: { ...prev.left, points: prev.left.points + amount },
                };
            }
            return {
                ...prev,
                right: { ...prev.right, points: prev.right.points + amount },
            };
        });
    };

    return {
        state,
        support, // 👈 key thing
    };
}
