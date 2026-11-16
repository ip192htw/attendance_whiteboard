"use client";

import { useRouter } from "next/navigation";
import React from "react";

type Props = {
    date: string;
};

export function DatePicker({ date }: Props) {
    const router = useRouter();

    function handleDateChange(
        e: React.ChangeEvent<HTMLInputElement>
    ) {
        const selectedDate = e.target.value;

        if (!selectedDate) return;

        router.push(`/manage/${selectedDate}`);
    }

    return (
        <input
            type="date"
            value={date}
            onChange={handleDateChange}
            className="
                w-full
                bg-surface-container-low
                text-on-surface
                border border-outline-variant
                rounded-lg
                px-4 py-3
                outline-none
                hover:border-outline
                focus:ring-2
                focus:ring-primary/20
                cursor-pointer
            "
        />
    );
}