"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { cn } from "@/shared/lib/utils/cn";
import "react-quill-new/dist/quill.snow.css";
import "./rich-text-editor.css";

const ReactQuill = dynamic(() => import("react-quill-new"), {
    ssr: false,
    loading: () => (
        <div className="flex h-70 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-sm text-white/40">
            Loading editor...
        </div>
    ),
});

type Props = {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
};

export default function RichTextEditor({
    value,
    onChange,
    placeholder = "Write page content...",
    className,
}: Props) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const modules = useMemo(
        () => ({
            toolbar: [
                [{ header: [1, 2, 3, false] }],
                ["bold", "italic", "underline", "strike"],
                [{ list: "ordered" }, { list: "bullet" }],
                [{ indent: "-1" }, { indent: "+1" }],
                ["blockquote", "link"],
                ["clean"],
            ],
        }),
        [],
    );

    const formats = useMemo(
        () => [
            "header",
            "bold",
            "italic",
            "underline",
            "strike",
            "list",
            "blockquote",
            "link",
            "indent",
        ],
        [],
    );

    return (
        <div
            className={cn(
                "rich-text-editor overflow-hidden rounded-lg border border-white/10 bg-white/5",
                "focus-within:border-[#FF2EC8]/60",
                className,
            )}
        >
            {mounted ? (
                <ReactQuill
                    theme="snow"
                    value={value}
                    onChange={onChange}
                    modules={modules}
                    formats={formats}
                    placeholder={placeholder}
                />
            ) : (
                <div className="flex h-70 items-center justify-center text-sm text-white/40">
                    Loading editor...
                </div>
            )}
        </div>
    );
}
