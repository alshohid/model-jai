import Image from "next/image";
import Skeleton from "@/shared/UI/Skeleton";
import { cn } from "@/shared/lib/utils/cn";
import { UserPost } from "@/types/user/usermanagement";

type MissionarySectionProps = {
    posts?: UserPost[];
    isLoading?: boolean;
    isError?: boolean;
    title?: string;
    subtitle?: string;
    withContainer?: boolean;
};

type GalleryItem = {
    id: string;
    image: string;
    description: string;
    created_at?: string;
};

const fallbackItems: GalleryItem[] = [
    {
        id: "1",
        image: "/images/home/p1.png",
        description: "Featured moment from the gallery",
    },
    {
        id: "2",
        image: "/images/home/m1.jpg",
        description: "Another standout image from the collection",
    },
    {
        id: "3",
        image: "/images/home/m2.jpg",
        description: "Highlights from recent activity",
    },
    {
        id: "4",
        image: "/images/home/m3.jpg",
        description: "Captured memory from the profile feed",
    },
    {
        id: "5",
        image: "/images/home/pro_2.jpg",
        description: "Styled visual from the gallery wall",
    },
    {
        id: "6",
        image: "/images/home/pro_4.jpg",
        description: "Another featured visual from the page",
    },
];

const dimensionPresets = [
    { width: 1200, height: 1560 },
    { width: 1200, height: 920 },
    { width: 1200, height: 1420 },
    { width: 1200, height: 1120 },
];

const parseApiDate = (value?: string | null) => {
    if (!value) return null;

    const normalized = value.includes("T") ? value : value.replace(" ", "T");
    const date = new Date(normalized);

    return Number.isNaN(date.getTime()) ? null : date;
};

const formatPostDate = (value?: string | null) => {
    const date = parseApiDate(value);

    if (!date) return "Recently shared";

    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(date);
};

function MissionaryGridSkeleton() {
    return (
        <div className="columns-1 gap-5 sm:columns-2 lg:columns-3 xl:columns-4">
            {Array.from({ length: 6 }, (_, index) => {
                const preset = dimensionPresets[index % dimensionPresets.length];
                const aspectRatio = `${preset.width}/${preset.height}`;

                return (
                        <div key={index} className="mb-5 break-inside-avoid">
                            <div className="overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.04]">
                                <div
                                    className="animate-pulse bg-gray-300/20"
                                    style={{ aspectRatio }}
                                />
                                <div className="space-y-3 p-4">
                                    <Skeleton className="h-3 w-24" />
                                    <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-3/4" />
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default function MissionarySection({
    posts,
    isLoading = false,
    isError = false,
    title = "Artist moments",
    subtitle = "A live gallery of the latest posts shared from this profile.",
    withContainer = true,
}: MissionarySectionProps) {
    const isFallbackMode = typeof posts === "undefined";

    const galleryItems: GalleryItem[] = isFallbackMode
        ? fallbackItems
        : [...posts].sort((left, right) => {
            const leftTime = parseApiDate(left.created_at)?.getTime() ?? 0;
            const rightTime = parseApiDate(right.created_at)?.getTime() ?? 0;

            return rightTime - leftTime;
        }).map((post) => ({
            id: String(post.id),
            image: post.image,
            description: post.description || "No caption added yet.",
            created_at: post.created_at,
        }));

    const content = (
        <section className="py-10 md:py-14">
            <div className="mb-7 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div className="max-w-2xl">
                    <span className="inline-flex rounded-full border border-[#11B5FF]/20 bg-[#11B5FF]/10 px-3 py-2 text-[11px] font-medium uppercase tracking-[0.24em] text-[#95DEFF]">
                        Gallery
                    </span>
                    <h2 className="mt-4 text-2xl font-semibold text-white md:text-[32px]">
                        {title}
                    </h2>
                    <p className="mt-3 text-sm leading-6 text-white/60 md:text-[15px]">
                        {subtitle}
                    </p>
                </div>

                {!isLoading && !isError && !isFallbackMode ? (
                    <div className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm text-white/70">
                        {galleryItems.length} posts
                    </div>
                ) : null}
            </div>

            {isLoading ? <MissionaryGridSkeleton /> : null}

            {!isLoading && isError ? (
                <div className="rounded-[24px] border border-[#FF4D6D]/15 bg-[#FF4D6D]/8 px-5 py-10 text-center">
                    <h3 className="text-lg font-semibold text-white">
                        Posts could not be loaded
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-white/60">
                        Please try again shortly. The artist profile loaded, but the post
                        gallery is unavailable right now.
                    </p>
                </div>
            ) : null}

            {!isLoading && !isError && !isFallbackMode && galleryItems.length === 0 ? (
                <div className="rounded-[24px] border border-dashed border-white/12 bg-white/[0.04] px-5 py-14 text-center">
                    <h3 className="text-lg font-semibold text-white">
                        No posts shared yet
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-white/60">
                        This artist has not uploaded any gallery posts yet.
                    </p>
                </div>
            ) : null}

            {!isLoading && !isError && galleryItems.length > 0 ? (
                <div className="columns-1 gap-5 sm:columns-2 lg:columns-3 xl:columns-4">
                    {galleryItems.map((item, index) => {
                        const preset = dimensionPresets[index % dimensionPresets.length];

                        return (
                            <article
                                key={item.id}
                                className="group mb-5 break-inside-avoid"
                            >
                                <div className="overflow-hidden rounded-[24px] border border-white/10 bg-[#140E15] shadow-[0_20px_48px_rgba(0,0,0,0.28)]">
                                    <div className="relative overflow-hidden">
                                        <Image
                                            src={item.image}
                                            alt={item.description || "Artist post"}
                                            width={preset.width}
                                            height={preset.height}
                                            className="h-auto w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                                            unoptimized
                                        />
                                        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                                    </div>

                                    <div className="p-4">
                                        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#8FDBFF]">
                                            {formatPostDate(item.created_at)}
                                        </p>
                                        <p className="mt-3 text-sm leading-6 text-white/78">
                                            {item.description}
                                        </p>
                                    </div>
                                </div>
                            </article>
                        );
                    })}
                </div>
            ) : null}
        </section>
    );

    return withContainer ? <div className={cn("container")}>{content}</div> : content;
}
