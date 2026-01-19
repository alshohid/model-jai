import Image from "next/image";
import Link from "next/link";

export default function BrandMark() {
    return (
        <Link href={'/'} className="block">
            <div className="relative flex items-center justify-center ">
                <Image
                    src={'/images/home/logo_4.png'}
                    alt="logo"
                    width={80}
                    height={80}
                    className="object-cover"
                    priority
                />
            </div>
        </Link>
    );
}