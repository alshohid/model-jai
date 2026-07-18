"use client";

import { useEffect } from "react";

const RELOAD_FLAG_KEY = "chunk-error-reload-at";
const RELOAD_COOLDOWN_MS = 10_000;
const CHUNK_ERROR_PATTERN = /ChunkLoadError|Loading chunk [\w-]+ failed/i;

export default function GlobalError({
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
        <html lang="en">
            <body>
                <div
                    style={{
                        minHeight: "100vh",
                        background: "#080810",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "24px",
                        fontFamily: "system-ui, sans-serif",
                    }}
                >
                    <div style={{ textAlign: "center", maxWidth: "420px" }}>
                        <h2
                            style={{
                                color: "#fff",
                                fontSize: "20px",
                                fontWeight: 600,
                                marginBottom: "12px",
                            }}
                        >
                            Something went wrong
                        </h2>
                        <p
                            style={{
                                color: "rgba(255,255,255,0.45)",
                                fontSize: "14px",
                                marginBottom: "32px",
                                lineHeight: 1.6,
                            }}
                        >
                            A new version of the app may have just been released.
                            Reloading usually fixes this.
                        </p>
                        <button
                            type="button"
                            onClick={() => window.location.reload()}
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                height: "48px",
                                padding: "0 32px",
                                borderRadius: "12px",
                                background: "#FF2EC8",
                                color: "#fff",
                                fontSize: "14px",
                                fontWeight: 600,
                                border: "none",
                                cursor: "pointer",
                            }}
                        >
                            Reload page
                        </button>
                    </div>
                </div>
            </body>
        </html>
    );
}
