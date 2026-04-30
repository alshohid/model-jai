import BrandMark from "@/app/(public)/_components/brandMark/BrandMark";
import Skeleton from "@/shared/UI/Skeleton";

export default function AuthContainerSkeleton() {
    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-[#07090D] px-4 py-6 lg:px-6 lg:py-8">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,46,200,0.14),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(36,195,255,0.14),transparent_28%),linear-gradient(180deg,#07090D_0%,#0B0D12_100%)]" />
            <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.16)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.16)_1px,transparent_1px)] [background-size:72px_72px]" />

            <div className="relative flex min-h-[calc(100vh-3rem)] items-center justify-center">
                <div className="w-full max-w-[1480px] overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.015))] shadow-[0_30px_120px_rgba(0,0,0,0.5)] backdrop-blur-xl">
                    <div className="grid grid-cols-1 lg:min-h-[820px] lg:grid-cols-[minmax(0,1.45fr)_minmax(420px,0.95fr)]">
                        <div className="relative hidden h-full overflow-hidden bg-[#06070A] lg:block">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,62,200,0.18),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(36,195,255,0.16),transparent_32%)]" />
                            <div className="absolute left-8 top-8">
                                <Skeleton className="h-10 w-40 rounded-full bg-white/10" />
                            </div>

                            <div className="absolute inset-x-0 bottom-0 p-8 xl:p-10">
                                <div className="max-w-xl rounded-[28px] border border-white/12 bg-black/25 p-8 backdrop-blur-xl">
                                    <Skeleton className="h-3 w-36 bg-white/10" />
                                    <Skeleton className="mt-5 h-12 w-full max-w-[420px] rounded-xl bg-white/10" />
                                    <Skeleton className="mt-3 h-12 w-full max-w-[360px] rounded-xl bg-white/10" />
                                    <Skeleton className="mt-6 h-4 w-full max-w-[320px] bg-white/10" />

                                    <div className="mt-8 grid grid-cols-3 gap-3">
                                        <Skeleton className="h-24 rounded-2xl bg-white/10" />
                                        <Skeleton className="h-24 rounded-2xl bg-white/10" />
                                        <Skeleton className="h-24 rounded-2xl bg-white/10" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="relative flex items-center justify-center overflow-hidden px-6 py-10 lg:px-12 xl:px-16">
                            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,46,200,0.12),transparent_30%),radial-gradient(circle_at_bottom,rgba(36,195,255,0.10),transparent_34%)]" />
                            <div className="relative w-full max-w-[500px] rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(12,14,20,0.92),rgba(9,10,14,0.78))] px-6 py-7 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl sm:px-8 sm:py-9">
                                <div className="mb-6 flex items-center justify-center gap-4">
                                    <BrandMark />
                                </div>

                                <div className="text-center">
                                    <Skeleton className="mx-auto h-8 w-32 bg-white/10" />
                                    <Skeleton className="mx-auto mt-3 h-4 w-56 bg-white/10" />
                                </div>

                                <div className="mt-8 space-y-4">
                                    <Skeleton className="h-[50px] rounded-[8px] bg-white/10" />
                                    <Skeleton className="h-[50px] rounded-[8px] bg-white/10" />
                                    <Skeleton className="h-[50px] rounded-[8px] bg-white/10" />
                                    <Skeleton className="h-12 rounded-xl bg-white/10" />

                                    <div className="grid grid-cols-3 gap-3 pt-2">
                                        <Skeleton className="h-11 rounded-xl bg-white/10" />
                                        <Skeleton className="h-11 rounded-xl bg-white/10" />
                                        <Skeleton className="h-11 rounded-xl bg-white/10" />
                                    </div>

                                    <Skeleton className="mx-auto mt-4 h-4 w-44 bg-white/10" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
