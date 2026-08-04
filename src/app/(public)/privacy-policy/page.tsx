"use client";

import { useGetPublicPrivacyPolicyQuery } from "@/redux/features/settings/legalPages/legalPages";
import LegalPublicPage from "@/shared/components/legal/LegalPublicPage";

export default function PrivacyPolicyPage() {
    const { data, isLoading, isError, refetch } =
        useGetPublicPrivacyPolicyQuery();

    return (
        <LegalPublicPage
            document={data}
            isLoading={isLoading}
            isError={isError}
            fallbackTitle="Privacy Policy"
            onRetry={refetch}
        />
    );
}
