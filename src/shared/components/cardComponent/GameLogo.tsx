import clsx from "clsx";
import Image from "next/image";

 export const GameLogo = ({ src, mobile }: { src: string; mobile?: boolean }) => (
    <div
        className={clsx(
            "relative",
            mobile ? "h-[24px] w-[80px]" : "aspect-[18/6]"
        )}
    >
        <Image src={src} alt="game logo" fill className="object-contain" />
    </div>
);