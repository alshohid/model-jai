"use client";

import { useMemo, useState } from "react";
import {
    CredentialProvider,
    CredentialValues,
    useGetCredentialsQuery,
    useUpdateCredentialMutation,
} from "@/redux/features/credential/credential";
import {
    emptySocialLinks,
    SOCIAL_LINK_KEYS,
    SOCIAL_LINK_LABELS,
    useGetAdminSocialLinksQuery,
    useUpdateAdminSocialLinksMutation,
} from "@/redux/features/settings/socialLinks/socialLinks";
import type { SocialLinksData } from "@/redux/features/settings/socialLinks/types";
import AppDialog from "@/shared/components/modal/AppDialog";
import { toast } from "sonner";
import { Field, inputCls } from "../match/matchFormShared";

const providerLabels: Record<CredentialProvider, string> = {
    mail: "Mail",
    stripe: "Stripe",
    paypal: "PayPal",
    moncash: "MonCash",
    bitpay: "BitPay",
    twitch: "Twitch",
    facebook: "Facebook",
    google: "Google",
};

const providerDescriptions: Record<CredentialProvider, string> = {
    mail: "SMTP mail configuration",
    stripe: "Stripe payment gateway credentials",
    paypal: "PayPal payment gateway credentials",
    moncash: "MonCash payment gateway credentials",
    bitpay: "BitPay payment configuration",
    twitch: "Twitch integration credentials",
    facebook: "Facebook OAuth credentials",
    google: "Google OAuth credentials",
};

const sensitiveFields = [
    "password",
    "secret",
    "client_secret",
    "webhook_secret",
    "api_key",
    "token",
];

