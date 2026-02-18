"use client";

import { useRouter } from "next/navigation";

const PaymentCancelPage = () => {
    const router = useRouter();

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#111827] to-black px-4">
            <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 text-center shadow-2xl">

                {/* Cancel Icon */}
                <div className="flex justify-center">
                    <div className="relative">
                        <div className="absolute inset-0 animate-pulse rounded-full bg-red-500/20"></div>
                        <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-red-500 shadow-lg">
                            <svg
                                className="h-10 w-10 text-white"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Title */}
                <h1 className="mt-6 text-2xl font-semibold text-white">
                    Payment Cancelled
                </h1>

                {/* Description */}
                <p className="mt-3 text-sm text-white/60 leading-relaxed">
                    Your payment was not completed.
                    <br />
                    No charges have been made.
                </p>

                {/* Divider */}
                <div className="my-6 h-px w-full bg-white/10"></div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3">
                    <button
                        onClick={() => router.push("/point-store")}
                        className="rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
                    >
                        Try Again
                    </button>

                    <button
                        onClick={() => router.push("/")}
                        className="rounded-lg border border-white/20 px-5 py-3 text-sm font-medium text-white/80 transition hover:bg-white/10"
                    >
                        Go to Home
                    </button>
                </div>

                {/* Footer Text */}
                <p className="mt-6 text-xs text-white/40">
                    If you experienced any issues, please try again or contact support.
                </p>
            </div>
        </div>
    );
};

export default PaymentCancelPage;
