"use client";
import { useQuery } from "@tanstack/react-query";
import { getReportsByDate } from "@/app/actions";
import { AppTime } from "@/shared/time";


interface Props {
    date: string;
    initialData: NonNullable<
        Awaited<ReturnType<typeof getReportsByDate>>["data"]
    >;
    intervalMs?: number;
}

export function useReportsByDate({
    date,
    initialData,
    intervalMs = 30_000,
}: Props) {
    const isToday = date === AppTime.date();

    return useQuery({
        queryKey: ["reports", "by-date", date],

        queryFn: async () => {
            const result = await getReportsByDate(new Date(date));

            if (result.error) {
                throw result.error;
            }

            if (!result.data) {
                throw new Error("Failed to fetch reports");
            }

            return result.data;
        },

        initialData,

        // 只有今天才定時刷新
        refetchInterval: isToday ? intervalMs : false,

        refetchOnWindowFocus: isToday,
        refetchIntervalInBackground: false,
    });
}