"use server";


import { createContainer } from '@/src/container';

import { ReportSubmissionError } from '@/src/domain/attendance';


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
        const container = await createContainer();

        await container.reportService.submitReport(payload);

        return {
            success: true,
        };
    } catch (error) {
        if (error instanceof ReportSubmissionError) {
            return {
                success: false,
                error: error.code,
            };
        }

        console.error(error);

        return {
            success: false,
            error: "INTERNAL_ERROR",
        };
    }
}