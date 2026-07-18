"use client";

import { useEffect } from "react";

const RELOAD_FLAG_KEY = "chunk-error-reload-at";
const RELOAD_COOLDOWN_MS = 10_000;
const CHUNK_ERROR_PATTERN = /ChunkLoadError|Loading chunk [\w-]+ failed/i;

export default function Error({
    error,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        if (!CHUNK_ERROR_PATTERN.test(`${error.name} ${error.message}`)) return;

        const lastReload = Number(sessionStorage.getItem(RELOAD_FLAG_KEY) || 0);
        if (Date.now() - lastReload < RELOAD_COOLDOWN_MS) return;

        sessionStorage.setItem(RELOAD_FLAG_KEY, String(Date.now()));
        window.location.reload();
    }, [error]);

    return (
        <div className="min-h-screen bg-[#080810] flex items-center justify-center px-6">
            <div className="text-center max-w-md">
                <h2 className="text-xl sm:text-2xl font-semibold text-white mb-3">
                    Something went wrong
                </h2>
                <p className="text-[14px] text-white/40 leading-relaxed mb-8">
                    A new version of the app may have just been released. Reloading
                    usually fixes this — if it keeps happening, please contact support.
                </p>
                <button
                    type="button"
                    onClick={() => window.location.reload()}
                    className="inline-flex items-center justify-center h-12 px-8 rounded-xl bg-[#FF2EC8] hover:bg-[#ff48d0] text-white text-[14px] font-semibold shadow-[0_0_24px_rgba(255,46,200,0.35)] transition-all active:scale-[0.97]"
                >
                    Reload page
                </button>
            </div>
        </div>
    );
}
