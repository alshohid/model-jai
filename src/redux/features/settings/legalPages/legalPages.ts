/* eslint-disable @typescript-eslint/no-explicit-any */

import { baseApi } from "@/redux/api/baseApi";
import type { LegalDocument, LegalDocumentUpdatePayload } from "./types";

const emptyLegalDocument = (fallbackTitle: string): LegalDocument => ({
    title: fallbackTitle,
    content: "",
});

const extractLegalDocument = (
    response: any,
    fallbackTitle: string,
): LegalDocument => {
    const payload = response?.data ?? response;

    if (!payload || typeof payload !== "object") {
        return emptyLegalDocument(fallbackTitle);
    }

    return {
        title:
            typeof payload.title === "string" && payload.title.trim()
                ? payload.title
                : fallbackTitle,
        content: typeof payload.content === "string" ? payload.content : "",
    };
};

export const legalPagesApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAdminPrivacyPolicy: builder.query<LegalDocument, void>({
            query: () => ({
                url: "/admin/privacy-policy",
                method: "GET",
            }),
            providesTags: ["PrivacyPolicy"],
            transformResponse: (response: any) =>
                extractLegalDocument(response, "Privacy Policy"),
        }),

        updateAdminPrivacyPolicy: builder.mutation<
            any,
            LegalDocumentUpdatePayload
        >({
            query: (body) => ({
                url: "/admin/privacy-policy",
                method: "PUT",
                body,
            }),
            invalidatesTags: ["PrivacyPolicy"],
        }),

        getPublicPrivacyPolicy: builder.query<LegalDocument, void>({
            query: () => ({
                url: "/privacy-policy",
                method: "GET",
            }),
            providesTags: ["PrivacyPolicy"],
            transformResponse: (response: any) =>
                extractLegalDocument(response, "Privacy Policy"),
        }),

        getAdminTermsAndConditions: builder.query<LegalDocument, void>({
            query: () => ({
                url: "/admin/terms-and-conditions",
                method: "GET",
            }),
            providesTags: ["TermsAndConditions"],
            transformResponse: (response: any) =>
                extractLegalDocument(response, "Terms and Conditions"),
        }),

        updateAdminTermsAndConditions: builder.mutation<
            any,
            LegalDocumentUpdatePayload
        >({
            query: (body) => ({
                url: "/admin/terms-and-conditions",
                method: "PUT",
                body,
            }),
            invalidatesTags: ["TermsAndConditions"],
        }),

        getPublicTermsAndConditions: builder.query<LegalDocument, void>({
            query: () => ({
                url: "/terms-and-conditions",
                method: "GET",
            }),
            providesTags: ["TermsAndConditions"],
            transformResponse: (response: any) =>
                extractLegalDocument(response, "Terms and Conditions"),
        }),
    }),
});

export const {
    useGetAdminPrivacyPolicyQuery,
    useUpdateAdminPrivacyPolicyMutation,
    useGetPublicPrivacyPolicyQuery,
    useGetAdminTermsAndConditionsQuery,
    useUpdateAdminTermsAndConditionsMutation,
    useGetPublicTermsAndConditionsQuery,
} = legalPagesApi;
