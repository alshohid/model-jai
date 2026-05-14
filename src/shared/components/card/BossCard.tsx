import Image from "next/image";
import Link from "next/link";
import { getSafeImageSrc } from "@/shared/lib/utils/imagesrcvalidator";

export function BossCard({
    name,
    img,
    supportPlayerName,
    total,
    profileHref,
}: {
    name: string;
    img: string;
    supportPlayerName: string;
    total: number;
    profileHref?: string;
}) {
    const resolvedImageSrc = getSafeImageSrc(img, "/images/home/avatar_img.png");

    const imageContent = (
        <div className="w-full aspect-4/5 relative rounded-lg overflow-hidden bg-black">
            <Image
                src={resolvedImageSrc}
                alt={name}
                fill
                sizes="(max-width: 768px) 50vw, 220px"
                className="object-cover"
            />
        </div>
    );

    return (
        <div className="relative z-10">
            <div className="text-center flex flex-col items-center justify-center mb-2 md:mb-4">
                <div className="flex items-center justify-center gap-2 mb-1">
                    <div className="text-white font-black text-[0.9rem] md:text-[1.2rem]">
                        {total}
                    </div>
                    <div className="text-[#6EC1FF] flex items-center justify-center">
                        <svg width="20" height="20" viewBox="0 0 24 24" className="text-[#6EC1FF]" fill="none">
                            <path
                                d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z"
                                stroke="currentColor"
                                strokeWidth="1.6"
                            />
                            <path
                                d="M4 20a8 8 0 0 1 16 0"
                                stroke="currentColor"
                                strokeWidth="1.6"
                            />
                        </svg>
                    </div>
                </div>

                <h3 className="text-white font-extrabold text-[1rem] md:text-[1.8rem] uppercase">
                    {"Team " + supportPlayerName}
                </h3>
            </div>

            <div className="rounded-xl bg-black/40 border border-white/10 p-3">
                {profileHref ? (
                    <Link
                        href={profileHref}
                        className="block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                        aria-label={`View ${name} profile`}
                    >
                        {imageContent}
                    </Link>
                ) : (
                    imageContent
                )}

                <div className="mt-3 text-white/80 text-[0.5rem] md:text-[12px] font-semibold">
                    Big Boss Supporter
                </div>
                <div className="text-white font-black text-[0.7rem] md:text-[1rem]">
                    {profileHref ? (
                        <Link
                            href={profileHref}
                            className="inline-block transition hover:text-[#24C3FF] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                        >
                            {name}
                        </Link>
                    ) : (
                        name
                    )}
                </div>
            </div>
        </div>
    );
}
