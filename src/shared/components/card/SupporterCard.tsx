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
        <div className="w-full justify-center gap-6 ">
            <div
                className={cn(
                    "w-full max-w-[434px] rounded-[16px] flex flex-col gap-[10px]",
                    className
                )}
            >
                <div className="rounded-[16px] bg-[#FFFFFF0D] p-3">
                    <div className={cn("relative w-full aspect-square rounded-[12px] overflow-hidden", imageClassName)}>
                        <Image
                            src={imageSrc}
                            alt={imageAlt}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 434px"
                            priority={false}
                        />
                    </div>
                </div>
            </div>
            <div className="w-full text-center p-4">
                <h4
                    className={[
                        "text-white",
                        "font-bold",
                        "text-[1rem] md:text-[3rem] ",
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
