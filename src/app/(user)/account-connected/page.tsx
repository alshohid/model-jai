"use client";

import Link from "next/link";

export default function AccountConnectedPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-black px-4">
            <div className="w-full max-w-md bg-[#0f1117] border border-[#36394A] rounded-[20px] p-8 text-center shadow-xl">

                {/* Animated Success Circle */}
                <div className="flex justify-center mb-6">
                    <div className="relative flex items-center justify-center">

                        {/* Pulse Ring */}
                        <span className="absolute inline-flex h-28 w-28 rounded-full bg-green-500/20 animate-ping"></span>

                        {/* Static Circle */}
                        <div className="relative h-24 w-24 rounded-full bg-green-500/10 border border-green-500/40 flex items-center justify-center">

                            {/* Animated Checkmark */}
                            <svg
                                className="w-12 h-12 text-green-500 animate-check"
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

                {/* Title */}
                <h1 className="text-2xl font-semibold text-white mb-3">
                    Stripe Account Connected
                </h1>

                {/* Subtitle */}
                <p className="text-gray-400 text-sm leading-relaxed mb-8">
                    Your Stripe wallet has been successfully connected.
                    You can now request withdrawals securely and manage
                    your earnings without interruption.
                </p>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                        href="/user-profile"
                        className="flex-1 h-12 rounded-[12px] bg-[#00C3FF] hover:bg-[#00aee6] text-black font-medium flex items-center justify-center transition"
                    >
                        Go to Profile
                    </Link>

                    <Link
                        href="/"
                        className="flex-1 h-12 rounded-[12px] border border-[#36394A] text-white hover:bg-[#1c1f2b] transition flex items-center justify-center"
                    >
                        Back to Home
                    </Link>
                </div>

                <p className="text-xs text-gray-500 mt-6">
                    If something looks wrong, please contact support.
                </p>
            </div>

            {/* Custom animation style */}
            <style jsx>{`
        .animate-check {
          stroke-dasharray: 50;
          stroke-dashoffset: 50;
          animation: draw 0.8s ease forwards 0.3s;
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
