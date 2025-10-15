"use client";

import Image from "next/image";
import { useState } from "react";

type Props = {
    content: HeroContent;
};

export type HeroContent = {
    title: string;
};

const tabs = [
    {
        label: "Cruise Rental",
        shortLabel: "Cruise",
        icon: "/cruise_rental-icon.svg"
    },
    {
        label: "Hotel/Residential Delivery",
        shortLabel: "Hotel",
        icon: "/hotel-icon.svg"
    },
    {
        label: "Event Rental",
        shortLabel: "Event",
        icon: "/event_rental-icon.svg"
    }
];

const formFields = [
    {
        label: "Departure Port",
        placeholder: "Departure port or cruise ship",
        icon: "/location.svg"
    },
    {
        label: "Rental Dates",
        placeholder: "Select rental dates",
        icon: "/calendar.svg"
    }
];

export default function HeroSection({ content }: Props) {
    const { title } = content;
    const [activeTab, setActiveTab] = useState(0);

    return (
        <section className="relative flex flex-1 flex-col overflow-hidden bg-[#04030f]">
            <div className="hero-image absolute inset-0" aria-hidden="true" />
            <div className="absolute inset-0 gradient-bg" aria-hidden="true" />

            <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 pb-16 pt-12 text-white sm:px-6 lg:px-10 lg:pb-20 lg:pt-18">
                <div className="text-center lg:text-left">
                    <h1 className="text-3xl font-semibold leading-tight sm:text-4xl lg:text-[2.75rem]">
                        {title}
                    </h1>
                </div>

                <div className="flex w-full justify-center">
                    <div className="w-full max-w-[900px] overflow-hidden rounded-[32px] border border-white/25 bg-white/95 shadow-[0_28px_60px_rgba(12,37,66,0.3)] backdrop-blur-sm">
                        <form className="flex flex-col gap-6">
                            <div className="px-4 pt-6 sm:px-8">
                                <fieldset className="flex flex-wrap justify-center gap-2 text-sm font-semibold text-[#5c6980] sm:grid sm:grid-cols-3">
                                    <legend className="sr-only">Rental type</legend>
                                    {tabs.map((tab, index) => {
                                        const isActive = index === activeTab;
                                        return (
                                            <button
                                                key={tab.label}
                                                type="button"
                                                onClick={() => setActiveTab(index)}
                                                aria-pressed={isActive}
                                                className={`group relative flex min-w-[110px] flex-1 items-center justify-center gap-2 rounded-full px-3 py-2 sm:px-4 sm:py-3 transition-colors duration-200 ${isActive
                                                    ? "bg-[#eef6ff] text-[#0075b8]"
                                                    : "text-[#6d768a] hover:text-[#0075b8]"
                                                    }`}
                                            >
                                                <span
                                                    className={`flex h-8 w-8 items-center justify-center rounded-full border text-sm ${isActive
                                                        ? "border-[#0075b8]/30 bg-white text-[#0075b8]"
                                                        : "border-transparent bg-[#eef2f7] text-[#8894a9]"
                                                        }`}
                                                >
                                                    <Image
                                                        src={tab.icon}
                                                        alt=""
                                                        width={18}
                                                        height={18}
                                                        className="h-[18px] w-[18px]"
                                                    />
                                                </span>
                                                <span className="whitespace-nowrap text-sm sm:hidden">
                                                    {tab.shortLabel}
                                                </span>
                                                <span className="hidden whitespace-nowrap text-sm sm:block">
                                                    {tab.label}
                                                </span>
                                                {isActive && (
                                                    <span className="pointer-events-none absolute -bottom-[12px] left-1/2 hidden h-[3px] w-2/3 -translate-x-1/2 rounded-full bg-[#0075b8] sm:block" />
                                                )}
                                            </button>
                                        );
                                    })}
                                </fieldset>

                                <div className="mt-4 h-[3px] w-full rounded-full bg-[#dbe5f3] sm:hidden" />
                                <div
                                    className="mt-[-3px] h-[3px] w-full rounded-full bg-[#0075b8] transition-transform duration-200 sm:hidden"
                                    style={{ transform: `translateX(${activeTab * 100}%)`, width: "33.3333%" }}
                                />
                            </div>

                            <div className="flex flex-col gap-6 rounded-t-[28px] bg-[#f3f6fb] px-4 pb-6 pt-[22px] sm:px-8">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    {formFields.map((field) => (
                                        <label
                                            key={field.label}
                                            className="flex flex-col gap-[8px] text-left text-sm font-medium text-[#1c2942]"
                                        >
                                            {field.label}
                                            <div className="flex items-center gap-3 rounded-2xl border border-[#d5deeb] bg-white px-3 py-3 shadow-[0_12px_24px_rgba(10,35,66,0.06)] sm:px-4 sm:py-4">
                                                <span className="flex h-[22px] w-[22px] items-center justify-center text-[#6d768a]">
                                                    <Image src={field.icon} alt="" width={22} height={22} />
                                                </span>
                                                <input
                                                    className="flex-1 bg-transparent text-base text-[#0a1c33] outline-none placeholder:text-[#8a99af]"
                                                    placeholder={field.placeholder}
                                                />
                                            </div>
                                        </label>
                                    ))}
                                </div>

                                <label className="flex items-center gap-3 text-left text-sm font-medium text-[#1c2942]">
                                    <input type="checkbox" className="form-checkbox h-5 w-5 rounded border border-[#94a7bf]/60" />
                                    Return to different location
                                </label>

                                <button
                                    type="submit"
                                    className="btn-primary mt-2 h-14 w-full text-lg shadow-[0_16px_40px_rgba(0,101,165,0.28)] focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-[#1ba1f2]"
                                >
                                    Get a Quote
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <div className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-[220px] bg-gradient-to-t from-[#04030f] to-transparent lg:block" />
            <div className="pointer-events-none absolute left-1/2 top-1/2 hidden h-[460px] w-[460px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0b63a7]/20 blur-[140px] lg:block" />
        </section>
    );
}
