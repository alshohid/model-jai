"use client";

import Link from "next/link";

export default function AccountFailedPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-black px-4">
            <div className="w-full max-w-md bg-[#0f1117] border border-[#36394A] rounded-[20px] p-8 text-center shadow-xl">

                {/* Animated Error Circle */}
                <div className="flex justify-center mb-6">
                    <div className="relative flex items-center justify-center">

                        {/* Soft Pulse */}
                        <span className="absolute inline-flex h-28 w-28 rounded-full bg-red-500/20 animate-ping"></span>

                        {/* Static Circle */}
                        <div className="relative h-24 w-24 rounded-full bg-red-500/10 border border-red-500/40 flex items-center justify-center">

                            {/* Animated Cross */}
                            <svg
                                className="w-12 h-12 text-red-500 animate-cross"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6 6l12 12M18 6l-12 12"
                                />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-2xl font-semibold text-white mb-3">
                    Stripe Connection Failed
                </h1>

                {/* Description */}
                <p className="text-gray-400 text-sm leading-relaxed mb-8">
                    We couldn &apos;t connect your Stripe wallet.
                    Please try again or ensure your Stripe account
                    setup was completed correctly.
                </p>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                        href="/user-profile"
                        className="flex-1 h-12 rounded-[12px] bg-red-500 hover:bg-red-600 text-white font-medium flex items-center justify-center transition"
                    >
                        Try Again
                    </Link>

                    <Link
                        href="/"
                        className="flex-1 h-12 rounded-[12px] border border-[#36394A] text-white hover:bg-[#1c1f2b] transition flex items-center justify-center"
                    >
                        Back to Home
                    </Link>
                </div>

                <p className="text-xs text-gray-500 mt-6">
                    If the problem persists, please contact support.
                </p>
            </div>

            {/* Custom SVG Animation */}
            <style jsx>{`
        .animate-cross {
          stroke-dasharray: 60;
          stroke-dashoffset: 60;
          animation: draw 0.6s ease forwards 0.3s;
        }

        @keyframes draw {
          to {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
        </div>
    );
}
