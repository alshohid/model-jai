"use client";

import { useForm } from "react-hook-form";
import { cn } from "@/shared/lib/utils/cn";
import { WalletStatCard } from "@/shared/components/card/WalletStatCard";
import GlassInput from "@/shared/UI/reusable/auth/GlassInput";
import StartStreamingButton from "@/shared/UI/button/StartStreamingButton";


type DepositFormValues = {
    amount: string;
    priceCode: string;
};

type Props = {
    locked?: boolean; // logged out হলে true
    balance?: number | string;
    withdrawable?: number | string;
    bonus?: number | string;

    onDeposit?: (values: DepositFormValues) => void;
    onChangePaymentMethod?: () => void;

    className?: string;
};

export default function WalletDepositPanel({
    locked = false,
    balance = "0.00",
    withdrawable = "0.00",
    bonus = "0.00",
    onDeposit,
    onChangePaymentMethod,
    className,
}: Props) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<DepositFormValues>({
        defaultValues: {
            amount: "",
            priceCode: "CV2",
        },
        mode: "onChange",
    });

    const submit = (values: DepositFormValues) => {
        if (locked) return; // safety
        onDeposit?.(values);
        console.log("deposit:", values);
    };

    return (
        <section
            className={cn(
                "w-full rounded-[16px]",
                "bg-white/5 border border-white/12 backdrop-blur-[16px]",
                "p-5 sm:p-6 md:p-8",
                className
            )}
        >
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <WalletStatCard label="Balance Point" value={balance} locked={locked} />
                <WalletStatCard label="Withdrawable" value={withdrawable} locked={locked} />
                <WalletStatCard label="Bonus Bets" value={bonus} locked={locked} />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(submit)} className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    {/* Plan Duration (amount) */}
                    <div className="md:col-span-6">
                        <GlassInput
                            label="Plan Duration"
                            placeholder="0.00"
                            type="number"
                            disabled={locked}
                            prefix="₱"
                            rightHint="Min $1.00"
                            registration={register("amount", {
                                required: "Amount is required",
                                validate: (v) => {
                                    const n = Number(v);
                                    if (Number.isNaN(n)) return "Invalid amount";
                                    if (n < 1) return "Minimum $1.00";
                                    return true;
                                },
                            })}
                            error={errors.amount?.message}
                        />
                    </div>

                    {/* Price code */}
                    <div className="md:col-span-6">
                        <GlassInput
                            label="Price"
                            placeholder="CV2"
                            disabled={locked}
                            registration={register("priceCode", {
                                required: "Price code is required",
                            })}
                            error={errors.priceCode?.message}
                        />
                    </div>
                </div>

                {/* Footer row: link left, button right */}
                <div className="mt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <button
                        type="button"
                        onClick={onChangePaymentMethod}
                        className={cn(
                            "cursor-pointer text-left",
                            "text-[#FF2EC8] text-sm hover:opacity-90",
                            locked && "opacity-50 cursor-not-allowed"
                        )}
                        disabled={locked}
                    >
                        Change Payment Method
                    </button>
                    <StartStreamingButton
                        type="submit"
                        disabled={locked}
                        className={`${locked ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                        Deposit
                    </StartStreamingButton>

                </div>
            </form>
        </section>
    );
}
