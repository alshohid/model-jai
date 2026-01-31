import Image from "next/image";
import Link from "next/link";

export default function BrandMark({
    width=130,
    height = 90,
    
}) {
    return (
        <Link href={'/'} className="block">
            <div className="flex items-center justify-center">
                <Image
                    src={'/images/home/brand-logo.png'}
                    alt="logo"
                    width={width}
                    height={height}
                    className="object-contain"
                    priority
                />
            </div>
        </Link>
    );
}