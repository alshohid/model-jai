"use client";

import { useEffect } from "react";

const RELOAD_FLAG_KEY = "chunk-error-reload-at";
const RELOAD_COOLDOWN_MS = 10_000;
const CHUNK_ERROR_PATTERN = /ChunkLoadError|Loading chunk [\w-]+ failed/i;

function reloadOnce() {
    const lastReload = Number(sessionStorage.getItem(RELOAD_FLAG_KEY) || 0);
    if (Date.now() - lastReload < RELOAD_COOLDOWN_MS) return;
    sessionStorage.setItem(RELOAD_FLAG_KEY, String(Date.now()));
    window.location.reload();
}

function isChunkLoadError(name?: string, message?: string) {
    return CHUNK_ERROR_PATTERN.test(`${name ?? ""} ${message ?? ""}`);
}

export default function ChunkErrorReloader() {
    useEffect(() => {
        const handleError = (event: ErrorEvent) => {
            if (isChunkLoadError(event.error?.name, event.message)) {
                reloadOnce();
            }
        };

        const handleRejection = (event: PromiseRejectionEvent) => {
            const reason = event.reason;
            if (isChunkLoadError(reason?.name, reason?.message)) {
                reloadOnce();
            }
        };

        window.addEventListener("error", handleError);
        window.addEventListener("unhandledrejection", handleRejection);

        return () => {
            window.removeEventListener("error", handleError);
            window.removeEventListener("unhandledrejection", handleRejection);
        };
    }, []);

    return null;
}
