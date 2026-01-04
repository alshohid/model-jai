import StartStreamingButton from "@/shared/ui/button/StartStreamingButton";
import PublicNavbar from "../publicNavbar/PublicNavbar";


export default function HeroSection() {
    return (
        <section className="relative w-full overflow-hidden">
            <div className="absolute inset-0">
                <div
                    className="h-full w-full bg-cover bg-center"
                    style={{ backgroundImage: "url('/images/home/herobg.png')" }}
                />
                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute inset-0 bg-linear-to-b from-black/15 via-black/35 to-black/60" />
            </div>

            <div className="relative z-10 mx-auto w-full max-w-400 px-4 sm:px-6 lg:px-0">
                <div
                    className={[
                        "flex flex-col",
                        "pt-5 gap-2.5",        
                        "min-h-svh lg:min-h-0",
                        "lg:h-197.5",              
                    ].join(" ")}
                >
                    <PublicNavbar />

                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center max-w-3xl px-2">
                            <h1 className="font-heading font-extrabold text-white tracking-[1px] leading-[132%] text-[32px] sm:text-[44px] lg:text-[56px]">
                                Where Supporters <br className="hidden sm:block" />
                                Become Legends
                            </h1>

                            <p className="mt-3 text-white/80 text-xs sm:text-sm md:text-base leading-relaxed">
                                Skill-based 1v1 tournaments where supporters battle alongside the players. Back your
                                champion, compete in real-time, and rise as the ultimate Big Boss.
                            </p>

                            <div className="mt-5 flex justify-center">
                                <StartStreamingButton>
                                    Start Streaming
                                </StartStreamingButton>
                            </div>
                        </div>
                    </div>

                    <div className="hidden lg:block h-1" />
                </div>
            </div>
        </section>
    );
}
