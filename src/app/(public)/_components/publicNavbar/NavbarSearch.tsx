/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { createContext, useContext, useState, useRef, useEffect } from "react";
import { Search, CheckCircle2, Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { cn } from "@/shared/lib/utils/cn";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useSearchPlayerQuery } from "@/redux/features/user/userManagement";

type SearchModalContextType = {
    isOpen: boolean;
    open: () => void;
    close: () => void;
};

const SearchModalContext = createContext<SearchModalContextType | null>(null);

export function NavbarSearchProvider({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <SearchModalContext.Provider value={{ isOpen, open: () => setIsOpen(true), close: () => setIsOpen(false) }}>
            {children}
        </SearchModalContext.Provider>
    );
}

function useSearchModal() {
    const ctx = useContext(SearchModalContext);
    if (!ctx) throw new Error("SearchModal context error");
    return ctx;
}

export default function NavbarSearch() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const { isOpen: mobileOpen, open: openModal, close: closeModal } = useSearchModal();
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Debounce Logic
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedQuery(searchQuery);
        }, 500);
        return () => clearTimeout(handler);
    }, [searchQuery]);

    // RTK Query API Call
    const { data: apiResponse, isFetching } = useSearchPlayerQuery(debouncedQuery, {
        skip: debouncedQuery.length < 2,
    });

    const searchResults = apiResponse?.data || [];

    const handleUserClick = (userId: number | string) => {
        router.push(`/artist/${userId}`);
        setSearchQuery("");
        setDropdownOpen(false);
        closeModal();
    };


    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    return (
        <>
            {/* Desktop UI */}
            <div ref={wrapperRef} className="hidden md:block relative flex-1 min-w-0 max-w-[280px] lg:max-w-[320px]">
                <div className="relative">
                    {isFetching ? (
                        <Loader2 className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#FF2EC8] animate-spin" />
                    ) : (
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#070707]/50 pointer-events-none" />
                    )}
                    <input
                        type="text"
                        placeholder="Search artist..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => setDropdownOpen(true)}
                        className={cn(
                            "w-full h-9 rounded-lg pl-9 pr-3 text-sm transition bg-black/5 border border-black/10 text-[#070707] outline-none",
                            "focus:bg-white focus:border-[#FF2EC8]/30 focus:ring-1 focus:ring-[#FF2EC8]/20"
                        )}
                    />
                </div>

                {dropdownOpen && searchQuery.length >= 2 && (
                    <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-[#FFEAFA] text-black border border-black/10 rounded-xl shadow-xl overflow-hidden">
                        <SearchResultsContent
                            variant="dropdown"
                            searchQuery={searchQuery}
                            results={searchResults}
                            isLoading={isFetching}
                            onUserClick={handleUserClick}
                        />
                    </div>
                )}
            </div>

            {/* Mobile Icon */}
            <div className="md:hidden flex items-center">
                <button onClick={openModal} className="size-8 flex items-center justify-center bg-black/5 border border-black/10 rounded-lg">
                    <Search className="size-4 text-[#070707]" />
                </button>
            </div>

            {/* Mobile Search Modal */}
            <Dialog open={mobileOpen} onOpenChange={(open) => !open && closeModal()}>
                <DialogContent className="max-w-[calc(100vw-1rem)] p-0 bg-[#160F16]/98 backdrop-blur-xl border-white/10 text-white">
                    <DialogTitle className="sr-only">Search</DialogTitle>
                    <div className="flex flex-col h-[70vh]">
                        <div className="p-4 border-b border-white/10 relative">
                            <input
                                autoFocus
                                type="text"
                                placeholder="Search artist..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full h-11 bg-white/10 rounded-lg pl-10 pr-4 text-white outline-none"
                            />
                            {isFetching ? (
                                <Loader2 className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-[#FF2EC8] animate-spin" />
                            ) : (
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-white/50" />
                            )}
                        </div>
                        <SearchResultsContent
                            variant="modal"
                            searchQuery={searchQuery}
                            results={searchResults}
                            isLoading={isFetching}
                            onUserClick={handleUserClick}
                        />
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}

// --- Content Component ---

function SearchResultsContent({
    searchQuery,
    results,
    isLoading,
    onUserClick,
    variant
}: any) {
    const isLight = variant === "dropdown";

    if (searchQuery.length < 2) {
        return (
            <div className="p-6 text-center opacity-50 text-sm">
                Type at least 2 characters to search...
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto p-2">
            {isLoading ? (
                <p className="text-center py-6 text-sm opacity-50">Searching...</p>
            ) : results.length === 0 ? (
                <p className="text-center py-6 text-sm opacity-50">No artists found</p>
            ) : (
                results.map((user: any) => (
                    <div
                        key={user.id}
                        onClick={() => onUserClick(user.id)}
                        className={cn(
                            "flex items-center gap-3 p-2 rounded-xl cursor-pointer transition",
                            isLight ? "hover:bg-black/5" : "hover:bg-white/10"
                        )}
                    >
                        <Image
                            src={user.image || "/images/home/profile_img.png"}
                            alt={user.name}
                            width={40}
                            height={40}
                            className="rounded-full size-10 object-cover border border-black/5"
                        />
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1">
                                <p className="font-semibold text-sm truncate">{user.name}</p>
                                {user.verified_at && (
                                    <CheckCircle2 className="size-3.5 text-blue-500 fill-blue-500/10" />
                                )}
                            </div>
                            <p className="text-xs opacity-60">@{user.role || 'artist'}</p>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}