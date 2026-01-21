import Image from "next/image";
import Link from "next/link";

export default function BrandMark() {
    return (
        <Link href={'/'} className="block">
            <div className="relative flex items-center justify-center ">
                <Image
                    src={'/images/home/main_logo.png'}
                    alt="logo"
                    width={90}
                    height={70}
                    className="object-cover"
                    priority
                />
            </div>
        </Link>
    );
}