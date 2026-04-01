"use client";

import * as React from "react";
import Image from "next/image";
import { useForm, useWatch } from "react-hook-form";
import AppDialog from "@/shared/components/modal/AppDialog";
import StartStreamingButton from "@/shared/UI/button/StartStreamingButton";
import { cn } from "@/shared/lib/utils/cn";
import { getErrorMessage } from "@/lib/utils";
import { useDebounce } from "@/app/(admin)/admin/hook/useDebounce";
import { useSendCoinMutation } from "@/redux/features/pointstore/buypoint";
import { useGetAllListUserForSendMoneyQuery } from "@/redux/features/user/userManagement";
import { IUserForSendMoney } from "@/types/user/usermanagement";
import { Check, ChevronDown, Coins, Loader2, Search, UserRound } from "lucide-react";
import { toast } from "sonner";

type FormValues = {
    amount: string;
};

type Props = {
    open: boolean;
    onOpenChange: (v: boolean) => void;
    defaultValues?: Partial<FormValues>;
    senderInfo?: {
        name?: string;
        email?: string;
    };
};

export default function SendMoneyDialog({
    open,
    onOpenChange,
    defaultValues,
    senderInfo,
}: Props) {
    const dropdownRef = React.useRef<HTMLDivElement | null>(null);
    const [searchValue, setSearchValue] = React.useState("");
    const [selectedUser, setSelectedUser] = React.useState<IUserForSendMoney | null>(null);
    const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
    const debouncedSearch = useDebounce(searchValue.trim(), 400);

    const { register, handleSubmit, reset, control } = useForm<FormValues>({
        defaultValues: {
            amount: defaultValues?.amount ?? "",
        },
    });
    const amountValue = useWatch({ control, name: "amount" });
    const [sendCoin, { isLoading: isSendCoinLoading }] = useSendCoinMutation();
    const { data: allUsers, isFetching: isUsersFetching } =
        useGetAllListUserForSendMoneyQuery(
            { search: debouncedSearch },
            { skip: !open }
        );
    const senderEmail = senderInfo?.email;
    const userOptions = !senderEmail
        ? (allUsers?.data ?? [])
        : (allUsers?.data ?? []).filter((user) => user.email !== senderEmail);

    React.useEffect(() => {
        if (!open) return;

        reset({
            amount: defaultValues?.amount ?? "",
        });
        setSearchValue("");
        setSelectedUser(null);
        setIsDropdownOpen(false);
    }, [defaultValues, open, reset]);

    React.useEffect(() => {
        if (!isDropdownOpen) return;

        const handleOutsideClick = (event: MouseEvent) => {
            if (!dropdownRef.current?.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, [isDropdownOpen]);

    const handleSelectUser = (user: IUserForSendMoney) => {
        setSelectedUser(user);
        setSearchValue(user.name);
        setIsDropdownOpen(false);
    };

    const submit = async (data: FormValues) => {
        const amountNum = Number(data.amount);

        if (!selectedUser) {
            toast.error("Please select a receiver");
            return;
        }

        if (!Number.isFinite(amountNum) || amountNum <= 0) {
            toast.error("Please enter a valid amount");
            return;
        }

        try {
            const response = await sendCoin({
                receiver_id: selectedUser.id,
                amount: amountNum,
            }).unwrap();

            toast.success(response?.message || "Points sent successfully");
            reset({ amount: defaultValues?.amount ?? "" });
            setSearchValue("");
            setSelectedUser(null);
            setIsDropdownOpen(false);
            onOpenChange(false);
        } catch (error) {
            toast.error(getErrorMessage(error, "Failed to send points"));
        }
    };

    const isSubmitDisabled =
        isSendCoinLoading ||
        !selectedUser ||
        !Number.isFinite(Number(amountValue)) ||
        Number(amountValue) <= 0;

    return (
        <AppDialog open={open} onOpenChange={onOpenChange} title="Send Point">
            <div
                className={cn(
                    "rounded-[16px] border border-white/12 bg-white/5",
                    "p-4 sm:p-5"
                )}
            >
                <form onSubmit={handleSubmit(submit)}>
                    {(senderInfo?.name || senderInfo?.email) && (
                        <div className="mb-4 rounded-[14px] border border-white/10 bg-black/20 p-3">
                            <p className="text-[11px] uppercase tracking-[0.24em] text-white/45">
                                Sending From
                            </p>
                            {senderInfo?.name && (
                                <p className="mt-2 text-sm font-medium text-white">
                                    {senderInfo.name}
                                </p>
                            )}
                            {senderInfo?.email && (
                                <p className="text-xs text-white/60">{senderInfo.email}</p>
                            )}
                        </div>
                    )}

                    <Field label="Select Receiver">
                        <div ref={dropdownRef} className="relative">
                            <div
                                className={cn(
                                    "flex items-center gap-3 rounded-[8px] border border-white/10 bg-white/10 px-4 py-3 backdrop-blur-[6px]",
                                    isDropdownOpen && "border-[#00C3FF]/50 ring-1 ring-[#00C3FF]/30"
                                )}
                            >
                                <Search className="size-4 shrink-0 text-white/60" />
                                <input
                                    type="text"
                                    value={searchValue}
                                    onChange={(event) => {
                                        setSearchValue(event.target.value);
                                        setSelectedUser(null);
                                        setIsDropdownOpen(true);
                                    }}
                                    onFocus={() => setIsDropdownOpen(true)}
                                    placeholder="Search by name or email"
                                    className="w-full bg-transparent text-[14px] text-white/90 outline-none placeholder:text-white/35"
                                />
                                <button
                                    type="button"
                                    onClick={() => setIsDropdownOpen((prev) => !prev)}
                                    className="text-white/60 transition hover:text-white"
                                    aria-label="Toggle receiver dropdown"
                                >
                                    <ChevronDown
                                        className={cn(
                                            "size-4 transition-transform",
                                            isDropdownOpen && "rotate-180"
                                        )}
                                    />
                                </button>
                            </div>

                            {isDropdownOpen && (
                                <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-20 overflow-hidden rounded-[14px] border border-white/10 bg-[#120C12] shadow-[0_24px_48px_rgba(0,0,0,0.45)]">
                                    <div className="max-h-72 overflow-y-auto p-2">
                                        {isUsersFetching ? (
                                            <div className="flex items-center justify-center gap-2 py-6 text-sm text-white/60">
                                                <Loader2 className="size-4 animate-spin" />
                                                Searching users...
                                            </div>
                                        ) : userOptions.length === 0 ? (
                                            <div className="py-6 text-center text-sm text-white/50">
                                                No users found
                                            </div>
                                        ) : (
                                            userOptions.map((user) => {
                                                const isSelected = selectedUser?.id === user.id;

                                                return (
                                                    <button
                                                        key={user.id}
                                                        type="button"
                                                        onClick={() => handleSelectUser(user)}
                                                        className="flex w-full items-center gap-3 rounded-[12px] px-3 py-2 text-left transition hover:bg-white/8"
                                                    >
                                                        <UserAvatar user={user} />
                                                        <div className="min-w-0 flex-1">
                                                            <p className="truncate text-sm font-medium text-white">
                                                                {user.name}
                                                            </p>
                                                            <p className="truncate text-xs text-white/55">
                                                                {user.email}
                                                            </p>
                                                        </div>
                                                        {isSelected && (
                                                            <Check className="size-4 text-[#00C3FF]" />
                                                        )}
                                                    </button>
                                                );
                                            })
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {selectedUser && (
                            <div className="mt-2 rounded-[12px] border border-[#00C3FF]/20 bg-[#00C3FF]/8 px-3 py-2 text-xs text-white/80">
                                Receiver:{" "}
                                <span className="font-medium text-white">
                                    {selectedUser.name}
                                </span>
                            </div>
                        )}
                    </Field>

                    <Field label="Amount">
                        <div className="relative">
                            <Coins className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-white/60" />
                            <input
                                placeholder="100"
                                type="number"
                                min="1"
                                step="any"
                                {...register("amount", { required: true })}
                                className="w-full rounded-[8px] border border-white/10 bg-white/10 py-3 pl-11 pr-4 text-[14px] text-white/90 outline-none placeholder:text-white/35 backdrop-blur-[6px]"
                            />
                        </div>
                    </Field>

                    <StartStreamingButton
                        type="submit"
                        disabled={isSubmitDisabled}
                        isLoading={isSendCoinLoading}
                        className={cn(
                            "w-full mt-4",
                            "bg-[#FF2EC8] hover:opacity-95"
                        )}
                    >
                        {isSendCoinLoading ? "Sending..." : "Send"}
                    </StartStreamingButton>
                </form>
            </div>
        </AppDialog>
    );
}

function UserAvatar({ user }: { user: IUserForSendMoney }) {
    if (user.image_url) {
        return (
            <Image
                src={user.image_url}
                alt={user.name}
                width={40}
                height={40}
                className="size-10 rounded-full object-cover"
                unoptimized
            />
        );
    }

    return (
        <div className="flex size-10 items-center justify-center rounded-full bg-white/10 text-sm font-semibold text-white">
            {user.name
                .split(" ")
                .filter(Boolean)
                .slice(0, 2)
                .map((part) => part.charAt(0).toUpperCase())
                .join("") || <UserRound className="size-4" />}
        </div>
    );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="mt-3 first:mt-0">
            <p className="mb-2 text-white/60 text-[12px]">{label}</p>
            {children}
        </div>
    );
}
