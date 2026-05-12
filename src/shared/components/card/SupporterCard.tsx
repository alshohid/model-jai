"use client";

import Image from "next/image";
import { cn } from "@/shared/lib/utils/cn";

type SupporterCardProps = {
    imageSrc: string;
    imageAlt?: string;
    title: string;
    name: string;
    className?: string;
    imageClassName?: string;
};

export default function SupporterCard({
    imageSrc,
    imageAlt = "Supporter",
    title,
    name,
    className,
    imageClassName,
}: SupporterCardProps) {
    return (
        <div className="flex w-full flex-col items-center justify-center gap-5">
            <div
                className={cn(
                    "w-full max-w-[434px] rounded-[16px] flex flex-col gap-[10px]",
                    className
                )}
            >
                <div className="rounded-[16px] bg-[#FFFFFF0D] p-3 md:p-4">
                    <div
                        className={cn(
                            "overflow-hidden rounded-[12px] bg-black",
                            imageClassName
                        )}
                    >
                        <Image
                            src={imageSrc}
                            alt={imageAlt}
                            width={434}
                            height={540}
                            className="block h-auto w-full object-contain"
                            sizes="(max-width: 768px) 100vw, 434px"
                            priority={false}
                        />
                    </div>
                </div>
            </div>
            <div className="w-full max-w-[434px] px-4 text-center">
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
                    {name}
                </h4>
            </div>
        </div>
    );
}