function formatLabel(key: string) {
    return key
        .replaceAll("_", " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
}

function isSensitiveField(key: string) {
    return sensitiveFields.some((field) => key.toLowerCase().includes(field));
}

function maskValue(value?: string | null) {
    if (!value) return "Not set";
    return "••••••••••";
}

export default function CredentialsManagement() {
    const { data, isLoading, isFetching } = useGetCredentialsQuery();
    const [updateCredential, { isLoading: isUpdating }] =
        useUpdateCredentialMutation();

    const {
        data: socialLinksData,
        isLoading: isSocialLinksLoading,
        isFetching: isSocialLinksFetching,
    } = useGetAdminSocialLinksQuery();
    const [updateSocialLinks, { isLoading: isUpdatingSocialLinks }] =
        useUpdateAdminSocialLinksMutation();

    const [selectedProvider, setSelectedProvider] =
        useState<CredentialProvider | null>(null);
    const [formValues, setFormValues] = useState<CredentialValues>({});

    const [isSocialLinksModalOpen, setIsSocialLinksModalOpen] = useState(false);
    const [socialFormValues, setSocialFormValues] =
        useState<SocialLinksData>(emptySocialLinks());

    const credentials = useMemo(() => {
        return data ?? {};
    }, [data]);

    const socialLinks = socialLinksData ?? emptySocialLinks();
    const configuredSocialLinksCount = SOCIAL_LINK_KEYS.filter(
        (key) => socialLinks[key]?.trim(),
    ).length;

    const handleOpenModal = (provider: CredentialProvider) => {
        setSelectedProvider(provider);
        setFormValues(credentials[provider] ?? {});
    };

    const handleCloseModal = () => {
        setSelectedProvider(null);
        setFormValues({});
    };

    const handleChange = (key: string, value: string) => {
        setFormValues((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleSubmit = async () => {
        if (!selectedProvider) return;

        try {
            await updateCredential({
                provider: selectedProvider,
                body: formValues,
            }).unwrap();
            toast.success("Credentials updated successfully.");
            handleCloseModal();
        } catch (error) {
            console.error(error);
            toast.error("Failed to update credentials.");
        }
    };

    const handleOpenSocialLinksModal = () => {
        setSocialFormValues(socialLinks);
        setIsSocialLinksModalOpen(true);
    };

    const handleCloseSocialLinksModal = () => {
        setIsSocialLinksModalOpen(false);
        setSocialFormValues(emptySocialLinks());
    };

    const handleSocialLinkChange = (
        key: keyof SocialLinksData,
        value: string,
    ) => {
        setSocialFormValues((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleSocialLinksSubmit = async () => {
        try {
            await updateSocialLinks(socialFormValues).unwrap();
            toast.success("Social links updated successfully.");
            handleCloseSocialLinksModal();
        } catch (error) {
            console.error(error);
            toast.error("Failed to update social links.");
        }
    };

    if (isLoading || isSocialLinksLoading) {
        return (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 7 }).map((_, index) => (
                    <div
                        key={index}
                        className="h-44 animate-pulse rounded-2xl bg-[#1F2030]"
                    />
                ))}
            </div>
        );
    }

    return (
        <section className="space-y-6 p-4 sm:p-5 md:p-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-white">
                        Admin Credentials
                    </h1>
                    <p className="text-sm text-white/60">
                        Manage payment, mail, social login credentials, and
                        footer social links.
                    </p>
                </div>

                {(isFetching || isSocialLinksFetching) && (
                    <span className="text-sm text-[#FF2EC8]/80">
                        Refreshing...
                    </span>
                )}
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                {(Object.keys(credentials) as CredentialProvider[]).map(
                    (provider) => {
                        const values = credentials[provider] ?? {};
                        const fields = Object.entries(values);
                        const configuredCount = fields.filter(
                            ([, value]) => value !== null && value !== "",
                        ).length;

                        return (
                            <div
                                key={provider}
                                className="flex h-full flex-col rounded-2xl border border-white/10 p-5 shadow-sm transition hover:border-[#FF2EC8]/60"
                            >
                                <div className="mb-5 flex items-start justify-between gap-4">
                                    <div>
                                        <h2 className="text-lg font-semibold text-white">
                                            {providerLabels[provider] ??
                                                provider}
                                        </h2>
                                        <p className="mt-1 text-sm text-white/50">
                                            {providerDescriptions[provider] ??
                                                "Credential configuration"}
                                        </p>
                                    </div>
                                    <span className="rounded-full bg-[#FF2EC8]/20 px-3 py-1 text-xs font-medium text-[#FF2EC8]">
                                        {configuredCount}/{fields.length} Set
                                    </span>
                                </div>

                                <div className="mb-5 space-y-3">
                                    {fields.slice(0, 4).map(([key, value]) => (
                                        <div
                                            key={key}
                                            className="flex items-center justify-between gap-3 rounded-lg bg-white/[0.04] px-3 py-2"
                                        >
                                            <span className="text-xs text-white/50">
                                                {formatLabel(key)}
                                            </span>

                                            <span className="max-w-[160px] truncate text-xs text-white">
                                                {isSensitiveField(key)
                                                    ? maskValue(value)
                                                    : value || "Not set"}
                                            </span>
                                        </div>
                                    ))}

                                    {fields.length > 4 && (
                                        <p className="text-xs text-white/40">
                                            +{fields.length - 4} more fields
                                        </p>
                                    )}
                                </div>

                                <button
                                    type="button"
                                    onClick={() => handleOpenModal(provider)}
                                    className="mt-auto h-11 w-full rounded-lg bg-[#FF2EC8] text-sm font-medium text-white transition hover:bg-[#ff48d0]"
                                >
                                    Update
                                </button>
                            </div>
                        );
                    },
                )}

                <div className="flex h-full flex-col rounded-2xl border border-white/10 p-5 shadow-sm transition hover:border-[#FF2EC8]/60">
                    <div className="mb-5 flex items-start justify-between gap-4">
                        <div>
                            <h2 className="text-lg font-semibold text-white">
                                Social Links
                            </h2>
                            <p className="mt-1 text-sm text-white/50">
                                Footer social profile links shown to users
                            </p>
                        </div>
                        <span className="rounded-full bg-[#FF2EC8]/20 px-3 py-1 text-xs font-medium text-[#FF2EC8]">
                            {configuredSocialLinksCount}/
                            {SOCIAL_LINK_KEYS.length} Set
                        </span>
                    </div>

                    <div className="mb-5 space-y-3">
                        {SOCIAL_LINK_KEYS.slice(0, 4).map((key) => (
                            <div
                                key={key}
                                className="flex items-center justify-between gap-3 rounded-lg bg-white/[0.04] px-3 py-2"
                            >
                                <span className="text-xs text-white/50">
                                    {SOCIAL_LINK_LABELS[key]}
                                </span>

                                <span className="max-w-[160px] truncate text-xs text-white">
                                    {socialLinks[key] || "Not set"}
                                </span>
                            </div>
                        ))}

                        {SOCIAL_LINK_KEYS.length > 4 && (
                            <p className="text-xs text-white/40">
                                +{SOCIAL_LINK_KEYS.length - 4} more fields
                            </p>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={handleOpenSocialLinksModal}
                        className="mt-auto h-11 w-full rounded-lg bg-[#FF2EC8] text-sm font-medium text-white transition hover:bg-[#ff48d0]"
                    >
                        Update
                    </button>
                </div>
            </div>

            <AppDialog
                open={Boolean(selectedProvider)}
                onOpenChange={(open) => {
                    if (!open) {
                        handleCloseModal();
                    }
                }}
                title={
                    selectedProvider
                        ? `Update ${providerLabels[selectedProvider]}`
                        : "Update Credential"
                }
                className="max-w-[560px]"
            >
                <div className="space-y-5 py-2">
                    <p className="-mt-1 text-sm text-white/60">
                        Change the credential values and save updates.
                    </p>

                    {Object.entries(formValues).map(([key, value]) => (
                        <Field key={key} label={formatLabel(key)}>
                            <input
                                type={
                                    isSensitiveField(key) ? "password" : "text"
                                }
                                value={value ?? ""}
                                onChange={(event) =>
                                    handleChange(key, event.target.value)
                                }
                                placeholder={`Enter ${formatLabel(key)}`}
                                className={inputCls}
                            />
                        </Field>
                    ))}

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={handleCloseModal}
                            disabled={isUpdating}
                            className="h-11 flex-1 rounded-lg bg-white/10 text-sm font-medium text-white transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            Cancel
                        </button>

                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={isUpdating}
                            className={`h-11 flex-1 rounded-lg text-sm font-medium text-white transition ${
                                isUpdating
                                    ? "cursor-not-allowed bg-white/20"
                                    : "cursor-pointer bg-[#FF2EC8] hover:bg-[#ff48d0]"
                            }`}
                        >
                            {isUpdating ? "Updating..." : "Save Changes"}
                        </button>
                    </div>
                </div>
            </AppDialog>

            <AppDialog
                open={isSocialLinksModalOpen}
                onOpenChange={(open) => {
                    if (!open) {
                        handleCloseSocialLinksModal();
                    }
                }}
                title="Update Social Links"
                className="max-w-[560px]"
            >
                <div className="space-y-5 py-2">
                    <p className="-mt-1 text-sm text-white/60">
                        These links appear in the website footer social icons.
                    </p>

                    {SOCIAL_LINK_KEYS.map((key) => (
                        <Field key={key} label={SOCIAL_LINK_LABELS[key]}>
                            <input
                                type="url"
                                value={socialFormValues[key] ?? ""}
                                onChange={(event) =>
                                    handleSocialLinkChange(
                                        key,
                                        event.target.value,
                                    )
                                }
                                placeholder={`https://${key}.com/...`}
                                className={inputCls}
                            />
                        </Field>
                    ))}

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={handleCloseSocialLinksModal}
                            disabled={isUpdatingSocialLinks}
                            className="h-11 flex-1 rounded-lg bg-white/10 text-sm font-medium text-white transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            Cancel
                        </button>

                        <button
                            type="button"
                            onClick={handleSocialLinksSubmit}
                            disabled={isUpdatingSocialLinks}
                            className={`h-11 flex-1 rounded-lg text-sm font-medium text-white transition ${
                                isUpdatingSocialLinks
                                    ? "cursor-not-allowed bg-white/20"
                                    : "cursor-pointer bg-[#FF2EC8] hover:bg-[#ff48d0]"
                            }`}
                        >
                            {isUpdatingSocialLinks
                                ? "Updating..."
                                : "Save Changes"}
                        </button>
                    </div>
                </div>
            </AppDialog>
        </section>
    );
}
