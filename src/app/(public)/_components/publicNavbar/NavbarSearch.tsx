"use client";

import { createContext, useContext, useState, useRef, useEffect } from "react";
import { Search, X, Clock, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { cn } from "@/shared/lib/utils/cn";
import BigBossIndicator from "@/shared/components/user/BigBossIndicator";
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from "@/components/ui/dialog";

type SearchModalContextType = {
    isOpen: boolean;
    open: () => void;
    close: () => void;
};

const SearchModalContext = createContext<SearchModalContextType | null>(null);

function useSearchModal() {
    const ctx = useContext(SearchModalContext);
    if (!ctx) throw new Error("SearchModalTrigger/NavbarSearch must be used inside NavbarSearchProvider");
    return ctx;
}

export function NavbarSearchProvider({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <SearchModalContext.Provider
            value={{
                isOpen,
                open: () => setIsOpen(true),
                close: () => setIsOpen(false),
            }}
        >
            {children}
        </SearchModalContext.Provider>
    );
}

export function MobileSearchTrigger() {
    const { open } = useSearchModal();
    return (
        <button
            type="button"
            onClick={open}
            className={cn(
                "flex items-center justify-center size-9 rounded-lg shrink-0",
                "bg-black/5 border border-black/10 text-[#070707]",
                "hover:bg-black/10 active:bg-black/15 transition"
            )}
            aria-label="Open search"
        >
            <Search className="size-5" />
        </button>
    );
}

interface User {
    id: string;
    name: string;
    username: string;
    avatar: string;
    isBigBoss?: boolean;
    isVerified?: boolean;
    activityStatus?: string;
    isSubscribed?: boolean;
}

const MOCK_USERS: User[] = [
    {
        id: "1",
        name: "Jeffson Jrcelestin",
        username: "jeffsonjrcelestin",
        avatar: "/images/home/user.png",
        isBigBoss: true,
        isVerified: true,
        activityStatus: "Janmsotba • 26 new posts •",
        isSubscribed: false,
    },
    {
        id: "2",
        name: "Trophy Boy",
        username: "trophy.bwoy",
        avatar: "/images/home/user.png",
        isBigBoss: false,
        isVerified: false,
        activityStatus: "VINCENT 🏂",
        isSubscribed: true,
    },
    {
        id: "3",
        name: "Jack",
        username: "@jack",
        avatar: "/images/home/user.png",
        isBigBoss: true,
        isVerified: true,
        activityStatus: "Live now",
        isSubscribed: false,
    },
];

const INITIAL_RECENT = ["kai cenat", "janmsotba", "breezy jhonn colection"];

function GradientBorder({
    children,
    isBigBoss,
}: {
    children: React.ReactNode;
    isBigBoss?: boolean;
}) {
    if (!isBigBoss) return <>{children}</>;
    return (
        <div
            className="rounded-full p-[2px] shrink-0"
            style={{
                background:
                    "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
            }}
        >
            {children}
        </div>
    );
}

interface SearchResultsContentProps {
    searchQuery: string;
    recentSearches: string[];
    users: User[];
    filteredUsers: User[];
    onUserClick: (user: User) => void;
    onSubscribe: (userId: string) => void;
    onRemoveRecent: (search: string) => void;
    variant: "dropdown" | "modal";
}

function SearchResultsContent({
    searchQuery,
    recentSearches,
    users,
    filteredUsers,
    onUserClick,
    onSubscribe,
    onRemoveRecent,
    variant,
}: SearchResultsContentProps) {
    const isDropdown = variant === "dropdown";
    const isLight = isDropdown;

    const listClass = isDropdown
        ? "max-h-[min(70vh,320px)] overflow-y-auto"
        : "flex-1 overflow-y-auto min-h-0";

    return (
        <div className={cn("flex flex-col", listClass)}>
            {!searchQuery && recentSearches.length > 0 && (
                <div className={isDropdown ? "p-2" : "px-4 py-3"}>
                    <div className="flex items-center justify-between mb-2">
                        <span
                            className={cn(
                                "text-sm font-semibold",
                                isLight ? "text-[#070707]" : "text-white"
                            )}
                        >
                            Recent
                        </span>
                    </div>
                    <div className="space-y-0.5">
                        {recentSearches.map((search, idx) => (
                            <div
                                key={idx}
                                className={cn(
                                    "flex items-center justify-between rounded-lg px-2 py-2 transition",
                                    isLight
                                        ? "hover:bg-black/5"
                                        : "hover:bg-white/5"
                                )}
                            >
                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                    <Clock
className={cn(
                                "size-4 shrink-0",
                                isLight ? "text-[#070707]/50" : "text-white/50"
                            )}
                                    />
                                    <span
                                        className={cn(
                                            "text-sm truncate",
                                            isLight ? "text-[#070707]" : "text-white"
                                        )}
                                    >
                                        {search}
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => onRemoveRecent(search)}
                                    className={cn(
                                        "p-1 rounded transition",
                                        isLight
                                            ? "text-[#070707]/40 hover:text-[#070707]/70"
                                            : "text-white/40 hover:text-white/60"
                                    )}
                                    aria-label="Remove"
                                >
                                    <X className="size-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {searchQuery ? (
                <div className={isDropdown ? "p-2 pt-0" : "px-4 py-3"}>
                    {filteredUsers.length === 0 ? (
                        <p
                            className={cn(
                                "text-sm py-6 text-center",
                                isLight ? "text-[#070707]/60" : "text-white/50"
                            )}
                        >
                            No results found
                        </p>
                    ) : (
                        <div className="space-y-0.5">
                            {filteredUsers.map((user) => (
                                <UserRow
                                    key={user.id}
                                    user={user}
                                    onClick={() => onUserClick(user)}
                                    onSubscribe={() => onSubscribe(user.id)}
                                    isLight={isLight}
                                />
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                <div className={isDropdown ? "p-2 pt-0" : "px-4 py-3"}>
                    <span
                        className={cn(
                            "text-xs font-semibold block mb-2",
                            isLight ? "text-[#070707]/70" : "text-white/70"
                        )}
                    >
                        Suggested
                    </span>
                    <div className="space-y-0.5">
                        {users.map((user) => (
                            <UserRow
                                key={user.id}
                                user={user}
                                onClick={() => onUserClick(user)}
                                onSubscribe={() => onSubscribe(user.id)}
                                isLight={isLight}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

function UserRow({
    user,
    onClick,
    onSubscribe,
    isLight,
}: {
    user: User;
    onClick: () => void;
    onSubscribe: () => void;
    isLight: boolean;
}) {
    return (
        <div
            role="button"
            tabIndex={0}
            onClick={onClick}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onClick();
                }
            }}
            className={cn(
                "flex items-center gap-3 p-2 rounded-lg cursor-pointer transition",
                isLight
                    ? "hover:bg-black/5 active:bg-black/10"
                    : "hover:bg-white/5 active:bg-white/10"
            )}
        >
            <GradientBorder isBigBoss={user.isBigBoss}>
                <div className="relative">
                    <Image
                        src={user.avatar}
                        alt={user.name}
                        width={40}
                        height={40}
                        className="rounded-full size-10 object-cover bg-white/10"
                    />
                </div>
            </GradientBorder>
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                    <span
                        className={cn(
                            "font-medium text-sm truncate block",
                            isLight ? "text-[#070707]" : "text-white"
                        )}
                    >
                        {user.username}
                    </span>
                    {user.isVerified && (
                        <CheckCircle2
                            className={cn(
                                "size-4 shrink-0",
                                "text-[#00C3FF]"
                            )}
                        />
                    )}
                    {user.isBigBoss && (
                        <BigBossIndicator isBigBoss size="sm" />
                    )}
                </div>
                {user.activityStatus && (
                    <p
                        className={cn(
                            "text-xs truncate",
                            isLight ? "text-[#070707]/60" : "text-white/60"
                        )}
                    >
                        {user.activityStatus}
                    </p>
                )}
            </div>
            <button
                type="button"
                onClick={(e) => {
                    e.stopPropagation();
                    onSubscribe();
                }}
                className={cn(
                    "size-8 rounded-full flex items-center justify-center shrink-0 transition",
                    user.isSubscribed
                        ? "bg-[#FF2EC8]/20 text-[#FF2EC8]"
                        : isLight
                          ? "bg-black/10 text-[#070707]/60 hover:bg-black/15"
                          : "bg-white/10 text-white/60 hover:bg-white/15"
                )}
                aria-label={user.isSubscribed ? "Unsubscribe" : "Subscribe"}
            >
                <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill={user.isSubscribed ? "currentColor" : "none"}
                    stroke="currentColor"
                    strokeWidth="2"
                >
                    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
            </button>
        </div>
    );
}

export default function NavbarSearch() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [recentSearches, setRecentSearches] = useState<string[]>(INITIAL_RECENT);
    const [users] = useState<User[]>(MOCK_USERS);
    const { isOpen: mobileOpen, open: openModal, close: closeModal } = useSearchModal();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const filteredUsers = searchQuery
        ? users.filter(
              (user) =>
                  user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  user.username.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : [];

    const handleUserClick = (user: User) => {
        router.push(`/artist/${user.id}`);
        setSearchQuery("");
        setDropdownOpen(false);
        closeModal();
    };

    const handleRemoveRecent = (search: string) => {
        setRecentSearches((prev) => prev.filter((s) => s !== search));
    };

    const handleSubscribe = (userId: string) => {
        console.log("Subscribed to user:", userId);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(e.target as Node)
            ) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const showDropdown = dropdownOpen && (searchQuery.length > 0 || recentSearches.length > 0 || users.length > 0);

    return (
        <>
            {/* Desktop: search input + dropdown */}
            <div
                ref={wrapperRef}
                className="hidden md:block relative flex-1 min-w-0 max-w-[280px] lg:max-w-[320px]"
            >
                <div className="relative">
                    <Search className="absolute  left-3 top-1/2 -translate-y-1/2 size-4 text-[#070707]/50 pointer-events-none" />
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Search artist..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => setDropdownOpen(true)}
                        className={cn(
                            "w-full h-9 rounded-lg pl-9 pr-3 text-sm",
                            "bg-black/5 border border-black/10",
                            "text-[#070707] placeholder:text-[#070707]/50",
                            "outline-none transition",
                            "focus:bg-black/8 focus:border-[#FF2EC8]/30 focus:ring-1 focus:ring-[#FF2EC8]/20"
                        )}
                    />
                </div>
                {showDropdown && (
                    <div
                        className={cn(
                            "absolute top-full left-0 right-0 mt-1 z-50",
                            "bg-[#FFEAFA] border border-black/10 rounded-xl shadow-lg",
                            "overflow-hidden"
                        )}
                    >
                        <SearchResultsContent
                            variant="dropdown"
                            searchQuery={searchQuery}
                            recentSearches={recentSearches}
                            users={users}
                            filteredUsers={filteredUsers}
                            onUserClick={handleUserClick}
                            onSubscribe={handleSubscribe}
                            onRemoveRecent={handleRemoveRecent}
                        />
                    </div>
                )}
            </div>

            {/* Mobile: search icon on the right (opens modal) */}
            <div className="md:hidden  flex items-center shrink-0">
                <button
                    type="button"
                    onClick={openModal}
                    className={cn(
                        "flex items-center  justify-center size-7 sm:size-8 rounded-lg shrink-0",
                        "bg-black/5 border border-black/10 text-[#070707]",
                        "hover:bg-black/10 active:bg-black/15 transition"
                    )}
                    aria-label="Open search"
                >
                    <Search className="size-3.5 sm:size-4" />
                </button>
            </div>

            <Dialog open={mobileOpen} onOpenChange={(open) => !open && closeModal()}>
                <DialogContent
                    className={cn(
                        "max-w-[calc(100vw-2rem)] w-full max-h-[85vh]",
                        "p-0 gap-0 overflow-hidden",
                        "bg-[#160F16]/98 backdrop-blur-xl border-white/10",
                        "text-white"
                    )}
                    showCloseButton={true}
                >
                    <DialogTitle className="sr-only">Search</DialogTitle>
                    <div className="flex flex-col h-full max-h-[85vh]">
                        <div className="shrink-0 p-4 border-b border-white/10">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-white/50" />
                                <input
                                    type="text"
                                    placeholder="Search artist name..."
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    className={cn(
                                        "w-full h-11 rounded-lg pl-10 pr-4",
                                        "bg-white/10 border border-white/20",
                                        "text-white placeholder:text-white/40",
                                        "outline-none focus:bg-white/15 focus:border-white/30 transition text-sm"
                                    )}
                                    autoFocus
                                />
                            </div>
                        </div>
                        <SearchResultsContent
                            variant="modal"
                            searchQuery={searchQuery}
                            recentSearches={recentSearches}
                            users={users}
                            filteredUsers={filteredUsers}
                            onUserClick={handleUserClick}
                            onSubscribe={handleSubscribe}
                            onRemoveRecent={handleRemoveRecent}
                        />
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
