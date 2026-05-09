import Image from "next/image";
import Link from "next/link";
import { cn } from "@/shared/lib/utils/cn";

type Props = {
    className?: string;
};

export const SocialLinks = ({ className }: Props) => (
    <div className={cn("flex items-center justify-center gap-3", className)}>
        <Link href="https://www.tiktok.com/">
            <span className="flex size-8 items-center justify-center rounded-[10px] bg-black shadow-[0_8px_18px_rgba(0,0,0,0.22)] ring-1 ring-white/10 sm:size-9">
                <Image
                    src="/images/home/tiktok_1.png"
                    width={18}
                    height={18}
                    alt="tiktok"
                    className="h-[18px] w-[18px] object-contain"
                />
            </span>
        </Link>
        <Link href="https://www.twitch.tv/">
            <span className="flex size-8 items-center justify-center rounded-[10px] bg-[#9146FF] shadow-[0_8px_18px_rgba(145,70,255,0.3)] ring-1 ring-white/10 sm:size-9">
                <Image
                    src="/images/home/twitch.png"
                    width={18}
                    height={18}
                    alt="twitch"
                    className="h-[18px] w-[18px] object-contain"
                />
            </span>
        </Link>
    </div>
);
