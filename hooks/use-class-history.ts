"use client";

import { useCallback, useEffect, useState } from "react";

import { Report } from "../src/domain/attendance";

type ClassHistoryResponse = {
    items: Report[];
    nextCursor: string | null;
    hasMore: boolean;
};

type UseClassHistoryResult = {
    items: Report[];
    isLoading: boolean;
    isLoadingMore: boolean;
    error: Error | null;
    hasMore: boolean;
    loadMore: () => Promise<void>;
};

export function useClassHistory(
    classNo: string,
): UseClassHistoryResult {
    const [items, setItems] = useState<Report[]>([]);
    const [nextCursor, setNextCursor] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState(true);

    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    
    const fetchHistory = useCallback(
        async (before?: string) => {
            const params = new URLSearchParams();

            if (before) {
                params.set("before", before);
            }

            const query = params.toString();

            const response = await fetch(
                `/api/classes/${classNo}/history${
                    query ? `?${query}` : ""
                }`,
            );

            if (!response.ok) {
                throw new Error(
                    "Failed to fetch class history",
                );
            }

            const result = await response.json();

            return result.data as ClassHistoryResponse;
        },
        [classNo],
    );

    useEffect(() => {
        let cancelled = false;

        async function loadInitial() {
            setIsLoading(true);
            setError(null);
            setItems([]);
            setNextCursor(null);
            setHasMore(true);

            try {
                const data = await fetchHistory();
                console.log("history response", data);

                if (cancelled) {
                    return;
                }

                setItems(data.items);
                setNextCursor(data.nextCursor);
                setHasMore(data.hasMore);
            } catch (error) {
                if (cancelled) {
                    return;
                }

                setError(
                    error instanceof Error
                        ? error
                        : new Error(
                              "Failed to fetch class history",
                          ),
                );
            } finally {
                if (!cancelled) {
                    setIsLoading(false);
                }
            }
        }

        void loadInitial();
        

        return () => {
            cancelled = true;
        };
    }, [fetchHistory]);

    const loadMore = useCallback(async () => {
        if (
            isLoading ||
            isLoadingMore ||
            !hasMore
        ) {
            return;
        }

        setIsLoadingMore(true);
        setError(null);

        try {
            const data = await fetchHistory(nextCursor ?? undefined);

            setItems((current) => [
                ...current,
                ...data.items,
            ]);

            setNextCursor(data.nextCursor);
            setHasMore(data.hasMore);
        } catch (error) {
            setError(
                error instanceof Error
                    ? error
                    : new Error(
                          "Failed to fetch class history",
                      ),
            );
        } finally {
            setIsLoadingMore(false);
        }
    }, [
        fetchHistory,
        hasMore,
        isLoading,
        isLoadingMore,
        nextCursor,
    ]);



    return {
        items,
        isLoading,
        isLoadingMore,
        error,
        hasMore,
        loadMore,
    };
}