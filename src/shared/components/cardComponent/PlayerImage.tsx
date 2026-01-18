import Image from "next/image";

export const PlayerImage = ({ src }: { src: string }) => (
    <div className="relative overflow-hidden">
        <Image src={src} alt="player" fill className="object-cover" />
    </div>
);