"use client";

import { useState } from "react";
import { AlertTriangle, Eye, FileText, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import RichTextEditor from "@/shared/components/editor/RichTextEditor";
import { Field, inputCls } from "../match/matchFormShared";
import type { LegalDocument } from "@/redux/features/settings/legalPages/types";
import "@/shared/components/legal/legal-public-page.css";

type Props = {
    pageTitle: string;
    pageDescription: string;
    defaultDocumentTitle: string;
    data?: LegalDocument;
    isLoading: boolean;
    isError: boolean;
    isSaving: boolean;
    onRetry: () => void;
    onSave: (payload: { title: string; content: string }) => Promise<void>;
};

const isContentEmpty = (html: string) => {
    const text = html
        .replace(/<[^>]*>/g, "")
        .replace(/&nbsp;/g, " ")
        .trim();
    return text.length === 0;
};

type FormProps = {
    pageTitle: string;
    pageDescription: string;
    defaultDocumentTitle: string;
    initialTitle: string;
    initialContent: string;
    isSaving: boolean;
    onSave: (payload: { title: string; content: string }) => Promise<void>;
};

function LegalDocumentForm({
    pageTitle,
    pageDescription,
    defaultDocumentTitle,
    initialTitle,
    initialContent,
    isSaving,
    onSave,
}: FormProps) {
    const [title, setTitle] = useState(initialTitle);
    const [content, setContent] = useState(initialContent);

    const previewTitle = title.trim() || defaultDocumentTitle;
    const hasPreviewContent = !isContentEmpty(content);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!title.trim()) {
            toast.error("Title is required");
            return;
        }

        if (isContentEmpty(content)) {
            toast.error("Content is required");
            return;
        }

        try {
            await onSave({
                title: title.trim(),
                content,
            });
            toast.success(`${pageTitle} updated successfully`);
        } catch (error: unknown) {
            const err = error as { data?: { message?: string }; message?: string };
            toast.error(
                err?.data?.message ||
                    err?.message ||
                    `Failed to update ${pageTitle.toLowerCase()}`,
            );
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col gap-4 border-b border-white/10 pb-6 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-[#FF2EC8]" />
                        <h1 className="text-2xl font-bold tracking-tight text-white">
                            {pageTitle}
                        </h1>
                    </div>
                    <p className="text-sm text-white/60">{pageDescription}</p>
                </div>

                <Button
                    type="submit"
                    disabled={isSaving}
                    className="cursor-pointer bg-[#FF2EC8] px-6 text-white hover:bg-[#ff48d0] disabled:cursor-not-allowed disabled:opacity-60"
                >
                    <Save className="mr-1.5 h-4 w-4" />
                    {isSaving ? "Saving..." : "Save Changes"}
                </Button>
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                {/* Editor */}
                <div className="space-y-5">
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-white/45">
                        Content Editor
                    </p>

                    <Field label="Title" required>
                        <input
                            value={title}
                            onChange={(event) => setTitle(event.target.value)}
                            placeholder={`Enter ${defaultDocumentTitle.toLowerCase()} title`}
                            className={inputCls}
                        />
                    </Field>

                    <Field label="Page Content" required>
                        <RichTextEditor
                            key={`${initialTitle}:${initialContent.length}`}
                            value={content}
                            onChange={setContent}
                            placeholder="Write the full page content..."
                        />
                    </Field>
                </div>

                {/* Live preview */}
                <div className="space-y-3 xl:sticky xl:top-4 xl:self-start">
                    <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4 text-[#FF2EC8]" />
                        <p className="text-[11px] font-semibold uppercase tracking-widest text-white/45">
                            Page Preview
                        </p>
                    </div>

                    <div className="flex h-[min(70vh,760px)] flex-col overflow-hidden rounded-[18px] border border-white/10 bg-black shadow-[0_18px_60px_rgba(0,0,0,0.45)]">
                        <div className="shrink-0 border-b border-white/10 bg-white/5 px-4 py-2.5">
                            <p className="truncate text-xs text-white/45">
                                Public page appearance
                            </p>
                        </div>

                        <div
                            data-lenis-prevent
                            data-lenis-prevent-wheel
                            className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain p-4 sm:p-5 [-webkit-overflow-scrolling:touch]"
                        >
                            <h2 className="mb-3 break-words text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                                {previewTitle}
                            </h2>

                            <div className="overflow-hidden rounded-[18px] border border-white/10 bg-[#161616]/80 px-4 py-4 sm:px-5 sm:py-5">
                                {hasPreviewContent ? (
                                    <div
                                        className="legal-content"
                                        dangerouslySetInnerHTML={{ __html: content }}
                                    />
                                ) : (
                                    <p className="text-sm text-white/45">
                                        Start writing on the left to preview how this
                                        page will look for users.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}

export default function LegalDocumentSettings({
    pageTitle,
    pageDescription,
    defaultDocumentTitle,
    data,
    isLoading,
    isError,
    isSaving,
    onRetry,
    onSave,
}: Props) {
    if (isLoading) {
        return (
            <div className="space-y-6 animate-pulse">
                <div className="space-y-2 border-b border-white/10 pb-6">
                    <div className="h-7 w-56 rounded bg-white/10" />
                    <div className="h-4 w-96 max-w-full rounded bg-white/5" />
                </div>
                <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                    <div className="h-96 rounded-lg bg-white/5" />
                    <div className="h-96 rounded-lg bg-white/5" />
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center space-y-4 rounded-2xl border border-white/10 bg-white/2 px-4 py-16 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-red-500/20 bg-red-500/10 text-red-400">
                    <AlertTriangle className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                    <h3 className="text-lg font-semibold text-white">
                        Failed to Load {pageTitle}
                    </h3>
                    <p className="max-w-md text-sm text-white/50">
                        There was an error retrieving this document. Please try
                        again.
                    </p>
                </div>
                <Button
                    onClick={onRetry}
                    className="cursor-pointer bg-[#FF2EC8] text-white hover:bg-[#ff48d0]"
                >
                    Retry Loading
                </Button>
            </div>
        );
    }

    const initialTitle = data?.title?.trim() || defaultDocumentTitle;
    const initialContent = data?.content || "";

    return (
        <LegalDocumentForm
            key={`${initialTitle}:${initialContent}`}
            pageTitle={pageTitle}
            pageDescription={pageDescription}
            defaultDocumentTitle={defaultDocumentTitle}
            initialTitle={initialTitle}
            initialContent={initialContent}
            isSaving={isSaving}
            onSave={onSave}
        />
    );
}
