import Image from "next/image";
import Link from "next/link";

export const SocialLinks = () => (
    <div className="flex justify-center items-center gap-2">
        <Link href="https://www.tiktok.com/">
            <Image
                src="/images/home/tiktok_1.png"
                width={48}
                height={48}
                alt="tiktok"
                className="w-8 h-8 md:w-12 md:h-12"
            />
        </Link>
        <Link href="https://www.twitch.tv/">
            <Image
                src="/images/home/twitch.png"
                width={32}
                height={32}
                alt="twitch"
                className="w-6 h-6 md:w-8 md:h-8"
            />
        </Link>
    </div>
);