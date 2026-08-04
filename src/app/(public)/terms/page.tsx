"use client";

import { useGetPublicTermsAndConditionsQuery } from "@/redux/features/settings/legalPages/legalPages";
import LegalPublicPage from "@/shared/components/legal/LegalPublicPage";

export default function TermsAndConditionsPage() {
    const { data, isLoading, isError, refetch } =
        useGetPublicTermsAndConditionsQuery();

    return (
        <LegalPublicPage
            document={data}
            isLoading={isLoading}
            isError={isError}
            fallbackTitle="Terms and Conditions"
            onRetry={refetch}
        />
    );
}
