import AuthAwareChallengeHomePreview from "@/features/challenge-match/components/AuthAwareChallengeHomePreview";
import StartStreamingRedirect from "./LiveStreamRedirectButton";
import PromotionalPriceOffer from "./PromotionalPriceOffer";

export default function HeroSection() {
    return (
        <section id="heroSection" className="relative min-h-screen w-full overflow-hidden">
            <div className="absolute inset-0">
                <div
                    className="h-full w-full bg-cover bg-center"
                    style={{ backgroundImage: "url('/images/home/modaljai_hero.jpg')" }}
                />
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: "url('/images/home/overlay.png')" }}
                />
            </div>

            <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-0 min-h-screen">
                <div className="min-h-screen grid ">
                    <div className="text-center w-full max-w-4xl mx-auto px-2">
                        <AuthAwareChallengeHomePreview />
                        <h1 className="font-heading font-extrabold text-white tracking-[1px] leading-[132%] text-[32px] sm:text-[44px] lg:text-[56px]">
                            Where Supporters <br className="hidden sm:block" />
                            Become Legends
                        </h1>

                        <p className="mt-3 text-white/80 text-xs sm:text-sm md:text-base leading-relaxed">
                            Skill-based 1v1 tournaments where supporters battle alongside the players. Back your
                            champion, compete in real-time, and rise as the ultimate Big Boss.
                        </p>

                        <div className="mt-5 flex justify-center">
                            <StartStreamingRedirect />
                        </div>

                        <div className="mt-10 flex justify-center pt-1">
                            <PromotionalPriceOffer />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
