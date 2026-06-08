"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { challengeMatchOffers } from "../data/challengeMatchMockData";
import ChallengeOfferCard from "./ChallengeOfferCard";
import Image from "next/image";

export default function ChallengeHomePreview() {
  const router = useRouter();
  const topOffers = challengeMatchOffers.slice(0, 3);

  return (
    <div className="mx-auto w-full  rounded-[24px]  text-left ">

      <Link href="/challenge-dashboard">
        <div className="relative mx-auto w-full max-w-[520px]">
          <Image
            src="/images/challenge.png"
            alt="Big Boss Challenge"
            width={500}
            height={500}
            className="object-contain"
          />
        </div>
      </Link>
      <div className="w-full">
        {topOffers.map((offer) => (
          <ChallengeOfferCard
            key={offer.id}
            offer={offer}
            compact
            onAccept={() => router.push(`/challenge-dashboard/${offer.id}`)}
          />
        ))}
      </div>
    </div>
  );
}
