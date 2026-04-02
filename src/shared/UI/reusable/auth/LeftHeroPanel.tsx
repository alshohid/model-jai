import Image from "next/image";

export function LeftHeroPanel() {
    return (
        <div className="relative h-full min-h-[780px] w-full overflow-hidden bg-[#06070A]">
            <Image
                src="/images/home/authimg.png"
                alt="Hero"
                fill
                priority
                className="object-cover object-center"
                sizes="(min-width: 1024px) 813px, 0px"
            />

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,62,200,0.28),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(36,195,255,0.22),transparent_32%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,7,10,0.02)_0%,rgba(6,7,10,0.55)_58%,rgba(6,7,10,0.92)_100%)]" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-[#0B0D12]" />

            <div className="absolute left-8 top-8 rounded-full border border-white/15 bg-black/30 px-4 py-2 backdrop-blur-md">
                <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-white/70">
                    Live Creator Arena
                </p>
            </div>

            <div className="absolute inset-x-0 bottom-0 p-8 xl:p-10">
                <div className="max-w-xl rounded-[28px] border border-white/12 bg-black/30 p-8 backdrop-blur-xl shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.4em] text-[#24C3FF]">
                        Stream. Compete. Earn.
                    </p>
                    <h2 className="mt-4 max-w-lg font-serif text-4xl leading-[1.05] text-white xl:text-5xl">
                        Build a standout creator profile that feels elite from the first click.
                    </h2>
                    <p className="mt-4 max-w-md text-sm leading-6 text-white/68">
                        Join matches, grow your audience, and convert every highlight into momentum with a sharper creator identity.
                    </p>

                    <div className="mt-8 grid grid-cols-3 gap-3">
                        <div className="rounded-2xl border border-white/10 bg-white/6 px-4 py-4">
                            <p className="text-[11px] uppercase tracking-[0.25em] text-white/45">
                                Matches
                            </p>
                            <p className="mt-2 text-2xl font-semibold text-white">24/7</p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/6 px-4 py-4">
                            <p className="text-[11px] uppercase tracking-[0.25em] text-white/45">
                                Reach
                            </p>
                            <p className="mt-2 text-2xl font-semibold text-white">Global</p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/6 px-4 py-4">
                            <p className="text-[11px] uppercase tracking-[0.25em] text-white/45">
                                Payout
                            </p>
                            <p className="mt-2 text-2xl font-semibold text-white">Fast</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
