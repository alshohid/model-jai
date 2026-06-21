// app/challenge-dashboard/[offerId]/opengraph-image.tsx
import { ImageResponse } from "next/og";
import { getChallengeMatchOfferById } from "@/features/challenge-match/data/challengeMatchMockData";
import { getSafeImageSrc } from "@/shared/lib/utils/imagesrcvalidator";

export const runtime = "edge";
export const contentType = "image/png";
export const size = { width: 1200, height: 630 };

export default async function OGImage({
    params,
    searchParams,
}: {
    params: { offerId: string };
    searchParams: { ref?: string };
}) {
    const offer = getChallengeMatchOfferById(params.offerId);

    if (!offer) {
        return new ImageResponse(
            <div
                style={{
                    width: 1200,
                    height: 630,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#090a0f",
                    color: "white",
                    fontSize: 48,
                    fontWeight: 700,
                }}
            >
                Offer not found
            </div>,
            size
        );
    }

    // ডেটা নেওয়া
    const { challenger, target, game, amount, rank, memo } = offer;
    const challengerName = challenger.name;
    const targetName = target.name;
    const avatarChallenger = getSafeImageSrc(
        challenger.avatar,
        "/images/home/leftPlayerImg.png"
    );
    const avatarTarget = getSafeImageSrc(
        target.avatar,
        "/images/accept.PNG"
    );

    // রেফারেল কোড (যদি থাকে)
    const refCode = searchParams.ref || "";
    const referralText = refCode
        ? `modelbossoffers.com/ref/${refCode}`
        : "modelbossoffers.com";

    return new ImageResponse(
        <div
            style={{
                width: 1200,
                height: 630,
                display: "flex",
                flexDirection: "column",
                position: "relative",
                backgroundColor: "#090a0f",
                overflow: "hidden",
                fontFamily: "Inter, sans-serif",
            }}
        >
            {/* Background Image */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage:
                        "url('https://modelbossoffers.com/images/home/modaljai_hero.jpg')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    opacity: 0.5,
                }}
            />
            {/* Overlay Gradient */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    background:
                        "linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(5,5,10,0.95) 70%)",
                }}
            />

            {/* Main Content */}
            <div
                style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-around",
                    padding: "40px 60px",
                    zIndex: 2,
                }}
            >
                {/* Left – Challenger */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 8,
                        width: 200,
                    }}
                >
                    <img
                        src={avatarChallenger}
                        alt={challengerName}
                        style={{
                            width: 120,
                            height: 120,
                            borderRadius: "50%",
                            border: "3px solid rgba(255,255,255,0.2)",
                            objectFit: "cover",
                        }}
                    />
                    <p
                        style={{
                            fontSize: 28,
                            fontWeight: 700,
                            color: "#ffd237",
                            textShadow: "0 0 12px rgba(255,210,55,0.45)",
                            margin: 0,
                            textAlign: "center",
                            whiteSpace: "nowrap",
                        }}
                    >
                        {challengerName}
                    </p>
                    <p
                        style={{
                            fontSize: 24,
                            fontWeight: 700,
                            color: "#ffd237",
                            margin: 0,
                        }}
                    >
                        +${amount}
                    </p>
                </div>

                {/* Center – VS + Rank */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 8,
                    }}
                >
                    <p
                        style={{
                            fontSize: 60,
                            fontWeight: 900,
                            color: "#ff36ff",
                            textShadow: "0 0 20px rgba(255,54,255,0.7)",
                            margin: 0,
                        }}
                    >
                        VS
                    </p>
                    <p
                        style={{
                            fontSize: 22,
                            fontWeight: 700,
                            color: "#ffd237",
                            backgroundColor: "rgba(0,0,0,0.5)",
                            padding: "6px 18px",
                            borderRadius: 40,
                            border: "1px solid rgba(255,210,55,0.3)",
                            margin: 0,
                        }}
                    >
                        Rank #{rank}
                    </p>
                </div>

                {/* Right – Target */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 8,
                        width: 200,
                    }}
                >
                    <img
                        src={avatarTarget}
                        alt={targetName}
                        style={{
                            width: 120,
                            height: 120,
                            borderRadius: "50%",
                            border: "3px solid rgba(255,255,255,0.2)",
                            objectFit: "cover",
                        }}
                    />
                    <p
                        style={{
                            fontSize: 28,
                            fontWeight: 700,
                            color: "#ff4cff",
                            textShadow: "0 0 12px rgba(255,76,255,0.55)",
                            margin: 0,
                            textAlign: "center",
                            whiteSpace: "nowrap",
                        }}
                    >
                        {targetName}
                    </p>
                    <p
                        style={{
                            fontSize: 18,
                            color: "rgba(255,255,255,0.55)",
                            margin: 0,
                        }}
                    >
                        Challenge Receiver
                    </p>
                </div>
            </div>

            {/* Footer with Referral Link */}
            <div
                style={{
                    height: 60,
                    background: "rgba(0,0,0,0.7)",
                    borderTop: "1px solid rgba(255,255,255,0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 2,
                    gap: 16,
                }}
            >
                <p
                    style={{
                        fontSize: 20,
                        fontWeight: 600,
                        color: "rgba(255,255,255,0.6)",
                        letterSpacing: "0.05em",
                        margin: 0,
                    }}
                >
                    {game} • {referralText}
                </p>
            </div>
        </div>,
        {
            ...size,
            fonts: [
                {
                    name: "Inter",
                    data: await fetch(
                        "https://fonts.gstatic.com/s/inter/v13/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa2JL7W0Q5n-wU.woff2"
                    ).then((res) => res.arrayBuffer()),
                    style: "normal",
                    weight: 700,
                },
            ],
        }
    );
}