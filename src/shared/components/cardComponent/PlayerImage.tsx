

export const PlayerImage = ({ src }: { src: string }) => (
    <div className="relative overflow-hidden">
        <img src={src} alt="player" width={100} height={100} className="object-cover rounded-full h-full w-full" />
    </div>
);











// import Image from "next/image";

// export const PlayerImage = ({ src }: { src: string }) => (
//     <div className="relative overflow-hidden">
//         <Image src={src} alt="player" width={100} height={100} className="object-cover" />
//     </div>
// );
