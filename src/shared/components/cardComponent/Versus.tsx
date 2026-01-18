import Image from "next/image";

 export const Versus = ({ src }: { src: string }) => (
    <div className="flex items-center justify-center">
        <Image src={src} alt="versus" width={120} height={120} unoptimized />
    </div>
);