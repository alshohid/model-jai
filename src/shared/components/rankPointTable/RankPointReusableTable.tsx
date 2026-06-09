"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    FALLBACK_SUPPORTER_IMAGE,
    type SupporterRankingRow,
} from "@/shared/lib/ranking/supporterRanking";
import { getSafeImageSrc } from "@/shared/lib/utils/imagesrcvalidator";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/shared/UI/reusable/table/table";

const SupporterIdentity = ({
    supporterImage,
    supporterName,
}: {
    supporterImage: string;
    supporterName: string;
}) => {
    const [imageSrc, setImageSrc] = useState(() =>
        getSafeImageSrc(supporterImage, FALLBACK_SUPPORTER_IMAGE)
    );
    const [isImageLoaded, setIsImageLoaded] = useState(false);
    return (
        <>
            <span className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full border border-white/35 bg-white/10">
                {!isImageLoaded ? (
                    <span className="absolute inset-0 animate-pulse rounded-full bg-[linear-gradient(90deg,rgba(255,255,255,0.08),rgba(255,255,255,0.28),rgba(255,255,255,0.08))]" />
                ) : null}
                <Image
                    src={imageSrc}
                    alt={supporterName}
                    width={64}
                    height={64}
                    className={`h-full w-full object-cover transition-opacity duration-200 ${
                        isImageLoaded ? "opacity-100" : "opacity-0"
                    }`}
                    unoptimized
                    onLoad={() => setIsImageLoaded(true)}
                    onError={() => {
                        if (imageSrc !== FALLBACK_SUPPORTER_IMAGE) {
                            setImageSrc(FALLBACK_SUPPORTER_IMAGE);
                            setIsImageLoaded(false);
                            return;
                        }

                        setIsImageLoaded(true);
                    }}
                />
            </span>
            <span className="min-w-0 truncate">{supporterName}</span>
        </>
    );
};

const RankPointReusableTable = ({
    rows,
    isLoading,
}: {
    rows?: SupporterRankingRow[] | null;
    isLoading?: boolean;
}) => {
    const currentItems = rows ?? [];
    const firstColumnWidth = 120;
    const secondColumnWidth = 240;
    const thirdColumnWidth = 140;
    const fourthColumnWidth = 360;
    const minTableWidthPx =
        firstColumnWidth +
        secondColumnWidth +
        thirdColumnWidth +
        fourthColumnWidth;

    return (
        <div className="w-full">
            <div className="w-full rounded-[8px] border border-white/25 overflow-hidden bg-[#D2D2D51A] backdrop-blur-md">
                {isLoading ? (
                    <div className="p-4">
                        <div className="h-12 rounded-md bg-white/10 animate-pulse mb-3" />
                        {[1, 2, 3].map((item) => (
                            <div
                                key={item}
                                className="h-14 rounded-md bg-white/10 animate-pulse mb-2"
                            />
                        ))}
                    </div>
                ) : (
                    <Table
                        dragScrollMode="both"
                        containerClassName="max-h-[260px] overflow-y-auto overscroll-y-contain"
                        className="w-full table-fixed"
                        style={{ minWidth: `${minTableWidthPx}px` }}
                    >
                        <TableCaption />

                        <colgroup>
                            <col style={{ width: `${firstColumnWidth}px` }} />
                            <col style={{ width: `${secondColumnWidth}px` }} />
                            <col style={{ width: `${thirdColumnWidth}px` }} />
                            <col style={{ width: `${fourthColumnWidth}px` }} />
                        </colgroup>

                        <TableHeader>
                            <TableRow className="border-b border-white/25 bg-[#B02383]">
                                <TableHead className="sticky top-0 z-10 h-auto border-r border-white/25 bg-[#B02383] px-3 py-4 text-center text-[14px] font-light leading-[1.24] text-white sm:px-5 sm:text-[18px] md:text-[20px]">
                                    Rank Boss No
                                </TableHead>
                                <TableHead className="sticky top-0 z-10 h-auto border-r border-white/25 bg-[#B02383] px-3 py-4 text-center text-[14px] font-light leading-[1.24] text-white sm:px-5 sm:text-[18px] md:text-[20px]">
                                    Boss Name
                                </TableHead>
                                <TableHead className="sticky top-0 z-10 h-auto border-r border-white/25 bg-[#B02383] px-3 py-4 text-center text-[14px] font-light leading-[1.24] text-white sm:px-5 sm:text-[18px] md:text-[20px]">
                                    User ID
                                </TableHead>
                                <TableHead className="sticky top-0 z-10 h-auto bg-[#B02383] px-3 py-4 text-left text-[14px] font-light leading-[1.24] text-white whitespace-normal sm:px-5 sm:text-[18px] md:text-[20px]">
                                    Range Point Match Support From Highest to Lowest
                                </TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {currentItems.length ? (
                                currentItems.map((item, rowIndex) => {
                                    const supporterProfileHref =
                                        item.userId && item.userId !== "N/A"
                                            ? `/artist/${item.userId}`
                                            : undefined;
                                    const supporterIdentity = (
                                        <SupporterIdentity
                                            key={item.supporterImage}
                                            supporterImage={item.supporterImage}
                                            supporterName={item.supporterName}
                                        />
                                    );

                                    return (
                                        <TableRow
                                            key={item.id ?? rowIndex}
                                            className="border-b border-white/20 hover:bg-white/10"
                                        >
                                            <TableCell
                                                className="border-r border-white/20 px-3 py-4 text-center text-[13px] text-white/90 whitespace-nowrap sm:px-5 sm:text-[14px]"
                                            >
                                                <span className="inline-flex min-w-[54px] items-center justify-center rounded-md border border-white px-2 py-1 text-white">
                                                    {item.serialNo}
                                                </span>
                                            </TableCell>

                                            <TableCell
                                                className="border-r border-white/20 px-3 py-4 text-left text-[13px] text-white/90 whitespace-nowrap sm:px-5 sm:text-[14px]"
                                            >
                                                {supporterProfileHref ? (
                                                    <Link
                                                        href={supporterProfileHref}
                                                        className="inline-flex max-w-full items-center gap-2 transition hover:text-[#24C3FF] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                                                    >
                                                        {supporterIdentity}
                                                    </Link>
                                                ) : (
                                                    <span className="inline-flex max-w-full items-center gap-2">
                                                        {supporterIdentity}
                                                    </span>
                                                )}
                                            </TableCell>

                                            <TableCell className="border-r border-white/20 px-3 py-4 text-center text-[13px] text-white/90 whitespace-nowrap sm:px-5 sm:text-[14px]">
                                                {item.userId}
                                            </TableCell>

                                            <TableCell className="px-3 py-4 text-left text-[13px] text-white/90 whitespace-normal break-words sm:px-5 sm:text-[14px]">
                                                {item.supportedAmounts}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={4}
                                        className="py-10 text-center text-white/70"
                                    >
                                        No Data Found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                )}
            </div>
        </div>
    );
};

export default RankPointReusableTable;
