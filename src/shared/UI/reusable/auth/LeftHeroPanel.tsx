import Image from "next/image";

export function LeftHeroPanel() {
    return (
        <div className="relative w-full lg:h-[639.42px]">
            <Image
                src="/images/home/authimg.png"
                alt="Hero"
                fill
                priority
                className="object-cover"
                sizes="(min-width: 1024px) 813px, 0px"
            />

            {/* dark overlay + right fade */}
            <div className="absolute inset-0 bg-black/25" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#0B0D12]" />
        </div>
    );
}
