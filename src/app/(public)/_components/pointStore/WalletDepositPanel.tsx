"use client";

import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { cn } from "@/shared/lib/utils/cn";
import { WalletStatCard } from "@/shared/components/card/WalletStatCard";
import GlassInput from "@/shared/UI/reusable/auth/GlassInput";
import StartStreamingButton from "@/shared/UI/button/StartStreamingButton";
import { PAYMENT_METHODS } from "@/shared/constants/paymentMethods";

type DepositFormValues = {
    amount: string;
    priceCode: string;
};

type Props = {
    locked?: boolean;
    balance?: number | string;
    withdrawable?: number | string;
    bonus?: number | string;

    onDeposit?: (values: DepositFormValues & { paymentMethod: string }) => void;
    className?: string;
};

export default function WalletDepositPanel({
    locked = false,
    balance = "0.00",
    withdrawable = "0.00",
    bonus = "0.00",
    onDeposit,
    className,
}: Props) {
    const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS[0]);
    const [showPaymentModal, setShowPaymentModal] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<DepositFormValues>({
        defaultValues: {
            amount: "",
            priceCode: "CV2",
        },
    });

    const submit = (values: DepositFormValues) => {
        if (locked) return;

        onDeposit?.({
            ...values,
            paymentMethod: paymentMethod.id,
        });
    };

    return (
        <>
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

                {/* Payment Method */}
                <div className="mt-6 flex items-center justify-between rounded-xl bg-white/5 border border-white/10 p-4">
                    <div className="flex items-center gap-3">
                        <Image
                            src={paymentMethod.logo}
                            alt={paymentMethod.name}
                            width={40}
                            height={40}
                        />
                        <div>
                            <div className="text-sm text-white font-semibold">
                                {paymentMethod.name}
                            </div>
                            <div className="text-xs text-white/60">
                                Selected payment method
                            </div>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => setShowPaymentModal(true)}
                        disabled={locked}
                        className={cn(
                            "text-[#FF2EC8] text-sm",
                            locked && "opacity-50 cursor-not-allowed"
                        )}
                    >
                        Change
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(submit)} className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                        <div className="md:col-span-6">
                            <GlassInput
                                label="Deposit Amount"
                                placeholder="0.00"
                                type="number"
                                disabled={locked}
                                prefix="₱"
                                registration={register("amount", {
                                    required: "Amount is required",
                                    validate: (v) => {
                                        const n = Number(v);
                                        if (n < 1) return "Minimum ₱1.00";
                                        return true;
                                    },
                                })}
                                error={errors.amount?.message}
                            />
                        </div>

                        <div className="md:col-span-6">
                            <GlassInput
                                label="Price Code"
                                placeholder="CV2"
                                disabled={locked}
                                registration={register("priceCode", {
                                    required: "Price code is required",
                                })}
                                error={errors.priceCode?.message}
                            />
                        </div>
                    </div>

                    <div className="mt-4 flex justify-end">
                        <StartStreamingButton
                            type="submit"
                            disabled={locked}
                            className={locked ? "opacity-50 cursor-not-allowed" : ""}
                        >
                            Deposit
                        </StartStreamingButton>
                    </div>
                </form>
            </section>

            {/* Payment Method Modal */}
            {showPaymentModal && (
                <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
                    <div className="w-full max-w-md rounded-2xl bg-[#0B1220] border border-white/10 p-6">
                        <h3 className="text-white font-bold text-lg mb-4">
                            Select Payment Method
                        </h3>

                        <div className="grid grid-cols-2 gap-4">
                            {PAYMENT_METHODS.map((method) => (
                                <button
                                    key={method.id}
                                    onClick={() => {
                                        setPaymentMethod(method);
                                        setShowPaymentModal(false);
                                    }}
                                    className="flex flex-col items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/10"
                                >
                                    <Image
                                        src={method.logo}
                                        alt={method.name}
                                        width={48}
                                        height={48}
                                    />
                                    <span className="text-white text-sm font-medium">
                                        {method.name}
                                    </span>
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => setShowPaymentModal(false)}
                            className="mt-4 w-full text-center text-sm text-white/60 hover:text-white"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
