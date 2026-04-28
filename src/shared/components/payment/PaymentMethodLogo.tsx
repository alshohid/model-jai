"use client";

import Image from "next/image";

import { PaymentMethodConfig } from "@/shared/constants/paymentMethods";
import { cn } from "@/shared/lib/utils/cn";

type Props = {
    method: PaymentMethodConfig;
    className?: string;
    imageClassName?: string;
};

export default function PaymentMethodLogo({
    method,
    className,
    imageClassName,
}: Props) {
    return (
        <div
            className={cn(
                "flex size-12 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/8 p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]",
                className
            )}
        >
            <Image
                src={method.logo}
                alt={method.name}
                width={64}
                height={64}
                className={cn("h-full w-full object-contain", imageClassName)}
                unoptimized
            />
        </div>
    );
}
