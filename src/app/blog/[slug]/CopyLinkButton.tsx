"use client";

import { useMemo, useState } from "react";

type CopyLinkButtonProps = {
    href: string;
};

export default function CopyLinkButton({ href }: CopyLinkButtonProps) {
    const [copied, setCopied] = useState(false);
    const absoluteUrl = useMemo(() => {
        if (typeof window === "undefined") return href;
        try {
            return new URL(href, window.location.origin).toString();
        } catch {
            return href;
        }
    }, [href]);

    async function handleCopy() {
        try {
            await navigator.clipboard.writeText(absoluteUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy link", err);
        }
    }

    return (
        <button
            type="button"
            onClick={handleCopy}
            className="group inline-flex items-center gap-2 cursor-pointer text-sm font-medium text-white/70 transition-colors hover:text-white"
        >
            <svg
                aria-hidden="true"
                className="h-4 w-4 stroke-current transition-transform group-hover:scale-110"
                fill="none"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
            >
                <path d="M10 13a5 5 0 0 1 7.54-.54l2 2a5 5 0 0 1-7.07 7.07l-1.76-1.76" />
                <path d="M14 11a5 5 0 0 1-7.54.54l-2-2a5 5 0 0 1 7.07-7.07l1.75 1.75" />
            </svg>
            {copied ? "Copied" : "Copy link"}
        </button>
    );
}

