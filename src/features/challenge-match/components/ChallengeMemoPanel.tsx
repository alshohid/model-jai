import Image from "next/image";

export default function ChallengeMemoPanel({ memo }: { memo: string }) {
  return (
    <section className="mt-5 flex items-start gap-3">
      <div className="flex-shrink-0">
        <Image src="/images/memo.PNG" alt="memo" width={45} height={45} className="rounded-none" />
      </div>
      <p className="min-w-0 text-[17px] font-bold leading-6 text-[#d329ff] [text-shadow:0_0_14px_rgba(211,41,255,0.38)] sm:text-xl">
        {memo}
      </p>
    </section>
  );
}
