"use client";

import Image from "next/image";
import Link from "next/link";

export type HeaderContent = {
    logoUrl?: string | null;
    logoAlt?: string | null;
    phone?: string | number | null;
    primaryCtaLabel?: string | null;
};

type Props = {
    content?: HeaderContent | null;
};

export const defaultHeaderContent: Required<HeaderContent> = {
    logoUrl: "/SA-WHILL-logo-white%201.svg",
    logoAlt: "Scootaround powered by WHILL",
    phone: "888-610-6372",
    primaryCtaLabel: "Get a Quote"
};

function formatPhone(value: string | number | null | undefined): string {
    const fallback = typeof defaultHeaderContent.phone === "string" ? defaultHeaderContent.phone : "";
    if (!value) return fallback;
    const digits = String(value).replace(/\D/g, "");
    if (!digits) return fallback;

    if (digits.length === 11 && digits.startsWith("1")) {
        const core = digits.slice(1);
        return `1-${core.slice(0, 3)}-${core.slice(3, 6)}-${core.slice(6, 10)}`;
    }

    if (digits.length >= 10) {
        return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
    }

    if (digits.length === 9) {
        return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
    }

    if (digits.length >= 7) {
        return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
    }

    return fallback || String(value);
}

const defaultNavLinks = [
    { label: "Rentals", href: "#" },
    { label: "Business", href: "#" },
    { label: "Support", href: "#" },
    { label: "Company", href: "#" }
];

export default function Header({ content }: Props) {
    const merged = { ...defaultHeaderContent, ...(content ?? {}) };

    const phoneDisplay = formatPhone(merged.phone);
    const phoneHref = phoneDisplay.replace(/[^\d+]/g, "");

    return (
        <header className="relative z-30 bg-white shadow-[0_18px_32px_rgba(14,41,74,0.12)]">
            <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-6 px-4 py-4 sm:px-6 lg:px-10">
                <div className="flex flex-1 items-center gap-6">
                    <Link href="#" aria-label={merged.logoAlt} className="flex items-center">
                        <Image
                            src={merged.logoUrl ?? defaultHeaderContent.logoUrl}
                            alt={merged.logoAlt ?? defaultHeaderContent.logoAlt}
                            width={165}
                            height={32}
                            priority
                            className="h-8 w-auto"
                        />
                    </Link>
                    <a
                        href={`tel:${phoneHref}`}
                        className="hidden items-center text-[1.125rem] font-semibold tracking-tight text-[#0a6ab7] md:inline-flex"
                    >
                        {phoneDisplay}
                    </a>
                </div>

                <nav className="hidden items-center gap-3 text-sm font-semibold text-[#1b2a44] lg:flex">
                    <Link
                        href="#"
                        className="btn-primary h-11 px-6 text-sm font-semibold tracking-tight text-white shadow-[0_14px_26px_rgba(0,101,165,0.28)]"
                    >
                        {merged.primaryCtaLabel ?? defaultHeaderContent.primaryCtaLabel}
                    </Link>
                    {defaultNavLinks.map((link) => (
                        <Link
                            key={link.label}
                            href={link.href}
                            className="group relative px-4 py-2 transition-colors duration-200 hover:text-[#0070ba]"
                        >
                            {link.label}
                            <span className="pointer-events-none absolute inset-x-3 bottom-1.5 h-0.5 origin-center scale-x-0 rounded-full bg-[#1ba1f2] transition-transform duration-200 ease-out group-hover:scale-x-100" />
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center gap-4 text-[#1b2a44]">
                    <button
                        type="button"
                        className="hidden h-11 w-11 items-center justify-center text-inherit transition-transform hover:scale-[1.05] hover:text-[#0070ba] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1ba1f2] lg:flex"
                        aria-label="Search"
                    >
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M11 4C14.3137 4 17 6.68629 17 10C17 11.5206 16.4462 12.9081 15.5303 13.9697L19.5303 17.9697C19.8232 18.2626 19.8232 18.7374 19.5303 19.0303C19.2641 19.2965 18.8474 19.3203 18.5538 19.1018L18.4697 19.0303L14.4697 15.0303C13.4081 15.9462 12.0206 16.5 10.5 16.5C7.18629 16.5 4.5 13.8137 4.5 10.5C4.5 7.18629 7.18629 4.5 10.5 4.5C10.6719 4.5 10.8422 4.50816 11.0105 4.52351L11 4Z"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>
                    <button
                        type="button"
                        className="flex h-11 w-11 items-center justify-center rounded-full bg-[#e7f3ff] text-[#0a6ab7] transition-transform hover:scale-[1.05] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1ba1f2]"
                        aria-label="User account"
                    >
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5" />
                            <path
                                d="M5.5 19.5C5.5 16.4624 8.01472 14 11.25 14H12.75C15.9853 14 18.5 16.4624 18.5 19.5"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                            />
                        </svg>
                    </button>
                    <button
                        type="button"
                        className="relative flex h-11 w-11 items-center justify-center rounded-full border border-[#d9e3f1] transition-all hover:border-[#0070ba] hover:text-[#0070ba] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1ba1f2]"
                        aria-label="Shopping cart"
                    >
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M6 6H7.5L9.5 16.5H16.5L18 9H10"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <circle cx="17" cy="18.5" r="1" fill="currentColor" />
                            <circle cx="11" cy="18.5" r="1" fill="currentColor" />
                        </svg>
                        <span className="absolute -right-1 -top-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-[#0075b8] px-1 text-xs font-semibold text-white">
                            2
                        </span>
                    </button>
                    <button
                        type="button"
                        className="flex h-11 w-11 items-center justify-center rounded-full border border-[#d9e3f1] text-inherit transition-all hover:border-[#0070ba] hover:text-[#0070ba] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1ba1f2] lg:hidden"
                        aria-label="Open menu"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 7H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                            <path d="M4 12H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                            <path d="M4 17H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                    </button>
                </div>
            </div>
        </header>
    );
}
