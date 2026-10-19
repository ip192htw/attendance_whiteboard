"use server";


import { createContainer } from '@/src/container';
import { requireUser } from '@/src/dal/auth';
import { ReportItem, Report } from '@/src/domain/attendance';

import { AppTime } from '@/shared/time';


import { ReportSubmissionError, UnauthorizedError, ForbiddenError } from "@/src/application/errors";

export type ReportsResponse =
    | {
        data: ReportItem[];
        error: null;
      }
    | {
        data: null;
        error: string;
      };

export type ReportResponse =
    | {
        data: Report | null;
        error: null;
      }
    | {
        data: null;
        error: string;
      };


export async function getLeastReportByClass(
    classNo: string,
    now: Date = AppTime.now()
): Promise<ReportResponse> {
    try {
        await requireUser();
        const container = await createContainer();
        const data = await container.reportService.getLeastReportByClass(
            classNo,
            now
        );
        
        return {
            data,
            error: null,
        };
        
    } catch (error) {
        if (error instanceof UnauthorizedError) {
            return {
                data: null,
                error: "UNAUTHORIZED",
            };
        }

        if (error instanceof ForbiddenError) {
            return {
                data: null,
                error: "FORBIDDEN",
            };
        }

        throw error;
    }
}

export async function getReportsByDate(
    date: Date = AppTime.now()
): Promise<ReportsResponse> {
    try {
        await requireUser();
        const container = await createContainer();
        const data = await container.reportService.getReportsByDate(date);
        return {
            data,
            error: null,
        };
    } catch (error) {
        if (error instanceof UnauthorizedError) {
            return {
                data: null,
                error: "UNAUTHORIZED",
            };
        }

        if (error instanceof ForbiddenError) {
            return {
                data: null,
                error: "FORBIDDEN",
            };
        }

        throw error;
    }
}




export type SubmitReportState =
    | {
        success: true;
      }
    | {
        success: false;
        error?: string;
      };


export async function submitReport(
    payload: Record<string, number[]>
): Promise<SubmitReportState> {


    try {

        await requireUser();
        const container = await createContainer();

        await container.reportService.submitReport(payload);

        return {
            success: true,
        };
    } catch (error) {
        if (error instanceof UnauthorizedError) {
            return {
                success: false,
                error: "UNAUTHORIZED",
            };
        }

        if (error instanceof ForbiddenError) {
            return {
                success: false,
                error: "FORBIDDEN",
            };
        }

        if (error instanceof ReportSubmissionError) {
            return {
                success: false,
                error: error.code,
            };
        }

        // V15: do not log full error objects (may contain PII / payload).
        console.error("submitReport failed:", error instanceof Error ? error.name : "unknown");

        return {
            success: false,
            error: "INTERNAL_ERROR",
        };
    }
}
