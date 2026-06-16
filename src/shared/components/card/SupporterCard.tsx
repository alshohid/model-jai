"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/shared/lib/utils/cn";
import { getSafeImageSrc } from "@/shared/lib/utils/imagesrcvalidator";
import { PhilippinePesoIcon } from "lucide-react";

type SupporterCardProps = {
    imageSrc: string;
    imageAlt?: string;
    title: string;
    name: string;
    profileHref?: string;
    className?: string;
    imageClassName?: string;
    totalSupportedAmount?: number;
};

export default function SupporterCard({
    imageSrc,
    imageAlt = "Supporter",
    title,
    name,
    profileHref,
    className,
    imageClassName,
    totalSupportedAmount,
}: SupporterCardProps) {
    const resolvedImageSrc = getSafeImageSrc(
        imageSrc,
        "/images/home/profile_img.png"
    );

    const imageContent = (
        <div
            className={cn(
                "overflow-hidden rounded-[12px] bg-black",
                imageClassName
            )}
        >
            <Image
                src={resolvedImageSrc}
                alt={imageAlt}
                width={434}
                height={540}
                className="block h-auto w-full object-contain"
                sizes="(max-width: 768px) 100vw, 434px"
                priority={false}
            />
        </div>
    );

    return (
        <div className="flex w-full flex-col items-center justify-center gap-5">
            <div
                className={cn(
                    "w-full max-w-[434px] rounded-[16px] flex flex-col gap-[10px]",
                    className
                )}
            >
                <div className="rounded-[16px] bg-[#FFFFFF0D] p-3 md:p-4">
                    {profileHref ? (
                        <Link
                            href={profileHref}
                            className="block rounded-[12px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                            aria-label={`View ${name} profile`}
                        >
                            {imageContent}
                        </Link>
                    ) : (
                        imageContent
                    )}
                </div>
            </div>
            <div className="w-full  px-4 text-center">
                <p className="text-white text-[1.5rem] md:text-[2rem] font-bold flex gap-1 items-center justify-center">{totalSupportedAmount}<PhilippinePesoIcon className="w-5 h-5 md:w-8 md:h-8" /></p>
                <h4
                    className={[
                        "text-white",
                        "font-bold",
                        "text-[1rem] md:text-[3rem]",
                        "leading-none",
                        "tracking-[0.3px]",
                    ].join(" ")}
                >
                    {title}
                    <br />
                    {profileHref ? (
                        <Link
                            href={profileHref}
                            className="inline-block transition hover:text-[#24C3FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                        >
                            {name}
                        </Link>
                    ) : (
                        name
                    )}
                </h4>
            </div>
        </div>
    );
}
