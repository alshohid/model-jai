"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

const PaymentSuccessPage = () => {
    const router = useRouter();

    // Optional: Auto redirect after few seconds
    useEffect(() => {
        const timer = setTimeout(() => {
            router.push("/");
        }, 10000);

        return () => clearTimeout(timer);
    }, [router]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#111827] to-black px-4">
            <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 text-center shadow-2xl">

                {/* Animated Success Icon */}
                <div className="flex justify-center">
                    <div className="relative">
                        <div className="absolute inset-0 animate-ping rounded-full bg-green-500/30"></div>
                        <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-green-500 shadow-lg">
                            <svg
                                className="h-10 w-10 text-white animate-check"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Text Section */}
                <h1 className="mt-6 text-2xl font-semibold text-white">
                    Payment Successful!
                </h1>

                <p className="mt-3 text-sm text-white/60 leading-relaxed">
                    Your transaction has been completed successfully.
                    <br />
                    Points have been added to your account.
                </p>

                {/* Divider */}
                <div className="my-6 h-px w-full bg-white/10"></div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3">
                    <button
                        onClick={() => router.push("/")}
                        className="rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
                    >
                        Go to Home
                    </button>

                    <button
                        onClick={() => router.push("/point-store")}
                        className="rounded-lg border border-white/20 px-5 py-3 text-sm font-medium text-white/80 transition hover:bg-white/10"
                    >
                        Buy More Points
                    </button>
                </div>

                {/* Footer Info */}
                <p className="mt-6 text-xs text-white/40">
                    You will be redirected automatically in a few seconds.
                </p>
            </div>

            {/* Custom Animation */}
            <style jsx>{`
        .animate-check {
          animation: checkScale 0.4s ease-in-out;
        }

        @keyframes checkScale {
          0% {
            transform: scale(0.5);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
        </div>
    );
};

export default PaymentSuccessPage;
