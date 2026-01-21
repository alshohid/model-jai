import Image from "next/image";
import Link from "next/link";

export default function BrandMark() {
    return (
        <Link href={'/'} className="block">
            <div className="w-full flex items-center justify-center">
                <Image
                    src={'/images/home/brand-logo.png'}
                    alt="logo"
                    width={90}
                    height={90}
                    className="object-cover"
                    priority
                />
            </div>
        </Link>
    );
}