
"use client"


import Link from 'next/link'

export default function NotFound() {
    return (
        <div className="relative min-h-screen bg-[#080810] flex items-center justify-center overflow-hidden">

            {/* Background glow orbs */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#FF2EC8]/5 blur-[120px]" />
                <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] rounded-full bg-[#24C3FF]/5 blur-[100px]" />
                <div className="absolute bottom-1/4 right-1/4 w-[250px] h-[250px] rounded-full bg-[#FF2EC8]/4 blur-[90px]" />
            </div>

            {/* Grid overlay */}
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.04]"
                style={{
                    backgroundImage: `
                        linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
                    `,
                    backgroundSize: '60px 60px',
                }}
            />

            {/* Horizontal scan line animation */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute w-full h-[2px] bg-gradient-to-r from-transparent via-[#FF2EC8]/30 to-transparent animate-scan" />
            </div>

            {/* Main content */}
            <div className="relative z-10 text-center px-6 max-w-lg mx-auto">

                {/* 404 glitch number */}
                <div className="relative inline-block mb-2 select-none">
                    <span
                        className="block text-[140px] sm:text-[180px] font-black leading-none tracking-tighter text-white/5"
                        style={{ fontFamily: '"Courier New", monospace' }}
                        aria-hidden
                    >
                        404
                    </span>
                    <span
                        className="absolute inset-0 flex items-center justify-center text-[140px] sm:text-[180px] font-black leading-none tracking-tighter text-white/90 animate-glitch-1"
                        style={{ fontFamily: '"Courier New", monospace' }}
                        aria-hidden
                    >
                        404
                    </span>
                    <span
                        className="absolute inset-0 flex items-center justify-center text-[140px] sm:text-[180px] font-black leading-none tracking-tighter text-[#FF2EC8]/60 animate-glitch-2"
                        style={{ fontFamily: '"Courier New", monospace' }}
                        aria-hidden
                    >
                        404
                    </span>
                    <span
                        className="absolute inset-0 flex items-center justify-center text-[140px] sm:text-[180px] font-black leading-none tracking-tighter text-[#24C3FF]/40 animate-glitch-3"
                        style={{ fontFamily: '"Courier New", monospace' }}
                    >
                        404
                    </span>
                </div>

                {/* Divider line */}
                <div className="flex items-center gap-3 my-6">
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent to-white/10" />
                    <div className="w-1.5 h-1.5 rounded-full bg-[#FF2EC8] shadow-[0_0_8px_rgba(255,46,200,0.8)]" />
                    <div className="flex-1 h-px bg-gradient-to-l from-transparent to-white/10" />
                </div>

                {/* Text */}
                <h2
                    className="text-xl sm:text-2xl font-semibold text-white mb-3 tracking-tight"
                    style={{ fontFamily: '"Courier New", monospace' }}
                >
                    Page Not Found
                </h2>
                <p className="text-[14px] text-white/35 leading-relaxed mb-10">
                    The resource you&apos;re looking for has gone missing,<br />
                    moved, or never existed in this dimension.
                </p>

                {/* CTA */}
                <Link
                    href="/"
                    className="
                        inline-flex items-center gap-2.5
                        h-12 px-8 rounded-xl
                        bg-[#FF2EC8] hover:bg-[#ff48d0]
                        text-white text-[14px] font-semibold tracking-wide
                        shadow-[0_0_24px_rgba(255,46,200,0.35)] hover:shadow-[0_0_36px_rgba(255,46,200,0.5)]
                        transition-all duration-200 active:scale-[0.97]
                    "
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 12H5M12 5l-7 7 7 7" />
                    </svg>
                    Return Home
                </Link>
            </div>

            <style jsx global>{`
                @keyframes scan {
                    0%   { top: -2px; opacity: 0; }
                    5%   { opacity: 1; }
                    95%  { opacity: 1; }
                    100% { top: 100%; opacity: 0; }
                }
                @keyframes glitch-1 {
                    0%, 90%, 100% { transform: translate(0, 0); opacity: 1; }
                    91%           { transform: translate(-3px, 1px); opacity: 0.8; }
                    93%           { transform: translate(3px, -1px); opacity: 0.8; }
                    95%           { transform: translate(-2px, 2px); opacity: 0.9; }
                }
                @keyframes glitch-2 {
                    0%, 88%, 100% { transform: translate(0, 0) scaleY(1); clip-path: none; }
                    89%           { transform: translate(4px, 0); clip-path: inset(20% 0 60% 0); }
                    91%           { transform: translate(-4px, 0); clip-path: inset(60% 0 10% 0); }
                    93%           { transform: translate(0, 0); clip-path: none; }
                }
                @keyframes glitch-3 {
                    0%, 92%, 100% { transform: translate(0, 0); opacity: 0; }
                    93%           { transform: translate(6px, -2px); opacity: 0.6; }
                    95%           { transform: translate(-6px, 2px); opacity: 0.4; }
                    97%           { transform: translate(0, 0); opacity: 0; }
                }
                .animate-scan       { animation: scan 4s linear infinite; }
                .animate-glitch-1   { animation: glitch-1 5s infinite; }
                .animate-glitch-2   { animation: glitch-2 5s infinite 0.05s; }
                .animate-glitch-3   { animation: glitch-3 5s infinite 0.1s; }
            `}</style>
        </div>
    )
}