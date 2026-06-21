import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";
import { getChallengeMatchOfferById } from "@/features/challenge-match/data/challengeMatchMockData";

export const runtime = "edge";

const BOSS_GOLD = "#ffd237";
const NEON_PINK = "#ff4cff";
const NEON_GREEN = "#62ff52";
const DARK_BG = "#090a0f";
const CARD_BG = "#0d0e14";
const ACCENT_PINK = "#ff36ff";
const SUBTLE_WHITE = "rgba(255,255,255,0.7)";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ offerId: string }> }
) {
    const { offerId } = await params;
    const offer = getChallengeMatchOfferById(offerId);

    if (!offer) {
        return new ImageResponse(
            (
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "100%",
                        height: "100%",
                        background: DARK_BG,
                        color: "#fff",
                        fontSize: 32,
                        fontFamily: "sans-serif",
                        fontWeight: 700,
                    }}
                >
                    Challenge Not Found
                </div>
            ),
            { width: 1200, height: 630 }
        );
    }

    const challengerName = offer.showRealName
        ? offer.challenger.name
        : offer.challenger.handle.replace("@", "");
    const targetName = offer.target.name;
    const formattedAmount = new Intl.NumberFormat("en-US").format(offer.amount);
    const gameLogoPath =
        ({
            FC26: "/images/home/fc26.png",
            "Mortal Combat": "/images/home/mortal.png",
            "FIFA 23": "/images/home/game_3.png",
            "Street Fighter 6": "/images/home/game_14.png",
        } as Record<string, string>)[offer.game] ?? "/images/home/main_logo.png";

    return new ImageResponse(
        (
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                    height: "100%",
                    background: DARK_BG,
                    fontFamily: "sans-serif",
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                {/* Subtle gradient overlays */}
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        background:
                            "linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(5,5,10,0.96) 100%), radial-gradient(circle at 50% 0%, rgba(255,46,200,0.25) 0%, transparent 50%)",
                    }}
                />

                {/* Main Content */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        width: "100%",
                        height: "100%",
                        padding: "32px 48px",
                        position: "relative",
                        zIndex: 10,
                    }}
                >
                    {/* Top bar: Rank Badge + Game */}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginBottom: 8,
                        }}
                    >
                        {/* Rank */}
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                                background: "rgba(0,0,0,0.5)",
                                border: "1px solid rgba(255,210,55,0.25)",
                                borderRadius: 9999,
                                padding: "6px 16px",
                            }}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill={BOSS_GOLD}>
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                            <span
                                style={{
                                    color: BOSS_GOLD,
                                    fontSize: 20,
                                    fontWeight: 900,
                                    letterSpacing: "0.1em",
                                    textTransform: "uppercase",
                                }}
                            >
                                Rank #{offer.rank}
                            </span>
                        </div>

                        {/* Game with Logo */}
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 10,
                                background: "rgba(0,0,0,0.5)",
                                border: "1px solid rgba(255,255,255,0.1)",
                                borderRadius: 9999,
                                padding: "6px 16px",
                            }}
                        >
                            <span
                                style={{
                                    color: NEON_PINK,
                                    fontSize: 20,
                                    fontWeight: 900,
                                    textTransform: "uppercase",
                                    letterSpacing: "0.08em",
                                }}
                            >
                                {offer.game}
                            </span>
                        </div>
                    </div>

                    {/* 3-column player layout */}
                    <div
                        style={{
                            display: "flex",
                            flex: 1,
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 16,
                            marginTop: 8,
                        }}
                    >
                        {/* Challenger */}
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                gap: 12,
                                minWidth: 220,
                            }}
                        >
                            {/* Avatar circle */}
                            <div
                                style={{
                                    width: 160,
                                    height: 160,
                                    borderRadius: "50%",
                                    border: "3px solid rgba(255,210,55,0.5)",
                                    overflow: "hidden",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    background: "#08090d",
                                }}
                            >
                                <img
                                    src={`${process.env.NEXT_PUBLIC_SITE_URL ?? "https://modelbossoffers.com"}${offer.challenger.avatar
                                        }`}
                                    alt={challengerName}
                                    width={160}
                                    height={160}
                                    style={{
                                        objectFit: "cover",
                                        width: "100%",
                                        height: "100%",
                                    }}
                                />
                            </div>
                            <span
                                style={{
                                    color: BOSS_GOLD,
                                    fontSize: 28,
                                    fontWeight: 900,
                                    textShadow: "0 0 12px rgba(255,210,55,0.45)",
                                    textAlign: "center",
                                    maxWidth: 220,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                {challengerName}
                            </span>
                            <span
                                style={{
                                    color: BOSS_GOLD,
                                    fontSize: 24,
                                    fontWeight: 900,
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 4,
                                }}
                            >
                                {formattedAmount} pts
                            </span>
                        </div>

                        {/* VS Center */}
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                gap: 8,
                                padding: "0 20px",
                            }}
                        >
                            <span
                                style={{
                                    color: ACCENT_PINK,
                                    fontSize: 52,
                                    fontWeight: 900,
                                    fontStyle: "italic",
                                    textTransform: "uppercase",
                                    textShadow: "0 0 14px rgba(255,54,255,0.7)",
                                }}
                            >
                                VS
                            </span>
                            <div
                                style={{
                                    width: 64,
                                    height: 64,
                                    borderRadius: "50%",
                                    border: "2px solid rgba(98,255,82,0.4)",
                                    overflow: "hidden",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    background: "#08090d",
                                }}
                            >
                                <span
                                    style={{
                                        color: NEON_GREEN,
                                        fontSize: 11,
                                        fontWeight: 900,
                                        textAlign: "center",
                                        lineHeight: 1.2,
                                        padding: 4,
                                    }}
                                >
                                    MODEL
                                    <br />
                                    BOSS
                                </span>
                            </div>
                        </div>

                        {/* Target / Receiver */}
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                gap: 12,
                                minWidth: 220,
                            }}
                        >
                            {/* Avatar circle */}
                            <div
                                style={{
                                    width: 160,
                                    height: 160,
                                    borderRadius: "50%",
                                    border: "3px solid rgba(255,76,255,0.5)",
                                    overflow: "hidden",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    background: "#08090d",
                                }}
                            >
                                <img
                                    src={`${process.env.NEXT_PUBLIC_SITE_URL ?? "https://modelbossoffers.com"}${offer.target.avatar
                                        }`}
                                    alt={targetName}
                                    width={160}
                                    height={160}
                                    style={{
                                        objectFit: "cover",
                                        width: "100%",
                                        height: "100%",
                                    }}
                                />
                            </div>
                            <span
                                style={{
                                    color: NEON_PINK,
                                    fontSize: 28,
                                    fontWeight: 900,
                                    textShadow: "0 0 12px rgba(255,76,255,0.55)",
                                    textAlign: "center",
                                    maxWidth: 220,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                {targetName}
                            </span>
                            <span
                                style={{
                                    color: NEON_PINK,
                                    fontSize: 16,
                                    fontWeight: 700,
                                }}
                            >
                                Target
                            </span>
                        </div>
                    </div>

                    {/* Bottom: Challenge info + Branding */}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginTop: 12,
                            paddingTop: 12,
                            borderTop: "1px solid rgba(255,255,255,0.08)",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                            }}
                        >
                            <span
                                style={{
                                    color: SUBTLE_WHITE,
                                    fontSize: 16,
                                    fontWeight: 600,
                                }}
                            >
                                {offer.kind === "supporting" ? "🛡️ Supporting" : "🗳️ Voting"}
                            </span>
                            <span
                                style={{
                                    color: "rgba(255,255,255,0.3)",
                                    fontSize: 16,
                                }}
                            >
                                |
                            </span>
                            <span
                                style={{
                                    color: SUBTLE_WHITE,
                                    fontSize: 16,
                                    fontWeight: 600,
                                }}
                            >
                                ⏱ {offer.durationHours}h Duration
                            </span>
                        </div>

                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 4,
                            }}
                        >
                            <span
                                style={{
                                    color: "rgba(255,255,255,0.5)",
                                    fontSize: 14,
                                    fontWeight: 600,
                                }}
                            >
                                Model Boss Offers
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        ),
        {
            width: 1200,
            height: 630,
            // Use built-in fonts that Satori supports
            fonts: undefined,
        }
    );
}